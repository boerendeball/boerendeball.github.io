# Pino's Adventkalender

Een interactieve adventkalender die aftelt naar Pino's verjaardag op 3 december: tien deurtjes (24 november t/m 3 december), achter elk deurtje een klein spel in oude-Sims-sfeer. Gebouwd als statische GitHub Pages-site op `boerendeball.github.io`.

**Status:** ontwerp af, implementatie begonnen. Technische basis: vanilla HTML/CSS/JS met ES-modules, geen framework of build-stap; de kalender-app staat onder `/advent/`. Lokaal draaien: `npx serve .` en open `http://localhost:3000/advent/?test=1`.

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
index.html                   voorpagina met link naar de kalender
advent/                      de kalender-app (index.html, css/, js/, data/)
404.html, .nojekyll          GitHub Pages: hash-routes terugsturen, Jekyll uit
```
