(function(){'use strict';
const modern=location.pathname.split('/').pop().startsWith('new'),prefix=modern?'new-':'';
const page=document.body.dataset.shopPage||'arcade';const file=location.pathname.split('/').pop()||'index.html',view=new URLSearchParams(location.search).get('view');const allView=view==='all'||(view!=='category'&&view!=='new'&&['index.html','classic.html','new.html','arcade.html','new-arcade.html'].includes(file));const newView=view==='new';const label=newView?'New Arrivals':allView?'Arcade Accessories':GPShop.pages.find(x=>x[0]===page)?.[1]||'Arcade Accessories';if(allView)document.body.classList.add('gp-all-categories');
// PS2 Accessories must remain in this store. PS2 consoles use the separate Buy PS2 link.
sessionStorage.setItem('gp_store_view',modern?'new.html':'index.html');sessionStorage.setItem('gp_category_page',page);
const href=slug=>(['arcade-box','consoles'].includes(slug)?slug+'.html':prefix+slug+'.html')+(slug==='arcade'?'?view=category':'');
const allHref=prefix+'arcade.html?view=all';
const overviewPages=[
 ['arcade','Arcade Accessories'],['ps2','PS2 Accessories'],['ps3','PS3 Accessories'],
 ['pc','PC Accessories'],['electrical','Electrical Items'],['cables','Cables'],
 ['batteries','Batteries & Chargers'],
 ...GPShop.pages.filter(([slug])=>!['arcade','ps2','ps3','cpu','electrical','cables','batteries'].includes(slug))
];
const overviewHref=slug=>allHref+'#gp-category-'+slug;
const links=()=>overviewPages.map(([slug,title])=>{
 const url=allView?'#gp-category-'+slug:slug==='pc'?overviewHref(slug):href(slug);
 return `<a href="${url}" ${!allView&&slug===page?'aria-current="page"':''}>${title}</a>`;
}).join('')+`<a href="${prefix}arcade.html?view=new" ${newView?'aria-current="page"':''}>New Products</a><a href="${allHref}" ${allView?'aria-current="page"':''}>Accessories & Electronics</a>`;
const nav=document.createElement('section');nav.className='gp-category-nav';nav.innerHTML=`<div class="gp-page-tools gp-compact-tools"><button type="button" id="gpCart">Cart & Checkout</button><a href="${prefix}arcade.html?view=new">New Arrivals</a></div><h1>${label}</h1><nav class="gp-category-links" aria-label="Product categories">${links()}</nav>`;
const arcadeProductOrder=["28mm Imported Arcade Push Button", "28mm Imported LED Illuminated Arcade Push Button", "Female Push Button Crimp Socket — Pack of 10", "Rasila Handle (Without Switch)", "Rasila Handle with 4 Black Switches", "MD Handle (With Switch)", "MD Switch Button", "Black Switch Button", "ZING Crystal Switch", "4.8mm Handle Switch Connector Pin", "Acrylic Coin Machine", "Acrylic Coin Machine with Switch", "Coin Drop Switch Button", "Coin Packet", "Remote Plate (Red Colour)", "Remote Lead", "USB to PS2/PS3/PC Converter", "10 Core Wire — ₹35 per Meter", "10 Core Wire"];
function arcadeRank(name){const i=arcadeProductOrder.indexOf(name);return i<0?arcadeProductOrder.length:i;}
const catalog=document.getElementById('products');catalog.before(nav);

document.getElementById('gpCart').onclick=()=>scrollToOrderDetails();
const search=document.getElementById('storeSearch');
function categoryProductAllowed(p){
 if(!p?.shopPages?.includes(page))return false;
 // Console setup is separate: do not put PS2 console in PS2 spare parts.
 if(page==='ps2')return p.customType!=='ps2'&&p.category!=='Game Consoles';
 // PS3 Accessories must not contain PS2 cards, even if they are cross-tagged.
 // Genuine PS3 components have their own PS3 product category.
 if(page==='ps3')return p.category==='PS3'||p.name==='USB to PS2/PS3/PC Converter';
 return true;
}
function overviewGroup(p){
 if(p.customType==='ps2')return 'consoles';
 if(p.category==='Computer & Network Accessories'){
  return /\bcables?\b|\bpatch cord\b/i.test(p.name)?'cables':'pc';
 }
 if(/^Ucom PC USB Controller\b/.test(p.name))return 'pc';
 return p.shopPage;
}

function setCategoryOpen(panel,open){
 panel.classList.toggle('is-open',open);
 panel.querySelector('.category-toggle').setAttribute('aria-expanded',String(open));
 panel.querySelector('.category-products').hidden=!open;
}

function arrangeOverview(){
 const original=[...catalog.querySelectorAll('.category-panel')];
 const panels=new Map(overviewPages.map(([slug,title],index)=>{
  const panel=document.createElement('section');
  panel.className='category-panel';
  panel.id='gp-category-'+slug;
  panel.innerHTML=`<button class="category-toggle" type="button" aria-controls="${panel.id}-products">
    <span>${title}</span><span class="cat-count"></span><span class="cat-arrow" aria-hidden="true">⌄</span>
   </button><div class="category-products" id="${panel.id}-products"></div>`;
  panel.dataset.expanded=String(index===0);
  setCategoryOpen(panel,index===0);
  panel.querySelector('button').addEventListener('click',()=>{
   const open=!panel.classList.contains('is-open');
   panel.dataset.expanded=String(open);
   setCategoryOpen(panel,open);
  });
  return [slug,panel];
 }));
 catalog.querySelectorAll('.product').forEach(card=>{
  const product=products.find(p=>p.name===card.querySelector('.product-title')?.textContent);
  if(!product)return;
  const destinations=product.name==='USB to PS2/PS3/PC Converter'?['arcade','ps2','ps3','pc']:[overviewGroup(product)];
  destinations.forEach((slug,index)=>{
   const copy=index?card.cloneNode(true):card;
   if(index)copy.querySelectorAll('[id]').forEach(el=>{if(el.matches('input'))el.dataset.gpQuantitySource=el.id;el.removeAttribute('id');});
   panels.get(slug)?.querySelector('.category-products').append(copy);
  });
 });
 original.forEach(panel=>panel.remove());
 catalog.append(...panels.values());
}

function openLinkedCategory(hash){
 const panel=hash.startsWith('#gp-category-')?document.getElementById(hash.slice(1)):null;
 if(panel&&!panel.hidden){
  panel.dataset.expanded='true';
  setCategoryOpen(panel,true);
 }
}

function orderProductCards(){
 catalog.querySelectorAll('.category-products').forEach(group=>{
  const cards=[...group.querySelectorAll(':scope > .product')];
  cards.sort((a,b)=>arcadeRank(a.dataset.productName||a.querySelector('.product-title')?.textContent)-arcadeRank(b.dataset.productName||b.querySelector('.product-title')?.textContent));
  group.append(...cards);
 });
}
const renderBeforeCategorySync=window.render;
window.render=function(...args){
 const result=renderBeforeCategorySync.apply(this,args);
 catalog.querySelectorAll('[data-gp-quantity-source]').forEach(el=>{el.value=document.getElementById(el.dataset.gpQuantitySource)?.value||'0';});
 return result;
};
function apply(){
 let count=0;
 const q=search?.value.toLowerCase().trim()||'';
 catalog.querySelectorAll('.category-panel').forEach(panel=>{
  let visible=0;
  if(!allView)panel.classList.add('is-open');
  panel.querySelectorAll('.product').forEach(card=>{
   const title=card.querySelector('.product-title');
   const name=card.dataset.productName||(title?.textContent||'');
   card.dataset.productName=name;
   const p=products.find(x=>x.name===name);
   const arcadeExcluded=p&&(allView||page==='arcade')&&(/xbox/i.test(p.name)||(/turbo/i.test(p.name)&&/controller|gamepad/i.test(p.name)));
   const ok=p&&!p.includedOnly&&!p.cpuAddonOnly&&!p.hiddenFromStore&&p.available!==false&&p.stock!==0
    &&(typeof GPStock==='undefined'||GPStock.allowed(p.name))&&(newView||!arcadeExcluded)
    &&!(/xbox/i.test(p.name)&&/controller|gamepad/i.test(p.name))
    &&!p.aliasOf
    &&(newView?p.isNew:allView||categoryProductAllowed(p))&&(!q||card.textContent.toLowerCase().includes(q));
   card.hidden=!ok;
   card.style.display=ok?'':'none';
   if(p?.isNew){
    card.dataset.newProduct='true';
    if(!card.querySelector('.gp-new-badge')){
     const badge=document.createElement('span');
     badge.className='gp-new-badge';badge.textContent='🆕 NEW';
     badge.style.cssText='display:inline-block;background:#0e7490;color:#fff;padding:3px 7px;border-radius:6px;font-weight:bold;margin-bottom:4px';
     title?.prepend(badge);
    }
   }
   if(ok)visible++;
  });
  panel.hidden=!visible;
  panel.style.display=visible?'':'none';
  if(allView){
   panel.querySelector('.cat-count').textContent=visible+' Products';
   setCategoryOpen(panel,Boolean(q)||panel.dataset.expanded==='true');
  }
  count+=visible;
 });
 const empty=document.getElementById('storeEmpty');
 if(empty)empty.style.display=count?'none':'block';
 const counter=document.getElementById('storeCount');
 if(counter)counter.textContent=count+' products';
 document.title=label+' | GAMES PLANET';
}
window.filterCatalog=value=>{const match=products.find(p=>p.category===value);if(value==='all'){location.href=allHref;return}if(match)location.href=href(match.shopPage)};
const select=document.getElementById('catalogFilter');if(select)select.closest('.catalog-controls')?.setAttribute('hidden','');if(select)select.style.display='none';
if(search){search.oninput=apply;search.closest('form').onsubmit=e=>{e.preventDefault();apply()};}
const carousel=document.querySelector('.latest-products-track')?.closest('section');if(carousel)carousel.hidden=true;
document.querySelectorAll('[data-shop-category]').forEach(el=>el.onclick=()=>{const p=products.find(p=>p.category===el.dataset.shopCategory);if(p)location.href=href(p.shopPage)});
const order=document.getElementById('orderList');if(order){const browse=document.createElement('div');browse.className='gp-checkout-browse';browse.innerHTML='<strong>Add more products / और प्रोडक्ट जोड़ें</strong><div>'+links()+'</div>';order.before(browse)}
let timer;function toast(){let t=document.getElementById('gpAdded');if(!t){t=document.createElement('div');t.id='gpAdded';t.className='gp-toast';t.setAttribute('role','status');document.body.append(t)}t.textContent='Added to your shared cart / कार्ट में जुड़ गया';t.hidden=false;clearTimeout(timer);timer=setTimeout(()=>t.hidden=true,1800)}
for(const name of ['updateQty','updateVariantQty']){const old=window[name];window[name]=function(...args){const before=buildOrderSummary().totalQuantity;if(products[args[0]]?.includedOnly)return;const r=old(...args);if(buildOrderSummary().totalQuantity>before)toast();return r;}}

function arrangeConsoleGroups(){
 if(!['consoles','ps4'].includes(page))return;
 const names=['PS4 Consoles','PS4 Accessories','PS2 Console — Original Complete Setup','PS2 Accessories'];
 const groups=names.map((name,index)=>{const panel=document.createElement('section');panel.className='category-panel is-open';panel.dataset.consoleGroup=String(index);const title=document.createElement('h2');title.className='category-toggle';title.textContent=name;panel.append(title);const items=document.createElement('div');items.className='category-products';panel.append(items);return panel;});
 document.querySelectorAll('#products .product').forEach(card=>{const name=card.dataset.productName||card.querySelector('.product-title')?.textContent;const p=products.find(p=>p.name===name);if(p?.shopPages.includes('consoles')&&!p.includedOnly&&p.consoleOrder!==undefined)groups[p.consoleOrder].querySelector('.category-products').append(card);});
 catalog.prepend(...groups);
}
if(allView){
 arrangeOverview();
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#gp-category-"]');
  if(link)openLinkedCategory(link.hash);
 });
 window.addEventListener('hashchange',()=>openLinkedCategory(location.hash));
}else{
 arrangeConsoleGroups();
}
orderProductCards();
apply();
if(allView)openLinkedCategory(location.hash);
window.addEventListener('pageshow',()=>{let saved;try{saved=GPShop.migrate(JSON.parse(localStorage.getItem('gp_cart')||'{}'),products)}catch(_){saved={}};Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,saved);products.forEach((p,i)=>{const el=document.getElementById('q'+i);if(el){const value=String(state[i]||0);if('value' in el)el.value=value;else el.textContent=value};for(const v of p.variants||[]){const el=document.getElementById('vq'+i+'_'+v.replace(/\s+/g,'_'));if(el){const value=String(state['v_'+i+'_'+v]||0);if('value' in el)el.value=value;else el.textContent=value}}});render();apply();});
})();



