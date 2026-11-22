// Beeldfeedback op canvas (besluit 210): deeltjes, schermschok en flits voor de actiespellen.
// Tijd in seconden, posities in wereld-eenheden (zie canvas.js). Met reduced motion doen schok en flits
// niets en worden deeltjes niet aangemaakt. Zie specs/beeldfeedback.md.
//
// const deeltjes = maakDeeltjes();  deeltjes.voeg('ster', x, y, { aantal: 6 }); in update: deeltjes.update(dt);
// in teken (na de scène): deeltjes.teken(ctx);
// const schok = maakSchok();  schok.start(4, 0.3); in update: schok.update(dt); begin({ dx: schok.dx, dy: schok.dy })
// const flits = maakFlits();  flits.start('#FFFFFF', 0.25); in update: flits.update(dt); in teken (als laatste): flits.teken(ctx, b, h)

import { tekenSprite, voorbereidSprites } from './spritesheet.js';
import { rustig } from '../ui/sap.js';

const SOORT = {
  ster: { id: 's10-ster', maat: 12, snelheid: 70, duur: 0.65, zwaarte: 40 },
  hart: { id: 's9-hart', maat: 16, snelheid: 40, duur: 0.9, zwaarte: -30, kleur: '#FF6FAE' },   // currentColor
  stof: { id: 's9-stof', maat: 16, snelheid: 26, duur: 0.42, zwaarte: -12 },
  flits: { id: 's4-flits', maat: 14, snelheid: 60, duur: 0.6, zwaarte: 0 },
};

/** Sprites van de deeltjes vooraf rasteren (in voorbereid() van een spel). */
export function voorbereidDeeltjes(soorten = Object.keys(SOORT)) {
  return voorbereidSprites(soorten.map((s) => ({ id: SOORT[s].id, kleur: SOORT[s].kleur ?? null })));
}

export function maakDeeltjes() {
  const lijst = [];
  return {
    /** richting: hoek in radialen (0 = rechts, -π/2 = omhoog) met spreiding; standaard rondom (stof: opzij). */
    voeg(soort, x, y, { aantal = 6, snelheid = null, maat = null, duur = null, kleur = null, richting = null, spreiding = Math.PI * 2 } = {}) {
      if (rustig()) return;
      const s = SOORT[soort] || SOORT.ster;
      for (let i = 0; i < aantal; i++) {
        let hoek;
        if (richting !== null) hoek = richting + (Math.random() - 0.5) * spreiding;
        else if (soort === 'stof') hoek = (i % 2 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.7 - 0.2;
        else hoek = (i / aantal) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        const v = (snelheid ?? s.snelheid) * (0.7 + Math.random() * 0.6);
        lijst.push({
          id: s.id, kleur: kleur ?? s.kleur ?? null, x, y, vx: Math.cos(hoek) * v, vy: Math.sin(hoek) * v * (soort === 'stof' ? 0.4 : 1),
          zwaarte: s.zwaarte, maat: (maat ?? s.maat) * (0.8 + Math.random() * 0.4), duur: (duur ?? s.duur) * (0.85 + Math.random() * 0.3), t: 0,
          groei: soort === 'stof',
        });
      }
    },
    update(dt) {
      for (let i = lijst.length - 1; i >= 0; i--) {
        const p = lijst[i];
        p.t += dt;
        if (p.t >= p.duur) { lijst.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.zwaarte * dt;
        const rem = Math.max(0, 1 - 3 * dt);
        p.vx *= rem;
      }
    },
    teken(ctx) {
      for (const p of lijst) {
        const f = p.t / p.duur;
        const m = p.maat * (p.groei ? 0.7 + 0.6 * f : 1 - 0.3 * f);
        tekenSprite(ctx, p.id, p.x - m / 2, p.y - m / 2, { w: m, h: m, alpha: Math.max(0, 1 - f * f), kleur: p.kleur });
      }
    },
    leeg() { lijst.length = 0; },
    get aantal() { return lijst.length; },
  };
}

/** Schermschok: een afnemende trilling. Lees dx/dy en geef ze aan begin({ dx, dy }). */
export function maakSchok() {
  let sterkte = 0;
  let duur = 0;
  let t = 0;
  let dx = 0;
  let dy = 0;
  return {
    start(s = 4, d = 0.3) {
      if (rustig()) return;
      sterkte = Math.max(sterkte * (1 - t / (duur || 1)), s);
      duur = d;
      t = 0;
    },
    update(dt) {
      if (t >= duur) { dx = 0; dy = 0; return; }
      t += dt;
      const f = Math.max(0, 1 - t / duur);
      const a = sterkte * f * f;
      dx = Math.round((Math.random() * 2 - 1) * a * 2) / 2;
      dy = Math.round((Math.random() * 2 - 1) * a * 1.4) / 2;
    },
    get dx() { return dx; },
    get dy() { return dy; },
    get actief() { return t < duur; },
  };
}

/** Flits over de hele scène (of alleen een rand). Teken als laatste. */
export function maakFlits() {
  let kleur = '#FFFFFF';
  let duur = 0;
  let t = 0;
  let piek = 0.7;
  let rand = 0;
  return {
    start(k = '#FFFFFF', d = 0.25, { piek: p = 0.7, rand: r = 0 } = {}) {
      if (rustig()) return;
      kleur = k; duur = d; t = 0; piek = p; rand = r;
    },
    update(dt) { if (t < duur) t += dt; },
    teken(ctx, b, h) {
      if (t >= duur || !duur) return;
      const f = t / duur;
      const a = piek * (f < 0.2 ? f / 0.2 : 1 - (f - 0.2) / 0.8);
      if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = kleur;
      if (rand) {
        ctx.fillRect(0, 0, b, rand); ctx.fillRect(0, h - rand, b, rand);
        ctx.fillRect(0, rand, rand, h - 2 * rand); ctx.fillRect(b - rand, rand, rand, h - 2 * rand);
      } else {
        ctx.fillRect(0, 0, b, h);
      }
      ctx.restore();
    },
  };
}
