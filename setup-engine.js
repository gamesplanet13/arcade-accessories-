(function(root){
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function item(name,variant,price,quantity=1,battery=false){return {name,product:name,variant,quantity,unitPrice:price,baseUnitPrice:price,lineTotal:price*quantity,unitWeight:0,lineWeight:0,dimensions:[],containsBattery:battery,configured:true,courierConfirm:true}}
function calculate(data,type,state){let items=[];
if(type==='cpu'){const c=data.cpu.find(x=>x.id===state.cpu);if(!c)throw Error('Choose a CPU version');items.push(item(c.name,c.spec,c.price))}
if(type==='arcade'){const a=data.arcade.find(x=>x.id===state.box);if(!a)throw Error('Choose a box');const mode=state.system||'base';if(!['base','gamebox','ps2'].includes(mode))throw Error('Choose a system');items.push(item(a.name,mode==='base'?'Without game system':mode==='gamebox'?'GameBox with connectors':'PS2 gaming system',a[mode]))}
if(type==='ps2'){
 items.push(item('PS2 Black Console','Console only — accessories selected below',8500));
 for(const [key,qty] of Object.entries(state.accessories||{})){if(!Number.isInteger(qty)||qty<0||qty>20)throw Error('Invalid accessory quantity');if(qty){const a=data.ps2.find(x=>x.id===key);if(!a)throw Error('Unknown accessory');items.push(item(a.name,'PS2 setup accessory',a.price,qty,key==='wireless'))}}
}
if(type!=='arcade')for(const id of state.drives||[]){const d=data.drives.find(x=>x.id===id);if(!d||d.price===null)throw Error('Drive price needs confirmation');items.push(item(d.name,'Additional external game drive',d.price))}
if(!items.length)throw Error('Select a setup');return {items,total:items.reduce((s,x)=>s+x.lineTotal,0)};
}
root.GPSetup={calculate,money,escape};if(typeof module!=='undefined')module.exports=root.GPSetup;
})(typeof window!=='undefined'?window:globalThis);
