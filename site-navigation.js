(function(){
'use strict';
function init(){
 if(document.getElementById('gp-global-navigation'))return;
 const base='https://gamesplanet13.github.io/',shop=base+'arcade-accessories-/';
 const groups=[
 ['Your Account',[[ 'Customer Login / My Orders',shop+'customer-orders.html'],['Shared Cart / Checkout',shop+'order-prefill.html?source=cart&shared=1'],['Owner Dashboard',shop+'admin-orders.html']]],
 ['Consoles & Game Systems',[
 ['Game Stick, Game Box & Handheld Consoles',shop+'gamebox.html'],
 ['Game Consoles · PS4',shop+'consoles.html'],
 ['PS2 Console',base+'ps2/'],
 ['PS2 FMCB & USB',base+'ps2fmcb/'],
 ['CPU Models / CPU Box',shop+'cpu-setup.html'],
 ['Arcade Box',shop+'arcade-box.html']]],
 ['Parts & Accessories',[
 ['New Products / नए प्रोडक्ट',shop+'arcade.html?view=new'],
 ['Arcade Accessories',shop],
 ['PS2 Accessories',shop+'ps2.html'],['PS3 Accessories',shop+'ps3.html'],
 ['PS4 Accessories',shop+'ps4.html'],['PS5 Accessories',shop+'ps5.html'],
 ['Gaming Accessories',shop+'gaming.html'],['Computer Parts',shop+'cpu.html']]],
 ['Mobile & Electronics',[
 ['Mobile & Audio',shop+'mobile.html'],['Mobile Phone Coolers',shop+'coolers.html'],
 ['Cables',shop+'cables.html'],['Electrical Items',shop+'electrical.html'],
 ['Batteries & Chargers',shop+'batteries.html'],['Decoration',shop+'decoration.html']]],
 ['Game Selectors',[
 ['PS2 Game Selector',base+'ps2gameselector/'],['Game Selector',base+'gameselector/']]]
 ];
 const current=location.pathname.replace(/\/$/,'/index.html');
 const link=([label,url])=>'<a href="'+url+'"'+(new URL(url).pathname.replace(/\/$/,'/index.html')===current?' aria-current="page"':'')+'>'+label+'<span aria-hidden="true">›</span></a>';
 const css=document.createElement('style');css.id='gp-drawer-style';css.textContent=
 '#gp-global-navigation,#gp-site-drawer,#gp-menu-shade{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:normal}'+
 '#gp-global-navigation *,#gp-site-drawer *{box-sizing:border-box}'+
 '#gp-global-navigation{display:flex!important;align-items:center;justify-content:space-between;width:calc(100% - 12px);max-width:1100px;margin:8px auto;padding:10px 14px;background:#fff;color:#17324c;border:1px solid #dce4ee;border-radius:12px;box-shadow:0 3px 14px #1021370a;position:relative;z-index:501;clear:both;text-align:left}'+
 '#gp-global-navigation .gp-menu-brand{font-size:15px;line-height:1.4;font-weight:850;color:#17324c}'+
 '#gp-menu-toggle,#gp-menu-close{display:inline-flex!important;align-items:center;justify-content:center;flex:0 0 44px;width:44px;height:44px;min-width:44px;min-height:44px;padding:10px;margin:0;border:1px solid #d8e3ed;border-radius:10px;background:#f5f8fc;color:#17324c;cursor:pointer;box-shadow:none;font:24px/1 system-ui}'+
 '#gp-menu-toggle svg{width:23px;height:23px;display:block}'+
 '#gp-menu-toggle:focus-visible,#gp-menu-close:focus-visible,#gp-site-drawer a:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}'+
 '#gp-menu-shade{position:fixed;inset:0;z-index:100001;background:#07162999;border:0;padding:0;margin:0;backdrop-filter:blur(2px)}'+
 '#gp-site-drawer{position:fixed;top:0;right:0;bottom:0;width:min(370px,92vw);max-width:100vw;z-index:100002;background:#fff;color:#17324c;padding:16px 16px max(24px,env(safe-area-inset-bottom));overflow-y:auto;overscroll-behavior:contain;box-shadow:-14px 0 45px #0a203b33;text-align:left;line-height:1.5}'+
 '#gp-site-drawer[hidden],#gp-menu-shade[hidden]{display:none!important}'+
 '#gp-site-drawer .gp-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid #e2e9f1}'+
 '#gp-site-drawer h2{font-size:18px;font-weight:800;color:#17324c;margin:0;background:none;-webkit-text-fill-color:initial}'+
 '#gp-site-drawer p{font-size:12px;color:#65768a;margin:4px 0 0}'+
 '#gp-site-drawer section{display:block;margin:0;padding:0;background:none;border:0;box-shadow:none}'+
 '#gp-site-drawer h3{font-size:11px;font-weight:800;color:#65768a;text-transform:uppercase;letter-spacing:.07em;margin:20px 0 8px;text-align:left}'+
 '#gp-site-drawer a{display:flex!important;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:44px;padding:11px 12px;margin:4px 0;border:1px solid #e2e8f0;border-radius:9px;background:#f8fafc;color:#17324c;text-decoration:none;font:650 13px/1.45 system-ui;box-shadow:none;text-align:left;overflow-wrap:anywhere}'+
 '#gp-site-drawer a:hover{background:#eaf2fb;border-color:#b7cde1}#gp-site-drawer a[aria-current]{background:#153c5a;color:#fff;border-color:#153c5a}'+
 'body.gp-site-navigation .gp-category-links,body.gp-site-navigation .gp-checkout-browse,body.gp-site-navigation .gp-related-mobile,body.gp-site-navigation .gp-category-nav .gp-page-tools a{display:none!important}'+
 '@media print{#gp-global-navigation,#gp-site-drawer,#gp-menu-shade{display:none!important}}';
 css.textContent+='#gp-account-link{font:650 12px/1.4 system-ui;color:#17324c;text-decoration:none;margin-left:auto;margin-right:10px;padding:8px;border:1px solid #dce4ee;border-radius:8px}';document.head.append(css);
 const header=document.createElement('header');header.id='gp-global-navigation';
 header.innerHTML='<span class="gp-menu-brand">GAMES PLANET</span><button type="button" id="gp-menu-toggle" aria-label="Open pages menu / सभी पेज" aria-haspopup="dialog" aria-controls="gp-site-drawer" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>';
 const shade=document.createElement('div');shade.id='gp-menu-shade';shade.hidden=true;
 const drawer=document.createElement('aside');drawer.id='gp-site-drawer';drawer.hidden=true;drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');drawer.setAttribute('aria-labelledby','gp-drawer-title');
 drawer.innerHTML='<div class="gp-drawer-head"><div><h2 id="gp-drawer-title">Browse Pages</h2><p>अपनी कैटेगरी चुनें</p></div><button type="button" id="gp-menu-close" aria-label="Close menu">×</button></div><nav aria-label="Product pages">'+groups.map(([title,items])=>'<section><h3>'+title+'</h3>'+items.map(link).join('')+'</section>').join('')+'</nav>';
 const account=document.createElement('a');account.id='gp-account-link';account.href=shop+'customer-orders.html';account.textContent='Login / My Orders';header.insertBefore(account,header.lastElementChild);document.body.prepend(header);document.body.append(shade,drawer);document.body.classList.add('gp-site-navigation');
 
 const repo=location.pathname.split('/')[1]?.toLowerCase(),file=location.pathname.split('/').pop()||'index.html';
 const productRepo=['arcade-accessories-','arcadeaccessories-','ps2','ps2fmcb','fmcbusb','products','renewedconsole','arcadebox','ps2now'].includes(repo);
 const utility=/prefill|checkout|invoice|orders|selector|pincode|bigship/i.test(file);
 if(productRepo&&!utility&&!document.getElementById('gp-page-enquiry')){
  const panel=document.createElement('div');panel.id='gp-page-enquiry';
  panel.style.cssText='box-sizing:border-box;display:flex;justify-content:flex-end;max-width:1100px;width:calc(100% - 12px);margin:8px auto 12px;padding:0 4px';
  const enquiry=document.createElement('a');enquiry.textContent='Enquiry / जानकारी पूछें';enquiry.target='_blank';enquiry.rel='noopener noreferrer';
  enquiry.style.cssText='display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border-radius:9px;background:#08783a;color:#fff;text-decoration:none;font:700 14px/1.4 system-ui;box-shadow:none';

  enquiry.textContent='Selected products enquiry / चुने हुए सामान की जानकारी';
  enquiry.addEventListener('click',event=>{
   let selected=[],details='';
   try{
    if(typeof window.completeSummary==='function')selected=window.completeSummary().items;
    else if(typeof window.ps2Summary==='function')selected=window.ps2Summary().items;
    else if(typeof window.buildOrderSummary==='function')selected=window.buildOrderSummary().items;
    else if(typeof window.gpzCartRead==='function')selected=window.gpzCartRead().map(i=>({...i,name:i.name||i.product,lineTotal:Number(i.unitPrice)*Number(i.quantity)}));
   }catch(_){}
   if(selected.length)details=selected.map(i=>(i.name||i.product)+(i.variant?' — '+i.variant:'')+'\nQty: '+i.quantity+' × ₹'+i.unitPrice+' = ₹'+i.lineTotal).join('\n\n')+'\n\nProducts total: ₹'+selected.reduce((n,i)=>n+Number(i.lineTotal||0),0);
   else details=document.querySelector('#preview')?.innerText.trim()||'';
   if(!details){event.preventDefault();alert('पहले प्रोडक्ट / सेटअप चुनें या cart में जोड़ें।');return}
   enquiry.href='https://wa.me/917983624797?text='+encodeURIComponent('GAMES PLANET — Selected Products Enquiry\nPage: '+document.title+'\n'+location.href+'\n\n'+details+'\n\nकृपया इस चुने हुए सामान की जानकारी और उपलब्धता बताएँ।');
  });
  panel.append(enquiry);
  function placeEnquiry(){const selection=document.querySelector('#ps2CartPreview')||document.querySelector('#orderDetailsSection')||document.querySelector('#summary')?.closest('section')||document.querySelector('#preview')?.closest('section')||document.querySelector('#preview');if(selection){if(selection.nextElementSibling!==panel)selection.after(panel)}else{const footer=document.querySelector('#gp-ps2-style-footer');if(footer)footer.before(panel);else if(!panel.isConnected)document.body.append(panel)}}
  placeEnquiry();window.addEventListener('load',placeEnquiry,{once:true});

 }

 const toggle=document.getElementById('gp-menu-toggle'),close=document.getElementById('gp-menu-close');let previousOverflow='',returnFocus=null;
 function setOpen(open){
  if(open===!drawer.hidden)return;
  if(open){previousOverflow=document.body.style.overflow;returnFocus=document.activeElement;document.body.style.overflow='hidden';}
  drawer.hidden=!open;shade.hidden=!open;toggle.setAttribute('aria-expanded',String(open));
  if(open)close.focus();else{document.body.style.overflow=previousOverflow;if(returnFocus?.isConnected)returnFocus.focus();else toggle.focus();}
 }
 toggle.addEventListener('click',()=>setOpen(drawer.hidden));close.addEventListener('click',()=>setOpen(false));shade.addEventListener('click',()=>setOpen(false));
 drawer.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
 document.addEventListener('keydown',event=>{
  if(drawer.hidden)return;
  if(event.key==='Escape'){event.preventDefault();setOpen(false);return;}
  if(event.key==='Tab'){const nodes=[close,...drawer.querySelectorAll('a[href]')],first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
 });
 window.addEventListener('pageshow',()=>setOpen(false));
 if(!window.GPSharedStore&&!document.getElementById('gp-shared-store-loader')){const script=document.createElement('script');script.id='gp-shared-store-loader';script.src=shop+'shared-store.js?v=20261031-mobile-dock-fix';document.head.append(script)}
 drawer.querySelectorAll('a').forEach(a=>{if(a.href===shop+'order-prefill.html?source=cart&shared=1')a.addEventListener('click',e=>{if(window.GPSharedStore){e.preventDefault();GPSharedStore.checkout()}})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();