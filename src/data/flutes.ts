// The flutes: the concert flute and the piccolo, both Boehm-system, fingered alike for the first two octaves.
import { FLUTE_NOTATION } from "../notations/flute/notation";
import { FLUTE } from "./flute";
import { define, type Group } from "./instrument";
import { PICCOLO } from "./piccolo";

const WFG = "https://www.wfg.woodwind.org/flute/";
const pages = (prefix: string, names: string[]) => names.map((n, i) => `<a href="${WFG}${prefix}_${i + 1}.html">${n}</a>`).join(", ");
const PINKY = (lifted: string) => `<b>The right pinky stays down</b> on the E♭ key for most notes. The diagrams show the few where it's ${lifted}.`;

export const FLUTES: Group = {
  id: "flutes",
  name: "Flutes",
  sources: `The fingerings are from <a href="${WFG}">The Woodwind Fingering Guide</a>, their comments adapted: its flute pages (${pages("fl_alt", ["first octave", "second", "third", "fourth"])}) and piccolo pages (${pages("picc_alt", ["first octave", "second", "third"])}).`,
  instruments: [
    define({
      id: "flute", group: "flutes", name: "flute", kind: "Flute", title: "The concert flute, in C", clef: "treble", transposition: { steps: 0, semitones: 0 }, options: { foot: true },
      facts: [
        "<b>The foot joint</b> gives the lowest notes: the right pinky's rollers for low C♯ and C. Most flutes have this C foot; a B foot adds a key for low B, and often the gizmo key, which helps top C.",
        "<b>It sounds as written.</b> The concert flute is in C: the note on the page is the note you hear.",
        PINKY("lifted or moved, as for low D, middle D, the foot joint's notes and the top notes from high B♭ up"),
      ],
      tip: "Most alternatives are for tuning, or for soft and loud playing, or to make a note speak, or for a fast slur. Try them with a tuner, and keep what works on yours.",
    }, FLUTE_NOTATION, FLUTE),
    define({
      id: "piccolo", group: "flutes", name: "piccolo", kind: "Piccolo", title: "The piccolo, sounding an octave higher", clef: "treble", transposition: { steps: 7, semitones: 12 }, options: {},
      facts: [
        "<b>There's no foot joint.</b> No piccolo has one, so it has none of the flute's low C♯, C or B keys: its lowest note is D, all six fingers down.",
        "<b>It sounds an octave higher.</b> Piccolo music is written an octave below what's heard. The chart names written notes, and each card says what you'll hear.",
        PINKY("lifted, as for low D, middle D, high F♯ and the top notes from high B♭ up"),
      ],
      tip: "Most alternatives are for tuning, or for soft and loud playing, or to make a note speak. Try them with a tuner, and keep what works on yours.",
    }, FLUTE_NOTATION, PICCOLO),
  ],
};
