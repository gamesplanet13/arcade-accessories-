(function(root){'use strict';const API=()=>String(root.GP_ORDER_SERVICE?.apiUrl||'').replace(/\/$/,''),store='gp_order_outbox_v2',secrets='gp_order_keys_v2';let busy=false,flushing=false,memory=[];
const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join(''),mobile=v=>String(v||'').replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'').replace(/^0(?=\d{10}$)/,''),clean=v=>String(v??'').trim(),key=v=>clean(v).toLowerCase().replace(/[^a-z0-9]/g,''),number=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/(?:₹|Rs\.?|INR|,)/gi,'').trim());return Number.isFinite(n)?n:null};
function read(k,def){try{return JSON.parse(localStorage.getItem(k)||'null')||def}catch{return def}}function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}
function val(...ids){for(const id of ids){const e=document.getElementById(id)||document.querySelector('[name="'+id+'"]');if(e){const v=clean(e.value);if(v&&v!=='__manual__')return v}}return''}
function notice(s,bad=false){let n=document.getElementById('gpServerSaved');if(!n){n=document.createElement('div');n.id='gpServerSaved';n.setAttribute('role','status');n.style.cssText='position:sticky;bottom:8px;z-index:9999;margin:12px;padding:14px;border-radius:9px;border:1px solid #a6c9dc;font:14px/1.5 system-ui;background:#edf7fc;color:#16394d';document.body.append(n)}n.textContent=s;n.style.background=bad?'#fff0dd':'#edf7fc';}
function parse(message){const map={};for(const raw of message.split('\n')){const line=raw.replace(/\*/g,'').replace(/^[^a-z0-9]+/i,'').trim(),m=line.match(/^([^:]{1,75}):\s*(.*)$/);if(m&&!Object.hasOwn(map,key(m[1])))map[key(m[1])]=m[2].trim()}return map}
function selectedMode(map){if(/COD Order|Cash on Delivery/i.test(map.header||''))return'cod';const checked=document.querySelector('input[name="paymentMode"]:checked,input[name="orderType"]:checked');const value=(checked?.value||val('paymentmode','paymentMode')||'').toLowerCase();if(value.includes('cod'))return'cod';if(value.includes('prepaid'))return'prepaid';return'unknown'}
function build(message,structured){const m=parse(message);m.header=message.split('\n')[0];let order=structured;try{if(!order&&typeof gpzCurrentOrder!=='undefined'&&gpzCurrentOrder)order=gpzCurrentOrder}catch{}order=JSON.parse(JSON.stringify(order||{}));const customer={name:m.name||val('name'),mobile:mobile(m.mobile||val('mobile')),altMobile:mobile(m.altmobile||val('altMobile','altmobile','alt_mobile')),email:m.email||val('email'),house:m.house||val('house'),address:m.address||val('address'),landmark:m.landmark||val('landmark'),pincode:m.pincode||val('pincode','pin_code'),state:m.state||val('state'),city:m.districtcity||m.city||m.district||val('city','district'),postoffice:m.postoffice||val('postofficeManual','postofficeSelect','postOffice','postoffice'),businessName:m.customerbusinessname||val('buyerBusinessName'),gstin:m.customergstin||val('buyerGstin'),billingAddress:m.gstbillingaddress||val('buyerBillingAddress')};
if(!order.paymentMode)order.paymentMode=/COD Order on WhatsApp/i.test(message)?'cod':/Prepaid Order on WhatsApp/i.test(message)?'prepaid':selectedMode(m);
if(!Array.isArray(order.items)||!order.items.length){let product=m.product||m.console||val('product','otherProduct')||'Selected PS2 setup';let qty=number(m.quantity)||1,amount=number(m.mainproductamount??m.baseamount??m.productamount??m.baseprice);if(m.console){const n=m.console.match(/₹\s*([\d,.]+)/);if(n)amount=number(n[1]);}order.items=[{name:product,variant:m.variant||m.storage||'',quantity:qty,unitPrice:amount===null?null:amount/qty,lineTotal:amount}];order.productTotal=amount;order.grandTotal=number(m.finalordertotal??m.grandtotal??m.total??m.amountpaid??m.mainproductamount??m.baseamount);order.advanceAmount=number(m.amountpaid??m.advancepaid??m.codadvance);order.restAmount=number(m.remainingamount??m.restondelivery);order.courier=m.couriercompany||val('courier');}
order.delivery={...(order.delivery||{}),destination:customer.pincode,origin:'244901',distance:m.distance||val('distance'),etaPrepaid:m.prepaidordereta||val('etaText'),etaCod:m.codordereta||val('etaTextCod'),estimatedDelivery:order.paymentMode==='cod'?(val('dateRange')||''):(m.estimateddelivery||val('dateRange')),estimatedDeliveryCod:order.paymentMode==='cod'?(m.estimateddelivery||val('dateRangeCOD')):val('dateRangeCOD')};
let id=m.orderid||val('orderId');if(!id)id=crypto.randomUUID();const source=new URLSearchParams(location.search).get('storeSource')||location.pathname.split('/').filter(Boolean)[0]||'store';let keys=read(secrets,{}),pair=keys[id];if(!pair){pair={submissionKey:random(),claimToken:random()};keys[id]=pair;write(secrets,keys)}const previous=read('gp_private_order_receipts',[]).filter(x=>
  x.id&&x.claimToken&&x.orderId!==id&&mobile(x.customerMobile)===customer.mobile&&
  Number.isFinite(Date.parse(x.createdAt||''))&&Date.now()-Date.parse(x.createdAt)<72*3600000&&Date.now()-Date.parse(x.createdAt)>=0
).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))[0];
return{...pair,source,orderId:id,customer,order,message,
  ...(previous?{previousOrderId:previous.id,previousClaimToken:previous.claimToken}:{})};}
