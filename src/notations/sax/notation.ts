// The saxophone's notation (every size's: they're fingered alike), The Woodwind Fingering Guide's made
// explicit. Each hand's side of the | has its three fingers as 1 2 3 (- for one up), and any of its keys,
// once each, in any order:
//   left   T (the thumb's octave key), lowA (the baritone's low A, also the thumb's), pD pEb pF (the palm keys),
//          fF (the front F key, by left 1), bis (the small B♭ key between left 1 and 2), G# lowC# lowB lowBb
//          (the left pinky's)
//   right  sE sC sBb (the side keys), hiF# (the high F♯ key, a fourth side key), altF# (the alternate F♯ key,
//          between right 2 and 3), Eb lowC (the right pinky's)
// e.g. "T 12- | sBb ---": the octave key, left 1 and 2, the side B♭ key: B♭ in the second octave.
import type { Fingered } from "../../data/types";
import type { Notation } from "../types";
import { saxDiagram } from "./diagram";

const LEFT = ["T", "lowA", "pD", "pEb", "pF", "fF", "bis", "G#", "lowC#", "lowB", "lowBb"] as const;
const RIGHT = ["sE", "sC", "sBb", "hiF#", "altF#", "Eb", "lowC"] as const;
export type SaxKey = (typeof LEFT)[number] | (typeof RIGHT)[number];
export type SaxFingering = Fingered & { left: [boolean, boolean, boolean]; right: [boolean, boolean, boolean]; keys: SaxKey[] };

const FINGERS = /^[1-][2-][3-]$/;

export function parseSax(source: string, note = ""): SaxFingering {
  const sides = source.split("|").map((s) => s.trim().split(/\s+/).filter(Boolean));
  if (sides.length !== 2) throw new Error(`"${source}": needs one |`);
  const read = (tokens: string[], allowed: readonly string[], hand: string) => {
    const fingers = tokens.filter((t) => FINGERS.test(t));
    const keys = tokens.filter((t) => !FINGERS.test(t));
    if (fingers.length !== 1) throw new Error(`"${source}": the ${hand} hand's fingers once, like 1-3`);
    if (keys.some((k) => !allowed.includes(k)) || new Set(keys).size !== keys.length) throw new Error(`"${source}": the ${hand} hand's keys are ${allowed.join(" ")}, once each`);
    return { down: [fingers[0][0] !== "-", fingers[0][1] !== "-", fingers[0][2] !== "-"] as [boolean, boolean, boolean], keys: keys as SaxKey[] };
  };
  const left = read(sides[0], LEFT, "left"), right = read(sides[1], RIGHT, "right");
  return { left: left.down, right: right.down, keys: [...left.keys, ...right.keys], note, source };
}

// Each key's name in words and for a screen reader, in the order they're said.
const NAMES: Record<SaxKey, [string, string]> = {
  T: ["octave", "octave key"], lowA: ["low A", "low A key"], pD: ["palm D", "palm D key"], pEb: ["palm E♭", "palm E-flat key"], pF: ["palm F", "palm F key"],
  fF: ["front F", "front F key"], bis: ["bis", "bis key"], "G#": ["G♯", "G-sharp key"], "lowC#": ["low C♯", "low C-sharp key"], lowB: ["low B", "low B key"],
  lowBb: ["low B♭", "low B-flat key"], sE: ["side E", "side E key"], sC: ["side C", "side C key"], sBb: ["side B♭", "side B-flat key"], "hiF#": ["high F♯", "high F-sharp key"],
  "altF#": ["alt F♯", "alternate F-sharp key"], Eb: ["E♭", "E-flat key"], lowC: ["low C", "low C key"],
};
const BEFORE_LEFT: SaxKey[] = ["T", "lowA", "pD", "pEb", "pF", "fF"], AFTER_LEFT: SaxKey[] = ["bis", "G#", "lowC#", "lowB", "lowBb"];
const BEFORE_RIGHT: SaxKey[] = ["sE", "sC", "sBb", "hiF#"], AFTER_RIGHT: SaxKey[] = ["altF#", "Eb", "lowC"];
const fingers = (down: boolean[]) => down.flatMap((d, i) => (d ? [String(i + 1)] : [])).join(" ");

export const SAX_NOTATION: Notation<SaxFingering> = {
  parse: parseSax,
  diagram: (f, options, label, legend) => saxDiagram(f, label, options.lowA ?? false, legend),
  words(f) {
    const says = (keys: SaxKey[]) => keys.filter((k) => f.keys.includes(k)).map((k) => NAMES[k][0]);
    const left = [...says(BEFORE_LEFT), fingers(f.left), ...says(AFTER_LEFT)].filter(Boolean);
    const right = [...says(BEFORE_RIGHT), fingers(f.right), ...says(AFTER_RIGHT)].filter(Boolean);
    return [["Left", left.join(" · ") || "nothing"], ["Right", right.join(" · ") || "nothing"]];
  },
  label(f) {
    const says = (keys: SaxKey[]) => keys.filter((k) => f.keys.includes(k)).map((k) => NAMES[k][1]);
    const keys = [
      ...says(BEFORE_LEFT), ...f.left.flatMap((d, i) => (d ? [`left ${i + 1}`] : [])), ...says(AFTER_LEFT),
      ...says(BEFORE_RIGHT), ...f.right.flatMap((d, i) => (d ? [`right ${i + 1}`] : [])), ...says(AFTER_RIGHT),
    ];
    return keys.length ? `Press: ${keys.join(", ")}` : "Nothing pressed";
  },
  blank: "--- | ---",
  legendLabel: (options) => `The keys, from the neck down: the front F key, the octave key${options.lowA ? " and low A key" : ""} under the left thumb, the palm keys E-flat, D and F; left 1, the bis key, left 2 and 3; the left pinky's G-sharp, low C-sharp, B and B-flat; the side keys E, C and B-flat and the high F-sharp key under them; right 1, 2, the alternate F-sharp key, right 3; the right pinky's E-flat and low C`,
  legend: ({ name, options }) => [
    `Above, the ${name} as it is, facing you, every key named where it is. Each note's diagram draws the same keys as the usual charts do: in a column, the neck at the top, the left hand's keys and then the right's, each in its shape and where it is, without the body.`,
    "<b>Filled is pressed, outlined is up.</b> The numbers are your fingers: 1 the index, 2 the middle, 3 the ring finger.",
    `In the diagrams, at the top, the front F key, and beside left 1 the octave key, under the left thumb${options.lowA ? " (the baritone's low A key under it)" : ""}; up on the right, the left palm's <b>E♭</b>, <b>D</b> and <b>F</b> keys.`,
    "On the right under left 3, the left pinky's table: <b>G♯</b>, <b>B</b>, <b>C♯</b> and <b>B♭</b>. On the left by the right hand, its side keys <b>E</b>, <b>C</b> and <b>B♭</b>, and under them the high <b>F♯</b> key most saxophones have; and under right 3, the right pinky's <b>E♭</b> and <b>C</b>.",
    "The small key between left 1 and 2 is the <b>bis</b> B♭ key; the dashed one beside right 2 and 3, the alternate F♯ key. Dashed keys are the few that only some fingerings use.",
    "Under each diagram the same fingering in words. Every saxophone, soprano to baritone, is fingered alike.",
  ],
};
