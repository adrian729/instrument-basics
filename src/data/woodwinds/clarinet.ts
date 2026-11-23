// Every note of the Boehm clarinet below the upper altissimo, written E3 to G6 (the bass clarinet's from low
// C3): the same for the E♭, B♭, A and bass clarinets, which are fingered alike but for the bass clarinet's
// lowest notes and its altissimo's half-hole. Each note's first fingering is the standard one; the rest are
// alternatives, for an easier passage (the pinkies' keys taking turns, the sliver and side keys), tuning or
// tone. From The Woodwind Fingering Guide's clarinet pages (wfg.woodwind.org/clarinet/cl_bas_1.html, _2, _3;
// cl_alt_1.html; basscl_alt_1.html, _2), its comments adapted: the basic chart's fingerings and alternatives,
// a few of the alternate chart's (B's sliver, a rounder E, the throat notes' tone), and the bass clarinet's
// own, its first listed (but low D's: the guide lists a pinky's key first, the right thumb's last; its
// placement varies, and the thumb's is drawn here, with the low C♯ and C keys).
// Left out: the upper altissimo, above G6. (The notation: notations/clarinet.)
import type { InstrumentId } from "../instrument";
import { parseClarinet, type ClarinetFingering } from "../../notations/clarinet/notation";
import { rows, type Register } from "../types";

const SOPRANO: InstrumentId[] = ["eb-clarinet", "bb-clarinet", "a-clarinet"], BASS: InstrumentId[] = ["bass-clarinet"];
const RIGHT = "The right pinky's key instead: next to a note that takes the left pinky.";
const LEFT = "The left pinky's key instead: next to a note that takes the right pinky.";
const BOTH = (next: string) => `Both pinkies down, the right already on F: next to ${next}, the left pinky alone lifting.`;

