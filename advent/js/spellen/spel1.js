// Spel 1 · Princess Presence — zie specs/spel1.md.
// Canvas-actiespel: Pino loopt door de slaapzaal en onderbreekt gapende kinderen.

import { h } from '../ui/dom.js';
import { icoon } from '../ui/iconen.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { maakLus } from './lus.js';
import { voorbereidSprites, tekenSprite } from './spritesheet.js';
import { maakCanvas, maakLaag } from './canvas.js';
import { maakInvoer } from '../invoer.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';

/* ---------- tuning (specs/spel1.md) ---------- */
const DUUR = 60;              // s speelduur
const START_PAUZE = 1.5;      // s niemand wordt wakker aan het begin
const WAKKER_DUUR = 1.2;      // s een kind ligt wakker (ogen open) voordat het gaapt of weer inslaapt (besluiten.md #142)
const GAAP_KANS = 0.7;        // kans dat een wakker kind gaat gapen; anders valt het weer in slaap
const GAAP_DUUR = 3.5;        // s zo lang gaapt een kind
const INTERVAL_START = 4.0;   // s tussen kinderen die wakker worden, aan het begin
const INTERVAL_EIND = 2.2;    // s tussen kinderen die wakker worden, aan het eind
const RUST = 6;               // s een kind wordt niet twee keer wakker binnen deze tijd
const REIK = 28;              // px naast het bed (links of rechts) waarbinnen Pino's voetpunt moet staan
const ZIJ_BOVEN = 30;         // px vanaf de bovenkant van het bed: hoger staat Pino erachter, niet ernaast
const ZIJ_ONDER = 12;         // px onder het voeteneind waar "ernaast" nog telt
const SCHOUDER = { links: [17, 36], rechts: [31, 36] }; // schouderpunten in het 48×72-frame van Pino
const MOND = [32, 38];        // mond van het kind t.o.v. de bedpositie
const ARM_LENGTE = 30;        // px natuurlijke lengte van pino-arm-vinger (schouder → vingertop)
const ARM_REK_MAX = 1.6;      // de wijzende arm mag zover gerekt worden om de mond te halen
const LAAG_RAND = 16;         // px extra rand van de tintlagen (kind en deken steken niet verder buiten hun frame uit)
const BEREIK_TINT = 'rgba(255, 255, 255, 0.22)'; // lichte oplichting van een kind dat Pino kan onderbreken
const DEKEN_DUUR = 0.4;       // s de deken wordt kort donkerder na een geslaagde onderbreking
const DEKEN_TINT = [30, 58, 76]; // rgb van de dekenflits (tekstkleur); alpha loopt van DEKEN_ALPHA naar 0
const DEKEN_ALPHA = 0.3;
const SNELHEID = 130;         // px/s
const POSE_DUUR = 0.45;       // s vinger uitgestoken na een treffer
const POSE_MIS = 0.3;         // s vinger uitgestoken zonder treffer
const VERRAST_DUUR = 0.6;     // s verrast gezicht na een onderbreking (#142)
const BOOS_DUUR = 0.9;        // s daarna even boos, dan meteen weer slapen (#143)
const BEVRIES = 0.8;          // s stilstand voor het resultaatscherm
const JOYSTICK_VERTRAGING = 250;  // ms vasthouden voordat de joystick verschijnt (besluiten.md #23)

