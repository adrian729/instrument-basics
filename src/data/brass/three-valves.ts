// Every note of a three-valve brass instrument read in treble clef, written F♯3 to C6: the trumpet's standard
// range, and the cornet's, flugelhorn's, mellophone's, tenor horn's and baritone horn's (Wikipedia's articles
// on each), all fingered alike: the same written note, the same valves. Each note's first fingering is the
// standard one; the rest are alternatives, for tuning or an easier passage. From Yamaha's trumpet fingering
// chart (yamaha.com/en/musical_instrument_guide/common/images/trumpet/fingering.pdf), standard and
// alternatives alike; the tuning advice from Wikipedia's "Trumpet" (Fingering). Made for an instrument with
// what to do about the sharp fingerings (1–3, 1–2–3) on it. (The notation: notations/valves.)
import { parseValves, type ValveFingering } from "../../notations/valves/notation";
import { rows, type Register } from "../types";

const THIRD = "The 3rd valve alone is as long as 1 and 2 together: a choice for tuning.";
const OTHER = "The same note on another harmonic: for tuning, or an easier passage.";

// The trumpet's and the cornet's: their 3rd valve slide has a ring for the left ring finger.
export const SLIDE = "Sharp: push the 3rd valve slide out, with the left ring finger.";
// Any other's: no slide to move while playing on many of them.
export const LIP = "Sharp: lip it down, or move a valve slide, if yours has a ring or trigger for it.";

export const threeValves = (SHARP: string): Register<ValveFingering>[] => [
  {
    id: "low", name: "Low register", nav: "Low",
    about: "Below the staff and up its first notes: the 2nd and 3rd harmonics, with every valve combination. The lowest notes use 1–3 and 1–2–3, and are sharp.",
    notes: rows(parseValves, [
      ["F#3", ["123", `The lowest note. ${SHARP}`]],
      ["G3", ["13", SHARP]],
      ["G#3", "23"],
      ["A3", "12", ["3", THIRD]],
      ["A#3", "1"],
      ["B3", "2"],
      ["C4", "0"],
      ["C#4", ["123", SHARP]],
      ["D4", ["13", SHARP]],
      ["D#4", "23"],
      ["E4", "12", ["3", THIRD]],
      ["F4", "1"],
      ["F#4", "2"],
    ]),
  },
  {
    id: "middle", name: "Middle register", nav: "Middle",
    about: "The staff's middle: from open G (the 3rd harmonic) up through the 4th, 5th and 6th, closer together, so that several notes share a fingering and some have two or more.",
    notes: rows(parseValves, [
      ["G4", "0", ["13", OTHER]],
      ["G#4", "23"],
      ["A4", "12", ["3", THIRD]],
      ["A#4", "1"],
      ["B4", "2"],
      ["C5", "0", ["23", OTHER]],
      ["C#5", "12"],
      ["D5", "1", ["13", OTHER]],
      ["D#5", "2", ["23", OTHER]],
      ["E5", "0", ["12", OTHER], ["3", OTHER]],
      ["F5", "1"],
      ["F#5", "2"],
    ]),
  },
  {
    id: "high", name: "High register", nav: "High",
    about: "Up to high C, the top of the standard range: firm lips and fast air. Above it, only the strongest players go.",
    notes: rows(parseValves, [
      ["G5", "0", ["13", OTHER]],
      ["G#5", "23"],
      ["A5", "12", ["3", THIRD]],
      ["A#5", "1"],
      ["B5", "2"],
      ["C6", ["0", "High C."]],
    ]),
  },
];
