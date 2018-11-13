/*
 * atvImg
 * Copyright 2015 Drew Wilson
 * http://drewwilson.com
 *
 * Version 1.2   -   Updated: Dec. 09, 2015
 *
 */

export const ATVScript = () => {
  const d = document;

  const bd = d.getElementsByTagName('body')[0];

  const htm = d.getElementsByTagName('html')[0];

  const win = window;

  const imgs = d.querySelectorAll('.atvImg');

  const totalImgs = imgs.length;

  const supportsTouch = 'ontouchstart' in win || navigator.msMaxTouchPoints;

  if (totalImgs <= 0) {
    return;
  }

  function processMovement(e, touchEnabled, elem, layers, totalLayers, shine) {
    const bdst = bd.scrollTop || htm.scrollTop;

    const bdsl = bd.scrollLeft;

    const pageX = touchEnabled ? e.touches[0].pageX : e.pageX;

    const pageY = touchEnabled ? e.touches[0].pageY : e.pageY;

    const offsets = elem.getBoundingClientRect();

    const w = elem.clientWidth || elem.offsetWidth || elem.scrollWidth;
    // width

    const h = elem.clientHeight || elem.offsetHeight || elem.scrollHeight;
    // height

    const wMultiple = 320 / w;

    const offsetX = 0.52 - (pageX - offsets.left - bdsl) / w;
    // cursor position X

    const offsetY = 0.52 - (pageY - offsets.top - bdst) / h;
    // cursor position Y

    const dy = pageY - offsets.top - bdst - h / 2;
    // @h/2 = center of container

    const dx = pageX - offsets.left - bdsl - w / 2;
    // @w/2 = center of container

    const yRotate = (offsetX - dx) * (0.02 * wMultiple);
    // rotation for container Y

    const xRotate = (dy - offsetY) * (0.02 * wMultiple);
    // rotation for container X

    let imgCSS = `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;
    // img transform

    const arad = Math.atan2(dy, dx);
    // angle between cursor and center of container in RAD

    let angle = (arad * 180) / Math.PI - 90; // convert rad in degrees

    // get angle between 0-360
    if (angle < 0) {
      angle += 360;
    }

    // container transform
    if (elem.firstChild.className.indexOf(' over') !== -1) {
      imgCSS += ' scale3d(1.03,1.03,1.03)';
    }
    elem.firstChild.style.transform = imgCSS;

    // gradient angle and opacity for shine
    shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${((pageY -
      offsets.top -
      bdst) /
      h) *
      0.3}) 0%,rgba(255,255,255,0) 80%)`;
    shine.style.transform = `${`${`translateX(${offsetX * totalLayers}` -
      0.1}px) translateY(${offsetY * totalLayers}` - 0.1}px)`;

    // parallax for each layer
    let revNum = totalLayers;
    for (let ly = 0; ly < totalLayers; ly += 1) {
      layers[ly].style.transform = `translateX(${offsetX *
        revNum *
        ((ly * 2.5) / wMultiple)}px) translateY(${offsetY *
        totalLayers *
        ((ly * 2.5) / wMultiple)}px)`;
      revNum -= 1;
    }
  }

  function processEnter(e, elem) {
    elem.firstChild.className += ' over';
  }

  function processExit(e, elem, layers, totalLayers, shine) {
    const container = elem.firstChild;

    container.className = container.className.replace(' over', '');
    container.style.transform = '';
    shine.style.cssText = '';

    for (let ly = 0; ly < totalLayers; ly += 1) {
      layers[ly].style.transform = '';
    }
  }

  // build HTML
  for (let l = 0; l < totalImgs; l += 1) {
    const thisImg = imgs[l];

    const layerElems = thisImg.querySelectorAll('.atvImg-layer');

    const totalLayerElems = layerElems.length;

    if (totalLayerElems <= 0) {
      return;
    }

    while (thisImg.firstChild) {
      thisImg.removeChild(thisImg.firstChild);
    }

    const containerHTML = d.createElement('div');

    const shineHTML = d.createElement('div');

    const shadowHTML = d.createElement('div');

    const layersHTML = d.createElement('div');

    const layers = [];

    thisImg.id = `atvImg__${l}`;
    containerHTML.className = 'atvImg-container';
    shineHTML.className = 'atvImg-shine';
    shadowHTML.className = 'atvImg-shadow';
    layersHTML.className = 'atvImg-layers';

    for (let i = 0; i < totalLayerElems; i += 1) {
      const layer = d.createElement('div');

      const imgSrc = layerElems[i].getAttribute('data-img');

      layer.className = 'atvImg-rendered-layer';
      layer.setAttribute('data-layer', i);
      layer.style.backgroundImage = `url(${imgSrc})`;
      layersHTML.appendChild(layer);

      layers.push(layer);
    }

    containerHTML.appendChild(shadowHTML);
    containerHTML.appendChild(layersHTML);
    containerHTML.appendChild(shineHTML);
    thisImg.appendChild(containerHTML);

    const w = thisImg.clientWidth || thisImg.offsetWidth || thisImg.scrollWidth;
    thisImg.style.transform = `perspective(${w * 2}px)`;

    if (!supportsTouch) {
      (function(_thisImg, _layers, _totalLayers, _shine) {
        thisImg.addEventListener('mousemove', e => {
          processMovement(e, false, _thisImg, _layers, _totalLayers, _shine);
        });
        thisImg.addEventListener('mouseenter', e => {
          processEnter(e, _thisImg);
        });
        thisImg.addEventListener('mouseleave', e => {
          processExit(e, _thisImg, _layers, _totalLayers, _shine);
        });
      })(thisImg, layers, totalLayerElems, shineHTML);
    }
  }
};
