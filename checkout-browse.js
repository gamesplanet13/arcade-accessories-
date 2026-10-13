(function(){'use strict';
const modern=sessionStorage.getItem('gp_store_view')==='new.html',prefix=modern?'new-':'';
const nav=document.createElement('nav');nav.setAttribute('aria-label','Add more products');nav.style.cssText='padding:16px;background:#102137;color:white;display:flex;align-items:center;gap:12px;flex-wrap:wrap';nav.innerHTML='<strong>और सामान जोड़ें / Add more products</strong>'+[['arcade','Arcade Accessories'],['ps2','PS2'],['ps3','PS3'],['ps4','PS4'],['ps5','PS5'],['cpu','CPU'],['gamebox','Game Stick / Game Box']].map(([s,t])=>`<a style="color:#ffd079" href="${prefix+s}.html">${t}</a>`).join('');document.body.prepend(nav);
// Keep customer-entered details while browsing additional categories.
const key='gp_checkout_customer_draft';let draft={};try{draft=JSON.parse(sessionStorage.getItem(key)||'{}')}catch(_){}
const fields=[...document.querySelectorAll('input,textarea,select')].filter(x=>['name','mobile','altMobile','email','address','house','landmark','pincode','state','city','postoffice','postofficeManual','buyerBusinessName','buyerGstin','buyerBillingAddress'].includes(x.id)&&!x.disabled);
fields.forEach(el=>{if(Object.hasOwn(draft,el.id)){if(el.type==='radio'||el.type==='checkbox')el.checked=!!draft[el.id];else el.value=draft[el.id]}});
fields.forEach(el=>{if(Object.hasOwn(draft,el.id))el.dispatchEvent(new Event('input',{bubbles:true}))});
function save(){const d={};fields.forEach(el=>d[el.id]=(el.type==='radio'||el.type==='checkbox')?el.checked:el.value);sessionStorage.setItem(key,JSON.stringify(d))}
document.addEventListener('input',save);document.addEventListener('change',save);window.addEventListener('pagehide',save);
})();
