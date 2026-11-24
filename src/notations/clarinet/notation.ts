// The Boehm clarinet's notation (every size's: they're fingered alike, the bass clarinet's lowest notes and
// half-hole aside), The Woodwind Fingering Guide's made explicit. Each hand's side of the | has its three
// fingers as 1 2 3 (- for one up; on the left, 0 for the 1st half-holed, as the bass clarinet's altissimo
// does), and any of its keys, once each, in any order:
//   left   T (the thumb hole), R (the register key, also the thumb's), A (the A key) and G# (the side G♯
//          key), both by left 1; Eb (the E♭/B♭ sliver key, between left 2 and 3); E F F# C# (the left
//          pinky's: low E/B, F/C, F♯/C♯ and C♯/G♯)
//   right  s1 s2 s3 s4 (the side keys, 4 the lowest, by right 1); B (the B/F♯ sliver key, between right 2 and
//          3); E F F# G# (the right pinky's: low E/B, F/C, F♯/C♯ and A♭/E♭); and the bass clarinet's lowEb
//          (the right pinky's), lowD lowC# lowC (the right thumb's, on a low C bass clarinet)
// The same letter is another key on each side (the pinkies' E, F and F♯ are each doubled, one per hand).
// e.g. "T R 123 E | 123": the thumb hole, the register key, all three left fingers, the left pinky's E key,
// all three right fingers: clarion B.
import type { Fingered } from "../../data/types";
import type { Notation } from "../types";
import { clarinetDiagram } from "./diagram";

const LEFT = { T: "T", R: "R", A: "A", "G#": "G#", Eb: "Eb", E: "lE", F: "lF", "F#": "lF#", "C#": "lC#" } as const;
const RIGHT = { s1: "s1", s2: "s2", s3: "s3", s4: "s4", B: "B", E: "rE", F: "rF", "F#": "rF#", "G#": "rG#", lowEb: "lowEb", lowD: "lowD", "lowC#": "lowC#", lowC: "lowC" } as const;
export type ClarinetKey = (typeof LEFT)[keyof typeof LEFT] | (typeof RIGHT)[keyof typeof RIGHT];
// A finger hole covered, or not; the left 1st may be half-covered.
export type Hole = boolean | "half";
export type ClarinetFingering = Fingered & { left: [Hole, boolean, boolean]; right: [boolean, boolean, boolean]; keys: ClarinetKey[] };

export function parseClarinet(source: string, note = ""): ClarinetFingering {
  const sides = source.split("|").map((s) => s.trim().split(/\s+/).filter(Boolean));
  if (sides.length !== 2) throw new Error(`"${source}": needs one |`);
  const read = <K extends string>(tokens: string[], allowed: Record<string, K>, fingers: RegExp, hand: string) => {
    const found = tokens.filter((t) => fingers.test(t)), keys = tokens.filter((t) => !fingers.test(t));
    if (found.length !== 1) throw new Error(`"${source}": the ${hand} hand's fingers once, like 1-3`);
    if (keys.some((k) => !Object.hasOwn(allowed, k)) || new Set(keys).size !== keys.length) throw new Error(`"${source}": the ${hand} hand's keys are ${Object.keys(allowed).join(" ")}, once each`);
    return { fingers: found[0], keys: keys.map((k) => allowed[k]) };
  };
  const left = read(sides[0], LEFT, /^[01-][2-][3-]$/, "left"), right = read(sides[1], RIGHT, /^[1-][2-][3-]$/, "right");
  return {
    left: [left.fingers[0] === "0" ? "half" : left.fingers[0] !== "-", left.fingers[1] !== "-", left.fingers[2] !== "-"],
    right: [right.fingers[0] !== "-", right.fingers[1] !== "-", right.fingers[2] !== "-"],
    keys: [...left.keys, ...right.keys], note, source,
  };
}

// Each key's name in words and for a screen reader, in the order they're said.
const NAMES: Record<ClarinetKey, [string, string]> = {
  T: ["thumb", "thumb hole"], R: ["register", "register key"], A: ["A", "A key"], "G#": ["G♯", "side G-sharp key"], Eb: ["sliver E♭", "E-flat sliver key"],
  lE: ["pinky E", "left pinky E key"], lF: ["pinky F", "left pinky F key"], "lF#": ["pinky F♯", "left pinky F-sharp key"], "lC#": ["pinky C♯", "left pinky C-sharp key"],
  s1: ["side 1", "side key 1"], s2: ["side 2", "side key 2"], s3: ["side 3", "side key 3"], s4: ["side 4", "side key 4"], B: ["sliver B", "B sliver key"],
  rE: ["pinky E", "right pinky E key"], rF: ["pinky F", "right pinky F key"], "rF#": ["pinky F♯", "right pinky F-sharp key"], "rG#": ["pinky G♯", "right pinky G-sharp key"],
  lowEb: ["low E♭", "low E-flat key"], lowD: ["thumb low D", "right thumb low D key"], "lowC#": ["thumb low C♯", "right thumb low C-sharp key"], lowC: ["thumb low C", "right thumb low C key"],
};
const BEFORE_LEFT: ClarinetKey[] = ["T", "R", "A", "G#"], AFTER_LEFT: ClarinetKey[] = ["Eb", "lC#", "lE", "lF", "lF#"];
const BEFORE_RIGHT: ClarinetKey[] = ["lowD", "lowC#", "lowC", "s1", "s2", "s3", "s4"], AFTER_RIGHT: ClarinetKey[] = ["B", "rE", "rF", "rF#", "rG#", "lowEb"];
// (a half-holed finger said apart: "1 half-holed · 2 3")
const fingers = (holes: Hole[]) => [...holes.flatMap((d, i) => (d === "half" ? [`${i + 1} half-holed`] : [])), holes.flatMap((d, i) => (d === true ? [String(i + 1)] : [])).join(" ")];

