(function(){'use strict';
if(window.GPProductGallery)return;
const style=document.createElement('style');style.textContent=`
.gp-photo-host{position:relative!important}.gp-free-sticker{position:absolute;right:3%;top:3%;z-index:2;width:clamp(65px,27%,130px);aspect-ratio:1.1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:1px;background:linear-gradient(145deg,#fff06a,#ffb800);color:#102347;clip-path:polygon(50% 0,61% 9%,75% 5%,80% 18%,95% 24%,91% 39%,100% 50%,91% 61%,95% 76%,80% 82%,75% 95%,61% 91%,50% 100%,39% 91%,25% 95%,20% 82%,5% 76%,9% 61%,0 50%,9% 39%,5% 24%,20% 18%,25% 5%,39% 9%);filter:drop-shadow(0 3px 3px #0005);font-family:system-ui,sans-serif;line-height:1.04;pointer-events:none;transform:rotate(7deg)}.gp-free-sticker strong{font-size:clamp(13px,2.3vw,23px);font-weight:900}.gp-free-sticker b{font-size:clamp(13px,2.4vw,25px);color:#b32e00;font-weight:950}.gp-free-sticker small{font-size:clamp(7px,1vw,10px);font-weight:850}.gallery-main .image-enlarge{top:auto;bottom:14px;right:14px}.gp-inline-controls{display:flex;align-items:center;justify-content:center;gap:20px;padding:8px;font-size:13px}.gp-inline-controls button{border:1px solid #cbd5e1;border-radius:100px;width:36px;height:36px;background:#fff;color:#152238;font-size:22px;cursor:pointer}.gp-lightbox{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:#060c17f2;color:#fff;padding:65px 12px;touch-action:none}.gp-lightbox[hidden]{display:none!important}.gp-lightbox .gp-lightbox-frame img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;touch-action:none;user-select:none}.gp-lightbox button{position:absolute;z-index:2;border:1px solid #ffffff60;background:#16243be6;color:white;border-radius:100px;width:42px;height:42px;font-size:28px;cursor:pointer;display:grid;place-items:center}.gp-lightbox .gp-prev{left:5px;top:48%}.gp-lightbox .gp-next{right:5px;top:48%}.gp-lightbox .gp-close{right:14px;top:14px}.gp-image-count{position:absolute;bottom:20px;left:12px;right:12px;text-align:center;font:14px system-ui}.gp-lightbox button[hidden],.gp-inline-controls[hidden]{display:none!important}.gp-lightbox-frame{position:relative;overflow:hidden;width:100%;height:100%;max-width:1200px;max-height:80vh;min-width:0;min-height:0}.gp-lightbox-frame .gp-free-sticker{width:clamp(75px,23%,130px)}

.gp-lightbox{padding:98px 12px 82px;box-sizing:border-box}
.gp-photo-brand,.gp-photo-link,.gp-led-logo-replacement{position:absolute;z-index:1;pointer-events:none;user-select:none}
.gp-photo-brand[hidden],.gp-led-logo-replacement[hidden]{display:none!important}
.gp-photo-brand{display:flex;align-items:center;gap:7px;white-space:nowrap;text-align:left;font-family:system-ui,sans-serif;text-shadow:0 1px 3px #000;line-height:1.05}
.gp-photo-brand img{display:block;width:34px;height:34px;flex:0 0 34px;object-fit:contain}
.gp-photo-brand strong{display:block;font-size:clamp(13px,3.6vw,18px);font-style:italic;font-weight:900;letter-spacing:.02em;color:#fff}
.gp-photo-brand em{color:#52cfff;font-style:inherit}
.gp-photo-brand small{display:block;margin-top:3px;font-size:10px;font-weight:650;color:#fff}
.gp-photo-brand small::before{content:"";display:inline-block;width:6px;height:6px;margin:0 4px 1px 0;border-radius:50%;background:#36dc7b}
.gp-photo-link{left:12px;right:12px;margin:0;text-align:center;color:#e1edff;font:600 clamp(8px,2.35vw,11px)/1.25 system-ui,sans-serif;overflow-wrap:anywhere;text-shadow:0 1px 3px #000}
.gp-led-logo-replacement{object-fit:contain;background:#080d1a;border-radius:40%}
.gp-lightbox .gp-lightbox-frame img{cursor:zoom-in;transform-origin:center;user-select:none;-webkit-user-drag:none}
.gp-lightbox .gp-lightbox-frame.gp-is-zoomed img{cursor:grab}
.gp-lightbox .gp-lightbox-frame.gp-is-zoomed img:active{cursor:grabbing}
.gp-lightbox .gp-image-count{left:55px;right:55px;bottom:25px;font-size:12px;pointer-events:none}
.gp-lightbox .gp-zoom-out,.gp-lightbox .gp-zoom-in{bottom:12px}
.gp-lightbox .gp-zoom-out{left:12px}.gp-lightbox .gp-zoom-in{right:12px}

`;
document.head.append(style);
let items=[],index=0,lastFocus,scrollBefore='',hasHistory=false;
const modal=document.createElement('div');modal.className='gp-lightbox';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Product image gallery');
const publicLink='https://gamesplanet13.github.io/arcade-accessories-/';
const logoSrc=new URL('games-planet-icon-512.png',document.currentScript.src).href;
const photoSelector=[
 '.product .image-row img','.product img.variant-thumb','.product-gallery img',
 '.gp-free-games img','.thumb img','.console-card img','.addon img','.accessory img',
 '[data-gp-gallery] img','img.free-games-poster','img.product-photo','a.product-photo img',
 '.choice img','.gp-ps2-extra-line img','img.gp-itemized-thumb',
 '[data-cpu-mode] .line img','#gpReadyCpuGalleryImage'
].join(',');
const brandedLed=/^28mm-led-(?:arcade-preview|(?:blue|green|red)-handheld)\.webp$|^28mm-led-(?:blue|green|red)-original-views\.svg$|^(?:led-arcade-(?:blue-option|green-option|red-option|panel-preview)|female-crimp-socket-views)\.svg$/;
function fittedSize(img,width,height){
 if(!img.naturalWidth||getComputedStyle(img).objectFit!=='contain')return {width,height};
 const ratio=Math.min(width/img.naturalWidth,height/img.naturalHeight);
 return {width:img.naturalWidth*ratio,height:img.naturalHeight*ratio};
}

modal.innerHTML='<button type="button" class="gp-close" aria-label="Close image gallery">×</button><button type="button" class="gp-prev" aria-label="Previous product image">‹</button><div class="gp-lightbox-frame"><img alt="" draggable="false"></div><button type="button" class="gp-next" aria-label="Next product image">›</button><button type="button" class="gp-zoom-out" aria-label="Zoom out">−</button><div class="gp-image-count" aria-live="polite"></div><button type="button" class="gp-zoom-in" aria-label="Zoom in">+</button>';document.body.append(modal);
const frame=modal.querySelector('.gp-lightbox-frame');
const photo=frame.querySelector('img');
const brand=document.createElement('div');
brand.className='gp-photo-brand';
brand.innerHTML='<img src="'+logoSrc+'" alt="" draggable="false"><div><strong>GAMES <em>PLANET</em></strong><small>WhatsApp 7983624797</small></div>';
const link=document.createElement('p');
link.className='gp-photo-link';
link.textContent=publicLink;
const ledLogo=document.createElement('img');
ledLogo.className='gp-led-logo-replacement';
ledLogo.src=logoSrc;
ledLogo.alt='';
ledLogo.hidden=true;
modal.append(brand,link,ledLogo);
const pointers=new Map();
let zoom=1,x=0,y=0,start=null,pinch=null,usedPinch=false;
const cap=(value,min,max)=>Math.max(min,Math.min(max,value));
function drawZoom(){
 const fit=fittedSize(photo,frame.clientWidth,frame.clientHeight);
 const maxX=Math.max(0,(fit.width*zoom-frame.clientWidth)/2);
 const maxY=Math.max(0,(fit.height*zoom-frame.clientHeight)/2);
 x=cap(x,-maxX,maxX);
 y=cap(y,-maxY,maxY);
 photo.style.transform='translate('+x+'px,'+y+'px) scale('+zoom+')';
 frame.classList.toggle('gp-is-zoomed',zoom>1);
 const rect=frame.getBoundingClientRect();
 const photoWidth=fit.width*zoom,photoHeight=fit.height*zoom;
 const photoLeft=rect.left+(rect.width-photoWidth)/2+x;
 const photoTop=rect.top+(rect.height-photoHeight)/2+y;
 const right=Math.min(rect.right,photoLeft+photoWidth);
 const top=Math.max(rect.top,photoTop);
 const bottom=Math.min(rect.bottom,photoTop+photoHeight);
 const file=new URL(photo.src,document.baseURI).pathname.split('/').pop();
 const originalInView=brandedLed.test(file)&&(zoom===1||
  (photoTop+photoHeight*.02>=rect.top&&photoLeft+photoWidth*.99<=rect.right));
 brand.hidden=originalInView;
 brand.style.left=Math.max(12,right-brand.offsetWidth)+'px';
 brand.style.top=Math.max(58,top-brand.offsetHeight-5)+'px';
 link.style.top=(bottom+6)+'px';

 // Replace the hero's controller symbol in its own corner, clear of the text.
 ledLogo.hidden=!originalInView||file!=='28mm-led-arcade-preview.webp';
 ledLogo.style.left=(photoLeft+photoWidth*.821)+'px';
 ledLogo.style.top=(photoTop+photoHeight*.012)+'px';
 ledLogo.style.width=(photoWidth*.07)+'px';
 ledLogo.style.height=(photoHeight*.066)+'px';
}
function zoomAt(next,point,oldPoint=point){
 const rect=frame.getBoundingClientRect();
 const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
 const newZoom=cap(next,1,5);
 const scale=newZoom/zoom;
 x=point.x-cx-(oldPoint.x-cx-x)*scale;
 y=point.y-cy-(oldPoint.y-cy-y)*scale;
 zoom=newZoom;
 drawZoom();
}
function center(){
 const rect=frame.getBoundingClientRect();
 return {x:rect.left+rect.width/2,y:rect.top+rect.height/2};
}
function resetZoom(){
 zoom=1;x=0;y=0;pointers.clear();start=null;pinch=null;usedPinch=false;
 drawZoom();
}
function midpoint(){
 const [a,b]=pointers.values();
 return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(b.x-a.x,b.y-a.y)};
}
const pointerPosition=e=>({x:e.clientX,y:e.clientY});
frame.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 frame.setPointerCapture(e.pointerId);
 pointers.set(e.pointerId,pointerPosition(e));
 if(pointers.size===1){start=pointerPosition(e);usedPinch=false;}
 if(pointers.size===2){pinch=midpoint();usedPinch=true;}
});
frame.addEventListener('pointermove',e=>{
 const old=pointers.get(e.pointerId);
 if(!old)return;
 const next=pointerPosition(e);
 pointers.set(e.pointerId,next);
 if(pinch&&pointers.size>=2){
  const now=midpoint();
  if(pinch.distance>0)zoomAt(zoom*now.distance/pinch.distance,now,pinch);
  pinch=now;
 }else if(zoom>1&&pointers.size===1){
  x+=next.x-old.x;y+=next.y-old.y;drawZoom();
 }
});
function endPointer(e){
 if(!pointers.delete(e.pointerId))return;
 pinch=pointers.size>=2?midpoint():null;
 if(pointers.size)return;
 if(e.type==='pointerup'&&e.pointerType==='touch'&&start&&!usedPinch&&zoom===1){
  const dx=e.clientX-start.x,dy=e.clientY-start.y;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)step(dx<0?1:-1);
 }
 start=null;
}
for(const name of ['pointerup','pointercancel','lostpointercapture'])frame.addEventListener(name,endPointer);
frame.addEventListener('wheel',e=>{
 e.preventDefault();
 zoomAt(zoom*Math.exp(-e.deltaY*.002),pointerPosition(e));
},{passive:false});
frame.addEventListener('dblclick',e=>zoomAt(zoom>1?1:2,pointerPosition(e)));
photo.addEventListener('load',drawZoom);
window.addEventListener('resize',()=>{if(!modal.hidden)drawZoom();});
modal.querySelector('.gp-zoom-in').onclick=()=>zoomAt(zoom*1.35,center());
modal.querySelector('.gp-zoom-out').onclick=()=>zoomAt(zoom/1.35,center());

