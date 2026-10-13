(function(){
const brand=document.querySelector('.catalog-brand-row');
const search=document.createElement('form');search.className='store-search';search.innerHTML='<input id="storeSearch" type="search" aria-label="Search products" placeholder="Search controllers, arcade parts, cables…"><button aria-label="Search" type="submit">⌕</button>';brand.insertBefore(search,brand.lastElementChild);
let category='all';
const select=document.getElementById('catalogFilter');
window.filterCatalog=function(value){category=value;apply()};
function apply(){const q=document.getElementById('storeSearch').value.toLowerCase().trim();let count=0;document.querySelectorAll('#products .category-panel').forEach(panel=>{let visible=0;if(panel.dataset.category!=='Mobile Phone Coolers'||category==='Mobile Phone Coolers'||q){panel.classList.add('is-open');panel.querySelector('.category-toggle')?.setAttribute('aria-expanded','true');}panel.querySelectorAll('.product').forEach(card=>{const ok=(category==='all'||panel.dataset.category===category)&&card.textContent.toLowerCase().includes(q);card.style.display=ok?'flex':'none';if(ok)visible++});panel.style.display=visible?'':'none';count+=visible});document.getElementById('storeEmpty').style.display=count?'none':'block';document.getElementById('storeCount').textContent=count+' products to explore';}
search.onsubmit=e=>{e.preventDefault();apply();document.getElementById('products').scrollIntoView({behavior:'smooth'})};search.querySelector('input').oninput=apply;
document.querySelectorAll('[data-shop-category]').forEach(el=>el.onclick=()=>{category=el.dataset.shopCategory;if(select)select.value=category;apply();document.getElementById('products').scrollIntoView({behavior:'smooth'})});
apply();
})();
(function(){const old=window.updateVariantQty;window.updateVariantQty=function(i,v,n){old(i,v,n);paint()};function paint(){document.querySelectorAll('.variant-row').forEach(row=>{const count=Number(row.querySelector('.qty span')?.textContent||0);row.classList.toggle('is-selected',count>0)})}paint()})();
