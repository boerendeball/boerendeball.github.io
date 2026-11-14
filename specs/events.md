# Events en gedeelde schermen

De Sims-momenten rondom de spellen. Alles behalve het resultaatscherm is gebouwd.

| Event | Trigger | Code | Status |
|---|---|---|---|
| Taartmenu | tik op een deurtje | `ui/taartmenu.js` | gebouwd |
| Vergrendeld (gans) | actie op een dicht deurtje, of `#/deur/n` van een dicht deurtje | `kalender.js` → `toonVergrendeld` | gebouwd |
| Briefje | "Briefje lezen" in het taartmenu | `kalender.js` → `toonBriefje` | gebouwd |
| Telefoon | binnenkomst op `#/` als het deurtje van vandaag nog niet gespeeld is, één keer per dag | `kalender.js` → `toonTelefoon` | gebouwd |
| Open deurtje | "Gluren…", of "Naar het deurtje van vandaag" | `kalender.js` → `schermDeur`, route `#/deur/n` | gebouwd |
| Laadscherm | "Open deurtje" of "Speel nu" | `ui/laadscherm.js`, route `#/laden/n` → `#/spel/n` | gebouwd |
| Resultaatscherm | einde van een spel | `ui/resultaat.js` | gebouwd (spel 1) |
| Melding (toast) | bovenaan dialogen; los via `toonMelding` | `ui/overlay.js` | gebouwd |
| Finale | einde spel 10 | `spellen/spel10.js` | gebouwd, te beoordelen (spec in spel10.md) |

## Taartmenu (`Taartmenu.png`)

- Dimlaag `rgba(30,58,76,0.38)`; het aangetikte deurtje wordt gekloond en uitgelicht (ring teal 5 px + witte halo 10 px).
- Middelpunt 88 px: roze bol met "P" en "PINO". Vier spaken (92 px, wit 70 %) naar de opties.
- Opties (pillen 46 px hoog, Nunito 800 16): **boven** "Open deurtje" (groen, deur-icoon) · **rechts** "Gluren…" (oog) · **onder** "Briefje lezen" (hart) · **links** "Annuleren" (grijs, kruis). Posities worden geklemd binnen het scherm.
- Hint-bubbel: "**Tik op een deurtje** en kies wat Pino gaat doen. Gluren mag, maar de gans houdt de wacht." boven het menu, of eronder als er geen ruimte is.
- Gedrag: open deurtje → `#/laden/n`; Gluren → `#/deur/n`; Briefje → briefje-dialoog; op een **dicht** deurtje leiden alle drie naar de gans. Annuleren, Escape of tik op de dimlaag sluit.
- Toetsenbord: focus op de eerste optie, pijltjes draaien rond, Tab blijft in het menu, Escape sluit, focus keert terug naar het deurtje.
- Hergebruik in spel 2: `toonTaartmenu({ anker, midden: { element }, opties: [...] })` met een eigen middelpunt (het hexvak) en opties met tegel-iconen en aantal-badges.

## Vergrendeld (`Vergrendeld.png`)

Melding bovenin: slot-icoon (geel bolletje) "**Actie niet beschikbaar.** Dit deurtje is nog vergrendeld." Dialoog (top 250 px op mobiel, gecentreerd op desktop): gansbol 124 px (`#D9F5DE`, ring groen) · "KWAK KWAK KWAAAK!" (roze) · **Nog even wachten, Pino!** · "Dit deurtje gaat pas open op **28 november**. De gans laat je er nog niet langs." · vak "Ontgrendelt over" + "**1 dag**" (Fredoka 22 groen) + groene balk (breedte `100 − dagen × 22`, min 8 %) · knop **Oké, ik wacht wel** (teal pil) · link **Naar het deurtje van vandaag** (alleen als er een deurtje van vandaag is).

## Briefje

Dialoog met hartbol (`#FFE0EE`, ring roze) · "BRIEFJE VOOR PINO" · weekdag + datum als titel · de tekst uit `kalender.json` (`briefje`), anders de placeholder tussen rechte haken · knop **Fijn!**. Markeert `briefjesGelezen`. Het Open-scherm toont hetzelfde briefje als kaart.

## Telefoon (`Telefoon.png`)

Dimlaag 0.45. Melding: rinkelende hoorn (teal bolletje) "**Er wordt gebeld!** Een nieuw deurtje staat voor je klaar." Dialoog: telefoonbol 128 px met twee uitdijende golfringen en rinkelende roze telefoon · "RING RING!" · **Deurtje 27 november is open!** · "Dag 4 van 10 staat klaar: **titel**. Neem op om te zien wat Pino vandaag te doen heeft." · bellerkaart "BELLER / De Gans · Kalendercentrale" · knoppen **Later** (grijs) en **Opnemen** (groen, hoorn-icoon). Opnemen sluit en opent het taartmenu op het deurtje van vandaag. Beide zetten `telefoonGezien = dag`, dus één keer per dag.

## Open deurtje (`Open.png`)

