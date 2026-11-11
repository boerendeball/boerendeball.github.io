# Sprites

Alle tekeningen uit het ontwerp als SVG `<symbol>`-elementen, gegenereerd uit `design/generators/spel{n}_sprites.py`.

- `sprites.svg` — alle 265 symbolen van spel 1 t/m 10 in één bestand. Plaats de inhoud inline in de pagina (of laad het bestand en injecteer het in de DOM) en gebruik `<use href="#id">`. Externe `<use href="sprites.svg#id">` werkt ook voor symbolen zonder `currentColor`, maar kleurvarianten via `color="…"` zijn alleen betrouwbaar als de symbolen in hetzelfde document staan.
- `spel{n}.svg` — alleen de symbolen die in spel n zijn geïntroduceerd. Spel n gebruikt ook symbolen uit eerdere spellen (bijvoorbeeld `persoon`-onderdelen uit spel 3, `werker` en `s4-munt` uit spel 4). Wil je per pagina alleen laden wat nodig is, neem dan spel 1..n.
- `symbolen.json` — index: per spel de lijst symbool-id's.

## Conventies
- Kleurvarianten via `currentColor`: `<use href="#b-lijf" color="#39D353">`. Zonder `color` valt de kleur terug op de CSS-`color` van de pagina (`#1E3A4C`).
- Maten (viewBox): persoon 48×72 (kind ×0,72), Pino 48×72, dier 48×40, huis 160×110, hex 56×66, polaroid 120×140, schaakstuk 48×60, bordvak 36×36, iconen 48×48.
- Symbolen met `overflow="visible"` (grijparm, duwende armen, hoge hoed, nón lá, Pino met kroon en wijsvinger) steken buiten hun viewBox uit; geef ze geen `overflow: hidden`.
- Samenstelling van personages (volgorde!): lijf of jurk → `b-handen` (kleur = huid) → hoofd → haar → gezicht → accessoires. Pino: `p-basis` → pose-symbool (`pino-staan`, `pino-loop`, `pino-vinger`, `pino-foto`, `pino-duw`) dat de armen en voeten toevoegt. Voor een arm die over iets anders heen moet (spel 1, vinger in de mond): `pino-romp` (basis + voeten, geen armen) + `pino-arm-links`/`pino-arm-rechts` (hangend, 48×72-frame) + `pino-arm-vinger` (40×10, schouder op 4,5, horizontaal naar rechts; draaien en rekken om de schouder). Wie iets draagt: armloos lijf (`b-lijf-los`/`p-basis`) → voorwerp → `s9-armen-om` (kleding) → `s9-handen-om` (huid). Lakendrager: `b-lijf-los` → hoofd → `s9-laken` → `s9-armen-laken` (kleding) → `s9-handen-laken` (huid).
- Tekenvolgorde in een scène: van achter naar voor; op een bord rij voor rij.

De Python-functies in `design/generators/*_sprites.py` (`persoon()`, `pino()`, `dier()`, `kraam()`, `polaroid()`, `stuk()`, `man_laken()`, …) laten zien hoe de symbolen gecombineerd en gepositioneerd worden; dat zijn de bouwstenen voor de app.
