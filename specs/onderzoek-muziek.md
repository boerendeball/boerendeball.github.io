# Onderzoek: muziek en geluidseffecten

**Status:** onderzoek en advies, nog niets gebouwd in `advent/` · 22 november 2026 · ter beoordeling door Benjamin
**Proefje:** [`design/geluid-voorstel/index.html`](../design/geluid-voorstel/index.html) (server `site`, open `http://localhost:3000/design/geluid-voorstel/`). Daar zijn vijf melodieën en ruim dertig geluidseffecten te beluisteren, met een aan/uit-knop met alleen een icoon, volume, ducking en tempo. De klankmotor [`synth.js`](../design/geluid-voorstel/synth.js) heeft al de vorm van de voorgestelde module.

## Kort: de aanbeveling

1. **Maak alles zelf in code met de Web Audio API**: muziek en effecten worden in de browser gemaakt, zonder audiobestanden en zonder bibliotheek. Eén module `advent/js/geluid.js` (± 600 regels, ± 15 kB) met een kleine sequencer en een handvol "speelgoedinstrumenten": marimba, elektrische piano, kalimba, speeldoos, draaiorgel, bel, bas en zacht slagwerk.
2. **Muziek**: één eigen kalenderthema (rustige bossa met marimba, als eigen knipoog naar de muziek van oude bouwspellen) en een eigen sfeer per groep spellen. Spel 1 krijgt een speeldoos, spel 2–8 een vijftonige marimba (de nachtmarkt trager, met bellen), spel 9 en 10 een Hollandse draaiorgelwals en de finale een feestversie. Muziek alleen in de kalender en in de kalme spellen; de actiespellen krijgen een zachte loop of alleen effecten (zie §4.2).
3. **Effecten** bij elke handeling die je al ziet, nooit bij iets wat verborgen moet blijven (§4.4).
4. **Eén aan/uit-knop met alleen een luidspreker-icoon** in de kopbalk en op de kalender. De keuze staat in een eigen `localStorage`-sleutel (in try/catch). Geluid start pas na de eerste tik. De stille modus van de iPhone wordt gerespecteerd.
5. **Geen bibliotheek** (Howler.js, Tone.js) en **geen bestanden** nodig. Wordt een gesynthetiseerd effect niet mooi genoeg, dan is een CC0-geluid van Kenney de reserve: CC0, geen naamsvermelding nodig.
6. **Planning**: de kalender opent over twee dagen (24 november). Bouw daarom in twee fasen: eerst de kern, de kalender en het resultaatscherm, daarna per spel de effecten, telkens vóór het deurtje van dat spel opengaat (§5.4).

---

## 1. Uitgangspunten

- Statische site op GitHub Pages, vanilla JS met ES-modules, geen build, geen packages, geen externe afhankelijkheden behalve Google Fonts (`CLAUDE.md`).
- **Eigen interpretatie** van de sfeer van oude Sims-spellen: geen muziek, jingles, stemmen ("Simlish") of geluiden van EA/The Sims, en ook geen melodie die er herkenbaar op lijkt. Dat geldt ook voor herkenbare geluiden uit andere spellen (bijvoorbeeld de bekende munt van twee tonen uit een loodgietersspel).
- Harde ontwerpregel: in de spellen geen tekst of uitleg, knoppen alleen met een icoon. Voor geluid betekent dat ook dat een geluid geen hint mag zijn (§4.4).
- Mobiel eerst (390×844), touch én toetsenbord.
- De spec van Pino's kamer zegt nu "Geen geluid" ([`kamer.md`](kamer.md), regel 138). Dat laat ik staan tot Benjamin beslist (open vraag 6).

## 2. Waar komt het geluid vandaan?

### 2.1 Zelf maken in code (Web Audio API) — aanbevolen

Oscillatoren, ruis, filters en volumecurves maken in de browser zelf tonen. Een melodie is dan data (noten per stap) en een effect is een functie van een paar regels. Het proefje laat zien hoe dat klinkt.

