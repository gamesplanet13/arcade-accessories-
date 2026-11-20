(() => {
  'use strict';
  const script = document.currentScript;
  const config = script.dataset;
  const assets = new URL('./', script.src);
  const asset = file => new URL(file, assets).href;
  const genres = new Set(['arcade','fighting','racing','flying','mission','mythic','wrestling']);
  const logo = asset('games-planet-icon-512.png');
  const fallbackMascot = asset('images/games-planet-mascot.webp');
  if (!window.GPProductAd) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = asset('catalog-ad.css?v=20261120-ads');
    document.head.append(style);

    function mount(host, {title, genre, image, photoName, before, composition='product', wheel=false}) {
      if (!host || !title || !image || !genres.has(genre)) return;
      let banner = host.querySelector(':scope > .gp-embedded-ad');
      if (!banner) {
        banner = document.createElement('section');
        banner.className = 'gp-catalog-banner gp-embedded-ad';
        banner.innerHTML = '<div class="gp-banner-heading"><img class="gp-banner-logo" width="512" height="512" alt="Games Planet"><strong class="gp-banner-title"></strong><a class="gp-banner-contact" href="https://wa.me/917983624797">WhatsApp <span>7983624797</span></a></div><div class="gp-banner-products"><span class="gp-banner-product"><img></span></div><img class="gp-banner-mascot" width="520" height="520" alt="">';
        if (before && before.parentElement===host) before.before(banner);
        else host.prepend(banner);
      }
      banner.setAttribute('aria-label',title);
      banner.dataset.gameGenre = genre;
      banner.dataset.composition = wheel?'wheel':composition;
      banner.style.setProperty('--gp-banner-scene', `url("${asset('images/catalog-genre-'+genre+'.webp')}")`);
      banner.querySelector('.gp-banner-logo').src = logo;
      banner.querySelector('.gp-banner-title').textContent = title;
      const product = banner.querySelector('.gp-banner-product');
      product.dataset.art = wheel?'wheel':composition;
      const photo = product.querySelector('img');
      photo.alt = photoName||title;
      photo.onerror = () => { product.hidden = true; };
      product.hidden = false;
      photo.src = image;
      const mascot = banner.querySelector('.gp-banner-mascot');
      mascot.onerror = () => { mascot.onerror = null; mascot.src = fallbackMascot; };
      mascot.src = asset('images/catalog-mascot-'+(wheel?'racing-wheel':genre)+'.webp');
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
    const existingImage = config.adPhotoSelector ? document.querySelector(config.adPhotoSelector) : null;
    const image = existingImage?.getAttribute('src') || config.adImage;
    if (image) window.GPProductAd.mount(host, {
      title:config.adTitle, genre:config.adGenre, image, photoName:config.adPhotoName, before:anchor
    });
  }
  if (config.adPreview) {
    const photo = document.querySelector(config.adPreview);
    const modal = photo?.closest('dialog,[role="dialog"],.img-modal,.modal,#imgModal');
    window.GPProductAd.preview(modal, photo);
  }
})();
