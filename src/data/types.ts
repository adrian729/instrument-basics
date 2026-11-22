// The chart's data, for any instrument: registers of notes at written pitch, each with its fingerings, the
// standard one first. What a fingering is depends on the instrument's notation (src/notations/); here, what
// every one of them shares, and the rows the data files are written in.
import type { InstrumentId } from "./instruments";

export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Pitch = { letter: Letter; sharp: boolean; octave: number };
// Every notation's fingering has these: its comment, the notation it was written in, and, for a fingering only
// some models play (the baritone saxophone's low A), the instruments it's for.
export type Fingered = { note: string; source: string; only?: InstrumentId[] };
export type Note<F> = { id: string; pitch: Pitch; fingerings: F[] };
// nav: the register's link in the header; about: what to know. (Its range is its notes'.)
export type Register<F> = { id: string; nav: string; name: string; about: string; notes: Note<F>[] };

export function parsePitch(id: string): Pitch {
  const m = /^([A-G])(#?)(\d)$/.exec(id);
  if (!m) throw new Error(`"${id}": a note is like D4 or F#5`);
  return { letter: m[1] as Letter, sharp: m[2] === "#", octave: Number(m[3]) };
}

// A register's notes from rows of [note, fingering, ...]: each fingering its notation, or [notation, comment],
// or [notation, comment, the instruments it's only for]; read with the notation's parser.
export type Row = [id: string, ...fingerings: (string | [string, string] | [string, string, InstrumentId[]])[]];
export const rows = <F extends Fingered>(parse: (source: string, note: string) => F, list: Row[]): Note<F>[] => list.map(([id, ...fs]) => ({
  id, pitch: parsePitch(id),
  fingerings: fs.map((f) => {
    if (typeof f === "string") return parse(f, "");
    const [source, note, only] = f;
    return only ? { ...parse(source, note), only } : parse(source, note);
  }),
}));
