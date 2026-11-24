// What an instrument is: its data (registers of fingerings, in its notation), how it sounds against what's
// written, and what's said about it; made here into what the chart shows, each fingering with its diagram and
// words, through its notation. A group is the picker's: one instrument in its sizes or keys, shown together
// (woodwinds/flutes.ts...), or one alone (brass/cornet.ts), in a section (woodwinds, brass); instruments.ts
// lists them all.
import type { Notation } from "../notations/types";
import type { Fingered, Register } from "./types";
import { ART, type ArtId } from "../notations/art/index";
import { drawArt } from "../notations/art";

export type InstrumentId =
  | "flute" | "piccolo"
  | "bb-clarinet" | "a-clarinet" | "eb-clarinet" | "bass-clarinet" | "bb-clarinet-german" | "a-clarinet-german" | "eb-clarinet-german"
  | "soprano-sax" | "alto-sax" | "tenor-sax" | "baritone-sax"
  | "bb-trumpet" | "c-trumpet" | "piccolo-trumpet"
  | "cornet" | "flugelhorn" | "mellophone" | "tenor-horn" | "baritone-horn" | "euphonium";
// A group is one instrument in its sizes or keys (the flutes, the B♭ and A clarinets...), or one alone.
export type GroupId = "flutes" | "clarinets" | "saxophones" | "trumpets" | "cornet" | "flugelhorn" | "mellophone" | "tenor-horn" | "baritone-horn" | "euphonium";
export type Section = "Woodwinds" | "Brass";
export type Clef = "treble"; // (only the treble clef is drawn yet)
// What the diagrams depend on: a flute's foot joint; a bass clarinet's lowest keys; a baritone saxophone's low
// A key; a valved instrument's valves, as the semitones each lowers (the trumpet's [2, 1, 3]), the open horn's
// lowest harmonic, written (the trumpet's C3), the bell its cards draw (the trumpet's, or the cornet's...), or
// its valves alone (an upright one's: valvesOnly), and a side 4th valve, the left hand's (as a compensating
// euphonium has it). And its drawing, for the key above the chart (notations/art/).
export type Bell = "trumpet" | "cornet" | "flugelhorn" | "mellophone";
export type Options = { foot?: boolean; bass?: boolean; lowA?: boolean; valves?: number[]; openHorn?: string; bell?: Bell; valvesOnly?: boolean; sideValve?: boolean; drawing?: ArtId };
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
  system?: string; // its key system, where its group has more than one (the clarinets' "Boehm" and "German"): a kind's in each
  title: string; // the picker's tooltip
  clef: Clef;
  transposition: Transposition;
  options: Options;
  facts: string[]; // what to know first, the intro's list (HTML)
  tip: string; // the footer's advice on the alternatives
};
export type Instrument = About & { registers: Register<Shown>[]; legend: string[]; legendDiagram(): SVGSVGElement | HTMLElement };
// sources: the footer's credits for the group's data (HTML). Its default is its first instrument, unless
// another is named (the saxophones are listed by size, the alto the usual first).
export type Group = { id: GroupId; name: string; section: Section; sources: string; instruments: Instrument[]; default?: InstrumentId };
export const defaultOf = (g: Group) => g.default ?? g.instruments[0].id;

// An instrument from its data, read through its notation (typed together here, so that nothing else needs to
// know which notation a fingering is in). A fingering for other models only is left out, and a note left
// with none.
export function define<F extends Fingered>(about: About, notation: Notation<F>, registers: Register<F>[]): Instrument {
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
    legend: notation.legend(about),
    legendDiagram: () => {
      const art = about.options.drawing && ART[about.options.drawing], label = notation.legendLabel(about.options);
      return art ? drawArt(art, label) : notation.diagram(notation.parse(notation.blank), about.options, label, true);
    },
  };
}


