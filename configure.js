(function(){'use strict';if(new URLSearchParams(location.search).get('type')==='ps2'){location.replace('https://gamesplanet13.github.io/ps2/');return;}const cpuQuery=new URLSearchParams(location.search);if((!cpuQuery.get('type')||cpuQuery.get('type')==='cpu')&&!cpuQuery.get('edit')){location.replace('cpu-setup.html');return;}const D=window.GP_SETUP_DATA,E=GPSetup,esc=E.escape,m=E.money,$=id=>document.getElementById(id);const requested=new URLSearchParams(location.search).get('type'),type=['cpu','arcade','ps2'].includes(requested)?requested:'cpu';let state={hdmi:'1.5',cpu:'1',box:'mini',system:'base',tv:'none',accessories:{},drives:[],ps2Mode:'console',storage:'64',controllers:1,pack:'top',cardType:'fmcb'};let editing=null;const edit=new URLSearchParams(location.search).get('edit');let saved=[];try{saved=JSON.parse(localStorage.getItem('gp_configured_sets')||'[]')}catch(_){}if(edit){const found=saved.find(x=>x.id===edit&&x.type===type);if(found){state=found.selection;editing=edit}}
state=Object.assign({ps2Mode:'console',storage:'64',controllers:1,pack:'top',cardType:'fmcb',accessories:{},drives:[]},state);
// PS2 inside an Arcade Box is a distinct configurable bundle; do not
// re-use the console-only PS2 page's unrelated selector state.
state.arcadePs2=Object.assign({video:'av',hdmiCable:false,storage:'64',pack:'top',card:'fmcb',warranty:'0',controllerType:'wired',controllersQty:0,extras:{}},state.arcadePs2||{});
state.arcadePs2.extras={...(state.arcadePs2.extras||{})};state.arcadePs2.card='fmcb';
if(state.cpu==='2')state.cpu='1';if(state.cpu==='4')state.cpu='3';
if(state.system==='cpu-2')state.system='cpu-1';if(state.system==='cpu-4')state.system='cpu-3';
document.querySelector(`[data-type="${type}"]`).classList.add('active');
function drives(){return '<div class="block"><h2>Additional external game drives</h2><p class="note">These are extra drives. The storage already included in your CPU set stays included.</p>'+D.drives.map(d=>d.price===null?`<div class="addon"><span>${esc(d.name)}</span><img class="addon-image" src="${d.image}" alt="${esc(d.name)}"><a class="enquiry" href="https://wa.me/917983624797?text=${encodeURIComponent('Please confirm the selling price for 1TB USB HDD with games.')}">Ask price</a></div>`:`<div class="addon"><label><input type="checkbox" data-drive="${d.id}" ${state.drives.includes(d.id)?'checked':''}> ${esc(d.name)}</label><img class="addon-image" src="${d.image}" alt="${esc(d.name)}"><b>${m(d.price)}</b></div>`).join('')+'</div>'}

function setPrice(d,n){return 8500+599+99+600+375*n+d[state.pack]}
function ps2Options(){
 let html='<div class="block"><h2>Choose PS2 console or complete set</h2><div class="choices"><label class="choice '+(state.ps2Mode==='console'?'selected':'')+'"><input type="radio" name="ps2Mode" value="console" '+(state.ps2Mode==='console'?'checked':'')+'><img src="images/ps2-black-70000.jpg" alt="Black PS2 Slim 70000 series"><strong>PS2 Black Console Only</strong><small>No accessories included</small><b>'+m(8500)+'</b></label><label class="choice '+(state.ps2Mode==='set'?'selected':'')+'"><input type="radio" name="ps2Mode" value="set" '+(state.ps2Mode==='set'?'checked':'')+'><img src="images/ps2-black-70000.jpg" alt="Black PS2 Slim"><strong>PS2 Complete Gaming Set</strong><small>Choose storage and one or two controllers below</small></label></div></div>';
 if(state.ps2Mode==='set'){
 html+='<div class="block"><h2>Choose your games pack</h2><div class="choices">'+[['top','Top Games'],['optional','Optional — choose your own games']].map(([id,n])=>'<label class="choice '+(state.pack===id?'selected':'')+'"><input type="radio" name="pack" value="'+id+'" '+(state.pack===id?'checked':'')+'><strong>'+n+'</strong></label>').join('')+'</div><p class="note">Top and Optional packs have different prices. Choose a pack to see the full set rate.</p></div>';
 html+='<div class="block"><h2>Storage + controllers</h2><div class="choices">'+D.ps2Packs.flatMap(d=>[1,2].map(n=>'<label class="choice '+(state.storage===d.id&&Number(state.controllers)===n?'selected':'')+'"><input type="radio" name="ps2Variant" value="'+d.id+'-'+n+'" '+(state.storage===d.id&&Number(state.controllers)===n?'checked':'')+'><strong>PS2 with '+esc(d.name)+'</strong><small>'+n+' Black Wired Controller'+(n===2?'s':'')+' • AV Cable • Power Adapter + Cable • 8MB Setup Card</small><b>'+m(setPrice(d,n))+'</b></label>')).join('')+'</div><p class="note">All complete sets include AV cable, power adapter with power cable, and one 8MB setup memory card.</p><label>Included setup card<select id="includedCard"><option value="fmcb" '+(state.cardType==='fmcb'?'selected':'')+'>FMCB — PS2 FAT / Slim 7xxxx</option><option value="funtuna" '+(state.cardType==='funtuna'?'selected':'')+'>FunTuna — PS2 Slim 9xxxx</option></select></label></div>';
 const drive=D.ps2Packs.find(x=>x.id===state.storage);
 if(state.pack==='top')html+='<div class="block"><h2>Top '+drive.count+' Games — list / video</h2><p class="note">View the existing Games Planet Top Games list video before choosing your set.</p><a class="game-list-link" href="'+D.topGamesURL+'" target="_blank" rel="noopener">View Top Games list / video →</a><iframe class="games-frame top-video" title="Games Planet Top Games list video" src="https://www.youtube.com/embed/pp_x8dDrDcs" loading="lazy" allowfullscreen></iframe></div>';
 else html+='<div class="block"><h2>Choose your Optional Games</h2><p class="note">First book your order. You can prepare your game list below; submit it after booking with your Order ID. Games are limited by the selected drive capacity.</p><iframe class="games-frame" title="Optional PS2 game selector" src="https://gamesplanet13.github.io/gameselector/PS2GAMESELECTOR.html?storage='+state.storage+'&embed=1"></iframe><a class="game-list-link" href="https://gamesplanet13.github.io/gameselector/PS2GAMESELECTOR.html?storage='+state.storage+'" target="_blank" rel="noopener">Open game selector full screen →</a></div>';
 }
 html+='<div class="block"><h2>Extra accessories — optional</h2><p class="note">These quantities are extra, beyond what the complete set already includes.</p>'+D.ps2.map(a=>{const q=state.accessories[a.id]||0;return '<div class="addon"><img class="addon-image" src="'+a.image+'" alt="'+esc(a.name)+'"><label><input type="checkbox" data-extra="'+a.id+'" '+(q?'checked':'')+'> '+esc(a.name)+'<br><small>'+m(a.price)+' each</small></label><input aria-label="Extra quantity of '+esc(a.name)+'" type="number" min="1" max="99" step="1" data-accessory="'+a.id+'" value="'+(q||1)+'" '+(q?'':'disabled')+'></div>'}).join('')+'</div>';
 return html;
}
function bindPS2(){if(type!=='ps2')return;document.querySelectorAll('[name=ps2Mode],[name=pack]').forEach(x=>x.onchange=()=>{state[x.name]=x.value;render()});document.querySelectorAll('[name=ps2Variant]').forEach(x=>x.onchange=()=>{const [id,n]=x.value.split('-');state.storage=id;state.controllers=Number(n);state.drives=[];render()});$('includedCard')&&($('includedCard').onchange=e=>{state.cardType=e.target.value;update()});document.querySelectorAll('[data-extra]').forEach(x=>x.onchange=()=>{const input=document.querySelector('[data-accessory="'+x.dataset.extra+'"]');input.disabled=!x.checked;state.accessories[x.dataset.extra]=x.checked?Number(input.value)||1:0;update()})}


function arcadePS2Options(){
 const ps=state.arcadePs2;
 const opt=(value,label,current)=>'<option value="'+esc(value)+'" '+(current===value?'selected':'')+'>'+esc(label)+'</option>';
 const ps2item=id=>D.ps2.find(x=>x.id===id);
 const vid=['av','avbest','hdmi'].map(id=>{const x=ps2item(id);return opt(id,x.name+' — '+m(x.price),ps.video)}).join('');
 const drives=D.ps2Packs.filter(x=>['64','128','500'].includes(x.id)).map(x=>opt(x.id,x.name+' ('+(x.count||'')+' Top Games) — '+m(x[ps.pack]||x.top),ps.storage)).join('');
 const choice=(key,title,options)=>'<label class="gp-ps2-field"><span>'+title+'</span><select data-arcade-ps2="'+key+'">'+options+'</select></label>';
 const included='<div class="gp-ps2-included"><div><b>PS2 Black Slim 70000</b><strong>₹8,500</strong></div><div><b>PS2 Power Adapter + Cable</b><strong>'+m(ps2item('adapter').price)+'</strong></div><div><b>8MB FMCB / FunTuna Card</b><strong>'+m(ps2item('fmcb').price)+'</strong></div><div><b>Console warranty — 7 days free</b><strong>₹0</strong></div></div>';
 let html='<section class="block gp-arcade-ps2"><h2>PS2 System — Complete Item-wise Setup</h2><p class="note">Arcade Box के अलावा PS2 के हर component की अलग कीमत आपके नीचे Order Summary और Cart में दिखाई देगी। कोई hidden PS2 combo charge नहीं।</p>'+included+'<div class="gp-ps2-fields">';
 html+=choice('video','PS2 Video Output — choose one',vid);
 html+=ps.video==='hdmi'?'<label class="gp-ps2-check"><input type="checkbox" data-arcade-ps2-check="hdmiCable" '+(ps.hdmiCable?'checked':'')+'> Add HDMI 1.5 Meter cable — '+m(ps2item('hdmicable').price)+' (optional)</label>':'<p class="note gp-ps2-hdmi-note">AV Cable selected — HDMI cable is not required. For HDMI output choose the converter above.</p>';
 html+='<p class="note gp-ps2-fmcb-included">8MB FMCB Memory Card for PS2 Slim 70000 is included in the itemized cost ('+m(ps2item('fmcb').price)+').</p>'; 
 html+=choice('storage','PS2 Games Storage',drives);
 html+=choice('pack','Game Collection',opt('top','Top Games — preloaded',ps.pack)+opt('optional','Optional Games — choose game list',ps.pack));
 html+=choice('warranty','PS2 Console Warranty (seller)',[['0','7 Days — FREE • ₹0'],['3','3 Months — ₹400'],['6','6 Months — ₹600'],['12','1 Year — ₹1,000'],['24','2 Years — ₹1,700']].map(x=>opt(...x,ps.warranty)).join(''));
 html+='</div>';
 html+='<div class="gp-ps2-game-links">'+(ps.pack==='optional'?'<a href="https://gamesplanet13.github.io/gameselector/PS2GAMESELECTOR.html?storage='+ps.storage+'" target="_blank" rel="noopener">Choose Optional PS2 Games →</a><small>Book your setup first; share your selected games with Order ID.</small>':'<a href="'+esc(D.topGamesURL)+'" target="_blank" rel="noopener">View PS2 Top Games List / Video →</a>')+'</div>';
 html+='<div class="gp-ps2-controller"><h3>Controllers — Optional (0 by default)</h3><div class="gp-ps2-fields">'+choice('controllerType','Controller Model',['wired','crystal','wireless'].map(id=>{const x=ps2item(id);return opt(id,x.name+' — '+m(x.price),ps.controllerType)}).join(''))+choice('controllersQty','Number of controllers',[0,1,2,3,4].map(n=>opt(String(n),n===0?'No controller • ₹0':n+' Controller'+(n>1?'s':''),String(ps.controllersQty))).join(''))+'</div></div>';
 const optionalIds=['blank','opl','power','adapter','av','avbest','hdmi','hdmicable','fmcb'];
 html+='<details class="gp-ps2-extra"><summary>Extra PS2 Accessories — Optional</summary><p class="note">Only additional quantities beyond the components already included in the PS2 setup.</p>';
 html+=optionalIds.map(id=>{const x=ps2item(id),n=Math.min(10,Math.max(0,Number(ps.extras?.[id])||0));return '<div class="gp-ps2-extra-line"><img src="'+esc(x.image)+'" alt="'+esc(x.name)+'" loading="lazy"><label><input type="checkbox" data-arcade-ps2-extra-check="'+id+'" '+(n?'checked':'')+'> '+esc(x.name)+' <small>'+m(x.price)+' each</small></label><input aria-label="Extra '+esc(x.name)+' quantity" type="number" data-arcade-ps2-extra-qty="'+id+'" min="1" max="10" value="'+(n||1)+'" '+(n?'':'disabled')+'></div>'}).join('');
 html+='</details><p class="note">7-day free warranty / paid extended warranty applies to PS2 console hardware only. Controllers, memory cards and game/software coverage are separate. Courier charged at checkout.</p></section>';
 return html;
}
function bindArcadePS2(){
 if(type!=='arcade'||state.system!=='ps2')return;
 document.querySelectorAll('[data-arcade-ps2]').forEach(input=>input.onchange=()=>{
  const key=input.dataset.arcadePs2;
  state.arcadePs2[key]=key==='controllersQty'?Number(input.value):input.value;
  if(key==='video'&&input.value!=='hdmi')state.arcadePs2.hdmiCable=false;
  render();
 });
 document.querySelectorAll('[data-arcade-ps2-check]').forEach(input=>input.onchange=()=>{
  state.arcadePs2[input.dataset.arcadePs2Check]=input.checked;render();
 });
 document.querySelectorAll('[data-arcade-ps2-extra-check]').forEach(input=>input.onchange=()=>{
  const id=input.dataset.arcadePs2ExtraCheck;
  const count=document.querySelector('[data-arcade-ps2-extra-qty="'+id+'"]');
  state.arcadePs2.extras[id]=input.checked?Math.min(10,Math.max(1,Number(count?.value)||1)):0;
  render();
 });
 document.querySelectorAll('[data-arcade-ps2-extra-qty]').forEach(input=>input.onchange=()=>{
  const id=input.dataset.arcadePs2ExtraQty;
  if(state.arcadePs2.extras[id]>0){
   const n=Number(input.value);
   state.arcadePs2.extras[id]=Number.isInteger(n)?Math.min(10,Math.max(1,n)):1;
  }
  render();
 });
}

function arcadeSystems(){
 const box=D.arcade.find(a=>a.id===state.box);
 const ps2Total=E.calculate(D,'arcade',{...state,system:'ps2',tv:'none'}).total;
 const selected=state.system||'base';
 const category=selected.startsWith('cpu-')?'cpu':selected;
 const cpuNames={1:['Ready CPU 1','i3 3rd Gen · 4GB DDR3'],3:['Ready CPU 2','i5 3rd Gen · 4GB DDR3'],5:['Ready CPU 3','i5 6th Gen · 8GB DDR4'],6:['Ready CPU 4','i5 6th Gen · 8GB DDR4 · GT740 4GB']};
 const cpuOptions=D.cpu.filter(c=>Object.hasOwn(cpuNames,Number(c.id))).map(c=>{
  const model=Number(c.id),setup={...GPCPU.preset(c.id),hdmi:'1.5',usbQty:1};
  const total=GPCPU.calculate(setup).total,id='cpu-'+c.id;
  return {id,model,label:cpuNames[model][0],spec:cpuNames[model][1],price:box.base+total};
 });
 const selectedCpu=cpuOptions.find(x=>x.id===selected)||cpuOptions[0];
 const systems=[
  {id:'base',symbol:'▣',title:'Only Arcade Box',description:'No gaming console included',price:box.base},
  {id:'gamebox',symbol:'🎮',title:'GameBox',description:'With connectors · ready gaming setup',price:box.gamebox},
  {id:'ps2',symbol:'🕹',title:'PS2 System',description:'Customise games, memory and accessories',price:ps2Total},
  {id:'cpu',symbol:'🖥',title:'Gaming CPU',description:'Choose from 4 CPU models',price:selectedCpu.price}
 ];
 const cards=systems.map(x=>
  '<button type="button" class="gp-system-card'+(category===x.id?' is-selected':'')+'" data-game-system="'+x.id+'" aria-pressed="'+(category===x.id)+'">'+
  '<span class="gp-system-symbol" aria-hidden="true">'+x.symbol+'</span><span class="gp-system-copy"><strong>'+esc(x.title)+'</strong><small>'+esc(x.description)+'</small></span>'+
  '<span class="gp-system-value"><b>'+m(x.price)+'</b><span>'+(x.id==='cpu'?'Selected set':'Set price')+'</span></span>'+
  '<span class="gp-system-indicator" aria-hidden="true">'+(category===x.id?'✓':'')+'</span></button>').join('');
 const cpuList=category!=='cpu'?'':('<div class="gp-cpu-chooser"><div class="gp-cpu-chooser-head"><h3>Choose your CPU model</h3><small>Each price includes the arcade box, CPU, Batocera USB and HDMI cable.</small></div><div class="gp-cpu-option-grid">'+
  cpuOptions.map(x=>'<label class="gp-cpu-option'+(selected===x.id?' is-selected':'')+'"><input type="radio" name="arcadeCpuVersion" value="'+x.id+'" '+(selected===x.id?'checked':'')+'><span class="gp-cpu-option-text"><strong>'+esc(x.label)+'</strong><small>'+esc(x.spec)+'</small></span><b>'+m(x.price)+'</b></label>').join('')+'</div></div>');
 return '<div class="gp-system-picker"><div class="gp-step-label">STEP 2 · GAME SYSTEM</div><div class="gp-system-grid" role="group" aria-label="Choose arcade game system">'+cards+'</div>'+cpuList+
 '<p class="gp-system-help">'+(category==='ps2'?'PS2 accessories and games can be customised in the next section.':category==='cpu'?'CPU setup includes assembled CPU + 64GB Batocera games USB + 1.5m HDMI. Controllers are optional.':category==='gamebox'?'Arcade Box with GameBox and necessary connectors.':'Arcade Box only — no GameBox, PS2 or CPU included.')+'</p></div>';
}
function render(){let html='';if(type==='cpu')html='<div class="block"><h2>Choose your CPU Box</h2><div class="choices">'+D.cpu.filter(c=>[1,3,5,6].includes(Number(c.id))).map(c=>`<label class="choice ${state.cpu===c.id?'selected':''}"><input type="radio" name="cpu" value="${c.id}" ${state.cpu===c.id?'checked':''}><img src="images/cpu-box-zebronics.png" alt="Zebronics CPU Box"><strong>${esc(c.name)}</strong><small>${esc(c.spec)}</small><b>${m(c.price)}</b></label>`).join('')+'</div></div>'+drives();
if(type==='arcade')html='<div class="block"><h2>Choose your arcade box</h2><div class="choices">'+D.arcade.map(a=>`<label class="choice ${state.box===a.id?'selected':''}"><input type="radio" name="box" value="${a.id}" ${state.box===a.id?'checked':''}><img src="${a.img}" alt="${esc(a.name)}"><strong>${esc(a.name)}</strong><small>Complete prepared arcade box${a.id==='full'?' with 32 Inch TV • 1 Year TV Warranty':''}</small></label>`).join('')+'</div></div><div class="block gp-system-block"><h2>Choose your game system</h2>${arcadeSystems()}</div>';
if(type==='arcade'){
 if(state.box==='full')html+='<div class="block"><h2>32 Inch TV included</h2><p>Full-size arcade box includes its 32 Inch TV with 1 Year Warranty. No extra TV charge.</p></div>';
 else html+='<div class="block"><h2>Optional TV — 1 Year Warranty</h2><select id="arcadeTV">'+D.arcadeTVs.map(tv=>'<option value="'+tv.id+'" '+((state.tv||'none')===tv.id?'selected':'')+'>'+esc(tv.name)+' — '+m(tv.price)+'</option>').join('')+'</select></div>';
}
if(type==='arcade'&&state.system==='ps2')html+=arcadePS2Options();
if(type==='ps2')html=ps2Options();if(type==='arcade'&&/^cpu-[1-6]$/.test(state.system)){
 state.hdmi='1.5';
 html+='<div class="block"><h2>Included with Arcade Box + CPU</h2><p class="note">Assembled CPU with CPU fan, cabinet and SMPS + 64GB Batocera Games USB Pendrive (₹1,999) + Normal HDMI Cable 1.5 Meter (₹100). All included in the displayed set price. No duplicate accessory charge.</p></div>';
}else if(type==='cpu')html+='<div class="block"><h2>Required HDMI cable</h2><label>Cable length<select id="hdmiLength"><option value="1.5" '+((state.hdmi||'1.5')==='1.5'?'selected':'')+'>Normal HDMI 1.5 Meter — ₹100</option><option value="2.2" '+(state.hdmi==='2.2'?'selected':'')+'>Normal HDMI 2.2 Meter — ₹200</option></select></label><p class="note">One HDMI cable is included in the CPU total.</p></div>';
$('options').innerHTML=html;$('hdmiLength')&&($('hdmiLength').onchange=e=>{state.hdmi=e.target.value;render()});document.querySelectorAll('input[name=cpu],input[name=box]').forEach(x=>x.onchange=()=>{state[x.name]=x.value;render()});bindPS2();bindArcadePS2();$('arcadeTV')&&($('arcadeTV').onchange=e=>{state.tv=e.target.value;update()});document.querySelectorAll('[data-game-system]').forEach(button=>button.onclick=()=>{const system=button.dataset.gameSystem;state.system=system==='cpu'?(state.system.startsWith('cpu-')?state.system:'cpu-1'):system;render()});document.querySelectorAll('[name=arcadeCpuVersion]').forEach(input=>input.onchange=()=>{state.system=input.value;render()});document.querySelectorAll('[data-drive]').forEach(x=>x.onchange=()=>{state.drives=[...document.querySelectorAll('[data-drive]:checked')].map(i=>i.dataset.drive);update()});document.querySelectorAll('[data-accessory]').forEach(x=>x.oninput=()=>{const q=Number(x.value);state.accessories[x.dataset.accessory]=q;update()});update()}
function update(){try{const c=E.calculate(D,type,state);$('preview').innerHTML=c.items.map(i=>`<div class="line gp-itemized-line">${i.image?'<img class="gp-itemized-thumb" src="'+esc(i.image)+'" alt="" loading="lazy">':''}<span class="gp-itemized-text">${esc(i.name)}${i.quantity>1?' × '+i.quantity:''}<small>${esc(i.variant)}</small><b>${m(i.lineTotal)}${i.quantity>1?' ('+m(i.unitPrice)+' each)':''}</b></span></div>`).join('');$('total').textContent=m(c.total);$('add').disabled=false;$('checkout').disabled=false;$('status').textContent=''}catch(e){$('status').textContent=e.message;$('add').disabled=true;$('checkout').disabled=true}}
function save(){const calc=E.calculate(D,type,state);let sets=[];try{sets=JSON.parse(localStorage.getItem('gp_configured_sets')||'[]')}catch(_){}const id=editing||('set-'+Date.now()+'-'+Math.random().toString(36).slice(2,7));const record={id,type,selection:structuredClone(state),items:calc.items,title:type==='cpu'?'CPU Box Set':type==='arcade'?'Arcade Box Set':'PS2 Custom Set'};const i=sets.findIndex(x=>x.id===id);if(i>=0)sets[i]=record;else sets.push(record);localStorage.setItem('gp_configured_sets',JSON.stringify(sets));editing=id;return sets}
$('add').onclick=()=>{try{save();location.href=GPStoreHome()+'#orderDetailsSection'}catch(e){$('status').textContent='Unable to save your cart: '+e.message}};
$('checkout').onclick=()=>{try{save();sessionStorage.setItem('gp_setup_checkout','1');location.href=GPStoreHome()+'#orderDetailsSection'}catch(e){$('status').textContent='Unable to save your cart: '+e.message}};
render();})();




;(function(){const s=document.createElement('script');s.src=(window.GP_ASSET_BASE||'')+'product-gallery.js?v=20261028-swipe';document.head.append(s);})();
