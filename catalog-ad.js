(() => {
  'use strict';
  const script = document.currentScript;
  const config = script.dataset;
  const assets = new URL('./', script.src);
  const asset = file => new URL(file, assets).href;
  const logo = asset('games-planet-icon-512.png');
  const fallbackMascot = asset('images/games-planet-mascot.webp');
  const collections = {
    "arcade-box": {"scene":"fighting","outfit":"01","products":["arcade-box-mini.png","arcade-box-counter.png","arcade-box-full-32inch.png"]},
    "arcade": {"scene":"arcade","outfit":"00","products":["baolian-blue.jpg","md-handle-red.jpeg","coin-drop-switch-current.png","acrylic-coin-machine.jpeg","usb-arcade-pcb.jpg"]},
    "ps2": {"scene":"fighting","outfit":"03","products":["ps2-black-70000.jpg","ps2wire.jpeg","fmcb-7xxxx.jpeg","ps2hdmi.jpeg"]},
    "ps3": {"scene":"wrestling","outfit":"wrestling","products":["9114d292e1d5fb74.webp","ps3gamepad.jpeg","ps3-super-slim-reset.jpg","ps3usb.jpeg"]},
    "ps4": {"scene":"mythic","outfit":"mythic","products":["ps4-slim-black-black-controller-original.jpg","ps4-slim-blue-black-controller-original.jpg","ps4-pro-white-black-controller-original.jpg","ps4gamepad.jpeg"]},
    "ps5": {"scene":"racing","outfit":"08","products":["ps5usb.jpeg","ps5-ctoc.jpeg","ps5-analog-cap.jpg"]},
    "gamebox": {"scene":"flying","outfit":"04","products":["r36-ultra.jpeg","g10.jpeg","gd30-v3-console-controllers.jpg"]},
    "gaming": {"scene":"racing","outfit":"racing","products":["pxn-v3-pro-black.jpeg","generic-2-4g-white-single-no-receiver.jpg","controller-analog-mechanism.jpg"]},
    "cpu": {"scene":"mission","outfit":"mission","products":["cpu-box-zebronics.png","65fa4f5ec90d67df.webp","a48027b7e3b9107a.webp","zebronics-zeb-csh-01.jpg"]},
    "ready-cpu": {"scene":"mission","outfit":"09","products":["cpu-box-zebronics.png","65fa4f5ec90d67df.webp","a48027b7e3b9107a.webp"]},
    "usb-storage": {"scene":"mission","outfit":"11","products":["sandisk-ultra-user-photo.svg"]},
    "mobile": {"scene":"flying","outfit":"05","products":["mobile-mobile-stand.jpg","3366-blue-open.jpg","mobile-crystal-lamp.jpg","mobile-cable-protector.jpg"]},
    "coolers": {"scene":"flying","outfit":"06","products":["l01-mobile-phone-cooler.jpg","phone-cooler-sl25.jpg","phone-cooler-al02.jpg","phone-cooler-sl31.jpg"]},
    "electrical": {"scene":"mission","outfit":"fighting","products":["duke-25w-yellow.jpg","screw-driver-kit.jpeg","extension.jpeg","ac-multi-pin-adapter.jpg"]},
    "cables": {"scene":"mission","outfit":"07","products":["hdmicable.jpeg","ps2pcable.jpeg","Av-male-to-male.jpg","laptopcable.jpeg"]},
    "batteries": {"scene":"racing","outfit":"flying","products":["cell-charger.jpeg","aa-simpex4cell.jpeg","aaapanasonic2cell.jpeg"]},
    "decoration": {"scene":"arcade","outfit":"racing-wheel","products":["inflatable-sofa-set.jpg"]},
    "consoles": {"scene":"fighting","outfit":"02","products":["ps4-slim-black-black-controller-original.jpg","ps2-black-70000.jpg","9114d292e1d5fb74.webp","ps4-pro-white-black-controller-original.jpg"]},
    "all": {"scene":"arcade","outfit":"arcade","products":["arcade-box-mini.png","ps4-slim-black-black-controller-original.jpg","r36-ultra.jpeg","cpu-box-zebronics.png"]},
    "new": {"scene":"flying","outfit":"10","products":["duke-25w-yellow.jpg","ps3-super-slim-reset.jpg","controller-analog-mechanism.jpg","ac-multi-pin-adapter.jpg"]}
  };
  const productPhotos = {
    "arcade-box-mini.png": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/arcade-box-mini.png","name":"Mini Arcade Box","id":"d6e84c5efdaf","mask":"images/category-banners/arcade-box-mini-mask.webp","ratio":2.26383,"width":105.263,"height":178.723,"left":-3.195,"top":-42.128},
    "arcade-box-counter.png": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/arcade-box-counter.png","name":"Counter / Medium 3ft Arcade Box","id":"gp-arcade-counter","mask":"images/category-banners/arcade-box-counter-mask.webp","ratio":0.81275,"width":118.137,"height":111.554,"left":-10.049,"top":-5.777},
    "arcade-box-full-32inch.png": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/arcade-box-full-32inch.png","name":"Full-Size Arcade Box — 32 Inch TV Included","id":"gp-arcade-full","mask":"images/category-banners/arcade-box-full-32inch-mask.webp","ratio":0.61382,"width":123.51,"height":113.821,"left":-10.265,"top":-8.74},
    "baolian-blue.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/approved/baolian-blue.jpg","name":"28mm Imported Arcade Push Button","id":"4a835df31351","mask":"images/category-banners/baolian-blue-mask.webp","ratio":1.28349,"width":135.922,"height":174.455,"left":-13.835,"top":-3.427},
    "md-handle-red.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/md-handle-red.jpeg","name":"MD Handle (With Switch)","id":"329da4ecc87d","mask":"images/category-banners/md-handle-red-mask.webp","ratio":0.70566,"width":149.733,"height":105.66,"left":-24.866,"top":-2.83},
    "coin-drop-switch-current.png": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/coin-drop-switch-current.png","name":"Coin Drop Switch Button","id":"7e48ca7cbed3","mask":"images/category-banners/coin-drop-switch-current-mask.webp","ratio":2.2,"width":103.896,"height":108.98,"left":-1.67,"top":-4.082},
    "acrylic-coin-machine.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/acrylic-coin-machine.jpeg","name":"Acrylic Coin Machine","id":"ca9fb59434e0","mask":"images/category-banners/acrylic-coin-machine-mask.webp","ratio":1.83391,"width":105.66,"height":193.772,"left":-2.83,"top":-46.713},
    "usb-arcade-pcb.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/usb-arcade-pcb.jpg","name":"USB Arcade PCB","id":"a71c0624f2b6","mask":"images/category-banners/usb-arcade-pcb-mask.webp","ratio":1.34146,"width":101.818,"height":102.439,"left":-1.273,"top":-1.22},
    "ps2-black-70000.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/ps2-black-70000.jpg","name":"PS2 Black Console — Build Your Set","id":"70496335279f","mask":"images/category-banners/ps2-black-70000-mask.webp","ratio":0.7717,"width":107.824,"height":105.66,"left":-3.912,"top":-2.83},
    "ps2wire.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps2wire.jpeg","name":"PS2 Wired Controller (Replica)","id":"9f83f22f854b","mask":"images/category-banners/ps2wire-mask.webp","ratio":1.23585,"width":106.87,"height":132.075,"left":-3.626,"top":-15.566},
    "fmcb-7xxxx.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/fmcb-7xxxx.jpeg","name":"PS2 8MB FMCB Memory Card — PS2 Slim 7XXXX","id":"ab797ba0f442","mask":"images/category-banners/fmcb-7xxxx-mask.webp","ratio":2.87283,"width":112.676,"height":323.699,"left":-5.634,"top":-166.474},
    "ps2hdmi.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps2hdmi.jpeg","name":"HDMI Converter for PS2","id":"5c6802ad6921","mask":"images/category-banners/ps2hdmi-mask.webp","ratio":1.14502,"width":105.86,"height":121.212,"left":-3.025,"top":-10.606},
    "9114d292e1d5fb74.webp": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/shared/9114d292e1d5fb74.webp","name":"PlayStation 3 Slim Console — 500GB","id":"be9d50ad8fec","mask":"images/category-banners/9114d292e1d5fb74-mask.webp","ratio":1.81757,"width":104.089,"height":149.324,"left":-1.115,"top":-31.757},
    "ps3gamepad.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps3gamepad.jpeg","name":"PS3 Controller (Replica)","id":"200dbeba8e5c","mask":"images/category-banners/ps3gamepad-mask.webp","ratio":1.66772,"width":106.262,"height":177.215,"left":-3.226,"top":-38.291},
    "ps3-super-slim-reset.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps3-super-slim-reset.jpg","name":"PS3 Super Slim Power / Reset Button with PCB","id":"6c7a3847c73f","mask":"images/category-banners/ps3-super-slim-reset-mask.webp","ratio":1.04545,"width":152.174,"height":159.091,"left":-28.533,"top":-28.409},
    "ps3usb.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps3usb.jpeg","name":"PS3 Controller Charging Cable","id":"395ed2c65c42","mask":"images/category-banners/ps3usb-mask.webp","ratio":1.11111,"width":121.739,"height":135.266,"left":-18.261,"top":-28.019},
    "ps4-slim-black-black-controller-original.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps4-slim-black-black-controller-original.jpg","name":"PS4 Slim 500GB Black","id":"3d6f078368c7","mask":"images/category-banners/ps4-slim-black-black-controller-original-mask.webp","ratio":1.04301,"width":115.464,"height":120.43,"left":-8.041,"top":-10.108},
    "ps4-slim-blue-black-controller-original.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps4-slim-blue-black-controller-original.jpg","name":"PS4 Slim 500GB PlayStation Edition Blue","id":"ccf7a868b615","mask":"images/category-banners/ps4-slim-blue-black-controller-original-mask.webp","ratio":1.04077,"width":115.464,"height":120.172,"left":-7.835,"top":-10.086},
    "ps4-pro-white-black-controller-original.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps4-pro-white-black-controller-original.jpg","name":"PS4 Pro 1TB White","id":"a64483bcf46d","mask":"images/category-banners/ps4-pro-white-black-controller-original-mask.webp","ratio":1.0783,"width":116.183,"height":125.28,"left":-8.091,"top":-11.186},
    "ps4gamepad.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps4gamepad.jpeg","name":"PS4 Wireless Controller True Replica — Black","id":"3af45f7aefd3","mask":"images/category-banners/ps4gamepad-mask.webp","ratio":1.56213,"width":106.061,"height":165.68,"left":-3.03,"top":-32.84},
    "ps5usb.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps5usb.jpeg","name":"PS5 USB-A to USB-C Cable","id":"4af3e21c73ac","mask":"images/category-banners/ps5usb-mask.webp","ratio":1.02377,"width":100,"height":100.366,"left":0,"top":-0.366},
    "ps5-ctoc.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps5-ctoc.jpeg","name":"PS5 USB-C to USB-C Cable","id":"a5dd0e9f1761","mask":"images/category-banners/ps5-ctoc-mask.webp","ratio":1.06426,"width":105.66,"height":112.45,"left":-2.83,"top":-6.225},
    "ps5-analog-cap.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps5-analog-cap.jpg","name":"PS5 Analog Stick Cap","id":"39c9abcc603d","mask":"images/category-banners/ps5-analog-cap-mask.webp","ratio":1.10571,"width":107.075,"height":118.393,"left":-6.119,"top":-9.091},
    "r36-ultra.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/catalog/r36-ultra.jpeg","name":"R36 Ultra","id":"91ee3375b349","mask":"images/category-banners/r36-ultra-mask.webp","ratio":1.17054,"width":122.296,"height":143.152,"left":-14.128,"top":-40.568},
    "g10.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/catalog/g10.jpeg","name":"G10","id":"22e5ef4b09c9","mask":"images/category-banners/g10-mask.webp","ratio":1.26887,"width":104.089,"height":101.651,"left":-2.416,"top":-1.651},
    "gd30-v3-console-controllers.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/shared/gd30-v3-console-controllers.jpg","name":"GPZ GD30v3 – Retro Gaming Console","id":"gpz-gd30-v3","mask":"images/category-banners/gd30-v3-console-controllers-mask.webp","ratio":1.02559,"width":116.424,"height":119.403,"left":-10.811,"top":-10.874},
    "pxn-v3-pro-black.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/pxn-v3-pro-black.jpeg","name":"PXN V3 Pro Steering Wheel and Pedal Set","id":"22e06fc879e4","mask":"images/category-banners/pxn-v3-pro-black-mask.webp","ratio":1.22685,"width":105.66,"height":129.63,"left":-2.83,"top":-21.759},
    "generic-2-4g-white-single-no-receiver.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/generic-2-4g-white-single-no-receiver.jpg","name":"Generic 2.4G Wireless Single Gamepad - White (Without Receiver)","id":"4eab1269fca5","mask":"images/category-banners/generic-2-4g-white-single-no-receiver-mask.webp","ratio":1.55477,"width":127.273,"height":131.802,"left":-13.409,"top":-15.548},
    "controller-analog-mechanism.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/controller-analog-mechanism.jpg","name":"Controller Analog Mechanism","id":"77f8efb09443","mask":"images/category-banners/controller-analog-mechanism-mask.webp","ratio":1.12611,"width":110.02,"height":123.894,"left":-7.662,"top":-10.841},
    "cpu-box-zebronics.png": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/cpu-box-zebronics.png","name":"CPU Box — 6 Configurations","id":"46a599fe7aac","mask":"images/category-banners/cpu-box-zebronics-mask.webp","ratio":0.71715,"width":142.494,"height":102.19,"left":-21.374,"top":-1.277},
    "65fa4f5ec90d67df.webp": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/shared/65fa4f5ec90d67df.webp","name":"Consistent H61 Motherboard","id":"af5dfb92b7ce","mask":"images/category-banners/65fa4f5ec90d67df-mask.webp","ratio":1.0661,"width":112,"height":114.286,"left":-6.6,"top":-5.544},
    "a48027b7e3b9107a.webp": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/shared/a48027b7e3b9107a.webp","name":"Consistent DDR3 4GB RAM","id":"c298c434e95f","mask":"images/category-banners/a48027b7e3b9107a-mask.webp","ratio":0.51786,"width":206.897,"height":107.143,"left":-55.172,"top":-4.018},
    "zebronics-zeb-csh-01.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/zebronics-zeb-csh-01.jpg","name":"Zebronics ZEB-CSH-01 2.5-inch SATA HDD / SSD Enclosure","id":"979b435d2953","mask":"images/category-banners/zebronics-zeb-csh-01-mask.webp","ratio":1.42434,"width":129.33,"height":184.211,"left":-16.628,"top":-34.211},
    "sandisk-ultra-user-photo.svg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/sandisk-ultra-user-photo.svg","name":"SanDisk Ultra USB 3.0 64GB with Batocera Games","id":"386c365859e7","mask":"images/category-banners/sandisk-ultra-user-photo-mask.webp","ratio":0.3125,"width":355.556,"height":111.111,"left":-130.37,"top":-6.481},
    "mobile-mobile-stand.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/mobile-mobile-stand.jpg","name":"Metal Mobile Holding Stand","id":"mobile-metal-stand","mask":"images/category-banners/mobile-mobile-stand-mask.webp","ratio":0.68944,"width":126.126,"height":115.942,"left":-11.111,"top":-10.145},
    "3366-blue-open.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/3366-blue-open.jpg","name":"3366 Tripod","id":"mobile-tripod-3366","mask":"images/category-banners/3366-blue-open-mask.webp","ratio":0.60659,"width":119.169,"height":108.527,"left":-10.543,"top":-2.907},
    "mobile-crystal-lamp.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/mobile-crystal-lamp.jpg","name":"Crystal Table Lamp","id":"mobile-crystal-lamp","mask":"images/category-banners/mobile-crystal-lamp-mask.webp","ratio":0.45981,"width":170.732,"height":104.673,"left":-34.146,"top":-2.43},
    "mobile-cable-protector.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/mobile-cable-protector.jpg","name":"Long Cable Protector — Random Colour","id":"mobile-cable-protector","mask":"images/category-banners/mobile-cable-protector-mask.webp","ratio":0.74586,"width":126.173,"height":103.131,"left":-13.333,"top":-2.21},
    "l01-mobile-phone-cooler.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/l01-mobile-phone-cooler.jpg","name":"L01 Mobile Phone Cooler","id":"033f9e87c159","mask":"images/category-banners/l01-mobile-phone-cooler-mask.webp","ratio":0.7479,"width":157.303,"height":117.647,"left":-25.562,"top":-8.613},
    "phone-cooler-sl25.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/phone-cooler-sl25.jpg","name":"SL-25 15W Semiconductor Mobile Phone Cooler","id":"6cfb263739d5","mask":"images/category-banners/phone-cooler-sl25-mask.webp","ratio":1.01406,"width":110.891,"height":112.45,"left":-5.545,"top":-6.225},
    "phone-cooler-al02.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/phone-cooler-al02.jpg","name":"AL02 RGB Mobile Phone Cooler","id":"7bf2478a4550","mask":"images/category-banners/phone-cooler-al02-mask.webp","ratio":0.97686,"width":147.368,"height":143.959,"left":-23.684,"top":-22.108},
    "phone-cooler-sl31.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/phone-cooler-sl31.jpg","name":"SL-31 Compact Mobile Phone Cooler","id":"1c6bc9f2c2ce","mask":"images/category-banners/phone-cooler-sl31-mask.webp","ratio":0.70553,"width":156.863,"height":110.672,"left":-25.77,"top":-5.336},
    "duke-25w-yellow.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/duke-25w-yellow.jpg","name":"25W Soldering Iron (Duke)","id":"73126c936b69","mask":"images/category-banners/duke-25w-yellow-mask.webp","ratio":0.34015,"width":306.011,"height":104.089,"left":-106.557,"top":-1.673},
    "screw-driver-kit.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/screw-driver-kit.jpeg","name":"Precision Screwdriver Kit","id":"3a2bc7c9d527","mask":"images/category-banners/screw-driver-kit-mask.webp","ratio":0.59539,"width":197.183,"height":117.4,"left":-48.239,"top":-13.208},
    "extension.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/extension.jpeg","name":"10 Socket Extension Board","id":"862ddd6f993c","mask":"images/category-banners/extension-mask.webp","ratio":0.38593,"width":275.862,"height":106.464,"left":-86.7,"top":-2.852},
    "ac-multi-pin-adapter.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ac-multi-pin-adapter.jpg","name":"3 Pin Multi-Slot AC Adapter","id":"8acaa16611d3","mask":"images/category-banners/ac-multi-pin-adapter-mask.webp","ratio":1.28676,"width":106.667,"height":137.255,"left":-4,"top":-27.206},
    "hdmicable.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/hdmicable.jpeg","name":"Normal HDMI Cable — 1.5 Meter","id":"7df34a26956d","mask":"images/category-banners/hdmicable-mask.webp","ratio":1.68051,"width":106.464,"height":178.914,"left":-3.232,"top":-38.339},
    "ps2pcable.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/ps2pcable.jpeg","name":"Power Cable for PS2 / PS3 / PS4 / PS5","id":"ac65db97dd63","mask":"images/category-banners/ps2pcable-mask.webp","ratio":1.38931,"width":102.564,"height":104.071,"left":-1.282,"top":-2.036},
    "Av-male-to-male.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/Av-male-to-male.jpg","name":"AV Male to Male Cable","id":"618eab241c20","mask":"images/category-banners/Av-male-to-male-mask.webp","ratio":0.91023,"width":110.454,"height":100.539,"left":-1.381,"top":0},
    "laptopcable.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/laptopcable.jpeg","name":"Laptop Power Cable","id":"fd436243bace","mask":"images/category-banners/laptopcable-mask.webp","ratio":0.7259,"width":145.833,"height":105.86,"left":-22.917,"top":-3.025},
    "cell-charger.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/cell-charger.jpeg","name":"AA/AAA 4-Slot Battery Charger","id":"a4de77b2f0f9","mask":"images/category-banners/cell-charger-mask.webp","ratio":0.53497,"width":197.88,"height":105.86,"left":-48.763,"top":-2.836},
    "aa-simpex4cell.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/aa-simpex4cell.jpeg","name":"Simpex AA Rechargeable Cells (4 Pack)","id":"ca713a7464d0","mask":"images/category-banners/aa-simpex4cell-mask.webp","ratio":0.7434,"width":142.132,"height":105.66,"left":-21.066,"top":-2.83},
    "aaapanasonic2cell.jpeg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/aaapanasonic2cell.jpeg","name":"Panasonic AAA Rechargeable Cells (2 Pack)","id":"ac97703d0ee8","mask":"images/category-banners/aaapanasonic2cell-mask.webp","ratio":0.73157,"width":144.703,"height":105.86,"left":-22.222,"top":-2.836},
    "inflatable-sofa-set.jpg": {"url":"https://gamesplanet13.github.io/arcade-accessories-/images/jpeg/inflatable-sofa-set.jpg","name":"Sofa Set with Air Pump","id":"3b85efa7f4c2","mask":"images/category-banners/inflatable-sofa-set-mask.webp","ratio":1.26877,"width":106.87,"height":101.695,"left":-3.817,"top":-0.242}
  };
  if (!window.GPProductAd) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = asset('catalog-ad.css?v=20261122-thumbnails');
    document.head.append(style);

    function mount(host, {title, category, eligible, before, heading}) {
      if (!host || !title) return;
      const set = collections[category];
      if (!set) return;
      const byId = eligible ? new Map(eligible.map(item => [item.id, item])) : null;
      const lineup = set.products.map(key => productPhotos[key]).filter(photo => {
        if (!byId) return true;
        const item = byId.get(photo.id);
        if (!item) return false;
        const paths = [...(item.images || []), ...Object.values(item.variantImages || {})].map(path => asset(path));
        if (!paths.includes(photo.url)) return false;
        const variant = Object.keys(item.variantImages || {}).find(key => asset(item.variantImages[key]) === photo.url);
        return !variant || (item.variantStocks?.[variant] !== 0 && !item.unavailableVariants?.includes(variant));
      });
      if (!lineup.length) {
        host.querySelector(':scope > .gp-embedded-ad')?.remove();
        return;
      }
      let banner = host.querySelector(':scope > .gp-embedded-ad');
      if (!banner) {
        banner = document.createElement('section');
        banner.className = 'gp-catalog-banner gp-embedded-ad gp-category-thumbnail';
        banner.innerHTML = '<div class="gp-thumb-heading"><img class="gp-thumb-logo" width="512" height="512" alt="Games Planet"><strong class="gp-thumb-title"></strong><a class="gp-thumb-contact" href="https://wa.me/917983624797">WhatsApp <span>7983624797</span></a></div><div class="gp-thumb-products"></div><img class="gp-thumb-mascot" width="360" height="360" alt="" decoding="async">';
        const brand = banner.querySelector('.gp-thumb-logo');
        brand.src = logo;
        if (heading) {
          heading.classList.add('gp-thumb-title');
          banner.querySelector('strong').replaceWith(heading);
        }
        if (before?.parentElement === host) before.before(banner);
        else host.prepend(banner);
      }
      const signature = JSON.stringify([category, title, lineup.map(p => p.mask)]);
      if (banner.dataset.signature === signature) return banner;
      banner.dataset.signature = signature;
      banner.dataset.category = category;
      banner.dataset.productCount = String(lineup.length);
      banner.setAttribute('aria-label',title);
      banner.style.setProperty('--gp-thumb-scene', 'url("' + asset('images/catalog-genre-' + set.scene + '.webp') + '")');
      banner.querySelector('.gp-thumb-title').textContent = title;
      const mascot = banner.querySelector('.gp-thumb-mascot');
      const outfit = /^\d{2}$/.test(set.outfit) ? 'images/category-banners/outfit-' + set.outfit + '.webp' : 'images/catalog-mascot-' + set.outfit + '.webp';
      mascot.onerror = () => { mascot.onerror = null; mascot.src = fallbackMascot; };
      mascot.src = asset(outfit);
      banner.querySelector('.gp-thumb-products').replaceChildren(...lineup.map(photo => {
        const slot = document.createElement('div');
        slot.className = 'gp-thumb-slot';
        const crop = document.createElement('div');
        crop.className = 'gp-thumb-cutout';
        crop.style.setProperty('--cutout-ratio',photo.ratio);
        const image = document.createElement('img');
        image.alt = photo.name;
        image.decoding = 'async';
        image.style.cssText = 'width:' + photo.width + '%;height:' + photo.height + '%;left:' + photo.left + '%;top:' + photo.top + '%';
        image.style.maskImage = 'url("' + asset(photo.mask) + '")';
        image.style.webkitMaskImage = image.style.maskImage;
        image.onerror = () => slot.remove();
        image.src = photo.url;
        crop.append(image);
        slot.append(crop);
        return slot;
      }));
      return banner;
    }

    function preview(modal, image, pageLink) {
      if (!modal || !image || !image.parentElement) return;
      modal.classList.add('gp-ad-branded-preview');
      const isLightbox = modal.classList.contains('gp-lightbox');
      const url = pageLink || new URL(location.pathname, location.origin).href;
      let header = modal.querySelector('.gp-embedded-preview-brand');
      let link = modal.querySelector('.gp-embedded-preview-link');
      if (!header) {
        header = document.createElement('div');
        header.className = 'gp-embedded-preview-brand';
        header.innerHTML = '<img alt="" width="42" height="42"><span>GAMES PLANET<small>WhatsApp 7983624797</small></span>';
        header.querySelector('img').src = logo;
        if(isLightbox)modal.append(header);
        else image.before(header);
      }
      if (!link) {
        link = document.createElement('p');
        link.className = 'gp-embedded-preview-link';
        if(isLightbox)modal.append(link);
        else image.after(link);
      }
      link.textContent = url;
    }
    window.GPProductAd = {mount, preview};
  }
  if (config.adTitle) {
    const anchor = config.adBefore ? document.querySelector(config.adBefore) : null;
    const host = anchor?.parentElement || document.body;
    const file = location.pathname.split('/').filter(Boolean).pop() || '';
    const category = config.adCategory || (/cpu/i.test(file) ? 'ready-cpu' : /arcade|configure|customize/i.test(file) ? 'arcade-box' : /ps2/i.test(file) ? 'ps2' : 'all');
    window.GPProductAd.mount(host, {title:config.adTitle, category, before:anchor});
  }
  if (config.adPreview) {
    const photo = document.querySelector(config.adPreview);
    const modal = photo?.closest('dialog,[role="dialog"],.img-modal,.modal,#imgModal');
    window.GPProductAd.preview(modal, photo);
  }
})();
