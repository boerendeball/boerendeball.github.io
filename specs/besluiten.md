# Beslislog en open vragen

Keuzes die niet (eenduidig) in het ontwerp staan. **Te bevestigen** = door mij gekozen, Benjamin mag het terugdraaien. Datum = wanneer gekozen.

| # | Datum | Onderwerp | Keuze | Status |
|---|---|---|---|---|
| 1 | 2026-11-02 | Stack | Vanilla ES-modules, geen framework/bundler/packages; actiespellen op canvas | besloten (Benjamin) |
| 2 | 2026-11-02 | URL | Kalender onder `/advent/` met hash-routes | besloten (Benjamin) |
| 3 | 2026-11-02 | Onderbalk Main (Kalender/Stickers/Over) | Weggelaten: stickerboek is geschrapt, twee tabs zijn geen tabbalk | te bevestigen |
| 4 | 2026-11-02 | "Gluren…" | Opent het Open-scherm (spelinfo + briefje); "Open deurtje" start direct het laadscherm; op een dicht deurtje leiden alle opties naar de gans | te bevestigen |
| 5 | 2026-11-02 | Vaardigheidslabels | Artboard-labels Techniek en Conditie (documenten zeggen Mechanica en Lichaam); sleutels `mechanica`/`lichaam` | te bevestigen |
| 6 | 2026-11-02 | Open-scherm teksten | Korte, niet-verklappende omschrijving + chips (soort, duur) per dag in `kalender.json`; dag 4 letterlijk uit het ontwerp | te bevestigen / aan te passen |
| 7 | 2026-11-02 | Beginwaarden behoeften | Uit de Main-preview: verjaardag 0, gansjes/lammetjes/snoepjes 100, jiujitsu 45, bordspellen 20, reizen 10, sieraden 15 | te bevestigen |
| 8 | 2026-11-02 | Telefoon | Eén keer per dag, zowel bij "Later" als "Opnemen" | te bevestigen |
| 9 | 2026-11-02 | Vaardigheid bij herspelen | Alleen de eerste afronding van een dag geeft +1 vaardigheid en +10 % verjaardag; herspelen telt alleen voor score/keten | te bevestigen |
| 10 | 2026-11-02 | Spel 1: tegels bij herspelen | Elke gelukte onderbreking geeft een tegel, ook bij herspelen (helpt in spel 2; geen straf voor oefenen) | te bevestigen |
| 11 | 2026-11-02 | Spel 1: speelduur | 60 s (artboard rekent met 90 s voor de balk) | te bevestigen |
| 12 | 2026-11-02 | Spel 1: sterren | ~~3: ≥ 10 onderbroken en ≤ 2 gemist · 2: ≥ 6 onderbroken · 1: anders~~ | vervallen (zie 16) |
| 13 | 2026-11-02 | Spel 1: tijdlabel | Klok-icoon in plaats van het woord "TIJD" (regel "geen labels bij tellers") | besloten (CLAUDE.md) |
| 14 | 2026-11-03 | Spel 1: gaap-ring | Geen aflopend ringetje of balk met de resterende gaaptijd boven het bed; alleen het gapende gezicht | besloten (Benjamin) |
| 15 | 2026-11-03 | Resultaatschermen: geen highscore | Geen enkel spel houdt een highscore bij; `staat.scores[dag]` bevat alleen de laatste uitslag. Spel 1 toont alleen de tegel ONDERBROKEN (geen GEMIST, geen HIGHSCORE) | besloten (Benjamin) |
| 16 | 2026-11-03 | Resultaatschermen: geen sterren | Geen enkel spel toont sterren als score; `toonResultaat` kent geen `sterren` meer. De slotzin mag wel variëren met de uitslag (spel 1: grens bij 6 onderbroken) | besloten (Benjamin) |
| 17 | 2026-11-03 | Spel 1: bereik-indicatie | Een gapend kind dat Pino kan onderbreken licht subtiel op (witte tint 22 % over alleen het kind: hoofd, haar, gezicht; bed en deken niet; als een hover op een UI-element). Geen tekst, geen pijl, geen ring | besloten (Benjamin) |
| 18 | 2026-11-03 | Spel 1: dekenflits | Bij een geslaagde onderbreking wordt de deken van dat bed kort donkerder (30 %) en loopt in 0,4 s terug naar de eigen kleur | besloten (Benjamin) |
| 19 | 2026-11-03 | Spel 1: geen kroontjes | Er worden geen kroontjes verzameld; de kroon-score-pil uit het artboard vervalt. Wat wél wordt verzameld zijn de negen **tokens** voor spel 2 (blauw/geel/groen × vlinder/boom/vogel, één per onderbroken kind, naar de deken van dat bed). Ze zijn nergens in de interface te zien en leven alleen in `staat.tegels` (de code noemt ze tegels) | besloten (Benjamin) |
| 20 | 2026-11-03 | Spel 1: geen +1-ballon | De groene +1-ballon boven het bed na een onderbreking vervalt; feedback is alleen het verraste gezicht en de dekenflits | besloten (Benjamin) |
| 21 | 2026-11-03 | Spel 1: losse armen en zijkant | Pino's armen zijn losse sprites (`pino-romp`, `pino-arm-links`, `pino-arm-rechts`, `pino-arm-vinger`). Bij het onderbreken wijst de arm aan de kant van het kind, om de schouder gedraaid naar de mond, en wordt over bed en kind heen getekend. Daarom mag Pino alleen onderbreken als ze links of rechts naast het bed staat, niet erboven of eronder | besloten (Benjamin) |

## Open vragen voor Benjamin (uit de ontwerpdocumenten)

- Definitieve speltitels per dag.
- "Briefje voor Pino" per dag (nu placeholder) en het laatste briefje in de finale.
- Vaardigheidspunt voor dag 5 (nu Charisma) en dag 10 (nu geen).
- Edelsteenprijzen in spel 3; welke familie "rijk" is en hoeveel elke familie in spel 4 betaalt.
- Welke behoefte elk spel vult naast "Verjaardag vieren" (voorstel: 6 → jiujitsu, 8 → bordspellen, 2–8 → reizen, 5 → sieraden, 3/9 → lammetjes/gansjes).
