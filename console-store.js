(function(){
'use strict';
const D=window.GP_CONSOLE_DATA,$=id=>document.getElementById(id),money=n=>'₹'+Number(n).toLocaleString('en-IN'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ROOT='https://gamesplanet13.github.io/',PS2_IMAGE=ROOT+'ps2/images/Ps2slim7x.jpg',KEY='gp_console_builder_v1',CART='gp_console_builds_v1';
const families=[{id:'ps2',name:'PS2 Slim',label:'THE CLASSIC',image:PS2_IMAGE,price:8500},{id:'ps3',name:'PS3 Slim',label:'THE NEXT CHAPTER',image:ROOT+'Renewedconsole/images/ps3slim.jpeg'},{id:'ps4',name:'PS4 Slim',label:'THE EVERYDAY PLAYER',image:ROOT+'Renewedconsole/images/Ps4slim12.02blk.jpeg'},{id:'ps4pro',name:'PS4 Pro',label:'THE POWER PLAYER',image:ROOT+'Renewedconsole/images/Ps4pro1tb9.0.jpeg'}];
for(const f of families)if(f.id!=='ps2')f.price=Math.min(...D.models.filter(m=>m.family===f.id).map(m=>m.price));
const integer=(v,min=0,max=99)=>Math.min(max,Math.max(min,Math.floor(Number(v)||0)));
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch(_){return fallback}}
let state={family:'ps2',ps2:{mode:'complete',storage:'32GB',pack:'top',controllers:1,warranty:0,adapter:true,memory:true,av:true,multitap:false,extra:{}},models:{},extras:{},services:{}};
const saved=read(KEY,null);if(saved&&typeof saved==='object'){
 if(families.some(f=>f.id===saved.family))state.family=saved.family;
 if(saved.ps2&&typeof saved.ps2==='object')Object.assign(state.ps2,saved.ps2);
 for(const key of ['models','extras','services'])if(saved[key]&&typeof saved[key]==='object'&&!Array.isArray(saved[key]))state[key]=saved[key];
}
if(!['console','complete','manual'].includes(state.ps2.mode))state.ps2.mode='complete';
if(!D.ps2.PACKS[state.ps2.storage])state.ps2.storage='32GB';
if(!['top','optional'].includes(state.ps2.pack))state.ps2.pack='top';
if(![0,3,6,12,24].includes(Number(state.ps2.warranty)))state.ps2.warranty=0;
if(!state.ps2.extra||typeof state.ps2.extra!=='object')state.ps2.extra={};
const requested=new URLSearchParams(location.search).get('console');if(families.some(f=>f.id===requested))state.family=requested;
let builds=read(CART,[]);if(!Array.isArray(builds))builds=[];
builds=builds.filter(b=>b&&typeof b.label==='string'&&Array.isArray(b.items)&&b.items.every(i=>Number.isFinite(i.unitPrice)&&i.unitPrice>=0&&Number.isInteger(i.quantity)&&i.quantity>0));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){} }
function item(name,price,quantity=1,meta={},service=false){return {name,product:name,quantity,unitPrice:price,baseUnitPrice:price,lineTotal:price*quantity,unitWeight:meta.weight||0,lineWeight:(meta.weight||0)*quantity,dimensions:meta.dimensions||[],image:meta.image||'',containsBattery:!!meta.containsBattery,service};}
function model(){return D.models.find(m=>m.family===state.family&&m.id===state.models[state.family])||D.models.find(m=>m.family===state.family)}
function extraList(){if(state.family==='ps2')return D.ps2.ADDONS.map(a=>({...a,id:String(a.i),weight:D.ps2.META[a.i]?.weight||0,dimensions:D.ps2.META[a.i]?.dimensions||[],image:D.ps2.META[a.i]?.image||''}));return D.extras.filter(a=>a.families.includes(state.family));}
function quantities(){return state.family==='ps2'?state.ps2.extra:(state.extras[state.family]||(state.extras[state.family]={}));}
function build(){
 const rows=[],included=[];let label,image,warranty,description;
 if(state.family==='ps2'){
  const c=state.ps2,mode=c.mode,consoleOnly=mode==='console',controllers=integer(c.controllers,mode==='complete'?1:0),storage=consoleOnly?'none':c.storage,drive=D.ps2.PACKS[storage],adapter=mode==='complete'||(!consoleOnly&&c.adapter),memory=mode==='complete'||(!consoleOnly&&c.memory),av=mode==='complete'||(!consoleOnly&&c.av),count=consoleOnly?0:controllers;
  const components=[{name:'PS2 Slim Black Console',quantity:1,image:PS2_IMAGE}];
  let price=8500,weight=900;
  if(adapter){price+=599;weight+=340;components.push({name:'Power Adapter + Power Cable',quantity:1,image:D.ps2.META[0].image})}
  if(memory){price+=469;weight+=25;components.push({name:'8MB Memory Card + Software',quantity:1,image:D.ps2.META[9].image})}
  if(av){price+=99;weight+=70;components.push({name:'Standard AV Cable',quantity:1,image:D.ps2.META[1].image})}
  if(count){price+=375*count;weight+=250*count;components.push({name:'Black Wired Controller',quantity:count,image:D.ps2.META[10].image})}
  if(storage!=='none'){
   price+=drive[c.pack];weight+=drive.weight;
   components.push({name:storage+' Game Drive · '+(c.pack==='top'?'Top Games':'Optional Games'),quantity:1,image:ROOT+'arcade-accessories-/images/jpeg/'+(/256|500/.test(storage)?'usbhdd-1.jpeg':storage==='32GB'?'32gbusb.jpeg':'sandiscultra-1.jpeg')});
  }
  const driveLabel=storage==='none'?'No Game Drive':storage+' · '+(c.pack==='top'?'Top Games':'Optional Games');
  label=consoleOnly?'PS2 Black Slim · Console Only':'PS2 '+(mode==='manual'?'Manual':'Complete')+' Setup · '+driveLabel+' · '+count+' Wired Controller'+(count===1?'':'s');image=PS2_IMAGE;
  const base=item(label,price,1,{weight,dimensions:consoleOnly?[23,15.2,3]:[35,35,10],image});base.components=components;base.variant=components.map(x=>x.name+' × '+x.quantity).join(' · ');base.includedControllers=count;rows.push(base);included.push(...components);
  const w=consoleOnly?0:Number(c.warranty),wprice=({0:0,3:400,6:600,12:1000,24:1700})[w]||0;
  warranty=w===0?'7 Days':w>=12?(w/12)+' Year'+(w>12?'s':''):w+' Months';
  rows.push(item('PS2 Console Warranty — '+warranty,wprice,1,{},true));
  if(!consoleOnly&&c.multitap){rows.push(item('PS2 USB Multi Tap',D.ps2.USB_MULTITAP_PRICE,1,D.ps2.USB_MULTITAP_META));included.push({name:'PS2 USB Multi Tap',quantity:1,image:D.ps2.USB_MULTITAP_META.image})}
  description=consoleOnly?'Only the console. No adapter, cables, controller, memory card or game drive.':'PS2 Black Slim with your selected pack and accessories.';
 }else{
  const p=model();label=p.name;image=p.image;warranty=p.warranty;description=p.condition;
  const base=item(p.name,p.price,1,p);base.variant='Firmware '+p.firmware+' · '+p.storage+' · '+p.condition+' · 1 Compatible Controller · '+p.warranty+' Console Warranty';rows.push(base);
  included.push({name:p.name,quantity:1,image:p.image},{name:'Compatible Controller',quantity:1,image:ROOT+'arcade-accessories-/images/jpeg/'+(state.family==='ps3'?'ps3gamepad.jpeg':'ps4gamepad.jpeg')});
  if(state.family!=='ps3'){
   included.push({name:'TV / HDMI cable, power cable & USB charging cable',quantity:1,image:ROOT+'arcade-accessories-/images/jpeg/hdmicable.jpeg'});
   const service=D.services.find(s=>s.storage===p.storage);if(service&&state.services[state.family])rows.push(item(service.name,service.price,1,{},true));
  }
 }
 if(!(state.family==='ps2'&&state.ps2.mode==='console'))for(const a of extraList()){
  const q=integer(quantities()[a.id]);if(q){rows.push(item(a.name,a.price,q,a));included.push({name:a.name,quantity:q,image:a.image})}
 }
 return {label,image,warranty,description,items:rows,included,total:rows.reduce((n,r)=>n+r.lineTotal,0)};
}
function option(value,label,selected){return '<option value="'+esc(value)+'"'+(String(value)===String(selected)?' selected':'')+'>'+esc(label)+'</option>'}
function renderFamilies(){
 $('families').innerHTML=families.map(f=>'<button class="family-card" data-family="'+f.id+'" aria-pressed="'+(f.id===state.family)+'"><span class="family-label">'+f.label+'</span><img src="'+f.image+'" alt="'+f.name+' console" width="220" height="130" loading="lazy"><strong>'+f.name+'</strong><span class="from">From <b>'+money(f.price)+'</b></span><span class="family-arrow" aria-hidden="true">↗</span></button>').join('');
}
function renderControls(){
 const family=families.find(f=>f.id===state.family);$('builder-title').textContent='Build your '+family.name+'.';
 if(state.family==='ps2'){
  const c=state.ps2,only=c.mode==='console';
  $('model-controls').innerHTML='<div class="segmented" aria-label="PS2 setup type">'+[['console','Console only'],['complete','Complete setup'],['manual','Manual setup']].map(([v,t])=>'<button class="segment" data-mode="'+v+'" aria-pressed="'+(c.mode===v)+'">'+t+'</button>').join('')+'</div>'+(only?'<p class="muted">₹8,500 · Console only. Build a complete or manual setup to include accessories.</p>':'<div class="fields-row"><label class="field">Game drive<select id="storage">'+Object.keys(D.ps2.PACKS).map(k=>option(k,k==='none'?'No Game Drive':k+' '+(/500/.test(k)?'USB HDD':/256/.test(k)?'USB SSD':'USB'),c.storage)).join('')+'</select></label><label class="field">Game pack<select id="pack"'+(c.storage==='none'?' disabled':'')+'>'+option('top','Top Games',c.pack)+option('optional','Optional Games',c.pack)+'</select></label></div>');
  $('setup-controls').innerHTML=only?'<p class="muted">7-day seller warranty included. Accessories and game drives are not part of this option.</p>':'<div class="fields-row"><label class="field">Black wired controllers<input id="controller-count" type="number" inputmode="numeric" min="'+(c.mode==='complete'?1:0)+'" max="99" step="1" value="'+integer(c.controllers,c.mode==='complete'?1:0)+'"><small>'+money(375)+' each · '+(c.mode==='complete'?'At least 1 controller.':'Choose zero or more.')+'</small></label><label class="field">Console seller warranty<select id="warranty">'+[[0,'7 Days — Free'],[3,'3 Months — ₹400'],[6,'6 Months — ₹600'],[12,'1 Year — ₹1,000'],[24,'2 Years — ₹1,700']].map(([v,t])=>option(v,t,c.warranty)).join('')+'</select></label></div>'+(c.mode==='manual'?'<div>'+[['adapter','Adapter + Power Cable','₹599'],['memory','8MB Memory Card + Software','₹469'],['av','Standard AV Cable','₹99']].map(([id,t,p])=>'<label class="check-row"><input type="checkbox" data-component="'+id+'"'+(c[id]?' checked':'')+'>'+t+' · '+p+'</label>').join('')+'</div>':'<p class="muted">Included: adapter with cable, memory card with software and standard AV cable.</p>')+'<label class="check-row"><input id="multitap" type="checkbox"'+(c.multitap?' checked':'')+'>PS2 USB Multi Tap · '+money(D.ps2.USB_MULTITAP_PRICE)+'</label>';
 }else{
  const p=model(),models=D.models.filter(m=>m.family===state.family);
  $('model-controls').innerHTML='<label class="field">Model / colour / storage<select id="model-select">'+models.map(m=>option(m.id,m.name+' — '+money(m.price),p.id)).join('')+'</select></label><p class="choice-help">Firmware '+esc(p.firmware)+' · '+esc(p.condition)+' · '+esc(p.warranty)+' console warranty.</p>';
  const service=state.family!=='ps3'&&D.services.find(s=>s.storage===p.storage);
  $('setup-controls').innerHTML='<p class="muted">1 compatible controller is included. Use the optional extras below to add more.</p>'+(service?'<label class="check-row"><input id="game-service" type="checkbox"'+(state.services[state.family]?' checked':'')+'>'+esc(service.name)+' · '+money(service.price)+'</label><p class="choice-help">Games are optional and charged separately. Add preferences in your order notes.</p>':'<p class="muted">Review the included items and warranty before checkout.</p>');
 }
 renderGames();renderExtras();
}
function renderGames(){
 const c=state.ps2,panel=$('games-panel');panel.innerHTML='';
 if(state.family!=='ps2'||c.mode==='console'||c.storage==='none')return;
 if(c.pack==='optional'){panel.innerHTML='<div class="games-box"><strong>Choose your games</strong><p class="muted">Select your '+esc(c.storage)+' optional pack here, then submit your game preferences after booking.</p><a class="text-link" href="https://gamesplanet13.github.io/ps2gameselector/" target="_blank" rel="noopener">Open PS2 game selector ↗</a></div>';return}
 const games=D.ps2.TOP_GAMES[c.storage]||[];
 panel.innerHTML='<details class="games-box"><summary>View '+games.length+' Top Games · '+esc(c.storage)+'</summary><label><span class="muted">Search this game list</span><input type="search" id="game-search" placeholder="Search Tekken, God of War…"></label><ul class="game-list" id="game-list">'+games.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul><p id="game-count" class="muted">'+games.length+' games listed</p></details>';
}
function renderExtras(){
 $('extras').innerHTML=state.family==='ps2'&&state.ps2.mode==='console'?'<p class="muted">Select Complete setup or Manual setup above to add accessories.</p>':extraList().map(a=>'<div class="addon"><img src="'+esc(a.image)+'" alt="'+esc(a.name)+'" width="48" height="48" loading="lazy"><span class="addon-name">'+esc(a.name)+'<small>'+money(a.price)+' each</small></span><div class="quantity"><button data-extra="'+a.id+'" data-delta="-1" aria-label="Remove one '+esc(a.name)+'">−</button><b id="qty-'+a.id+'">'+integer(quantities()[a.id])+'</b><button data-extra="'+a.id+'" data-delta="1" aria-label="Add one '+esc(a.name)+'">+</button></div></div>').join('');
}
function refresh(){
 const b=build(),p=state.family==='ps2'?null:model();
 $('model-name').textContent=state.family==='ps2'?'PS2 Slim · Black':p.name;
 $('model-description').textContent=b.description+(p?.photoPending?' · Photo of this edition available on request.':'');
 $('condition').textContent=state.family==='ps2'?'SELLER WARRANTY':p.condition;
 $('model-image').src=b.image;$('model-image').alt=state.family==='ps2'?'Black PS2 Slim console':p.photoPending?'Photo available on request':p.name+' console';
 $('model-facts').innerHTML=(state.family==='ps2'?['Black Slim','USB game drive options',b.warranty+' warranty']:[p.storage,'FW '+p.firmware,p.warranty+' warranty']).map(t=>'<span>'+esc(t)+'</span>').join('');
 $('summary').innerHTML=b.items.map(i=>'<div class="summary-row"><span>'+esc(i.name)+'<small>'+i.quantity+' × '+money(i.unitPrice)+'</small></span><b>'+money(i.lineTotal)+'</b></div>').join('');
 $('total').textContent=$('mobile-total').textContent=money(b.total);
 $('included').innerHTML=b.included.map(i=>'<div class="included-row">'+(i.image?'<img src="'+esc(i.image)+'" alt="" width="34" height="34" loading="lazy">':'')+'<span>'+esc(i.name)+'</span><b>× '+i.quantity+'</b></div>').join('');
 $('warranty-detail').textContent=state.family==='ps2'?'Console seller warranty: '+b.warranty+'. Pendrive: 5 years; HDD: 1 year; SSD: 2 years; enclosure: 1 month. Controllers, memory cards, cables and chargers: testing warranty only.':'Console seller warranty: '+b.warranty+'. Software and games are excluded. Compatible controller included; accessory terms remain separate.';
 $('enquiry').href='https://wa.me/917983624797?text='+encodeURIComponent('GAMES PLANET — Console Enquiry\n'+b.label+'\n\n'+b.items.map(i=>i.name+' × '+i.quantity+' = '+money(i.lineTotal)).join('\n')+'\nProducts Total: '+money(b.total)+'\n\nPlease confirm availability and delivery.');
 persist();window.dispatchEvent(new CustomEvent('gp-console-selection'));
}
function render(){renderFamilies();renderControls();refresh();}
function saveCart(){
 try{localStorage.setItem(CART,JSON.stringify(builds));if(window.GPSharedStore)GPSharedStore.save('consoles',builds.flatMap(b=>b.items))}catch(_){showToast('Cart could not be saved. Please allow browser storage.');return false}
 updateCartCount();return true;
}
function updateCartCount(){const other=window.GPSharedStore?GPSharedStore.items().filter(i=>i.storeSource!=='consoles').reduce((n,i)=>n+i.quantity,0):0;$('cart-count').textContent=builds.length+other;}
let toastTimer;function showToast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3500)}
function addSetup(checkout=false){
 const b=build(),entry={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),label:b.label,image:b.image,total:b.total,items:b.items};
 builds.push(entry);if(!saveCart()){builds.pop();return}
 $('selection-status').textContent='Added to cart · '+money(b.total);if(checkout)checkoutCart();else{showToast('Setup added. Keep building or open your cart.');openCart()}
}
function checkoutCart(){if(!builds.length){showToast('Choose a setup and add it to your cart first.');return}if(!window.GPSharedStore){showToast('Checkout is loading. Please try again.');return}GPSharedStore.checkout('consoles',builds.flatMap(b=>b.items));}
function openCart(){
 $('cart-lines').innerHTML=builds.length?builds.map(b=>'<div class="cart-line"><img src="'+esc(b.image)+'" alt="" width="52" height="52"><div><strong>'+esc(b.label)+'</strong><small>'+money(b.total)+'</small></div><button data-remove="'+esc(b.id)+'">Remove</button></div>').join(''):'<p>Your console cart is empty. Build your first setup above.</p>';
 $('cart-total').textContent=money(builds.reduce((n,b)=>n+b.total,0));
 const other=window.GPSharedStore?GPSharedStore.items().filter(i=>i.storeSource!=='consoles'):[];
 $('other-cart-note').textContent=other.length?'Your shared cart also contains '+other.reduce((n,i)=>n+i.quantity,0)+' item(s) from other pages. These will be included at checkout.':'Accessories from other pages can be combined at the shared checkout.';
 $('cart-checkout').disabled=!builds.length;
 if(!$('cart-dialog').open)$('cart-dialog').showModal();
}
document.addEventListener('click',event=>{
 const f=event.target.closest('[data-family]');if(f){state.family=f.dataset.family;render();return}
 const mode=event.target.closest('[data-mode]');if(mode){state.ps2.mode=mode.dataset.mode;renderControls();refresh();return}
 const extra=event.target.closest('[data-extra]');if(extra){const id=extra.dataset.extra;quantities()[id]=integer(integer(quantities()[id])+Number(extra.dataset.delta));$('qty-'+id).textContent=quantities()[id];refresh();return}
 const remove=event.target.closest('[data-remove]');if(remove){const previous=builds;builds=builds.filter(b=>b.id!==remove.dataset.remove);if(!saveCart())builds=previous;openCart();return}
 if(event.target.closest('.dialog-close'))event.target.closest('dialog').close();
});
$('model-controls').addEventListener('change',event=>{const el=event.target;if(el.id==='model-select'){state.models[state.family]=el.value;renderControls();refresh()}else if(el.id==='storage'){state.ps2.storage=el.value;renderControls();refresh()}else if(el.id==='pack'){state.ps2.pack=el.value;renderGames();refresh()}});
$('setup-controls').addEventListener('change',event=>{const el=event.target;if(el.id==='controller-count'){state.ps2.controllers=integer(el.value,state.ps2.mode==='complete'?1:0);el.value=state.ps2.controllers}else if(el.id==='warranty')state.ps2.warranty=Number(el.value);else if(el.id==='multitap')state.ps2.multitap=el.checked;else if(el.dataset.component)state.ps2[el.dataset.component]=el.checked;else if(el.id==='game-service')state.services[state.family]=el.checked;refresh()});
$('setup-controls').addEventListener('input',event=>{if(event.target.id==='controller-count'){state.ps2.controllers=integer(event.target.value,state.ps2.mode==='complete'?1:0);refresh()}});
$('games-panel').addEventListener('input',event=>{if(event.target.id!=='game-search')return;const q=event.target.value.toLowerCase().trim();let shown=0;for(const li of $('game-list').children){li.hidden=!li.textContent.toLowerCase().includes(q);if(!li.hidden)shown++}$('game-count').textContent=shown+' games found';});
$('add-cart').onclick=()=>addSetup();$('mobile-add').onclick=()=>addSetup();$('buy-now').onclick=()=>addSetup(true);$('open-cart').onclick=openCart;$('cart-checkout').onclick=checkoutCart;$('keep-shopping').onclick=()=>$('cart-dialog').close();
$('gallery-button').onclick=()=>{$('large-photo').src=$('model-image').src;$('large-photo').alt=$('model-image').alt;$('photo-dialog').showModal()};
window.addEventListener('storage',event=>{if(event.key===CART){const next=read(CART,[]);if(Array.isArray(next)){builds=next;updateCartCount();if($('cart-dialog').open)openCart()}}});
window.GPConsoleStore={build,getState:()=>JSON.parse(JSON.stringify(state)),getCart:()=>JSON.parse(JSON.stringify(builds))};
function integrateMenu(){const nav=document.querySelector('.masthead nav'),toggle=$('gp-menu-toggle');if(nav&&toggle)nav.append(toggle)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(integrateMenu,0),{once:true});else integrateMenu();
render();updateCartCount();
})();
