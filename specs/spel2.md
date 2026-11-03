# Spel 2 · Tuin van de koningin

**Status:** aanzet · Dag 2 · 25 november · vaardigheid Logica · rendering: SVG-DOM
Previews: `Spel2.png`, `Spel2-Menu.png`, `Spel2-Edelsteen.png`, `Spel2-Klaar.png`, `Spel2-Sprites.png` · Generator: `spel2_build2.py`, `spel2_sprites.py`
Sprites nieuw: `hx-gras hx-tegel hx-doel hx-fontein hx-uitgang m-kraan vijver banaan gem` (+ motieven en Pino uit spel 1)

## Bekend uit het ontwerp
- Hexagonaal grasraster 6×14 in een tropische tuin (lotusvijver, sala, bananenplanten). Het pad naar de tuinpoort ontbreekt nog.
- Tik op het volgende vak (vraagteken) → **taartmenu** met tegelkeuze: kleur + figuur, met aantal-badges uit `staat.tegels`.
- Tegels moeten matchen (regel zelf te ontdekken; exact vast te leggen bij de bouw, voorstel: aangrenzende tegels delen kleur óf figuur).
- Eén willekeurige tegel is een fontein. Een leeg vak dat aan alle zes kanten door gelegde tegels is omringd → edelsteen naar keuze (taartmenu blauw/groen/geel) → `voegEdelsteenToe`.
- De verstopte werker staat linksboven in de tuin; pas aanklikbaar na ontgrendeling van spel 7 (`staat.werkers[2]`).
- Tellers: edelstenen (gem + getal per kleur) in de kopbalk.

## Staat
In: `tegels` (uit spel 1). Uit: `edelstenen`, `rondSpelAf(2, { vaardigheid: 'logica' })`.

## Uit te werken
Exacte matchregel en wat er gebeurt bij een fout; wat als de tegels op zijn; pad-doel en einde; hex-coördinaten en klikdoelen (SVG `<polygon>` per vak); logica in `spellen/hex.js` zonder DOM; resultaatscherm.
