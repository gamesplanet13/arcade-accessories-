(function(){
'use strict';
const MASTER='https://gamesplanet13.github.io/arcade-accessories-/data/master-products.json';
const norm=n=>String(n||'').trim().toLowerCase().replace(/[‐‑–—−]/g,'-').replace(/\s+/g,' ');
let master=null,scheduled=false;
function applyToProducts(arr,records){
 if(!Array.isArray(arr))return;
 for(const p of arr){
  const m=records[norm(p.name)]||records[norm(p.legacyName)];
  p.stock=m?Math.max(0,Number(m.stock??999)):999;
  p.variantStocks={...(p.variantStocks||{})};
  if(!m)continue;
  if(Number.isFinite(Number(m.price)))p.price=Number(m.price);
  for(const v of p.variants||[]){
   const info=m.variants?.[v];
   if(info){
    p.variantPrices={...(p.variantPrices||{}),[v]:Number(info.price??m.price)};
    p.variantStocks[v]=Math.max(0,Number(info.stock??999));
   }else if(p.variantStocks[v]==null)p.variantStocks[v]=999;
  }
 }
}
function updateBadges(){
 if(!master)return;
 const records=master.records||{};
 const cards=document.querySelectorAll('#products .product, #shopGrid .product-card, #productPageContent .trade-product');
 for(const card of cards){
  const title=card.querySelector('.product-title')||card.querySelector('.product-purchase h1');
  const name=card.dataset.gpStockName||(title?.textContent||'').trim();
  if(!name)continue;card.dataset.gpStockName=name;
  const m=records[norm(name)];const count=m?Math.max(0,Number(m.stock??999)):999;
  let tag=card.querySelector(':scope > .gp-available')||card.querySelector('.product-purchase > .gp-available');
  if(!tag){tag=document.createElement('div');tag.className='gp-available';if(card.classList.contains('trade-product'))(card.querySelector('.product-purchase')||card).prepend(tag);else title?.after(tag);}
  if(tag){tag.textContent=count?'Available Stock: '+count:'Out of Stock';tag.classList.toggle('gp-no-stock',count===0);}
  if(m&&card.querySelector('.variant-list')){
   const rows=card.querySelectorAll('.variant-list .variant-row');
   for(const [i,row] of [...rows].entries()){
    const v=Object.keys(m.variants||{})[i];
    if(!v)continue;
    let st=row.querySelector('.gp-variant-stock');
    if(!st){st=document.createElement('small');st.className='gp-variant-stock';row.querySelector('.variant-label')?.append(st);}
    if(st){const n=Math.max(0,Number(m.variants[v].stock??999));st.textContent='Available: '+n;st.style.color=n===0?'#b42318':'';}
   }
  }
 }
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;updateBadges()});}
const style=document.createElement('style');
style.textContent='.gp-available{display:inline-flex;align-items:center;margin:5px 0;padding:4px 8px;background:#defbe6;color:#135638;border-radius:8px;font-size:12px;font-weight:750;line-height:1.5}.gp-available.gp-no-stock{background:#ffe5e4;color:#a32827}.gp-variant-stock{display:block;font-size:11px;color:#187346;margin-top:3px}.product-card .gp-available{margin:4px 12px 10px}';
document.head.append(style);
async function start(){
 try{
  const res=await fetch(MASTER+'?t='+Date.now(),{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const json=await res.json();if(!json?.records)throw Error('No master product records');
  master=json;window.GP_MASTER_PRODUCTS=json;
  if(typeof products!=='undefined'&&Array.isArray(products)){
   applyToProducts(products,json.records);
   if(typeof render==='function')render();
   document.querySelector('#storeSearch')?.dispatchEvent(new Event('input',{bubbles:true}));
  }
  if(typeof window.GP_APPLY_SHARED_INVENTORY==='function')window.GP_APPLY_SHARED_INVENTORY(json);
  schedule();
  if(!window.GP_STOCK_OBSERVER){const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});window.GP_STOCK_OBSERVER=obs;}
  document.dispatchEvent(new CustomEvent('gp:master-stock-ready',{detail:{updatedAt:json.updatedAt||null}}));
 }catch(e){console.warn('Games Planet central catalog unavailable, using displayed catalog.',e);}
}
window.GP_REFRESH_SHARED_INVENTORY=start;
start();
})();