(function(){const style=document.createElement('style');style.id='all-categories-compact-v1';style.textContent="html body.gp-all-categories #products#products .is-open > .category-products{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(270px,1fr))!important;gap:7px!important;padding:7px!important;align-items:start!important}\nhtml body.gp-all-categories #products#products .product{grid-column:auto!important;grid-row:auto!important;height:auto!important;min-height:0!important;align-self:start!important;margin:0!important;padding:9px!important;gap:5px!important;border-radius:10px!important}\nhtml body.gp-all-categories #products#products .product:not(.has-variants){display:grid!important;grid-template-columns:60px minmax(0,1fr)!important;align-items:center!important}\nhtml body.gp-all-categories #products#products .product .product-title{grid-column:1/-1!important;grid-row:1!important;font-size:14px!important;line-height:1.35!important;margin:0 0 4px!important;min-height:0!important}\nhtml body.gp-all-categories #products#products .product .image-row{grid-column:1!important;grid-row:2!important;order:0!important;width:60px!important;display:flex!important;flex-wrap:wrap!important;min-height:0!important;height:auto!important;gap:3px!important;margin:0!important;padding:0!important}\nhtml body.gp-all-categories #products#products .product .image-row img{width:42px!important;height:42px!important;flex:0 0 42px!important;max-width:100%!important;object-fit:contain!important}\nhtml body.gp-all-categories #products#products .product .image-row.multi-image img{width:27px!important;height:27px!important;flex:0 0 27px!important}\nhtml body.gp-all-categories #products#products .product .info{grid-column:2!important;grid-row:2!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:5px!important;margin:0!important;padding:0!important;min-width:0!important;width:100%!important}\nhtml body.gp-all-categories #products#products .product .price{font-size:15px!important;line-height:1.3!important;padding:5px 7px!important;min-height:0!important}\nhtml body.gp-all-categories #products#products .product .info>div:first-child{flex:0 1 auto!important;width:auto!important}\nhtml body.gp-all-categories #products#products .product .qty{width:96px!important;min-width:96px!important;height:32px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:2px!important}\nhtml body.gp-all-categories #products#products .product .qty button{width:30px!important;min-width:30px!important;height:32px!important;min-height:32px!important;max-height:32px!important;font-size:18px!important;padding:0!important}\nhtml body.gp-all-categories #products#products .product .qty span{font-size:13px!important}\nhtml body.gp-all-categories #products#products .product .product-features{grid-column:1/-1!important;grid-row:3!important;font-size:10px!important;line-height:1.35!important;margin:3px 0!important;padding:5px!important}\nhtml body.gp-all-categories #products#products .product .product-extra-actions{grid-column:1/-1!important;grid-row:4!important;margin:3px 0!important}\nhtml body.gp-all-categories #products#products .product.has-variants{display:block!important}\nhtml body.gp-all-categories #products#products .product.has-variants .info{display:block!important}\nhtml body.gp-all-categories #products#products .product.has-variants .info>div:first-child{display:none!important}\nhtml body.gp-all-categories #products#products .product .variant-list{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:5px!important;min-width:0!important;width:100%!important}\nhtml body.gp-all-categories #products#products .product .variant-row{display:grid!important;grid-template-columns:minmax(0,1fr) 96px!important;gap:5px!important;padding:5px!important;min-height:0!important}\nhtml body.gp-all-categories #products#products .product .variant-label{display:grid!important;grid-template-columns:32px minmax(0,1fr)!important;gap:6px!important;text-align:left!important}\nhtml body.gp-all-categories #products#products .product .variant-thumb{width:32px!important;height:32px!important;max-width:32px!important}\nhtml body.gp-all-categories #products#products .product .variant-label>span{font-size:11px!important;line-height:1.35!important}\nhtml body.gp-all-categories #products#products .product .info small{display:none!important}\nhtml body.gp-all-categories #products#products .product.setup-navigation-card .qty{display:none!important}\nhtml body.gp-all-categories #products#products .product[hidden],html body.gp-all-categories #products#products .product[style*=\"display: none\"],html body.gp-all-categories #products#products .category-panel[hidden],html body.gp-all-categories #products#products .category-products[hidden]{display:none!important}\n@media(max-width:600px){html body.gp-all-categories #products#products .category-products{grid-template-columns:minmax(0,1fr)!important}}\n";document.head.append(style)})();