/* ---------- scène ---------- */
const B = 358;
const H = 500;
const KLEUR = { groen: '#39D353', geel: '#FFC93C', blauw: '#5BC0EB' };
const KOLOM = [24, 147, 270];
const RIJ = [86, 222, 358];
// per rij: [deken, motief, huid, haar, haarkleur] — vaste bezetting uit het artboard
const BEZETTING = [
  [['blauw', 'vlinder', '#F6C9A8', 'h-bob', '#4A3426'], ['geel', 'boom', '#E8B48A', 'h-krul', '#2B1A0E'], ['groen', 'vogel', '#C98B5A', 'h-staart', '#FFC93C']],
  [['groen', 'vlinder', '#E8B48A', 'h-stekel', '#8B4A1E'], ['geel', 'vogel', '#F6C9A8', 'h-bob', '#1E3A4C'], ['blauw', 'boom', '#C98B5A', 'h-krul', '#C2743C']],
  [['geel', 'vlinder', '#C98B5A', 'h-bob', '#4A3426'], ['groen', 'boom', '#F6C9A8', 'h-krul', '#2B1A0E'], ['blauw', 'vogel', '#E8B48A', 'h-staart', '#FFC93C']],
];
const PINO_START = { x: 92, y: 232 };
const GRENS = { xMin: 0, xMax: B - 48, yMin: 130 - 72, yMax: H - 72 };

function spriteLijst() {
  const lijst = [{ id: 'bed-onder' }, { id: 'raam' }, { id: 'kleedje' }, { id: 'nachtlamp' },
    { id: 'pino-staan' }, { id: 'pino-loop' }, { id: 'pino-romp' }, { id: 'pino-arm-links' }, { id: 'pino-arm-rechts' }, { id: 'pino-arm-vinger' },
    { id: 'g-slaap' }, { id: 'g-wakker' }, { id: 'g-gaap' }, { id: 'g-verrast' }, { id: 'g-boos' },
    { id: 'm-vlinder' }, { id: 'm-boom' }, { id: 'm-vogel' }];
  for (const k of Object.values(KLEUR)) lijst.push({ id: 'bed-deken', kleur: k });
  for (const rij of BEZETTING) {
    for (const [, , huid, haar, haarkleur] of rij) {
      lijst.push({ id: 'k-hoofd', kleur: huid }, { id: haar, kleur: haarkleur });
    }
  }
  return lijst;
}

/** Wordt door het laadscherm aangeroepen: sprite sheet en font klaarzetten. */
export async function voorbereid() {
  await voorbereidSprites(spriteLijst());
  try { await Promise.all([document.fonts.load('800 11px Nunito'), document.fonts.load('800 13px Nunito')]); } catch { /* font is niet kritiek */ }
}

export function start({ root, dag, info, klaar }) {
  let opruim = null;
  const ronde = () => { if (opruim) opruim(); opruim = speel({ root, dag, info, klaar, opnieuw: ronde }); };
  ronde();
  return () => { if (opruim) opruim(); opruim = null; };
}

