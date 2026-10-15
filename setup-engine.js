(function(root){'use strict';
const part=(name,price,image)=>({name,price,image});
const parts={h61:part('Consistent H61 Motherboard',2610,'images/cpu/consistent-h61-motherboard.jpg'),h110:part('Consistent H110 DDR4 Motherboard',6530,'images/cpu/consistent-h110-ddr4-motherboard.jpg'),i3:part('Intel Core i3 3rd Gen',660,'images/cpu/intel-core-i3-3rd-gen.jpg'),i5:part('Intel Core i5 3rd Gen',1740,'images/cpu/intel-core-i5-3rd-gen.jpg'),i56:part('Intel Core i5 6th Gen',2470,'images/cpu/intel-core-i5-6th-gen.jpg'),ddr3:part('Consistent DDR3 4GB RAM',1020,'images/cpu/consistent-ddr3-4gb-ram.jpg'),ddr4:part('Consistent DDR4 8GB RAM',5660,'images/cpu/consistent-ddr4-8gb-ram.jpg'),cabinet:part('Cabinet without SMPS',690,'images/cpu-box-zebronics.png'),smps:part('Zebronics SMPS 450',700,'images/cpu/zebronics-smps-450.jpg'),usb:part('64GB Pendrive',930,'images/sandisk-ultra-64gb.jpg'),ssd:part('Geonix 256GB SSD',3200,'images/cpu/geonix-256gb-ssd.jpg'),usbGames:part('64GB Pendrive Game Loading',480,'images/game-setup.svg'),ssdGames:part('256GB SSD Game Loading',800,'images/game-setup.svg'),assemble:part('Assembling',500,'images/cpu-box-zebronics.png'),windows:part('Windows Setup',350,'images/windows-setup.svg'),gpu:part('Zebronics GT740 DDR3 4GB Graphics',5370,'images/cpu/zebronics-gt740-ddr3-4gb.jpg'),pc:part('PC USB Wired Controller',250,'images/usb-gamepad.svg'),ps3:part('PS3 Sony Replica Wireless Controller',620,'images/jpeg/ps3gamepad.jpeg'),ps4:part('PS4 Wireless Controller True Replica — Black',899,'images/jpeg/ps4gamepad.jpeg'),dongle:part('USB Wi-Fi + Bluetooth Dongle',650,'images/wifi-bluetooth-dongle.svg')};
parts.pc.image='images/usb-gamepad.svg';
const boxes={mini:{name:'Mini Arcade Box',price:6342,image:'images/arcade-box-mini.png',lcd:5500,lcdName:'24 Inch LCD'},counter:{name:'Counter Arcade Box',price:9215,image:'images/arcade-box-counter.png',lcd:5500,lcdName:'24 Inch LCD'},full:{name:'Full Body Arcade Box',price:16925,image:'images/arcade-box-full-32inch.png',lcd:8000,lcdName:'TV / LCD'}};
function defaults(mode='complete'){return {buildVersion:2,mode,preset:'1',board:'h61',processor:'i3',ram:'ddr3',storage:'usb',games:true,cabinet:true,smps:true,assemble:true,windows:false,gpu:false,extraUsb:false,extraSsd:false,controllers:{pc:0,ps3:0,ps4:0},dongle:false,box:'none',lcd:false};}
function preset(id){const n=Number(id);if(!Number.isInteger(n)||n<1||n>6)throw Error('Choose a valid CPU configuration');const s=defaults();s.preset=String(id);s.processor=n<=2?'i3':n<=4?'i5':'i56';s.board=n>=5?'h110':'h61';s.ram=n>=5?'ddr4':'ddr3';s.storage=[1,3].includes(n)?'usb':'ssd';s.gpu=n===6;return s;}
function calculate(s){const a=[];const add=(key,quantity=1,variant='')=>{const p=parts[key];if(!p)throw Error('Unknown CPU component');a.push({...p,key,quantity,variant,lineTotal:p.price*quantity});};
if(!['complete','manual'].includes(s.mode))throw Error('Invalid setup mode');if(!['h61','h110'].includes(s.board))throw Error('Select a motherboard');if(s.board==='h61'&&(!['i3','i5'].includes(s.processor)||s.ram!=='ddr3'))throw Error('H61 requires 3rd Gen CPU and DDR3 RAM');if(s.board==='h110'&&(s.processor!=='i56'||s.ram!=='ddr4'))throw Error('H110 requires 6th Gen CPU and DDR4 RAM');
add(s.board);add(s.processor);add(s.ram);if(s.cabinet)add('cabinet');if(s.smps)add('smps');if(s.gpu)add('gpu');if(!['none','usb','ssd'].includes(s.storage))throw Error('Choose a valid main storage');if(s.mode==='complete'&&(!s.cabinet||!s.smps||!s.assemble||s.storage==='none'||!s.games))throw Error('Complete setup requires cabinet, SMPS, storage, games and assembling');
if(s.storage!=='none'){add(s.storage);if(s.games)add(s.storage==='usb'?'usbGames':'ssdGames');}if(s.assemble)add('assemble');if(s.windows)add('windows');
const hardware=a.splice(0);if(s.extraUsb&&s.storage!=='usb'){add('usb',1,'Extra storage');if(s.games)add('usbGames',1,'Extra storage game loading');}if(s.extraSsd&&s.storage!=='ssd'){add('ssd',1,'Extra storage');if(s.games)add('ssdGames',1,'Extra storage game loading');}
let wireless=0;for(const key of ['pc','ps3','ps4']){const q=Number(s.controllers?.[key]||0);if(!Number.isInteger(q)||q<0||q>20)throw Error('Controller quantity must be 0–20');if(q)add(key,q,'Extra controller');if(key!=='pc')wireless+=q;}if(wireless||s.dongle)add('dongle',1,wireless?'Required for wireless controllers':'Optional connectivity');
if(s.box!=='none'){const box=boxes[s.box];if(!box)throw Error('Choose a valid arcade box');a.push({...box,key:'box',quantity:1,variant:s.lcd?'With '+box.lcdName:'Without LCD',price:box.price+(s.lcd?box.lcd:0),lineTotal:box.price+(s.lcd?box.lcd:0)});}
const entry=x=>({name:x.name,product:x.name,variant:x.variant||'',quantity:x.quantity,unitPrice:x.price,baseUnitPrice:x.price,lineTotal:x.lineTotal,image:x.image,unitWeight:0,lineWeight:0,dimensions:[],containsBattery:['ps3','ps4'].includes(x.key),configured:true,courierConfirm:!['usbGames','ssdGames','assemble','windows'].includes(x.key)});
const hardwareTotal=hardware.reduce((sum,x)=>sum+x.lineTotal,0);const items=s.mode==='complete'?[{...entry({name:'CPU Box Complete Setup',price:hardwareTotal,quantity:1,lineTotal:hardwareTotal,image:'images/cpu-box-zebronics.png'}),variant:hardware.map(x=>x.name).join(' • '),components:hardware.map(x=>({name:x.name,image:x.image,quantity:x.quantity}))}]:hardware.map(entry);items.push(...a.map(entry));return{items,hardware,addons:a,total:items.reduce((sum,x)=>sum+x.lineTotal,0),hardwareTotal,wireless:wireless>0};}
root.GPCPU={parts,boxes,defaults,preset,calculate};if(typeof module!=='undefined')module.exports=root.GPCPU;
})(typeof window!=='undefined'?window:globalThis);

(function(root){
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function item(name,variant,price,quantity=1,battery=false){return {name,product:name,variant,quantity,unitPrice:price,baseUnitPrice:price,lineTotal:price*quantity,unitWeight:0,lineWeight:0,dimensions:[],containsBattery:battery,configured:true,courierConfirm:true}}
function calculate(data,type,state){if(type==='cpu'&&state.buildVersion===2)return root.GPCPU.calculate(state);let items=[];
if(type==='cpu'){const c=data.cpu.find(x=>x.id===state.cpu);if(!c)throw Error('Choose a CPU version');items.push(item(c.name,c.spec,c.price))}
if(type==='arcade'){const a=data.arcade.find(x=>x.id===state.box);if(!a)throw Error('Choose a box');const mode=state.system||'base';if(!['base','gamebox','ps2'].includes(mode))throw Error('Choose a system');items.push(item(a.name,mode==='base'?'Without game system':mode==='gamebox'?'GameBox with connectors':'PS2 gaming system',a[mode]))}
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

