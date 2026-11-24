// The German-system (Oehler) clarinet's notation, The Woodwind Fingering Guide's for its Oehler/Albert pages
// made explicit, in the Boehm clarinet's form (../clarinet). Each hand's side of the | has its three fingers as
// 1 2 3 (- for one up) and any of its keys, once each, in any order:
//   left   T (the thumb hole), R (the register key, also the thumb's), A (the A key) and G# (the side G♯ key),
//          both by left 1; F (the double F/C sliver key, between left 1 and 2: F4 and C6 with left 1) and Eb
//          (the E♭/B♭ sliver key, between left 2 and 3); C# E F# (the left pinky's: C♯/G♯, low E/B and
//          F♯/C♯) and its two small levers, levG# (G♯/D♯, the "Es-Heber") and levBb (B♭/F, the "F-Heber")
//   right  s1 s2 s3 s4 (the side keys, 4 the lowest, by right 1); Bb (the B♭/F sliver key, between right 2 and
//          3); G# F (the right pinky's: G♯/D♯ and low F/C)
// Unlike the Boehm clarinet's, its pinkies' keys aren't doubled: low E/B and F♯/C♯ are the left's alone, F/C
// the right's, the pinkies sliding between them on rollers. e.g. "T R 123 E | 123 F": clarion B, both pinkies
// down. (The low E/F correction's bell key, by the right thumb, isn't here: few models have it, the YCL-457II
// drawn above the chart not.)
import type { Fingered } from "../../data/types";
import type { Notation } from "../types";
import { oehlerDiagram } from "./diagram";

const LEFT = { T: "T", R: "R", A: "A", "G#": "G#", F: "sF", Eb: "Eb", "C#": "lC#", E: "lE", "F#": "lF#", "levG#": "levG#", levBb: "levBb" } as const;
const RIGHT = { s1: "s1", s2: "s2", s3: "s3", s4: "s4", Bb: "Bb", "G#": "rG#", F: "rF" } as const;
export type OehlerKey = (typeof LEFT)[keyof typeof LEFT] | (typeof RIGHT)[keyof typeof RIGHT];
export type OehlerFingering = Fingered & { left: [boolean, boolean, boolean]; right: [boolean, boolean, boolean]; keys: OehlerKey[] };

export function parseOehler(source: string, note = ""): OehlerFingering {
  const sides = source.split("|").map((s) => s.trim().split(/\s+/).filter(Boolean));
  if (sides.length !== 2) throw new Error(`"${source}": needs one |`);
  const read = <K extends string>(tokens: string[], allowed: Record<string, K>, hand: string) => {
    const fingers = /^[1-][2-][3-]$/, found = tokens.filter((t) => fingers.test(t)), keys = tokens.filter((t) => !fingers.test(t));
    if (found.length !== 1) throw new Error(`"${source}": the ${hand} hand's fingers once, like 1-3`);
    if (keys.some((k) => !Object.hasOwn(allowed, k)) || new Set(keys).size !== keys.length) throw new Error(`"${source}": the ${hand} hand's keys are ${Object.keys(allowed).join(" ")}, once each`);
    return { fingers: [...found[0]].map((c) => c !== "-") as [boolean, boolean, boolean], keys: keys.map((k) => allowed[k]) };
  };
  const left = read(sides[0], LEFT, "left"), right = read(sides[1], RIGHT, "right");
  return { left: left.fingers, right: right.fingers, keys: [...left.keys, ...right.keys], note, source };
}

