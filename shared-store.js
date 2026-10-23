(function(){
'use strict';
if(window.GPSharedStore)return;
const base='https://gamesplanet13.github.io/arcade-accessories-/',key='gp_shared_cart_v1';
const read=()=>{try{const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(_){return {}}};
const normalize=(items,url)=>items.map(i=>{const quantity=Math.max(0,Math.floor(Number(i.quantity??i.qty)||0)),unitPrice=Number(i.unitPrice??i.price)||0,unitWeight=Number(i.unitWeight??i.weight)||0;return {...i,name:String(i.name||i.product||'Product'),quantity,unitPrice,lineTotal:quantity*unitPrice,unitWeight,lineWeight:unitWeight*quantity,image:i.image?new URL(i.image,url).href:'',dimensions:i.dimensions||i.size||[]}}).filter(i=>i.quantity>0);
function save(source,items){const all=read();all[source]={items:normalize(items,location.href),updatedAt:Date.now()};localStorage.setItem(key,JSON.stringify(all));return all}
function items(){return Object.entries(read()).flatMap(([source,v])=>(v.items||[]).map(i=>({...i,storeSource:source})))}
function query(){const list=items();return new URLSearchParams({source:'cart',shared:'1',cart:JSON.stringify(list),base:String(list.reduce((n,i)=>n+i.lineTotal,0)),weight:String(list.reduce((n,i)=>n+i.lineWeight,0)),quantity:String(list.reduce((n,i)=>n+i.quantity,0))})}
function capture(){const repo=location.pathname.split('/')[1];if(repo?.toLowerCase()==='products'&&Array.isArray(window.GP_PRODUCTS)){let saved={};try{saved=JSON.parse(localStorage.getItem('gp_store_cart_v1')||'{}')}catch(_){}save('products',Object.entries(saved).map(([id,quantity])=>{const p=GP_PRODUCTS.find(p=>p.id===id);if(!p)return null;return {name:p.name,product:p.name,quantity,unitPrice:p.price,unitWeight:p.weight||100,dimensions:Array.isArray(p.dimensions)?p.dimensions:[],image:new URL('images/'+p.image,'https://gamesplanet13.github.io/Products/').href,containsBattery:!!p.battery}}).filter(Boolean))}if(repo==='arcade-accessories-'&&typeof window.buildOrderSummary==='function')save('catalog',window.buildOrderSummary().items||[]);if(repo==='ps2fmcb'&&typeof window.gpzCartRead==='function')save('fmcb',window.gpzCartRead().map(i=>({...i,name:i.variant&&i.variant!=='PS2'?i.product+' — '+i.variant:i.product})))}
function checkout(source,rows){if(source)save(source,rows);else capture();if(!items().length){alert('Cart is empty / पहले प्रोडक्ट जोड़ें');return}location.href=base+'order-prefill.html?'+query()}
window.GPSharedStore={read,save,items,capture,checkout};
const isCheckout=/\/order-prefill\.html$/i.test(location.pathname),params=new URLSearchParams(location.search);
if(isCheckout){
 const repo=location.pathname.split('/')[1],canonical=repo==='arcade-accessories-';
 if(canonical&&params.get('shared')==='1'&&!params.has('cart'))history.replaceState(null,'',location.pathname+'?'+query());
 if(params.get('shared')!=='1'){
  let incoming;try{incoming=JSON.parse(params.get('cart')||'null')}catch(_){}
  const source=params.get('storeSource')||(repo==='ps2'?'ps2':repo==='ps2fmcb'?'fmcb':'catalog');
  if(Array.isArray(incoming))save(source,incoming);
  // Keep direct buy queries intact; only merge an explicitly supplied cart.
  if(Array.isArray(incoming)){const q=query();for(const [k,v]of params)if(!['cart','source','base','weight','quantity','shared'].includes(k))q.set(k,v);if(canonical)history.replaceState(null,'',location.pathname+'?'+q);else{location.replace(base+'order-prefill.html?'+q);return}}
  else if(!canonical){location.replace(base+'order-prefill.html?'+params);return}
 }
}
function start(){
 if(isCheckout){
  const old=document.getElementById('gpSharedCartInfo');if(!old){const panel=document.createElement('section');panel.id='gpSharedCartInfo';panel.className='card';const title=document.createElement('h2');title.textContent='Shared Cart / सभी पेजों का कार्ट';panel.append(title);const entries=Object.entries(read()).filter(([,v])=>v.items?.length);for(const [source,v]of entries){const row=document.createElement('p');row.textContent=({catalog:'Accessories, CPU & Arcade Box',ps2:'PS2 Console',fmcb:'FMCB & USB',consoles:'Console Collection · PS2 / PS3 / PS4 / Pro',products:'Product Store'})[source]||source;const edit=document.createElement('a');edit.href=source==='products'?'https://gamesplanet13.github.io/Products/':source==='consoles'?base+'console-store.html':source==='ps2'?'https://gamesplanet13.github.io/ps2/':source==='fmcb'?'https://gamesplanet13.github.io/ps2fmcb/':base+'arcade.html?view=all';edit.textContent=' · Edit products';row.append(edit);panel.append(row)}if(!entries.length){const p=document.createElement('p');p.textContent='आपकी चुनी हुई वस्तुएँ नीचे Order Breakdown में हैं।';panel.append(p)}document.querySelector('.wrap')?.prepend(panel)}
  return;
 }
 capture();
 if(location.pathname.split('/')[1]?.toLowerCase()==='products'){
  const oldAdd=window.addToCart;if(typeof oldAdd==='function')window.addToCart=function(id,buy=false){const result=oldAdd(id,false);capture();if(buy)checkout();return result};
  const button=document.getElementById('checkoutBtn');if(button)button.onclick=event=>{event.preventDefault();capture();checkout()};
 }
 for(const name of ['render','gpzCartSave','gpzCartReset']){const old=window[name];if(typeof old==='function'&&!old.gpSharedWrapped){const fn=function(...args){const result=old.apply(this,args);capture();return result};fn.gpSharedWrapped=true;window[name]=fn}}
 if(typeof window.goDetails==='function'&&typeof window.buildOrderSummary==='function')window.goDetails=()=>checkout('catalog',window.buildOrderSummary().items);
 if(typeof window.ps2Summary==='function'){window.ps2GoCheckout=()=>checkout('ps2',window.ps2Summary().items);window.sendOrderToWhatsApp=window.ps2GoCheckout;}
 if(typeof window.gpzCartCheckout==='function')window.gpzCartCheckout=()=>checkout();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();