// The saxophones: soprano, alto, tenor and baritone, by size, fingered alike (the alto is the usual first).
import { SAX_NOTATION } from "../../notations/sax/notation";
import { intervalWords } from "../../lib/notes";
import { define, type Group } from "../instrument";
import { SAX } from "./sax";

const WFG = "https://www.wfg.woodwind.org/sax/";
const ALIKE = "<b>Fingered alike on every size.</b> The same written note takes the same keys on soprano, alto, tenor and baritone: learn one, play them all.";
const OCTAVE = "<b>The octave key</b>, under the left thumb, takes the low register's fingers an octave up; the palm and side keys go on to F and F♯.";
const TIP = "Most alternatives are for an easier passage (the B♭s and the side C, chosen by the notes around them), or for tuning and tone. Try them with a tuner, and keep what works on yours.";
const about = (id: "soprano-sax" | "alto-sax" | "tenor-sax" | "baritone-sax", name: string, kind: string, key: string, steps: number, semitones: number) => ({
  id, group: "saxophones" as const, name, kind, title: `The ${name}, in ${key}, sounding ${intervalWords({ steps, semitones })}`, clef: "treble" as const,
  transposition: { steps, semitones }, tip: TIP,
});

export const SAXOPHONES: Group = {
  id: "saxophones",
  name: "Saxophones",
  section: "Woodwinds",
  default: "alto-sax",
  sources: `The fingerings are from <a href="${WFG}">The Woodwind Fingering Guide</a>, their comments adapted: its saxophone pages (basic: <a href="${WFG}sax_bas_1.html">first octave</a>, <a href="${WFG}sax_bas_2.html">second</a>; alternate: <a href="${WFG}sax_alt_1.html">first octave</a>, <a href="${WFG}sax_alt_2.html">second</a>, <a href="${WFG}sax_alt_4.html">lower altissimo</a>). Its altissimo fingerings above F♯ are left out: they differ from one saxophone to another.`,
  instruments: [
    define({
      ...about("soprano-sax", "soprano saxophone", "Soprano", "B♭", -1, -2), options: {},
      facts: ["<b>It sounds a tone lower.</b> The soprano saxophone is in B♭: a written C sounds B♭. The chart names written notes, and each card says what you'll hear.", ALIKE, OCTAVE],
    }, SAX_NOTATION, SAX),
    define({
      ...about("alto-sax", "alto saxophone", "Alto", "E♭", -5, -9), options: {},
      facts: ["<b>It sounds a major sixth lower.</b> The alto saxophone is in E♭: a written C sounds the E♭ below. The chart names written notes, and each card says what you'll hear.", ALIKE, OCTAVE],
    }, SAX_NOTATION, SAX),
    define({
      ...about("tenor-sax", "tenor saxophone", "Tenor", "B♭", -8, -14), options: {},
      facts: ["<b>It sounds an octave and a tone lower.</b> The tenor saxophone is in B♭, an octave below the soprano: a written C sounds the B♭ an octave and a tone below. The chart names written notes, and each card says what you'll hear.", ALIKE, OCTAVE],
    }, SAX_NOTATION, SAX),
    define({
      ...about("baritone-sax", "baritone saxophone", "Baritone", "E♭", -12, -21), options: { lowA: true },
      facts: ["<b>It sounds an octave and a major sixth lower.</b> The baritone saxophone is in E♭, an octave below the alto: a written C sounds the E♭ an octave and a major sixth below. The chart names written notes, and each card says what you'll hear.", "<b>Low A.</b> Most baritones have a low A key, under the left thumb, for the A a semitone below low B♭, the other saxophones' lowest note: the chart starts there.", ALIKE],
    }, SAX_NOTATION, SAX),
  ],
};
