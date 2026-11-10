# Spel 3 · Complete the family

**Status:** gebouwd, te beoordelen (`advent/js/spellen/spel3.js`, gegevens en regels in `advent/js/spellen/familie.js`; gedeeld: `ui/edelstenen.js`, `ui/resultaat.js`, `css/spel.css`)
**Dag 3 · 26 november · vaardigheid Creativiteit**
Previews: `design/previews/Spel3.png`, `Spel3-Klaar.png`, `Spel3-Sprites.png` · Artboards: `design/artboards/Spel3*.dc.html` · Generator: `design/generators/spel3_build2.py`, `spel3_sprites.py`
Rendering: **SVG-DOM** (kalm spel). Sprites: `b-lijf b-jurk b-hoofd b-blij b-bedroefd bh-* acc-* d-lam d-gansje d-biggetje huis-villa huis-paal huis-shop plek` + `gem` (spel 2) + `werker` (spel 4). Nieuw voor dit spel: `b-bedroefd` (besluit 40).

## Doel en gevoel

Drie families staan bedroefd voor hun huis: er ontbreekt iemand. Met de edelstenen uit spel 2 koopt Pino karakterkaarten. Elke kaart hoort bij één vaste familie; bij het kopen springt het karakter met sterretjes op de lege plek, en zodra een familie compleet is, kijkt iedereen weer blij. Er is niets fout te doen: de puzzel zit in het verzamelen van genoeg edelstenen van de juiste kleur (terug naar de tuin van spel 2) en in het ontdekken wie bij wie hoort. De familie die als eerste compleet is, gaat zonder aankondiging mee op vakantie in spel 4.

## Scherm (390×844, van boven naar beneden)

1. **Kopbalk** (`ui/kopbalk.js`): terugknop → `#/deur/3`, label `DAG 3 · 26 NOVEMBER`, titel, rechts de **edelsteenpil** (`ui/edelstenen.js`): drie keer `gem` (20 px) + getal in `#0E6A98` / `#1F7A3A` / `#9A5B00`, `role="img"` + `aria-label`, live via `staat.abonneer`.
2. **Drie familiescènes** onder elkaar, gap 10: elk een SVG 358×150 (`.familie`, radius 18, schaduw `0 5px 0 0 #CDE4F0`), `role="img"` + `aria-label`. Geen naamlabel (besluit 39).
3. **Kaartenbak** onderin (`.kaart.kaartenbak`, `margin-top: auto`, padding 12): raster van vier kolommen, gap 8, met `<button class="kaartje">`: karakter (SVG 60×65, viewBox 0 0 48 52) en een prijspil (`gem` 16 px per steen). Geen kop "Karakterkaarten", geen namen.

Op desktop staat het scherm 390 px breed gecentreerd, zoals spel 1 en 2.

## Scène per familie (viewBox 0 0 358 150, uit `spel3_build2.py`)

Lagen: lucht (rect 358×150) → grond (y 104, h 46) + randje `rgba(0,0,0,0.08)` → (Nguyễn) werker → huis (`huis-*` op 186,4, 160×110) → leden → plekken.

| Familie | Huis | Lucht / grond | Vaste leden | Plek → karakter |
|---|---|---|---|---|
| Nguyễn | `huis-villa` | `#DDF1FB` / `#8BD35A` | moeder (jurk `#9B6BFF`, knot, ketting) op 14,66; vader (`#1E3A4C`, kort, hoed) op 62,66 | (112,100) meisje · (156,100) gansje |
| Tan | `huis-paal` | `#BFE6FA` / `#9ADB7A` | moeder (jurk `#C43B38`, lang, nón lá); vader (`#39D353`, pet); dochtertje (kind, jurk `#5BC0EB`, rijsthoedje) op 110,86 | (146,100) biggetje |
| Somchai | `huis-shop` | `#FFE0EE` / `#D9B27C` | moeder (jurk `#FF6FAE`, huid `#C98B5A`, knot, bril); vader (`#1FA3DC`, stekels); zoontje (kind, `#FFC93C`) op 110,86 | (150,100) lammetje |

- Het gekochte meisje staat bij Nguyễn als kind-persoon op (110,86), in hetzelfde uiterlijk als op de kaart (jurk `#5BC0EB`, blond lang haar). Dieren staan op de plek zelf (48×40).
- Leden kijken met `b-bedroefd`; is de familie compleet, dan `b-blij` (besluit 40). Dieren hebben geen gezicht om te wisselen.
- De werker (`wk-kwast`, 48×72 × 0,62, gespiegeld zodat de kwast zichtbaar is; besluit 108) staat met zijn voeten op (198,110) half achter de villa: vóór het huis getekend maar achter de hoek van de voorgevel.

## Regels

