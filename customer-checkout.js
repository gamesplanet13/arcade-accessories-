(function(){'use strict';
const q=new URLSearchParams(location.search);
let ps2Cart=q.get('storeSource')==='ps2';try{ps2Cart=ps2Cart||JSON.parse(q.get('cart')||'[]').some(i=>i.storeSource==='ps2'||/^PS2 (?:Slim Black|Complete Setup|Black Slim)/i.test(i.name||i.product||''));}catch(_){}
if(!ps2Cart)return;
document.body.classList.add('gp-customer-checkout');
const css=document.createElement('style');css.textContent=`.gp-customer-checkout .gp-staff-only,.gp-customer-checkout #gp-page-enquiry,.gp-customer-checkout #gpSharedCartInfo,.gp-customer-checkout #checkoutInvoices,.gp-customer-checkout #modeBadge,.gp-customer-checkout nav[aria-label="Add more products"]{display:none!important}.gp-customer-checkout .wrap{max-width:760px}.gp-customer-checkout .summary-grid{grid-template-columns:1fr auto}.gp-checkout-help{font-size:13px;line-height:1.6;color:#526077}.gp-checkout-help a{color:#135e9b}.gp-customer-checkout details.card>summary{font-weight:700;cursor:pointer}.gp-customer-checkout #itemBreakdown .card{box-shadow:none}`;document.head.append(css);
document.querySelectorAll('a[href*="admin-orders.html"]').forEach(a=>a.hidden=true);
const hide=el=>el?.classList.add('gp-staff-only');
function hidePair(id){const el=document.getElementById(id);if(!el)return;hide(el.previousElementSibling);hide(el);}
function simplify(){
 document.querySelectorAll('a[href*="admin-orders.html"]').forEach(a=>a.hidden=true);
 const wrap=document.querySelector('.wrap');if(!wrap)return;
 const h=wrap.querySelector('h1');if(h&&h.textContent!=='PS2 — Checkout')h.textContent='PS2 — Checkout';
 const sub=wrap.querySelector('.sub');if(sub&&sub.textContent!=='अपना order देखें, पता भरें और delivery / payment चुनें।')sub.textContent='अपना order देखें, पता भरें और delivery / payment चुनें।';
 // Keep calculator inputs in the DOM so rates, totals and order submission keep working.
 ['sumWeight','sumPacked','sumBox','sumActual','sumVolumetric','sumChargeable','sumRateSource','sumCourierBase','sumCourierGst'].forEach(hidePair);
 hide(document.getElementById('productCard'));hide(document.getElementById('ruleNote'));
 const addon=document.getElementById('addonSelect')?.closest('.card');hide(addon);
 const dims=document.getElementById('actualBoxLength')?.parentElement;if(dims){hide(dims.previousElementSibling);hide(dims);hide(dims.nextElementSibling);}
 document.querySelectorAll('button[onclick*="Bigship"]').forEach(b=>hide(b.parentElement));['bigshipRateStatus','courierRateGuide'].forEach(id=>hide(document.getElementById(id)));
 const vas=document.getElementById('sumVas')?.previousElementSibling;if(vas&&vas.textContent!=='Handling / insurance (2%)')vas.textContent='Handling / insurance (2%)';
 const courier=document.getElementById('sumCourier')?.previousElementSibling;if(courier&&courier.textContent!=='Delivery charge')courier.textContent='Delivery charge';
 const badge=document.getElementById('itemBreakdown')?.closest('.card')?.querySelector('.badge');if(badge&&badge.textContent!=='Your order & final amount')badge.textContent='Your order & final amount';
 const pin=document.getElementById('pincodeStatus');if(pin&&/offline pincode lookup ready/i.test(pin.textContent))pin.textContent='अपना 6-digit PIN code भरें।';
 const oldQR=document.getElementById('paymentQrImage')?.closest('.card');if(oldQR&&oldQR.tagName!=='DETAILS'&&!oldQR.dataset.customerCompact){oldQR.dataset.customerCompact='1';const details=document.createElement('details');details.className='card';const summary=document.createElement('summary');summary.textContent='Pay using QR code';details.append(summary);oldQR.before(details);details.append(...oldQR.childNodes);oldQR.remove();}
 const gst=document.querySelector('input[name="gstInvoice"]')?.closest('.card');if(gst&&gst.tagName!=='DETAILS'&&!gst.dataset.customerCompact){gst.dataset.customerCompact='1';const details=document.createElement('details');details.className='card';const summary=document.createElement('summary');summary.textContent='Need a GST invoice?';details.append(summary);gst.before(details);details.append(...gst.childNodes);gst.remove();}
 if(!document.getElementById('gpPS2CheckoutHelp')){const help=document.createElement('p');help.id='gpPS2CheckoutHelp';help.className='gp-checkout-help';help.innerHTML='<a href="https://gamesplanet13.github.io/ps2/complete-setup.html">← Change PS2 setup</a> · <a href="customer-orders.html">My orders</a><br>Final total और payment amount जाँचकर order WhatsApp पर भेजें।';sub?.after(help);}
}
let queued=false;new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;simplify();});}}).observe(document.body,{childList:true,subtree:true});
simplify();
})();