(function(){const s=document.createElement('style');s.id='category-visibility-fix';s.textContent='#products .product[hidden],#products .category-panel[hidden],.app-live-panel[hidden]{display:none!important}body[data-shop-page="cpu"] .app-live-panel{display:none!important}';document.head.append(s);})();

/* Product-specific demos: load a player only when the customer opens it. */
(function(){
 function mountProductMedia(){
  if(typeof products==='undefined')return;
  document.querySelectorAll('#products .product').forEach(card=>{
   if(card.querySelector('.gp-product-media'))return;
   const name=card.dataset.productName||card.querySelector('.product-title')?.textContent;
   const product=products.find(p=>p.name===name);
   if(!product?.videos?.length&&!product?.imageNote)return;
   const media=document.createElement('div');media.className='gp-product-media';
   if(product.imageNote){const note=document.createElement('p');note.className='gp-image-note';note.textContent=product.imageNote;media.append(note);}
   const videos=(product.videos||[]).filter(v=>/^[\w-]{11}$/.test(v.id));
   if(videos.length){
    const details=document.createElement('details'),summary=document.createElement('summary');
    summary.textContent='▶ Watch product demo / वीडियो देखें';details.append(summary);
    const credit=document.createElement('p');credit.className='gp-demo-credit';credit.textContent=videos[0].channel;details.append(credit);
    const player=document.createElement('div');player.className='gp-product-player';details.append(player);
    details.addEventListener('toggle',()=>{
     if(details.open&&!player.firstChild){
      const frame=document.createElement('iframe');frame.title=videos[0].title;
      frame.src='https://www.youtube-nocookie.com/embed/'+videos[0].id+'?rel=0';
      frame.loading='lazy';frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
      frame.referrerPolicy='strict-origin-when-cross-origin';player.append(frame);
     }else if(!details.open){player.replaceChildren();}
    });
    const links=document.createElement('div');links.className='gp-product-video-links';
    videos.forEach(video=>{const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+video.id;a.target='_blank';a.rel='noopener noreferrer';a.textContent='▶ '+video.label+' ↗';a.title=video.title;links.append(a);});
    details.append(links);media.append(details);
   }
   card.append(media);
  });
 }
 mountProductMedia();window.addEventListener('pageshow',mountProductMedia);
})();