| Voor | Tegen |
|---|---|
| Geen licentievragen: alles is eigen werk, dus zeker een eigen interpretatie | Klinkt synthetisch; echte instrumenten (sax, gitaar, stemmen) zijn niet haalbaar |
| Nul bestanden, ± 15 kB code; laadt direct, ook op een trage verbinding | Componeren en afstellen kost tijd (luisteren, schaven) |
| Past bij de poppenhuisstijl: platte, schone vlakken ↔ schone, eenvoudige klanken | Instrumenten moeten zelf ontworpen worden (het proefje heeft er al ruim tien) |
| Tempo, toonsoort en instrument zijn live aan te passen (versnellen in de laatste seconden, pitch per edelsteenkleur) | Weinig rekenwerk, maar op oude telefoons kost een drukke loop wat CPU (proefje: verwaarloosbaar) |
| Geen geheugen voor gedecodeerde audio (een loop van 60 s in een bestand kost na decoderen ± 20 MB RAM) | |
| Past in de bestaande opzet: native modules, geen build, net als `spritesheet.js` dat sprites tijdens runtime rastert | |

**Kant-en-klare mini-synths** (ter vergelijking): [ZzFX](https://github.com/KilledByAPixel/ZzFX) (MIT, < 1 kB, effecten met 20 parameters) en [ZzFXM](https://github.com/keithclark/ZzFXM) (muziek bovenop ZzFX, gemaakt voor js13k-spellen). Die zijn klein en zouden als los bestand in de repo kunnen, maar het is wel een externe afhankelijkheid (beslissing Benjamin). De klank is bovendien eerder "retro-arcade" dan "poppenhuis". Mijn advies: niet nodig, de eigen motor in het proefje doet hetzelfde in leesbare Nederlandse code.

### 2.2 Rechtenvrije audiobestanden

| Bron | Licentie | Naamsvermelding | Opmerking |
|---|---|---|---|
| [Kenney – Interface Sounds](https://kenney.nl/assets/interface-sounds) (100 st.), [UI Audio](https://kenney.nl/assets/ui-audio) (50), [Music Jingles](https://kenney.nl/assets/music-jingles) (85) | CC0 | Niet nodig (mag) | Beste bestandsbron: consistent, klein, CC0. Jingles in verschillende stijlen, geschikt voor het resultaatscherm |
| [OpenGameArt](https://opengameart.org/content/faq) | Per bestand: CC0, CC-BY, CC-BY-SA, GPL, … | Verplicht behalve bij CC0; bij BY-SA/GPL ook dezelfde licentie voor afgeleid werk | Alleen bestanden met CC0 gebruiken, anders een aftiteling en licentieteksten in de repo |
| [Freesound](https://freesound.org/help/faq) | Per geluid: CC0, CC-BY of CC-BY-NC | Verplicht bij BY en BY-NC | Groot aanbod van losse effecten (kwakende gans!); filter op CC0 |
| [Pixabay muziek en effecten](https://pixabay.com/service/terms/) | Eigen Pixabay-licentie (CC0 alleen voor inhoud van vóór 9 januari 2019) | Niet nodig | Je mag de bestanden niet "los" verspreiden. Een openbare GitHub-repo met de mp3's erin is een grijs gebied. Liever niet |

Technisch bij bestanden: **mp3** werkt overal (Ogg Vorbis niet in oudere Safari). Een mp3-loop heeft een klein gat bij het begin (encoder-padding), dus loopen via Web Audio met `loopStart`/`loopEnd`. Grootte: een loop van 60 s op 96–128 kbps is 0,7–1 MB. Vijf thema's plus effecten komen op 4–6 MB, en die moet je per spel lui laden.

| Voor | Tegen |
|---|---|
| Echte instrumenten en een rijkere klank | Licenties per bestand bijhouden; risico dat iets toch niet vrij is |
| Snel effecten vinden | Bestanden uit verschillende bronnen klinken niet als één geheel |
| | Megabytes laden op een telefoon; geheugen na decoderen |
| | Een sfeer per spel vinden die bij het decor past én rechtenvrij is, kost veel zoekwerk |

### 2.3 Zelf gemaakte muziek (opgenomen of in een muziekprogramma)

Benjamin of iemand uit de familie speelt een melodie in (marimba-app, keyboard, ukelele) of maakt een liedje in een webtool zoals BeepBox, en exporteert dat als mp3. Dat is zeker een eigen interpretatie en het is heel persoonlijk: een cadeau in het cadeau. Een opgenomen "Lang zal ze leven" door de familie voor de finale zou bijvoorbeeld prachtig zijn. Nadeel: dezelfde technische nadelen als bij bestanden (§2.2) en het kost opnametijd. Muziek van AI-generatoren raad ik af: de rechten zijn onduidelijk en de stijl is moeilijk te sturen.

### 2.4 Vergelijking

| | Zelf in code | CC0-bestanden | Zelf opgenomen |
|---|---|---|---|
| Licentierisico | geen | laag (alleen CC0) | geen |
| Laadtijd | ± 15 kB | 4–6 MB | 1–5 MB |
| Eén samenhangende klank | ja | moeilijk | ja |
| Klankrijkdom | speelgoed-/synthklank | hoog | hoog |
| Aanpasbaar per spel (tempo, toonhoogte) | ja, live | beperkt | beperkt |
| Werk | componeren en afstellen | zoeken, knippen, licenties | opnemen, mixen |
| Past bij "geen packages, geen build" | ja | ja | ja |

**Mengvorm** (aanbevolen als reserve): alles in code, en alleen als een effect echt niet lukt (bijvoorbeeld een overtuigend "kwak") één CC0-bestand van Kenney of Freesound in `advent/geluid/`, met de bron in een `BRONNEN.md` ernaast, ook al is naamsvermelding bij CC0 niet verplicht.

## 3. Technische randvoorwaarden

### 3.1 Autoplay: geluid pas na een tik

Browsers laten een `AudioContext` pas klinken als die binnen een gebruikersgebaar (tik, klik, toets) is gemaakt of hervat. Een context die eerder is gemaakt, staat op `suspended` ([MDN, Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices); [Chrome, Web Audio en autoplay](https://developer.chrome.com/blog/web-audio-autoplay)). Daarom:

- `app.js` zet één luisteraar op `pointerdown` en `keydown` (capture) die `geluid.ontgrendel()` aanroept. Die maakt de context de eerste keer en roept daarna bij elke tik `resume()` aan als hij niet draait.
- De kalender start dus stil en de muziek begint bij de eerste tik (meestal op een deurtje). Dat voelt natuurlijk: tik → taartmenu-plop → muziek komt zacht op.
- Effecten die in dezelfde tik worden afgespeeld, worden ingepland op `ctx.currentTime`; ook als `resume()` nog bezig is (Safari), klinken ze zodra de context draait.

### 3.2 iOS

- **Stille modus**: Web Audio op iOS gebruikt standaard de audiosessie `ambient`, en die is stil als de stille modus aan staat. `navigator.audioSession.type = 'playback'` (alleen Safari, Editor's Draft) maakt het geluid toch hoorbaar ([WebKit bug 237322](https://bugs.webkit.org/show_bug.cgi?id=237322)). **Advies: niet doen.** Wie de stille modus aanzet, verwacht stilte (ook volgens [Apple's richtlijnen](https://developer.apple.com/design/human-interface-guidelines/playing-audio)), en `ambient` mengt netjes met muziek die Pino misschien zelf al afspeelt. Gevolg: zet Pino haar telefoon op stil, dan hoort ze niets. Dat is acceptabel, omdat geluid nergens nodig is om te spelen.
- **Onderbreking door een telefoontje of Siri**: Safari zet de context dan op `interrupted`. Hervatten kan pas weer na een tik; `ontgrendel()` doet dat bij elke tik, dus na het gesprek komt het geluid terug zodra Pino het scherm aanraakt.
- **Thuisscherm-app** (`manifest.webmanifest`): werkt hetzelfde. Bij het wisselen van app gaat de pagina naar `hidden` (zie §3.3).

### 3.3 Verborgen tab

`visibilitychange`: bij `hidden` de context `suspend()`, bij terugkomen `resume()` (als het geluid aan staat). Dat sluit aan op [`spellen/lus.js`](../advent/js/spellen/lus.js), die de spellus dan ook pauzeert. De sequencer plant vooruit met de klok van de audiocontext ("a tale of two clocks": elke 25 ms alles inplannen wat in de komende 150 ms valt). Is de klok weggelopen, dan slaat hij gemiste noten over in plaats van ze tegelijk af te spelen. Dat zit al in het proefje.

### 3.4 Laadtijd en grootte

Synthese: ± 15 kB JavaScript, geen bestanden, geen decodeertijd. De module kan statisch geïmporteerd worden; de thema's per spel kunnen in losse modules (`geluid/themas.js`) die pas laden bij het laadscherm van het spel (`voorbereid()`).

### 3.5 Bibliotheken (alleen als Benjamin dat beslist)

| Bibliotheek | Licentie | Grootte | Wat het oplost | Nodig? |
|---|---|---|---|---|
| [Howler.js](https://github.com/goldfire/howler.js) | MIT | ± 7 kB gzip | Bestanden afspelen, audio-sprites, iOS-unlock, formaten, fallback naar HTML5 Audio | Alleen bij de bestandsaanpak, en ook dan is ± 60 regels eigen code genoeg |
| [Tone.js](https://github.com/Tonejs/Tone.js) | MIT | veel groter dan Howler | Volledige muziekomgeving: sequencer, synths, effecten | Nee: overkill voor tien korte loops |
| ZzFX / ZzFXM | MIT | < 1 kB / ± 2 kB | Mini-synth voor effecten / muziek | Nee: eigen motor doet hetzelfde, in de eigen stijl |

Elke bibliotheek zou als los bestand in `advent/js/vendor/` moeten (geen npm, geen CDN-afhankelijkheid). Mijn advies: geen van allen.

### 3.6 Testen

Er is geen testrunner. Het proefje is de luisterbank. In de app komt er een dev-schakelaar `?geluid=0` (start stil) en op `#/test` een rij knoppen per effect, zoals het sprite-controlescherm. Echt testen moet op een iPhone (stille modus, telefoontje, vergrendelen) en een Android-telefoon.

## 4. Ontwerp

### 4.1 Muzikaal concept: "poppenhuis-lounge"

Warm, licht en speels, met een zachte aanslag: houten en metalen speelgoedklanken (marimba, kalimba, speeldoos, klokjes), een elektrische piano, een ronde bas en slagwerk met shaker en houtblokje. Geen harde chiptune: het proefje heeft ter vergelijking een speelgoed-chiptune-variant, maar die klinkt meer als een spelcomputer dan als een poppenhuis.

**Pino-motief**: één kort loopje dat overal terugkomt, zoals een herkenningsmelodie. Het idee is de eerste maat van het kalenderthema (A–C–E–D–C): op de kalender in de marimba, in spel 1 op de speeldoos, in spel 2–8 vijftonig "vertaald", in spel 9 op het draaiorgel en in de finale groot met alle instrumenten. Zo voelt de reis van tien dagen als één geheel, zonder woorden.

Muziek staat altijd **zachter dan de effecten** (muziek 0,5, effecten 0,9, master 0,8; in het proefje te horen) en loopt via een compressor, zodat niets plotseling hard is.

### 4.2 Muziek per scherm

| Scherm | Muziek | Instrumenten / sfeer | In het proefje |
|---|---|---|---|
| Kalender, deurtje, briefje, laadscherm | Kalenderthema, doorlopend | Bossa in F, marimba + e-piano + bas + shaker + clave | "Kalender · bossa" |
| Telefoon "Er wordt gebeld!" | Muziek even zacht (ducking), bel rinkelt | Eigen bel van twee tonen | effect "Er wordt gebeld!" |
| Spel 1 slaapzaal (actie, 24 nov) | Zachte speeldoos; laatste 5 s tempo omhoog | Wiegelied in 3/4 | "Spel 1 · speeldoos" + tempo-schuif |
| Spel 2 tuin, 3 families, 4 foto's (kalm) | Vijftonige marimba | D-E-F♯-A-B, marimba, kalimba, houtblok, af en toe een zachte gong | "Spel 2–8" |
| Spel 5 nachtmarkt (kalm), 6 steeg (actie) | Zelfde thema, trager, bellen i.p.v. marimba. In spel 6 stopt de muziek bij de diefstal; tijdens de armklem een eigen beat (ritmespel) | 's Avonds, lampions | variant van "Spel 2–8" |
| Spel 7 fotoalbum | Kalenderthema, alleen marimba (herinneringen) | — | — |
| Spel 8 jungle-schaak | Vijftonig, traag, met houtblok en vogelgefluit tussen de beurten | — | variant |
| Spel 9 dorp (actie) | Draaiorgelwals | Orgel met vibrato, hoempapa | "Spel 9 · draaiorgel" |
| Spel 10 fase 1 avondstad, fase 2 auto | Wals trager (avond), in de auto sneller (tempo 1,3×) | — | tempo-schuif |
| Finale | Feestversie van het Pino-motief, eventueel **"Lang zal ze leven"** (traditioneel, vrij van rechten) op speeldoos of draaiorgel | — | effect "Finale: feest" |
| Resultaatscherm | Muziek vervaagt, jingle, daarna komt het kalenderthema terug | — | "Gewonnen", "Helaas" |
| Pino's kamer | Volgens de spec geen geluid (open vraag 6) | — | — |

Over de Zuidoost-Aziatische spellen: een vijftonige toonladder en houten slagwerk geven de sfeer zonder karikatuur. Dus geen gong op elke maat, geen nagemaakte "Oosterse" clichés; het blijft dezelfde vrolijke poppenhuisklank in een andere toonladder.

### 4.3 Geluidseffecten: waar en welke

Alle effecten staan in het proefje (naam tussen haakjes). Kolom "aanroep" = waar het in de bestaande code komt.

**Kalender en gedeelde UI**

| Moment | Effect | Aanroep |
|---|---|---|
| Elke knop (algemeen) | `tik` (heel zacht) | niet overal: alleen pillen en ronde knoppen, via `h()`-helper of CSS-klasse in [`ui/dom.js`](../advent/js/ui/dom.js) |
| Tik op deurtje → taartmenu open | `taartOpen` (plop) | [`ui/taartmenu.js:22`](../advent/js/ui/taartmenu.js) `toonTaartmenu` |
| Optie kiezen / annuleren / uitgeschakeld | `taartKies` / `taartDicht` / `slot` | [`ui/taartmenu.js:61`](../advent/js/ui/taartmenu.js) (onclick) en `sluit()` (:116) |
| Deurtje open (naar laadscherm) | `deur` (klopje + belletjes omhoog) | [`kalender.js`](../advent/js/kalender.js) `openTaartmenu` (:154), actie "Open deurtje" |
| Deurtje op slot, gans | `gans` (kwak kwak kwaaak) | [`kalender.js:171`](../advent/js/kalender.js) `toonVergrendeld` |
| Briefje lezen | `briefje` (papier) | [`kalender.js:204`](../advent/js/kalender.js) `toonBriefje` |
| Er wordt gebeld! | `telefoon` (herhaalt tot opnemen), opnemen = `tik` | [`kalender.js:223`](../advent/js/kalender.js) `toonTelefoon` |
| Resultaat gewonnen / mislukt | `gewonnen` / `helaas` | [`ui/resultaat.js:18`](../advent/js/ui/resultaat.js) `toonResultaat` (op `confetti`) |
| Vaardigheid verdiend | `vaardigheid` (klokjes omhoog, na de jingle) | `toonResultaat`, als `beloning.eersteKeer` |
| Melding (`toonMelding`) | `tik` of geen | [`ui/overlay.js:42`](../advent/js/ui/overlay.js) |

**Per spel** (aanroep in `spellen/spel{n}.js` op de plek waar de handeling al gebeurt)

| Spel | Effecten |
|---|---|
| 1 Slaapzaal | `stap` (zacht, elke paar stappen), `gaap` als een kind begint te gapen (dat zie je ook), `plop` bij onderbreken, `goed` bij +1, `whoosh` voor het lapje dat uit de deken vliegt (geen extra glinster: het doel blijft verborgen), tik-tak in de laatste 5 s |
| 2 Tuin | `taartOpen`/`taartKies` (gedeeld), `tegel`, `slot` als een tegel niet past, `groei` bij een nieuw veld, `toeter` bij de taxi, `glinster` bij een volle ring, `steenGroen`/`steenBlauw`/`steenRood` |
| 3 Families | `munt`/`kassa` bij kopen, `plop` bij koppelen, `goed` + korte fanfare als een familie compleet is |
| 4 Foto's | `stap`, `sluiter`, `goed` (wit frame) / `fout` (rood frame), `kassa` bij de betaling |
| 5 Nachtmarkt | `stap`, `tik` bij de tekstballon, `munt` bij −/+ (toonhoogte volgt het bod), `goed` bij akkoord, bromtoon bij een boze handelaar, snelle stapjes bij "miss! miss! wait!", `kassa` bij betalen, `steen…` bij de wisselkraam |
| 6 Steeg | Muziek valt stil bij de greep, spanningstoon + `boem` bij de stop-knop, per baan een eigen toon bij een gelukte move (raak = ritme), `whoosh` bij een misser, korte sirene (eigen tweetoon) als de politie komt |
| 7 Album | papier bij bladeren, `tik` bij een polaroid, stempel (`hout` + `goed`) bij een gevonden werker |
| 8 Jungle-schaak | `stap` op steen, `whoosh` bij het wisselen met een stam, `tik` op de zandloper, "denk"-blipje bij het dier, plof bij de zet van het dier, `spray`, `fout` + plof als Pino gevangen wordt, fanfare bij de tempel |
| 9 Dorp | `stap`, `whoosh` bij duwen, `vang` bij een gevangen baby, plof bij een misser, `glinster` bij de kliniek |
| 10 Bevalling | `stap`, `gans` (boze gans: lager en sneller), `toeter`, voorbijrijdende auto (ruis die aanzwelt), piepende rem, `boem` bij een botsing, `feest` + finalemuziek bij aankomst |

### 4.4 Regel: geluid verraadt niets

Geluid volgt alleen wat Pino al **ziet** of **doet**. Het is feedback, geen hint. Concreet:

- De werker (spel 2–6) maakt geen geluid zolang spel 7 dicht is. Daarna pas een stempel als hij gevonden is, geen "warm/koud"-geluid in de buurt.
- Het lapje in spel 1 krijgt hetzelfde neutrale `whoosh` als andere bewegingen, geen beloningsgeluid dat suggereert dat het ergens voor dient (besluit 200).
- Spel 4: geen geluid op het juiste fotomoment. Alleen de sluiter en daarna wit (`goed`) of rood (`fout`).
- Spel 5: de handelaar die twijfelt (Matig) of de samenzwering (Moeilijk) krijgen geen eigen muziekje voordat het te zien is.
- Spel 8: het dier maakt bij het nadenken altijd hetzelfde blipje, ongeacht wat het van plan is.
- Geen gesproken woorden of stemmen, ook geen gebrabbel-taal (dat is bovendien een herkenbaar Sims-element). De handelaar in spel 5 roept alleen in de tekstwolk.

### 4.5 Aan/uit-knop

- **Icoon-only**: luidspreker met golfjes (aan) / luidspreker met kruisje (uit), ronde knop 44 px in de bestaande stijl `.knop-rond`, `aria-pressed="true|false"`, `aria-label` "Geluid uit" / "Geluid aan" (het label zegt wat de knop doet). Te zien in het proefje rechtsboven.
- **Plaats**: in de kopbalk van elk spel en deurtje ([`ui/kopbalk.js:8`](../advent/js/ui/kopbalk.js)), vóór het `rechts`-blok, zodat hij altijd op dezelfde plek staat; op de kalender rechtsboven in de Sim-kaart, naast de kamerknop. Is de kopbalk op 390 px te vol (spel 5 heeft geld en ketting), dan op die schermen alleen in het pauze-/terugmenu (open vraag 4).
- **Eén knop voor alles.** Muziek en effecten apart instelbaar kan op de kalender (daar mag tekst), maar dat is meestal niet nodig. Advies: pas toevoegen als Pino erom vraagt.
- **Bewaren**: eigen sleutel `pino-geluid` met `{ aan, volume }`, los van `pino-advent`. Zo wist `?reset=1` de spelstaat maar niet de geluidskeuze. Lezen en schrijven altijd in try/catch; zonder storage geldt de standaard voor deze sessie.
- **Standaard**: aan. Er klinkt toch niets vóór de eerste tik, en de stille modus van iOS wordt gerespecteerd.

### 4.6 Volume en ducking

- Drie bussen: `muziek` (0,5) → `duck` → master (0,8) → compressor → luidspreker; `effecten` (0,9) → master.
- **Ducking**: bij elk effect gaat de muziek in 30 ms naar 35 % en komt ze in ± 200 ms na het effect terug (`setTargetAtTime`). Bij de telefoon en het resultaatscherm gaat de muziek helemaal weg (fade 0,35 s) en komt het kalenderthema daarna terug.
- Geen volumeschuif in de app (tekst en schuiven passen niet in de spellen; de telefoon heeft zelf volumeknoppen). In het proefje zit er wel een, om de verhoudingen af te stellen.

### 4.7 Toegankelijkheid

- Geluid is nooit de enige drager van informatie: alles is ook te zien (dat is nu al zo).
- Niets speelt zonder handeling van de gebruiker; uitzetten kan altijd met één tik en blijft bewaard.
- Geen plotselinge harde geluiden (compressor, effecten onder 0 dBFS, botsing kort); geen hoge piepen boven ± 5 kHz als hoofdtoon.
- Met een schermlezer (VoiceOver/TalkBack) kan doorlopende muziek storen. De knop staat daarom vooraan in de kopbalk, direct na de terugknop, en is met Tab bereikbaar.
- `prefers-reduced-motion` gaat over beweging, niet over geluid; daar doen we niets mee.

## 5. Aanbeveling en plan

### 5.1 Keuze

Zelf maken in code (§2.1), met CC0 van Kenney als reserve voor een enkel effect. Geen bibliotheek. Een eigen kalenderthema met een Pino-motief dat in elke spelsfeer terugkomt.

### 5.2 Module `advent/js/geluid.js` (API)

```js
// advent/js/geluid.js — muziek en effecten met de Web Audio API (geen bestanden).
export function ontgrendel()              // app.js: bij elke pointerdown/keydown; maakt/hervat de AudioContext
export function speel(naam, opties)       // effect, bv. speel('munt', { toon: 1.2 }) (toonhoogte, volume)
export function muziek(thema, opties)     // 'kalender' | 'speeldoos' | 'tropen' | 'nachtmarkt' | 'orgel' | 'finale' | null
export function tempo(factor)             // spel 1 laatste seconden, spel 10 in de auto
export function isAan() / zetAan(bool)    // aan/uit, bewaard in localStorage 'pino-geluid' (try/catch)
export function abonneer(fn)              // knoppen bijwerken als de stand verandert
export function geluidKnop()              // <button class="knop-rond"> met luidspreker-icoon, aria-pressed
```

Opbouw: `geluid.js` (motor, bussen, ontgrendelen, aan/uit) · `geluid/instrumenten.js` (marimba, bel, …) · `geluid/effecten.js` · `geluid/themas.js` (noten als tekst, zoals in het proefje). De iconen `luidspreker` en `luidsprekerUit` komen in [`ui/iconen.js`](../advent/js/ui/iconen.js).

### 5.3 Aanroepen in de bestaande code

| Bestand | Wat |
|---|---|
| [`app.js`](../advent/js/app.js) | luisteraar `pointerdown`/`keydown` → `ontgrendel()`; dev-schakelaar `?geluid=0` bij `devSchakelaars()` |
| [`router.js`](../advent/js/router.js) `toon()` | niets; elk scherm kiest zelf zijn muziek (zo blijft de router dom) |
| [`kalender.js`](../advent/js/kalender.js) | `schermKalender`/`schermDeur`: `muziek('kalender')`; deurtje, gans, briefje en telefoon zoals in §4.3; de knop in de Sim-kaart |
| [`ui/laadscherm.js`](../advent/js/ui/laadscherm.js) | kalendermuziek loopt door; het spelthema wordt hier voorbereid |
| [`ui/taartmenu.js`](../advent/js/ui/taartmenu.js) | `taartOpen` bij openen, `taartKies`/`taartDicht`/`slot` (geldt meteen ook voor spel 2 en 5) |
| [`ui/kopbalk.js`](../advent/js/ui/kopbalk.js) | `geluidKnop()` standaard in de kopbalk (optie `geluid: false` om weg te laten) |
| [`ui/resultaat.js`](../advent/js/ui/resultaat.js) | muziek uit, `gewonnen`/`helaas`, daarna `vaardigheid`; na de knop terug naar de kalender start het kalenderthema weer |
| [`spellen/index.js`](../advent/js/spellen/index.js) `schermSpel` | `muziek(info.muziek)` uit [`data/kalender.json`](../advent/data/kalender.json) (nieuw veld per dag), stoppen in de opruimfunctie |
| `spellen/spel1.js` … `spel10.js` | `speel(...)` op de bestaande momenten (§4.3); actiespellen roepen het aan vanuit `update()`, wat goed gaat omdat de audio zijn eigen klok heeft |
| [`test.js`](../advent/js/test.js) | knoppen per effect en thema, als luisterbank in de app |

### 5.4 Inschatting en volgorde

| Stap | Werk |
|---|---|
| 1. Kern: `geluid.js`, ontgrendelen, aan/uit-knop + iconen, opslag, zichtbaarheid | ½ dag |
| 2. Kalender + taartmenu + telefoon + resultaatscherm + kalenderthema afmaken | ½ dag |
| 3. Thema's afstellen (speeldoos, vijftonig, nachtmarkt, draaiorgel, finale) met Benjamin | 1 dag (vooral samen luisteren) |
| 4. Effecten per spel, 1–2 uur per spel | 1½–2 dagen |
| 5. Testen op iPhone en Android (stille modus, telefoontje, vergrendelen, tab wisselen) | ½ dag |
| **Totaal** | **± 4 dagen** |

Omdat deurtje 1 overmorgen opengaat (24 november): stap 1 + 2 + de speeldoos en effecten van spel 1 eerst (± 1 dag), daarna per spel de effecten vóór het deurtje opengaat. Dat past in de bestaande werkwijze "spel voor spel, Benjamin beoordeelt". Is dat te krap, dan kan geluid ook als verrassing halverwege komen: de code werkt zonder geluid precies zoals nu.

### 5.5 Open vragen voor Benjamin

1. **Aanpak**: zelf in code (advies) of toch bestanden (Kenney CC0 / zelf opgenomen)?
2. **Kalenderthema**: bossa met marimba (advies) of de speelgoed-chiptune? Beide in het proefje.
3. **Stille modus iOS** respecteren (advies) of geluid ook bij stille modus laten klinken (`audioSession.type = 'playback'`)?
4. **Knop**: in elke kopbalk (advies) of alleen op de kalender? En apart muziek/effecten, of één knop?
5. **Finale**: "Lang zal ze leven" (traditioneel, vrij), een eigen feestmelodie, of een opname van de familie?
6. **Pino's kamer**: blijft stil (zoals de spec nu zegt), of hetzelfde kalenderthema, zachter?
7. **Standaard aan** (advies) of standaard uit?

## Bronnen

- MDN, [Web Audio API best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) (autoplay, `resume()` na een gebaar)
- Chrome for Developers, [Web Audio, Autoplay Policy and Games](https://developer.chrome.com/blog/web-audio-autoplay)
- W3C, [Autoplay Policy Detection](https://www.w3.org/TR/autoplay-detection)
- WebKit, [bug 237322: Web Audio stil bij stille modus](https://bugs.webkit.org/show_bug.cgi?id=237322) (`navigator.audioSession.type`)
- Apple, [Human Interface Guidelines: Playing audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio)
- Kenney: [Interface Sounds](https://kenney.nl/assets/interface-sounds), [UI Audio](https://kenney.nl/assets/ui-audio), [Music Jingles](https://kenney.nl/assets/music-jingles) (CC0)
- OpenGameArt, [FAQ over licenties en naamsvermelding](https://opengameart.org/content/faq)
- Freesound, [FAQ](https://freesound.org/help/faq) (CC0 / CC-BY / CC-BY-NC per geluid)
- Pixabay, [Terms of Service](https://pixabay.com/service/terms/) en [FAQ](https://pixabay.com/service/faq/)
- [ZzFX](https://github.com/KilledByAPixel/ZzFX) (MIT) en [ZzFXM](https://keithclark.co.uk/articles/zzfxm/) (muziek voor js13k)
- [Howler.js](https://github.com/goldfire/howler.js) (MIT), [Tone.js](https://github.com/Tonejs/Tone.js)

Licenties zijn nagekeken op 22 november 2026. Controleer bij het downloaden van een bestand altijd de licentie op de pagina van dat ene bestand.
