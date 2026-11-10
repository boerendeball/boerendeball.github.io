# Pino's Adventkalender – werkafspraken voor Claude Code

Dit is de repository van de GitHub Pages-site `boerendeball.github.io`. Hier komt een interactieve adventkalender die aftelt naar Pino's verjaardag (3 december): tien deurtjes (24 november t/m 3 december), achter elk deurtje een klein spel. Het ontwerp is af en staat in deze repo; de implementatie moet nog beginnen. **Er is nog geen code, framework of build-opzet gekozen** — dat is een bewuste keuze, bespreek het eerst met Benjamin voordat je een keuze maakt.

Alle communicatie, teksten in de app, commit-berichten en documentatie zijn in het **Nederlands**.

## Waar wat staat

| Map / bestand | Inhoud |
|---|---|
| `design/spellen-per-dag.md` | De tien spellen: regels, decor, iconen, vaardigheidspunten en de koppelingen (economie) tussen de spellen. **Dit is de bron van waarheid voor de spelregels.** |
| `design/ontwerpkeuzes.md` | Visuele en thematische keuzes: palet, fonts, Sims-sfeer, cultureel decor per spel, de "poppenhuisstijl". |
| `design/economie-en-spelstaat.md` | Welke staat van spel naar spel wordt doorgegeven en hoe die in `localStorage` hoort te leven. |
| `design/previews/*.png` | Screenshots van elk ontworpen scherm (44 artboards). Kijk hier eerst als je een scherm gaat bouwen. |
| `design/artboards/*.dc.html` + `canvas.json` | De originele artboards uit het ontwerpcanvas (zelfstandige HTML met inline SVG). Alleen referentie: de markup, kleuren, maten en teksten zijn exact; de `{{…}}`-placeholders en `<x-dc>`-wrappers horen bij de ontwerptool en niet bij de app. |
| `design/generators/*.py` | De Python-scripts waarmee de sprite-sets en artboards zijn gegenereerd. Wil je een sprite aanpassen, pas dan het script aan en genereer opnieuw (zie `design/generators/README.md`). |
| `specs/*.md` | **Specs per scherm**: kalender, events (taartmenu, telefoon, gans, laadscherm, resultaatscherm), spel 1–10, plus `besluiten.md` (beslislog en open vragen) en `README.md` (template, werkwijze, test-URL's en dev-schakelaars). Lees de spec van een spel vóór je het bouwt en werk de status bij. |
| `assets/sprites/sprites.svg` | **Alle 231 sprites** van alle spellen als één SVG met `<symbol>`-elementen. `assets/sprites/spel{n}.svg` bevat alleen de symbolen die in spel n zijn geïntroduceerd (de sets stapelen: spel n gebruikt ook symbolen uit spel 1..n-1). `symbolen.json` is de index. |

## Harde ontwerpregel: geen uitleg, hints of labels in de spellen

Pino moet de regels en de verbanden tussen de spellen **zelf ontdekken**. Daarom:

- In een spelscherm staan alleen de **spelstand** en de **knoppen**. Geen uitlegtekst, geen opdrachtkaartjes ("Foto 1 van 3", "Zoek de werker"), geen hints, geen labels bij tellers.
- Knoppen zijn **icoon-only** waar dat kan (pijlen, tekstballon, zandloper, stuurwiel, rempedaal, hand). Geen "Praat", "Wachten", "Reageer!", "Vooruit".
- Tellers zijn altijd **icoon + getal**: munt + 60 (geen "§60"), loep + 2/5, hart + klok + 2 (geen "2 min"), filmrol + 10, voetstappen + 4.
- Resultaatschermen tonen titel, scoretegels en de verdiende vaardigheid, maar geen uitlegzin die de oplossing verraadt.
- Uitzondering: de verjaardagsfinale (einde spel 10) heeft tekst (felicitatie, behoefte-labels, het laatste briefje) — dat is geen spel meer. Ook de kalender zelf (deurtjes, briefjes, behoeften, vaardigheden) mag tekst hebben.
- Verborgen mechanieken blijven verborgen: de tegels die spel 1 oplevert zijn in spel 1 onzichtbaar; de verstopte werker (spel 7) is in spel 2–6 pas aanklikbaar nadat spel 7 is ontgrendeld; de familie die in spel 3 compleet wordt gemaakt, is zonder aankondiging het gezin van spel 4.

Als een scherm in `design/previews` nog tekst bevat die hiermee in strijd is, is de regel leidend, niet de preview.

## Visuele stijl: "poppenhuisstijl" (vastgelegd, niet meer ter discussie)

- Oude-Sims-sfeer (cd-rom-tijdperk) in een eigen interpretatie: **geen plumbob, geen EA-bitmapfonts**, niets dat van EA is.
- **3/4-aanzicht (driekwart)**, platte vectorvlakken, per kleur **één schaduwtint**, licht van linksboven, geen gradients of filters op bewegende delen, tekenvolgorde van achter naar voor.
- **Het speelveld is altijd een echte scène** met decor eromheen; het spelmechanisme zit als patroon **in de grond** verwerkt (schaakbord als versleten stenen vakken in de jungle, vangstrook als gemaaide grasbanen, Frogger-stroken als stoep/weg/weiland/klinkerpad). Geen kaal raster met een rand eromheen.
- UI (kopbalk, knoppen, tellers) staat als DOM *om* de scène heen; de scène zelf is één SVG (ontwerp: 358 px breed, 582–680 px hoog op een telefoonscherm van 390×844).
- Sprites zijn SVG `<symbol>`s met `currentColor` voor kleurvarianten (kleding, huid, haar, luifels, ballonnen, bundeltjes). Gebruik `<use href="#id" color="#…">`. Vergeet je de kleur, dan valt `currentColor` terug op de tekstkleur (#1E3A4C) — een veelgemaakte fout.
- Personages: `b-lijf`/`b-jurk` + `b-hoofd` + haar (`bh-*`) + `b-blij` + accessoires (`acc-*`). Pino = `p-basis` + een pose (`pino-staan`, `pino-loop`, `pino-vinger`, `pino-foto`, `pino-duw`, …); moet een arm over iets anders heen (spel 1), dan `pino-romp` + een hangende `pino-arm-links`/`-rechts` + de losse `pino-arm-vinger` die om de schouder gedraaid wordt. **Een personage heeft altijd precies twee armen**: een lijf met armen (`b-lijf`) krijgt er nooit een extra arm bij; wie iets draagt (baby, tas) gebruikt een armloos lijf (`b-lijf-los` of `p-basis`), het voorwerp volledig zichtbaar vóór de borst, en daaroverheen `s9-armen-om`.
- Kalme spellen (2, 3, 4, 5, 7, 8): DOM + SVG. Actiespellen (1, 6, 9, 10): canvas met een sprite sheet uit dezelfde symbolen is toegestaan, maar het beeld blijft identiek aan het ontwerp.
- Fonts: **Fredoka** (koppen, `.kop`, gewicht 700) en **Nunito** (tekst, 400/700/800), via Google Fonts.

### Palet

| Rol | Kleur |
|---|---|
| Achtergrond app | `#BFE6FA` met subtiele isometrische tegellijnen (`.vloer`: twee `repeating-linear-gradient`s van 30° en 150°, wit 38 %) |
| Kaarten | wit, schaduw `0 6px 0 0 #CDE4F0` |
| Tekst | `#1E3A4C`; gedempt `#4F6B7E` / `#35505F` |
| Teal (knoppen, accenten) | `#1FA3DC` / schaduw `#0E7FB5` |
| Groen (succes, gras) | `#39D353` / `#1FA34A`; gras `#8BD35A` / `#9ADB7A` / `#5FB05A`; jungle `#4E9A3E` / `#2E7D1E` |
| Geel | `#FFC93C` / `#D97A00`; lichtgeel `#FFE08A` |
| Rood | `#FF5E5B` / `#C43B38` |
| Roze (Pino) | `#FF6FAE` / `#B23A6A`; licht `#FFD6E6` |
| Paars (vaardigheid) | `#9B6BFF` / `#6B3FCF` |
| Hout | `#D98E55` / `#C2743C` / `#8B4A1E`; stro/riet `#D9B27C` / `#C9A77A` |
| Huid | `#F6C9A8` / `#E8B48A` / `#C98B5A` |
| Zand | `#FDE9B6` / `#F2CF8A`; zee `#1FA3DC` / `#0E7FB5`; lucht `#8ED8F8`; avondlucht `#2B4A66` |
| Nachtmarkt-kasseien | `#556B8E` / `#4E6384`; asfalt `#4F6B7E`; stoep `#CFD8DC` / `#DDE7EE`; klinkers `#C2743C` / `#D98E55` |
| Bordvakken (spel 8) | licht `#D9CFA8`, donker `#8AA66E`, rand `#3D7A30` |

## Technische uitgangspunten (al afgesproken)

- **GitHub Pages**, statische site. Geen build-stap die nodig is om de site te laten werken; alles moet direct vanuit de repo serveren.
- **Gekozen stack (besluit Benjamin, 2 november 2026): vanilla HTML/CSS/JS met native ES-modules, geen framework, geen bundler, geen packages.** De kalender is één app onder `/advent/` met hash-routing (`#/`, `#/spel/3`, …). Kalme spellen zijn SVG-DOM; de actiespellen (1, 6, 9, 10) tekenen op canvas met een sprite sheet die tijdens runtime uit dezelfde SVG-symbolen wordt gerasterd. Dev-tooling: alleen een lokale statische server (`npx serve .`, zie `.claude/launch.json`); geen `package.json`, geen testrunner.
- Code-indeling: `advent/index.html` (schil), `advent/css/` (`basis.css` = palet als custom properties, vloer, kaarten, knoppen), `advent/js/` (`app.js`, `router.js`, `staat.js`, `datum.js`, `sprites.js`, `invoer.js`, `ui/`, `spellen/`), `advent/data/` (`kalender.json`, `laadteksten.json`). Een spel exporteert `start({ root, staat, klaar })` en geeft een opruimfunctie terug. Spellogica zonder DOM komt in losse modules (bv. `spellen/hex.js`).
- Sprites: `sprites.js` laadt `assets/sprites/sprites.svg` één keer en injecteert de `<symbol>`s in het document; bouw scènes met `use()`, `pino()`, `persoon()`, `dier()` uit `sprites.js` (JS-port van de Python-helpers). `#/test` toont een sprite-controlescherm.
- Canvas-spellen (voorbeeld: `spellen/spel1.js`): `spellen/spritesheet.js` rastert symbolen per (id, kleur, DPR) met `tekenSprite(ctx, id, x, y, { kleur, flip })`; `spellen/canvas.js` maakt het HiDPI-canvas en een statische achtergrondlaag; `spellen/lus.js` is de rAF-lus met pauze bij verborgen tab; `invoer.js` koppelt toetsenbord, D-pad (vasthouden) en de virtuele joystick uit `ui/joystick.js` (vasthouden op het scherm → ring met knop op de drukplek; `maakInvoer({ joystick: { element, vertraging, tik } })`). Een spel exporteert `voorbereid()` (sprite sheet laden, aangeroepen door het laadscherm) en `start()`. Het resultaatscherm is `ui/resultaat.js`.
- Jekyll staat uit (`.nojekyll`); `404.html` stuurt paden onder `/advent/` terug naar de app.
- Mobiel eerst: ontwerp is 390×844 (telefoon); er is ook een desktop-variant van de kalender (1280 breed). Alles moet werken met touch én toetsenbord (pijltjestoetsen in spel 1, 5, 8, 10).
- Spelstaat in `localStorage`, altijd in `try/catch` (privé-modus kan storage weigeren). Zie `design/economie-en-spelstaat.md` voor de velden.
- Deurtjes gaan open op datum (24 nov t/m 3 dec); met `?test=1` in de URL zijn alle deurtjes open voor testen, `?dag=5` doet alsof het dag 5 is, `?datum=2026-11-27` zet een vaste datum (zie `datum.js`).
- Toegankelijkheid zoals in het ontwerp: echte `<button>`/`<a>`, `aria-label` op icoon-knoppen, `role="img"` + `aria-label` op scènes, decoratieve SVG `aria-hidden="true"`.
- Geen externe afhankelijkheden behalve Google Fonts, tenzij Benjamin anders beslist.

## Sims-elementen in de kalender (ontworpen, te bouwen)

Behoeftenpaneel (inklapbaar, groen/geel/rood), vaardigheidsbalken (Koken, Mechanica, Charisma, Lichaam, Logica, Creativiteit; 10 blokjes), taartmenu bij het tikken op een deurtje (Open deurtje / Gluren… / Briefje lezen / Annuleren; ook gebruikt voor tegel- en edelsteenkeuze in spel 2), Nederlandse "reticulating splines"-laadteksten, gedachtenwolkje met hint voor morgen, telefoon-notificatie "Er wordt gebeld!", isometrische tegelvloer. Bewust verwijderd: "Sul sul!", stickerboek, "Pino's favorieten", buurtscherm.

## Werkwijze

- Werk spel voor spel, in volgorde, en laat Benjamin elk spel beoordelen voor je verder gaat. Dat is de afgelopen sessies de werkwijze geweest en dat bevalt. Volg per spel de stappen in `specs/README.md` (spec lezen/aanvullen → bouwen → acceptatiecriteria nalopen → status bijwerken) en leg keuzes die niet in het ontwerp staan vast in `specs/besluiten.md`.
- Blijf trouw aan de previews: zelfde opbouw, maten, kleuren en sprites. Kleine afwijkingen die nodig zijn voor werkende interactie zijn prima; stijlwijzigingen niet.
- Wijzig sprites via `design/generators/*.py` en genereer `assets/sprites/*.svg` opnieuw, zodat ontwerp en app gelijk blijven.
- Open punten die nog bij Benjamin liggen: definitieve speltitels, het "Briefje voor Pino" per dag (de finale heeft nog een placeholder), vaardigheidspunt voor dag 10, de edelsteenprijzen in spel 3.
