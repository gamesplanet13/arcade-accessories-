import assert from 'node:assert/strict';import vm from'node:vm';import {readFileSync}from'node:fs';
const data=new Map(),nodes=new Map();let popup={location:{href:'about:blank'},close(){this.closed=true}},requestHeaders;
const root={GP_ORDER_SERVICE:{apiUrl:'https://test-api.invalid'},open:()=>popup,addEventListener(){}};
const document={readyState:'loading',getElementById:id=>nodes.get(id)||null,querySelector:()=>null,addEventListener(){},createElement:()=>({style:{},setAttribute(){}}),body:{append(n){nodes.set('gpServerSaved',n)}}};
const context=vm.createContext({window:root,document,location:{search:'',pathname:'/test/',href:'https://test.invalid/'},crypto,URL,URLSearchParams,AbortController,Response,TextEncoder,setTimeout,clearTimeout,setInterval(){},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},sessionStorage:{getItem:()=>JSON.stringify({token:'test-customer-token'})},navigator:{onLine:true},alert(){},fetch:async(url,options)=>{requestHeaders=options.headers;return Response.json({error:'Ordering is blocked for this customer.'},{status:403})}});
vm.runInContext(readFileSync(new URL('./order-records.js',import.meta.url),'utf8'),context);
await root.GPOrderRecords.send('Order ID: UNIT-BLOCK\nName: Test\nMobile: 9000000001\nProduct: Console',{paymentMode:'prepaid',items:[{name:'Console',quantity:1}]});
assert.equal(requestHeaders.Authorization,'Bearer test-customer-token');assert.equal(popup.closed,true);assert.equal(popup.location.href,'about:blank');assert.equal(JSON.parse(data.get('gp_order_outbox_v2')).length,0);assert.match(nodes.get('gpServerSaved').textContent,/blocked/);
console.log('PASS blocked submission stops WhatsApp redirect and removes the retry entry; account session is sent for server enforcement.');
