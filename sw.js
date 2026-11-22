const CACHE_NAME="games-planet-20261123-catalog-routing-photos";
const APP_SHELL=[
  "./","./index.html","./layout-safety.css","./classic.html","./new.html","./store-navigation.js","./stock-rules.js","./stock-ui.js","./stock-checkout.js","./images/cpu-box-zebronics.png","./images/switch-pin-4-8mm.png","./configure.html","./configure.js","./configure.css","./setup-data.js","./setup-engine.js","./configured-cart.js","./setup-checkout.js","./game-selector.html","./selector-order.js","./Simple.html","./order-prefill.html","./bigship-rate-calculator.html","./delhivery-config.js","./invoice.html","./manifest.webmanifest",
  "./assets/html2canvas.min.js",
  "./category-data.js?v=20261123-catalog-routing-photos","./stock-rules.js?v=20261123-catalog-availability","./category-pages.js?v=20261123-catalog-routing-photos","./catalog-ad.js?v=20261123-approved-banners","./catalog-ad.css?v=20261123-approved-banners","./category-pages.css?v=20261120-product-ads",
  "./images/catalog-mascot-arcade.webp","./images/catalog-genre-arcade.webp","./images/arcade-box-mini.png","./images/arcade-box-counter.png","./images/arcade-box-full-32inch.png",
  "./games-planet-logo-transparent.png","./games-planet-icon-192.png","./games-planet-icon-512.png",
  "./NonGSTcurrentQR.jpg","./GSTcurrentQR.png","./pincode_merged_final.json"
];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(async cache=>{
    await Promise.all(APP_SHELL.map(async url=>{
      try{ await cache.add(new Request(url,{cache:"reload"})); }catch(error){ console.warn("Offline cache skipped:",url,error); }
    }));
  }).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("./index.html"))));
    return;
  }
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
