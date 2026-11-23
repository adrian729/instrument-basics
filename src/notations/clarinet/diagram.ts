// A clarinet fingering's diagram: its keys laid out along the instrument, the mouthpiece on the left, the
// left hand's keys and then the right's, as they go down it (as The Woodwind Fingering Guide's labelled photo
// has them). The finger holes are circles with their numbers (the sliver keys small ones between 2 and 3),
// the other keys pills with their names. Above the body, the A and side G♯ keys by left 1, and the side keys
// by right 1; below it, the left thumb's hole and register key, the little fingers' keys (and the bass
// clarinet's lowest: low E♭ by the right pinky, low D, C♯ and C under the right thumb). Filled is pressed;
// a half-holed left 1 half filled.
import type { ClarinetFingering, ClarinetKey } from "./notation";
import { el, text } from "../../views/svg";

const LEFT = [132, 162, 200];
const RIGHT = [292, 322, 362];
const Y = 40; // the finger holes' centre
const ABOVE = 8, UNDER = 60, ROW = 17; // the pills' rows: above the body, and two below it (three for a bass clarinet)

export function clarinetDiagram(f: ClarinetFingering, label: string, bass: boolean, legend = false): SVGSVGElement {
  const width = 410, rows = bass ? 2 * ROW : ROW; // (below the first row of pills)
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} ${152 + rows}` : `0 0 ${width} ${104 + rows}`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 8, y: 30, width: width - 16, height: 20, rx: 6, class: "body" }, svg);
  el("path", { d: `M10 ${Y - 4}L34 ${Y - 6}V${Y + 6}L10 ${Y + 4}Z`, class: "mouth" }, svg);
  const on = (k: ClarinetKey) => f.keys.includes(k);

  const hole = (cx: number, n: number, down: boolean | "half", hand: string) => {
    const g = el("g", { class: down === true ? "key down" : down === "half" ? "key half" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx, cy: Y, r: 13 }, g);
    if (down === "half") el("path", { d: `M${cx - 13} ${Y}A13 13 0 0 0 ${cx + 13} ${Y}Z`, class: "half-fill" }, g);
    text(g, cx, Y + 0.5, String(n));
  };
  const small = (key: string, cx: number, down: boolean) => {
    const g = el("g", { class: `key small${down ? " down" : ""}`, "data-key": key }, svg);
    el("circle", { cx, cy: Y, r: 5.5 }, g);
  };
  const pill = (key: string, x: number, y: number, w: number, name: string, down: boolean) => {
    const g = el("g", { class: `key small${down ? " down" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, name);
  };

  // The left hand: the A and side G♯ keys above, the thumb's below, the fingers and the E♭ sliver, the pinky's.
  pill("a-key", 96, ABOVE, 20, "A", on("A"));
  pill("g-sharp", 118, ABOVE, 22, "G♯", on("G#"));
  const t = el("g", { class: on("T") ? "key small down" : "key small", "data-key": "thumb" }, svg);
  el("circle", { cx: 98, cy: UNDER + 7.5, r: 7.5 }, t);
  text(t, 98, UNDER + 8, "T");
  pill("register", 110, UNDER, 28, "reg", on("R"));
  hole(LEFT[0], 1, f.left[0], "left");
  hole(LEFT[1], 2, f.left[1], "left");
  small("sliver-e-flat", 181, on("Eb"));
  hole(LEFT[2], 3, f.left[2], "left");
  // (C♯ the topmost, F beside it, F♯ under F, E the lowest)
  pill("left-c-sharp", 214, UNDER, 22, "C♯", on("lC#"));
  pill("left-f", 238, UNDER, 22, "F", on("lF"));
  pill("left-e", 214, UNDER + ROW, 22, "E", on("lE"));
  pill("left-f-sharp", 238, UNDER + ROW, 22, "F♯", on("lF#"));
  // The right hand: the side keys above, the fingers and the B sliver, the pinky's below (and the bass
  // clarinet's: its low E♭ under the pinky's E, its thumb keys under right 1 and 2).
  for (const [i, x] of [226, 244, 262, 280].entries()) pill(`side${i + 1}`, x, ABOVE, 16, String(i + 1), on(`s${i + 1}` as ClarinetKey));
  hole(RIGHT[0], 1, f.right[0], "right");
  hole(RIGHT[1], 2, f.right[1], "right");
  small("sliver-b", 342, on("B"));
  hole(RIGHT[2], 3, f.right[2], "right");
  // (F♯ the topmost, G♯ beside it, E and F under them)
  pill("right-f-sharp", 340, UNDER, 22, "F♯", on("rF#"));
  pill("right-g-sharp", 364, UNDER, 22, "G♯", on("rG#"));
  pill("right-e", 340, UNDER + ROW, 22, "E", on("rE"));
  pill("right-f", 364, UNDER + ROW, 22, "F", on("rF"));
  if (bass) {
    pill("low-e-flat", 340, UNDER + 2 * ROW, 22, "E♭", on("lowEb"));
    pill("low-d", 266, UNDER + 2 * ROW, 18, "D", on("lowD"));
    pill("low-c-sharp", 286, UNDER + 2 * ROW, 22, "C♯", on("lowC#"));
    pill("low-c", 310, UNDER + 2 * ROW, 18, "C", on("lowC"));
  }

  const hand = (x1: number, x2: number, name: string) => {
    el("path", { d: `M${x1} ${84 + rows}v4H${x2}v-4`, class: "hand" }, svg);
    text(svg, (x1 + x2) / 2, 98 + rows, name, { class: "hand-name" });
  };
  hand(90, 262, "LEFT HAND");
  hand(268, width - 8, "RIGHT HAND");
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(8, 68, "mouthpiece", "start");
    call(118, -6, "throat keys");
    call(262, -6, "side keys (right hand)");
    const y1 = 114 + rows, y2 = 126 + rows;
    call(118, y1, "thumb");
    call(237, y1, "left pinky");
    if (bass) call(298, y2, "right thumb", "end");
    call(width - 4, y2, "right pinky", "end");
  }
  return svg;
}
