// Every note of the German-system (Oehler) clarinets' ranges: written E3 to C7 on the B♭ and A clarinets, E3 to
// A6 on the E♭ (as the Boehm ones'). Fingered alike on every size, The Woodwind Fingering Guide says. Each
// note's first fingering is the standard one; the rest are alternatives. From the guide's Oehler/Albert pages
// (wfg.woodwind.org/clarinet/ocl_bas_1.html, _2, _3: the basic chart's fingerings and alternatives, its comments
// adapted; ocl_alt_4.html: the upper altissimo's first listed), every standard one checked against Yamaha's
// German-system owner's manual and A-Klarinette's chart, which agree with it to F6. At G6 those two give
// left 1 with the right hand down, the guide's second, so it's first here and the guide's first follows.
// (The notation: notations/oehler.)
import type { InstrumentId } from "../instrument";
import { parseOehler, type OehlerFingering } from "../../notations/oehler/notation";
import { rows, type Register } from "../types";

const TO_C7: InstrumentId[] = ["bb-clarinet-german", "a-clarinet-german"]; // (the E♭ clarinet's range ends at A6)
const VENT = "Right-hand fingers down to vent it: for its tone and tuning (try which suit yours).";
const LEVER = (note: string) => `The left pinky's ${note} lever instead of the right pinky's key, on models with it.`;
const FORK = "The fork: right 1 and 3. Oehler's extra tone holes put it in tune.";

