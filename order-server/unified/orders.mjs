const enc=new TextEncoder();
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
export async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);return Array.from(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},key,256)),x=>x.toString(16).padStart(2,'0')).join('');}
function fail(status,msg){throw Object.assign(new Error(msg),{status});}
function clean(s,max=200){return String(s||'').trim().slice(0,max);}
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function publicOrder(r){const {claim_hash,submission_key,search_text,...o}=r;return {...o,payload:JSON.parse(o.payload),payment_verified:!!o.payment_verified,invoice_approved:!!o.invoice_approved};}
function compactOrder(row){
  const r=publicOrder(row),c=r.payload.customer||{},o=r.payload.order||{};
  r.payload={customer:{name:c.name,mobile:c.mobile,city:c.city,pincode:c.pincode},
    order:{paymentMode:o.paymentMode,items:(o.items||[]).map(i=>({name:i.name||i.product,variant:i.variant,quantity:i.quantity,unitPrice:i.unitPrice,lineTotal:i.lineTotal})),
      grandTotal:o.grandTotal,advanceAmount:o.advanceAmount,restAmount:o.restAmount}};
  return r;
}

export function canDownload(role,r){return role==='admin'||(r.status!=='deleted'&&r.payment_verified===1&&r.invoice_approved===1);}
async function rate(env,req,kind,max){const minute=Math.floor(Date.now()/60000),key=await sha((req.headers.get('X-GP-Client-IP')||req.headers.get('CF-Connecting-IP')||'local')+':'+kind+':'+minute);const row=await env.DB.prepare('INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,Date.now()+120000).first();if(row.count>max)fail(429,'Too many requests. Please try again later.');}
async function auth(req,env){const owner=(req.headers.get('oai-authenticated-user-email')||'').toLowerCase();if(env.OWNER_EMAIL&&owner===env.OWNER_EMAIL.toLowerCase())return {account_id:'owner',role:'admin'};const t=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');if(!t)fail(401,'Please login');const s=await env.DB.prepare('SELECT * FROM sessions WHERE token_hash=? AND expires_at>?').bind(await sha(t),Date.now()).first();if(!s)fail(401,'Session expired. Please login');return s;}
async function session(env,id,role){const t=token();await env.DB.prepare('INSERT INTO sessions VALUES(?,?,?,?)').bind(await sha(t),id,role,Date.now()+8*3600000).run();return {token:t,role};}
async function body(req){const raw=await req.text();if(enc.encode(raw).length>180000)fail(413,'Order too large');try{return JSON.parse(raw)}catch(_){fail(400,'Invalid JSON');}}
function searchText(o){return JSON.stringify(o).toLowerCase();}
// Repeat-order policy: only a verified private receipt can merge orders.
// Never expose or merge someone else's orders based solely on a matching telephone number.
const normalizeMobile=v=>String(v||'').replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'').replace(/^0(?=\d{10}$)/,'');
const moneyValue=v=>Number.isFinite(Number(v))?Number(v):0;
const itemFingerprint=i=>[clean(i.name||i.product,240).toLowerCase(),clean(i.variant,120).toLowerCase(),clean(i.pack,120).toLowerCase(),moneyValue(i.unitPrice).toFixed(2)].join('|');
function combineProducts(previous,incoming){
  const items=(previous||[]).map(x=>({...x})),keys=new Set(items.map(itemFingerprint));let added=0;
  for(const item of incoming||[]){
    const fingerprint=itemFingerprint(item);
    if(keys.has(fingerprint))continue; // Repeated checkout is not an extra quantity.
    const quantity=Math.max(1,Number(item.quantity)||1),unitPrice=moneyValue(item.unitPrice);
    items.push({...item,quantity,unitPrice,lineTotal:Math.round((Number.isFinite(Number(item.lineTotal))?Number(item.lineTotal):quantity*unitPrice)*100)/100});
    keys.add(fingerprint);added++;
  }
  return {items,added};
}
function canCustomerChange(row){
  const age=Date.now()-Date.parse(row.created_at);
  return age>=0&&age<=72*3600000&&['pending','successful'].includes(row.status)&&
    !row.dispatch_date&&!row.tracking_number&&!(row.printed_revision>=row.revision&&row.printed_revision>0);
}
function repriceOrder(original,items){
  const productTotal=items.reduce((n,i)=>n+moneyValue(i.lineTotal),0);
  const courierCharge=moneyValue(original.courierCharge),discountApplied=moneyValue(original.discountApplied);
  const productGst=original.gstInvoiceIncluded?Math.ceil((productTotal+courierCharge)*.18):0;
  const subtotal=Math.max(0,productTotal+courierCharge-discountApplied)+productGst;
  const vasCharge=original.vasApplies?Math.ceil(subtotal*.02):moneyValue(original.vasCharge);
  const grandTotal=Math.max(0,Math.round((subtotal+vasCharge)*100)/100);
  return {...original,items,productTotal,totalQuantity:items.reduce((n,i)=>n+moneyValue(i.quantity),0),productGst,
    vasCharge,grandTotal,restAmount:Math.max(0,Math.round((grandTotal-moneyValue(original.advanceAmount))*100)/100),
    shippingRequoteNeeded:true,mergeReviewNeeded:true,lastAdditionAt:new Date().toISOString()};
}
function combineOrder(existing,incoming){
  const merged=combineProducts(existing.items,incoming.items);if(!merged.added)return null;
  const productTotal=merged.items.reduce((n,i)=>n+moneyValue(i.lineTotal),0);
  const courierCharge=Math.max(moneyValue(existing.courierCharge),moneyValue(incoming.courierCharge));
  const gstInvoiceIncluded=!!(existing.gstInvoiceIncluded||incoming.gstInvoiceIncluded);
  const productGst=gstInvoiceIncluded?Math.ceil((productTotal+courierCharge)*.18):0;
  const discountApplied=moneyValue(existing.discountApplied);
  const vasApplies=!!(existing.vasApplies||incoming.vasApplies);
  const beforeVas=Math.max(0,productTotal+courierCharge-discountApplied)+productGst;
  const vasCharge=vasApplies?Math.ceil(beforeVas*.02):0;
  const grandTotal=Math.ceil((beforeVas+vasCharge)*100)/100;
  // advanceAmount is a declared amount, NOT independent proof of money received.
  const advanceAmount=moneyValue(existing.advanceAmount);
  return {...existing,items:merged.items,productTotal,totalQuantity:merged.items.reduce((n,i)=>n+moneyValue(i.quantity),0),
    courierCharge,productGst,vasApplies,vasCharge,discountApplied,grandTotal,advanceAmount,
    restAmount:Math.max(0,grandTotal-advanceAmount),shippingRequoteNeeded:true,
    mergeReviewNeeded:true,lastAdditionAt:new Date().toISOString(),paymentMode:existing.paymentMode||incoming.paymentMode};
}

function printableImage(item,source){
 const raw=String(item.image||item.imageUrl||item.thumbnail||item.photo||(Array.isArray(item.images)?item.images[0]:'')||'').trim();
 if(!raw)return '';
 try{const repo=String(source||'arcade-accessories-').replace(/[^a-z0-9_-]/gi,'');
   const url=new URL(raw,'https://gamesplanet13.github.io/'+repo+'/');
   return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return ''}
}
function invoice(r,summary=false){
 const p=JSON.parse(r.payload),o=p.order||{},c=p.customer||{},gst=!!o.gstInvoiceIncluded;
 const amount=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:2});
 const items=Array.isArray(o.items)?o.items:[];
 const itemRows=items.map((i,index)=>{
  const img=printableImage(i,r.source);
  const photo=img?'<img src="'+escape(img)+'" alt="Product photo" loading="lazy" style="height:55px;width:55px;object-fit:contain">':'—';
  const dimensions=Array.isArray(i.dimensions)?i.dimensions.join(' × '):String(i.dimensions||'');
  const rate=Number(i.unitPrice)||0,qty=Number(i.quantity)||0;
  const total=Number.isFinite(Number(i.lineTotal))?Number(i.lineTotal):qty*rate;
  return '<tr><td>'+(index+1)+'</td><td>'+photo+'</td><td><b>'+escape([i.name||i.product,i.variant].filter(Boolean).join(' — '))+'</b>'+
  '<small>Unit weight: '+escape(i.unitWeight??'—')+'g'+(dimensions?' · Dimensions: '+escape(dimensions):'')+'</small>'+
  '</td><td>'+qty+'</td><td>'+amount(rate)+'</td><td>'+amount(total)+'</td></tr>';
 }).join('');
 const detail=(title,value)=>'<tr><td colspan="4">'+title+'</td><td colspan="2">'+value+'</td></tr>';
 const subtotal=Number.isFinite(Number(o.productTotal))?Number(o.productTotal):items.reduce((n,i)=>n+Number(i.lineTotal||0),0);
 const mode=String(o.paymentMode||'unknown').toUpperCase();
 const shipped=['dispatched','delivered'].includes(r.status);
 const carrier=shipped?'<p><b>Dispatch:</b> '+escape(r.dispatch_by==='bus'?'Bus transport':'Courier')+' — '+escape(r.courier||'')+
   ' · <b>Dispatch date:</b> '+escape(r.dispatch_date||'—')+'<br><b>AWB / Bus reference:</b> '+escape(r.tracking_number||'Not recorded')+
   (r.tracking_url&&/^https:\/\//.test(r.tracking_url)?'<br><b>Tracking URL:</b> '+escape(r.tracking_url):'')+'</p>':'';
 return '<!doctype html><html><head><meta charset="utf-8"><title>'+escape(r.order_id)+(summary?' Order Summary':' Invoice')+'</title>'+
 '<style>body{font:13px/1.5 system-ui,Arial;max-width:960px;margin:22px auto;color:#193044;padding:0 14px}h1{font-size:23px;margin:8px 0}h2{font-size:17px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #d5e0e8;padding:10px 7px;text-align:left;vertical-align:top}th{background:#ecf4f8}small{display:block;color:#596d7a;margin-top:4px}td:nth-child(4),td:nth-child(5),td:nth-child(6){white-space:nowrap}button{padding:9px 13px;margin-bottom:12px} .total{font-weight:800;background:#e7f4fa}@media print{button{display:none}body{margin:0;max-width:none}tr{break-inside:avoid}}</style></head><body>'+
 '<button onclick="print()">Print / Save as PDF</button><h1>GAMES PLANET — '+(summary?'ORDER SUMMARY':gst?'TAX INVOICE':'BILL — GST not charged')+'</h1>'+
 '<p><b>Order:</b> '+escape(r.order_id)+' · <b>Ordered at:</b> '+escape(r.created_at)+
 ' · <b>Updated:</b> '+escape(r.updated_at)+'<br><b>Status:</b> '+escape(r.status)+
 ' · <b>Payment mode:</b> '+escape(mode)+(gst?'<br><b>Seller GSTIN:</b> 09DIDPS5066Q1ZB':'')+'</p>'+
 '<p><b>Customer:</b> '+escape(c.name)+' · <b>Mobile:</b> '+escape(c.mobile)+
 (c.altMobile?' · '+escape(c.altMobile):'')+'<br><b>Address:</b> '+
 escape([c.house,c.address,c.landmark,c.postoffice,c.city,c.state,c.pincode].filter(Boolean).join(', '))+
 (gst&&c.gstin?'<br><b>Customer GSTIN:</b> '+escape(c.gstin):'')+'</p>'+carrier+
 '<h2>Products / Items Purchased</h2><table><thead><tr><th>#</th><th>Photo</th><th>Product / Variant</th><th>Qty</th><th>Unit Rate</th><th>Line Total</th></tr></thead><tbody>'+itemRows+'</tbody><tfoot>'+
 detail('Total pieces',items.reduce((n,i)=>n+Number(i.quantity||0),0))+
 detail('Products subtotal',amount(subtotal))+
 detail('Discount',amount(o.discountApplied))+
 detail('Courier',amount(o.courierCharge))+
 detail('VAS',amount(o.vasCharge))+
 (gst?detail('GST',amount(o.productGst)):'')+
 '<tr class="total"><td colspan="4">FINAL ORDER TOTAL</td><td colspan="2">'+amount(o.grandTotal)+'</td></tr>'+
 detail('Amount recorded / advance',amount(o.advanceAmount))+
 detail('Payment verification',r.payment_verified?'Confirmed':'Not yet verified')+
 detail('Balance to collect',amount(o.restAmount))+
 '</tfoot></table><p><b>Products weight:</b> '+escape(o.totalWeight??'—')+'g · <b>Packaging:</b> '+escape(o.packingWeight??'—')+
 'g · <b>Packed weight:</b> '+escape(o.packedWeight??'—')+'g · <b>Box:</b> '+
 escape(Array.isArray(o.boxDimensions)?o.boxDimensions.join(' × ')+' cm':'—')+
 ' · <b>Chargeable:</b> '+escape(o.chargeableKg??'—')+'kg</p>'+
 '<small>Amounts represent saved order details. Payment is confirmed only when explicitly marked verified.</small></body></html>';
}
export default {async fetch(req,env){const origin=req.headers.get('Origin'),ownOrigin=new URL(req.url).origin,allowed=origin===ownOrigin?ownOrigin:'https://gamesplanet13.github.io';const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS','Vary':'Origin'};const json=(o,status=200)=>new Response(JSON.stringify(o),{status,headers});try{if(origin&&origin!==allowed)fail(403,'Origin denied');if(req.method==='OPTIONS')return new Response(null,{status:204,headers});const u=new URL(req.url),path=u.pathname;if(path==='/health'){if(!env.DB)return json({ok:false},503);await env.DB.prepare('SELECT COUNT(*) AS n FROM orders').first();return json({ok:true,service:'games-planet-orders',database:true});}if(!env.DB)fail(503,'Database not configured');
if(path==='/orders'&&req.method==='POST'){
  await rate(env,req,'submit',10);
  const b=await body(req);
  if(!/^[a-f0-9]{64}$/.test(b.submissionKey)||!/^[a-f0-9]{64}$/.test(b.claimToken))fail(400,'Invalid submission');
  if(!b.customer?.name||!/^[0-9]{10}$/.test(normalizeMobile(b.customer?.mobile))||!b.order?.items?.length)fail(400,'Incomplete order');
  const hash=await sha(b.claimToken),now=new Date().toISOString();
  const signedIn=req.headers.get('Authorization')?await auth(req,env):null;
  const customerAccount=signedIn?.role==='customer'?signedIn.account_id:null;
  const incoming={customer:b.customer,order:b.order,message:clean(b.message,80000)};
  const existing=await env.DB.prepare('SELECT * FROM orders WHERE submission_key=?').bind(b.submissionKey).first();
  if(existing){
    if(existing.claim_hash!==hash)fail(409,'Submission conflict');
    const updatedPayload=JSON.stringify(incoming);
    const previousPayload=JSON.parse(existing.payload);
    // A repeated submit with only a different WhatsApp message must not reopen an accepted order.
    const meaningfulChange=JSON.stringify({customer:previousPayload.customer,order:previousPayload.order})!==JSON.stringify({customer:incoming.customer,order:incoming.order});
    if(meaningfulChange){
      if(existing.status==='dispatched'||existing.status==='cancelled'||existing.tracking_number||existing.dispatch_date||(existing.printed_revision>=existing.revision&&existing.printed_revision>0))fail(409,'Order is already processed. Contact Games Planet.');
      const result=await env.DB.prepare("UPDATE orders SET payload=?,search_text=?,status='pending',payment_verified=0,invoice_approved=0,revision=revision+1,updated_at=? WHERE id=? AND revision=?").bind(updatedPayload,searchText(incoming),now,existing.id,existing.revision).run();
      if(result.meta.changes!==1)fail(409,'Order updated in another session. Retry.');
    }
    return json({id:existing.id,orderId:existing.order_id,saved:true,updated:meaningfulChange});
  }
  const orderId=clean(b.orderId,150);if(!orderId)fail(400,'Order ID is required');
  if(await env.DB.prepare('SELECT id FROM orders WHERE order_id=?').bind(orderId).first())fail(409,'This Order ID is already saved. Open the existing order instead.');
  if((b.previousOrderId&&b.previousClaimToken)||customerAccount){
    let previous=null;
    if(b.previousOrderId&&b.previousClaimToken)
      previous=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND claim_hash=?').bind(clean(b.previousOrderId,90),await sha(String(b.previousClaimToken))).first();
    if(!previous&&customerAccount){
      const candidates=await env.DB.prepare("SELECT * FROM orders WHERE account_id=? AND status IN ('pending','successful') ORDER BY created_at DESC LIMIT 25").bind(customerAccount).all();
      previous=candidates.results.find(row=>canCustomerChange(row)&&normalizeMobile(JSON.parse(row.payload).customer?.mobile)===normalizeMobile(b.customer.mobile))||null;
    }
    if(previous&&canCustomerChange(previous)){
      const old=JSON.parse(previous.payload);
      if(normalizeMobile(old.customer?.mobile)===normalizeMobile(b.customer.mobile)){
        const merged=combineOrder(old.order,incoming.order);
        if(!merged)return json({id:previous.id,orderId:previous.order_id,saved:true,merged:true,duplicate:true});
        const payload={...old,order:merged,message:(old.message||'')+'\n\nAdditional products requested ('+now+'):\n'+clean(b.message,25000)};
        const saved=await env.DB.prepare("UPDATE orders SET payload=?,search_text=?,status='pending',payment_verified=0,invoice_approved=0,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND status IN ('pending','successful') AND tracking_number='' AND dispatch_date='' AND (printed_revision=0 OR printed_revision<revision)").bind(JSON.stringify(payload),searchText(payload),now,previous.id,previous.revision).run();
        if(saved.meta.changes!==1)fail(409,'Original order changed. Refresh your order and retry.');
        return json({id:previous.id,orderId:previous.order_id,saved:true,merged:true,reopened:true,requiresPaymentVerification:true});
      }
    }
  }
  const id=crypto.randomUUID();
  await env.DB.prepare('INSERT INTO orders(id,submission_key,claim_hash,account_id,source,order_id,created_at,updated_at,payload,search_text) VALUES(?,?,?,?,?,?,?,?,?,?)')
    .bind(id,b.submissionKey,hash,customerAccount,clean(b.source,100),orderId,now,now,JSON.stringify(incoming),searchText(incoming)).run();
  return json({id,orderId,saved:true},201);
}

if(path==='/orders/receipt'&&req.method==='POST'){
  await rate(env,req,'receipt',15);
  const b=await body(req),id=clean(b.orderId,90),claim=String(b.claimToken||'');
  if(!/^[a-z0-9-]{10,90}$/.test(id)||!/^[a-f0-9]{64}$/.test(claim))fail(400,'Invalid private order receipt');
  const row=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND claim_hash=?').bind(id,await sha(claim)).first();
  if(!row)fail(404,'Private order receipt was not found');
  return json({order:publicOrder(row),canEdit:canCustomerChange(row)});
}
if(path==='/orders/receipt-edit'&&req.method==='POST'){
  await rate(env,req,'receipt-edit',10);
  const b=await body(req),id=clean(b.orderId,90),claim=String(b.claimToken||'');
  if(!/^[a-z0-9-]{10,90}$/.test(id)||!/^[a-f0-9]{64}$/.test(claim)||!Number.isInteger(b.expectedRevision)||!Array.isArray(b.quantities))fail(400,'Invalid receipt edit request');
  const row=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND claim_hash=?').bind(id,await sha(claim)).first();
  if(!row)fail(404,'Private order receipt was not found');
  if(!canCustomerChange(row))fail(409,'Order is already dispatched, rejected, printed or older than 72 hours. Contact Games Planet.');
  if(row.revision!==b.expectedRevision)fail(409,'This order changed. Refresh before editing.');
  const original=JSON.parse(row.payload);
  if(b.quantities.length!==original.order.items.length)fail(400,'The item list changed. Reload before saving.');
  const items=original.order.items.map((item,i)=>{
    const quantity=Number(b.quantities[i]);
    if(!Number.isInteger(quantity)||quantity<0||quantity>1000)fail(400,'Invalid product quantity');
    return {...item,quantity,lineTotal:Math.round(quantity*moneyValue(item.unitPrice)*100)/100};
  }).filter(i=>i.quantity>0);
  if(!items.length)fail(400,'At least one product is required. Contact Games Planet to cancel the order.');
  const updated={...original,order:repriceOrder(original.order,items)};
  const now=new Date().toISOString(),stored=JSON.stringify(updated);
  const result=await env.DB.prepare("UPDATE orders SET payload=?,search_text=?,status='pending',payment_verified=0,invoice_approved=0,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND status IN ('pending','successful') AND tracking_number='' AND dispatch_date='' AND (printed_revision=0 OR printed_revision<revision)")
    .bind(stored,searchText(updated),now,row.id,row.revision).run();
  if(result.meta.changes!==1)fail(409,'Order changed during editing. Reload before saving.');
  return json({id:row.id,orderId:row.order_id,saved:true,needsPaymentVerification:true,order:publicOrder({...row,payload:stored,revision:row.revision+1,status:'pending',payment_verified:0,invoice_approved:0})});
}
if(path==='/auth/login'&&req.method==='POST'){await rate(env,req,'login',5);const b=await body(req),name=clean(b.username,80).toLowerCase();if(b.role==='admin'){if(!env.ADMIN_USERNAME||!env.ADMIN_SALT||!env.ADMIN_PASSWORD_HASH)fail(503,'Admin login not configured');if(name!==env.ADMIN_USERNAME.toLowerCase()||await passwordHash(String(b.password||''),env.ADMIN_SALT)!==env.ADMIN_PASSWORD_HASH)fail(401,'Invalid login');return json(await session(env,'owner','admin'));}const a=await env.DB.prepare('SELECT * FROM accounts WHERE username=?').bind(name).first();if(!a||await passwordHash(String(b.password||''),a.salt)!==a.password_hash)fail(401,'Invalid login');return json(await session(env,a.id,'customer'));}
if(path==='/auth/register'&&req.method==='POST'){await rate(env,req,'register',5);const b=await body(req),username=clean(b.username,80).toLowerCase();if(!/^[a-z0-9_.@-]{3,80}$/.test(username)||String(b.password||'').length<10||String(b.password).length>128)fail(400,'ID: 3–80 characters. Password: at least 10 characters.');const order=await env.DB.prepare('SELECT id FROM orders WHERE id=? AND claim_hash=? AND account_id IS NULL').bind(b.orderId,await sha(String(b.claimToken||''))).first();if(!order)fail(403,'Your private order receipt code is required');if(await env.DB.prepare('SELECT id FROM accounts WHERE username=?').bind(username).first())fail(409,'ID already used');const id=crypto.randomUUID(),salt=token(),hash=await passwordHash(b.password,salt);await env.DB.batch([env.DB.prepare('INSERT INTO accounts VALUES(?,?,?,?,?)').bind(id,username,salt,hash,new Date().toISOString()),env.DB.prepare('UPDATE orders SET account_id=? WHERE id=? AND account_id IS NULL').bind(id,order.id)]);return json(await session(env,id,'customer'),201);}
const a=await auth(req,env);
if(path==='/customer-counts'&&req.method==='GET'){
  if(a.role!=='admin')fail(403,'Owner only');
  const rows=await env.DB.prepare("SELECT json_extract(payload,'$.customer.mobile') AS mobile,COUNT(*) AS n FROM orders WHERE status<>'deleted' GROUP BY json_extract(payload,'$.customer.mobile')").all();
  const totals={};for(const row of rows.results){const phone=normalizeMobile(row.mobile);if(phone.length===10)totals[phone]=(totals[phone]||0)+Number(row.n||0)}
  return json({counts:Object.entries(totals).map(([mobile,count])=>({mobile,count}))});
}
if(path==='/customer-history'&&req.method==='GET'){
  if(a.role!=='admin')fail(403,'Owner only');
  const mobile=normalizeMobile(u.searchParams.get('mobile'));
  if(mobile.length!==10)fail(400,'Valid mobile required');
  const offset=Math.min(1000000,Math.max(0,Number(u.searchParams.get('offset'))||0));
  const rows=await env.DB.prepare("SELECT * FROM orders WHERE status<>'deleted' AND json_extract(payload,'$.customer.mobile') IN (?, ?, ?) ORDER BY created_at DESC LIMIT 100 OFFSET ?").bind(mobile,'91'+mobile,'0'+mobile,offset).all();
  return json({orders:rows.results.map(publicOrder),nextOffset:rows.results.length===100?offset+100:null});
}
if(path.match(/^\/orders\/[a-z0-9-]+\/history$/)&&req.method==='GET'){
  if(a.role!=='admin')fail(403,'Owner only');
  const id=path.split('/')[2];
  const history=await env.DB.prepare('SELECT actor,changed_at,before_json,after_json FROM audit WHERE order_ref=? ORDER BY changed_at DESC LIMIT 60').bind(id).all();
  return json({history:history.results.map(x=>({actor:x.actor,changedAt:x.changed_at,
    beforeStatus:(()=>{try{return JSON.parse(x.before_json).status}catch{return''}})(),
    afterStatus:(()=>{try{return JSON.parse(x.after_json).status}catch{return''}})()}))});
}
if(path==='/metrics'&&req.method==='GET'){if(a.role!=='admin')fail(403,'Owner only');const rows=await env.DB.prepare('SELECT status,COUNT(*) AS n FROM orders GROUP BY status').all();const q=await env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE status='successful' AND payment_verified=1 AND printed_revision<revision AND lower(json_extract(payload,'$.order.paymentMode'))='prepaid'").first();return json({counts:rows.results,queued:q.n});}
if(path==='/labels'&&req.method==='GET'){if(a.role!=='admin')fail(403,'Owner only');const rows=await env.DB.prepare("SELECT * FROM orders WHERE status='successful' AND payment_verified=1 AND printed_revision<revision AND lower(json_extract(payload,'$.order.paymentMode'))='prepaid' ORDER BY created_at,id LIMIT 200").all();return json({orders:rows.results.map(publicOrder)});}
if(path==='/labels/complete'&&req.method==='POST'){if(a.role!=='admin')fail(403,'Owner only');const b=await body(req);if(!Array.isArray(b.labels)||b.labels.length<1||b.labels.length>200)fail(400,'Choose 1–200 labels');const done=[],stale=[];for(const l of b.labels){if(!/^[a-z0-9-]+$/.test(l.id)||!Number.isInteger(l.revision))fail(400,'Invalid label reference');const now=new Date().toISOString();const result=await env.DB.prepare("UPDATE orders SET printed_revision=revision,printed_at=? WHERE id=? AND revision=? AND printed_revision<revision AND status='successful' AND payment_verified=1 AND lower(json_extract(payload,'$.order.paymentMode'))='prepaid' RETURNING id").bind(now,l.id,l.revision).first();if(result)done.push(l.id);else stale.push(l.id);}return json({completed:done,stale});}
if(path==='/auth/logout'&&req.method==='POST'){await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(a.token_hash).run();return json({ok:true});}
if(path==='/orders/claim'&&req.method==='POST'){if(a.role!=='customer')fail(403,'Customer only');const b=await body(req);const row=await env.DB.prepare('SELECT id FROM orders WHERE id=? AND claim_hash=? AND account_id IS NULL').bind(b.orderId,await sha(String(b.claimToken||''))).first();if(!row)fail(403,'Invalid receipt');await env.DB.prepare('UPDATE orders SET account_id=? WHERE id=? AND account_id IS NULL').bind(a.account_id,row.id).run();return json({ok:true});}
if(path==='/orders'&&req.method==='GET'){
  const q=clean(u.searchParams.get('q'),200).toLowerCase();
  const offset=Math.min(1000000,Math.max(0,Number(u.searchParams.get('offset'))||0));
  const where=a.role==='admin'?'1=1':"account_id=? AND status<>'deleted'",params=a.role==='admin'?[]:[a.account_id];
  const like='%'+q.replace(/[\\%_]/g,'\\$&')+'%';
  const searchPart=q?" AND (search_text LIKE ? ESCAPE '\\' OR lower(order_id) LIKE ? ESCAPE '\\' OR lower(source) LIKE ? ESCAPE '\\')":'';
  const argumentsList=q?[...params,like,like,like,offset]:[...params,offset];
  const rows=await env.DB.prepare('SELECT * FROM orders WHERE '+where+searchPart+' ORDER BY created_at DESC LIMIT 100 OFFSET ?').bind(...argumentsList).all();
  const compressed=a.role==='admin'&&u.searchParams.get('view')==='summary';
  return json({orders:rows.results.map(compressed?compactOrder:publicOrder),nextOffset:rows.results.length===100?offset+100:null});
}
const match=path.match(/^\/orders\/([a-z0-9-]+)(\/(?:invoice|summary))?$/);if(match){const row=await env.DB.prepare('SELECT * FROM orders WHERE id=?'+(a.role==='admin'?'':' AND account_id=?')).bind(...(a.role==='admin'?[match[1]]:[match[1],a.account_id])).first();if(!row||a.role!=='admin'&&row.status==='deleted')fail(404,'Order not found');if(match[2]&&req.method==='GET'){if(match[2]==='/summary'&&a.role!=='admin')fail(403,'Order summary is for owner only');if(match[2]==='/invoice'&&!canDownload(a.role,row))fail(403,'Invoice pending payment/download approval');return new Response(invoice(row,match[2]==='/summary'),{headers:{...headers,'Content-Type':'text/html; charset=utf-8','Content-Disposition':'inline; filename="invoice.html"','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src https: data:; base-uri 'none'; frame-ancestors 'none'"}});}if(req.method==='GET')return json({order:publicOrder(row)});if(req.method==='PATCH'){if(a.role!=='admin')fail(403,'Read-only customer account');const b=await body(req);if(b.expectedRevision!==undefined&&b.expectedRevision!==row.revision)fail(409,'This order changed in another tab. Reload it before saving.');const allowedStatus=['pending','successful','dispatched','delivered','cancelled','deleted'];if(b.status&&!allowedStatus.includes(b.status))fail(400,'Invalid status');const next={...row,status:b.status||row.status,payment_verified:b.paymentVerified===undefined?row.payment_verified:(b.paymentVerified?1:0),invoice_approved:b.invoiceApproved===undefined?row.invoice_approved:(b.invoiceApproved?1:0),dispatch_by:b.dispatchBy===undefined?row.dispatch_by:clean(b.dispatchBy,40),dispatch_date:b.dispatchDate===undefined?row.dispatch_date:clean(b.dispatchDate,40),courier:b.courier===undefined?row.courier:clean(b.courier,100),tracking_number:b.trackingNumber===undefined?row.tracking_number:clean(b.trackingNumber,120),tracking_url:b.trackingUrl===undefined?row.tracking_url:clean(b.trackingUrl,1000),payload:b.payload?JSON.stringify(b.payload):row.payload};if(b.payload&&(!b.payload.customer?.name||!b.payload.customer?.mobile||!Array.isArray(b.payload.order?.items)||!b.payload.order.items.length))fail(400,'Customer name, mobile and products are required.');if(['successful','dispatched','delivered'].includes(next.status)&&!next.payment_verified)
  fail(400,'Verify received payment or COD advance before accepting or dispatching.');
if(next.status==='dispatched'||next.status==='delivered'){
  if(!next.courier)fail(400,'Choose a courier company or Bus before dispatching.');
  if(!next.dispatch_date)fail(400,'Provide the dispatch date.');
  if(next.dispatch_by!=='bus'&&next.dispatch_by!=='courier')fail(400,'Choose Courier or Bus dispatch method.');
}
if(b.status==='deleted'&&row.status!=='deleted'&&clean(b.deleteConfirmation,120)!==row.order_id)
  fail(400,'Enter the exact Order ID to archive/delete this order.');
if(next.status==='deleted')next.invoice_approved=0;
if(b.payload&&b.payload.order?.items?.some(i=>!i.name&&!i.product||!Number.isInteger(Number(i.quantity))||Number(i.quantity)<1||Number(i.unitPrice)<0||!Number.isFinite(Number(i.unitPrice))))
  fail(400,'Product name, positive integer quantity and valid unit price are required.');
if(b.payload&&b.payload.order?.items?.length>200)fail(400,'Too many products.');if(next.status!==row.status){
 const oldPayload=JSON.parse(next.payload),details=oldPayload.order||{};
 details.statusChangedAt=new Date().toISOString();
 if(next.status==='delivered')details.deliveredAt=details.statusChangedAt;
 if(next.status==='dispatched')details.dispatchedAt=details.statusChangedAt;
 oldPayload.order=details;next.payload=JSON.stringify(oldPayload);
}
const revision=next.payload===row.payload?row.revision:row.revision+1;if(next.tracking_url&&!/^https:\/\//.test(next.tracking_url))fail(400,'Tracking URL must use HTTPS');const now=new Date().toISOString();const writes=await env.DB.batch([env.DB.prepare('UPDATE orders SET status=?,payment_verified=?,invoice_approved=?,dispatch_by=?,dispatch_date=?,courier=?,tracking_number=?,tracking_url=?,payload=?,search_text=?,updated_at=?,revision=? WHERE id=? AND revision=?').bind(next.status,next.payment_verified,next.invoice_approved,next.dispatch_by,next.dispatch_date,next.courier,next.tracking_number,next.tracking_url,next.payload,searchText(JSON.parse(next.payload)),now,revision,row.id,row.revision),env.DB.prepare('INSERT INTO audit SELECT ?,?,?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),row.id,a.account_id,now,JSON.stringify(publicOrder(row)),JSON.stringify(publicOrder({...next,revision})))]);if(writes[0].meta.changes!==1)fail(409,'Order changed while saving. Reload before editing.');return json({order:publicOrder({...next,revision})});}}
fail(404,'Not found');}catch(e){return json({error:e.status?e.message:'Server error. Please retry.'},e.status||500);}},async scheduled(_,env){await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires_at<?').bind(Date.now()),env.DB.prepare('DELETE FROM rate_limits WHERE expires_at<?').bind(Date.now())]);}};

