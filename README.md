# Ducktape Piccolo

A fingering chart for the Boehm piccolo: every note from its lowest D to the D three octaves up, at written pitch, each with the standard fingering first and the alternatives under it (for tuning, soft or loud playing, and response). Each note is shown on the treble staff, with a diagram of the keys and the same fingering in words. Notes can be named with letters (with octave numbers) or in solfège, and the alternatives folded, shown or left out.

A piccolo has no foot joint, so nothing here uses the flute's low C♯, C or B keys. The first two octaves are fingered as on the flute; the third differs on a few notes (F♯ and G♯ have piccolo fingerings of their own).

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

- `src/data/fingerings.ts`: the chart's data, every note and its fingerings, in a short notation explained at the top of the file (`"B 123 G# | --- Eb"`: the B thumb key, the three left fingers, the G♯ key and the E♭ key). Checked when the tests run, so a typo fails them.
- `src/lib/notes.ts`: notes' names (letters or solfège), the sounding pitch, where a note sits on the staff, and a fingering in words.
- `src/lib/store.svelte.ts`: the switches' choices, saved in the browser. `src/ui/SwitchBar.svelte` shows them; `src/views/controller.svelte.ts` makes the chart follow them.
- `src/views/`: the chart (`chart.ts`), drawn as SVG: the key diagram (`keys.ts`) and the staff (`staff.ts`).
- `src/views/glyphs.ts`: the clef, sharp, flat and whole note, as paths from Noto Music, made by `scripts/glyphs.py` (its docstring says how to run it).
- `src/styles.css`: the styles, Ducktape's colours and DM Mono, with a print layout.

## Sources

The fingerings and their comments are from the piccolo pages of [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/flute/) ([first octave](https://www.wfg.woodwind.org/flute/picc_alt_1.html), [second](https://www.wfg.woodwind.org/flute/picc_alt_2.html), [third](https://www.wfg.woodwind.org/flute/picc_alt_3.html)), the comments adapted. Its fingerings that close the end of the instrument with the right little finger are left out.

DM Mono (`public/fonts/`) and Noto Music (the paths in `src/views/glyphs.ts`) are under the SIL Open Font License (`public/fonts/OFL.txt`, `scripts/OFL-NotoMusic.txt`).
