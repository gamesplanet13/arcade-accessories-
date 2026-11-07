(function(){
'use strict';
const MASTER='https://gamesplanet13.github.io/arcade-accessories-/data/master-products.json';
const norm=n=>String(n||'').trim().toLowerCase().replace(/[‐‑–—−]/g,'-').replace(/\s+/g,' ');
let master=null,scheduled=false;
const normalizeRecords=records=>Object.fromEntries(Object.entries(records||{}).map(([key,value])=>[norm(key),value]));
function applyToProducts(arr,records){
 if(!Array.isArray(arr))return;
 for(const p of arr){
  const m=records[norm(p.name)]||records[norm(p.legacyName)];
  p.stock=m?Math.max(0,Number(m.stock??999)):Math.max(0,Number(p.stock??999));
  p.variantStocks={...(p.variantStocks||{})};
  if(m){
   p.hiddenFromStore=Boolean(m.hiddenFromStore||m.available===false);
   p.available=m.available===false?false:p.available;
  }
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
 const records=normalizeRecords(master.records);
 const cards=document.querySelectorAll('#products .product, #shopGrid .product-card, #productPageContent .trade-product');
 for(const card of cards){
  const title=card.querySelector('.product-title')||card.querySelector('.product-purchase h1');
  const name=card.dataset.gpStockName||(title?.textContent||'').trim();
  if(!name)continue;card.dataset.gpStockName=name;
  const m=records[norm(name)];
  const p=(typeof products!=='undefined'&&Array.isArray(products))?products.find(x=>x.name===name):null;
  const count=m?Math.max(0,Number(m.stock??999)):Math.max(0,Number(p?.stock??999));
  const unavailable=(m?.hiddenFromStore===true||m?.available===false||count===0||p?.hiddenFromStore===true||p?.available===false);
  card.hidden=unavailable;card.dataset.stockHidden=String(unavailable);
  let tag=card.querySelector(':scope > .gp-available')||card.querySelector('.product-purchase > .gp-available');
  if(unavailable){
   if(tag)tag.remove();
   continue;
  }
  if(!tag){
   tag=document.createElement('div');tag.className='gp-available';
   if(card.classList.contains('trade-product'))(card.querySelector('.product-purchase')||card).prepend(tag);
   else title?.after(tag);
  }
  if(tag){const label='Available Stock: '+count;if(tag.textContent!==label)tag.textContent=label;}
  if(m&&card.querySelector('.variant-list')){
   const rows=[...card.querySelectorAll('.variant-list .variant-row')];
   for(const [i,row] of rows.entries()){
    const v=p?.variants?.[i]||Object.keys(m.variants||{})[i];
    if(!v)continue;
    const n=Math.max(0,Number(m.variants?.[v]?.stock??p?.variantStocks?.[v]??999));
    const hidden=n===0||p?.unavailableVariants?.includes(v);
    row.hidden=hidden;row.dataset.stockHidden=String(hidden);
    if(hidden){row.querySelector('.gp-variant-stock')?.remove();continue;}
    let st=row.querySelector('.gp-variant-stock');
    if(!st){st=document.createElement('small');st.className='gp-variant-stock';row.querySelector('.variant-label')?.append(st);}
    if(st){const label='Available: '+n;if(st.textContent!==label)st.textContent=label;}
   }
  }
 }
 document.querySelectorAll('.latest-mini-card').forEach(card=>{
  const name=(card.querySelector('.latest-mini-name')?.textContent||'').trim();
  const m=records[norm(name)];
  if(!name||!m)return;
  const hide=m.hiddenFromStore===true||m.available===false||Number(m.stock)===0;
  card.hidden=hide;card.dataset.stockHidden=String(hide);
 });
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;updateBadges()});}
const style=document.createElement('style');
style.textContent='[data-stock-hidden="true"]{display:none!important}.gp-available{display:inline-block!important;width:max-content!important;max-width:100%!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;word-break:normal!important;overflow-wrap:normal!important;min-height:0!important;min-width:max-content!important;line-height:1.15!important;font-size:10px!important;letter-spacing:0!important;font-weight:400!important;color:#8a919a!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;padding:0!important;margin:2px 0 3px!important}.gp-available.gp-no-stock{color:#a32827!important}.gp-variant-stock{display:inline!important;white-space:nowrap!important;font-size:9px!important;font-weight:400!important;color:#8a919a!important;margin:0 0 0 5px!important;padding:0!important}.product-card .gp-available{margin:2px 0 3px!important}.product-purchase .gp-available{margin:3px 0!important}';
document.head.append(style);
async function start(){
 try{
  const res=await fetch(MASTER+'?t='+Date.now(),{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const json=await res.json();if(!json?.records)throw Error('No master product records');
  master=json;window.GP_MASTER_PRODUCTS=json;
  if(typeof products!=='undefined'&&Array.isArray(products)){
   applyToProducts(products,normalizeRecords(json.records));
   if(typeof render==='function')render();
   document.querySelector('#storeSearch')?.dispatchEvent(new Event('input',{bubbles:true}));
  }
  if(typeof window.GP_APPLY_SHARED_INVENTORY==='function')window.GP_APPLY_SHARED_INVENTORY(json);
  if(typeof window.GP_REFRESH_PRODUCT_VISIBILITY==='function')window.GP_REFRESH_PRODUCT_VISIBILITY();
  if(typeof products!=='undefined'&&typeof window.updateQty==='function'&&!window.GP_STOCK_GUARDS_INSTALLED){
   window.GP_STOCK_GUARDS_INSTALLED=true;
   const originalQty=window.updateQty,originalVariant=window.updateVariantQty;
   const originalSet=window.setTypedQuantity,originalSetVariant=window.setTypedVariantQuantity;
   const limit=(i,v)=>Math.max(0,Math.min(999,Math.floor(Number(products[i]?.variantStocks?.[v]??products[i]?.stock??999))));
   window.updateQty=function(i,n){if(n>0&&(Number(state?.[i])||0)>=limit(i,'')){alert('Only '+limit(i,'')+' units available');return;}return originalQty.apply(this,arguments);};
   if(typeof originalVariant==='function')window.updateVariantQty=function(i,v,n){if(n>0&&(Number(state?.['v_'+i+'_'+v])||0)>=limit(i,v)){alert('Only '+limit(i,v)+' units available');return;}return originalVariant.apply(this,arguments);};
   if(typeof originalSet==='function')window.setTypedQuantity=function(i,v){return originalSet.call(this,i,Math.min(limit(i,''),Math.max(0,Number(v)||0)));};
   if(typeof originalSetVariant==='function')window.setTypedVariantQuantity=function(i,v,q){return originalSetVariant.call(this,i,v,Math.min(limit(i,v),Math.max(0,Number(q)||0)));};
  }

  schedule();
  if(!window.GP_STOCK_OBSERVER){const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});window.GP_STOCK_OBSERVER=obs;}
  document.dispatchEvent(new CustomEvent('gp:master-stock-ready',{detail:{updatedAt:json.updatedAt||null}}));
 }catch(e){console.warn('Games Planet central catalog unavailable, using displayed catalog.',e);}
}
window.GP_REFRESH_SHARED_INVENTORY=start;
start();
})();