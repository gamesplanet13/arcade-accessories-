(function(){
'use strict';
const rule=GPStock,oldQty=window.updateQty,oldVariant=window.updateVariantQty;
window.updateQty=function(i,n){
 if(n>0&&!rule.allowed(products[i]?.name)){return;}
 return oldQty.apply(this,arguments);
};
if(typeof oldVariant==='function')window.updateVariantQty=function(i,v,n){
 if(n>0&&!rule.allowed(products[i]?.name,v)){return;}
 if(n>0&&products[i]?.variantStocks?.[v]!=null&&(Number(state['v_'+i+'_'+v])||0)>=products[i].variantStocks[v])return;
 return oldVariant.apply(this,arguments);
};
function updateVisibility(){
 let changed=false;
 // Clean saved carts too: archived products may have no visible card to inspect.
 products.forEach((p,i)=>{
  if(!rule.allowed(p.name)&&state[i]){state[i]=0;changed=true;}
  for(const v of p.variants||[]){
   const key='v_'+i+'_'+v;
   if(!rule.allowed(p.name,v)&&state[key]){state[key]=0;changed=true;}
   const limit=p.variantStocks?.[v];
   if(limit!=null&&state[key]>limit){state[key]=limit;changed=true;}
  }
 });
 document.querySelectorAll('#products .product').forEach(card=>{
  const name=(card.querySelector('.product-title')?.textContent||'').trim();
  const p=products.find(item=>item.name===name);
  if(!p)return;
  const hidden=!rule.allowed(p.name);
  card.hidden=hidden;card.dataset.stockHidden=String(hidden);
  if(hidden){
   const i=products.indexOf(p);
   if(state[i]){state[i]=0;changed=true;}
  }
  const rows=[...card.querySelectorAll('.variant-list .variant-row')];
  rows.forEach((row,index)=>{
   const v=p.variants?.[index];
   if(!v)return;
   const hide=hidden||!rule.allowed(p.name,v);
   if(!hide&&p.variantStocks?.[v]!=null){
    let stock=row.querySelector('.gp-variant-stock');
    if(!stock){stock=document.createElement('small');stock.className='gp-variant-stock';row.querySelector('.variant-label')?.append(stock);}
    stock.textContent='Available: '+p.variantStocks[v];
   }
   row.hidden=hide;row.dataset.stockHidden=String(hide);
   if(hide){
    const key='v_'+products.indexOf(p)+'_'+v;
    if(state[key]){state[key]=0;changed=true;}
   }
  });

 });
 document.querySelectorAll('.latest-mini-card').forEach(card=>{
  const name=(card.querySelector('.latest-mini-name')?.textContent||'').trim();
  if(!name)return;
  const hide=!rule.allowed(name);
  card.hidden=hide;card.dataset.stockHidden=String(hide);
 });
 if(changed){
  try{localStorage.setItem('gp_cart',JSON.stringify(state));}catch(e){}
  if(typeof window.render==='function')window.render();
 }
}
const style=document.createElement('style');
style.textContent='[data-stock-hidden="true"]{display:none!important}.qty button:disabled{cursor:not-allowed;opacity:.35}';
document.head.append(style);
window.GP_REFRESH_PRODUCT_VISIBILITY=updateVisibility;
updateVisibility();
document.addEventListener('gp:master-stock-ready',updateVisibility);
})();