async function post(entry){if(!API())throw Error('Order server is not configured');const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),15000);try{let savedSession=null;try{savedSession=JSON.parse(sessionStorage.getItem('gp_order_session_customer')||'null')}catch{}
let token=String(savedSession?.token||'');
const submit=authToken=>fetch(API()+'/orders',{method:'POST',headers:{'Content-Type':'application/json',...(authToken?{Authorization:'Bearer '+authToken}:{})},body:JSON.stringify(entry),signal:ctrl.signal,keepalive:JSON.stringify(entry).length<50000});
let r=await submit(token);
if(r.status===401&&token){sessionStorage.removeItem('gp_order_session_customer');token='';r=await submit('');}
const x=await r.json();if(!r.ok)throw Error(x.error||'Order was not saved');const receipts=read('gp_private_order_receipts',[]);if(!x.merged&&!receipts.some(y=>y.id===x.id)){
  receipts.push({id:x.id,orderId:entry.orderId,claimToken:entry.claimToken,
    customerMobile:entry.customer.mobile,createdAt:new Date().toISOString(),
    summary:(entry.order.items||[]).map(i=>String(i.name||i.product)+' × '+(i.quantity||1)).join(', '),
    grandTotal:entry.order.grandTotal});
  write('gp_private_order_receipts',receipts);
}
return x}finally{clearTimeout(timer)}}
function outbox(){return read(store,memory)}function retain(entry){const all=outbox(),at=all.findIndex(x=>x.orderId===entry.orderId);if(at<0)all.push(entry);else all[at]=entry;memory=all;return write(store,all)}function remove(id){const all=outbox().filter(x=>x.orderId!==id);memory=all;write(store,all)}
async function flush(){if(flushing||busy||!navigator.onLine)return;flushing=true;let count=0;try{for(const entry of outbox()){try{await post(entry);remove(entry.orderId);count++;}catch(e){notice('Order '+entry.orderId+' is still waiting to sync: '+e.message,true);break;}}if(count)notice(count+' pending order(s) saved online. Payment verification is pending.')}finally{flushing=false}}

