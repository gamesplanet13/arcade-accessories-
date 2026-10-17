(function(){'use strict';
const pages=[['arcade','Arcade Accessories'],['ps2','PS2'],['ps3','PS3'],['ps4','PS4'],['consoles','Game Consoles'],['ps5','PS5'],['cpu','CPU & Computer Parts'],['arcade-box','Arcade Box'],['gamebox','Game Stick, Game Box & Handheld Consoles'],['gaming','Gaming Accessories'],['mobile','Mobile & Audio'],['coolers','Phone Coolers'],['cables','Cables'],['electrical','Electrical Items'],['batteries','Batteries & Chargers'],['decoration','Decoration']];
function group(p){
 const n=p.name,c=p.category;
 if(!/controller|gamepad|cable|converter|cover|case|casing|silicone|charger|charging|remote plate/i.test(n)&&/(?:\bM\s*(?:22|23|33|66|88)\b|\bGD\s*\d+\b|\bG\s*(?:10|11\s*Pro|90)\b|\bGS5\s*(?:Mini|Pro)\b|\bR\s*(?:35S|36S|36\s*Ultra)\b|\bX\s*(?:9|7M)\b|\bM15\b|gamestick|game\s*stick|handheld|retro\s*console)/i.test(n))return 'gamebox';
 if(c==='Game Consoles')return 'consoles';if(c==='Game Stick, Game Box & Handheld Consoles')return 'gamebox';
 if(p.customType==='cpu'||/Computer Parts|Computer & Network/.test(c))return 'cpu';
 if(p.customType==='arcade')return 'arcade-box';
 if(c==='Arcade Box Accessories')return 'arcade';
 if(p.customType==='ps2'||c.startsWith('PS2'))return 'ps2';
 if(c==='PS3'||c==='PS4'||c==='PS5')return c.toLowerCase();
 if(c==='New Gaming Products'){
  if(/PS5/.test(n))return 'ps5';if(/PS4|PlayX/.test(n))return 'ps4';
  if(/^(M22|M88|M23|M33|M66|GD\d+|G11 Pro|G10|G90|M15 Gamestick|R36 Ultra|X7M Remote|X9|K12|SEGA|GS5 Pro)/.test(n))return 'gamebox';
  return 'gaming';
 }
 return ({'Gaming Accessories':'gaming','Mobile & Audio':'mobile','Mobile Phone Coolers':'coolers','Cables':'cables','Electrical Items':'electrical','Batteries and Charger':'batteries','Decoration':'decoration'})[c]||'gaming';
}
window.GPShop={pages,group,prepare(products){
 const consoleProducts=[{"name":"PS4 Slim 500GB Black","price":29999,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Firmware 13.52 • Renewed / Next to New","2 Months Warranty","Includes 1 compatible non-original controller, TV / HDMI cable, power cable and USB charging cable","Games optional — charged separately"],"containsBattery":true},{"name":"PS4 Slim 500GB White","price":30499,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Firmware 13.52 • Renewed / Next to New","2 Months Warranty","Includes 1 compatible non-original controller, TV / HDMI cable, power cable and USB charging cable","Games optional — charged separately"],"containsBattery":true},{"name":"PS4 Slim 500GB PlayStation Edition Blue","price":33499,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Firmware 13.52 • Renewed / Next to New","2 Months Warranty","Includes 1 compatible non-original controller, TV / HDMI cable, power cable and USB charging cable","Games optional — charged separately"],"containsBattery":true},{"name":"PS4 Slim 500GB Dragon Quest Edition","price":33499,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Firmware 13.52 • Renewed / Next to New","2 Months Warranty","Includes 1 compatible non-original controller, TV / HDMI cable, power cable and USB charging cable","Games optional — charged separately"],"containsBattery":true},{"name":"PS4 Pro 1TB Black","price":35999,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Firmware 13.52 • Renewed / Next to New","2 Months Warranty","Includes 1 compatible non-original controller, TV / HDMI cable, power cable and USB charging cable","Games optional — charged separately"],"containsBattery":true},{"name":"PS4 Pro 1TB White","price":35999,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Firmware 13.52 • Renewed / Next to New","2 Months Warranty","Includes 1 compatible non-original controller, TV / HDMI cable, power cable and USB charging cable","Games optional — charged separately"],"containsBattery":true},{"name":"PS4 500GB Games Pack — Optional Service","price":1500,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Optional game-loading service for your PS4 console","Choose games according to your preference; storage capacity must match your console"],"containsBattery":false},{"name":"PS4 1TB Games Pack — Optional Service","price":3000,"category":"Game Consoles","weight":0,"dimensions":[],"images":["images/product-pending.svg"],"features":["Optional game-loading service for your PS4 console","Choose games according to your preference; storage capacity must match your console"],"containsBattery":false}];
 consoleProducts.forEach(p=>{if(!products.some(x=>x.name===p.name))products.push(p)});
 if(!products.some(p=>/Kontron.*Dongle/i.test(p.name)))products.push({name:'Kontron USB Wi-Fi + Bluetooth Dongle',price:650,category:'Computer & Network Accessories',weight:20,dimensions:[12,8,3],images:['images/wifi-bluetooth-dongle.svg'],containsBattery:false});
 const usb=products.findIndex(p=>p.name==='PS5 Controller Charging Cable (USB to C)');
 const h110=products.findIndex(p=>p.name==='Consistent H110 DDR4 Motherboard');
 const best=products.findIndex(p=>p.name==='Best AV Cable for PS2');
 products.forEach(p=>{
  if(p.name==='PC Controller'){p.name='Ucom PC USB Controller — 1.4m Cable';p.price=365;p.weight=250;p.dimensions=[17,12,8];p.images=['images/ucom-usb-controller.jpg'];p.containsBattery=false;}
  if(p.name==='HDMI Cable'){p.name='Normal HDMI Cable — 1.5 Meter';p.price=100;}
  if(/Honeycom/i.test(p.name)){p.name='HDMI Cable — 2.2 Meter';p.price=200;}
  if(p.name==='PS5 Controller Charging Cable (USB to C)')p.name='PS5 USB-A to USB-C Cable';
  if(p.name==='PS5 Controller Charging Cable (C to C)')p.name='PS5 USB-C to USB-C Cable';
  if(p.name==='HDMI Cable PS5'&&usb>=0){p.aliasOf=usb;p.price=149;}
  if(p.name==='Zebronics H110 Motherboard'&&h110>=0)p.aliasOf=h110;
  if(p.name==='Consistent H110 DDR4 Motherboard')p.name='H110 DDR4 Motherboard';
  if(p.name==='DDR3 8GB RAM')p.name='Consistent DDR3 8GB RAM';
  if(p.name==='64GB Pendrive')p.name='SanDisk Ultra 64GB USB 3.0 Pendrive';
  if(/^(Normal Cabinet without SMPS|Cabinet \+ SMPS)$/.test(p.name)){p.images=['images/cpu-box-zebronics.png'];p.name=p.name.replace('Normal Cabinet','Zebronics Basic Cabinet').replace(/^Cabinet/,'Zebronics Basic Cabinet');}
  if(p.customType==='ps2')p.images=['images/ps2-black-70000.jpg'];
  if(p.name==='Assembling')p.images=['images/assembling.svg'];
  if(p.name==='Windows Setup')p.images=['images/windows-setup.svg'];
  if(/Game Setup/.test(p.name))p.images=['images/game-setup.svg'];
  if(p.name==='Laptop Power Cable')p.images=['images/jpeg/laptopcable.jpeg'];
  if(p.name==='ANT Esports RGB Cabinet'){p.name='ANT Esports Elite 1100 RGB Cabinet';p.price=2649;p.images=['images/ant-esports-elite-1100.png'];}

  if(p.name==='AV Cable OG'&&best>=0)p.aliasOf=best;
  if(p.name==='HDMI Cable PS5'){p.legacyName=p.name;p.name='PS5 USB Cable';p.category='PS5';p.images=['images/jpeg/ps5usb.jpeg'];p.compatibility='PS5 controller USB cable';}
  if(window.GP_CPU_IMAGES?.[p.name])p.images=[GP_CPU_IMAGES[p.name]];
  if(/^(Cabinet \+ SMPS|Zebronics Basic Cabinet \+ SMPS)$/.test(p.name)){p.name='Cabinet with SMPS';p.price=1390;p.features=['Cabinet ₹690 + SMPS ₹700'];}
  if(p.customType==='cpu'){p.price=7810;p.priceLabel='From ₹7,810';}
  p.shopPage=group(p);if(p.shopPage==='gamebox')p.category='Game Stick, Game Box & Handheld Consoles';
 });
 // These cables fit several consoles; keep one product and one cart identity.
 products.forEach(p=>{p.shopPages=[p.shopPage];if((p.shopPage==='ps4'&&!/Console/i.test(p.name))||/HDMI Cable|Power Cable for PS2 \/ PS3 \/ PS4 \/ PS5|CPU \/ PS4 Pro Power Cable/.test(p.name))p.shopPages.push('consoles');if(!/Xbox/i.test(p.name)&&/Ucom.*Controller|USB Gamepad|USB.*(?:Wired )?Controller/i.test(p.name))p.shopPages.push('cpu','arcade','gaming');if(p.name==='Power Cable for PS2 / PS3 / PS4 / PS5')p.shopPages.push('ps2','ps3','ps4','ps5');if(/HDMI Cable/.test(p.name))p.shopPages.push('ps2','ps3','ps4','ps5','cpu');if(/CPU Power Cable|Laptop Power Cable/.test(p.name))p.shopPages.push('cpu');if(p.name==='USB to PS2/PS3/PC Converter')p.shopPages.push('ps3','cpu');});
},migrate(state,products){
 products.forEach((p,i)=>{if(p.aliasOf!==undefined){state[p.aliasOf]=(Number(state[p.aliasOf])||0)+(Number(state[i])||0);state[i]=0;}});
 localStorage.setItem('gp_cart',JSON.stringify(state));return state;
}};
})();