Kopbalk: terug (46 px rond) · "DAG 4 VAN 10" · **Vrijdag 27 november**. Spelkaart: grote bol 136 px (kleur en ring per icoon) · chip "Spel van vandaag" / "Gespeeld" / "Spel van dag n" · titel (Fredoka 30) · omschrijving · chips (soort, duur) · **Speel nu** (groene pil met play-icoon; "Speel opnieuw" na afronden) → `#/laden/n`. Briefjekaart. Voet: "VERJAARDAGSDRANG / Nog **6 dagen** tot 3 december" met taartbol. Teksten komen uit `kalender.json`.

## Laadscherm (`Laden.png`)

Kaart met bol (icoon van het spel), `DAG 4 · 27 NOVEMBER`, titel, "wordt geladen", dikke groene balk (22 px) met percentage, huidige laadtekst (Fredoka 21 teal) en de laatste drie afgevinkte regels; tipkaart eronder (de `tip` van die dag uit `kalender.json`, anders de algemene tip over de behoeften; besluit 165). Teksten uit `data/laadteksten.json`, geschud; stap 650 ms, minimaal 4 stappen; ondertussen `laadSpel(n)` en `voorbereid()` van het spel (sprite sheet). Daarna `#/spel/n` met `vervang: true`, zodat terug vanuit het spel op de kalender uitkomt.

## Resultaatscherm (`Spel{n}-Klaar.png`, gebouwd)

Gedeelde component `ui/resultaat.js`:
```
toonResultaat({ root, dag, icoon, label: 'PRINCESS PRESENCE · KLAAR', titel, zin,
  tegels: [{ label, waarde, kleur }], beloning: { vaardigheid, eersteKeer, extra: 'Er rammelt iets…' },
  opnieuw: fn })
```
Confetti-stipjes (acht vaste posities uit het artboard), kaart met bol 128 px (ring in de kleur van het spel), label, titel (Fredoka 30), één zin, **geen sterren** (het artboard toont er drie; weggelaten, besluiten.md 16), 1–3 scoretegels (`#F3F8FB`, label 11 px, getal Fredoka 26; één tegel krijgt max. 180 px breed; geen highscore-tegel, zie besluiten.md 15), paars beloningsblok "VAARDIGHEID VERDIEND" met "Conditie +1 · Behoefte "Verjaardag" +10%" en een optionele cursieve regel, knoppen **Terug naar de kalender** (groen) en **Nog een keer** (grijs). Geen uitlegzin die de oplossing verraadt; de zin is sfeer, geen instructie.

## Joystick (`ui/joystick.js`, gebouwd bij spel 1)

Touch- en muisbesturing zonder vast paneel (besluiten.md #23). Gebruik via `invoer.js`:
```
const invoer = maakInvoer({ joystick: { element: schermEl, vertraging: 250, tik: 'actie' }, bijActie });
invoer.as() → { dx, dy }   // toetsenbord/D-pad als die actief zijn, anders de joystick (kracht 0–1)
```
- **Verschijnen**: `pointerdown` op het vlak (niet op een knop of link) start een timer; na `vertraging` ms (250) komt de joystick op de drukplek, met een korte schaal/fade-in (0,15 s; geen animatie bij `prefers-reduced-motion`).
- **Graphics** (kalenderstijl): ring 120 px, wit 45 % met witte rand 4 px, 3D-schaduw `0 6px 0 0 #CDE4F0`, dunne teal binnenring (72 px); knop 52 px teal `#1FA3DC` met witte rand 3 px en schaduw `0 4px 0 0 #0E7FB5`. Vast gepositioneerd boven alles (`z-index: 40`), negeert pointer-events zelf.
- **Sturen**: de knop volgt de vinger tot maximaal 34 px uit het midden; richting = vector vanaf de drukplek, kracht = uitslag/34 met een dode zone van 12 %. Ook diagonaal.
- **Loslaten** (`pointerup`, `pointercancel`, verlies van capture, venster verliest focus): joystick weg, vector (0, 0).
- **Tik**: loslaten binnen 250 ms en 10 px, vóór de joystick verschijnt → `bijActie(tik)` (spel 1: onderbreken, besluiten.md #24).
- Het vlak krijgt `touch-action: none` zodat de pagina niet scrolt of zoomt tijdens het spelen; muis: alleen de linkerknop; een tweede vinger wordt genegeerd.
- Hergebruik: spel 5 (lopen over de markt), spel 8 (stap voor stap: lees `as()` en zet een stap als de kracht boven een drempel komt en weer loslaat), Spel 10 gebruikt de joystick niet (drie vaste knoppen, besluit 153).

## Melding (toast)

`toonMelding({ icoon, kleur, html })` toont 2,6 s een kaartje bovenaan (zelfde opmaak als in de dialogen). Nog niet in gebruik buiten dialogen; bedoeld voor bijvoorbeeld "werker gevonden" in spel 7.

## Acceptatiecriteria (alle events)

- [x] Dialogen vangen de focus, sluiten met Escape, herstellen de focus en blokkeren de scroll van de pagina.
- [x] Taartmenu-opties blijven binnen het scherm, ook bij deurtjes aan de rand en onderaan.
- [x] Telefoon maximaal één keer per dag; niet op `#/deur/n`.
- [x] Laadscherm komt altijd uit bij het spel, ook als de module ontbreekt (placeholder) of traag laadt.
- [x] Resultaatscherm gebouwd en gebruikt door spel 1.
