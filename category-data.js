(function(){'use strict';
const pages=[['arcade','Arcade Accessories'],['ps2','PS2'],['ps3','PS3'],['ps4','PS4'],['ps5','PS5'],['cpu','CPU & Computer Parts'],['gamebox','Game Stick & Game Box'],['gaming','Gaming Accessories'],['mobile','Mobile & Audio'],['coolers','Phone Coolers'],['cables','Cables'],['electrical','Electrical Items'],['batteries','Batteries & Chargers'],['decoration','Decoration']];
function group(p){
 const n=p.name,c=p.category;
 if(p.customType==='cpu'||/Computer Parts|Computer & Network/.test(c))return 'cpu';
 if(p.customType==='arcade'||c==='Arcade Box Accessories')return 'arcade';
 if(p.customType==='ps2'||c.startsWith('PS2'))return 'ps2';
 if(c==='PS3'||c==='PS4'||c==='PS5')return c.toLowerCase();
 if(c==='New Gaming Products'){
  if(/PS5/.test(n))return 'ps5';if(/PS4|PlayX/.test(n))return 'ps4';
  if(/^(M22-SD|M88|M23|M33|M66 Neon|GD30|GD20|G11 Pro|G10|G90|M15 Gamestick|R36 Ultra|X7M Remote|X9|K12|SEGA|GS5 Pro)/.test(n))return 'gamebox';
  return 'gaming';
 }
 return ({'Gaming Accessories':'gaming','Mobile & Audio':'mobile','Mobile Phone Coolers':'coolers','Cables':'cables','Electrical Items':'electrical','Batteries and Charger':'batteries','Decoration':'decoration'})[c]||'gaming';
}
window.GPShop={pages,group,prepare(products){
 const best=products.findIndex(p=>p.name==='Best AV Cable for PS2');
 products.forEach(p=>{
  if(p.name==='AV Cable OG'&&best>=0)p.aliasOf=best;
  if(p.name==='HDMI Cable PS5'){p.legacyName=p.name;p.name='PS5 USB Cable';p.category='PS5';p.images=['images/jpeg/ps5usb.jpeg'];p.compatibility='PS5 controller USB cable';}
  if(window.GP_CPU_IMAGES?.[p.name])p.images=[GP_CPU_IMAGES[p.name]];
  p.shopPage=group(p);
 });
 // These cables fit several consoles; keep one product and one cart identity.
 products.forEach(p=>{p.shopPages=[p.shopPage];if(p.name==='Power Cable for PS2 / PS3 / PS4 / PS5')p.shopPages.push('ps2','ps3','ps4','ps5');if(p.name==='HDMI Cable')p.shopPages.push('ps2','ps3','ps4','ps5','cpu');if(/CPU Power Cable|Laptop Power Cable/.test(p.name))p.shopPages.push('cpu');if(p.name==='USB to PS2/PS3/PC Converter')p.shopPages.push('ps3','cpu');});
},migrate(state,products){
 products.forEach((p,i)=>{if(p.aliasOf!==undefined){state[p.aliasOf]=(Number(state[p.aliasOf])||0)+(Number(state[i])||0);state[i]=0;}});
 localStorage.setItem('gp_cart',JSON.stringify(state));return state;
}};
})();