(function(){
 document.querySelectorAll('#products .product').forEach(card=>{
  const name=card.dataset.productName||card.querySelector('.product-title')?.textContent;
  const p=products.find(p=>p.name===name);if(!p)return;
  if(p.customType==='ps2')card.querySelectorAll('a[href*="configure.html"]').forEach(a=>{a.href=GPConsoleCatalog.PS2;a.textContent='PS2 Console Only / Complete / Manual Setup →';});
  if(!p.includedGames)return;
  const box=document.createElement('div');box.className='gp-free-games';box.style.cssText='grid-column:1/-1;grid-row:6;font-size:12px;padding:8px;border:1px solid #3a9467;border-radius:8px';
  const line=document.createElement('strong');line.textContent=p.includedGames.storage+': '+p.includedGames.count+' top digital offline games — FREE';box.append(line,document.createElement('br'));const note=document.createElement('p');note.textContent='No physical disc — only free digital offline games';box.append(note);const poster=document.createElement('img');poster.src=p.includedGames.poster;poster.alt=p.includedGames.storage+' free digital offline games — no physical disc';poster.loading='lazy';poster.style.cssText='display:block;width:100%;max-width:300px;height:auto;border-radius:8px;margin:8px 0';box.append(poster);
  const a=document.createElement('a');a.href=p.includedGames.listUrl;a.target='_blank';a.rel='noopener';a.textContent='PS4 Game List / Selector ↗';box.append(a);card.append(box);
 });
})();

