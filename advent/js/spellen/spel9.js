// Spel 9 · Vang de baby — zie specs/spel9.md.
// Canvas-actiespel: Pino loopt over de vangstrook en duwt de mannen met hun laken onder de vallende bundeltjes.

import { h } from '../ui/dom.js';
import { icoon } from '../ui/iconen.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { maakLus } from './lus.js';
import { voorbereidSprites, tekenSprite } from './spritesheet.js';
import { maakCanvas, maakLaag } from './canvas.js';
import { maakInvoer } from '../invoer.js';
import { el, use } from '../sprites.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';
import * as V from './vang.js';

/* ---------- tuning (specs/spel9.md; de spelregels staan in vang.js) ---------- */
const JOYSTICK_VERTRAGING = 250;  // ms, zoals spel 1
const VERTICAAL = 0.8;            // lopen in de diepte gaat iets trager dan opzij
const DUW_VAST = 0.12;            // s de duw-pose blijft even staan (geen geflikker)
const RING_VAST = 0.35;           // s de ring blijft onder de laatst geduwde man
const PLAN_VOORAF = 0.5;          // s voor een worp vliegt de ooievaar naar zijn plek
const STAP_SCHOENEN = 0.12;       // s per loopframe
const STAP_HAKKEN = 0.24;
const WIEBEL = 0.09;              // rad uitslag op hakken
const STOF_INTERVAL = 0.1;        // s tussen stofwolkjes
const STOF_DUUR = 0.4;
const BEVRIES_MIS = 0.9;          // s stilstand na een gemiste baby
const BEVRIES_KLAAR = 0.5;
const STER_DUUR = 0.5;
const HART_DUUR = 1.3;

/* ---------- scène (design/generators/spel9_build2.py) ---------- */
const { B, H } = V;
const MANNEN = [
  { kleding: '#9B6BFF', huid: '#F6C9A8', haar: 'bh-kort', haarkleur: '#4A3426' },
  { kleding: '#FF8A3D', huid: '#C98B5A', haar: 'bh-stekel', haarkleur: '#1E3A4C' },
  { kleding: '#39D353', huid: '#E8B48A', haar: 'bh-kort', haarkleur: '#8B4A1E' },
  { kleding: '#5BC0EB', huid: '#F6C9A8', haar: 'bh-kort', haarkleur: '#FFC93C' },
  { kleding: '#FF6FAE', huid: '#E8B48A', haar: 'bh-stekel', haarkleur: '#2B1A0E' },
];
const DOEKEN = ['#FFD6E6', '#DDF1FB'];
const HUISJES = [[74, 134, 36, 45, '#FFF1D6'], [108, 138, 32, 40, '#E8A9C4'], [300, 132, 38, 48, '#DDF1FB'], [266, 140, 30, 38, '#FFF1D6']];
const BOMEN = [[140, 128, 40, 51], [230, 134, 36, 46], [336, 126, 40, 51]];
const TULP_KLEUR = ['#FF5E5B', '#FFC93C', '#FF6FAE'];
const TULPEN = [[14, 500], [30, 500], [46, 500], [120, 500], [136, 500], [200, 500], [216, 500], [320, 640], [336, 640]];
const MOEDERS = [[230, 548, '#9B6BFF'], [268, 548, '#FF6FAE'], [306, 548, '#39D353'], [230, 586, '#FFC93C'], [306, 586, '#5BC0EB']];
const OOIEVAAR_Y = 28;
const SNAVEL = 38;                // px van het midden van de ooievaar tot het bundeltje in zijn snavel
const DEUR = { x: 281, y: 620 };  // voetpunt voor de deur van de kliniek
const PAD_LINKS = { x: -30, y: 606 };
const PAD_RECHTS = { x: B + 30, y: 622 };