function speel({ root, dag, info, klaar, opnieuw }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gestopt = false;

  /* ---------- DOM ---------- */
  const tijdBalk = h('span', { style: { width: '100%' } });
  const tijdTekst = h('span', { class: 'kop tijd-tekst' }, formatteerTijd(DUUR));
  const { canvas, ctx, begin } = maakCanvas(B, H, { label: 'Slaapzaal met negen bedden; Pino loopt tussen de bedden' });

  // Geen besturingspaneel (besluiten.md #22): touch/muis gaat via de joystick (vasthouden op het scherm,
  // besluiten.md #23) en een tik om te onderbreken (#24); daarnaast toetsenbord (pijltjes/WASD, spatie/Enter).
  const scherm = h('div', { class: 'scherm spel' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje' }),
    h('div', { class: 'kaart tijdkaart' }, [
      icoon('klok', 22),
      h('span', { class: 'balk balk-tijd', 'aria-hidden': 'true' }, [tijdBalk]),
      tijdTekst,
    ]),
    h('div', { class: 'scene-kaart' }, [canvas]),
  ]);
  root.replaceChildren(scherm);

  /* ---------- spelstaat ---------- */
  const bedden = [];
  BEZETTING.forEach((rij, r) => rij.forEach(([deken, motief, huid, haar, haarkleur], c) => {
    // status: slaap → wakker → (gaap →) slaap; onderbroken: gaap → verrast → boos → slaap (besluiten.md #142, #143)
    bedden.push({ x: KOLOM[c], y: RIJ[r], deken, motief, huid, haar, haarkleur, status: 'slaap', wakkerTot: 0, gaapTot: 0, verrastTot: 0, boosTot: 0, rustTot: 0, dekenTot: 0 });
  }));
  const pino = { x: PINO_START.x, y: PINO_START.y, richting: 1, pose: 'staan', poseTot: 0, loopTijd: 0, beweegt: false, arm: null };
  const s = {
    tijd: DUUR, verstreken: 0, gestart: false, wacht: 0, klaar: false, bevries: 0,
    score: 0, gemist: 0, gaapTimer: START_PAUZE, klok: 0,
  };
  if (datum.isTest()) window.pinoDebug = { spel: 1, s, pino, bedden };

  /* ---------- invoer ---------- */
  const invoer = maakInvoer({
    joystick: { element: scherm, vertraging: JOYSTICK_VERTRAGING, tik: 'actie' },
    bijActie(naam) {
      if (naam === 'terug') { ga(`/deur/${dag}`); return; }
      if (naam === 'actie') onderbreek();
    },
  });

  /* ---------- achtergrond (één keer) ---------- */
  const achtergrond = maakLaag(B, H);
  function tekenAchtergrond() {
    const g = achtergrond.ctx;
    g.fillStyle = '#FFE0EE'; g.fillRect(0, 0, B, 96);
    g.fillStyle = 'rgba(255, 155, 200, 0.5)';
    for (let y = 12; y < 96; y += 24) for (let x = 12; x < B; x += 24) { g.beginPath(); g.arc(x, y, 2.5, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#C98B5A'; g.fillRect(0, 92, B, 8);
    g.fillStyle = '#F6EBDD'; g.fillRect(0, 100, B, 400);
    g.strokeStyle = 'rgba(194, 116, 60, 0.35)'; g.lineWidth = 2;
    for (let y = 136; y < H; y += 36) { g.beginPath(); g.moveTo(0, y); g.lineTo(B, y); g.stroke(); }
    tekenSprite(g, 'raam', 147, 18);
    tekenSprite(g, 'kleedje', 131, 236);
  }

  /* ---------- regels ---------- */
  function interval(t) {
    const f = Math.max(0, Math.min(1, t / DUUR));
    return INTERVAL_START + (INTERVAL_EIND - INTERVAL_START) * f;
  }

  // Een slapend kind wordt wakker; of het daarna gaat gapen, beslist GAAP_KANS na WAKKER_DUUR.
  function wordtWakker() {
    const actief = bedden.filter((b) => b.status === 'wakker' || b.status === 'gaap').length;
    const max = s.verstreken < DUUR / 2 ? 2 : 3;
    if (actief >= max) return;
    const kandidaten = bedden.filter((b) => b.status === 'slaap' && b.rustTot <= 0);
    if (!kandidaten.length) return;
    const b = kandidaten[Math.floor(Math.random() * kandidaten.length)];
    b.status = 'wakker';
    b.wakkerTot = WAKKER_DUUR;
  }

  // Pino staat naast het bed: voetpunt links of rechts van het bed (binnen REIK) én op bedhoogte. Boven of
  // onder het bed telt niet, anders kan de arm niet geloofwaardig over het bed naar de mond.
  function naastBed(b) {
    const px = pino.x + 24;
    const py = pino.y + 64;
    if (py < b.y + ZIJ_BOVEN || py > b.y + 84 + ZIJ_ONDER) return false;
    const links = px >= b.x - REIK && px < b.x;
    const rechts = px > b.x + 64 && px <= b.x + 64 + REIK;
    return links || rechts;
  }

  // Kies de arm aan de kant van het kind en draai (en rek) hem om de schouder zodat de vinger bij de mond komt.
  // Zonder doel wijst de arm aan de kijkkant recht vooruit.
  function wijs(doel) {
    const kant = doel ? (doel.x + 32 >= pino.x + 24 ? 'rechts' : 'links') : (pino.richting > 0 ? 'rechts' : 'links');
    const [sx, sy] = SCHOUDER[kant];
    let hoek = kant === 'rechts' ? 0 : Math.PI;
    let rek = 1;
    if (doel) {
      const dx = doel.x + MOND[0] - (pino.x + sx);
      const dy = doel.y + MOND[1] - (pino.y + sy);
      hoek = Math.atan2(dy, dx);
      rek = Math.max(1, Math.min(ARM_REK_MAX, Math.hypot(dx, dy) / ARM_LENGTE));
    }
    pino.pose = 'romp';
    pino.arm = { kant, hoek, rek };
  }

  function onderbreek() {
    if (s.klaar || gestopt) return;
    s.gestart = true;
    if (pino.poseTot > 0) return;
    let doel = null;
    let afstand = Infinity;
    for (const b of bedden) {
      if (b.status !== 'gaap' || !naastBed(b)) continue;
      const d = Math.hypot(b.x + 32 - (pino.x + 24), b.y + 42 - (pino.y + 64));
      if (d < afstand) { afstand = d; doel = b; }
    }
    if (doel) {
      doel.status = 'verrast';
      doel.verrastTot = VERRAST_DUUR;
      doel.dekenTot = DEKEN_DUUR;
      doel.rustTot = RUST;
      s.score += 1;
      staat.voegTegelToe(doel.deken, doel.motief); // token (kleur-figuur) voor spel 2, onzichtbaar in dit spel
      pino.richting = doel.x + 32 >= pino.x + 24 ? 1 : -1;
      wijs(doel);
      pino.poseTot = POSE_DUUR;
    } else {
      wijs(null);
      pino.poseTot = POSE_MIS;
    }
  }

  function update(dt) {
    s.klok += dt;
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
    if (s.gestart) {
      s.tijd = Math.max(0, s.tijd - dt);
      s.verstreken = DUUR - s.tijd;
    }

    // Pino
    if (pino.poseTot > 0) {
      pino.poseTot -= dt;
      pino.beweegt = false;
      if (pino.poseTot <= 0) { pino.pose = 'staan'; pino.arm = null; }
    } else {
      pino.beweegt = !!(dx || dy);
      if (dx) pino.richting = dx > 0 ? 1 : -1;
      if (pino.beweegt) {
        const nx = Math.max(GRENS.xMin, Math.min(GRENS.xMax, pino.x + dx * SNELHEID * dt));
        if (!botst(nx, pino.y)) pino.x = nx;
        const ny = Math.max(GRENS.yMin, Math.min(GRENS.yMax, pino.y + dy * SNELHEID * dt));
        if (!botst(pino.x, ny)) pino.y = ny;
        pino.loopTijd += dt;
        pino.pose = Math.floor(pino.loopTijd / 0.18) % 2 === 0 ? 'loop' : 'staan';
      } else {
        pino.loopTijd = 0;
        pino.pose = 'staan';
      }
    }

    // Kinderen
    for (const b of bedden) {
      if (b.rustTot > 0) b.rustTot -= dt;
      if (b.dekenTot > 0) b.dekenTot -= dt;
      if (b.status === 'wakker') {
        b.wakkerTot -= dt;
        if (b.wakkerTot <= 0) {
          if (Math.random() < GAAP_KANS) { b.status = 'gaap'; b.gaapTot = GAAP_DUUR; }
          else { b.status = 'slaap'; b.rustTot = RUST; }
        }
      } else if (b.status === 'gaap') {
        b.gaapTot -= dt;
        if (b.gaapTot <= 0) { b.status = 'slaap'; b.rustTot = RUST; s.gemist += 1; }
      } else if (b.status === 'verrast') {
        b.verrastTot -= dt;
        if (b.verrastTot <= 0) { b.status = 'boos'; b.boosTot = BOOS_DUUR; }
      } else if (b.status === 'boos') {
        b.boosTot -= dt;
        if (b.boosTot <= 0) b.status = 'slaap'; // onderbroken: na boos direct weer slapen, niet eerst wakker
      }
    }
    if (s.gestart) {
      s.gaapTimer -= dt;
      if (s.verstreken >= START_PAUZE && s.gaapTimer <= 0) {
        wordtWakker();
        s.gaapTimer = interval(s.verstreken) * (0.8 + 0.4 * Math.random());
      }
    }

    // Badges

    // Tijd-UI
    tijdBalk.style.width = `${(s.tijd / DUUR) * 100}%`;
    const tekst = formatteerTijd(Math.ceil(s.tijd));
    if (tijdTekst.textContent !== tekst) tijdTekst.textContent = tekst;

    if (s.gestart && s.tijd <= 0) {
      s.klaar = true;
      s.bevries = BEVRIES;
      for (const b of bedden) if (b.status === 'gaap' || b.status === 'wakker') { b.status = 'slaap'; }
    }
  }

  function botst(nx, ny) {
    const fx = nx + 12; const fy = ny + 56; const fw = 24; const fh = 16;
    for (const b of bedden) {
      const bx = b.x + 4; const by = b.y + 30; const bw = 56; const bh = 48;
      if (fx < bx + bw && fx + fw > bx && fy < by + bh && fy + fh > by) return true;
    }
    return false;
  }

  /* ---------- tekenen ---------- */
  // Hoofd, haar en gezicht van het kind (32×32 op bedpositie +16, +14).
  function tekenKindIn(c, b, x, y) {
    tekenSprite(c, 'k-hoofd', x, y, { kleur: b.huid });
    tekenSprite(c, b.haar, x, y, { kleur: b.haarkleur });
    tekenSprite(c, `g-${b.status}`, x, y);
  }

  function tekenDekenIn(c, b, x, y) {
    tekenSprite(c, 'bed-deken', x, y, { kleur: KLEUR[b.deken] });
    tekenSprite(c, `m-${b.motief}`, x + 10, y + 50, { w: 14, h: 14 });
    tekenSprite(c, `m-${b.motief}`, x + 40, y + 54, { w: 14, h: 14 });
    tekenSprite(c, `m-${b.motief}`, x + 25, y + 60, { w: 12, h: 12 });
  }

  // Getint tekenen: teken(c, x, y) tekent op een tussenlaag, daarna krijgen alleen de dekkende pixels de tint
  // (source-atop) en gaat de laag op het hoofdcanvas. Zo blijft de vloer rond de sprite onaangeroerd.
  function tekenGetint(laag, x, y, tint, teken) {
    const lc = laag.ctx;
    lc.clearRect(0, 0, laag.breedte, laag.hoogte);
    teken(lc, LAAG_RAND, LAAG_RAND);
    lc.save();
    lc.globalCompositeOperation = 'source-atop';
    lc.fillStyle = tint;
    lc.fillRect(0, 0, laag.breedte, laag.hoogte);
    lc.restore();
    ctx.drawImage(laag.canvas, x - LAAG_RAND, y - LAAG_RAND, laag.breedte, laag.hoogte);
  }

  const kindLaag = maakLaag(32 + 2 * LAAG_RAND, 32 + 2 * LAAG_RAND);
  const dekenLaag = maakLaag(64 + 2 * LAAG_RAND, 84 + 2 * LAAG_RAND);

  // Een gapend kind binnen Pino's reik licht subtiel op (als een hover op een knop); bed en deken blijven gewoon.
  function tekenKind(b) {
    const x = b.x + 16; const y = b.y + 14;
    if (b.status === 'gaap' && naastBed(b)) tekenGetint(kindLaag, x, y, BEREIK_TINT, (c, lx, ly) => tekenKindIn(c, b, lx, ly));
    else tekenKindIn(ctx, b, x, y);
  }

  // Na een geslaagde onderbreking wordt de deken kort donkerder en loopt in DEKEN_DUUR terug naar normaal.
  function tekenDeken(b) {
    if (b.dekenTot > 0) {
      const alpha = DEKEN_ALPHA * Math.min(1, b.dekenTot / DEKEN_DUUR);
      tekenGetint(dekenLaag, b.x, b.y, `rgba(${DEKEN_TINT.join(', ')}, ${alpha.toFixed(3)})`, (c, lx, ly) => tekenDekenIn(c, b, lx, ly));
    } else tekenDekenIn(ctx, b, b.x, b.y);
  }

  function tekenBed(b) {
    tekenSprite(ctx, 'bed-onder', b.x, b.y);
    tekenKind(b);
    tekenDeken(b);
  }

  function tekenZzz(b) {
    const bob = rustig ? 0 : Math.sin(s.klok * (Math.PI * 2 / 1.6) + b.x * 0.05) * 2;
    ctx.fillStyle = '#8AA0AF';
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.font = '800 11px Nunito, sans-serif'; ctx.fillText('z', b.x + 50, b.y + 22 + bob);
    ctx.font = '800 9px Nunito, sans-serif'; ctx.fillText('z', b.x + 57, b.y + 14 + bob * 0.7);
    ctx.font = '800 7px Nunito, sans-serif'; ctx.fillText('z', b.x + 63, b.y + 7 + bob * 0.4);
  }

  function teken() {
    begin();
    achtergrond.teken(ctx);
    // tekenvolgorde achter → voor: bedrijen, nachtlamp en Pino op onderkant-y
    const lagen = [];
    for (const b of bedden) lagen.push({ y: b.y + 84, f: () => tekenBed(b) });
    lagen.push({ y: 484, f: () => tekenSprite(ctx, 'nachtlamp', 320, 440) });
    lagen.push({ y: pino.y + 72, f: tekenPino });
    lagen.sort((a, b) => a.y - b.y);
    for (const l of lagen) l.f();
    if (pino.arm) tekenWijsArm(); // de wijzende arm komt over bed en kind heen
    for (const b of bedden) if (b.status === 'slaap') tekenZzz(b);
  }

  // Romp (met of zonder armen in de pose) en, bij het wijzen, de hangende arm aan de andere kant.
  function tekenPino() {
    tekenSprite(ctx, `pino-${pino.pose}`, pino.x, pino.y, { flip: pino.richting < 0 });
    if (pino.arm) tekenSprite(ctx, pino.arm.kant === 'rechts' ? 'pino-arm-links' : 'pino-arm-rechts', pino.x, pino.y);
  }

  // Wijzende arm: schouder (4,5 in de sprite) op het schouderpunt, gedraaid naar de mond en in de lengte gerekt.
  function tekenWijsArm() {
    const { kant, hoek, rek } = pino.arm;
    const [sx, sy] = SCHOUDER[kant];
    tekenSprite(ctx, 'pino-arm-vinger', pino.x + sx - 4 * rek, pino.y + sy - 5, { w: 40 * rek, h: 10, hoek, draai: [4, 5] });
  }

  /* ---------- einde ---------- */
  function einde() {
    if (gestopt) return;
    lus.stop();
    invoer.vernietig();
    const eersteKeer = klaar({ score: { onderbroken: s.score } });
    toonResultaat({
      root,
      icoon: info.icoon,
      label: `${info.titel.toUpperCase()} · KLAAR`,
      titel: 'De hofhouding is onder de indruk!',
      zin: s.score < 6 ? 'Er werd flink gegaapt vanavond. Morgen beter!' : 'Niemand durfde te gapen in het bijzijn van prinses Pino. Nou ja, bijna niemand.',
      tegels: [{ label: 'ONDERBROKEN', waarde: s.score, kleur: '#1F7A3A' }],
      beloning: { ...info.beloning, eersteKeer, extra: s.score > 0 ? 'Er rammelt iets in je jurkzak…' : null },
      opnieuw,
    });
  }

  /* ---------- start ---------- */
  const lus = maakLus({ update, teken });
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

function formatteerTijd(sec) {
  const m = Math.floor(sec / 60);
  const r = Math.max(0, Math.round(sec % 60));
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}
