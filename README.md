# Flute Basics

Fingering charts for the Boehm concert flute and piccolo: every note from the bottom to the top at written pitch (the flute from the foot joint's low B to F7, the piccolo from its low D to D7), each with the standard fingering first and the alternatives under it (for tuning, soft or loud playing, response and slurs). Each note is shown on the treble staff, with a diagram of the keys and the same fingering in words. A switch picks the instrument (remembered, and in the address as `?instrument=piccolo` for a link to one); notes can be named with letters (with octave numbers) or in solfège, and the alternatives folded, shown or left out.

The two are fingered alike for the first two octaves. The flute has a foot joint (low C♯ and C, and low B and the gizmo key on a B foot) and sounds as written; the piccolo has none and sounds an octave higher, and its third octave differs on a few notes (F♯ and G♯ have piccolo fingerings of their own).

## Run locally

It's built with Vite, TypeScript and Svelte (Node 24, pnpm):

```sh
pnpm install
pnpm dev          # http://localhost:5174, reloading as files change
pnpm build        # the site, in dist/
pnpm preview      # dist/, at http://localhost:8899
pnpm test         # the types (tsc, svelte-check), then the Playwright tests
```

The tests build the site and serve it on port 8899, then check its data, its behaviour and its looks (screenshots in `tests/screenshots/`, taken with Chrome on macOS; `pnpm test:update` retakes them after a change meant to change them). Pushing to `main` publishes the site to GitHub Pages (`.github/workflows/pages.yml`; the repo's Pages source must be "GitHub Actions").

## Code

- `src/data/`: the chart's data. `fingerings.ts` has the types and the short notation the fingerings are written in, explained at the top of the file (`"B 123 G# | --- Eb"`: the B thumb key, the three left fingers, the G♯ key and the E♭ key); `flute.ts` and `piccolo.ts` have every note and its fingerings; `instruments.ts` lists the two. Checked when the tests run, so a typo fails them.
- `src/lib/notes.ts`: notes' names (letters or solfège), what's heard, where a note sits on the staff, and a fingering in words.
- `src/lib/store.svelte.ts`: the switches' choices (instrument, names, alternatives), saved in the browser. `src/ui/SwitchBar.svelte` shows them; `src/views/controller.svelte.ts` makes the chart follow them.
- `src/views/`: the chart (`chart.ts`, made again when the instrument changes), drawn as SVG: the key diagram (`keys.ts`, the keys placed as in the guide's labelled photos) and the staff (`staff.ts`).
- `src/views/glyphs.ts`: the clef, sharp, flat and whole note, as paths from Bravura (the SMuFL reference font), with its engraving defaults (the lines' thickness, the ledger lines' reach), made by `scripts/glyphs.py` (its docstring says how to run it).
- `src/styles.css`: the styles: ducktape-colors' colours and DM Mono, with a print layout.

## Sources

The fingerings and their comments are from [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/flute/), the comments adapted: its flute pages ([first octave](https://www.wfg.woodwind.org/flute/fl_alt_1.html), [second](https://www.wfg.woodwind.org/flute/fl_alt_2.html), [third](https://www.wfg.woodwind.org/flute/fl_alt_3.html), [fourth](https://www.wfg.woodwind.org/flute/fl_alt_4.html)) and piccolo pages ([first octave](https://www.wfg.woodwind.org/flute/picc_alt_1.html), [second](https://www.wfg.woodwind.org/flute/picc_alt_2.html), [third](https://www.wfg.woodwind.org/flute/picc_alt_3.html)). Left out: fingerings that need a half-covered hole or the C♯ trill key some flutes have, those meant for the bass or alto flute, many of the flute's fast-slur fingerings, and the piccolo's that close its end with the right little finger. Where the keys sit in the diagrams follows the guide's labelled photos of the two ([flute](https://www.wfg.woodwind.org/flute/fl_fing.html)).

DM Mono (`public/fonts/`) and Bravura (the paths in `src/views/glyphs.ts`) are under the SIL Open Font License (`public/fonts/OFL.txt`, `scripts/OFL-Bravura.txt`).
