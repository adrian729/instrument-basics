// A German-system (Oehler) clarinet fingering's diagram, laid out as the Boehm clarinet's (../clarinet/diagram.ts):
// the mouthpiece on the left, the left hand's keys and then the right's, as they go down the instrument. The
// finger holes are circles with their numbers, the sliver keys small ones between them (F between left 1 and 2,
// E♭ between left 2 and 3, B♭ between right 2 and 3), the other keys pills with their names. Above the body,
// the A and side G♯ keys by left 1, and the side keys by right 1; below it, the left thumb's hole and register
// key, the left pinky's keys (C♯ and E, F♯ under E, its G♯ and B♭ levers dashed under them: only some models
// have them) and the right pinky's (G♯, F under it). Filled is pressed.
import type { OehlerFingering, OehlerKey } from "./notation";
import { el, text } from "../../views/svg";

const LEFT = [128, 166, 204];
const RIGHT = [292, 322, 362];
const Y = 40; // the finger holes' centre
const ABOVE = 8, UNDER = 60, ROW = 17; // the pills' rows: above the body, and three below it

export function oehlerDiagram(f: OehlerFingering, label: string, legend = false): SVGSVGElement {
  const width = 410, rows = 2 * ROW; // (below the first row of pills)
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} ${152 + rows}` : `0 0 ${width} ${104 + rows}`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 8, y: 30, width: width - 16, height: 20, rx: 6, class: "body" }, svg);
  el("path", { d: `M10 ${Y - 4}L34 ${Y - 6}V${Y + 6}L10 ${Y + 4}Z`, class: "mouth" }, svg);
  const on = (k: OehlerKey) => f.keys.includes(k);

  const hole = (cx: number, n: number, down: boolean, hand: string) => {
    const g = el("g", { class: down ? "key down" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx, cy: Y, r: 13 }, g);
    text(g, cx, Y + 0.5, String(n));
  };
  const small = (key: string, cx: number, down: boolean) => {
    const g = el("g", { class: `key small${down ? " down" : ""}`, "data-key": key }, svg);
    el("circle", { cx, cy: Y, r: 5.5 }, g);
  };
  const pill = (key: string, x: number, y: number, w: number, name: string, down: boolean, minor = false) => {
    const g = el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, name);
  };

  // The left hand: the A and side G♯ keys above, the thumb's below, the fingers and the slivers, the pinky's.
  pill("a-key", 92, ABOVE, 20, "A", on("A"));
  pill("g-sharp", 114, ABOVE, 22, "G♯", on("G#"));
  const t = el("g", { class: on("T") ? "key small down" : "key small", "data-key": "thumb" }, svg);
  el("circle", { cx: 92, cy: UNDER + 7.5, r: 7.5 }, t);
  text(t, 92, UNDER + 8, "T");
  pill("register", 104, UNDER, 28, "reg", on("R"));
  hole(LEFT[0], 1, f.left[0], "left");
  small("sliver-f", 147, on("sF"));
  hole(LEFT[1], 2, f.left[1], "left");
  small("sliver-e-flat", 185, on("Eb"));
  hole(LEFT[2], 3, f.left[2], "left");
  pill("left-c-sharp", 214, UNDER, 22, "C♯", on("lC#"));
  pill("left-e", 238, UNDER, 22, "E", on("lE"));
  pill("left-f-sharp", 238, UNDER + ROW, 22, "F♯", on("lF#"));
  pill("lever-g-sharp", 214, UNDER + 2 * ROW, 22, "G♯", on("levG#"), true);
  pill("lever-b-flat", 238, UNDER + 2 * ROW, 22, "B♭", on("levBb"), true);
  // The right hand: the side keys above, the fingers and the B♭ sliver, the pinky's below.
  for (const [i, x] of [220, 243, 266, 289].entries()) pill(`side${i + 1}`, x, ABOVE, 19, String(i + 1), on(`s${i + 1}` as OehlerKey));
  hole(RIGHT[0], 1, f.right[0], "right");
  hole(RIGHT[1], 2, f.right[1], "right");
  small("sliver-b-flat", 342, on("Bb"));
  hole(RIGHT[2], 3, f.right[2], "right");
  pill("right-g-sharp", 352, UNDER, 22, "G♯", on("rG#"));
  pill("right-f", 352, UNDER + ROW, 22, "F", on("rF"));

  const hand = (x1: number, x2: number, name: string) => {
    el("path", { d: `M${x1} ${84 + rows}v4H${x2}v-4`, class: "hand" }, svg);
    text(svg, (x1 + x2) / 2, 98 + rows, name, { class: "hand-name" });
  };
  hand(86, 262, "LEFT HAND");
  hand(268, width - 8, "RIGHT HAND");
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(8, 68, "mouthpiece", "start");
    call(114, -6, "throat keys");
    call(262, -6, "side keys (right hand)");
    call(112, 114 + rows, "thumb");
    call(237, 114 + rows, "left pinky");
    call(width - 4, 114 + rows, "right pinky", "end");
  }
  return svg;
}