const absolute=src=>new URL(src,document.baseURI).href;
function unique(list){return [...new Set(list.filter(Boolean).map(absolute))];}
function badge(host,src){const old=host.querySelector(':scope > .gp-free-sticker');const ps4=/ps4-(slim|pro)-.*black-controller-original\./.test(src);if(!ps4){old?.remove();return;}if(old)return;host.classList.add('gp-photo-host');const el=document.createElement('span');el.className='gp-free-sticker';const count=/ps4-pro-/.test(src)?'13–15':'5–7';el.setAttribute('aria-label',count+' digital offline games free');el.innerHTML='<strong>'+count+'</strong><small>DIGITAL OFFLINE<br>GAMES</small><b>FREE</b>';host.append(el);}
function paint(){const img=photo;img.src=items[index];resetZoom();img.alt='Product image '+(index+1)+' of '+items.length;modal.querySelector('.gp-image-count').textContent=(index+1)+' / '+items.length+' · Pinch to zoom'+(items.length>1?' · Swipe for more':'');modal.querySelectorAll('.gp-prev,.gp-next').forEach(b=>b.hidden=items.length<2);badge(modal.querySelector('.gp-lightbox-frame'),img.src);}
function open(list,src){
 items=unique([src,...list]);
 const order=unique(list);
 if(order.includes(absolute(src)))items=order;
 index=items.indexOf(absolute(src));
 if(modal.hidden){
  lastFocus=document.activeElement;
  scrollBefore=document.body.style.overflow;
  modal.hidden=false;
  document.body.style.overflow='hidden';
  try{history.pushState({...history.state,gpProductGalleryOpen:true},'',location.href);hasHistory=true;}catch(_){hasHistory=false;}
 }
 paint();
 modal.querySelector('.gp-close').focus();
}
function close(fromBack=false){
 if(modal.hidden)return;
 modal.hidden=true;
 document.body.style.overflow=scrollBefore;
 lastFocus?.focus?.();
 if(!fromBack&&hasHistory&&history.state?.gpProductGalleryOpen)history.back();
 hasHistory=false;
}
window.addEventListener('popstate',()=>close(true));
function step(delta){index=(index+delta+items.length)%items.length;paint();}
modal.querySelector('.gp-close').onclick=()=>close();modal.querySelector('.gp-prev').onclick=()=>step(-1);modal.querySelector('.gp-next').onclick=()=>step(1);modal.addEventListener('click',e=>{if(e.target===modal)close();});
document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='Tab'){const controls=[...modal.querySelectorAll('button:not([hidden])')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
function swipe(node,move){let start;node.addEventListener('touchstart',e=>{if(e.touches.length===1)start=[e.touches[0].clientX,e.touches[0].clientY];else start=null;},{passive:true});node.addEventListener('touchend',e=>{if(!start||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)move(dx<0?1:-1);},{passive:true});}
function groupFor(img){const explicit=img.closest('[data-gp-gallery]');if(explicit){try{return unique(JSON.parse(explicit.dataset.gpGallery));}catch(_){}}
 const gallery=img.closest('.product-gallery');if(gallery?.querySelector('.product-thumbnails img'))return unique([...gallery.querySelectorAll('.product-thumbnails img')].map(x=>x.src));const group=img.closest('#products .image-row')||img.closest('.product-gallery,.product,.card,.console-card,.choice,.addon,.accessory,.block,.gp-ps2-extra-line,.line');if(!group)return[img.src];return unique([...group.querySelectorAll('img')].filter(x=>!x.closest('.gp-product-watermark')).map(x=>x.src));}
document.addEventListener('click',e=>{if(e.target.closest('.gp-lightbox'))return;const enlarge=e.target.closest('#enlargeImage');const img=enlarge?document.getElementById('detailImage'):e.target.closest('img');if(!img?.getAttribute('src'))return;if(img.closest('.product-thumbnails'))return;
 const eligible=enlarge||img.matches(photoSelector)||img.closest('.hero');if(!eligible)return;
 // Product-list links continue to open the separate product page.
 if(img.closest('a.product-photo'))return;
 e.preventDefault();e.stopImmediatePropagation();open(groupFor(img),img.src);
},true);
function mount(){
 document.querySelectorAll('img[src*="black-controller-original"]').forEach(img=>{if(img.closest('.gp-lightbox,.product-thumbnails'))return;let host=img.closest('.gallery-main,a.product-photo,.thumb');if(!host){if(!img.parentElement.classList.contains('gp-original-frame')){const frame=document.createElement('span');frame.className='gp-original-frame';frame.style.cssText='display:inline-flex;position:relative;max-width:100%;align-items:center;justify-content:center';img.before(frame);frame.append(img);}host=img.parentElement;}badge(host,img.src);});
 document.querySelectorAll('.gallery-main').forEach(main=>{badge(main,main.querySelector('img')?.src||'');if(main.dataset.gpSlide)return;main.dataset.gpSlide='1';const gallery=main.closest('.product-gallery'),thumbs=[...gallery.querySelectorAll('[data-image]')];if(thumbs.length<2)return;const controls=document.createElement('div');controls.className='gp-inline-controls';controls.innerHTML='<button type="button" aria-label="Previous product photo">‹</button><span></span><button type="button" aria-label="Next product photo">›</button>';main.after(controls);const counter=controls.querySelector('span');const current=()=>Math.max(0,thumbs.findIndex(x=>x.classList.contains('selected')));const sync=()=>{const text=(current()+1)+' / '+thumbs.length;if(counter.textContent!==text)counter.textContent=text;badge(main,main.querySelector('img')?.src||'');};const move=d=>{thumbs[(current()+d+thumbs.length)%thumbs.length].click();sync();};controls.firstElementChild.onclick=()=>move(-1);controls.lastElementChild.onclick=()=>move(1);swipe(main,move);gallery.addEventListener('click',()=>queueMicrotask(sync));sync();});
}
let queued=false;
function scheduleMount(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;mount();});
}
new MutationObserver(scheduleMount).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
mount();window.GPProductGallery={open,close,next:()=>step(1),previous:()=>step(-1)};
})();
