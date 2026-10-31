(function(root){'use strict';
const part=(name,price,image)=>({name,price,image});
const parts={h61:part('Consistent H61 Motherboard',2610,'images/cpu/consistent-h61-motherboard.jpg'),h110:part('Consistent H110 DDR4 Motherboard',6530,'images/cpu/consistent-h110-ddr4-motherboard.jpg'),i3:part('Intel Core i3 3rd Gen',660,'images/cpu/intel-core-i3-3rd-gen.jpg'),i5:part('Intel Core i5 3rd Gen',1740,'images/cpu/intel-core-i5-3rd-gen.jpg'),i56:part('Intel Core i5 6th Gen',2470,'images/cpu/intel-core-i5-6th-gen.jpg'),ddr3:part('Consistent DDR3 4GB RAM',1020,'images/cpu/consistent-ddr3-4gb-ram.jpg'),ddr4:part('Consistent DDR4 8GB RAM',5660,'images/cpu/consistent-ddr4-8gb-ram.jpg'),cabinet:part('Cabinet without SMPS',690,'images/cpu-box-zebronics.png'),smps:part('Zebronics SMPS 450',700,'images/cpu/zebronics-smps-450.jpg'),usb:part('64GB Pendrive with Batocera Games',1999,'images/sandisk-ultra-64gb.jpg'),ssd:part('Geonix 256GB SSD',3200,'images/cpu/geonix-256gb-ssd.jpg'),usbGames:part('Batocera Games — Included with Pendrive',0,'images/game-setup.svg'),ssdGames:part('256GB SSD Game Loading',800,'images/game-setup.svg'),assemble:part('Assembling',500,'images/cpu-box-zebronics.png'),windows:part('Windows Setup',350,'images/windows-setup.svg'),gpu:part('Zebronics GT740 DDR3 4GB Graphics',5370,'images/cpu/zebronics-gt740-ddr3-4gb.jpg'),pc:part('Ucom PC USB Wired Controller — 1.4m Cable',365,'images/ucom-usb-controller.jpg'),ps3:part('PS3 Sony Replica Wireless Controller',620,'images/jpeg/ps3gamepad.jpeg'),ps4:part('PS4 Wireless Controller True Replica — Black',899,'images/jpeg/ps4gamepad.jpeg'),dongle:part('USB Wi-Fi + Bluetooth Dongle',650,'images/wifi-bluetooth-dongle.svg')};
parts.ddr3_8=part('Consistent DDR3 8GB RAM',2180,'images/product-pending.svg');
parts.fan=part('Lapcare CPU Fan',220,'images/cpu/lapcare-cpu-fan.jpg');
parts.cabinetSmps=part('Cabinet with SMPS',parts.cabinet.price+parts.smps.price,'images/cpu-box-zebronics.png');
parts.dongle.name='Kontron USB Wi-Fi + Bluetooth Dongle';
parts.ps3Cable=part('PS3 Controller USB Charging Cable',119,'images/jpeg/ps3usb.jpeg');
parts.ps4Cable=part('PS4 Controller USB Charging Cable',139,'images/jpeg/ps4usb.jpeg');
parts.hdmi15=part('Normal HDMI Cable — 1.5 Meter',100,'images/jpeg/hdmicable.jpeg');
parts.hdmi22=part('Normal HDMI Cable — 2.2 Meter',200,'images/jpeg/honeycom-hdmi-2.2m.jpg');
const shipping={h61:[550,[24,20,6]],h110:[550,[24,20,6]],i3:[350,[12,12,10]],i5:[350,[12,12,10]],i56:[350,[12,12,10]],ddr3:[25,[17,6,2]],ddr4:[25,[17,6,2]],cabinet:[1400,[38.7,30.1,19.1]],smps:[700,[16,15,10]],usb:[25,[12,8,2]],ssd:[60,[14,10,3]],gpu:[450,[25,18,6]],pc:[250,[17,12,8]],ps3:[250,[22,15,9]],ps4:[450,[20,15,8]],dongle:[20,[12,8,3]],ps3Cable:[65,[15,5,5]],ps4Cable:[65,[15,5,5]],usbGames:[0,[]],ssdGames:[0,[]],assemble:[0,[]],windows:[0,[]]};
shipping.hdmi15=[99,[10,10,3]];shipping.hdmi22=[170,[15,15,3]];
shipping.ddr3_8=[25,[17,6,2]];shipping.fan=[0,[]];shipping.cabinetSmps=[2100,[38.7,30.1,19.1]];
for(const [key,[weight,dimensions]] of Object.entries(shipping))Object.assign(parts[key],{weight,dimensions});
const displays={'24':{name:'24 Inch Non-Smart LCD TV — 1 Year Warranty',price:5200,image:'images/tv-24.svg',weight:2650,dimensions:[61.5,40,14],packingWeight:850},'32':{name:'32 Inch Smart TV — 1 Year Warranty',price:8200,image:'images/tv-32.svg',weight:4000,dimensions:[87.9,50,12.7],packingWeight:1800}};
const boxes={mini:{name:'Mini Arcade Box',price:6342,image:'images/arcade-box-mini.png',lcd:5200,lcdName:'24 Inch Non-Smart TV — 1 Year Warranty'},counter:{name:'Counter Arcade Box',price:9215,image:'images/arcade-box-counter.png',lcd:5200,lcdName:'24 Inch Non-Smart TV — 1 Year Warranty'},full:{name:'Full Body Arcade Box',price:16725,image:'images/arcade-box-full-32inch.png',lcd:8200,lcdName:'32 Inch Smart TV — 1 Year Warranty'}};
function defaults(mode='complete'){return {buildVersion:2,mode,hdmi:'1.5',preset:'1',board:'h61',processor:'i3',ram:'ddr3',storage:'none',usbQty:0,games:true,ssdGames:true,fan:true,cabinet:true,smps:true,assemble:true,windows:false,gpu:false,extraUsb:false,extraSsd:false,controllers:{pc:0,ps3:0,ps4:0},dongle:false,box:'none',lcd:false,tv:'24',fulfillment:'courier'};}
function preset(id){const n=Number(id);if(!Number.isInteger(n)||n<1||n>6)throw Error('Choose a valid CPU configuration');const s=defaults();s.preset=String(id);s.processor=n<=2?'i3':n<=4?'i5':'i56';s.board=n>=5?'h110':'h61';s.ram=n>=5?'ddr4':'ddr3';s.storage=[1,3].includes(n)?'none':'ssd';s.gpu=n===6;return s;}
function title(s){const cpu=parts[s.processor]?.name.replace('Intel Core ','')||'Custom CPU';const ram=parts[s.ram]?.name.replace('Consistent ','')||'';const storage=s.storage==='usb'?'64GB USB':s.storage==='ssd'?'256GB SSD':'Without Storage';return 'CPU Box • '+cpu+' • '+ram+' • '+storage+(s.gpu?' • GT740 4GB':'');}
function calculate(input){const s={...input,fan:true,ssdGames:input.ssdGames??input.games??true};const a=[];const add=(key,quantity=1,variant='')=>{const p=parts[key];if(!p)throw Error('Unknown CPU component');a.push({...p,key,quantity,variant,lineTotal:p.price*quantity});};
if(!['complete','manual'].includes(s.mode))throw Error('Invalid setup mode');if(!['h61','h110'].includes(s.board))throw Error('Select a motherboard');if(s.board==='h61'&&(!['i3','i5'].includes(s.processor)||!['ddr3','ddr3_8'].includes(s.ram)))throw Error('H61 requires 3rd Gen CPU and DDR3 RAM');if(s.board==='h110'&&(s.processor!=='i56'||s.ram!=='ddr4'))throw Error('H110 requires 6th Gen CPU and DDR4 RAM');
if(!['1.5','2.2'].includes(s.hdmi||'1.5'))throw Error('Choose a valid HDMI cable length');
add(s.board);add(s.processor);add(s.ram);add('fan');if(s.cabinet&&s.smps)add('cabinetSmps');else{if(s.cabinet)add('cabinet');if(s.smps)add('smps');}if(s.gpu)add('gpu');if(!['none','usb','ssd'].includes(s.storage))throw Error('Choose a valid main storage');if(s.mode==='complete'&&(!s.cabinet||!s.smps||!s.assemble))throw Error('Complete setup requires cabinet with SMPS, CPU fan and assembling');
const addStorage=(key,variant='')=>{add(key,1,variant);if(key==='ssd'&&s.ssdGames)add('ssdGames',1,variant);};
if(s.storage!=='none')addStorage(s.storage);if(s.assemble)add('assemble');if(s.windows&&(s.storage==='ssd'||s.extraSsd))add('windows');
const hardware=a.splice(0);add((s.hdmi||'1.5')==='2.2'?'hdmi22':'hdmi15',1,'Required HDMI cable');const pendriveQty=Number(s.usbQty??(s.extraUsb?1:0));if(!Number.isInteger(pendriveQty)||pendriveQty<0||pendriveQty>99)throw Error('Batocera Pendrive quantity must be 0–99');if(pendriveQty)add('usb',pendriveQty,'Optional Batocera Games Pendrive');if(s.extraSsd&&s.storage!=='ssd'){addStorage('ssd','Extra storage');}
let wireless=0;for(const key of ['pc','ps3','ps4']){const q=Number(s.controllers?.[key]||0);if(!Number.isInteger(q)||q<0||q>20)throw Error('Controller quantity must be 0–20');if(q){add(key,q,'Extra controller');if(key==='ps3'||key==='ps4')add(key+'Cable',q,'Required USB charging cable for CPU controller');}if(key!=='pc')wireless+=q;}if(wireless||s.dongle)add('dongle',1,wireless?'Required for wireless controllers':'Optional connectivity');
if(s.box!=='none'){const box=boxes[s.box];if(!box)throw Error('Choose a valid arcade box');const boxShipping={mini:[6500,[80,40,38]],counter:[16000,[92,76,45]],full:[35000,[80,76,180]]}[s.box];a.push({...box,key:'box',quantity:1,variant:s.lcd?'With TV — listed separately':'Without LCD',lineTotal:box.price,weight:boxShipping[0],dimensions:boxShipping[1],packingWeight:s.box==='full'?2500:1000});}
if(s.lcd){const id=s.tv|| (s.box==='full'?'32':'24'),tv=displays[id];if(!tv)throw Error('Choose a valid TV');const mounted=s.box==='full';a.push({...tv,key:'tv',quantity:1,lineTotal:tv.price,variant:mounted?'Mounted inside Full Body Arcade — weight only, no separate TV carton size':'Separate TV carton',dimensions:mounted?[]:tv.dimensions,packingWeight:mounted?0:tv.packingWeight,shippingIgnoreDimensions:mounted});}
const entry=x=>({name:x.name,product:x.name,variant:x.variant||'',quantity:x.quantity,unitPrice:x.price,baseUnitPrice:x.price,lineTotal:x.lineTotal,image:x.image,unitWeight:Number(x.weight)||0,lineWeight:(Number(x.weight)||0)*x.quantity,dimensions:x.dimensions||[],containsBattery:['ps3','ps4'].includes(x.key),configured:true,cpuBuild:true,fulfillment:s.fulfillment==='pickup'?'pickup':'courier',shippingEstimate:true,shippingIgnoreDimensions:!!x.shippingIgnoreDimensions,shippingPackingWeight:Number(x.packingWeight)||0,courierConfirm:false});
const hardwareTotal=hardware.reduce((sum,x)=>sum+x.lineTotal,0),hardwareWeight=hardware.reduce((sum,x)=>sum+(Number(x.weight)||0)*x.quantity,0),assembled=!!s.cabinet&&!!s.assemble;
const items=s.mode==='complete'?[{...entry({name:title(s),price:hardwareTotal,quantity:1,lineTotal:hardwareTotal,image:'images/cpu-box-zebronics.png',weight:hardwareWeight,dimensions:[40,32,22],packingWeight:500}),variant:hardware.map(x=>x.name).join(' • '),components:hardware.map(x=>({name:x.name,image:x.image,quantity:x.quantity,unitWeight:x.weight,dimensions:x.dimensions}))}]:hardware.map(entry);
if(s.mode==='manual'&&assembled){items.forEach(x=>x.shippingIgnoreDimensions=true);items[0].shippingPackages=[{dimensions:[40,32,22],quantity:1}];items[0].shippingPackingWeight=500;}
items.push(...a.map(entry));return{items,hardware,addons:a,total:items.reduce((sum,x)=>sum+x.lineTotal,0),hardwareTotal,wireless:wireless>0,totalWeight:items.reduce((sum,x)=>sum+x.lineWeight,0)};}

root.GPCPU={parts,boxes,displays,defaults,preset,calculate,title};if(typeof module!=='undefined')module.exports=root.GPCPU;
})(typeof window!=='undefined'?window:globalThis);