function spriteLijst() {
  const lijst = ['s4-zon', 's4-wolk', 's9-molen', 's8-boom', 's9-ooievaar', 's9-val', 's9-schaduw', 's9-laken', 's9-ring',
    'pino-staan', 'pino-loop', 'pino-duw', 'pino-duw-op', 'pino-duw-neer', 's9-stetho',
    's9-sneakers', 's9-sneakers-loop', 's9-hakken', 's9-hakken-loop', 's9-stof',
    'b-blij', 's9-heg', 's9-klinker', 's9-lantaarn', 's9-kliniek', 's10-ster'].map((id) => ({ id }));
  for (const [, , , , kleur] of HUISJES) lijst.push({ id: 's9-huisje', kleur });
  for (const kleur of DOEKEN) lijst.push({ id: 's9-bundel', kleur });
  for (const kleur of TULP_KLEUR) lijst.push({ id: 's9-tulp', kleur });
  for (const [, , kleur] of MOEDERS) lijst.push({ id: 's9-moeder', kleur });
  for (const m of MANNEN) {
    lijst.push({ id: 'b-lijf-los', kleur: m.kleding }, { id: 's9-armen-om', kleur: m.kleding }, { id: 's9-armen-laken', kleur: m.kleding },
      { id: 's9-handen-om', kleur: m.huid }, { id: 's9-handen-laken', kleur: m.huid },
      { id: 'b-hoofd', kleur: m.huid }, { id: m.haar, kleur: m.haarkleur });
  }
  lijst.push({ id: 's9-hart', kleur: '#FF6FAE' });
  return lijst;
}

/** Wordt door het laadscherm aangeroepen: sprite sheet klaarzetten. */
export async function voorbereid() {
  await voorbereidSprites(spriteLijst());
}

/** Heeft Pino sportschoenen? In testmodus overschrijft ?schoenen=0|1 de staat (specs/ontwikkelaarsopties.md). */
function heeftSchoenen() {
  if (datum.isTest()) {
    let p = null;
    try { p = new URLSearchParams(location.search).get('schoenen'); } catch { /* negeren */ }
    if (p === '0' || p === '1') return p === '1';
  }
  return staat.lees().producten.includes('schoenen');
}

export function start({ root, dag, info, klaar }) {
  let opruim = null;
  const ronde = () => { if (opruim) opruim(); opruim = speel({ root, dag, info, klaar, opnieuw: ronde }); };
  ronde();
  return () => { if (opruim) opruim(); opruim = null; };
}