export const OEHLER: Register<OehlerFingering>[] = [
  {
    id: "chalumeau", name: "Chalumeau register", nav: "Chalumeau",
    about: "No register key. Every hole covered and both pinkies down for low E, then the holes opening one by one up the scale. The pinkies' keys aren't doubled: low E and F♯ are the left's, F the right's.",
    notes: rows(parseOehler, [
      ["E3", ["T 123 E | 123 F", "Both pinkies: the left's E, the right's F. On a model with the low E correction, the right thumb's bell key too."]],
      ["F3", ["T 123 | 123 F", "The right pinky's F (the left has none). On a model with the low E correction, the right thumb's bell key too."]],
      ["F#3", "T 123 F# | 123 F", ["T 123 E | 123", "The left pinky's E key alone, the right's up."]],
      ["G3", "T 123 | 123"],
      ["G#3", "T 123 | 123 G#", ["T 123 levG# | 123", LEVER("G♯")]],
      ["A3", "T 123 | 12-"],
      ["A#3", ["T 123 | 12- Bb", "The B♭ sliver key, between right 2 and 3."], ["T 123 | 1-3", FORK], ["T 123 levBb | 12-", "The left pinky's B♭ lever instead of the sliver, on models with it."]],
      ["B3", "T 123 | 1--"],
      ["C4", "T 123 | ---"],
      ["C#4", "T 123 C# | ---"],
      ["D4", "T 12- | ---"],
      ["D#4", ["T 12- Eb | ---", "The E♭ sliver key, between left 2 and 3."], ["T 12- | s4 ---", "The lowest side key, with the side of right 1."]],
      ["E4", "T 1-- | ---"],
      ["F4", ["T 1-- | s3 ---", "Left 1 and the 3rd side key: the thumb alone is F♯."], ["T 1-- F | ---", "The double F/C key, with left 1: on models with it."], ["T -2- | ---", "For Austrian models: sharp on others."]],
      ["F#4", ["T --- | ---", "The thumb alone."]],
    ]),
  },
  {
    id: "throat", name: "Throat notes", nav: "Throat",
    about: "Every hole open, and the keys by left 1: G with nothing pressed, then G♯ and A, and B♭ with the register key too. Right-hand fingers put down can help their tone and tuning.",
    notes: rows(parseOehler, [
      ["G4", ["--- | ---", "Open G: nothing pressed."], ["--- | 123", VENT]],
      ["G#4", ["G# --- | ---", "The side G♯ key, with left 1."], ["G# --- | 1-3 F", VENT]],
      ["A4", ["A --- | ---", "The A key, with left 1."], ["A --3 | 1-3 F", VENT]],
      ["A#4", ["R A --- | ---", "The A key, and the register key with the thumb, its hole left open."], ["R A --3 E | 1-- F", VENT], ["R A --3 E | 12- Bb F", VENT]],
    ]),
  },
  {
    id: "clarion", name: "Clarion register", nav: "Clarion",
    about: "The register key, with the thumb on its hole, takes the chalumeau's fingerings a twelfth up (an octave and a fifth): clarion B is low E's fingering. Crossing into it from the throat notes is the clarinet's break.",
    notes: rows(parseOehler, [
      ["B4", ["T R 123 E | 123 F", "Both pinkies, as for low E."]],
      ["C5", "T R 123 | 123 F"],
      ["C#5", "T R 123 F# | 123 F", ["T R 123 E | 123", "The left pinky's E key alone, the right's up."]],
      ["D5", "T R 123 | 123"],
      ["D#5", "T R 123 | 123 G#", ["T R 123 levG# | 123", LEVER("G♯")]],
      ["E5", "T R 123 | 12-"],
      ["F5", ["T R 123 | 12- Bb", "The B♭ sliver key, between right 2 and 3."], ["T R 123 | 1-3", FORK], ["T R 123 levBb | 12-", "The left pinky's B♭ lever instead of the sliver, on models with it."]],
      ["F#5", "T R 123 | 1--"],
      ["G5", "T R 123 | ---"],
      ["G#5", "T R 123 C# | ---"],
      ["A5", "T R 12- | ---"],
      ["A#5", ["T R 12- Eb | ---", "The E♭ sliver key, between left 2 and 3."], ["T R 12- | s4 ---", "The lowest side key, with the side of right 1."], ["T R 1-3 | ---", "The fork: left 1 and 3."]],
      ["B5", "T R 1-- | ---"],
      ["C6", ["T R -2- | ---", "Left 2 alone, with the register key and thumb."], ["T R 1-- F | ---", "The double F/C key, with left 1: on models with it."], ["T R 1-- | s3 ---", "Left 1 and the 3rd side key, as for F below."]],
    ]),
  },
  {
    id: "altissimo", name: "Altissimo", nav: "Altissimo",
    about: "Above clarion C: left 1 lifted, and most with the right pinky's G♯ key, as a vent.",
    notes: rows(parseOehler, [
      ["C#6", "T R -23 | 123 G#", ["T R --- | ---", "Open, the register key and thumb alone: on a model with the twelfth link (the Duodezimverbindung), as the YCL-457II-22 has."]],
      ["D6", "T R -23 | 1-3 G#"],
      ["D#6", "T R -23 | 1-- G#"],
      ["E6", "T R -23 | --- G#", ["R 123 | --- G#", "Left 1 down, the thumb hole open."], ["T R 123 | --- G#", "Left 1 down too."]],
      ["F6", "T R -23 C# | --- G#", ["T R 123 C# | 123", "Every finger down, the left pinky's C♯ too."]],
      ["F#6", "T R -2- | --- G#", ["T R 12- | 123 G#", "Left 1 and the right hand down."]],
      ["G6", ["T R 1-- | 123 G#", "Yamaha's and A-Klarinette's first."], ["T R -2- | s4 --- G#", "The guide's first: left 2 and the lowest side key."], ["T R -2- Eb | --- G#", "The E♭ sliver key instead of the side key."]],
    ]),
  },
  {
    id: "upper", name: "Upper altissimo", nav: "Upper",
    about: "The top of each clarinet's range: written A6 on the E♭ clarinet, C7 on the B♭ and A. Many fingerings work up here; the first is the guide's first.",
    notes: rows(parseOehler, [
      ["G#6", "T R 1-3 | 1-3 F", ["T R --- | 123 G#", "The right hand down alone: Yamaha's and A-Klarinette's too."]],
      ["A6", "T R -23 | --- F", ["T R -23 C# | 123", "The right hand down, and the left pinky's C♯."]],
      ["A#6", ["T R -23 C# | 123 F", "", TO_C7]],
      ["B6", ["T R 12- | 12- F", "", TO_C7]],
      ["C7", ["T R 1-- | 12- Bb F", "", TO_C7]],
    ]),
  },
];