(function(root){
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function item(name,variant,price,quantity=1,battery=false){return {name,product:name,variant,quantity,unitPrice:price,baseUnitPrice:price,lineTotal:price*quantity,unitWeight:0,lineWeight:0,dimensions:[],containsBattery:battery,configured:true,courierConfirm:true}}
function calculate(data,type,state){if(type==='cpu'&&state.buildVersion===2)return root.GPCPU.calculate(state);let items=[];
if(type==='cpu'){const c=data.cpu.find(x=>x.id===state.cpu);if(!c)throw Error('Choose a CPU version');items.push(item(c.name,c.spec,c.price));const cable=root.GPCPU.parts[(state.hdmi||'1.5')==='2.2'?'hdmi22':'hdmi15'];items.push(item(cable.name,'Required HDMI cable',cable.price))}
if(type==='arcade'){
 const a=data.arcade.find(x=>x.id===state.box);if(!a)throw Error('Choose a box');const mode=state.system||'base';
 const cpuMatch=/^cpu-([1-6])$/.exec(mode);
 if(cpuMatch){
  const cpuState={...root.GPCPU.preset(cpuMatch[1]),hdmi:state.hdmi||'1.5'},cpu=root.GPCPU.calculate(cpuState);
  items.push(item(a.name,'Prepared arcade box • CPU gaming system listed separately'+(a.id==='full'?' • TV included':''),a.base));
  items.push(...cpu.items.map(x=>({...x,arcadeCpuVersion:cpuMatch[1]})));
 }else{
  if(!['base','gamebox','ps2'].includes(mode))throw Error('Choose a system');
  items.push(item(a.name,mode==='base'?'Without game system':mode==='gamebox'?'GameBox with connectors':'PS2 gaming system',a[mode]));
 }
}
if(type==='arcade'){
 const selectedTV=state.tv||'none';
 if(!['none','24','32'].includes(selectedTV))throw Error('Choose a valid TV');
 if(state.box!=='full'&&selectedTV!=='none'){
  const tv=root.GPCPU.displays[selectedTV];items.push({...item(tv.name,'Optional arcade TV • 1 Year Warranty',tv.price),unitWeight:tv.weight,lineWeight:tv.weight,dimensions:tv.dimensions,image:tv.image});
 }
 if(state.box==='full')items[0].variant+=' • 32 Inch TV included • 1 Year Warranty';
}
if(type==='ps2'){
 if(state.ps2Mode==='set'){
  const drive=data.ps2Packs.find(x=>x.id===state.storage);if(!drive)throw Error('Choose a storage size');
  if(![1,2].includes(Number(state.controllers)))throw Error('Choose one or two controllers');
  if(!['top','optional'].includes(state.pack))throw Error('Choose Top or Optional games');
  const controllerCount=Number(state.controllers),card=state.cardType==='funtuna'?'FunTuna':'FMCB';
  const price=8500+599+99+600+375*controllerCount+drive[state.pack];
  items.push(item('PS2 Black Complete Set',drive.name+' • '+controllerCount+' Black Wired Controller'+(controllerCount===2?'s':'')+' • AV Cable • Power Adapter + Cable • 8MB '+card+' Card • '+(state.pack==='top'?'Top '+drive.count+' Games':'Optional Games'),price));
 }else items.push(item('PS2 Black Console','Console only — no accessories included',8500));
 for(const [key,qty] of Object.entries(state.accessories||{})){if(!Number.isInteger(qty)||qty<0||qty>99)throw Error('Invalid accessory quantity');if(qty){const a=data.ps2.find(x=>x.id===key);if(!a)throw Error('Unknown accessory');items.push(item(a.name,'Extra accessory — additional to the chosen set',a.price,qty,key==='wireless'))}}
}
if(type!=='arcade')for(const id of state.drives||[]){const d=data.drives.find(x=>x.id===id);if(!d||d.price===null)throw Error('Drive price needs confirmation');items.push(item(d.name,'Additional external game drive',d.price))}
if(!items.length)throw Error('Select a setup');return {items,total:items.reduce((s,x)=>s+x.lineTotal,0)};
}
root.GPSetup={calculate,money,escape};if(typeof module!=='undefined')module.exports=root.GPSetup;
})(typeof window!=='undefined'?window:globalThis);



