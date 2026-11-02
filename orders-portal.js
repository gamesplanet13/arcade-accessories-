(function(){'use strict';const $=id=>document.getElementById(id),admin=location.pathname.includes('admin-orders'),role=admin?'admin':'customer',key='gp_order_session_'+role;let session;try{session=JSON.parse(sessionStorage.getItem(key)||'null')}catch(_){}let offset=0,records=[],selected;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
$('portalTitle').textContent=admin?'Admin Dashboard':'My Orders';$('register').hidden=admin;
async function api(path,method='GET',data){const root=(GP_ORDER_SERVICE.apiUrl||'').replace(/\/$/,'');if(!root)throw Error('Order server is not activated yet.');const r=await fetch(root+path,{method,headers:{'Content-Type':'application/json',...(session?{Authorization:'Bearer '+session.token}:{})},body:data?JSON.stringify(data):undefined});if(!r.ok){const x=await r.json();if(r.status===401){session=null;sessionStorage.removeItem(key);view()}throw Error(x.error||'Request failed')}return r;}
function task(fn){return async()=>{try{$('error').textContent='';await fn()}catch(e){$('error').textContent=e.message}}}
function view(){$('loginButton').hidden=false;$('registerButton').hidden=false;$('username').parentElement.hidden=false;$('password').parentElement.hidden=false;$('claimButton').hidden=true;$('login').hidden=!!session;$('tools').hidden=!session;$('export').hidden=!session||!admin;if(!session)$('detail').hidden=true;else if(!admin){$('register').hidden=false;$('login').hidden=false;$('loginButton').hidden=true;$('registerButton').hidden=true;$('username').parentElement.hidden=true;$('password').parentElement.hidden=true;$('claimButton').hidden=false;}}
const statusLabel=x=>({pending:'Pending — Payment review',successful:'Accepted',dispatched:'Dispatched',delivered:'Delivered',cancelled:'Rejected',deleted:'Archived'}[x]||x);
const moneySafe=n=>n===null||n===undefined||n===''?'—':money(n);
const safeImage=(value,source)=>{
 const raw=String(value||'').trim();if(!raw)return '';
 try{const root='https://gamesplanet13.github.io/'+encodeURIComponent(String(source||'arcade-accessories-').replace(/[^a-z0-9_-]/gi,''))+'/';
 const u=new URL(raw,root);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}
};
const imageTag=(item,source)=>{
 const img= safeImage(item.image||item.imageUrl||item.thumbnail||item.photo||(Array.isArray(item.images)?item.images[0]:''),source);
 return img?'<img class="customer-product-photo" loading="lazy" src="'+esc(img)+'" alt="Product photo">':'<span class="customer-image-missing">No photo</span>';
};
const readableDate=x=>{const d=new Date(x);return Number.isNaN(d.valueOf())?String(x||'—'):d.toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'})};
async function list(reset=true){
 if(reset){offset=0;records=[];$('orders').replaceChildren()}
 const r=await api('/orders?q='+encodeURIComponent($('search').value)+'&offset='+offset),x=await r.json();
 records.push(...x.orders);offset=x.nextOffset;$('more').hidden=offset===null;
 for(const o of x.orders){
  const c=o.payload.customer||{},order=o.payload.order||{},b=document.createElement('button');
  b.className='customer-order-entry';
  b.innerHTML='<div class="customer-order-head"><b>'+esc(o.order_id)+'</b><span class="customer-status '+esc(o.status)+'">'+esc(statusLabel(o.status))+'</span></div>'+
   '<small>'+esc(readableDate(o.created_at))+' · '+esc(String(order.paymentMode||'').toUpperCase())+'</small>'+
   '<div>'+esc((order.items||[]).map(i=>(i.name||i.product)+' × '+(i.quantity||1)).join(' · '))+'</div>'+
   '<strong>'+moneySafe(order.grandTotal)+'</strong>';
  b.onclick=task(()=>details(o.id));$('orders').append(b);
 }
 if(!records.length)$('orders').textContent='No matching orders';
}
function field(id,label,value,type='text'){return '<label>'+label+'<input id="'+id+'" type="'+type+'" value="'+esc(value)+'"></label>'}
async function details(id){
 const r=await api('/orders/'+id),x=await r.json(),o=x.order;selected=o;
 const p=o.payload,c=p.customer||{},order=p.order||{},delivery=order.delivery||{};
 const lineItems=(order.items||[]).map(i=>
  '<tr><td>'+imageTag(i,o.source)+'</td><td><b>'+esc(i.name||i.product||'Product')+'</b>'+
  '<div class="secondary">'+esc(i.variant||'')+'</div>'+
  '<div class="secondary">Unit weight: '+esc(i.unitWeight??'—')+'g · Dimensions: '+esc(Array.isArray(i.dimensions)?i.dimensions.join(' × '):(i.dimensions||'—'))+'</div></td>'+
  '<td>'+Number(i.quantity||1)+'</td><td>'+moneySafe(i.unitPrice)+'</td><td><b>'+moneySafe(i.lineTotal??(Number(i.quantity||1)*Number(i.unitPrice||0)))+'</b></td></tr>').join('');
 const panel=(key,value)=>'<div><span>'+key+'</span><b>'+value+'</b></div>';
 const isDispatch=['dispatched','delivered'].includes(o.status);
 const tracking=o.tracking_url&&/^https:\/\//i.test(o.tracking_url)?'<a href="'+esc(o.tracking_url)+'" target="_blank" rel="noopener noreferrer">Track parcel</a>':'';
 const ship=isDispatch?'<section class="customer-detail-box"><h3>Dispatch & tracking</h3><div class="customer-data">'+
   panel('Delivery method',esc(o.dispatch_by==='bus'?'Bus transport':'Courier'))+
   panel('Courier / transport',esc(o.courier||'Not available'))+
   panel(o.dispatch_by==='bus'?'Bus reference':'AWB / Tracking number',esc(o.tracking_number||'Not provided yet'))+
   panel('Dispatched on',esc(o.dispatch_date||'—'))+
   (order.busDestination?panel('Bus destination',esc(order.busDestination)):'')+
   (o.status==='delivered'?panel('Delivered on',esc(readableDate(order.deliveredAt))):'')+
   '</div>'+tracking+'</section>':'';
 const due=String(order.paymentMode||'').toLowerCase()==='cod'?
  Math.max(0,(order.specialM88Offer?600:500)-Number(order.advanceAmount||0)):
  Math.max(0,Number(order.grandTotal||0)-Number(order.advanceAmount||0));
 const qr= 'https://gamesplanet13.github.io/arcade-accessories-/'+(order.gstInvoiceIncluded?'GSTcurrentQR.png':'NonGSTcurrentQR.jpg');
 const paymentHelp=!o.payment_verified?
  '<section class="customer-detail-box"><h3>Payment not yet verified</h3><p>Payment required for confirmation: '+money(due)+'. Send payment proof to GAMES PLANET for verification.</p>'+
  '<a href="'+qr+'" target="_blank" rel="noopener"><img class="customer-qr" src="'+qr+'" alt="Games Planet payment QR"></a>'+
  '<p><a href="'+qr+'" target="_blank" rel="noopener">Open payment QR</a></p></section>':'';
 let html='<div class="customer-order-head"><h2>'+esc(o.order_id)+'</h2><span class="customer-status '+esc(o.status)+'">'+esc(statusLabel(o.status))+'</span></div>'+
 '<p class="secondary"><b>Ordered:</b> '+esc(readableDate(o.created_at))+' · <b>Last updated:</b> '+esc(readableDate(o.updated_at))+'</p>'+
 '<section class="customer-detail-box"><h3>Customer & delivery address</h3><p><b>'+esc(c.name||'')+'</b> · '+esc(c.mobile||'')+
 (c.altMobile?' · Alternate: '+esc(c.altMobile):'')+'</p><p>'+esc([c.house,c.address,c.landmark,c.postoffice,c.city,c.state,c.pincode].filter(Boolean).join(', '))+'</p></section>'+
 '<section class="customer-detail-box"><h3>Products purchased</h3><div style="overflow-x:auto"><table class="customer-order-table"><thead><tr><th>Photo</th><th>Product / Variant</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>'+lineItems+'</tbody></table></div></section>'+
 '<section class="customer-detail-box"><h3>Order totals</h3><div class="customer-data">'+
 panel('Total products',moneySafe(order.productTotal??(order.items||[]).reduce((n,i)=>n+Number(i.lineTotal||0),0)))+
 panel('Total quantity',String((order.items||[]).reduce((n,i)=>n+Number(i.quantity||0),0)))+
 panel('Packed weight',esc(order.packedWeight??'—')+'g')+
 panel('Box dimensions',esc(Array.isArray(order.boxDimensions)?order.boxDimensions.join(' × ')+' cm':'—'))+
 panel('Courier charge',moneySafe(order.courierCharge))+
 panel('VAS',moneySafe(order.vasCharge))+
 panel('Discount',moneySafe(order.discountApplied))+
 (order.gstInvoiceIncluded?panel('GST',moneySafe(order.productGst)):'')+
 panel('**Grand total**',moneySafe(order.grandTotal))+
 panel('Payment mode',esc(String(order.paymentMode||'—').toUpperCase()))+
 panel('Amount recorded',moneySafe(order.advanceAmount))+
 panel('Payment verified',o.payment_verified?'Yes':'Awaiting verification')+
 panel('Balance on delivery',moneySafe(order.restAmount))+'</div></section>'+ship+paymentHelp;
 if(o.payment_verified&&o.invoice_approved)html+='<section class="customer-detail-box"><h3>Invoice / documents</h3><div class="customer-action-row"><button id="invoice">Open invoice / Print</button><button id="invoicePDF">Download PDF</button><button id="invoiceJPEG">Download JPEG</button><button id="invoiceHTML">Download HTML</button></div></section>';
 else html+='<p class="secondary">Invoice download becomes available after payment confirmation and approval.</p>';
 $('detail').innerHTML=html;$('detail').hidden=false;$('detail').scrollIntoView({behavior:'smooth'});
 if($('invoice'))$('invoice').onclick=task(async()=>{
  const win=window.open('about:blank','_blank');if(win)win.opener=null;
  try{const r=await api('/orders/'+o.id+'/invoice'),html=await r.text(),url=URL.createObjectURL(new Blob([html],{type:'text/html'}));if(win)win.location.href=url;else download(new Blob([html],{type:'text/html'}),o.order_id+'.html');setTimeout(()=>URL.revokeObjectURL(url),60000)}
  catch(e){win?.close();throw e}
 });
 for(const [button,format] of [['invoicePDF','pdf'],['invoiceJPEG','jpg']])if($(button))$(button).onclick=task(async()=>{
  const btn=$(button);btn.disabled=true;try{const response=await api('/orders/'+o.id+'/invoice');const blob=await GPApprovedInvoiceExport(await response.text(),format);download(blob,o.order_id+'.'+format)}finally{btn.disabled=false}
 });
 if($('invoiceHTML'))$('invoiceHTML').onclick=task(async()=>download(await(await api('/orders/'+o.id+'/invoice')).blob(),o.order_id+'.html'));
}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}
$('loginButton').onclick=task(async()=>{const r=await api('/auth/login','POST',{username:$('username').value,password:$('password').value,role});session=await r.json();sessionStorage.setItem(key,JSON.stringify(session));$('password').value='';view();await list()});
$('registerButton').onclick=task(async()=>{const r=await api('/auth/register','POST',{username:$('username').value,password:$('password').value,orderId:$('claimOrder').value,claimToken:$('claimToken').value});session=await r.json();sessionStorage.setItem(key,JSON.stringify(session));$('password').value='';view();await list()});
$('claimButton').onclick=task(async()=>{await api('/orders/claim','POST',{orderId:$('claimOrder').value,claimToken:$('claimToken').value});await list()});$('logout').onclick=task(async()=>{await api('/auth/logout','POST',{});session=null;sessionStorage.removeItem(key);location.reload()});$('refresh').onclick=task(()=>list());$('searchButton').onclick=task(()=>list());$('more').onclick=task(()=>list(false));$('search').onkeydown=e=>{if(e.key==='Enter')$('searchButton').click()};
$('export').onclick=task(async()=>{let offset=0,out=[];do{const r=await api('/orders?q='+encodeURIComponent($('search').value)+'&offset='+offset),x=await r.json();out.push(...x.orders);offset=x.nextOffset}while(offset!==null);download(new Blob([JSON.stringify(out,null,2)],{type:'application/json'}),'games-planet-orders-backup.json')});
let receipts=[];try{receipts=JSON.parse(localStorage.getItem('gp_private_order_receipts')||'[]')}catch(_){}$('receipts').innerHTML='<option value="">Select your order receipt</option>'+receipts.map((r,i)=>'<option value="'+i+'">'+esc(r.orderId)+'</option>').join('');$('receipts').onchange=()=>{const r=$('receipts').value===''?null:receipts[Number($('receipts').value)];if(r){$('claimOrder').value=r.id;$('claimToken').value=r.claimToken}};if(receipts.length){$('receipts').value=String(receipts.length-1);$('receipts').onchange()}
const configured=!!(window.GP_ORDER_SERVICE?.apiUrl);if(!configured){$('error').textContent='अभी account server सक्रिय नहीं है। ID बनाना, login और online order history server जुड़ने के बाद चालू होंगे।';for(const id of ['loginButton','registerButton','claimButton'])$(id).disabled=true;}
view();if(session&&configured)task(()=>list())();
})();
