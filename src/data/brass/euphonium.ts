// Every note of the four-valve euphonium in B♭ treble clef, written C♯3 to E6 (sounding B1 to D5: its range
// in Herbert, Myers and Wallace, "at least" to D5, as cited by Wikipedia's "Euphonium"; below it, the pedal
// notes, and above it the chart's last notes, to written G6, left out).
// From Micah Everett's chromatic fingering chart (treble clef), its fingerings in its order of preference,
// the first the standard one: a compensating euphonium's (its other fingerings for a non-compensating one are
// said in the instrument's facts). The 4th valve lowers a fourth; the lips choose the harmonic. (The
// notation: notations/valves.)
import { parseValves, type ValveFingering } from "../../notations/valves/notation";
import { rows, type Register } from "../types";

export const EVERETT = "https://olemiss.edu/lowbrass/lowbrassmethods/charts/euphoniumtcfingering.pdf";

const LOW = "The 4th valve with others: on a compensating euphonium, in tune.";
const FOURTH = "The 4th valve, in place of 1 and 3: better in tune.";
const SHARP = "Without the 4th valve: sharp.";
const THIRD = "The 3rd valve alone is as long as 1 and 2 together: a choice for tuning.";
const OTHER = "The same note on another harmonic: for tuning, or an easier passage.";

export const EUPHONIUM: Register<ValveFingering>[] = [
  {
    id: "low", name: "Low register", nav: "Low",
    about: "Below the staff: the 2nd harmonic, lowered by every valve combination; under written F♯3 only with the 4th valve.",
    notes: rows(parseValves, [
      ["C#3", ["1234", `The lowest note before the pedal notes: every valve. ${LOW}`]],
      ["D3", ["134", LOW]],
      ["D#3", ["234", LOW]],
      ["E3", ["124", LOW]],
      ["F3", ["14", LOW]],
      ["F#3", ["24", FOURTH], ["123", SHARP]],
      ["G3", ["4", FOURTH], ["13", SHARP]],
      ["G#3", "23"],
      ["A3", "12", ["3", THIRD]],
      ["A#3", "1"],
      ["B3", "2"],
      ["C4", "0", ["14", OTHER]],
    ]),
  },
  {
    id: "middle", name: "Middle register", nav: "Middle",
    about: "The staff: the 3rd and 4th harmonics, the 4th valve again for 1–3 and 1–2–3.",
    notes: rows(parseValves, [
      ["C#4", ["24", FOURTH], ["123", SHARP]],
      ["D4", ["4", FOURTH], ["13", SHARP]],
      ["D#4", "23"],
      ["E4", "12", ["3", THIRD]],
      ["F4", "1"],
      ["F#4", "2", ["24", OTHER], ["123", OTHER]],
      ["G4", "0", ["4", OTHER], ["13", OTHER]],
      ["G#4", "23"],
      ["A4", "12", ["3", THIRD]],
      ["A#4", "1"],
      ["B4", "2"],
      ["C5", "0", ["23", OTHER]],
    ]),
  },
  {
    id: "high", name: "High register", nav: "High",
    about: "Above the staff, to written E6 (sounding D5): the harmonics closer together, so that several notes share a fingering and many have two or three.",
    notes: rows(parseValves, [
      ["C#5", "12", ["24", OTHER], ["123", OTHER]],
      ["D5", "1", ["4", OTHER], ["13", OTHER]],
      ["D#5", "2", ["23", OTHER]],
      ["E5", "0", ["12", OTHER]],
      ["F5", "1"],
      ["F#5", "2"],
      ["G5", "0"],
      ["G#5", "23"],
      ["A5", "12"],
      ["A#5", "1"],
      ["B5", "2"],
      ["C6", "0", ["1", OTHER]],
      ["C#6", "2", ["12", OTHER], ["123", OTHER], ["24", OTHER]],
      ["D6", "0", ["1", OTHER], ["13", OTHER]],
      ["D#6", "2", ["23", OTHER]],
      ["E6", ["0", "The top of the usual range."], ["12", OTHER]],
    ]),
  },
];
