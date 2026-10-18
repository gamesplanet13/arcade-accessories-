(function(){
'use strict';
function init(){
 if(!document.getElementById('gp-menu-toggle')&&!document.getElementById('gp-navigation-loader')){document.getElementById('gp-global-navigation')?.remove();const menuScript=document.createElement('script');menuScript.id='gp-navigation-loader';menuScript.src='https://gamesplanet13.github.io/arcade-accessories-/site-navigation.js?v=20261019-account';document.head.append(menuScript);}
 const repo=location.pathname.split('/')[1]?.toLowerCase(),file=location.pathname.split('/').pop().toLowerCase();
 const internal=/prefill|checkout|invoice|admin-orders|customer-orders|bigship-rate|pincode-autofill/i.test(file)||['lablemaker','lablecombiner','combiner','delhiveryordermaker','dukaan','dukaanorder','dukaanor','dukaanthanks','msgtoorder','morder','deliveryinfo','dispatch','ocrdtdc','paytool','calco','servicereceipt','invoice','invoice1','imageconverter','bgtool','registerw'].includes(repo);
 if(internal){document.querySelectorAll('#gp-ps2-style-footer,#gp-global-footer,#gp-related-product-videos,.footer-card').forEach(el=>el.remove());return;}
 if(document.getElementById('gp-ps2-style-footer'))return;
 document.getElementById('gp-global-footer')?.remove();
 const hide=el=>{if(el){el.hidden=true;el.style.setProperty('display','none','important');}};
 document.querySelectorAll('.footer-card').forEach(hide);
 document.querySelectorAll('h2,h3,h4').forEach(el=>{
  if(['Our YouTube Channels','Watch Product Demo','Contact Us'].includes(el.textContent.trim())){const p=el.parentElement;if(p&&!['BODY','MAIN','HTML'].includes(p.tagName)&&p.childElementCount<=3&&!p.querySelector('form,input,select,#products,.product,.grid,.container'))hide(p);}
 });
 document.querySelectorAll('a[href*="instagram.com/singhtech1"]').forEach(el=>{const p=el.parentElement;if(p?.tagName==='DIV'&&p.children.length===1)hide(p);});
 document.querySelectorAll('iframe[src*="28.7831285"],iframe[src*="Games%20Planet%20Gurudwara"]').forEach(hide);
 const style=document.createElement('style');style.id='gp-ps2-footer-style';style.textContent=
 '#gp-ps2-style-footer{box-sizing:border-box;clear:both;display:block!important;position:relative;width:calc(100% - 24px);max-width:900px;margin:32px auto 200px;padding:26px 20px;border:1px solid #e1e7ef;border-radius:16px;background:#fff;color:#273444;font-family:Arial,system-ui,sans-serif;font-size:14px;line-height:1.65;text-align:center;letter-spacing:normal;box-shadow:0 8px 26px #1228400a}'+
 '#gp-ps2-style-footer *{box-sizing:border-box}#gp-ps2-style-footer section{display:block;margin:0;padding:0;border:0;background:none;box-shadow:none}'+
 '#gp-ps2-style-footer h2{color:#152b45;font-size:22px;font-weight:800;margin:0 0 12px;line-height:1.3;background:none;-webkit-text-fill-color:initial}'+
 '#gp-ps2-style-footer h3{color:#273444;font-size:19px;line-height:1.4;font-weight:700;margin:28px 0 16px;text-align:center}'+
 '#gp-ps2-style-footer p{color:#4b5969;font-size:14px;margin:10px 0;line-height:1.7}'+
 '#gp-ps2-style-footer .gp-channel-buttons{display:flex;flex-direction:column;gap:15px;align-items:center}'+
 '#gp-ps2-style-footer a.gp-channel,#gp-ps2-style-footer a.gp-instagram{display:flex;align-items:center;justify-content:center;width:90%;max-width:400px;min-height:44px;padding:10px 20px;border:0;border-radius:6px;color:#fff!important;text-decoration:none;font:700 14px/1.5 Arial,system-ui,sans-serif;box-shadow:none;background:#d90000;text-align:center;margin:0}'+
 '#gp-ps2-style-footer a.gp-channel:nth-child(1){background:#ff0000}#gp-ps2-style-footer a.gp-channel:nth-child(2){background:#2ecc71;color:#07371a!important}#gp-ps2-style-footer a.gp-channel:nth-child(3){background:#3498db}#gp-ps2-style-footer a.gp-channel:nth-child(4){background:#f39c12;color:#382300!important}'+
 '#gp-ps2-style-footer a.gp-instagram{display:inline-flex;width:auto;max-width:100%;background:#e4405f;margin-top:25px;padding:10px 25px;font-size:16px}'+
 '#gp-ps2-style-footer .gp-video-frame{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;width:100%;max-width:100%;border-radius:10px;box-shadow:0 0 10px #0002;background:#101827}'+
 '#gp-ps2-style-footer .gp-video-frame iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}'+
 '#gp-ps2-style-footer .gp-contact-buttons{display:flex;justify-content:center;flex-wrap:wrap;gap:10px}'+
 '#gp-ps2-style-footer .gp-contact-buttons a,#gp-ps2-style-footer a.gp-map-link{display:inline-flex;align-items:center;justify-content:center;min-height:44px;width:auto;max-width:100%;margin:0;padding:10px 16px;border:1px solid #d9e3ee;border-radius:9px;color:#173651;background:#f0f6fc;text-decoration:none;font:700 13px/1.5 Arial,system-ui,sans-serif;box-shadow:none}'+
 '#gp-ps2-style-footer a.gp-map-link{margin:10px auto 16px;background:#2563eb;color:white;border-color:#2563eb}'+
 '#gp-ps2-style-footer .gp-map-frame{display:block;width:100%;height:300px;max-width:100%;border:0;border-radius:10px;background:#edf2f8}'+
 '#gp-ps2-style-footer .gp-rights{font-size:12px;color:#758294;margin-top:25px}'+
 '@media(max-width:480px){#gp-ps2-style-footer{width:calc(100% - 12px);padding:20px 12px;margin-top:22px}#gp-ps2-style-footer .gp-map-frame{height:260px}}'+
 '@media print{#gp-ps2-style-footer{display:none!important}}';
 document.head.append(style);
 const footer=document.createElement('footer');footer.id='gp-ps2-style-footer';footer.setAttribute('aria-label','GAMES PLANET channels, demo video and shop location');
 footer.innerHTML=
 '<h2>GAMES PLANET</h2>'+
 '<section><h3>Our YouTube Channels</h3><div class="gp-channel-buttons">'+
 '<a class="gp-channel" href="https://youtube.com/@singhtechgaming" target="_blank" rel="noopener">Singh Tech Gaming</a>'+
 '<a class="gp-channel" href="https://youtube.com/@gamesplanet13" target="_blank" rel="noopener">Games Planet 13</a>'+
 '<a class="gp-channel" href="https://youtube.com/@gamesvallah" target="_blank" rel="noopener">Games Vallah</a>'+
 '<a class="gp-channel" href="https://youtube.com/@gamingtechindi" target="_blank" rel="noopener">Gaming Tech India</a></div>'+
 '<a class="gp-instagram" href="https://www.instagram.com/singhtech1/" target="_blank" rel="noopener">Follow us on Instagram</a></section>'+
 '<section id="gp-related-product-videos" hidden></section>'+
 '<section><h3>Contact Us</h3><div class="gp-contact-buttons"><a href="tel:+917983624797">Call · 7983624797</a><a href="https://wa.me/917983624797" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:gamesplanet.7983624797@gmail.com">Email</a></div></section>'+
 '<section><h3>Our Shop Location</h3><p>Near JK’s Tyre, Front of Raza Sugar Mill Gate,<br>Gurudwara Road, Civil Lines, Rampur, U.P. 244901</p><a class="gp-map-link" href="https://maps.app.goo.gl/JTaBzF9TTqFH9X2L9" target="_blank" rel="noopener">Open Google Map Location ↗</a><iframe class="gp-map-frame" title="GAMES PLANET shop location — Rampur" src="https://www.google.com/maps?q=28.7831285,79.0245045&z=21&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></section>'+
 '<p class="gp-rights">All rights reserved © 2017–'+new Date().getFullYear()+' · GAMES PLANET</p>';
 document.body.append(footer);
 if(!document.getElementById('gp-related-videos-loader')){const videoScript=document.createElement('script');videoScript.id='gp-related-videos-loader';videoScript.src='https://gamesplanet13.github.io/arcade-accessories-/related-product-videos.js?v=20261017-topic';document.head.append(videoScript);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();