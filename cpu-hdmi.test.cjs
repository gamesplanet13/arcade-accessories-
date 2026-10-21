const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('./cpu-build-model.js');
for(let i=1;i<=6;i++){const s=C.preset(i),a=C.calculate(s),b=C.calculate({...s,hdmi:'2.2'});assert.equal(b.total-a.total,100);assert.equal(a.items.filter(x=>/HDMI Cable/.test(x.name)).length,1);assert.equal(a.addons.find(x=>x.key==='hdmi15').lineTotal,100);}
for(const mode of ['complete','manual'])for(const box of ['none','mini','counter','full']){const s={...C.defaults(mode),box},a=C.calculate(s),b=C.calculate({...s,hdmi:'2.2'});assert.equal(b.total-a.total,100);assert.equal(b.items.filter(x=>/HDMI Cable/.test(x.name)).length,1);assert(b.totalWeight>a.totalWeight);}
require('./setup-engine.js');const D=JSON.parse(fs.readFileSync(__dirname+'/setup-data.js','utf8').match(/=\s*(\{[\s\S]*\});?/)[1]);
for(let i=1;i<=6;i++)for(const box of ['mini','counter','full']){const s={box,system:'cpu-'+i,drives:[]},a=global.GPSetup.calculate(D,'arcade',s),b=global.GPSetup.calculate(D,'arcade',{...s,hdmi:'2.2'});assert.equal(b.total-a.total,100);assert.equal(b.items.filter(x=>/HDMI Cable/.test(x.name)).length,1);}
assert.equal(global.GPSetup.calculate(D,'arcade',{box:'mini',system:'base',drives:[]}).items.filter(x=>/HDMI Cable/.test(x.name)).length,0);
console.log('PASS CPU versions 1–6, manual/complete/arcade, default and upgraded HDMI, single quantity, checkout totals and weights.');