/* WhatsApp pre-open tab must show a real progress screen, never about:blank. */
function gpFinalizingMarkup(){
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>GAMES PLANET · Finalizing Order</title><style>'+
 '*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#edf5fb;color:#153148}'+
 'body{min-height:100dvh;display:grid;place-items:center;padding:18px}main{width:min(100%,430px);padding:30px 20px;text-align:center;border:1px solid #d4e6ee;background:#fff;border-radius:20px;box-shadow:0 18px 50px #102f491c}'+
 '.brand{color:#087394;font-weight:900;font-size:12px;letter-spacing:2px}.wheel{height:62px;width:62px;margin:26px auto 20px;border:5px solid #dbeaf1;border-top-color:#0ba97b;border-right-color:#0e93b8;border-radius:50%;animation:spin 0.85s linear infinite}'+
 '@keyframes spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.wheel{animation-duration:2s}}'+
 'h1{font-size:23px;margin:0 0 11px;line-height:1.3}p{font-size:14px;color:#5b7183;line-height:1.6;margin:0}.step{margin:19px 0;padding:12px;background:#f0f8fa;border-radius:10px;color:#326477;font-weight:700;font-size:13px}'+
 'a{display:inline-block;margin-top:12px;padding:11px 16px;background:#0c9769;color:white;text-decoration:none;border-radius:10px;font-weight:800}[hidden]{display:none!important}'+
 '.footer{font-size:12px;margin-top:20px;color:#8196a4}</style></head><body>'+
 '<main role="status" aria-live="polite"><div class="brand">GAMES PLANET</div><div class="wheel" aria-hidden="true"></div>'+
 '<h1 id="gpFinalizeTitle">Finalizing Your Order…</h1>'+
 '<p id="gpFinalizeDescription">Please keep this page open while your order is saved.</p>'+
 '<div class="step" id="gpFinalizeStep">Saving your order details…</div>'+
 '<a id="gpFinalizeLink" hidden href="#">Open WhatsApp</a>'+
 '<p class="footer">WhatsApp will open automatically after processing.</p></main></body></html>';
}
function gpFinalizingWindow(p){
 if(!p)return;
 try{p.document.open();p.document.write(gpFinalizingMarkup());p.document.close();p.opener=null}catch(e){console.warn('Order progress window:',e)}
}
function gpFinalizingOverlay(){
 let el=document.getElementById('gpOrderFinalizingOverlay');
 if(!el){
  const st=document.createElement('style');st.textContent='@keyframes gpOrderSpin{to{transform:rotate(360deg)}}#gpOrderFinalizingOverlay[hidden]{display:none!important}#gpOrderFinalizingOverlay .spin{animation:gpOrderSpin .85s linear infinite}@media(prefers-reduced-motion:reduce){#gpOrderFinalizingOverlay .spin{animation-duration:2s}}';document.head.append(st);
  el=document.createElement('div');el.id='gpOrderFinalizingOverlay';el.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#edf5fbf5;display:grid;place-items:center;padding:18px';
  el.innerHTML='<section role="status" aria-live="polite" style="width:min(100%,390px);padding:30px 20px;text-align:center;background:#fff;color:#153148;border-radius:20px;box-shadow:0 15px 48px #132f4930;font-family:system-ui"><b style="font-size:12px;letter-spacing:2px;color:#0b7790">GAMES PLANET</b><div class="spin" style="height:60px;width:60px;margin:24px auto 17px;border:5px solid #dbeaf1;border-top-color:#0ba97b;border-right-color:#0e93b8;border-radius:50%"></div><h2 id="gpOverlayTitle" style="font-size:22px;margin:0 0 10px">Finalizing Your Order…</h2><p id="gpOverlayDescription" style="margin:0;color:#5b7183">Saving your order before WhatsApp opens.</p></section>';
  document.body.append(el);
 }
 el.hidden=false;document.body.setAttribute('aria-busy','true');
}
function gpFinalizingUpdate(p,title,description,url){
 const a=document.getElementById('gpOverlayTitle'),b=document.getElementById('gpOverlayDescription');
 if(a)a.textContent=title;if(b)b.textContent=description;
 try{
  if(!p||p.closed)return;
  const d=p.document,t=d.getElementById('gpFinalizeTitle'),n=d.getElementById('gpFinalizeDescription'),step=d.getElementById('gpFinalizeStep');
  if(t)t.textContent=title;if(n)n.textContent=description;
  if(step)step.textContent=url?'Redirecting to WhatsApp now…':'Connecting to the order system…';
  if(url){const link=d.getElementById('gpFinalizeLink');if(link){link.href=url;link.hidden=false}}
 }catch(e){}
}
function gpFinalizingHide(){const el=document.getElementById('gpOrderFinalizingOverlay');if(el)el.hidden=true;document.body.removeAttribute('aria-busy')}
window.addEventListener('pageshow',gpFinalizingHide);