/* Show the 28mm LED button photo in both storefront views. */
(function(){
 const button=products.find(product=>product.panelPhoto);
 if(!button)return;

 const rowLabels=['close-up','multi-angle view','in-hand views'];
 const photoRows=rowLabels.flatMap((label,index)=>button.variants.map(color=>({
  src:button.variantPhotos[color][index],
  alt:color+' LED button — '+label
 })));
 const photos=[{src:button.panelPhoto,alt:'Blue, red and green LED buttons fitted to an arcade panel'},...photoRows];
 const socketName='Female Push Button Crimp Socket — Pack of 10';

 document.querySelectorAll('#products .product').forEach(card=>{
  const title=card.querySelector('.product-title');
  const name=title?.textContent.trim();
  if(name===socketName){
   card.classList.add('arcade-crimp-socket');
   card.id='arcade-crimp-socket';
   return;
  }
  if(name!==button.name)return;
  const importedButton = [...card.parentElement.children].find(product =>
   product.querySelector('.product-title')?.textContent.trim()==='28mm Imported Arcade Push Button'
  );
  if(importedButton)importedButton.after(card);
  card.classList.add('led-arcade-product');
  card.id='led-arcade-push-button';
  let hero=card.querySelector('.image-row');
  if(!hero){
   hero=document.createElement('div');
   hero.className='image-row';
   (card.querySelector('.product-specs')||title).after(hero);
  }
  hero.classList.remove('multi-image');
  hero.dataset.gpGallery=JSON.stringify(photos.map(photo=>photo.src));
  hero.replaceChildren(...photos.map(({src,alt})=>{
   const photo=document.createElement('img');
   photo.src=src;
   photo.alt=alt;
   photo.loading='lazy';
   photo.decoding='async';
   photo.onclick=()=>window.openImg?.(photo.src);
   return photo;
  }));

  const colorByPhoto=new Map(button.variants.map(color=>[button.variantImages[color],color]));
  card.querySelectorAll('img.variant-thumb').forEach(thumb=>{
   const color=colorByPhoto.get(thumb.getAttribute('src'));
   if(color)thumb.dataset.gpGallery=JSON.stringify(button.variantPhotos[color]);
  });
 });
})();

