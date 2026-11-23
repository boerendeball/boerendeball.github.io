# Spel 8 · Schaken op nieuw niveau

**Status:** gebouwd, te beoordelen (`advent/js/spellen/spel8.js`, regels en oplosser in `spellen/schaak.js`, levels in `spellen/schaak-levels.js`; controle `design/generators/spel8_levels_check.mjs`; besluiten #110–#124)
**Dag 8 · 1 december · Logica +3 · Techniek +1 · Creativiteit +1 · Bordspellen +40 % (besluit 164) · rendering: SVG-DOM**
Previews: `Spel8-Levels.png`, `Spel8.png`, `Spel8-Klaar.png`, `Spel8-Sprites.png` · Generator: `spel8_build*.py`, `spel8_sprites.py`
Sprites nieuw: `s8-tegel s8-water s8-doelvak s8-boom s8-bamboe s8-tempel s8-rots s8-stam s8-voet s8-stuk-python s8-stuk-tijger s8-stuk-luiaard s8-stuk-leeuw s8-stuk-krokodil s8-stuk-pino s8-wacht s8-opnieuw s8-speel s8-slot s8-vlag s8-stap s8-varen s8-gras s8-bloem s8-grootboom s8-liaan s8-vak s8-vak-water` · bij besluit spel 8 (stemmingen, spray, nadenken): `s8-stuk-{python,tijger,luiaard,leeuw,krokodil}-blij` `s8-stuk-{…}-boos` `s8-stuk-pino-sip s8-stuk-pino-spuit s8-wolk s8-lamp-uit s8-lamp-aan s8-nevel`

De preview `Spel8.png` is van vóór de besluiten #110–#121. Waar ze afwijkt, is deze spec leidend:
- er is geen D-pad meer, maar een sprayknop naast de zandloper; de opnieuw-knop staat links en wordt pas na de eerste zet bruikbaar (besluit 213);
- er staat geen voetstappen- of zettenteller in de kopbalk;
- rotsen zijn vast;
- level 2 heeft een andere kaart (twee keer veranderd: besluit #117 en #217).

## Doel en gevoel
In de jungle ligt een oud stenen schaakbord in de grond. Pino (roze pion) moet in vijf levels de tempel bereiken, telkens met een ander roofdier als schaakstuk op het bord (level 1: drie pythons). De dieren denken na en komen op haar af; de vorm van het stuk verraadt hoe het beweegt. Rustig puzzelen: niets gebeurt tot Pino de zandloper drukt.

## Schermen

### Leveloverzicht (zoals `Spel8-Levels.png`)
- **Kopbalk**: terug naar het deurtje, label "DAG 8 · 1 DECEMBER", titel, rechts de pil `s8-vlag` + `gehaald / 5`.
- **Levelkaart** (donkergroen `#2E5E1E`, rand `#1F4414`): 2 × 3 vakjes. Vijf levels met elk alleen het stuk (geen naam), het zesde vakje is Pino als pion.

  | Toestand | Beeld | Tik |
  |---|---|---|
  | gehaald | groene ring + `s7-vink` | speel opnieuw |
  | aan de beurt | blauwe ring | speel |
  | open | wit | speel |
  | dicht | grijs, stuk 30 % + `s8-slot` | geen knop |

  Een level is open als het level ervoor gehaald is.
- **Speelknop**: groen, `s8-speel` + het nummer van het laagste niet-gehaalde level.

### Bord (zoals `Spel8.png`)
- **Kopbalk**: terug naar het leveloverzicht, label "DAG 8 · LEVEL n VAN 5", titel. Rechts staat geen teller.
- **Scène** (358×582): de jungle en het bord zijn een port van `jungle()` uit `spel8_build2.py` (bord 8 × 36 px op 35,150; vakken licht `#D9CFA8` en donker `#8AA66E`, rand `#3D7A30`; rivier `s8-vak-water`).
  - Objecten en stukken worden rij voor rij getekend. Wat beweegt, ligt tijdens de animatie bovenop.
  - De scène schaalt mee met het scherm en staat samen met de knoppen in één kolom (`.s8-kolom`).
- **Knoppen** onder de scène, rechts:
  - **spray** (rond 64 px, `s5-spray`): standaard grijs;
  - **zandloper** (rond 92 px, groen, `s8-wacht`): altijd actief in Pino's beurt, ook als ze nog niets deed (besluit 213); grijs terwijl de dieren zetten.
- **Opnieuw** (rond 54 px, icoon `s8-opnieuw`, zoals in `Spel8.png`) links onder de scène (besluit 213):
  - grijs (uitgeschakeld) tot Pino's eerste handeling, spray of beurt in dit level; dan licht hij op: wit met een blauw icoon (`#0E7FB5`), met een kort pulsje;
  - een tik begint het level meteen opnieuw, ook midden in een animatie; daarna is de knop weer grijs;
  - het icoon is een open cirkelpijl: de boog loopt niet over zijn eigen begin heen (22 november aangepast in `spel8_sprites.py`).

## Regels (besluiten #110–#116)
**Bord**
- **Vast**: boom, bamboe, rots en rivier. Pino en het dier kunnen er niet op of doorheen.
- **Wisselbaar**: de boomstam (meerdere per level mogelijk) en een dier dat in de war is (besluit #124).
- **Tempel**: het doel. Het dier kan er niet op.

**Beurt van Pino**
- Pino begint. Per beurt doet ze hooguit één **stap** en één **wissel**, in elke volgorde, en eventueel de **spray**. Daarna drukt ze op de zandloper. Ze mag ook niets doen en meteen de zandloper drukken (besluit 213).
- **Stap**: één vak recht (omhoog, omlaag, links, rechts) naar een vrij vak. Het vak van het dier en de tempel tellen ook als vrij.
- **Wissel** (besluit #123): tik op een stam die recht naast Pino ligt. Pino en de stam wisselen van plek: Pino staat daarna op het vak van de stam, de stam op Pino's oude vak (Pino springt er met een boogje overheen, de stam schuift terug).
- **Markering**: de vakken waar Pino heen kan en de stammen waarmee ze kan wisselen, lichten op zoals in spel 2 (wit 22 %, gestippelde witte rand).

**Winnen en verliezen**
- Stapt Pino op de tempel, dan is het level gehaald.
- Stapt ze op het vak van een dier, of zet een dier op haar vak, dan is ze **gevangen**.

**Beurt van de dieren, na de zandloper**
1. Boven elk dier verschijnt een wolkje (`s8-wolk`) met een dof lampje (`s8-lamp-uit`, 0,9 s).
2. De lampjes springen aan (`s8-lamp-aan`, 0,3 s).
3. De dieren zetten na elkaar (volgorde van de kaart, rij voor rij), elk met de stand na de vorige zet. Andere dieren staan in de weg. Elk dier zet één schaakzet:
   - Kan het Pino slaan, dan doet het dat.
   - Anders kiest het de zet met de minste eigen zetten tot Pino (BFS met zijn eigen beweging). Bij gelijke stand gaat de kleinste Manhattan-afstand voor, en daarna een vaste volgorde.
   - Heeft het geen zet, dan blijft het staan.

**Beweging per dier**

| Level | Dier | Stuk | Beweging |
|---|---|---|---|
| 1 | Python | pion | Eén vak recht naar Pino's kant (rij + 1); slaat alleen schuin vooruit. Geen promotie: op de onderste rij blijft hij staan. |
| 2 | Tijger | toren | Glijdt recht. |
| 3 | Luiaard | paard | L-sprong over alles heen. |
| 4 | Leeuw | loper | Glijdt schuin. |
| 5 | Krokodil | koningin | Glijdt recht en schuin. |

Glijders stoppen vóór elk obstakel en elke stam.

## Spray: verwarring (besluit #113)
- **Wanneer**: de sprayknop is actief als er een dier op een van de 8 buurvakken van Pino staat, ze deze beurt nog niet gesprayd heeft en de spray dit level nog niet gebruikt is. De spray kost geen stap.
- **Met spray**:
  - Pino krijgt de pose `s8-stuk-pino-spuit` met een nevelwolkje (`s8-nevel`, 0,7 s).
  - Elk dier naast Pino wordt rood en boos (`-boos`) en is **twee beurten in de war**: het lampje blijft dof en het dier loopt een willekeurige kant op die niet naar Pino gaat. Het kiest eerst een zet die verder weg gaat, dan een op gelijke afstand, dan een andere. Een dier in de war slaat nooit.
  - Zolang een dier in de war is, is het **wisselbaar** zoals een stam (besluit #124): tikt Pino erop als het recht naast haar staat, dan wisselen ze van plek. Dat is haar wissel van die beurt en kan dus direct na de spray.
  - De "willekeur" komt vast uit de spelstand (hash), zodat het spel en de oplosser hetzelfde doen.
- **Zonder spray** (`producten` zonder `spray`): bij een tik springt de spray 1200 ms uit de knop omhoog, boven Pino's duim uit (besluit 209), zoals de kniebeschermers in spel 6: een wit ballonnetje (84 px) met rode rand en een rood puntje naar de knop, daarin `s5-spray` licht vervaagd met een klein rood "!?" eronder (`ui/ontbreekt.js`). Het hangt aan een omhulsel om de knop (`.s8-spray-plek`), niet in de knop zelf, en staat boven de knop in het decor onder het bord. Er gebeurt verder niets.
- **Uitleg na de eerste spray** (besluit 215, variant B van een voorstelblad, daarna weggehaald): de eerste keer dat Pino de spray echt gebruikt (niet zonder spray), opent na de nevel een dialoogkaart (`spellen/spel8-uitleg.js`, CSS `.s8-uitleg`/`.s8u-*`). Het spel wacht; na het sluiten gaat Pino verder met dezelfde beurt.
  - Bovenop een bol met `s5-spray`; daaronder een bewegend plaatje (lus van 4 s) van vijf schaakvakken met de echte sprites en het dier van het level. **Geen tekst.**
  - Pagina 1: Pino spuit (`s8-stuk-pino-spuit` + `s8-nevel`), het dier is boos (`-boos`), krijgt een wolkje met een dof lampje en loopt twee vakken van haar weg.
  - Pagina 2: een witte tik-ring op het verwarde dier naast Pino, daarna wisselen ze van plek (Pino springt, het dier schuift), met twee gebogen witte pijlen.
  - Onderaan: terug-pijl (alleen op pagina 2), twee bolletjes, een blauwe pijl naar pagina 2 en op pagina 2 een groen vinkje om te sluiten. Vegen en de pijltjestoetsen bladeren; Escape sluit.
  - Wordt onthouden in `uitleg` (`'spel8-spray'`); daarna nooit meer. Met *reduced motion* een stilstaand eindbeeld.
  - Verlaat Pino het spel terwijl de uitleg openstaat, dan gaat die mee dicht.
- **Level 5** is alleen met de spray te halen.

## Levels (besluit #117)
- Kaarten in `schaak-levels.js`, 8 strings van 8 tekens:
  `.` vak, `~` rivier, `B` boom, `b` bamboe, `R` rots, `S` stam, `T` tempel, `P` Pino, `D` dier (meer `D`'s = meer dieren van dezelfde soort).
- Pino begint altijd linksonder, de tempel staat rechtsboven.
- De kaarten zijn met een zoekprogramma gevonden. Ze worden gecontroleerd met de oplosser `losOp()` uit `schaak.js` (BFS over Pino, dier, stammen, spray en verwarring; sinds besluit 213 telt ook een beurt zonder handeling mee).

| Level | Dier | Minste beurten zonder spray | Bijzonder |
|---|---|---|---|
| 1 | 3 × python | 24 | lange omweg langs drie pionnen (besluit #122) |
| 2 | tijger | 13 (met spray 12) | één wissel met een stam; makkelijker gemaakt (besluit 217, was 19) |
| 3 | luiaard | 15 (was 17 zonder lege beurt) | twee wissels met dezelfde stam |
| 4 | leeuw | 16 (was 17 zonder lege beurt) | drie wissels |
| 5 | krokodil | onmogelijk (met spray 19) | drie stammen; spray en direct wisselen met de krokodil, die daarna achter de stammen vastzit |

## Staat
- In: `producten` (spray, besluit 63).
- In/uit: `uitleg` (lijst; `'spel8-spray'` = de uitleg na de eerste spray is gezien, besluit 215).
- In/uit: `levels` (`markeerLevelGehaald(n)`; gehaalde levels blijven gehaald).
- Bij **level 5 gehaald**:
  - `rondSpelAf(8, { score: { levels, gevangen } })`;
  - de beloning van dag 8 (`kalender.json`) brengt de behoefte "bordspellen" bij de eerste keer op 100 % (besluit #120 en #164).
- Het aantal keer gevangen telt per sessie (niet bewaard).

## Resultaatschermen (via `ui/resultaat.js`)
- **Level 1–4 gehaald**:
  - bol met de Pino-pion, label "SCHAKEN OP NIEUW NIVEAU · LEVEL n", titel "Level n!";
  - de rij van vijf stukken (gehaald in kleur, de rest 30 %);
  - tegels LEVELS `g/5` en GEVANGEN `n×`;
  - knoppen **Volgend level** (groen; nieuwe optie `verder` in `toonResultaat`) en "Nog een keer".
- **Level 5 gehaald** (zoals `Spel8-Klaar.png`, zonder ZETTEN):
  - titel "Schaakmat!", label "SCHAKEN OP NIEUW NIVEAU · KLAAR";
  - stukkenrij met de tempel, tegels LEVELS en GEVANGEN;
  - beloning Logica +3 · Techniek +1 · Creativiteit +1 (besluit 164);
  - knoppen "Terug naar de kalender" en "Nog een keer" (naar het leveloverzicht).
- **Gevangen**:
  - op het bord wordt Pino verdrietig (`s8-stuk-pino-sip`) en het dier blij (`-blij`); na 1,2 s volgt het resultaatscherm;
  - titel "Gevangen!", tafereel met beide stukken, tegel LEVEL `n`;
  - geen confetti en geen beloning;
  - "Nog een keer" = hetzelfde level.

## Besturing
- **Touch/muis**: tik op een opgelicht vak (stap) of een opgelichte stam (wissel), daarna op de sprayknop of de zandloper. De opnieuw-knop begint het level opnieuw.
- **Toetsenbord**:
  - pijltjes = stap in die richting, of wissel met de stam in die richting;
  - spatie/Enter = zandloper;
  - S = spray;
  - R = opnieuw (als de knop actief is).

## Geen uitleg
Er is geen tekst in het spel, behalve de kopbalk en de resultaatschermen. De zandloper, de spray en de opnieuw-knop zijn alleen een icoon. De vorm van het stuk is de enige hint over de beweging. De uitleg na de eerste spray (besluit 215) heeft alleen bewegende plaatjes en icoonknoppen.

## Toegankelijkheid
- **Leveloverzicht**: echte `<button>`s met `aria-label`s ("Level 2, gehaald" …).
- **Bord**: de scène heeft `role="img"` met een beschrijving. De klikvakken zijn `<button>`s met labels ("Stap omhoog", "Wissel met de stam naar rechts", "Wissel met het dier omhoog"). De zandloper, de spray en de opnieuw-knop ("Level opnieuw") hebben `aria-label`s.
- **`prefers-reduced-motion`**: geen animaties; stukken verspringen meteen en het denken duurt korter.

## Acceptatiecriteria
- [x] `node design/generators/spel8_levels_check.mjs` slaagt (level 1–4 zonder spray, level 5 alleen met spray).
- [x] Het leveloverzicht toont vinkjes en slotjes; een dicht level is niet te kiezen.
- [x] Opgelichte vakken en stammen; een stap en een wissel in één beurt.
- [x] De zandloper is ook zonder handeling actief; de dieren zetten dan gewoon (besluit 213; 22 november, 375×812).
- [x] De opnieuw-knop is grijs tot de eerste handeling of beurt, licht dan op en zet het level terug naar de beginstand (besluit 213; 22 november, 375×812).
- [x] Zandloper → wolkje met dof lampje → lampje aan → het dier zet volgens zijn stuk.
- [x] Gevangen → verdrietige Pino en blij dier → "Gevangen!" → opnieuw.
- [x] Met spray wordt het dier rood en boos en loopt het twee beurten in de war; zonder spray springt de spray met "!?" uit de knop omhoog (22 november, 375×812, geen consolefouten).
- [x] Level 1–5 zijn uit te spelen in de app; na level 5 volgt "Schaakmat!" met Logica +1 en de behoefte Bordspellen op 100 %.
- [x] Toetsenbord en touch werken; geen consolefouten; 390×844 en desktop.
- [x] De eerste echte spray opent de uitleg (twee pagina's, pijl, vinkje, vegen, pijltjestoetsen, Escape); daarna speelt het level verder en bij een volgende spray komt hij niet terug (besluit 215; 22 november, 375×812, geen consolefouten).
- [x] Level 2 (besluit 217): de levelcontrole slaagt (13 beurten zonder spray, 12 met), en de oplossing is in de app uitgespeeld met en zonder spray (23 november, 375×812, geen consolefouten).
- [ ] Beoordeeld door Benjamin.

## Test-URL's
- `/advent/?test=1#/spel/8`: het leveloverzicht.
- `/advent/?test=1&level=5&spray=1#/spel/8`: meteen level 5, met spray (`spray=0`: zonder).
- `window.pinoDebug.oplossing()` geeft de kortste oplossing; `window.pinoDebug.speelOplossing()` speelt die na in de app. `window.pinoDebug.uitleg()` toont de uitleg na de eerste spray opnieuw; zet `uitleg` in de staat leeg om hem weer echt na de eerste spray te zien.

## Open punten
- De preview `Spel8.png` laat nog de oude besturing zien; de artboards zijn niet opnieuw gegenereerd.