export const CLARINET_NOTATION: Notation<ClarinetFingering> = {
  parse: parseClarinet,
  diagram: (f, options, label, legend) => clarinetDiagram(f, label, options.bass ?? false, legend),
  words(f) {
    const says = (keys: ClarinetKey[]) => keys.filter((k) => f.keys.includes(k)).map((k) => NAMES[k][0]);
    const left = [...says(BEFORE_LEFT), ...fingers(f.left), ...says(AFTER_LEFT)].filter(Boolean);
    const right = [...says(BEFORE_RIGHT), ...fingers(f.right), ...says(AFTER_RIGHT)].filter(Boolean);
    return [["Left", left.join(" · ") || "nothing"], ["Right", right.join(" · ") || "nothing"]];
  },
  label(f) {
    const says = (keys: ClarinetKey[]) => keys.filter((k) => f.keys.includes(k)).map((k) => NAMES[k][1]);
    const hand = (holes: Hole[], side: string) => holes.flatMap((d, i) => (d === "half" ? [`${side} ${i + 1} half-holed`] : d ? [`${side} ${i + 1}`] : []));
    const keys = [...says(BEFORE_LEFT), ...hand(f.left, "left"), ...says(AFTER_LEFT), ...says(BEFORE_RIGHT), ...hand(f.right, "right"), ...says(AFTER_RIGHT)];
    return keys.length ? `Press: ${keys.join(", ")}` : "Nothing pressed, every hole open";
  },
  blank: "--- | ---",
  legendLabel: (options) => "The keys: the thumb hole and register key under the left thumb; the A and side G-sharp keys by left 1; left 1, 2, the E-flat sliver key and left 3; the left pinky's C-sharp, F, E and F-sharp keys; the side keys 1 to 4 by right 1; right 1, 2, the B sliver key and right 3; the right pinky's F-sharp, G-sharp, E and F keys"
    + (options.bass ? "; the bass clarinet's low E-flat key, by the right pinky, and low D, C-sharp and C keys, under the right thumb" : ""),
  legend: ({ name, options }) => [
    `Above, the ${name} as it is, every key named where it is. Each note's diagram draws the same keys the same way up, simplified, as the usual charts do: the clarinet standing, facing you, the mouthpiece at the top, the left hand's keys and then the right's, each key on its side of the instrument.`,
    "<b>Filled is pressed, outlined is up.</b> The numbers are your fingers: 1 the index, 2 the middle, 3 the ring finger, each covering a hole (in a ring).",
    "At the top on the left, the left thumb's hole (<b>T</b>) and the register key (<b>reg</b>), which it presses too, for the notes from clarion B up: they're behind the instrument, under the thumb. Above left 1, the <b>A</b> key, and on the right the side <b>G♯</b> key, for the throat notes.",
    "The little fingers' keys, each on its own hand's side: on the right under left 3, the left pinky's <b>C♯</b>, <b>F</b>, <b>E</b> and <b>F♯</b>; on the left at the bottom, the right pinky's <b>G♯</b>, <b>F♯</b>, <b>F</b> and <b>E</b>. E, F and F♯ are on both sides, so that the pinkies can take turns.",
    "On the left between the hands, the four side keys (<b>1</b> to <b>4</b>, 4 the lowest), pressed with the side of right 1. The small keys between 2 and 3 on each hand are the <b>sliver</b> keys: E♭ on the left hand, B on the right.",
    ...(options.bass ? ["The bass clarinet's lowest keys: <b>E♭</b> by the right pinky, and on a low C bass clarinet <b>D</b>, <b>C♯</b> and <b>C</b> under the right thumb, behind the instrument, drawn on the right by right 1 and 2 (where they are varies: some have low D by a pinky). A half-filled left 1 is a <b>half-hole</b>: the ring pressed, the hole left open, as its altissimo does."] : []),
    `Under each diagram the same fingering in words. Every Boehm clarinet, E♭ to bass, is fingered alike.`,
  ],
};
