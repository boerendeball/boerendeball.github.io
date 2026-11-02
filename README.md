# Pino's Adventkalender

Een interactieve adventkalender die aftelt naar Pino's verjaardag op 3 december: tien deurtjes (24 november t/m 3 december), achter elk deurtje een klein spel in oude-Sims-sfeer. Gebouwd als statische GitHub Pages-site op `boerendeball.github.io`.

**Status:** ontwerp af, implementatie nog niet begonnen. Deze repo bevat nu de ontwerpkeuzes, alle schermen als preview, alle sprites als SVG en de werkafspraken voor Claude Code (`CLAUDE.md`).

## Structuur

```
CLAUDE.md                    werkafspraken en conventies (lees dit eerst)
assets/sprites/              alle sprites als SVG <symbol>s (sprites.svg = alles; spel{n}.svg per spel)
design/spellen-per-dag.md    de tien spellen en hun regels
design/ontwerpkeuzes.md      stijl, palet, decor, Sims-elementen
design/economie-en-spelstaat.md   wat van spel naar spel wordt doorgegeven (localStorage)
design/previews/             screenshot van elk ontworpen scherm
design/artboards/            originele artboards uit het ontwerpcanvas (referentie)
design/generators/           Python-scripts die sprites en artboards genereren
index.html                   tijdelijke placeholderpagina
```
