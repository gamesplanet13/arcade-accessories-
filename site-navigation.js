(function(){
'use strict';
function init(){
 if(document.getElementById('gp-global-navigation'))return;
 const base='https://gamesplanet13.github.io/',store=base+'arcade-accessories-/';
 const groups=[
 ['Shop',[['Arcade Accessories',store],['Game Consoles',store+'consoles.html'],['PS2 Console',base+'ps2/'],['PS2 FMCB & USB',base+'ps2fmcb/'],['CPU Box',store+'cpu-setup.html'],['Arcade Box',store+'arcade-box.html'],['Game Stick & Game Boxes',store+'gamebox.html']]],
 ['Accessories',[['PS2 Accessories',store+'ps2.html'],['PS3 Accessories',store+'ps3.html'],['PS4 Accessories',store+'ps4.html'],['PS5 Accessories',store+'ps5.html'],['Gaming Accessories',store+'gaming.html'],['Computer Parts',store+'cpu.html']]],
 ['Mobile & Electronics',[['Mobile & Audio',store+'mobile.html'],['Mobile Phone Coolers',store+'coolers.html'],['Cables',store+'cables.html'],['Electrical Items',store+'electrical.html'],['Batteries & Chargers',store+'batteries.html'],['Decoration',store+'decoration.html']]]
 ];
 const current=location.pathname.replace(/\/$/,'/index.html');
 const a=([label,url])=>'<a href="'+url+'"'+(new URL(url).pathname.replace(/\/$/,'/index.html')===current?' aria-current="page"':'')+'>'+label+'</a>';
 const style=document.createElement('style');style.textContent=
 '#gp-global-navigation,#gp-global-footer{box-sizing:border-box;font:14px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;text-align:left;letter-spacing:normal;clear:both}'+
 '#gp-global-navigation * ,#gp-global-footer *{box-sizing:border-box}'+
 '#gp-global-navigation{max-width:1100px;margin:12px auto;padding:14px;border:1px solid #dce4ee;border-radius:16px;background:#fff;color:#172b45;box-shadow:0 4px 18px #132c4510;position:relative;z-index:60}'+
 '#gp-global-navigation .gp-site-brand{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;font-weight:850}'+
 '#gp-global-navigation .gp-site-brand a{background:none;border:0;color:#176441;padding:0;font-size:13px}'+
 '#gp-global-navigation .gp-primary{display:flex;gap:7px;flex-wrap:wrap}'+
 '#gp-global-navigation a,#gp-global-footer a{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:8px 12px;border:1px solid #d9e3ee;border-radius:9px;background:#f5f8fc;color:#163450;text-decoration:none;font-weight:650;font-size:12px;width:auto;max-width:100%;box-shadow:none}'+
 '#gp-global-navigation a:hover,#gp-global-footer a:hover{background:#e8f1fb;border-color:#8eacc9}'+
 '#gp-global-navigation a[aria-current]{background:#173a58;border-color:#173a58;color:#fff}'+
 '#gp-global-navigation details{margin-top:10px;border-top:1px solid #e5ebf2;padding-top:9px}'+
 '#gp-global-navigation summary{cursor:pointer;color:#30536f;font-weight:750;min-height:30px}'+
 '#gp-global-navigation .gp-site-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:12px}'+
 '#gp-global-navigation h3{font-size:13px;color:#17334e;margin:0 0 8px}'+
 '#gp-global-navigation .gp-site-group-links{display:flex;gap:6px;flex-wrap:wrap}'+
 '#gp-global-footer{max-width:1100px;margin:30px auto 190px;padding:24px;background:#102137;color:#dce7f3;border-radius:18px}'+
 '#gp-global-footer .gp-footer-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:24px}'+
 '#gp-global-footer h2{font-size:20px;color:#fff;margin:0 0 12px}'+
 '#gp-global-footer h3{font-size:14px;color:#e7effa;margin:0 0 10px}'+
 '#gp-global-footer p{color:#dce7f3;font-size:13px;margin:8px 0}'+
 '#gp-global-footer .gp-footer-links{display:flex;flex-wrap:wrap;gap:7px}'+
 '#gp-global-footer details{margin-top:15px}#gp-global-footer summary{cursor:pointer;color:#fff}'+
 '#gp-global-footer iframe{width:100%;height:250px;border:0;border-radius:10px;margin-top:10px}'+
 '.gp-related-mobile{display:flex;flex-wrap:wrap;gap:8px;padding-top:12px;margin-top:12px;border-top:1px solid #dce4ee}'+
 '.footer-card[hidden]{display:none!important}'+
 'body.gp-site-navigation .gp-category-nav .gp-category-links,body.gp-site-navigation .gp-category-nav>.gp-page-tools:nth-child(2){display:none!important}'+
 '@media(max-width:640px){#gp-global-navigation{margin:8px 6px;padding:11px}#gp-global-navigation .gp-primary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}#gp-global-navigation .gp-primary a{font-size:11px;padding:8px 6px}#gp-global-navigation .gp-site-groups{grid-template-columns:1fr}#gp-global-footer{margin:22px 6px 190px;padding:18px}#gp-global-footer .gp-footer-grid{grid-template-columns:1fr}}'+
 '@media print{#gp-global-navigation,#gp-global-footer{display:none!important}}';
 document.head.append(style);
 const nav=document.createElement('nav');nav.id='gp-global-navigation';nav.setAttribute('aria-label','GAMES PLANET shop navigation');
 const primary=[groups[0][1][0],groups[0][1][1],groups[0][1][2],groups[0][1][6],groups[2][1][0],groups[2][1][1]];
 nav.innerHTML='<div class="gp-site-brand"><span>GAMES PLANET</span><a href="https://wa.me/917983624797" target="_blank" rel="noopener">WhatsApp</a></div><div class="gp-primary">'+primary.map(a).join('')+'</div><details><summary>All categories / सभी पेज</summary><div class="gp-site-groups">'+groups.map(([title,links])=>'<section><h3>'+title+'</h3><div class="gp-site-group-links">'+links.map(a).join('')+'</div></section>').join('')+'</div></details>';
 if(/(?:new-)?(?:mobile|coolers)\.html$/.test(location.pathname)){
 nav.querySelector('details').open=true;
 nav.insertAdjacentHTML('beforeend','<div class="gp-related-mobile">'+groups[2][1].slice(0,2).map(a).join('')+'</div>');
 }
 document.body.prepend(nav);document.body.classList.add('gp-site-navigation');
 document.querySelectorAll('.footer-card').forEach(el=>el.hidden=true);
 document.querySelectorAll('h3').forEach(el=>{
  if(el.textContent.trim()==='Our YouTube Channels'||el.textContent.trim()==='Contact Us'){if(!el.closest('#gp-global-navigation'))el.parentElement.hidden=true;}
 });
 document.querySelectorAll('a[href*="instagram.com/singhtech1"]').forEach(el=>{const p=el.parentElement;if(p.children.length===1&&p.tagName==='DIV')p.hidden=true;});
 const footer=document.createElement('footer');footer.id='gp-global-footer';
 const channels=[['Games Planet 13','https://youtube.com/@gamesplanet13'],['Singh Tech Gaming','https://youtube.com/@singhtechgaming'],['Games Vallah','https://youtube.com/@gamesvallah'],['Gaming Tech India','https://youtube.com/@gamingtechindi'],['Instagram · Singhtech1','https://www.instagram.com/singhtech1/']];
 footer.innerHTML='<div class="gp-footer-grid"><section><h2>GAMES PLANET</h2><p>Near JK’s Tyre, Front of Raza Sugar Mill Gate,<br>Gurudwara Road, Civil Lines, Rampur, U.P. 244901</p><p>Monday–Sunday · 11:00 AM–9:30 PM</p><div class="gp-footer-links"><a href="tel:+917983624797">Call: 7983624797</a><a href="https://wa.me/917983624797" target="_blank" rel="noopener">WhatsApp</a><a href="https://maps.app.goo.gl/JTaBzF9TTqFH9X2L9" target="_blank" rel="noopener">Google Map Location ↗</a></div><details><summary>Show shop map / दुकान का नक्शा</summary><iframe title="GAMES PLANET Rampur location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Games%20Planet%20Gurudwara%20Road%20Civil%20Lines%20Rampur%20244901&output=embed"></iframe></details></section><section><h3>Our Channels & Social Links</h3><div class="gp-footer-links">'+channels.map(a).join('')+'</div><p style="margin-top:16px">Explore more products</p><div class="gp-footer-links">'+[groups[0][1][0],groups[0][1][1],groups[2][1][0],groups[2][1][1]].map(a).join('')+'</div></section></div>';
 footer.querySelectorAll('a[href^="https://youtube"],a[href*="instagram"]').forEach(el=>{el.target='_blank';el.rel='noopener';});
 document.body.append(footer);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();