/* Keep all product photos visible and fit the details to the card width. */
(function(){
 const catalog=document.getElementById('products');
 catalog.classList.add('gp-responsive-catalog');
 const byName=new Map(products.map(product=>[product.name,product]));

 const fitSpecs=row=>{
  if(!row.clientWidth)return;
  row.style.removeProperty('--spec-fit');
  const width=row.scrollWidth;
  if(width>row.clientWidth){
   const size=parseFloat(getComputedStyle(row).fontSize);
   row.style.setProperty('--spec-fit',size*(row.clientWidth-5)/width+'px');
  }
 };
 const trackSize=new ResizeObserver(entries=>{
  entries.forEach(({target})=>fitSpecs(target));
 });
 const trackText=new MutationObserver(records=>{
  const rows=new Set(records.map(({target})=>target.closest('.product-specs')));
  rows.forEach(fitSpecs);
 });

 catalog.querySelectorAll('.product').forEach(card=>{
  const specs=card.querySelector(':scope > .product-specs');
  if(specs){
   const pack=specs.querySelector(':scope > span:nth-child(3):not(.gp-available)');
   if(pack){
    pack.classList.add('gp-product-pack');
    specs.after(pack);
   }
   trackSize.observe(specs);
   trackText.observe(specs,{childList:true,subtree:true});
  }
  const title=card.querySelector('.product-title');
  const product=byName.get(title?.textContent.trim());
  if(!product?.variantImages||card.classList.contains('led-arcade-product'))return;
  let row=card.querySelector(':scope > .image-row');
  if(!row){
   row=document.createElement('div');
   row.className='image-row';
   (specs||title).after(row);
  }
  const existing=new Set([...row.querySelectorAll('img')].map(image=>image.getAttribute('src')));
  for(const color of product.variants||[]){
   const src=product.variantImages[color];
   if(!src||existing.has(src)||product.unavailableVariants?.includes(color)||product.variantStocks?.[color]===0)continue;
   const photo=document.createElement('img');
   photo.src=src;
   photo.alt=product.name+' — '+color;
   photo.loading='lazy';
   photo.decoding='async';
   photo.onclick=()=>window.openImg?.(photo.src);
   row.append(photo);
   existing.add(src);
  }
 });
})();

