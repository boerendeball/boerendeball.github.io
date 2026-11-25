// Padzoeker voor automatisch lopen (spel 1, Chop chop; besluit 225). Spellogica zonder DOM.
//
// const r = zoekPad(start, doel, vrij, { grens, cel: 8 });
//   start, doel: { x, y } (zelfde coördinaten als vrij); vrij(x, y) → mag Pino hier staan?
//   grens: { xMin, xMax, yMin, yMax } (het raster loopt hierbinnen)
//   r = { punten: [{ x, y }, …] (zonder start, eindigt op doel), lengte } of null als er geen weg is.
//
// A* op een raster van `cel` px (8 richtingen, geen hoeken afsnijden), daarna gladgestreken met een zichtlijntoets:
// van elk punt springt het pad naar het verste punt dat in een rechte lijn vrij bereikbaar is.

const WORTEL2 = Math.SQRT2;

/** Is de rechte lijn van a naar b overal vrij (getoetst om de `stap` px)? */
export function zicht(a, b, vrij, stap = 4) {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const n = Math.max(1, Math.ceil(d / stap));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    if (!vrij(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
  }
  return true;
}

export function padLengte(start, punten) {
  let l = 0;
  let v = start;
  for (const p of punten) { l += Math.hypot(p.x - v.x, p.y - v.y); v = p; }
  return l;
}

export function zoekPad(start, doel, vrij, { grens, cel = 8 } = {}) {
  if (!vrij(doel.x, doel.y)) return null;
  if (zicht(start, doel, vrij)) return { punten: [{ x: doel.x, y: doel.y }], lengte: Math.hypot(doel.x - start.x, doel.y - start.y) };

  const kolommen = Math.floor((grens.xMax - grens.xMin) / cel) + 1;
  const rijen = Math.floor((grens.yMax - grens.yMin) / cel) + 1;
  const px = (i) => grens.xMin + (i % kolommen) * cel;
  const py = (i) => grens.yMin + Math.floor(i / kolommen) * cel;
  const vrijCel = new Int8Array(kolommen * rijen).fill(-1); // -1 onbekend, 0 bezet, 1 vrij
  const isVrij = (i) => {
    if (vrijCel[i] < 0) vrijCel[i] = vrij(px(i), py(i)) ? 1 : 0;
    return vrijCel[i] === 1;
  };

  // Start- en doelknoop: de dichtstbijzijnde vrije rastercel die in een rechte lijn bereikbaar is.
  function knoopBij(p) {
    const ci = Math.round((p.x - grens.xMin) / cel);
    const ri = Math.round((p.y - grens.yMin) / cel);
    let beste = -1;
    let besteD = Infinity;
    for (let r = ri - 2; r <= ri + 2; r++) {
      for (let c = ci - 2; c <= ci + 2; c++) {
        if (c < 0 || r < 0 || c >= kolommen || r >= rijen) continue;
        const i = r * kolommen + c;
        if (!isVrij(i)) continue;
        const d = Math.hypot(px(i) - p.x, py(i) - p.y);
        if (d < besteD && zicht(p, { x: px(i), y: py(i) }, vrij)) { besteD = d; beste = i; }
      }
    }
    return beste;
  }
  const van = knoopBij(start);
  const naar = knoopBij(doel);
  if (van < 0 || naar < 0) return null;

  // A* met een binaire heap.
  const g = new Float64Array(kolommen * rijen).fill(Infinity);
  const vorige = new Int32Array(kolommen * rijen).fill(-1);
  const dicht = new Uint8Array(kolommen * rijen);
  const h = (i) => Math.hypot(px(i) - px(naar), py(i) - py(naar)) / cel;
  const heap = [];
  const duw = (i, f) => {
    heap.push([f, i]);
    let k = heap.length - 1;
    while (k > 0) {
      const o = (k - 1) >> 1;
      if (heap[o][0] <= heap[k][0]) break;
      [heap[o], heap[k]] = [heap[k], heap[o]];
      k = o;
    }
  };
  const pak = () => {
    const top = heap[0];
    const laatste = heap.pop();
    if (heap.length) {
      heap[0] = laatste;
      let k = 0;
      for (;;) {
        const l = 2 * k + 1; const r = l + 1;
        let m = k;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === k) break;
        [heap[m], heap[k]] = [heap[k], heap[m]];
        k = m;
      }
    }
    return top[1];
  };

  g[van] = 0;
  duw(van, h(van));
  let gevonden = false;
  while (heap.length) {
    const i = pak();
    if (dicht[i]) continue;
    dicht[i] = 1;
    if (i === naar) { gevonden = true; break; }
    const c = i % kolommen;
    const r = Math.floor(i / kolommen);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nc = c + dc; const nr = r + dr;
        if (nc < 0 || nr < 0 || nc >= kolommen || nr >= rijen) continue;
        const j = nr * kolommen + nc;
        if (dicht[j] || !isVrij(j)) continue;
        // Schuin alleen als beide rechte buren ook vrij zijn: geen hoeken van een bed afsnijden.
        if (dr && dc && (!isVrij(r * kolommen + nc) || !isVrij(nr * kolommen + c))) continue;
        const ng = g[i] + (dr && dc ? WORTEL2 : 1);
        if (ng < g[j]) { g[j] = ng; vorige[j] = i; duw(j, ng + h(j)); }
      }
    }
  }
  if (!gevonden) return null;

  // Ruw pad: start → knopen → doel; daarna gladstrijken.
  const ruw = [];
  for (let i = naar; i >= 0; i = vorige[i]) ruw.push({ x: px(i), y: py(i) });
  ruw.reverse();
  const alle = [{ x: start.x, y: start.y }, ...ruw, { x: doel.x, y: doel.y }];
  const punten = [];
  let k = 0;
  while (k < alle.length - 1) {
    let j = alle.length - 1;
    while (j > k + 1 && !zicht(alle[k], alle[j], vrij)) j -= 1;
    punten.push(alle[j]);
    k = j;
  }
  return { punten, lengte: padLengte(start, punten) };
}
