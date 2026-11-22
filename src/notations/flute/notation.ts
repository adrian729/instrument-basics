// The Boehm flute's notation (the flute's and the piccolo's): a fingering as the player reads it, left hand
// then right:
//   thumb  B (the B key), Bb (the B♭ lever) or - (off)
//   then   the left hand's fingers 1 2 3 (index, middle, ring), - for one up; then G# (the left pinky's key)
//   |      then the right hand's 1 2 3 the same way; then any of the keys below, once each, in any order:
//          Eb (the right pinky's E♭ key); on a flute's foot joint, lowC# and lowC (the pinky's rollers), lowB
//          (a B foot's low B key) and giz (a B foot's gizmo, for top C); trD (the D trill key, between right
//          1 and 2), trD# (the D♯ trill key, between right 2 and 3) and side (the side B♭ lever, by right 1)
// e.g. "B 123 G# | --- Eb": the B thumb key, all three left fingers, the G♯ key, and the E♭ key.
import type { Fingered } from "../../data/types";
import type { Notation } from "../types";
import { keysDiagram } from "./diagram";

export type Thumb = "B" | "Bb" | null;
export type Extra = "trD" | "trD#" | "side";
export type Foot = "lowC#" | "lowC" | "lowB" | "giz";
export type FluteFingering = Fingered & {
  thumb: Thumb;
  left: [boolean, boolean, boolean];
  gSharp: boolean;
  right: [boolean, boolean, boolean];
  eFlat: boolean;
  foot: Foot[];
  extras: Extra[];
};

const FINGERS = /^[1-][2-][3-]$/;
const EXTRAS: string[] = ["trD", "trD#", "side"];
const FOOT: string[] = ["lowC#", "lowC", "lowB", "giz"];

export function parseFlute(source: string, note = ""): FluteFingering {
  const [leftSide, rightSide, ...rest] = source.split("|").map((s) => s.trim().split(/\s+/));
  if (!leftSide || !rightSide || rest.length) throw new Error(`"${source}": needs one |`);
  const [thumb, left, ...leftKeys] = leftSide;
  const [right, ...rightKeys] = rightSide;
  if (!["B", "Bb", "-"].includes(thumb)) throw new Error(`"${source}": thumb is B, Bb or -`);
  if (!FINGERS.test(left ?? "") || !FINGERS.test(right ?? "")) throw new Error(`"${source}": fingers are like 1-3`);
  if (leftKeys.some((k) => k !== "G#") || leftKeys.length > 1) throw new Error(`"${source}": the left hand's only key is G#`);
  if (rightKeys.some((k) => k !== "Eb" && !EXTRAS.includes(k) && !FOOT.includes(k)) || new Set(rightKeys).size !== rightKeys.length)
    throw new Error(`"${source}": the right hand's keys are Eb, lowC#, lowC, lowB, giz, trD, trD# and side, once each`);
  const down = (s: string) => [s[0] !== "-", s[1] !== "-", s[2] !== "-"] as [boolean, boolean, boolean];
  return {
    thumb: thumb === "-" ? null : (thumb as Thumb), left: down(left), gSharp: leftKeys.includes("G#"), right: down(right),
    eFlat: rightKeys.includes("Eb"), foot: rightKeys.filter((k) => FOOT.includes(k)) as Foot[],
    extras: rightKeys.filter((k) => EXTRAS.includes(k)) as Extra[], note, source,
  };
}

const FOOT_NAMES: Record<Foot, string> = { "lowC#": "low C♯", lowC: "low C", lowB: "low B", giz: "gizmo" };
const FOOT_LABELS: Record<Foot, string> = { "lowC#": "low C-sharp key", lowC: "low C key", lowB: "low B key", giz: "gizmo key" };
const fingers = (down: boolean[]) => down.flatMap((d, i) => (d ? [String(i + 1)] : [])).join(" ");

export const FLUTE_NOTATION: Notation<FluteFingering> = {
  parse: parseFlute,
  diagram: (f, options, label, legend) => keysDiagram(f, label, options.foot ?? false, legend),
  words(f) {
    const left = [f.thumb === "Bb" ? "thumb B♭" : f.thumb === "B" ? "thumb B" : "", fingers(f.left), f.gSharp ? "G♯" : ""].filter(Boolean);
    const right = [
      fingers(f.right), f.extras.includes("side") ? "side B♭" : "", f.extras.includes("trD") ? "D trill" : "", f.extras.includes("trD#") ? "D♯ trill" : "", f.eFlat ? "E♭" : "",
      ...f.foot.map((k) => FOOT_NAMES[k]),
    ].filter(Boolean);
    return [["Left", left.join(" · ") || "nothing"], ["Right", right.join(" · ") || "nothing"]];
  },
  label(f) {
    const keys = [
      f.thumb === "Bb" ? "B-flat thumb lever" : f.thumb === "B" ? "B thumb key" : "",
      ...f.left.flatMap((d, i) => (d ? [`left ${i + 1}`] : [])), f.gSharp ? "G-sharp key" : "",
      ...f.right.flatMap((d, i) => (d ? [`right ${i + 1}`] : [])),
      f.extras.includes("side") ? "side B-flat lever" : "", f.extras.includes("trD") ? "D trill key" : "", f.extras.includes("trD#") ? "D-sharp trill key" : "",
      f.eFlat ? "E-flat key" : "", ...f.foot.map((k) => FOOT_LABELS[k]),
    ].filter(Boolean);
    return keys.length ? `Press: ${keys.join(", ")}` : "Every key open";
  },
  blank: "- --- | ---",
  legendLabel: (options) => "The keys: the thumb's B♭ lever and B key; left 1, 2 and 3; the G♯ key; right 1, 2 and 3, the side B♭ lever by right 1 and the D and D♯ trill keys between them; the E♭ key"
    + (options.foot ? "; the foot joint's low C♯, C and B keys and the gizmo" : ""),
  legend: ({ name, options }) => [
    `The ${name} seen from above as you play it: the mouthpiece on the left, the left hand nearer it, the right hand further out.`,
    "<b>Dark is pressed, white is up.</b> The numbers are your fingers: 1 the index, 2 the middle, 3 the ring finger.",
    `Above the body, the left pinky's <b>G♯</b>. Below it, the keys on your side of the instrument: the thumb's two (use <b>B</b>; a few fingerings ask for the <b>B♭</b> lever), the right hand's side lever and trill keys, and the right pinky's <b>E♭</b>${options.foot ? " with the foot joint's rollers for low <b>C♯</b> and <b>C</b>" : ""}.`,
    ...(options.foot ? ["The foot joint's <b>B</b> key and <b>giz</b>mo are a B foot's: on a C foot, use the fingerings without them."] : []),
    "The dashed <b>D</b> and <b>D♯</b> are the trill keys' touches, between your right-hand fingers, pressed with whichever finger is free. The <b>side</b> B♭ lever, by right 1, is pressed with the side of that finger. Only a few notes use these.",
    `Under each diagram the same fingering in words. Open-hole and closed-hole ${name}s are fingered alike.`,
  ],
};
