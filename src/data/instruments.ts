// The instruments, and the groups the picker shows them in. An instrument is its data (registers of
// fingerings, in its notation), how it sounds against what's written, and what's said about it; made here into
// what the chart shows, each fingering with its diagram and words, through its notation. The first group's
// first instrument is the page's default; each group's first, the group's.
import type { Notation } from "../notations/types";
import { FLUTE_NOTATION } from "../notations/flute/notation";
import { FLUTE } from "./flute";
import { PICCOLO } from "./piccolo";
import type { Fingered, Register } from "./types";

export type InstrumentId = "flute" | "piccolo";
export type GroupId = "flutes";
export type Clef = "treble"; // (only the treble clef is drawn yet)
// What the diagrams depend on: a flute's foot joint.
export type Options = { foot?: boolean };
// How it sounds against what's written: up (or down, negative) so many letters and semitones (the B♭ trumpet
// −1 and −2: a written C sounds B♭).
export type Transposition = { steps: number; semitones: number };

// A fingering as the chart shows it.
export type Shown = { note: string; source: string; words: [string, string][]; label: string; diagram(): SVGSVGElement };

type About = {
  id: InstrumentId;
  group: GroupId;
  name: string; // as in a sentence: "the flute"
  kind: string; // its name in the picker, beside its group's others: "Flute", "Alto"
  title: string; // the picker's tooltip
  clef: Clef;
  transposition: Transposition;
  options: Options;
};
export type Instrument = About & { registers: Register<Shown>[]; legendDiagram(): SVGSVGElement };
export type Group = { id: GroupId; name: string; instruments: InstrumentId[] };

// An instrument from its data, read through its notation (typed together here, so that nothing else needs to
// know which notation a fingering is in). A fingering for other models only is left out, and a note left
// with none.
function define<F extends Fingered>(about: About, notation: Notation<F>, registers: Register<F>[]): Instrument {
  const show = (f: F): Shown => {
    const label = notation.label(f);
    return { note: f.note, source: f.source, words: notation.words(f), label, diagram: () => notation.diagram(f, about.options, label) };
  };
  return {
    ...about,
    registers: registers
      .map((r) => ({
        ...r,
        notes: r.notes
          .map((n) => ({ ...n, fingerings: n.fingerings.filter((f) => !f.only || f.only.includes(about.id)).map(show) }))
          .filter((n) => n.fingerings.length),
      }))
      .filter((r) => r.notes.length),
    legendDiagram: () => notation.diagram(notation.parse(notation.blank), about.options, notation.legendLabel(about.options), true),
  };
}

export const INSTRUMENTS: Instrument[] = [
  define({ id: "flute", group: "flutes", name: "flute", kind: "Flute", title: "The concert flute, in C", clef: "treble", transposition: { steps: 0, semitones: 0 }, options: { foot: true } }, FLUTE_NOTATION, FLUTE),
  define({ id: "piccolo", group: "flutes", name: "piccolo", kind: "Piccolo", title: "The piccolo, sounding an octave higher", clef: "treble", transposition: { steps: 7, semitones: 12 }, options: {} }, FLUTE_NOTATION, PICCOLO),
];
export const GROUPS: Group[] = [{ id: "flutes", name: "Flutes", instruments: ["flute", "piccolo"] }];

export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;
