// HiDPI-canvas in wereld-eenheden (CSS-px van het ontwerp, bv. 358×500).
//
// const { canvas, ctx, begin } = maakCanvas(358, 500, { label: '…' });
// in teken(): begin(); … tekenen in wereld-eenheden …

import { standaardSchaal } from './spritesheet.js';

export function maakCanvas(breedte, hoogte, { label = null, klasse = 'scene-canvas' } = {}) {
  const schaal = standaardSchaal();
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(breedte * schaal);
  canvas.height = Math.round(hoogte * schaal);
  canvas.className = klasse;
  canvas.style.width = '100%';
  canvas.style.height = 'auto';
  canvas.style.aspectRatio = `${breedte} / ${hoogte}`;
  if (label) {
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', label);
  } else {
    canvas.setAttribute('aria-hidden', 'true');
  }
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  function begin() {
    ctx.setTransform(schaal, 0, 0, schaal, 0, 0);
    ctx.clearRect(0, 0, breedte, hoogte);
  }

  return { canvas, ctx, begin, breedte, hoogte, schaal };
}

/** Offscreen laag in dezelfde schaal, voor statisch decor dat één keer wordt getekend. */
export function maakLaag(breedte, hoogte) {
  const schaal = standaardSchaal();
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(breedte * schaal);
  canvas.height = Math.round(hoogte * schaal);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(schaal, 0, 0, schaal, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return { canvas, ctx, breedte, hoogte, schaal, teken(doel) { doel.drawImage(canvas, 0, 0, breedte, hoogte); } };
}

/** Afgeronde rechthoek als pad. */
export function rondeRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') { ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
