# Instrument Basics

Fingering charts for woodwinds and brass: every note of an instrument's usual range, from the lowest up, at written pitch, each with the standard fingering first and a choice of alternatives under it (for tuning, soft or loud playing, response, or an easier passage). Each note is shown on the staff, with a diagram of the keys or valves and the same fingering in words, and what it sounds on a transposing instrument.

Live at https://adrian729.github.io/instrument-basics/.

The instruments, in the picker's sections and groups:

- Woodwinds
  - **Flutes**: the concert flute (B3, with a B foot, to F7) and the piccolo (D4 to D7, sounding an octave higher). Boehm-system, fingered alike for two octaves; the flute's foot joint keys shown in its diagrams.
  - **Clarinets**: the E♭, B♭, A and bass clarinets (written E3 to G6; the bass clarinet's from low C3), Boehm-system, fingered alike but for the bass clarinet's lowest keys and its altissimo's half-hole. The upper altissimo is left out.
  - **Saxophones**: soprano, alto, tenor and baritone (written B♭3 to F♯6, and the baritone's low A), fingered alike. The altissimo is left out.
- Brass (every one in treble clef, and every three-valve one fingered like the trumpet, from the same chart)
  - **Trumpets**: the B♭ trumpet and the C trumpet (written F♯3 to C6), and the four-valve piccolo trumpet in B♭ (written C♯3 to G5, its 4th valve shown).
  - **Cornet and flugelhorn**, both in B♭ (written F♯3 to C6).
  - **Mellophone and tenor horn**: the mellophone in F and the tenor horn (the alto horn, in the US) in E♭ (written F♯3 to C6).
  - **Euphonium and baritone**, in B♭ treble clef, as brass bands read them: the four-valve euphonium (written C♯3 to E6, compensating) and the three-valve baritone horn (written F♯3 to C6).

The picker is the instrument's group, from a list in sections that can grow long, then its kind among the group's (each group comes back to the kind last chosen in it). The instrument is remembered, and in the address for a link to one (`?instrument=alto-sax`). Notes can be named with letters (with octave numbers) or in solfège, and the alternatives folded or shown.

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

- `src/notations/`: a notation per kind of instrument: how its fingerings are written in the data, drawn and said. `flute/` (the Boehm flute's keys: `"B 123 G# | --- Eb"`), `clarinet/` (the Boehm clarinet's: `"T R 123 E | 123"`), `sax/` (`"T 12- | sBb ---"`), `valves/` (valved brass: `"13"`); each explained at the top of its `notation.ts`, and each diagram following one convention (`notations/types.ts`).
- `src/data/`: the instruments, by section. `types.ts` has what every notation's data shares, `instrument.ts` what an instrument and a group are, `instruments.ts` lists the groups in their sections. `woodwinds/` and `brass/` have a file per group (`flutes.ts`, `clarinets.ts`, `saxophones.ts`, `trumpets.ts`, `cornets.ts`, `alto-horns.ts`, `euphoniums.ts`: each instrument's transposition, what to know, the footer's tip and credits) and the charts they read: every note and its fingerings, an instrument's own or shared (`flute.ts`, `piccolo.ts`, `clarinet.ts` for every clarinet, `sax.ts` for every saxophone; `three-valves.ts` for every three-valve brass instrument, `piccolo-trumpet.ts`, `euphonium.ts`); `brass/brass.ts` has what the brass groups share. Checked when the tests run, so a typo fails them.
- `src/lib/notes.ts`: notes' names (letters or solfège), what's heard of a written note (from the transposition, in letters and semitones), and where a note sits on the staff.
- `src/lib/store.svelte.ts`: the switches' choices (instrument, names, alternatives), saved in the browser. `src/ui/SwitchBar.svelte` shows them; `src/views/controller.svelte.ts` makes the chart follow them.
- `src/views/`: the chart (`chart.ts`, made again when the instrument changes, its text too) and the staff (`staff.ts`), drawn as SVG.
- `src/views/glyphs.ts`: the clef, sharp, flat and whole note, as paths from Bravura (the SMuFL reference font), with its engraving defaults (the lines' thickness, the ledger lines' reach), made by `scripts/glyphs.py` (its docstring says how to run it).
- `src/styles.css`: the styles: ducktape-colors' colours and DM Mono, with a print layout.

### Adding an instrument

1. Its notation: one of `src/notations/`, or a new one implementing `Notation` (a horn's thumb valve would be a token added to `valves/`).
2. Its data: a file of registers in that notation (or the one it shares), from a source to credit.
3. Its definition, in its group's file (or a new group, in its section's folder, added to `instruments.ts`): id (a permanent URL), name, kind, transposition, clef (only treble is drawn yet; a bass-clef instrument needs `staff.ts` to learn it), options for its diagram, what to know, tip.
4. Its id in `InstrumentId` (`instrument.ts`), its range in the data test, and a screenshot.

## Sources

- **Flutes**: [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/flute/), the comments adapted: its flute pages ([first octave](https://www.wfg.woodwind.org/flute/fl_alt_1.html), [second](https://www.wfg.woodwind.org/flute/fl_alt_2.html), [third](https://www.wfg.woodwind.org/flute/fl_alt_3.html), [fourth](https://www.wfg.woodwind.org/flute/fl_alt_4.html)) and piccolo pages ([first octave](https://www.wfg.woodwind.org/flute/picc_alt_1.html), [second](https://www.wfg.woodwind.org/flute/picc_alt_2.html), [third](https://www.wfg.woodwind.org/flute/picc_alt_3.html)). A choice of the guide's alternatives, one or a few for each purpose, not all of them; never those that need a half-covered hole or the C♯ trill key some flutes have, those meant for the bass or alto flute, or the piccolo's that close its end with the right little finger. Where the keys sit in the diagrams follows the guide's labelled photos ([flute](https://www.wfg.woodwind.org/flute/fl_fing.html)).
- **Clarinets**: [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/clarinet/)'s Boehm clarinet pages, the comments adapted: basic ([chalumeau](https://www.wfg.woodwind.org/clarinet/cl_bas_1.html), [clarion](https://www.wfg.woodwind.org/clarinet/cl_bas_2.html), [lower altissimo](https://www.wfg.woodwind.org/clarinet/cl_bas_3.html)), its fingerings and alternatives; a few from the alternate chart for the throat notes' tone ([chalumeau and throat](https://www.wfg.woodwind.org/clarinet/cl_alt_1.html)); the bass clarinet's lowest notes and altissimo from its own pages ([chalumeau](https://www.wfg.woodwind.org/clarinet/basscl_alt_1.html), [altissimo](https://www.wfg.woodwind.org/clarinet/basscl_alt_2.html)), the first listed. Where the keys sit in the diagrams follows the guide's labelled photo ([clarinet](https://www.wfg.woodwind.org/clarinet/fing_clsop.html)); the ranges and transpositions from Wikipedia's [Clarinet](https://en.wikipedia.org/wiki/Clarinet) and [Bass clarinet](https://en.wikipedia.org/wiki/Bass_clarinet).
- **Trumpets and the other three-valve brass**: [Yamaha's trumpet fingering chart](https://www.yamaha.com/en/musical_instrument_guide/common/images/trumpet/fingering.pdf), standard and alternatives; the tuning advice, the standard range and the 4th valve from Wikipedia's [Trumpet](https://en.wikipedia.org/wiki/Trumpet), the piccolo trumpet's range from its [Piccolo trumpet](https://en.wikipedia.org/wiki/Piccolo_trumpet) (Herbert, Myers and Wallace). The piccolo trumpet's low 4th-valve fingerings are the valves' arithmetic, checked by a test (every fingering a harmonic of the open horn). That the cornet, flugelhorn, mellophone, tenor horn and baritone horn are fingered like the trumpet, and their ranges, from Wikipedia's [Cornet](https://en.wikipedia.org/wiki/Cornet), [Flugelhorn](https://en.wikipedia.org/wiki/Flugelhorn), [Mellophone](https://en.wikipedia.org/wiki/Mellophone), [Tenor horn](https://en.wikipedia.org/wiki/Tenor_horn) and [Baritone horn](https://en.wikipedia.org/wiki/Baritone_horn).
- **Euphonium**: Micah Everett's [chromatic fingering chart for euphonium (treble clef)](https://olemiss.edu/lowbrass/lowbrassmethods/charts/euphoniumtcfingering.pdf) (University of Mississippi), its fingerings in its order of preference, and its non-compensating ones in the facts; the range and the compensating 4th valve from Wikipedia's [Euphonium](https://en.wikipedia.org/wiki/Euphonium) (Herbert, Myers and Wallace).
- **Saxophones**: [The Woodwind Fingering Guide](https://www.wfg.woodwind.org/sax/)'s saxophone pages, the comments adapted: basic ([first octave](https://www.wfg.woodwind.org/sax/sax_bas_1.html), [second](https://www.wfg.woodwind.org/sax/sax_bas_2.html)) and alternate ([first octave](https://www.wfg.woodwind.org/sax/sax_alt_1.html), [second](https://www.wfg.woodwind.org/sax/sax_alt_2.html), [lower altissimo](https://www.wfg.woodwind.org/sax/sax_alt_4.html)). A choice of the guide's alternatives, one or a few for each purpose, not all of them; the altissimo above F♯6 left out.

DM Mono (`public/fonts/`) and Bravura (the paths in `src/views/glyphs.ts`) are under the SIL Open Font License (`public/fonts/OFL.txt`, `scripts/OFL-Bravura.txt`).
