// Every note of the trumpet's standard range, written F♯3 to C6 (the B♭ trumpet's and the C trumpet's: they
// read the same written notes with the same valves). Each note's first fingering is the standard one; the
// rest are alternatives, for tuning or an easier passage. From Yamaha's trumpet fingering chart
// (yamaha.com/en/musical_instrument_guide/common/images/trumpet/fingering.pdf), standard and alternatives
// alike; the tuning advice from Wikipedia's "Trumpet" (Fingering). (The notation: notations/valves.)
import { parseValves, type ValveFingering } from "../notations/valves/notation";
import { rows, type Register } from "./types";

const SHARP = "Sharp: push the 3rd valve slide out, with the left ring finger.";
const THIRD = "The 3rd valve alone is as long as 1 and 2 together: a choice for tuning.";
const OTHER = "The same note on another harmonic: for tuning, or an easier passage.";

export const TRUMPET: Register<ValveFingering>[] = [
  {
    id: "low", name: "Low register", nav: "Low",
    about: "Below the staff and up its first notes: the 2nd and 3rd harmonics, with every valve combination. The lowest notes use all three valves, and are sharp.",
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
    about: "The staff's middle: the 4th, 5th and 6th harmonics, closer together, so that several notes share a fingering and a few have two.",
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
    about: "Up to high C, the top of the standard range: firm lips and fast air. Above it, the notes are the lead players'.",
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