- Vier vaste kaarten, altijd dezelfde, in deze volgorde (besluit 38): lammetje `{groen:2}`, gansje `{geel:1}`, meisje `{geel:1, blauw:1}`, biggetje `{blauw:1, geel:1}`. Samen 2 blauw, 2 groen, 3 geel.
- Vaste koppeling: meisje + gansje → Nguyễn, biggetje → Tan, lammetje → Somchai.
- Eén tik op een betaalbare kaart koopt hem meteen: edelstenen eraf, de kaart verdwijnt (de kolom blijft leeg), het karakter verschijnt met een pop en sterretjes op zijn plek.
- Niet betaalbaar: kaart op 45 % dekking, `aria-disabled`; een tik laat hem kort schudden, verder niets.
- Is een familie compleet: gezichten naar blij met een hupje. Is `staat.familie` nog leeg, dan wordt dit het gezin van spel 4 (besluit 41).
- Zijn alle vier de kaarten gekocht: na een korte pauze het resultaatscherm. Het spel is pas dan af.
- Voortgang (`staat.karakters`) blijft bewaard, ook na het afronden. Wie spel 3 later opent, ziet alle families compleet en blij en een lege bak.
- Te weinig edelstenen: terug naar spel 2 voor een nieuwe tuin (zie besluit 37). Spel 3 zegt daar niets over.

Tuning (bovenin `spel3.js`): `POP_DUUR` 520 ms, `HUP_VERTRAGING` 420 ms, `EIND_PAUZE` 1100 ms.

## Besturing

- Touch/muis: tikken op een kaart. Toetsenbord: Tab naar een kaart, Enter of spatie koopt.
- Werker: tikken (alleen als deurtje 7 open is).

## Staat

- In: `edelstenen`, `karakters`, `familie`.
- Uit: `karakters` (`staat.koopKarakter`), `edelstenen`, `familie` (`staat.zetFamilie`, alleen bij de eerste complete familie), `werkers[3]`, en bij afronden `rondSpelAf(3, { vaardigheid: 'creativiteit', score: { over } })`.

## Resultaatscherm

Icoon `familie`, label `COMPLETE THE FAMILY · KLAAR`, titel "Iedereen is weer thuis!", zin "Drie huizen, drie families en niemand die nog iets mist. Zelfs het biggetje knort tevreden.", geen scoretegels, beloning Creativiteit +1 en "Verjaardag" +10 %. Geen sterren, geen GEKOPPELD/FOUT, geen EDELSTENEN OVER, geen "Nog een keer" (besluit 42). Het aantal overgebleven edelstenen wordt wel als `score.over` bewaard.

## Geen uitleg

Weggelaten uit het artboard: de familienamen op de scènes, de kop "Karakterkaarten", de namen onder de kaarten, de geselecteerde-kaartstaat, `plek-actief` (er is geen "aan de beurt"), de sterren en de zin "Familie Tan is compleet en nodigt Pino uit op vakantie" op het resultaatscherm.

## Toegankelijkheid

- Familiescènes `role="img"` met een beschrijving die de stand noemt (bedroefd / blij, aantal lege plekken), zonder de familienaam.
- Kaarten zijn `<button>` met `aria-label` (bv. "Lammetje, twee groene edelstenen"); onbetaalbaar = `aria-disabled="true"`.
- `prefers-reduced-motion`: geen pop, sterretjes, schud of hup; de stand wisselt direct.

## Acceptatiecriteria

- [ ] Beginstand: zes volwassenen en twee kinderen kijken bedroefd; vier vraagteken-plekken; vier kaarten met prijzen; geen tekst behalve kopbalk.
- [ ] Zonder edelstenen zijn alle kaarten dof en schudden ze bij een tik.
- [ ] Kopen trekt de juiste edelstenen af (pil werkt live bij), de kaart verdwijnt, het karakter verschijnt met sterretjes bij de juiste familie.
- [ ] Een complete familie kijkt blij en hupt; de eerste complete familie komt in `staat.familie`.
- [ ] Na de vierde kaart: resultaatscherm zonder scoretegels, met Creativiteit +1, zonder "Nog een keer".
- [ ] Herladen halverwege behoudt de gekochte karakters; na afronden blijft alles compleet.
- [ ] Werker alleen aanklikbaar als deurtje 7 open is; aantikken zet `werkers[3]`.
- [x] Vanuit spel 7 (`#/spel/3?zoek=1`): na de vondst terug naar het album van spel 7 (besluit 101).
- [ ] Spel 4 zonder complete familie toont de popup met de bedroefde Nguyễns (zie `spel4.md`).
- [ ] Toetsenbord en reduced motion werken.

## Test-URL's

- `?test=1&reset=1#/spel/3` — zonder edelstenen.
- `?test=1&reset=1&vul=1#/spel/3` — 3/3/3 edelstenen (genoeg voor alles; let op: `vul` zet `familie` al op `tan`).
- `?test=1&dag=7#/spel/3` — werker aanklikbaar.
- `?test=1&reset=1#/spel/4` — popup "nog geen familie".

## Open punten

Geen.