(function(root){'use strict';function pack(items,manual){const cpu=items.some(i=>i.cpuBuild);let packages=[];for(const i of items){if(Array.isArray(i.shippingPackages)){for(const p of i.shippingPackages)packages.push({dimensions:p.dimensions,quantity:p.quantity||1});continue;}if(i.shippingIgnoreDimensions)continue;const d=Array.isArray(i.dimensions)?i.dimensions:[];if(d.length===3&&d.every(x=>Number(x)>0))packages.push({dimensions:d,quantity:Number(i.quantity)||1});else if(cpu&&Number(i.lineWeight)>0)packages.push({dimensions:[20,15,8],quantity:Number(i.quantity)||1});}let dimensions=null;if(manual?.length===3&&manual.every(x=>x>0))dimensions=manual;else if(packages.length){const normalized=packages.map(p=>({d:p.dimensions.map(Number).sort((a,b)=>b-a),q:p.quantity}));const length=Math.max(...normalized.map(p=>p.d[0])),width=Math.max(...normalized.map(p=>p.d[1]));const volume=normalized.reduce((sum,p)=>sum+p.d[0]*p.d[1]*p.d[2]*p.q,0);dimensions=[length,width,Math.max(Math.max(...normalized.map(p=>p.d[2])),Math.ceil(volume/(length*width)))];}return{dimensions,packingWeight:cpu?Math.max(250,items.reduce((sum,i)=>sum+(Number(i.shippingPackingWeight)||0)*(Number(i.quantity)||1),0)):250,estimated:cpu};}root.GPCPUShipping={pack};if(typeof module!=='undefined')module.exports=root.GPCPUShipping;})(typeof window!=='undefined'?window:globalThis);



