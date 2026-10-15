(function(){'use strict';
const modern=location.pathname.split('/').pop().startsWith('new'),prefix=modern?'new-':'';
const page=document.body.dataset.shopPage||'arcade',label=GPShop.pages.find(x=>x[0]===page)?.[1]||'Arcade Accessories';
sessionStorage.setItem('gp_store_view',modern?'new.html':'index.html');sessionStorage.setItem('gp_category_page',page);
const href=slug=>prefix+slug+'.html';
const links=()=>GPShop.pages.map(([slug,title])=>`<a href="${href(slug)}" ${slug===page?'aria-current="page"':''}>${title}</a>`).join('');
const nav=document.createElement('section');nav.className='gp-category-nav';nav.innerHTML=`<div class="gp-page-tools"><button type="button" id="gpBack">← Back / वापस</button><a href="${href('arcade')}">Arcade Home</a><button type="button" id="gpCart">🛒 Cart & Checkout</button><a href="${modern?'':'new-'}${page}.html">${modern?'Classic View':'New View'}</a></div><div class="gp-page-tools" style="margin-top:12px"><a href="https://gamesplanet13.github.io/ps2/" style="background:#ffd079;color:#112031;font-weight:bold">Buy PS2 →</a><a href="cpu-setup.html" style="background:#ffd079;color:#112031;font-weight:bold">Buy CPU Box →</a></div><h1>${label}</h1><p>किसी भी कैटेगरी से प्रोडक्ट जोड़ें — सभी एक ही कार्ट में रहेंगे।</p><nav class="gp-category-links" aria-label="Product categories">${links()}</nav>`;
const catalog=document.getElementById('products');catalog.before(nav);
document.getElementById('gpBack').onclick=()=>{let same=false;try{same=new URL(document.referrer).origin===location.origin}catch(_){}if(same&&history.length>1)history.back();else location.href=href('arcade')};
document.getElementById('gpCart').onclick=()=>scrollToOrderDetails();
const search=document.getElementById('storeSearch');
function apply(){let count=0;const q=search?.value.toLowerCase().trim()||'';document.querySelectorAll('#products .category-panel').forEach(panel=>{let visible=0;panel.classList.add('is-open');panel.querySelectorAll('.product').forEach(card=>{const name=card.querySelector('.product-title')?.textContent;const p=products.find(x=>x.name===name);const ok=p&&!p.aliasOf&&p.shopPages.includes(page)&&(!q||card.textContent.toLowerCase().includes(q));card.hidden=!ok;card.style.display=ok?'':'none';if(ok)visible++});panel.hidden=!visible;panel.style.display=visible?'':'none';count+=visible});const empty=document.getElementById('storeEmpty');if(empty)empty.style.display=count?'none':'block';const ct=document.getElementById('storeCount');if(ct)ct.textContent=count+' products';document.title=label+' | GAMES PLANET';}
window.filterCatalog=value=>{const match=products.find(p=>p.category===value);if(value==='all'){location.href=href('arcade');return}if(match)location.href=href(match.shopPage)};
const select=document.getElementById('catalogFilter');if(select)select.closest('.catalog-controls')?.setAttribute('hidden','');if(select)select.style.display='none';
if(search){search.oninput=apply;search.closest('form').onsubmit=e=>{e.preventDefault();apply()};}
const carousel=document.querySelector('.latest-products-track')?.closest('section');if(carousel)carousel.hidden=true;
document.querySelectorAll('[data-shop-category]').forEach(el=>el.onclick=()=>{const p=products.find(p=>p.category===el.dataset.shopCategory);if(p)location.href=href(p.shopPage)});
const order=document.getElementById('orderList');if(order){const browse=document.createElement('div');browse.className='gp-checkout-browse';browse.innerHTML='<strong>Add more products / और प्रोडक्ट जोड़ें</strong><div>'+links()+'</div>';order.before(browse)}
let timer;function toast(){let t=document.getElementById('gpAdded');if(!t){t=document.createElement('div');t.id='gpAdded';t.className='gp-toast';t.setAttribute('role','status');document.body.append(t)}t.textContent='Added to your shared cart / कार्ट में जुड़ गया';t.hidden=false;clearTimeout(timer);timer=setTimeout(()=>t.hidden=true,1800)}
for(const name of ['updateQty','updateVariantQty']){const old=window[name];window[name]=function(...args){const before=buildOrderSummary().totalQuantity;const r=old(...args);if(buildOrderSummary().totalQuantity>before)toast();return r;}}
apply();
window.addEventListener('pageshow',()=>{let saved;try{saved=GPShop.migrate(JSON.parse(localStorage.getItem('gp_cart')||'{}'),products)}catch(_){saved={}};Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);products.forEach((p,i)=>{const el=document.getElementById('q'+i);if(el)el.textContent=state[i]||0;for(const v of p.variants||[]){const el=document.getElementById('vq'+i+'_'+v.replace(/\s+/g,'_'));if(el)el.textContent=state['v_'+i+'_'+v]||0}});render();apply();});
})();

