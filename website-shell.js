(function(){
'use strict';
const BASE='https://gamesplanet13.github.io/arcade-accessories-/',ROOT='https://gamesplanet13.github.io/',VERSION='20261023-web',path=location.pathname,repo=(path.split('/')[1]||'').toLowerCase(),file=(path.split('/').pop()||'index.html').toLowerCase(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
if(file==='console-store.html')return;
let catalogApply=null;
function main(){
 if(document.body.dataset.gpWebsite==='ready')return;document.body.dataset.gpWebsite='ready';
 const catalog=!!(document.querySelector('#products .product')&&document.querySelector('.gp-category-nav')),selector=/selector|gamelist/.test(repo+' '+file)||!!document.getElementById('storageSize'),checkout=/prefill|checkout|prepaid_order_form/.test(file)||repo==='cod',builder=!catalog&&(/setup|configure|customize/.test(file)||['ps2','arcadebox','ps2now'].includes(repo)),home=document.body.dataset.websiteHome==='true',documentPage=/invoice|label|lable|receipt/.test(repo+' '+file),kind=home?'home':catalog?'catalog':checkout?'checkout':builder?'builder':selector?'selector':'utility';
 document.body.classList.add('gp-unified','gp-ready','gp-'+kind);if(documentPage)document.body.classList.add('gp-document');
 if(!document.getElementById('gp-site-navigation-loader')&&!document.getElementById('gp-menu-toggle')&&!document.getElementById('gp-navigation-loader')){const script=document.createElement('script');script.id='gp-site-navigation-loader';script.src=BASE+'site-navigation.js?v='+VERSION;document.head.append(script)}
 const firstTitle=document.querySelector('h1'),label=home?'Home':catalog?(document.querySelector('.gp-category-nav h1')?.textContent||'Shop'):(/^(games\s*planet|gamesplanet)$/i.test(firstTitle?.textContent.trim()||'')?document.title:firstTitle?.textContent.trim())||document.title.replace(/\s*[|—–]\s*GAMES PLANET.*$/i,'');
 document.querySelectorAll('body>header').forEach(header=>{if(!header.id&&!header.classList.contains('masthead')&&/games\s*planet/i.test(header.textContent)&&header.textContent.length<450){header.classList.add('gp-legacy-header')}});
 if(!home){
  const crumbs=document.createElement('nav');crumbs.className='gp-site-breadcrumbs';crumbs.setAttribute('aria-label','Breadcrumb');
  crumbs.innerHTML='<a href="'+BASE+'">Home</a><span aria-hidden="true">/</span>'+((catalog||builder||selector)?'<a href="'+BASE+'#collections">Shop & collections</a><span aria-hidden="true">/</span>':'')+'<span aria-current="page">'+esc(label)+'</span>';
  const content=document.querySelector('.desktop-layout,main,.wrap,.wrapper,.container,.app,.selector')||document.body.firstElementChild;
  if(content&&content!==document.body)content.before(crumbs);else document.body.prepend(crumbs);
 }
 if(catalog)enhanceCatalog();else if(checkout)enhanceCheckout();else if(builder)enhanceBuilder();else if(selector)enhanceSelector();
 if(!home&&!catalog&&!firstTitle&&!documentPage){const intro=document.createElement('section');intro.className='gp-page-intro';intro.innerHTML='<p class="gp-eyebrow">GAMES PLANET</p><h1>'+esc(label)+'</h1>';document.querySelector('.gp-site-breadcrumbs')?.after(intro)}
 // Keep existing field validation, names and handlers; add accessible names only where missing.
 document.querySelectorAll('input,select,textarea').forEach(input=>{if(input.type==='hidden'||input.hasAttribute('aria-label')||input.hasAttribute('aria-labelledby')||input.labels?.length)return;const nearby=input.previousElementSibling;const text=input.placeholder||(/label/i.test(nearby?.className||'')?nearby.textContent.trim():'');if(text)input.setAttribute('aria-label',text)});
 if(!documentPage)document.querySelectorAll('table').forEach(table=>{if(table.closest('.gp-safe-scroll,.table-wrap,.dataTables_wrapper,.dt-container')||table.offsetParent===null)return;const scroll=document.createElement('div');scroll.className='gp-safe-scroll';table.before(scroll);scroll.append(table)});
 function readyNodes(){decorateHeader();decorateFooter()}
 readyNodes();new MutationObserver(records=>{if(records.some(r=>Array.from(r.addedNodes).some(n=>n.nodeType===1&&['gp-global-navigation','gp-ps2-style-footer'].includes(n.id))))readyNodes()}).observe(document.body,{childList:true});
 document.addEventListener('click',()=>setTimeout(updateCartCount,0));window.addEventListener('gp-cart-updated',updateCartCount);window.addEventListener('storage',updateCartCount);window.addEventListener('pageshow',()=>{updateCartCount();if(catalogApply)setTimeout(catalogApply,0)});window.addEventListener('load',readyNodes,{once:true});
 document.body.dispatchEvent(new CustomEvent('gp-website-ready'));
}
function decorateHeader(){
 const header=document.getElementById('gp-global-navigation');if(!header||header.dataset.websiteReady)return;header.dataset.websiteReady='1';
 const brand=header.querySelector('.gp-menu-brand');if(brand){const a=document.createElement('a');a.className='gp-menu-brand';a.href=BASE;a.innerHTML='GAMES PLANET<small>GAMING · PARTS · SETUPS</small>';brand.replaceWith(a)}
 const cart=document.createElement('a');cart.className='gp-header-cart';cart.href=BASE+'cart.html';cart.innerHTML='Cart <span id="gp-unified-cart-count">0</span>';cart.addEventListener('click',()=>{try{window.GPSharedStore?.capture()}catch(_){}});
 const toggle=document.getElementById('gp-menu-toggle');header.insertBefore(cart,toggle||null);updateCartCount();
 if(document.body.dataset.websiteHome==='true'){
  const nav=document.querySelector('.masthead nav');if(nav&&toggle)nav.append(toggle);header.classList.add('gp-redundant-header');
 }
}
function updateCartCount(){
 let count=0;try{if(window.GPSharedStore)count=GPSharedStore.items().filter(i=>!i.service).reduce((n,i)=>n+(Number(i.quantity)||0),0)}catch(_){}
 for(const id of ['gp-unified-cart-count','home-cart-count']){const el=document.getElementById(id);if(el)el.textContent=count}
 if(document.body.classList.contains('gp-catalog'))updateCatalogBar();
}
function decorateFooter(){
 const footer=document.getElementById('gp-ps2-style-footer');if(!footer||footer.dataset.websiteReady)return;footer.dataset.websiteReady='1';
 const locationSection=footer.querySelector('.gp-map-frame')?.closest('section');if(locationSection&&!locationSection.closest('details')){const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Visit our shop · Address & map';details.append(summary);locationSection.before(details);details.append(locationSection)}
 const links=document.createElement('nav');links.className='gp-context-links';links.setAttribute('aria-label','Website footer');links.innerHTML=[['Home',BASE],['All categories',BASE+'#categories'],['Console Collection',BASE+'console-store.html'],['My Orders',BASE+'customer-orders.html'],['Contact',BASE+'contact.html']].map(([t,u])=>'<a href="'+u+'">'+t+'</a>').join('');footer.querySelector('h2')?.after(links);
}
function enhanceCatalog(){
 const root=document.getElementById('products'),heading=document.querySelector('.gp-category-nav'),cards=Array.from(root.querySelectorAll('.product'));
 const intro=document.createElement('p');intro.className='gp-eyebrow';intro.textContent='THE GAMES PLANET COLLECTION';heading.prepend(intro);
 const contexts=document.createElement('nav');contexts.className='gp-context-links';contexts.style.padding='0';contexts.setAttribute('aria-label','Related collections');contexts.innerHTML=[['All collections',BASE+'#categories'],['Arcade parts',BASE+'arcade.html?view=category'],['Console collection',BASE+'console-store.html'],['CPU parts',BASE+'cpu.html'],['Cables',BASE+'cables.html']].map(([t,u])=>'<a href="'+u+'">'+t+'</a>').join('');heading.append(contexts);
 const toolbar=document.createElement('section');toolbar.className='gp-catalog-toolbar';toolbar.setAttribute('aria-label','Filter products');toolbar.innerHTML='<div class="gp-search-box"><span class="gp-search-symbol" aria-hidden="true">⌕</span><input id="gp-catalog-search" type="search" placeholder="Search products in this collection…" aria-label="Search this collection" autocomplete="off"></div><label><span class="gp-visually-hidden">Sort products</span><select id="gp-catalog-sort" aria-label="Sort products"><option value="default">Recommended order</option><option value="low">Price · Low to high</option><option value="high">Price · High to low</option><option value="name">Name · A to Z</option></select></label><label class="gp-selected-only"><input id="gp-selected-only" type="checkbox">Selected only</label><div class="gp-catalog-result-count" id="gp-catalog-count" role="status"></div>';
 root.before(toolbar);const empty=document.createElement('div');empty.className='gp-catalog-empty';empty.hidden=true;empty.innerHTML='<h2>No products found.</h2><p>Try another name or clear the filters.</p><button type="button">Clear filters</button>';root.after(empty);
 const search=toolbar.querySelector('input[type=search]'),sort=toolbar.querySelector('select'),selected=toolbar.querySelector('input[type=checkbox]'),entries=cards.map((card,index)=>{const name=card.querySelector('.product-title')?.textContent.trim()||card.textContent;let product;try{if(typeof products!=='undefined'&&Array.isArray(products))product=products.find(p=>p.name===name)}catch(_){}const price=product?(window.GPStock?.price(product.name,product.price)??product.price):Number((card.querySelector('.price')?.textContent||'0').replace(/[^\d.]/g,''));return {card,index,name,price,eligible:!card.hidden&&card.style.display!=='none'&&card.dataset.stockHidden!=='true'};});
 root.querySelectorAll('.category-panel').forEach(panel=>{panel.classList.add('is-open');panel.querySelector('.category-toggle')?.setAttribute('aria-expanded','true')});
 const update=()=>{
  const q=search.value.trim().toLowerCase();let visible=0,selectedCount=0;
  for(const e of entries){const chosen=Array.from(e.card.querySelectorAll('.qty span')).some(n=>Number(n.textContent)>0);if(e.eligible&&chosen)selectedCount++;const matches=e.eligible&&(!q||(e.name+' '+e.card.textContent).toLowerCase().includes(q))&&(!selected.checked||chosen);e.card.hidden=!matches;e.card.style.setProperty('display',matches?'':'none');if(matches)visible++}
  root.querySelectorAll('.category-panel').forEach(panel=>{const count=entries.filter(e=>e.card.closest('.category-panel')===panel&&!e.card.hidden).length;panel.hidden=!count;panel.style.display=count?'':'none';const n=panel.querySelector('.cat-count');if(n)n.textContent=count+' products';const container=panel.querySelector('.category-products');if(container&&sort.value!=='default'){const local=entries.filter(e=>e.card.parentElement===container).sort((a,b)=>sort.value==='name'?a.name.localeCompare(b.name):sort.value==='low'?a.price-b.price:b.price-a.price);for(const e of local)container.append(e.card)}else if(container){for(const e of entries.filter(e=>e.card.parentElement===container).sort((a,b)=>a.index-b.index))container.append(e.card)}});
  toolbar.querySelector('#gp-catalog-count').textContent=visible+' products · '+selectedCount+' selected'+(sort.value==='low'||sort.value==='high'?' · Prices sorted within each group':'');empty.hidden=visible>0;updateCatalogBar();
 };
 search.value=new URLSearchParams(location.search).get('q')||'';search.addEventListener('input',update);sort.addEventListener('change',update);selected.addEventListener('change',update);empty.querySelector('button').onclick=()=>{search.value='';selected.checked=false;sort.value='default';update();search.focus()};root.addEventListener('click',event=>{if(event.target.closest('button'))setTimeout(update,0)});catalogApply=update;update();
 const bar=document.createElement('div');bar.className='gp-catalog-bar';bar.id='gp-catalog-bar';bar.innerHTML='<div><small id="gp-bar-count">Your selected products</small><strong id="gp-bar-total">₹0</strong></div><div class="gp-cart-actions"><button class="gp-view-selection" type="button">View selection</button><button class="gp-start-checkout" type="button">Continue to checkout ↗</button></div>';document.body.append(bar);document.body.style.paddingBottom='90px';bar.querySelector('.gp-view-selection').onclick=()=>document.getElementById('orderDetailsSection')?.scrollIntoView({behavior:'smooth',block:'start'});bar.querySelector('.gp-start-checkout').onclick=()=>{if(window.GPSharedStore)GPSharedStore.checkout();else if(typeof window.goDetails==='function')window.goDetails()};updateCatalogBar();
 const total=document.getElementById('total');if(total)new MutationObserver(updateCatalogBar).observe(total,{childList:true,subtree:true,characterData:true});
 const packing=document.querySelector('.desktop-right');if(packing){const tools=document.createElement('details');tools.className='gp-packing-tools';tools.innerHTML='<summary>Product picture & packing tools <span>Optional</span></summary>';document.getElementById('orderDetailsSection')?.append(tools);tools.append(packing)}
}
function updateCatalogBar(){
 const amount=document.getElementById('gp-bar-total');if(!amount)return;let total=0,count=0;
 try{if(typeof window.buildOrderSummary==='function'){const s=window.buildOrderSummary();total=s.productTotal;count=s.totalQuantity}else{total=Number(document.getElementById('total')?.textContent.replace(/[^\d.]/g,''))||0;count=Number(document.getElementById('topCartItemCount')?.textContent)||0}}catch(_){}
 amount.textContent=money(total);document.getElementById('gp-bar-count').textContent=count+' selected item'+(count===1?'':'s')+' · Courier at checkout';
 const checkout=document.querySelector('#gp-catalog-bar .gp-start-checkout');if(checkout)checkout.disabled=!count;
}
function enhanceCheckout(){
 const steps=[],seen=new Set();for(const card of document.querySelectorAll('.card')){const badge=card.querySelector('.badge'),name=badge?.textContent.trim();if(!name||card.hidden||seen.has(name))continue;const label=/customer/i.test(name)?'Your details':/product|breakdown/i.test(name)?'Your products':/payment|gst/i.test(name)?'Payment':/delivery|courier/i.test(name)?'Delivery':/summary|total/i.test(name)?'Review':null;if(!label||seen.has(label))continue;seen.add(label);card.classList.add('gp-step-card');if(!card.id)card.id='gp-checkout-step-'+steps.length;steps.push({id:card.id,label})}
 if(steps.length>1)addSteps(steps,document.querySelector('.wrap h1,.container h1,main h1'));
 const title=document.querySelector('.wrap>h1');if(title){title.textContent='Complete your order.';const sub=document.querySelector('.wrap>.sub');if(sub)sub.textContent='Review your products, enter your details, then choose delivery and payment.'}
}
function enhanceBuilder(){
 const contexts=document.createElement('nav');contexts.className='gp-context-links';contexts.setAttribute('aria-label','Setup collections');contexts.innerHTML=[['All setups',BASE+'#collections'],['Consoles',BASE+'console-store.html'],['CPU setups',BASE+'cpu-setup.html'],['Arcade boxes',BASE+'arcade-box.html']].map(([t,u])=>'<a href="'+u+'">'+t+'</a>').join('');document.querySelector('.gp-site-breadcrumbs')?.after(contexts);
 const steps=[];for(const h of Array.from(document.querySelectorAll('main h2,.container>h2')).slice(0,5)){const section=h.closest('section,.card')||h;if(!section.id)section.id='gp-builder-step-'+steps.length;steps.push({id:section.id,label:h.textContent.replace(/\s*\/.*$/,'').slice(0,32)})}if(steps.length>1)addSteps(steps,contexts);
}
function enhanceSelector(){
 const system=/ps2/.test(repo+' '+file)?'PS2':/ps3/.test(repo+' '+file)?'PS3':/ps4/.test(repo+' '+file)?'PS4':/pc/.test(repo+' '+file)?'PC':'';
 const intro=document.createElement('section');intro.className='gp-page-intro';intro.innerHTML='<p class="gp-eyebrow">YOUR GAME LIBRARY</p><h1>Choose your '+esc(system?system+' games.':'games.')+'</h1><p>Choose the right storage, find your titles and review your selection before sharing.</p>';document.querySelector('.gp-site-breadcrumbs')?.after(intro);
 const title=document.querySelector('body>h1,.brand h1,header h1');if(title&&/games\s*planet/i.test(title.textContent))title.classList.add('gp-title-replaced');
 const nav=document.createElement('nav');nav.className='gp-context-links';nav.setAttribute('aria-label','Game selectors');nav.innerHTML=[['PS2',ROOT+'ps2gameselector/'],['PS3',ROOT+'gameselector/ps3_selector.html'],['PS4',ROOT+'gameselector/PS4_GAME_SELECTOR.html'],['PC',ROOT+'PCGAMESELECTOR/'],['Buy a console',BASE+'console-store.html']].map(([t,u])=>'<a href="'+u+'">'+t+'</a>').join('');document.querySelector('.gp-site-breadcrumbs')?.after(nav);
}
function addSteps(steps,anchor){if(!anchor)return;const nav=document.createElement('nav');nav.className='gp-flow-steps';nav.setAttribute('aria-label','Page steps');nav.innerHTML=steps.map((s,i)=>'<a href="#'+esc(s.id)+'"><b>'+(i+1)+'</b>'+esc(s.label)+'</a>').join('');anchor.after(nav)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',main,{once:true});else main();
})();
