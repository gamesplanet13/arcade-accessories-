const {test}=require('node:test');
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/order-records.js','utf8');
function boot({failure=false,denied=false,hung=false}={}){
 const fields={},data=new Map(),timers=[],requests=[];let popupCount=0;
 const location={pathname:'/Ordernow/',search:'',href:'https://example.test/Ordernow/'};
 const document={readyState:'loading',getElementById:id=>fields[id]||null,querySelector:()=>null,addEventListener(){},createElement:()=>({style:{},setAttribute(){}}),body:{append(el){fields[el.id||'gpServerSaved']=el}}};
 const window={GP_ORDER_SERVICE:{apiUrl:'https://intake.example.test'},GPPostal:{lookup:()=>hung?new Promise(()=>{}):Promise.resolve(null)},open(){popupCount++;return null},addEventListener(){}};
 const context={window,document,location,localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},sessionStorage:{getItem:()=>null},navigator:{onLine:true},crypto:global.crypto,TextEncoder,URL,URLSearchParams,AbortController,setTimeout(fn,ms){timers.push(ms);return setTimeout(fn,ms/1000)},clearTimeout,setInterval(){},alert(){},fetch:async(url,init)=>{requests.push(JSON.parse(init.body));if(failure)throw Error('offline');if(hung)return new Promise((resolve,reject)=>init.signal.addEventListener('abort',()=>reject(Error('timeout'))));return{ok:!denied,status:denied?403:200,json:async()=>denied?{error:'Orders disabled for this account'}:{id:'test-receipt'}}}};
 vm.createContext(context);vm.runInContext(source,context);
 return{client:window.GPOrderRecords,location,fields,data,timers,requests,popups:()=>popupCount};
}
const msg='Prepaid Order on WhatsApp\nOrder ID: TEST-REDIRECT\nName: Example\nMobile: +919000000000\nPincode: 244901\nProduct: Demo\nAmount Paid: ₹100';
for(const mode of ['success','offline','hung'])test('Ordernow same-tab redirect: '+mode,async()=>{const t=boot({failure:mode==='offline',hung:mode==='hung'});await t.client.send(msg,undefined,{sameTab:true});assert.equal(t.popups(),0);const url=new URL(t.location.href);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/917983624797');assert.match(url.searchParams.get('text'),/Mobile: 9000000000/);assert.equal(t.fields.gpWhatsAppContinue.href,t.location.href);assert.equal(JSON.parse(t.data.get('gp_order_outbox_v2')).length,mode==='success'?0:1);if(mode==='hung'){assert.ok(t.timers.includes(1500));assert.ok(t.timers.includes(5000));}});
test('Explicit account restriction still prevents submission',async()=>{const t=boot({denied:true});await t.client.send(msg,undefined,{sameTab:true});assert.equal(t.location.href,'https://example.test/Ordernow/');assert.equal(JSON.parse(t.data.get('gp_order_outbox_v2')).length,0);});