async function send(message,order){if(busy)return;busy=true;const popup=window.open('about:blank','_blank');gpFinalizingWindow(popup);gpFinalizingOverlay();let entry;try{notice('Finalizing your order…');entry=build(message,order);if(!entry.customer.name||!entry.customer.mobile||!entry.order.items.length)throw Error('Customer name, mobile and product are required');if(root.GPPostal&&/^\d{6}$/.test(entry.customer.pincode)){try{const p=await root.GPPostal.lookup(entry.customer.pincode);if(p){entry.order.delivery={...entry.order.delivery,...p.delivery};if(!entry.customer.state)entry.customer.state=p.state;if(!entry.customer.city)entry.customer.city=p.city;if(!entry.customer.postoffice)entry.customer.postoffice=p.postoffices[0]||''}}catch{}}
const d=entry.order.delivery||{},fields={Distance:d.distance,[entry.order.paymentMode==='cod'?'COD Order ETA':'Prepaid Order ETA']:entry.order.paymentMode==='cod'?d.etaCod:d.etaPrepaid,'Estimated Delivery':entry.order.paymentMode==='cod'?d.estimatedDeliveryCod:d.estimatedDelivery};for(const [label,value]of Object.entries(fields)){if(!value)continue;const escaped=label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),re=new RegExp('^([^\\n]*?'+escaped+'\\s*:\\s*)[^\\n]*$','mi');if(re.test(message))message=message.replace(re,(_,prefix)=>prefix+value);else message+='\n'+label+': '+value;}entry.message=message;
for(const [label,value]of [['Mobile',entry.customer.mobile],['Alt Mobile',entry.customer.altMobile]]){const re=new RegExp('^([^\\n]*?'+label+'\\s*:\\s*)[^\\n]*$','mi');message=message.replace(re,(_,prefix)=>prefix+value);}entry.message=message;const local=retain(entry);let result;try{gpFinalizingUpdate(popup,'Finalizing Your Order…','Saving your order securely. WhatsApp will open next.');result=await post(entry);remove(entry.orderId);
if(result?.duplicate){
  popup?.close();
  notice('यह सामान आपके पिछले Order '+result.orderId+' में पहले से है। दोबारा ऑर्डर नहीं बनाया गया।');
  return result;
}
if(result?.merged){
  message=message.replace(/^(\\s*Order ID:\\s*).+$/mi,(_,prefix)=>prefix+result.orderId);
  notice('नया सामान Order '+result.orderId+' में जोड़ दिया गया है। Payment confirmation के लिए Order फिर Pending है।');
}else notice('Order '+entry.orderId+' saved online ✓ Payment verification is pending. You can now send the WhatsApp message.');}catch(e){notice((local?'Your order is saved on this device and will retry when this page is online. ':'Browser storage is blocked. Keep this page open and retry. ')+e.message+' WhatsApp is a separate backup.',true);}
const url='https://wa.me/917983624797?text='+encodeURIComponent(message);gpFinalizingUpdate(popup,'Opening WhatsApp…','Your order message is ready. Continue in WhatsApp to send it.',url);if(popup&&!popup.closed)popup.location.href=url;else location.href=url;return result;}catch(e){popup?.close();notice(e.message,true);alert(e.message)}finally{busy=false;gpFinalizingHide()}}

