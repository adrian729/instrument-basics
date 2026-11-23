// Every note of the four-valve piccolo trumpet in B♭, written C♯3 to G5 (sounding B3 to F6, its range in
// Herbert, Myers and Wallace, as cited by Wikipedia's "Piccolo trumpet"). The 4th valve lowers a fourth
// (Wikipedia's "Trumpet"): it stands in for 1 and 3, which are sharp, and with the others reaches below
// written F♯. The rest are the trumpet's fingerings (three-valves.ts, from Yamaha's chart). (The notation:
// notations/valves.)
import { parseValves, type ValveFingering } from "../../notations/valves/notation";
import { SLIDE, threeValves } from "./three-valves";
import { rows, type Note, type Register } from "../types";

const FOURTH = "The 4th valve, which lowers a fourth.";
const SHARP = "Sharp: pull the slides out.";
const OLD = "As on the trumpet, without the 4th valve: sharp, but handy in a passage played without it.";

const OWN = rows(parseValves, [
  ["C#3", ["1234", `The lowest note: every valve. ${SHARP}`]],
  ["D3", ["134", SHARP]],
  ["D#3", ["234", SHARP]],
  ["E3", ["124", SHARP]],
  ["F3", ["14", FOURTH]],
  ["F#3", ["24", FOURTH], ["123", OLD]],
  ["G3", ["4", FOURTH], ["13", OLD]],
  ["C#4", ["24", FOURTH], ["123", OLD]],
  ["D4", ["4", FOURTH], ["13", OLD]],
]);
const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const semitone = (id: string) => { const m = /^([A-G]#?)(\d)$/.exec(id)!; return Number(m[2]) * 12 + CHROMATIC.indexOf(m[1]); };
// The notes from low to high: the piccolo's own where it has them, else the trumpet's.
const TRUMPET_NOTES = threeValves(SLIDE).flatMap((r) => r.notes);
const notes = (low: string, high: string): Note<ValveFingering>[] => {
  const out: Note<ValveFingering>[] = [];
  for (let s = semitone(low); s <= semitone(high); s++) out.push([...OWN, ...TRUMPET_NOTES].find((n) => semitone(n.id) === s)!);
  return out;
};

export const PICCOLO_TRUMPET: Register<ValveFingering>[] = [
  {
    id: "low", name: "Low register", nav: "Low",
    about: "Down to written C♯3, every valve down: below F♯3 only with the 4th valve. The piccolo's hardest notes to keep full and in tune.",
    notes: notes("C#3", "C4"),
  },
  {
    id: "middle", name: "Middle register", nav: "Middle",
    about: "The staff: the trumpet's fingerings, with the 4th valve for low C♯ and D.",
    notes: notes("C#4", "C5"),
  },
  {
    id: "high", name: "High register", nav: "High",
    about: "Up to written G5, sounding F6: the top of its range. Firm lips, fast air, and a shallow mouthpiece.",
    notes: notes("C#5", "G5"),
  },
];
