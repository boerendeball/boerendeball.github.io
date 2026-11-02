# Artboards

De originele schermen uit het ontwerpcanvas ("Pino's Adventkalender", Design-artifact in Claude). Elk `.dc.html` is een zelfstandige HTML-pagina met inline SVG; `canvas.json` is de index met de maat van elk artboard.

Gebruik ze als exacte referentie voor markup, maten, kleuren en teksten. Wat niet in de app hoort:
- de `<script src="./support.js">`-regel, de `<x-dc>`/`<helmet>`-wrappers en het `<script type="text/x-dc">`-blok onderaan (die horen bij de ontwerptool);
- `{{placeholders}}` zoals `{{film}}`, `{{zetten}}`, `{{portemonnee}}`: dat zijn de waarden uit de spelstand.

Een render van elk artboard staat in `../previews/`.