async function editRecentReceipt(receipt,container){
  const apiUrl=API();if(!apiUrl){notice('Order service is not available. Please contact Games Planet.',true);return;}
  const request=async(path,data)=>{const response=await fetch(apiUrl+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),result=await response.json();
    if(!response.ok)throw Error(result.error||'Could not update your order');return result;};
  const proof={orderId:receipt.id,claimToken:receipt.claimToken};
  let data;
  try{data=await request('/orders/receipt',proof)}catch(e){notice(e.message,true);return;}
  const r=data.order,o=r.payload.order||{},items=o.items||[];
  const panel=document.createElement('section');panel.style.cssText='padding:12px;margin-top:9px;background:white;border:1px solid #a9cede;border-radius:8px';
  const heading=document.createElement('h3');heading.textContent='Order '+r.order_id+' · '+(r.status==='successful'?'Accepted':r.status==='pending'?'Pending':r.status);
  panel.append(heading);
  const address=document.createElement('p');address.textContent='Customer: '+r.payload.customer.name+' | '+r.payload.customer.city+' | '+r.payload.customer.pincode;panel.append(address);
  const controls=[];
  for(const item of items){
    const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #eef2f5';
    const label=document.createElement('span');label.textContent=(item.name||item.product||'Product')+(item.variant?' — '+item.variant:'')+' • ₹'+Number(item.unitPrice||0)+' each';
    const inp=document.createElement('input');inp.type='number';inp.min='0';inp.max='1000';inp.step='1';inp.value=String(item.quantity||1);inp.style.cssText='width:70px;padding:6px;border:1px solid #ced9e0;border-radius:5px';
    row.append(label,inp);panel.append(row);controls.push(inp);
  }
  const total=document.createElement('p');total.textContent='Previous quoted total: ₹'+Number(o.grandTotal||0).toLocaleString('en-IN')+' | Payment: '+String(o.paymentMode||'unknown').toUpperCase();panel.append(total);
  const help=document.createElement('p');help.textContent='Quantity 0 means remove that line. For additional different products, use the checkout normally; they will join this unprocessed order. After changes, payment and courier are reconfirmed.';panel.append(help);
  const actions=document.createElement('div');actions.style.cssText='display:flex;gap:10px;flex-wrap:wrap';
  const save=document.createElement('button');save.type='button';save.textContent='Save order changes';
  const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Close';
  actions.append(save,cancel);panel.append(actions);
  cancel.onclick=()=>panel.remove();
  save.disabled=!data.canEdit;
  if(!data.canEdit)help.textContent='This order is no longer editable (older than 3 days, rejected, printed or dispatched). Contact Games Planet.';
  save.onclick=async()=>{save.disabled=true;try{
    const quantities=controls.map(c=>Number(c.value));
    if(quantities.some(v=>!Number.isInteger(v)||v<0||v>1000)||!quantities.some(v=>v>0))throw Error('Choose valid quantities; at least one product must remain.');
    const updated=await request('/orders/receipt-edit',{...proof,expectedRevision:r.revision,quantities});
    const receipts=read('gp_private_order_receipts',[]);
    for(const rec of receipts)if(rec.id===receipt.id){
      rec.summary=updated.order.payload.order.items.map(i=>(i.name||i.product)+' × '+i.quantity).join(', ');
      rec.grandTotal=updated.order.payload.order.grandTotal;
    }
    write('gp_private_order_receipts',receipts);
    repeatNotice();
    notice('Order '+updated.orderId+' updated. It is Pending again until Games Planet verifies payment and courier.',false);
  }catch(e){notice(e.message,true)}finally{save.disabled=false}};
  container.querySelector('#gpReceiptEdit')?.remove();
  panel.id='gpReceiptEdit';container.append(panel);
}
function repeatNotice(){
  let n=document.getElementById('gpRepeatOrderNotice');
  if(!n){n=document.createElement('section');n.id='gpRepeatOrderNotice';n.style.cssText='display:none;margin:12px;padding:12px;border:1px solid #bbd3df;border-radius:10px;background:#f2f8fc;color:#18384d;font:14px/1.5 system-ui';
    const target=document.getElementById('checkoutInvoices')||document.querySelector('form')||document.body;
    if(target===document.body)document.body.prepend(n);else target.parentElement?.insertBefore(n,target);
  }
  const phone=mobile(val('mobile')),receipts=read('gp_private_order_receipts',[]);
  const mine=receipts.filter(x=>x.customerMobile&&mobile(x.customerMobile)===phone).sort((a,b)=>Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0));
  if(phone.length!==10||!mine.length){n.style.display='none';return;}
  n.style.display='';
  const recent=mine.find(x=>Date.now()-Date.parse(x.createdAt||0)<=72*3600000);
  const title=document.createElement('b');title.textContent='आपके पिछले ऑर्डर: '+mine.length;
  const a=document.createElement('a');a.href='https://gamesplanet13.github.io/arcade-accessories-/customer-orders.html';a.textContent=' सभी ऑर्डर देखें / Edit के लिए Login';a.style.marginLeft='8px';
  const info=document.createElement('p');info.style.margin='6px 0 0';info.textContent=recent?
    'हालिया Order '+recent.orderId+': '+(recent.summary||'Previous order')+'. नया अलग प्रोडक्ट भेजने पर, अगर ऑर्डर dispatch नहीं हुआ, तो इसी ऑर्डर में जुड़ सकता है।':
    'पुराने ऑर्डर देखने के लिए अपना customer account खोलें।';
  n.replaceChildren(title,a,info);
  if(recent){
    const btn=document.createElement('button');btn.type='button';btn.textContent='Edit this order / Quantity बदलें';btn.style.cssText='margin:9px 0;padding:9px 11px;border-radius:8px;border:1px solid #9dc1d3;background:#fff;color:#153d55;font-weight:600;cursor:pointer';
    btn.onclick=()=>editRecentReceipt(recent,n);n.append(btn);
  }
}
function sendURL(url,order){let text='';try{text=new URL(url).searchParams.get('text')||''}catch{}return send(text,order)}
root.GPOrderRecords={send,sendURL,flush,build};function mount(){flush();document.addEventListener('change',e=>{if(e.target?.id==='mobile')repeatNotice()});repeatNotice();if('serviceWorker'in navigator){const name=root.GP_NATIVE_POSTAL?'pincode-offline-sw.js?v=20261022-orders':'gp-orders-offline-sw.js?v=20261022-orders';navigator.serviceWorker.register(new URL(name,location.href).href).catch(()=>{})}const invoices=document.getElementById('checkoutInvoices');if(invoices)invoices.innerHTML='<h2>Invoice / My Orders</h2><p>Your order is saved online before WhatsApp. Invoice download opens after payment verification and approval.</p><a href="https://gamesplanet13.github.io/arcade-accessories-/customer-orders.html">My Orders / Customer Login →</a>';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();window.addEventListener('online',flush);setInterval(flush,20000);
})(window);
