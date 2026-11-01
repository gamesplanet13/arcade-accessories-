(function(){'use strict';const C=GPCPU,m=GPSetup.money,e=GPSetup.escape,$=id=>document.getElementById(id);const mode=document.body.dataset.cpuMode;if(!mode)return;const params=new URLSearchParams(location.search);let edit=params.get('edit');let s=C.defaults(mode);let sets=[];try{sets=JSON.parse(localStorage.getItem('gp_configured_sets')||'[]');const old=sets.find(x=>x.id===edit&&x.type==='cpu'&&x.selection?.buildVersion===2);if(old)s={...C.defaults(mode),...old.selection,mode};}catch(_){}const storageKey='gp_cpu_builder_'+mode;if(!edit)try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved?.buildVersion===2)s={...s,...saved,mode};}catch(_){}
// Explicit model links from Gamesplanet_in must load that model's own
// included hardware, NOT a previously saved customer's optional selection.
// Edit mode deliberately takes precedence so existing saved builds survive.
const linkedPreset=params.get('preset');
if(!edit&&mode==='complete'&&/^[1-6]$/.test(linkedPreset||'')){
 s={...C.preset(Number(linkedPreset)),mode:'complete'};
}
// All fresh setups start with no pendrive; old preselected USB states are cleared.
if(!edit&&!s.storageOptionsConfirmed){s.storage='none';s.extraSsd=false;s.usbQty=0;s.extraUsb=false;}
if(s.storage==='usb'){s.storage='none';s.usbQty=0;s.extraUsb=false;}
if(!Number.isInteger(Number(s.usbQty))||Number(s.usbQty)<0)s.usbQty=0;
// Keep old links and saved orders valid, but never show indistinguishable presets.
if(mode==='complete'&&s.preset==='2')s.preset='1';
if(mode==='complete'&&s.preset==='4')s.preset='3';
const cpuAsset=src=>new URL(src,'https://gamesplanet13.github.io/arcade-accessories-/').href;
// Batocera optional add-on should be one pictured SanDisk Ultra + Batocera icon only.
C.parts.usb.image='images/sandisk-ultra-64gb.jpg';
const opt=(v,text,selected)=>'<option value="'+v+'" '+(selected===v?'selected':'')+'>'+e(text)+'</option>';const field=(key,title,options)=>'<label class="field">'+title+'<select data-key="'+key+'">'+options.map(([id,text])=>opt(id,text,s[key])).join('')+'</select></label>';const check=(key,text)=>'<label class="toggle"><input type="checkbox" data-check="'+key+'" '+(s[key]?'checked':'')+'>'+text+'</label>';
function row(p,q,amount,included){return '<div class="line"><img src="'+e(cpuAsset(p.image))+'" alt="'+e(p.name)+'" loading="lazy" onclick="openCPUImage(this.src)"><div class="copy">'+e(p.name)+'<small>Qty: '+q+(included?' • Included':'')+'</small></div>'+(amount===null?'':'<b class="amount">'+m(amount)+'</b>')+'</div>';}
// One gallery modal shared by Batocera pendrives, HDD and CPU accessories.
// A dedicated history state makes Android Back close the picture, not the page.
let cpuImageDialog=null;
let cpuImagePreviousOverflow='';
let cpuImageHistoryState=false;
function closeCPUImage(fromPopstate=false){
 if(!cpuImageDialog)return;
 cpuImageDialog.remove();
 cpuImageDialog=null;
 document.body.style.overflow=cpuImagePreviousOverflow;
 if(!fromPopstate&&cpuImageHistoryState&&history.state?.gpCpuImageOpen){
  cpuImageHistoryState=false;
  history.back();
 }else cpuImageHistoryState=false;
}
window.openCPUImage=src=>{
 if(cpuImageDialog){const old=cpuImageDialog.querySelector('img');if(old)old.src=src;return;}
 const dialog=document.createElement('div');
 dialog.id='gp-cpu-image-lightbox';
 dialog.setAttribute('role','dialog');
 dialog.setAttribute('aria-modal','true');
 dialog.setAttribute('aria-label','Product picture enlarged');
 dialog.style.cssText='position:fixed;inset:0;z-index:2147483640;background:rgba(0,0,0,.9);display:grid;place-items:center;padding:48px 12px 22px;box-sizing:border-box';
 const img=document.createElement('img');
 img.src=src;img.alt='Product picture enlarged';
 img.style.cssText='display:block;width:auto;max-width:100%;max-height:83vh;object-fit:contain;background:#fff;border-radius:9px';
 img.onerror=()=>{img.alt='Picture unavailable. Close and try again.';};
 const close=document.createElement('button');
 close.type='button';close.textContent='✕';
 close.setAttribute('aria-label','Close image');
 close.style.cssText='position:absolute;right:12px;top:12px;background:#fff;color:#142033;border:0;border-radius:50%;width:40px;height:40px;font-size:23px;cursor:pointer;z-index:1';
 close.onclick=()=>closeCPUImage();
 dialog.onclick=e=>{if(e.target===dialog)closeCPUImage();};
 dialog.append(img,close);
 cpuImagePreviousOverflow=document.body.style.overflow;
 document.body.style.overflow='hidden';
 document.body.append(dialog);cpuImageDialog=dialog;
 try{history.pushState({...history.state,gpCpuImageOpen:true},'',location.href);cpuImageHistoryState=true;}
 catch(_){cpuImageHistoryState=false;}
 close.focus();
};
window.addEventListener('popstate',()=>{if(cpuImageDialog)closeCPUImage(true)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cpuImageDialog){e.preventDefault();closeCPUImage();}});

