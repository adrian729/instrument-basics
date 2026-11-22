# Instrument Basics

Fingering charts: every note of an instrument from the bottom to the top at written pitch, each with the standard fingering first and the alternatives under it (for tuning, soft or loud playing, response, or an easier passage). Each note is shown on the staff, with a diagram of the keys or valves and the same fingering in words, and what it sounds on a transposing instrument.

Live at https://adrian729.github.io/instrument-basics/.

The instruments, in the picker's groups:

- **Flutes**: the concert flute (B3, with a B foot, to F7) and the piccolo (D4 to D7, sounding an octave higher). Boehm-system, fingered alike for two octaves; the flute's foot joint keys shown in its diagrams.
- **Trumpets**: the B♭ trumpet and the C trumpet (written F♯3 to C6, fingered alike), and the four-valve piccolo trumpet in B♭ (written C♯3 to G5, its 4th valve shown).
- **Saxophones**: soprano, alto, tenor and baritone (written B♭3 to F♯6, and the baritone's low A), fingered alike. The altissimo is left out.

The picker is the instrument's group, from a list that can grow long, then its kind among the group's (each group comes back to the kind last chosen in it). The instrument is remembered, and in the address for a link to one (`?instrument=alto-sax`). Notes can be named with letters (with octave numbers) or in solfège, and the alternatives folded or shown.

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

- `src/notations/`: a notation per kind of instrument: how its fingerings are written in the data, drawn and said. `flute/` (the Boehm keys: `"B 123 G# | --- Eb"`), `valves/` (valved brass: `"13"`), `sax/` (`"T 12- | sBb ---"`); each explained at the top of its `notation.ts`, and each diagram following one convention (`notations/types.ts`).
- `src/data/`: the instruments. `types.ts` has what every notation's data shares; `flute.ts`, `piccolo.ts`, `trumpet.ts`, `piccolo-trumpet.ts` and `sax.ts` have every note and its fingerings (an instrument's own, or shared: the saxophones', the B♭ and C trumpets'); `flutes.ts`, `trumpets.ts` and `saxophones.ts` define each group's instruments (transposition, what to know, the footer's tip and credits) through `instrument.ts`; `instruments.ts` lists the groups. Checked when the tests run, so a typo fails them.
- `src/lib/notes.ts`: notes' names (letters or solfège), what's heard of a written note (from the transposition, in letters and semitones), and where a note sits on the staff.
- `src/lib/store.svelte.ts`: the switches' choices (instrument, names, alternatives), saved in the browser. `src/ui/SwitchBar.svelte` shows them; `src/views/controller.svelte.ts` makes the chart follow them.
- `src/views/`: the chart (`chart.ts`, made again when the instrument changes, its text too) and the staff (`staff.ts`), drawn as SVG.
- `src/views/glyphs.ts`: the clef, sharp, flat and whole note, as paths from Bravura (the SMuFL reference font), with its engraving defaults (the lines' thickness, the ledger lines' reach), made by `scripts/glyphs.py` (its docstring says how to run it).
- `src/styles.css`: the styles: ducktape-colors' colours and DM Mono, with a print layout.

### Adding an instrument

1. Its notation: one of `src/notations/`, or a new one implementing `Notation` (a horn's thumb valve would be a token added to `valves/`).
2. Its data: a file of registers in that notation (or the one it shares), from a source to credit.
3. Its definition, in its group's file (or a new group, added to `instruments.ts`): id (a permanent URL), name, kind, transposition, clef (only treble is drawn yet; a bass-clef instrument needs `staff.ts` to learn it), options for its diagram, what to know, tip.
4. Its id in `InstrumentId` (`instrument.ts`), its range in the data test, and a screenshot.

## Sources

- **Flutes**: [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/flute/), the comments adapted: its flute pages ([first octave](https://www.wfg.woodwind.org/flute/fl_alt_1.html), [second](https://www.wfg.woodwind.org/flute/fl_alt_2.html), [third](https://www.wfg.woodwind.org/flute/fl_alt_3.html), [fourth](https://www.wfg.woodwind.org/flute/fl_alt_4.html)) and piccolo pages ([first octave](https://www.wfg.woodwind.org/flute/picc_alt_1.html), [second](https://www.wfg.woodwind.org/flute/picc_alt_2.html), [third](https://www.wfg.woodwind.org/flute/picc_alt_3.html)). Left out: fingerings that need a half-covered hole or the C♯ trill key some flutes have, those meant for the bass or alto flute, many of the flute's fast-slur fingerings, and the piccolo's that close its end with the right little finger. Where the keys sit in the diagrams follows the guide's labelled photos ([flute](https://www.wfg.woodwind.org/flute/fl_fing.html)).
- **Trumpets**: [Yamaha's trumpet fingering chart](https://www.yamaha.com/en/musical_instrument_guide/common/images/trumpet/fingering.pdf), standard and alternatives; the tuning advice, the standard range and the 4th valve from Wikipedia's [Trumpet](https://en.wikipedia.org/wiki/Trumpet), the piccolo trumpet's range from its [Piccolo trumpet](https://en.wikipedia.org/wiki/Piccolo_trumpet) (Herbert, Myers and Wallace). The piccolo trumpet's low 4th-valve fingerings are the valves' arithmetic, checked by a test (every fingering a harmonic of the open horn).
- **Saxophones**: [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/sax/)'s saxophone pages, the comments adapted: basic ([first octave](https://www.wfg.woodwind.org/sax/sax_bas_1.html), [second](https://www.wfg.woodwind.org/sax/sax_bas_2.html)) and alternate ([first octave](https://www.wfg.woodwind.org/sax/sax_alt_1.html), [second](https://www.wfg.woodwind.org/sax/sax_alt_2.html), [lower altissimo](https://www.wfg.woodwind.org/sax/sax_alt_4.html)). Left out: the altissimo above F♯6, and the guide's alternatives given without a reason.

DM Mono (`public/fonts/`) and Bravura (the paths in `src/views/glyphs.ts`) are under the SIL Open Font License (`public/fonts/OFL.txt`, `scripts/OFL-Bravura.txt`).
