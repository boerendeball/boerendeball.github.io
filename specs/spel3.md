# Spel 3 · Complete the family

**Status:** aanzet · Dag 3 · 26 november · vaardigheid Creativiteit · rendering: SVG-DOM
Previews: `Spel3.png`, `Spel3-Klaar.png`, `Spel3-Sprites.png` · Generator: `spel3_build2.py`, `spel3_sprites.py`
Sprites nieuw: persoon-onderdelen (`b-lijf b-jurk b-hoofd b-blij bh-* acc-*`), dieren `d-lam d-gansje d-biggetje`, huizen `huis-villa huis-paal huis-shop`, `plek plek-actief`

## Bekend uit het ontwerp
- Drie families als scènes met huis: Nguyễn (Thaise villa, rijk), Tan (paalwoning bij rijstvelden, nón lá op moeder), Somchai (shophouse). Lege plekken = vraagteken-cirkels.
- Koop met edelstenen karakterkaarten (lammetje, gansje, jongetje, meisje, biggetje; per ronde 4 van de 5 te koop) en koppel ze aan een familie. Ontwerpprijzen: lam groen+groen, gansje geel, meisje geel+blauw, biggetje blauw+geel (nog af te stemmen).
- De familie die compleet wordt, is zonder aankondiging het gezin van spel 4 (`zetFamilie`).
- Werker half achter de villa.

## Staat
In: `edelstenen`. Uit: `familie`, `betaalEdelstenen`, `rondSpelAf(3, { vaardigheid: 'creativiteit' })`.

## Uit te werken
Prijzen (open punt Benjamin), rondes, wat "compleet" betekent per familie, wat bij te weinig edelstenen (zodat spel 4 altijd een familie heeft), resultaatscherm.
