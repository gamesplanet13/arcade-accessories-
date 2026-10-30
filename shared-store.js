/* Games Planet: one canonical cart for pages hosted on gamesplanet13.github.io.
 * A checkout URL is a one-time snapshot, not another persistent cart.
 * Reset removes cart selections only; customer order history is preserved.
 */
(function(){
'use strict';
if(window.GPSharedStore?.version===2)return;
const base='https://gamesplanet13.github.io/arcade-accessories-/';
const key='gp_shared_cart_v2',resetKey='gp_shared_cart_reset_v2';
const legacyKeys=['gp_shared_cart_v1','gp_cart','gp-unified-cart-v1','gpz_ps2_cart_v1','gp_order_summary'];
const from=(items,url)=>Array.isArray(items)?items.map(i=>{
 const q=Math.max(0,Math.min(999,Math.floor(Number(i.quantity??i.qty)||0)));
 const p=Number(i.unitPrice??i.price)||0,w=Number(i.unitWeight??i.weight)||0;
 let image=i.image||'';
 try{if(image)image=new URL(image,url||location.href).href}catch{image=''}
 return {...i,name:String(i.name||i.product||'Product'),product:String(i.product||i.name||'Product'),quantity:q,unitPrice:p,lineTotal:p*q,unitWeight:w,lineWeight:w*q,image,dimensions:i.dimensions||i.size||[]};
}).filter(i=>i.quantity>0):[];
function read(){try{const o=JSON.parse(localStorage.getItem(key)||'{}');return o&&typeof o==='object'&&!Array.isArray(o)?o:{}}catch{return {}}}
function save(source,items){if(!source)return read();const all=read(),rows=from(items,location.href);
 if(rows.length)all[source]={items:rows,updatedAt:Date.now()};else delete all[source];
 localStorage.setItem(key,JSON.stringify(all));window.dispatchEvent(new Event('gp-shared-cart-updated'));return all;
}
function items(){return Object.entries(read()).flatMap(([source,v])=>from(v.items||[],location.href).map(i=>({...i,storeSource:source})))}
function replaceItems(list){const next={};for(const i of from(list,location.href)){const source=i.storeSource||'catalog';(next[source]||(next[source]={items:[],updatedAt:Date.now()})).items.push(i)}localStorage.setItem(key,JSON.stringify(next));window.dispatchEvent(new Event('gp-shared-cart-updated'));return items()}
function reset(){localStorage.removeItem(key);for(const k of legacyKeys)localStorage.removeItem(k);
 localStorage.setItem(resetKey,String(Date.now()));
 window.dispatchEvent(new CustomEvent('gp-shared-cart-reset'));return [];
}
function capture(){
 const repo=location.pathname.split('/')[1];
 if(repo==='arcade-accessories-'&&typeof window.buildOrderSummary==='function')save('catalog',window.buildOrderSummary().items||[]);
 if(repo==='ps2fmcb'&&typeof window.gpzCartRead==='function')save('fmcb',window.gpzCartRead().map(i=>({...i,name:i.variant&&i.variant!=='PS2'?i.product+' — '+i.variant:i.product})));
 if(repo==='Gamesplanet_in'&&window.GPCheckout?.rows){
  if(typeof window.GP_STORE_EXPORT_CART==='function')
   try{save('Gamesplanet_in',window.GP_STORE_EXPORT_CART())}catch(e){console.warn('Shared store sync',e)}
 }
 return items();
}
function checkout(source,rows){
 if(source)save(source,rows);else capture();
 const list=items();if(!list.length){alert('Cart is empty / पहले प्रोडक्ट जोड़ें');return}
 const query=new URLSearchParams({source:'cart',shared:'1',storeSource:'shared',cart:JSON.stringify(list),cartAt:String(Date.now())});
 location.href=base+'order-prefill.html?'+query.toString();
}
window.GPSharedStore={version:2,read,save,items,replaceItems,reset,capture,checkout};
function mountSharedCartBar(){
 if(document.getElementById('gpSharedCartDock'))return;
 const nav=document.createElement('div');nav.id='gpSharedCartDock';
 nav.style.cssText='position:fixed;right:12px;bottom:76px;z-index:9900;background:#10253d;color:#fff;border-radius:12px;padding:9px;box-shadow:0 5px 20px #0005;display:flex;align-items:center;gap:7px;font:600 12px system-ui';
 nav.innerHTML='<button id="gpSharedView" type="button" style="border:0;background:#ccf66b;color:#10253d;border-radius:8px;padding:10px;font-weight:800;cursor:pointer">🛒 All Carts <span id="gpSharedCount">0</span> · Edit</button><button id="gpSharedReset" type="button" title="Reset every Games Planet cart" style="border:1px solid #8291a4;background:transparent;color:#fff;border-radius:8px;padding:9px;cursor:pointer">Reset</button>';
 document.body.appendChild(nav);
 const count=()=>{document.getElementById('gpSharedCount').textContent=String(items().reduce((n,i)=>n+(Number(i.quantity)||0),0))};
 nav.querySelector('#gpSharedView').onclick=()=>checkout();
 nav.querySelector('#gpSharedReset').onclick=()=>{if(confirm('Reset every Games Planet cart?')){reset();location.reload()}};
 window.addEventListener('storage',e=>{if(e.key===key)count()});
 window.addEventListener('gp-shared-cart-updated',count);
 count();
}
function start(){
 const checkoutPage=/\/order-prefill\.html$/i.test(location.pathname);
 if(checkoutPage)return; // incoming checkout snapshots are edited in their own screen
 capture();
 mountSharedCartBar();
 if(typeof window.clearCart==='function'&&!window.clearCart.gpResetWrapped){
  const previous=window.clearCart;
  const fn=function(...args){
   // Avoid double confirmation: old clearCart still handles the prompt and local UI.
   const ok=confirm('Reset ALL Games Planet carts across repositories?');
   if(!ok)return;
   reset();
   // Recreate zero-state of visible catalogue without a second prompt.
   if(location.pathname.includes('/arcade-accessories-/')){
    const products=window.products||[],state=window.state;
    if(state&&typeof state==='object')Object.keys(state).forEach(k=>state[k]=0);
    if(typeof window.render==='function')window.render();
    location.reload();
    return;
   }
   return previous.apply(this,args);
  };
  fn.gpResetWrapped=true;window.clearCart=fn;
 }
 if(typeof window.goDetails==='function'&&typeof window.buildOrderSummary==='function')
  window.goDetails=()=>checkout('catalog',window.buildOrderSummary().items);
 if(typeof window.gpzCartSave==='function'&&!window.gpzCartSave.gpSharedWrapped){
  const old=window.gpzCartSave;window.gpzCartSave=function(...args){const v=old.apply(this,args);capture();return v};
  window.gpzCartSave.gpSharedWrapped=true;
 }
 if(typeof window.gpzCartCheckout==='function')
  window.gpzCartCheckout=()=>checkout('fmcb',window.gpzCartRead?.()||[]);
 if(typeof window.gpzCartReset==='function'){
  window.gpzCartReset=()=>{if(!confirm('Reset ALL Games Planet carts?'))return;reset();location.reload()};
 }
 // Sync all tabs: reset elsewhere must immediately clear local, in-memory carts.
 window.addEventListener('storage',e=>{if(e.key===resetKey)location.reload()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();