;(function(){const s=document.createElement('script');s.src=(window.GP_ASSET_BASE||'')+'product-gallery.js?v=20261120-transparent-watermark';document.head.append(s);})();

;(function(){const style=document.createElement('style');style.textContent='#products#products .product .product-specs{display:flex!important}';document.head.appendChild(style)})();

(function(){const style=document.createElement('style');style.textContent="html body #products#products#products .category-products > .product{display:flex!important;flex-direction:column!important}html body #products#products#products .product > .image-row{order:-5!important}html body #products#products#products .product > .product-title{order:-4!important}html body #products#products#products .product > .product-specs{order:-3!important}html body #products#products#products .product > .product-features{order:-2!important}html body #products#products#products .product > .product-extra-actions{order:-1!important}html body #products#products#products .product > .info{order:0!important}";document.head.append(style)})();

/* Keep each photo with its price and quantity, without repeating variant photos. */
(function(){
 const css=document.createElement('style');
 const scope='html body #products#products#products#products .product:not(.led-arcade-product)';
 css.textContent=[
  scope+'{display:flex!important;flex-direction:column!important;min-width:0!important}',
  scope+'>.product-title{order:-5!important}',
  scope+'>.gp-photo-purchase-line,'+scope+'.has-variants>.info{order:-4!important}',
  scope+'>.product-specs{order:-3!important}',
  scope+'>.product-features{order:-2!important}',
  scope+'>.product-extra-actions{order:-1!important}',
  scope+' .gp-photo-purchase-line{display:grid!important;grid-template-columns:minmax(64px,1fr) auto!important;align-items:center!important;gap:8px!important;min-width:0!important}',
  scope+' .gp-photo-purchase-line>.info{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:8px!important;margin:0!important;width:auto!important;min-width:0!important}',
  scope+' .gp-photo-purchase-line>.info>div:first-child{display:block!important;width:auto!important;min-width:0!important}',
  scope+' .gp-photo-purchase-line .info small{display:none!important}',
  scope+' .gp-photo-purchase-line .image-row,'+scope+' .gp-row-photos{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:6px!important;width:auto!important;min-width:0!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;margin:0!important;padding:0!important;grid-column:auto!important;grid-row:auto!important}',
  scope+' .gp-photo-purchase-line .image-row img,'+scope+' .gp-row-photos img{display:block!important;flex:0 0 80px!important;width:80px!important;height:80px!important;min-width:80px!important;max-width:80px!important;max-height:80px!important;object-fit:contain!important;position:static!important;margin:0!important;transform:none!important}',
  scope+'.has-variants>.info{display:block!important;margin:0!important;width:100%!important}',
  scope+'.has-variants>.info>div:first-child:not(.variant-list){display:none!important}',
  scope+' .variant-list{display:grid!important;grid-template-columns:minmax(0,1fr)!important;width:100%!important;gap:8px!important}',
  scope+' .variant-row{display:grid!important;grid-template-columns:minmax(64px,1fr) minmax(52px,auto) 92px!important;align-items:center!important;gap:6px!important;min-width:0!important;padding:4px 0!important}',
  scope+' .variant-label{display:block!important;min-width:0!important;width:auto!important;margin:0!important;grid-column:auto!important;grid-row:auto!important;font-size:11px!important;line-height:1.25!important}',
  scope+' .variant-label>span{font-size:11px!important;line-height:1.25!important}',
  scope+' .qty{display:flex!important;flex-flow:row nowrap!important;align-items:center!important;gap:2px!important;width:92px!important;min-width:92px!important;max-width:92px!important;flex:0 0 92px!important;margin:0!important}',
  scope+' .qty button{width:28px!important;min-width:28px!important;max-width:28px!important;height:32px!important;min-height:32px!important;padding:0!important;font-size:18px!important}',
  scope+' .qty input,'+scope+' .qty>span{width:30px!important;min-width:30px!important;max-width:30px!important;padding:0!important;text-align:center!important;font-size:13px!important}',
  scope+' .price{font-size:15px!important;padding:4px 6px!important;white-space:nowrap!important;line-height:1.2!important;min-height:0!important}',
  '@media(max-width:359px){'+scope+' .gp-photo-purchase-line .image-row img,'+scope+' .gp-row-photos img{width:64px!important;height:64px!important;min-width:64px!important;max-width:64px!important;max-height:64px!important;flex-basis:64px!important}'+scope+' .variant-row{grid-template-columns:minmax(64px,1fr) minmax(44px,auto) 92px!important;gap:4px!important}}'
 ].join('');
 document.head.append(css);
 const absolute=src=>new URL(src,document.baseURI).href;
 document.querySelectorAll('#products .product').forEach(card=>{
  const title=card.dataset.productName||card.querySelector('.product-title')?.textContent;
  const product=products.find(p=>p.name===title);
  if(!product||card.classList.contains('led-arcade-product'))return;
  const info=card.querySelector(':scope > .info');
  const gallery=card.querySelector(':scope > .image-row');
  if(!info)return;
  const rows=[...info.querySelectorAll('.variant-row')];
  const seen=new Set();
  if(rows.length){
   const photoRows=rows.map((row,index)=>{
    const strip=document.createElement('div');strip.className='gp-row-photos image-row';
    const image=row.querySelector('.variant-thumb');
    if(image&&!seen.has(absolute(image.src))){seen.add(absolute(image.src));strip.append(image);}
    else image?.remove();
    row.prepend(strip);
    return {strip,variant:product.variants?.[index]||''};
   });
   for(const image of [...(gallery?.querySelectorAll('img')||[])]){
    const src=absolute(image.src);
    if(seen.has(src)){image.remove();continue;}
    seen.add(src);
    const target=photoRows.find(({variant})=>(product.variantPhotos?.[variant]||[]).some(photo=>absolute(photo)===src))
     ||photoRows.find(({variant})=>variant&&src.toLowerCase().includes(variant.toLowerCase().split(' ')[0]))
     ||photoRows[0];
    target.strip.append(image);
   }
   gallery?.remove();
  }else if(gallery){
   gallery.querySelectorAll('img').forEach(image=>{
    const src=absolute(image.src);
    if(seen.has(src))image.remove();else seen.add(src);
   });
   const row=document.createElement('div');row.className='gp-photo-purchase-line';
   card.insertBefore(row,gallery);row.append(gallery,info);
  }
 });
})();

(function(){const s=document.createElement('style');s.textContent='html body #products#products#products#products .product .gp-photo-purchase-line>.info{grid-column:2!important;grid-row:1!important}html body #products#products#products#products .product .gp-photo-purchase-line>.image-row{grid-column:1!important;grid-row:1!important}';document.head.append(s)})();