export const CLARINET: Register<ClarinetFingering>[] = [
  {
    id: "chalumeau", name: "Chalumeau register", nav: "Chalumeau",
    about: "No register key. Every hole covered for low E, the pinkies' keys for the lowest notes, then the holes opening one by one up the scale. E, F and F♯ each have a key on both sides, so that the pinkies can take turns.",
    notes: rows(parseClarinet, [
      ["C3", ["T 123 | lowC 123", "On a low C bass clarinet: the right thumb's low C key.", BASS]],
      ["C#3", ["T 123 | lowC# 123", "On a low C bass clarinet: the right thumb's low C♯ key.", BASS]],
      ["D3", ["T 123 | lowD 123", "On a low C bass clarinet: the low D key, drawn here under the right thumb with the low C♯ and C keys (where it is varies: on some, it's a pinky's).", BASS]],
      ["D#3", ["T 123 | 123 lowEb", "The low E♭ key, by the right pinky: every bass clarinet has it.", BASS]],
      ["E3", "T 123 E | 123", ["T 123 | 123 E", RIGHT], ["T 123 E | 123 F", BOTH("F")]],
      ["F3", "T 123 | 123 F", ["T 123 F | 123", LEFT]],
      ["F#3", "T 123 F# | 123", ["T 123 | 123 F#", RIGHT], ["T 123 F# | 123 F", BOTH("F")]],
      ["G3", "T 123 | 123"],
      ["G#3", "T 123 | 123 G#"],
      ["A3", "T 123 | 12-"],
      ["A#3", "T 123 | 1--"],
      ["B3", "T 123 | -2-", ["T 123 | 1-- B", "The B sliver key: next to B♭, in chromatic passages."]],
      ["C4", "T 123 | ---"],
      ["C#4", "T 123 C# | ---"],
      ["D4", "T 12- | ---"],
      ["D#4", ["T 12- | s4 ---", "The lowest side key, with the side of right 1."], ["T 12- Eb | ---", "The E♭ sliver key: in chromatic passages and trills with D."], ["T 1-- | 1--", "One-and-one: sharp, but handy next to notes with right 1."]],
      ["E4", "T 1-- | ---", ["T 1-- Eb | s4 --3 F", "Rounder, and lower in pitch."]],
      ["F4", "T --- | ---"],
      ["F#4", ["1-- | ---", "The thumb off, left 1 alone."], ["T --- | s3 s4 ---", "Two side keys, the thumb staying down: next to F."]],
    ]),
  },
  {
    id: "throat", name: "Throat notes", nav: "Throat",
    about: "Every hole open, and the keys by left 1: G with nothing pressed, then G♯ and A, and B♭ with the register key too. Right-hand fingers put down can help their tone and tuning.",
    notes: rows(parseClarinet, [
      ["G4", ["--- | ---", "Open G: nothing pressed."], ["--- | 123", "Right-hand fingers down: a fuller tone, and better in tune (try which suit yours)."]],
      ["G#4", ["G# --- | ---", "The side G♯ key, with left 1."], ["T G# --- | s3 s4 ---", "The thumb and two side keys too: next to F♯."]],
      ["A4", ["A --- | ---", "The A key, with left 1."], ["A --- | -23 F", "Right 2 and 3 and the pinky's F key too: fuller, less airy."]],
      ["A#4", ["R A --- | ---", "The A key, and the register key with the thumb."], ["R A --3 | 1-3 F", "Better in tune, and clearer."], ["R A --- | 123", "Right-hand fingers down: a better tone and tuning (try which suit yours)."], ["A --- | s2 ---", "The 2nd side key instead of the register key: for trills with A."]],
    ]),
  },
  {
    id: "clarion", name: "Clarion register", nav: "Clarion",
    about: "The register key, with the thumb on its hole, takes the chalumeau's fingerings a twelfth up (an octave and a fifth): clarion B is low E's fingering. Crossing into it from the throat notes is the clarinet's break.",
    notes: rows(parseClarinet, [
      ["B4", "T R 123 E | 123", ["T R 123 | 123 E", RIGHT], ["T R 123 E | 123 F", BOTH("C")]],
      ["C5", "T R 123 | 123 F", ["T R 123 F | 123", LEFT]],
      ["C#5", "T R 123 F# | 123", ["T R 123 | 123 F#", RIGHT], ["T R 123 F# | 123 F", BOTH("C")]],
      ["D5", "T R 123 | 123"],
      ["D#5", "T R 123 | 123 G#"],
      ["E5", "T R 123 | 12-"],
      ["F5", "T R 123 | 1--"],
      ["F#5", "T R 123 | -2-", ["T R 123 | 1-- B", "The B sliver key: next to F, in chromatic passages."]],
      ["G5", "T R 123 | ---"],
      ["G#5", "T R 123 C# | ---", ["T R 12- | 12-", "Next to notes with the right hand's fingers down."]],
      ["A5", "T R 12- | ---"],
      ["A#5", ["T R 12- | s4 ---", "The lowest side key, with the side of right 1."], ["T R 12- Eb | ---", "The E♭ sliver key: in chromatic passages and trills with A."], ["T R 1-- | 1--", "One-and-one: next to notes with right 1."], ["T R 1-- | -2-", "Sharp, but handy in fast passages next to notes with right 2."]],
      ["B5", "T R 1-- | ---"],
      ["C6", "T R --- | ---"],
    ]),
  },
  {
    id: "altissimo", name: "Altissimo", nav: "Altissimo",
    about: "Above clarion C: left 1 lifted, a vent (on the bass clarinet, from D up, half-holed instead), and most with the right pinky's G♯ key. Above G6, the upper altissimo, left out here.",
    notes: rows(parseClarinet, [
      ["C#6", "T R -23 | 12-"],
      ["D6", ["T R -23 | 1-- G#", "", SOPRANO], ["T R 023 | 1-- G#", "", BASS]],
      ["D#6", ["T R -23 | 1-- B G#", "", SOPRANO], ["T R 023 | 1-- B G#", "", BASS], ["T R -23 | --3 G#", "Next to the lower clarion notes.", SOPRANO]],
      ["E6", ["T R -23 | --- G#", "", SOPRANO], ["T R 023 | --- G#", "", BASS]],
      ["F6", ["T R -23 C# | --- G#", "", SOPRANO], ["T R 023 C# | --- G#", "", BASS], ["T R 123 C# | 123", "For slurs from the lower registers, and for very soft notes."]],
      ["F#6", ["T R -2- | --- G#", "", SOPRANO], ["T R 02- | --- B G#", "", BASS], ["T R 12- | s4 --- G#", "In tune, and speaks easily at any dynamic: good for wide leaps.", SOPRANO], ["T R 12- | 123 G#", "Steadier: for slurs from below, and for very soft or loud notes."]],
      ["G6", ["T R -2- | 12- G#", "", SOPRANO], ["T R 02- | 12- G#", "", BASS], ["T R 1-- | 12- G#", "For slurs from the clarion.", SOPRANO]],
    ]),
  },
];
