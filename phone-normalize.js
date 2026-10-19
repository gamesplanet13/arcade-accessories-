(function(root){'use strict';if(root.GPPhone)return;
function number(v){let d=String(v??'').replace(/\D/g,'');if(d.length===14&&d.startsWith('0091'))d=d.slice(4);else if(d.length===12&&d.startsWith('91'))d=d.slice(2);else if(d.length===11&&d.startsWith('0'))d=d.slice(1);return d}
function text(v){return String(v??'').replace(/(?:\+91|0091)[ \t-]*([6-9](?:[ \t-]*\d){9})(?!\d)/g,(_,n)=>number(n)).replace(/((?:alt[ \t-]*mobile|mobile|phone|whatsapp|contact|मोबाइल)[^\d\n]{0,24})(?:91|0)([6-9]\d{9})(?!\d)/gi,'$1$2')}
root.GPPhone={number,text};if(!root.document)return;const doc=root.document;
function phone(el){return el?.matches?.('input')&&!/pincode|password|orderid|quantity|amount/i.test(el.id+' '+el.name)&&(/tel/i.test(el.type)||/mobile|phone|whatsapp|contact.?number|alt.?number/i.test(el.id+' '+el.name+' '+el.placeholder))}
function fields(){doc.querySelectorAll('input').forEach(el=>{if(!phone(el))return;const d=number(el.value);if(d.length===10){el.value=d;el.setCustomValidity('')}else if(el.value.trim())el.setCustomValidity('Enter a valid 10-digit mobile number');else el.setCustomValidity('')})}
doc.addEventListener('paste',e=>{if(!phone(e.target))return;const d=number(e.clipboardData?.getData('text')||'');if(d.length===10){e.preventDefault();e.target.value=d;e.target.dispatchEvent(new Event('input',{bubbles:true}));e.target.dispatchEvent(new Event('change',{bubbles:true}))}},true);
doc.addEventListener('input',e=>{if(phone(e.target)){const d=number(e.target.value);if(d.length===10)e.target.value=d;e.target.setCustomValidity('')}},true);
for(const event of ['change','submit','click'])doc.addEventListener(event,fields,true);
function whatsapp(url){try{const u=new URL(String(url),location.href);if(/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/.test(u.hostname)&&u.searchParams.has('text')){u.searchParams.set('text',text(u.searchParams.get('text')));return u.href}}catch(_){}return url}
const open=root.open.bind(root);root.open=function(url,...args){return open(whatsapp(url),...args)};
try{const cb=navigator.clipboard,write=cb?.writeText?.bind(cb);if(write)cb.writeText=v=>write(text(v))}catch(_){}
let pending=false;function output(){pending=false;const walk=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){if(n.parentElement?.closest('script,style,textarea'))continue;const next=text(n.nodeValue);if(next!==n.nodeValue)n.nodeValue=next}doc.querySelectorAll('textarea[readonly]').forEach(el=>{const next=text(el.value);if(next!==el.value)el.value=next});doc.querySelectorAll('a[href]').forEach(a=>{const h=whatsapp(a.href);if(h!==a.href)a.href=h})}
function start(){fields();output();new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(output)}}).observe(doc.body,{childList:true,subtree:true,characterData:true})}
if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start()
})(typeof window==='undefined'?globalThis:window);