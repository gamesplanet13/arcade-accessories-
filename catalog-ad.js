(() => {
  'use strict';
  const script = document.currentScript;
  const config = script.dataset;
  const assets = new URL('./', script.src);
  const asset = file => new URL(file, assets).href;
  const logo = asset('games-planet-icon-512.png');
  const artwork = Object.freeze({
    "arcade": "01-arcade-accessories.jpg",
    "arcade-box": "02-arcade-boxes.jpg",
    "gamebox": "03-gamesticks-handhelds.jpg",
    "consoles": "04-game-consoles.jpg",
    "ps2-consoles": "05-ps2-consoles.jpg",
    "ps2-fmcb": "06-ps2-fmcb-usb.jpg",
    "ready-cpu": "07-cpu-models.jpg",
    "ps2": "08-ps2-accessories.jpg",
    "ps3": "09-ps3-accessories.jpg",
    "ps4": "10-ps4-accessories.jpg",
    "ps5": "11-ps5-accessories.jpg",
    "gaming": "12-gaming-accessories.jpg",
    "cpu": "13-computer-parts.jpg",
    "usb-storage": "14-usb-storage.jpg",
    "mobile": "15-mobile-audio.jpg",
    "coolers": "16-phone-coolers.jpg",
    "cables": "17-cables.jpg",
    "electrical": "18-electrical.jpg",
    "batteries": "19-batteries-chargers.jpg",
    "decoration": "20-home-decoration.jpg",
    "new": "21-new-products.jpg"
  });

  if (!window.GPProductAd) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = asset('catalog-ad.css?v=20261123-approved-banners');
    document.head.append(style);

    function mount(host, {title, category, before, heading}) {
      if (!host || !title) return;
      const key = category === 'all' ? 'arcade' : category === 'pc' ? 'cpu' : category;
      if (!Object.hasOwn(artwork, key)) return;

      let banner = host.querySelector(':scope > .gp-embedded-ad');
      if (!banner) {
        banner = document.createElement('section');
        banner.className = 'gp-catalog-banner gp-embedded-ad gp-approved-banner';
        const image = document.createElement('img');
        image.className = 'gp-approved-banner-image';
        image.width = 1280;
        image.height = 720;
        image.decoding = 'async';
        banner.append(image);
        if (heading) {
          heading.classList.add('gp-banner-heading-accessible');
          banner.prepend(heading);
        }
        if (before?.parentElement === host) before.before(banner);
        else host.prepend(banner);
      }

      const image = banner.querySelector('.gp-approved-banner-image');
      image.alt = title + ' — Games Planet';
      if (heading) heading.textContent = title;
      banner.dataset.category = key;
      banner.setAttribute('aria-label', title);
      const imageUrl = asset('images/approved-banners/' + artwork[key]);
      if (image.src !== imageUrl) image.src = imageUrl;
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
    const category = config.adCategory || (/cpu/i.test(file) ? 'ready-cpu' : /arcade|configure|customize/i.test(file) ? 'arcade-box' : /fmcb/i.test(file) ? 'ps2-fmcb' : /ps2/i.test(file) ? 'ps2-consoles' : 'all');
    window.GPProductAd.mount(host, {title:config.adTitle, category, before:anchor});
  }
  if (config.adPreview) {
    const photo = document.querySelector(config.adPreview);
    const modal = photo?.closest('dialog,[role="dialog"],.img-modal,.modal,#imgModal');
    window.GPProductAd.preview(modal, photo);
  }
})();