// Each key's name in words and for a screen reader, in the order they're said.
const NAMES: Record<OehlerKey, [string, string]> = {
  T: ["thumb", "thumb hole"], R: ["register", "register key"], A: ["A", "A key"], "G#": ["G♯", "side G-sharp key"],
  sF: ["sliver F", "F sliver key"], Eb: ["sliver E♭", "E-flat sliver key"],
  "lC#": ["pinky C♯", "left pinky C-sharp key"], lE: ["pinky E", "left pinky E key"], "lF#": ["pinky F♯", "left pinky F-sharp key"],
  "levG#": ["G♯ lever", "left pinky G-sharp lever"], levBb: ["B♭ lever", "left pinky B-flat lever"],
  s1: ["side 1", "side key 1"], s2: ["side 2", "side key 2"], s3: ["side 3", "side key 3"], s4: ["side 4", "side key 4"],
  Bb: ["sliver B♭", "B-flat sliver key"], "rG#": ["pinky G♯", "right pinky G-sharp key"], rF: ["pinky F", "right pinky F key"],
};
const BEFORE_LEFT: OehlerKey[] = ["T", "R", "A", "G#"], AFTER_LEFT: OehlerKey[] = ["sF", "Eb", "lC#", "lE", "lF#", "levG#", "levBb"];
const BEFORE_RIGHT: OehlerKey[] = ["s1", "s2", "s3", "s4"], AFTER_RIGHT: OehlerKey[] = ["Bb", "rG#", "rF"];
const fingers = (down: boolean[]) => down.flatMap((d, i) => (d ? [String(i + 1)] : [])).join(" ");

export const OEHLER_NOTATION: Notation<OehlerFingering> = {
  parse: parseOehler,
  diagram: (f, _options, label, legend) => oehlerDiagram(f, label, legend),
  words(f) {
    const says = (keys: OehlerKey[]) => keys.filter((k) => f.keys.includes(k)).map((k) => NAMES[k][0]);
    const left = [...says(BEFORE_LEFT), fingers(f.left), ...says(AFTER_LEFT)].filter(Boolean);
    const right = [...says(BEFORE_RIGHT), fingers(f.right), ...says(AFTER_RIGHT)].filter(Boolean);
    return [["Left", left.join(" · ") || "nothing"], ["Right", right.join(" · ") || "nothing"]];
  },
  label(f) {
    const says = (keys: OehlerKey[]) => keys.filter((k) => f.keys.includes(k)).map((k) => NAMES[k][1]);
    const hand = (down: boolean[], side: string) => down.flatMap((d, i) => (d ? [`${side} ${i + 1}`] : []));
    const keys = [...says(BEFORE_LEFT), ...hand(f.left, "left"), ...says(AFTER_LEFT), ...says(BEFORE_RIGHT), ...hand(f.right, "right"), ...says(AFTER_RIGHT)];
    return keys.length ? `Press: ${keys.join(", ")}` : "Nothing pressed, every hole open";
  },
  blank: "--- | ---",
  legendLabel: () => "The keys: the thumb hole and register key under the left thumb; the A and side G-sharp keys by left 1; left 1, the F sliver key, left 2, the E-flat sliver key and left 3; the left pinky's C-sharp, E and F-sharp keys and its G-sharp and B-flat levers; the side keys 1 to 4 by right 1; right 1, 2, the B-flat sliver key and right 3; the right pinky's G-sharp and F keys",
  legend: ({ name }) => [
    `Above, the ${name} as it is, every key named where it is. Each note's diagram draws the same keys the same way up, simplified, as the usual charts do: the clarinet standing, facing you, the mouthpiece at the top, the left hand's keys and then the right's, each key on its side of the instrument.`,
    "<b>Filled is pressed, outlined is up.</b> The numbers are your fingers: 1 the index, 2 the middle, 3 the ring finger, each covering a hole (in a ring).",
    "At the top on the left, the left thumb's hole (<b>T</b>) and the register key (<b>reg</b>), which it presses too, for the notes from clarion B up: they're behind the instrument, under the thumb. Above left 1, the <b>A</b> key, and on the right the side <b>G♯</b> key, for the throat notes.",
    "The small keys between the fingers are the <b>sliver</b> keys: <b>F</b> between left 1 and 2 (the double F/C key), <b>E♭</b> between left 2 and 3, <b>B♭</b> between right 2 and 3.",
    "The little fingers' keys are each on one side only: on the right under left 3, the left pinky's <b>C♯</b>, <b>E</b> and <b>F♯</b>; on the left at the bottom, the right pinky's <b>G♯</b> and <b>F</b>, the pinkies sliding between them on rollers. Under the left pinky's keys, its two small levers, dashed, give <b>B♭</b> and <b>G♯</b> to the left hand too.",
    "On the left between the hands, the four side keys (<b>1</b> to <b>4</b>, 4 the lowest), pressed with the side of right 1.",
    "Under each diagram the same fingering in words. Models differ in their extra keys: the double F/C key and the levers are not on every German clarinet.",
  ],
};
