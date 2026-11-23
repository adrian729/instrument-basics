// Valved brass's notation (the trumpets', cornet's, flugelhorn's, mellophone's, tenor horn's, euphonium's and
// baritone's; later the horn's, tuba's...): the valves pressed, as digits in
// order ("13": the 1st and 3rd), or 0 for none (open). Each valve lengthens the tube, lowering every note of
// the open horn's harmonics by its semitones (the trumpet's 1st 2, 2nd 1, 3rd 3, a 4th 5: the instrument's
// options); the lips choose the harmonic.
import type { Fingered } from "../../data/types";
import type { Notation } from "../types";
import { valvesDiagram } from "./diagram";
import { DRAWINGS } from "./drawings";

export type ValveFingering = Fingered & { valves: [boolean, boolean, boolean, boolean] };

export function parseValves(source: string, note = ""): ValveFingering {
  const s = source.trim();
  if (!/^(0|1?2?3?4?)$/.test(s) || !s) throw new Error(`"${source}": valves are like 13, or 0 for none`);
  return { valves: [s.includes("1"), s.includes("2"), s.includes("3"), s.includes("4")], note, source };
}

const pressed = (f: ValveFingering) => f.valves.flatMap((d, i) => (d ? [i + 1] : []));

export const VALVES_NOTATION: Notation<ValveFingering> = {
  parse: parseValves,
  diagram: (f, options, label, legend) => valvesDiagram(f, label, options.valves?.length ?? 3, options.drawing, options.sideValve ?? false, legend),
  words: (f) => [["Valves", pressed(f).join(" ") || "none (open)"]],
  label: (f) => (pressed(f).length ? `Press: ${pressed(f).map((v) => `valve ${v}`).join(", ")}` : "No valves pressed (open)"),
  blank: "0",
  legendLabel: (options) => `The valves, from the mouthpiece out: 1, 2 and 3${(options.valves?.length ?? 3) > 3 ? (options.sideValve ? ", and the 4th on the side, for the left hand" : ", and the 4th set apart") : ""}`,
  legend: ({ name, options }) => [
    !options.drawing
      ? `The ${name} seen from above as you play it: the mouthpiece on the left, the bell on the right, and the valves between, 1 nearest you.`
      : DRAWINGS[options.drawing].upright
        ? `The ${name} as it stands, seen from the front: the valves on top, 1 nearest the mouthpiece and you, so 3 2 1 from the left. Each note's diagram is its valves alone, 1 2 3 from the left${(options.valves?.length ?? 3) > 3 && options.sideValve ? ", the 4th lower and apart" : ""}.`
        : `The ${name} from the side: the mouthpiece on the left, the bell on the right, the valves on top, 1 nearest the mouthpiece. Each note's diagram is its valves alone, 1 2 3 from the left.`,
    "<b>Filled is pressed, outlined is up.</b> The right hand plays the valves: 1 the index, 2 the middle, 3 the ring finger.",
    ...((options.valves?.length ?? 3) > 3 ? [options.sideValve
      ? `The <b>4th valve</b>, on the side, lowers a fourth, like 1 and 3 together but better in tune. The left index finger presses it. It's there on a compensating ${name}, this chart's; one with all four valves in a row on top (a student's, mostly) isn't compensating, and its 4th is the right pinky's.`
      : "The <b>4th valve</b>, set apart, lowers a fourth, like 1 and 3 together but better in tune. It's pressed by the right pinky or the left hand, depending on the instrument."] : []),
    "<b>One fingering, several notes.</b> Each plays a series of notes, its harmonics, and your lips choose which: the staff tells you which note you're on.",
    "Under each diagram the same fingering in words.",
  ],
};