function render(){
if(mode==='complete'){
 const p=C.preset([1,3,5,6].includes(Number(s.preset))?Number(s.preset):1);
 s.preset=p.preset;s.board=p.board;s.processor=p.processor;s.ram=p.ram;s.gpu=p.gpu;
 s.cabinet=true;s.smps=true;s.assemble=true;s.hdmi='1.5';
}
const hasSSD=s.storage==='ssd'||s.extraSsd;
if(!hasSSD)s.windows=false;s.fan=true;
if(mode==='complete'){s.cabinet=true;s.smps=true;s.assemble=true;}s.casePower=s.cabinet?(s.smps?'both':'cabinet'):(s.smps?'smps':'none');let out='';if(mode==='complete'){
 const configCards=[1,3,5,6].map((n,index)=>{
  const p=C.preset(n),calc=C.calculate(p);
  const core=n===1?'H61 • Core i3 3rd Gen • DDR3 4GB':n===3?'H61 • Core i5 3rd Gen • DDR3 4GB':n===5?'H110 • Core i5 6th Gen • DDR4 8GB':'H110 • Core i5 6th Gen • DDR4 8GB • GT740 4GB GPU';
  const graphics=n===6?'Dedicated GT740 4GB graphics':'Without dedicated graphics';
  return '<label class="gp-preset-choice"><input type="radio" name="cpuPreset" data-key="preset" value="'+n+'" '+(s.preset===String(n)?'checked':'')+'><span class="gp-preset-inner"><span class="gp-preset-heading"><strong>Ready CPU '+(index+1)+'</strong><b>'+m(calc.total)+'</b></span><small>'+core+'</small><em>'+graphics+' • Assembled + HDMI 1.5m</em></span></label>';
 }).join('');
 out+='<div class="card" id="readyCpuModels"><h2>4 Ready CPU Models</h2><p class="muted gp-preset-guide">Choose one fixed assembled PC. Motherboard, processor, RAM and included graphics stay as shown. Need different parts? Use Manual Setup above.</p><div class="gp-preset-grid" role="radiogroup" aria-label="Ready CPU Models">'+configCards+'</div></div>';
}
if(mode==='complete'){
 const graphics=s.gpu?' • Dedicated GT740 4GB GPU':' • Onboard graphics';
 out+='<div class="card gp-ready-hardware"><h2>Included in this ready CPU</h2><p><b>'+e(C.parts[s.board].name)+'</b> + <b>'+e(C.parts[s.processor].name)+'</b> + <b>'+e(C.parts[s.ram].name)+'</b>'+graphics+'</p><small>CPU Fan + Cabinet with SMPS + Assembling + Normal HDMI 1.5m cable. Fixed ready-pack components, already included in total.</small></div>';
}else{
 out+='<div class="card"><h2>'+(mode==='complete'?'Your complete PC':'Build your CPU')+'</h2>';
if(mode==='complete')out+='<p class="muted">'+e(C.parts[s.board].name)+' • '+e(C.parts[s.processor].name)+'<br>CPU Fan + Cabinet with SMPS + Assembling included.</p>';
out+='<div class="fields">'+(mode==='manual'?field('board','Motherboard',[['h61','H61 • DDR3 / 3rd Gen'],['h110','H110 • DDR4 / 6th Gen']])+field('processor','Processor',s.board==='h61'?[['i3','Intel Core i3 3rd Gen'],['i5','Intel Core i5 3rd Gen']]:[['i56','Intel Core i5 6th Gen']]):'')+field('ram','RAM',s.board==='h61'?[['ddr3','DDR3 4GB • '+m(C.parts.ddr3.price)],['ddr3_8','DDR3 8GB • '+m(C.parts.ddr3_8.price)]]:[['ddr4','DDR4 8GB • '+m(C.parts.ddr4.price)]])+field('storage','Main Storage',[['none','Without storage — add optional Batocera Pendrive below'],['ssd','256GB SSD • '+m(C.parts.ssd.price)]])+'</div>';
out+='<p class="muted">CPU का दिखाया गया मूल्य Pendrive के बिना है। 64GB Batocera Games Pendrive ₹1,999 optional है। जरूरत के अनुसार quantity चुनें। SSD के लिए Game Setup और Windows अलग चुनें।</p><p class="muted">CPU Fan: '+m(C.parts.fan.price)+' • Cabinet with SMPS: '+m(C.parts.cabinetSmps.price)+' (Cabinet '+m(C.parts.cabinet.price)+' + SMPS '+m(C.parts.smps.price)+')</p>';
if(mode==='manual')out+=field('casePower','Cabinet & Power Supply',[['both','Cabinet with SMPS • '+m(C.parts.cabinetSmps.price)],['cabinet','Cabinet without SMPS • '+m(C.parts.cabinet.price)],['smps','SMPS only • '+m(C.parts.smps.price)],['none','Use customer cabinet & SMPS']])+check('assemble','Assembling • '+m(C.parts.assemble.price));
else out+='<p class="muted">Assembling: '+m(C.parts.assemble.price)+' • Included in total</p>';
out+=check('gpu','GT740 DDR3 4GB Graphics • '+m(C.parts.gpu.price))+'</div>';

}
const usbQuantity=Math.max(0,Math.min(99,Number(s.usbQty)||0));
out+='<div class="card"><h2>Optional Storage & Software</h2><div class="line gp-batocera-qty"><img src="'+e(cpuAsset(C.parts.usb.image))+'" alt="Batocera Pendrive" loading="lazy" onclick="openCPUImage(this.src)"><div class="copy"><b>SanDisk Ultra USB 3.0 64GB with Batocera Games</b><small>₹1,999* each · Not included in CPU price · Select 0–99</small></div><div class="qty"><button type="button" data-usb-delta="-1" aria-label="Remove Batocera Pendrive">−</button><span>'+usbQuantity+'</span><button type="button" data-usb-delta="1" aria-label="Add Batocera Pendrive">+</button></div></div>'+(s.storage!=='ssd'?check('extraSsd','Extra 256GB SSD • '+m(C.parts.ssd.price)):'')+(hasSSD?check('ssdGames','256GB SSD Game Setup • '+m(C.parts.ssdGames.price))+check('windows','Windows Setup • '+m(C.parts.windows.price)):'')+'</div>';
out+='<div class="card"><h2>More Batocera Storage with Games</h2>'+[['usb128Qty','usb128','128GB USB 3.0 Pendrive'],['hdd500Qty','hdd500','500GB USB HDD']].map(([stateKey,partKey,label])=>'<div class="line gp-batocera-qty"><img src="'+e(cpuAsset(C.parts[partKey].image))+'" alt="'+e(label)+'" loading="lazy" onclick="openCPUImage(this.src)"><div class="copy"><b>'+e(label)+' with Batocera Games</b><small>'+m(C.parts[partKey].price)+'* · Optional · Quantity 0–99</small></div><div class="qty"><button type="button" data-batocera-key="'+stateKey+'" data-batocera-delta="-1" aria-label="Remove '+e(label)+'">−</button><span>'+Math.max(0,Math.min(99,Number(s[stateKey])||0))+'</span><button type="button" data-batocera-key="'+stateKey+'" data-batocera-delta="1" aria-label="Add '+e(label)+'">+</button></div></div>').join('')+'<small class="muted">* Game collection depends on the selected computer hardware. Games are preloaded; storage is not included in CPU base price.</small></div>';
out+='<details class="card gp-bundle-details"><summary>Game compatibility / उपलब्ध गेम बंडल</summary><p class="muted"><b>Retro + PS1 + PSP:</b> Core i3 / i5 3rd, 4th, 5th or 6th Gen.<br><b>Retro + PS1 + PS2 + PSP:</b> Core i5 8th Gen or above.<br><b>Retro + PS1 + PS2 + PSP:</b> Core i3 3rd Gen or above with a 4GB GT 710 (or higher) graphics card.<br><b>Retro only:</b> Basic bundle. Compatibility and game speed depend on actual PC specifications.</p></details>';
if(mode==='manual')out+='<div class="card"><h2>HDMI cable — included in total</h2>'+field('hdmi','Cable length',[['1.5','Normal HDMI 1.5 Meter • '+m(C.parts.hdmi15.price)],['2.2','Normal HDMI 2.2 Meter • '+m(C.parts.hdmi22.price)]])+'<p class="muted">हर CPU / CPU box के साथ एक HDMI cable ज़रूरी है। Length बदलने पर total अपने आप बदलेगा।</p></div>';out+='<div class="card"><h2>Controllers & Connectivity</h2>';for(const key of ['pc','ps3','ps4']){const p=C.parts[key],q=Number(s.controllers[key]||0);out+='<div class="line"><img src="'+e(cpuAsset(p.image))+'" alt="'+e(p.name)+'" loading="lazy" onclick="openCPUImage(this.src)"><div class="copy">'+e(p.name)+'<small>'+m(p.price)+' each'+(key==='pc'?' • 1.4m cable':' • USB charging cable automatically added')+'</small></div><div class="qty"><button type="button" data-controller="'+key+'" data-delta="-1" aria-label="Remove '+key+' controller">−</button><span>'+q+'</span><button type="button" data-controller="'+key+'" data-delta="1" aria-label="Add '+key+' controller">+</button></div></div>';}
const wireless=Number(s.controllers.ps3||0)+Number(s.controllers.ps4||0)>0;out+=check('dongle','Kontron USB Wi-Fi + Bluetooth Dongle • '+m(C.parts.dongle.price));if(wireless)out+='<div class="notice">Wireless controller के लिए 1 dongle अपने आप शामिल है। एक से ज्यादा controller लेने पर dongle दोबारा नहीं जुड़ेगा।</div>';out+='</div><div class="card"><h2>Add Arcade Box & TV</h2>'+field('box','Choose box',[['none','No Arcade Box'],...Object.entries(C.boxes).map(([id,b])=>[id,b.name+' • '+m(b.price)])]);if(s.box!=='none')out+='<img src="'+cpuAsset(C.boxes[s.box].image)+'" alt="'+C.boxes[s.box].name+'" style="width:100%;height:150px;object-fit:contain">';out+=check('lcd','Add TV / LCD');if(s.lcd)out+=field('tv','TV model',[['24','24 Inch Non-Smart LCD TV • ₹5,200 • 1 Year Warranty'],['32','32 Inch Smart TV • ₹8,200 • 1 Year Warranty']])+'<p class="muted">'+(s.box==='full'?'Full Body में TV mounted रहेगा। Courier में केवल TV weight जुड़ेगा, TV carton का size अलग से नहीं।':'TV courier packing का size और weight शामिल होगा।')+'</p>';out+='</div><div class="card"><h2>Delivery / Shop Pickup</h2>'+field('fulfillment','Receive your order',[['courier','Courier Delivery — size / weight based'],['pickup','Shop Pickup — Courier ₹0']])+'<p class="muted">'+(s.fulfillment==='pickup'?'Shop पर आकर खरीदें / collect करें। Courier और VAS ₹0।':'CPU courier actual और volumetric weight के अनुसार निकलेगा। Packing measurements अनुमानित हैं।')+'</p></div>';$('options').innerHTML=out;
document.querySelectorAll('[data-key]').forEach(x=>x.onchange=()=>{const key=x.dataset.key;if(key==='preset'){s.storageOptionsConfirmed=true;const extra={controllers:s.controllers,dongle:s.dongle,box:s.box,lcd:s.lcd,tv:s.tv,fulfillment:s.fulfillment,usbQty:s.usbQty,usb128Qty:s.usb128Qty,hdd500Qty:s.hdd500Qty,extraSsd:s.extraSsd};s={...C.preset(x.value),...extra};}else{s[key]=x.value;if(key==='storage')s.storageOptionsConfirmed=true;if(key==='casePower'){s.cabinet=['both','cabinet'].includes(x.value);s.smps=['both','smps'].includes(x.value);}if(key==='board'){s.processor=s.board==='h110'?'i56':'i3';s.ram=s.board==='h110'?'ddr4':'ddr3';}if(key==='box'&&s.box==='full')s.tv='32';if(key==='storage'){if(s.storage==='ssd')s.extraSsd=false;}}render();});
document.querySelectorAll('[data-check]').forEach(x=>x.onchange=()=>{s[x.dataset.check]=x.checked;render();});document.querySelectorAll('[data-usb-delta]').forEach(x=>x.onclick=()=>{s.usbQty=Math.max(0,Math.min(99,(Number(s.usbQty)||0)+Number(x.dataset.usbDelta)));s.extraUsb=false;render();});document.querySelectorAll('[data-batocera-key]').forEach(x=>x.onclick=()=>{const key=x.dataset.batoceraKey;s[key]=Math.max(0,Math.min(99,(Number(s[key])||0)+Number(x.dataset.batoceraDelta)));render();});document.querySelectorAll('[data-controller]').forEach(x=>x.onclick=()=>{const key=x.dataset.controller;s.controllers[key]=Math.max(0,Math.min(20,Number(s.controllers[key]||0)+Number(x.dataset.delta)));render();});const dongle=document.querySelector('[data-check="dongle"]');if(wireless){dongle.checked=true;dongle.disabled=true;}
try{const c=C.calculate(s);$('setupTitle').textContent=C.title(s);$('setupContents').textContent='Included: '+c.hardware.map(x=>x.name+' × '+x.quantity).join(' • ');$('preview').innerHTML=[...c.hardware,...c.addons].map(x=>row(x,x.quantity,x.lineTotal,mode==='complete'&&c.hardware.includes(x))).join('');const weight=c.totalWeight;const packaging=GPCPUShipping.pack(c.items);$('shippingEstimate').textContent=s.fulfillment==='pickup'?'Shop Pickup • Courier ₹0 • VAS ₹0':'Estimated product weight '+(weight/1000).toFixed(2)+' kg • Packed '+((weight+packaging.packingWeight)/1000).toFixed(2)+' kg • Box '+(packaging.dimensions||[]).join(' × ')+' cm';$('total').textContent=m(c.total);$('bottomTotal').textContent=m(c.total);$('checkout').disabled=false;$('error').textContent='';localStorage.setItem(storageKey,JSON.stringify(s));}catch(err){$('error').textContent=err.message;$('checkout').disabled=true;}}
function save(){
 const calc=C.calculate(s);
 if(!calc.items.length||calc.total<=0)throw Error('Please select a valid CPU setup');
 // Keep the customer's selection editable after using Back without duplicating
 // CPU lines in the legacy configured-cart and the unified shared cart.
 localStorage.setItem(storageKey,JSON.stringify(s));
 // If editing a legacy configured set, replace it instead of keeping a duplicate.
 if(edit){
  try{const old=JSON.parse(localStorage.getItem('gp_configured_sets')||'[]');
    localStorage.setItem('gp_configured_sets',JSON.stringify(old.filter(x=>x.id!==edit)));
  }catch(_){}
 }
 const destination='https://gamesplanet13.github.io/arcade-accessories-/order-prefill.html';
 const rows=calc.items.map(item=>({...item,image:cpuAsset(item.image)}));
 if(window.GPSharedStore&&typeof window.GPSharedStore.checkout==='function'){
  window.GPSharedStore.checkout('cpu-build',rows);
  return;
 }
 // Direct checkout also works when the shared-cart script is unavailable.
 const params=new URLSearchParams({source:'cart',cart:JSON.stringify(rows),cartAt:String(Date.now()),storeSource:'cpu-build'});
 location.href=destination+'?'+params.toString();
}
$('checkout').onclick=()=>{try{save();}catch(err){$('error').textContent='Unable to save: '+err.message;}};render();})();