function speel({ root, dag, info, klaar, opnieuw }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const schoenen = heeftSchoenen();
  const snelheid = schoenen ? V.SNELHEID_SCHOENEN : V.SNELHEID_HAKKEN;
  const rng = V.maakRng();
  let gestopt = false;

  /* ---------- DOM: kopbalk met één teller (bundel + gevangen), daaronder de scène ---------- */
  const tellerTekst = h('span', {}, '0');
  const teller = h('div', { class: 'teller-pil', role: 'status', 'aria-label': '0 baby\'s gevangen' }, [icoon('baby', 24), tellerTekst]);
  const { canvas, ctx, begin } = maakCanvas(B, H, {
    label: 'Nederlands dorp: een ooievaar laat bundeltjes vallen boven een grasveld met drie mannen met een laken; Pino loopt ertussen. Onderaan een klinkerpad naar de kraamkliniek',
  });
  const scherm = h('div', { class: 'scherm spel spel9' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', rechts: [teller] }),
    h('div', { class: 's9-veld' }, [h('div', { class: 'scene-kaart s9-kaart' }, [canvas])]),
  ]);
  root.replaceChildren(scherm);

  /* ---------- spelstaat ---------- */
  let manTeller = 0;
  const nieuweMan = (x, y, toestand) => {
    const m = { nr: manTeller, uiterlijk: MANNEN[manTeller % MANNEN.length], x, y, toestand, doel: null, doek: null, richting: 1, ring: 0 };
    manTeller += 1;
    return m;
  };
  const mannen = V.START_MANNEN.map(([x, y]) => nieuweMan(x, y, 'vanger'));
  const pino = { x: V.PINO_START[0], y: V.PINO_START[1], richting: 1, pose: 'staan', duw: null, duwTot: 0, loopTijd: 0, beweegt: false, stofTimer: 0 };
  const babys = [];
  const sterren = [];
  const harten = [];
  const stof = [];
  const ooievaar = { cx: 210, richting: 1, doel: 210 };
  const s = {
    t: 0, klok: 0, gestart: false, wacht: 0, volgende: V.EERSTE_WORP, plan: null,
    gevangen: 0, gevallen: 0, klaar: false, gelukt: false, bevries: 0, af: false, altijdRaak: false,
  };

  /* ---------- invoer: zoals spel 1 (joystick, pijltjes/WASD), zonder actieknop ---------- */
  const invoer = maakInvoer({
    joystick: { element: scherm, vertraging: JOYSTICK_VERTRAGING, tik: 'tik' },
    bijActie(naam) { if (naam === 'terug') ga(`/deur/${dag}`); },
  });

  /* ---------- statische lagen ---------- */
  const achter = maakLaag(B, H);   // lucht, dorp, gras met de vangstrook
  const voor = maakLaag(B, H);     // heg en alles eronder (staat vóór de vangstrook)

  function tekenAchtergrond() {
    const g = achter.ctx;
    g.fillStyle = '#8ED8F8'; g.fillRect(0, 0, B, H);
    tekenSprite(g, 's4-zon', 282, 18, { w: 56, h: 56 });
    tekenSprite(g, 's4-wolk', 20, 30, { w: 96, h: 36 });
    tekenSprite(g, 's4-wolk', 200, 64, { w: 70, h: 26 });
    g.fillStyle = '#8BD35A'; g.fillRect(0, 176, B, H - 176);
    g.fillStyle = '#9ADB7A';
    g.beginPath(); g.ellipse(110, 178, 150, 12, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(300, 180, 120, 10, 0, 0, Math.PI * 2); g.fill();
    tekenSprite(g, 's9-molen', 6, 96, { w: 60, h: 82 });
    for (const [x, y, w, hh, kleur] of HUISJES) tekenSprite(g, 's9-huisje', x, y, { w, h: hh, kleur });
    for (const [x, y, w, hh] of BOMEN) tekenSprite(g, 's8-boom', x, y, { w, h: hh });
    // vangstrook: gemaaide banen die naar achteren smaller worden (diepte)
    for (const baan of V.banen()) {
      g.fillStyle = baan.licht ? '#9ADB7A' : '#8BD35A';
      g.fillRect(0, baan.y, B, baan.h + 0.5);
    }
    g.strokeStyle = 'rgba(255, 255, 255, 0.6)'; g.lineWidth = 2;
    for (const y of [V.STROOK.boven, V.STROOK.onder]) { g.beginPath(); g.moveTo(0, y); g.lineTo(B, y); g.stroke(); }

    const v = voor.ctx;
    v.fillStyle = '#8BD35A'; v.fillRect(0, 482, B, H - 482);
    tekenSprite(v, 's9-heg', 0, 466, { w: 358, h: 30 });
    TULPEN.forEach(([x, y], i) => tekenSprite(v, 's9-tulp', x, y, { w: 16, h: 28, kleur: TULP_KLEUR[i % 3] }));
    v.save();
    v.beginPath(); v.rect(0, 556, B, 60); v.clip();
    for (let rij = 0; rij < 2; rij += 1) for (let x = 0; x < B; x += 32) tekenSprite(v, 's9-klinker', x, 556 + rij * 32, { w: 32, h: 32 });
    v.restore();
    v.fillStyle = '#A85F2A'; v.fillRect(0, 554, B, 3); v.fillRect(0, 616, B, 3);
    tekenSprite(v, 's8-boom', 4, 490, { w: 52, h: 66 });
    tekenSprite(v, 's9-lantaarn', 196, 520, { w: 20, h: 66 });
    tekenSprite(v, 's9-kliniek', 212, 498, { w: 150, h: 130 });
    for (const [x, y, kleur] of MOEDERS) tekenSprite(v, 's9-moeder', x, y, { w: 26, h: 28, kleur });
  }

  /* ---------- regels ---------- */
  const vangers = () => mannen.filter((m) => m.toestand === 'vanger');
  const opStrook = (m) => m.toestand === 'vanger' || m.toestand === 'in';

  // Schuif een vanger (dx, dy) op; lukt niet voorbij de rand of door een andere man heen.
  function schuif(m, dx, dy) {
    const doel = V.binnenManVeld(m.x + dx, m.y + dy);
    if (Math.abs(doel.x - m.x) < 0.001 && Math.abs(doel.y - m.y) < 0.001) return false;
    for (const o of mannen) {
      if (o === m || !opStrook(o)) continue;
      if (V.mannenBotsen(doel.x, doel.y, o.x, o.y) && !V.mannenBotsen(m.x, m.y, o.x, o.y)) return false;
    }
    const heel = Math.abs(doel.x - (m.x + dx)) < 0.001 && Math.abs(doel.y - (m.y + dy)) < 0.001;
    m.x = doel.x; m.y = doel.y;
    return heel;
  }

  // Zet Pino een stap (sx, sy); wie in de weg staat wordt meegeduwd. Geeft terug of ze duwde.
  function stapPino(sx, sy) {
    const doel = V.binnenVeld(pino.x + sx, pino.y + sy);
    let vrij = true;
    let duwt = false;
    for (const m of vangers()) {
      if (!V.raakt(doel.x, doel.y, m.x, m.y)) continue;
      const naarToe = sx ? Math.sign(m.x - pino.x) === Math.sign(sx) : Math.sign(m.y - pino.y) === Math.sign(sy);
      if (!naarToe) continue;
      duwt = true;
      m.ring = RING_VAST;
      if (!schuif(m, doel.x - pino.x, doel.y - pino.y)) vrij = false;
    }
    if (vrij) { pino.x = doel.x; pino.y = doel.y; }
    return duwt;
  }

  function planWorp() {
    const bezet = new Set(babys.filter((b) => !b.geland).map((b) => b.man));
    const vrij = mannen.filter((m) => opStrook(m) && !bezet.has(m))
      .map((m) => ({ x: m.doel ? m.doel.x : m.x, y: m.doel ? m.doel.y : m.y, ref: m }));
    const keuze = vrij.length ? vrij : mannen.filter(opStrook).map((m) => ({ x: m.x, y: m.y, ref: m }));
    const p = V.kiesLanding(keuze, rng);
    s.plan = { x: p.x, y: p.y, man: p.man ? p.man.ref : null, doek: DOEKEN[Math.floor(rng() * DOEKEN.length)] };
    ooievaar.richting = p.x >= ooievaar.cx ? 1 : -1;
    ooievaar.doel = Math.max(40, Math.min(B - 40, p.x - SNAVEL * ooievaar.richting));
  }

  function laatVallen() {
    const p = s.plan;
    babys.push({ x0: ooievaar.cx + SNAVEL * ooievaar.richting, x: p.x, y: p.y, t: 0, doek: p.doek, man: p.man, geland: false });
    s.plan = null;
    s.gevallen += 1;
  }

  function vang(m, b) {
    const kant = m.x < B / 2 ? -1 : 1;
    m.toestand = 'weg'; m.doek = b.doek; m.richting = kant; m.ring = 0;
    s.gevangen += 1;
    tellerTekst.textContent = String(s.gevangen);
    teller.setAttribute('aria-label', `${s.gevangen} baby's gevangen`);
    // meteen loopt aan dezelfde kant een nieuwe man met een laken het veld in (besluit 131)
    const nieuw = nieuweMan(kant < 0 ? -30 : B + 30, m.y, 'in');
    const x = kant < 0 ? V.MAN_VELD.xMin + 4 : V.MAN_VELD.xMax - 4;
    nieuw.doel = V.binnenManVeld(x, m.y);
    for (const dy of [0, -40, 40, -80, 80]) {
      const d = V.binnenManVeld(x, m.y + dy);
      if (!mannen.some((o) => o !== m && opStrook(o) && V.mannenBotsen(d.x, d.y, o.doel ? o.doel.x : o.x, o.doel ? o.doel.y : o.y))) { nieuw.doel = d; break; }
    }
    nieuw.richting = -kant;
    mannen.push(nieuw);
  }

  function land(b) {
    b.geland = true;
    let m = vangers().find((k) => V.vangt(k, b.x, b.y));
    if (!m && s.altijdRaak) m = vangers().sort((p, q) => Math.hypot(p.x - b.x, p.y - b.y) - Math.hypot(q.x - b.x, q.y - b.y))[0];
    if (m) { babys.splice(babys.indexOf(b), 1); vang(m, b); return; }
    // gemist: het spel stopt meteen (besluit 130)
    s.klaar = true; s.gelukt = false; s.bevries = BEVRIES_MIS;
  }

  function lever(m) {
    mannen.splice(mannen.indexOf(m), 1);
    for (let i = 0; i < 7; i += 1) {
      const hoek = (i / 7) * Math.PI * 2;
      sterren.push({ x: DEUR.x, y: DEUR.y - 34, vx: Math.cos(hoek) * 46, vy: Math.sin(hoek) * 46 - 10, t: 0 });
    }
    for (let i = 0; i < 3; i += 1) harten.push({ x: 262 + i * 20, y: 512 - (i % 2) * 8, t: -i * 0.15 });
  }

  function naar(m, doel, v, dt) {
    const dx = doel.x - m.x; const dy = doel.y - m.y;
    const afstand = Math.hypot(dx, dy);
    const stap = v * dt;
    if (afstand <= stap) { m.x = doel.x; m.y = doel.y; return true; }
    m.x += (dx / afstand) * stap; m.y += (dy / afstand) * stap;
    return false;
  }

  function update(dt) {
    s.klok += dt;
    // effecten lopen altijd door
    for (const e of sterren) { e.t += dt; e.x += e.vx * dt; e.y += e.vy * dt; }
    for (const e of harten) { e.t += dt; if (e.t > 0) e.y -= 26 * dt; }
    for (const e of stof) e.t += dt;
    for (const lijst of [[sterren, STER_DUUR], [harten, HART_DUUR], [stof, STOF_DUUR]]) {
      const [l, duur] = lijst;
      for (let i = l.length - 1; i >= 0; i -= 1) if (l[i].t >= duur) l.splice(i, 1);
    }
    if (s.klaar) {
      s.bevries -= dt;
      if (s.bevries <= 0) einde();
      return;
    }

    const { dx, dy } = invoer.as();
    if (!s.gestart) {
      s.wacht += dt;
      if (dx || dy || s.wacht >= 2) s.gestart = true;
    }
    if (s.gestart) s.t += dt;

    // Pino: lopen, en duwen als er een man in de weg staat
    pino.beweegt = !!(dx || dy);
    if (dx) pino.richting = dx > 0 ? 1 : -1;
    let duw = null;
    if (pino.beweegt) {
      const v = snelheid * V.schaalOp(pino.y);
      if (dx && stapPino(dx * v * dt, 0)) duw = dx > 0 ? 'rechts' : 'links';
      if (dy && stapPino(0, dy * v * VERTICAAL * dt) && (!duw || Math.abs(dy) > Math.abs(dx))) duw = dy < 0 ? 'op' : 'neer';
      pino.loopTijd += dt;
      if (schoenen) {
        pino.stofTimer -= dt;
        if (pino.stofTimer <= 0) { pino.stofTimer = STOF_INTERVAL; stof.push({ x: pino.x - pino.richting * 10, y: pino.y, k: V.schaalOp(pino.y), t: 0 }); }
      }
    } else {
      pino.loopTijd = 0;
    }
    if (duw) { pino.duw = duw; pino.duwTot = DUW_VAST; } else if (pino.duwTot > 0) { pino.duwTot -= dt; if (pino.duwTot <= 0 || !pino.beweegt) pino.duw = null; }
    if (pino.duw) pino.pose = 'duw';
    else if (pino.beweegt) pino.pose = Math.floor(pino.loopTijd / (schoenen ? STAP_SCHOENEN : STAP_HAKKEN)) % 2 === 0 ? 'loop' : 'staan';
    else pino.pose = 'staan';

    // mannen
    for (const m of [...mannen]) {
      if (m.ring > 0) m.ring -= dt;
      if (m.toestand === 'in') {
        if (naar(m, m.doel, V.MAN_LOOPT_IN * V.schaalOp(m.y), dt)) { m.toestand = 'vanger'; m.doel = null; }
      } else if (m.toestand === 'weg') {
        m.x += m.richting * V.MAN_RENT * V.schaalOp(m.y) * dt;
        if (m.x < -30 || m.x > B + 30) {
          const begin = m.richting < 0 ? PAD_LINKS : PAD_RECHTS;
          m.toestand = 'pad'; m.x = begin.x; m.y = begin.y; m.richting = -m.richting;
        }
      } else if (m.toestand === 'pad') {
        if (naar(m, DEUR, V.MAN_RENT, dt)) lever(m);
      }
    }

    // ooievaar en worpen
    if (s.gestart) {
      if (!s.plan && s.volgende <= V.STOP_VALLEN && s.t >= s.volgende - PLAN_VOORAF) planWorp();
      if (s.plan) {
        const rest = Math.max(dt, s.volgende - s.t);
        ooievaar.cx += (ooievaar.doel - ooievaar.cx) * Math.min(1, dt / rest);
        // nooit meer dan MAX_IN_LUCHT tegelijk: is de lucht vol, dan wacht de ooievaar tot er een geland is
        const inLucht = babys.filter((b) => !b.geland).length;
        if (inLucht >= V.MAX_IN_LUCHT && s.t > V.STOP_VALLEN) { s.plan = null; s.volgende = Infinity; }   // te laat: deze worp vervalt
        else if (s.t >= s.volgende && inLucht < V.MAX_IN_LUCHT) { laatVallen(); s.volgende = Math.max(s.volgende, s.t - 0.05) + V.volgendeWorp(rng); }
      }
    }

    // baby's
    for (const b of [...babys]) {
      if (b.geland) continue;
      b.t += dt;
      if (b.t >= V.VALTIJD) land(b);
      if (s.klaar) return;
    }

    // einde: de tijd is om, niets valt meer en iedereen is bij de kliniek
    const onderweg = mannen.some((m) => m.toestand === 'weg' || m.toestand === 'pad');
    if (s.t >= V.DUUR && !babys.length && !s.plan && !onderweg) { s.klaar = true; s.gelukt = true; s.bevries = BEVRIES_KLAAR; }
  }

  /* ---------- tekenen ---------- */
  // Een 48×72-sprite met het voetpunt (midden, y = 68) op (x, y), geschaald met k.
  function tekenOp(id, x, y, k, opties = {}) {
    tekenSprite(ctx, id, x - 24 * k, y - 68 * k, { w: 48 * k, h: 72 * k, ...opties });
  }

  function tekenMan(m) {
    const k = m.toestand === 'pad' ? 1 : V.schaalOp(m.y);
    const u = m.uiterlijk;
    const flip = m.richting < 0;
    if (m.toestand === 'pad' || m.toestand === 'weg') {
      // twee-armen-regel: armloos lijf, de bundel voor de borst, de armen eromheen
      tekenOp('b-lijf-los', m.x, m.y, k, { kleur: u.kleding, flip });
      tekenOp('b-hoofd', m.x, m.y, k, { kleur: u.huid, flip });
      tekenOp(u.haar, m.x, m.y, k, { kleur: u.haarkleur, flip });
      tekenOp('b-blij', m.x, m.y, k, { flip });
      tekenSprite(ctx, 's9-bundel', m.x - 16 * k, m.y - 38 * k, { w: 32 * k, h: 32 * k, kleur: m.doek });
      tekenOp('s9-armen-om', m.x, m.y, k, { kleur: u.kleding, flip });
      tekenOp('s9-handen-om', m.x, m.y, k, { kleur: u.huid, flip });
      return;
    }
    // twee-armen-regel: armloos lijf, het laken, en de armen (kleding) + handen (huid) naar de lakenpunten
    tekenOp('b-lijf-los', m.x, m.y, k, { kleur: u.kleding });
    tekenOp('b-hoofd', m.x, m.y, k, { kleur: u.huid });
    tekenOp(u.haar, m.x, m.y, k, { kleur: u.haarkleur });
    tekenOp('b-blij', m.x, m.y, k);
    tekenSprite(ctx, 's9-laken', m.x - 36 * k, m.y - 32 * k, { w: 72 * k, h: 26 * k });
    tekenOp('s9-armen-laken', m.x, m.y, k, { kleur: u.kleding });
    tekenOp('s9-handen-laken', m.x, m.y, k, { kleur: u.huid });
  }

  function tekenPino() {
    const k = V.schaalOp(pino.y);
    let id = `pino-${pino.pose}`;
    let flip = pino.richting < 0;
    if (pino.pose === 'duw') {
      if (pino.duw === 'op') id = 'pino-duw-op';
      else if (pino.duw === 'neer') id = 'pino-duw-neer';
      else flip = pino.duw === 'links';
    }
    const opties = { flip };
    if (!schoenen && pino.beweegt && !rustig) { opties.hoek = Math.sin(pino.loopTijd * 12) * WIEBEL; opties.draai = [24, 68]; }
    tekenOp(id, pino.x, pino.y, k, opties);
    if (pino.pose !== 'duw') tekenOp('s9-stetho', pino.x, pino.y, k, opties);   // de duw-poses hebben de stethoscoop ingebouwd, onder de armen
    const voet = schoenen ? 's9-sneakers' : 's9-hakken';
    tekenOp(pino.pose === 'loop' ? `${voet}-loop` : voet, pino.x, pino.y, k, opties);
  }

  function tekenBaby(b) {
    const p = Math.min(1, b.t / V.VALTIJD);
    const val = p * (0.55 + 0.45 * p);                       // valt steeds iets sneller
    const k = 0.6 + (0.85 * V.schaalOp(b.y) - 0.6) * p;      // krimpt naar de maat van de landingsplek
    const x = b.x0 + (b.x - b.x0) * Math.min(1, p * 3);
    const y = (OOIEVAAR_Y + 34) + ((b.geland ? b.y - 8 : b.y - 24 * V.schaalOp(b.y)) - (OOIEVAAR_Y + 34)) * val;
    if (!b.geland) tekenSprite(ctx, 's9-val', x - 10 * k, y - 26 * k - 32 * k, { w: 20 * k, h: 40 * k });
    tekenSprite(ctx, 's9-bundel', x - 24 * k, y - 26 * k, { w: 48 * k, h: 48 * k, kleur: b.doek });
  }

  function teken() {
    begin();
    achter.teken(ctx);

    const bob = rustig ? 0 : Math.sin(s.klok * 5) * 3;
    tekenSprite(ctx, 's9-ooievaar', ooievaar.cx - 60, OOIEVAAR_Y + bob, { w: 120, h: 70, flip: ooievaar.richting < 0 });

    // landingsschaduwen groeien op het gras, ringen onder de geduwde man
    for (const b of babys) {
      const p = Math.min(1, b.t / V.VALTIJD);
      const k = V.schaalOp(b.y) * (0.35 + 0.65 * p);
      tekenSprite(ctx, 's9-schaduw', b.x - 30 * k, b.y - 10 * k, { w: 60 * k, h: 20 * k });
    }
    for (const m of mannen) {
      if (m.toestand !== 'vanger' || m.ring <= 0) continue;
      const k = V.schaalOp(m.y);
      tekenSprite(ctx, 's9-ring', m.x - 40 * k, m.y - 12 * k, { w: 80 * k, h: 24 * k });
    }

    // tekenvolgorde achter → voor op voetpunt
    const lagen = [];
    for (const m of mannen) if (m.toestand !== 'pad') lagen.push({ y: m.y, f: () => tekenMan(m) });
    for (const e of stof) {
      lagen.push({ y: e.y - 0.5, f: () => {
        const f = e.t / STOF_DUUR; const k = e.k * (0.7 + 0.6 * f);
        tekenSprite(ctx, 's9-stof', e.x - 12 * k, e.y - 12 * k - f * 8, { w: 24 * k, h: 16 * k, alpha: 1 - f });
      } });
    }
    lagen.push({ y: pino.y, f: tekenPino });
    lagen.sort((a, b) => a.y - b.y);
    for (const l of lagen) l.f();
    for (const b of babys) tekenBaby(b);

    voor.teken(ctx);
    const pad = mannen.filter((m) => m.toestand === 'pad').sort((a, b) => a.y - b.y);
    for (const m of pad) tekenMan(m);
    for (const e of sterren) {
      const f = e.t / STER_DUUR;
      tekenSprite(ctx, 's10-ster', e.x - 7, e.y - 7, { w: 14, h: 14, alpha: 1 - f * f });
    }
    for (const e of harten) {
      if (e.t <= 0) continue;
      const f = e.t / HART_DUUR;
      tekenSprite(ctx, 's9-hart', e.x - 8, e.y - 8, { w: 16, h: 16, kleur: '#FF6FAE', alpha: 1 - f * f });
    }
  }

  /* ---------- einde ---------- */
  function einde() {
    if (gestopt || s.af) return;
    s.af = true;
    lus.stop();
    invoer.vernietig();
    if (s.gelukt) {
      const eersteKeer = klaar({ vaardigheid: info.vaardigheid, score: { gevangen: s.gevangen } });
      toonResultaat({
        root, icoon: info.icoon, label: `${info.titel.toUpperCase()} · KLAAR`, titel: 'Allemaal veilig geland!',
        inhoud: tafereel(true, schoenen), beloning: { vaardigheid: info.vaardigheid, eersteKeer }, opnieuw,
      });
    } else {
      // Niet gehaald: geen vaardigheidspunt en het deurtje blijft ongespeeld (zoals spel 6).
      toonResultaat({
        root, icoon: info.icoon, label: info.titel.toUpperCase(), titel: 'Oeps…',
        inhoud: tafereel(false, schoenen), opnieuw, confetti: false,
      });
    }
  }

  /* ---------- start ---------- */
  const lus = maakLus({ update, teken });
  if (datum.isTest()) {
    window.pinoDebug = {
      spel: 9, s, pino, mannen, babys, ooievaar, schoenen,
      /** Zet het spel met de hand ms vooruit (stappen van 20 ms) en teken. */
      stap(ms) { for (let i = 0; i < Math.round(ms / 20) && !s.af; i += 1) update(0.02); if (!s.af) teken(); },
    };
  }
  voorbereid().then(() => {
    if (gestopt) return;
    tekenAchtergrond();
    teken();
    lus.start();
  }).catch((e) => console.error(e));

  return () => {
    gestopt = true;
    lus.stop();
    invoer.vernietig();
    if (window.pinoDebug && window.pinoDebug.s === s) delete window.pinoDebug;
  };
}

/** Het tafereel op het resultaatscherm: blije Pino met drie vrouwen met een baby, of Pino die getroost wordt door de ooievaar. */
function tafereel(gelukt, schoenen) {
  const voet = schoenen ? 's9-sneakers' : 's9-hakken';
  const basis = [
    el('rect', { x: 4, y: 2, width: 252, height: 100, rx: 18, fill: gelukt ? '#FFE0EE' : '#DDF1FB' }),
    el('ellipse', { cx: 130, cy: 92, rx: 108, ry: 5, fill: gelukt ? '#FFC2DA' : '#CDE4F0' }),
  ];
  const vrouw = (x, kleding, huid, haar, haarkleur, doek) => el('g', { transform: `translate(${x} 18)` }, [
    use('b-lijf-los', 0, 0, 48, 72, kleding), use('b-hoofd', 0, 0, 48, 72, huid), use(haar, 0, 0, 48, 72, haarkleur), use('b-blij', 0, 0, 48, 72),
    use('s9-bundel', 8, 30, 32, 32, doek), use('s9-armen-om', 0, 0, 48, 72, kleding), use('s9-handen-om', 0, 0, 48, 72, huid),
  ]);
  const delen = gelukt
    ? [
      el('g', { transform: 'translate(22 18)' }, [use('pino-staan', 0, 0, 48, 72), use('s9-stetho', 0, 0, 48, 72), use(voet, 0, 0, 48, 72)]),
      vrouw(84, '#9B6BFF', '#F6C9A8', 'bh-lang', '#4A3426', '#FFD6E6'),
      vrouw(136, '#FFC93C', '#C98B5A', 'bh-knot', '#1E3A4C', '#DDF1FB'),
      vrouw(188, '#39D353', '#E8B48A', 'bh-lang', '#8B4A1E', '#FFD6E6'),
    ]
    : [
      el('g', { transform: 'translate(82 18)' }, [use('pino-sip', 0, 0, 48, 72), use('s9-stetho', 0, 0, 48, 72), use(voet, 0, 0, 48, 72)]),
      use('s9-ooievaar-troost', 118, 4, 66, 88),
    ];
  return el('svg', {
    class: 'ic s9-tafereel', viewBox: '0 0 260 104', width: 260, height: 104, role: 'img',
    'aria-label': gelukt ? 'Pino staat blij naast drie blije vrouwen met een baby in hun armen' : 'Pino kijkt verdrietig; de ooievaar slaat troostend een vleugel om haar heen',
  }, [...basis, ...delen]);
}
