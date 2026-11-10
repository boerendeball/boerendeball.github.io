# Kalender (Main / Desktop)

**Status:** gebouwd, te beoordelen
Previews: `design/previews/Main.png` (390×1440), `Desktop.png` (1280×940) · Artboards: `Main.dc.html`, `Desktop.dc.html`
Code: `advent/js/kalender.js` (`schermKalender`), `advent/js/ui/behoeften.js`, `advent/js/ui/vaardigheden.js`, `advent/css/kalender.css` · Route `#/`

## Doel

Het thuisscherm: tien deurtjes, Pino's Sim-kaart met behoeften en vaardigheden, en de ingang naar elk spel via het taartmenu. Mag tekst bevatten (uitzondering op de regel "geen uitleg").

## Opbouw

Mobiel (één kolom, in deze volgorde): Sim-kaart → Behoeften → kop "Deurtjes" + "24 nov – 3 dec" → raster 2 kolommen × 5 rijen (deurtjes 124 px hoog, gap 14) → Vaardigheden.
Desktop (≥ 1000 px, raster 380 px + rest, padding 32): links Sim-kaart, Behoeften, Vaardigheden; rechts kop "Kies een deurtje" + "Vandaag: vrijdag 27 november", raster 5 × 2 (deurtjes vullen de hoogte, gap 22), voetkaart "Elke dag een nieuw spelletje – gemaakt voor Pino · 24 nov – 3 dec".

### Sim-kaart
Avatar 72 px (88 desktop): roze bol met "P" (Fredoka 34/40, `#B23A6A`), witte rand 4 px, ring teal. Titel "Pino's verjaardags­kalender" (Fredoka 28/30, met zachte afbreking). Desktop-subtitel "24 november t/m 3 december". Chips: Verloskundige (teal), Ganzenfluisteraar (groen), Bordspelbaas (geel), Jiujitsu (paars); desktop ook Zoetekauw (roze) en Wereldreiziger (teal).
**Gedachtenwolkje** boven de avatar (links 34, top −74): "Morgen…" + het icoon van het deurtje van morgen met een gele "?"-badge, twee witte stipjes eronder. `role="img" aria-label="Pino denkt aan morgen"`. Voor de start toont het dag 1; na dag 10 verdwijnt het.

### Behoeften (paneel, standaard open)
Kop "Behoeften" · rechts **dagen tot 3 dec** (Fredoka 28 `#D97A00`) · pijl (draait 180° bij open). Acht balken in twee kolommen (Verjaardag vieren, Gansjes, Lammetjes, Snoepjes, Jiujitsu, Bordspellen, Reizen, Sieraden), 12 px hoog (16 desktop), kleur per waarde: ≥ 70 groen, ≥ 25 geel, anders rood. Voet: "Stemming: Goed/Matig/Slecht" (gemiddelde ≥ 50 / ≥ 30 / lager) en "x van 10 deurtjes open" (open + vandaag + gespeeld).

### Deurtjes
Elk deurtje is een `<button class="deur" data-deur="n">`:
- **gespeeld / open / vandaag**: datum "24 NOV" (desktop ook), bol 58 px (84 desktop) in de kleur van het icoon (`BOL_KLEUR` in `ui/iconen.js`), icoon 40 px, pil: "Gespeeld" (groen), "Vandaag!" (teal met schaduw) of "Te spelen" (geel; open maar nog niet gespeeld). `vandaag` krijgt de dikke teal ring.
- **dicht**: groot dagnummer (Fredoka 30/44 `#4F6B7E`), maand, slotje rechtsboven. Dag 10 is roze (`#FFE0EE`, rand `#FFB8D4`, tekst `#B23A6A`, "DEC · JARIG", taartje linksboven).
- `aria-label`: "27 november, vandaag: (Social)ize the family" / "28 november, nog gesloten".
- Tikken opent het **taartmenu** (zie events.md), ook op een dicht deurtje.

Iconen per dag: kroon, tuin (hex), familie, camera, handdruk (dag 5, besluit Benjamin 10 november: twee handen die een deal sluiten; verving de twee munten), gi (`s6-gi`), loep (`s7-loep`), tijger (`s8-stuk-tijger`), baby (`s9-bundel` in `#FFD6E6`), taart. Dag 1–4 komen uit het artboard; 5–10 zijn gekozen in dezelfde stijl.

### Vaardigheden (paneel; mobiel dicht, desktop open)
Kop "Vaardigheden" · badge "Vandaag: +1 Charisma" (paars) zolang het deurtje van vandaag nog niet gespeeld is · pijl. Zes rijen (mobiel: label 96 px, 10 blokjes, getal; desktop: twee kolommen, label boven blokjes, geen getal): Koken, Techniek, Charisma, Conditie, Logica, Creativiteit. Blokje `vol` = teal; het eerstvolgende blokje van de vaardigheid van vandaag is `straks` (geel omrand). Voet (alleen mobiel): "Elk gespeeld spelletje levert een vaardigheidspunt op. Totaal: x van 10 punten."

## Staat en datum

- `deurStatus(n)` uit `datum.js`: `gespeeld` (uit staat) > `dicht` (datum nog niet bereikt, tenzij `?test=1`) > `vandaag` > `open`.
- Dagen tot 3 december: hele dagen, 0 op de dag zelf en daarna.
- Telefoon rinkelt bij binnenkomst als het deurtje van vandaag `vandaag` is en `staat.telefoonGezien !== vandaag` (zie events.md). Niet bij `#/deur/n`.
- De kalender rendert volledig opnieuw bij elke navigatie; er is geen live-abonnement op staatwijzigingen nodig.

## Bewust anders dan het artboard

- De onderbalk met tabs Kalender / Stickers / Over is weggelaten (stickerboek is geschrapt; zie besluiten.md).
- Vaardigheidslabels volgen het artboard (Techniek, Conditie); de sleutels blijven `mechanica`, `lichaam`.

## Acceptatiecriteria

- [x] Mobiel 390 px zonder horizontale scroll; desktop 1280 in twee kolommen met het raster bovenaan rechts.
- [x] Statussen kloppen bij `?dag=1` … `?dag=10`, `?test=1` en na `?datum=2026-12-05` (alles open, geen "vandaag").
- [x] Panelen klappen in en uit met `aria-expanded`; pijl draait.
- [x] Fonts geladen (Fredoka/Nunito); alle iconen zichtbaar, ook de sprite-iconen (gi, loep, tijger, baby).
- [ ] Beoordeling door Benjamin op telefoon en desktop.

## Open punten

Behoefte-koppeling per spel (welke behoefte vult welk spel, naast "Verjaardag vieren" +10 %), beginwaarden van de behoeften, labels Techniek/Conditie, teksten van de chips op de Sim-kaart.
