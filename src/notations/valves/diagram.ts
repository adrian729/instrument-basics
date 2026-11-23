// A valved fingering's diagram: the instrument seen from above as it's played, the mouthpiece on the left, the
// leadpipe to the valves, the bell on the right. Each valve a circle with its number, filled when pressed: 1
// nearest the mouthpiece, the right hand's 1 2 3. A trumpet's bell lies flat; an upright instrument's (the
// tenor horn, baritone, euphonium) rises from its tubing, outlined, its valves in one casing. A 4th valve is
// set apart: the piccolo trumpet's, pressed by the right pinky or the left hand, depending on the trumpet;
// or on the side, in its own casing, the left hand's (a compensating euphonium's).
import type { ValveFingering } from "./notation";
import { el, text } from "../../views/svg";

const Y = 40; // the valves' centre
const VALVES = [96, 136, 176, 226];

export function valvesDiagram(f: ValveFingering, label: string, valves: number, upright: boolean, side: boolean, legend = false): SVGSVGElement {
  const width = 320;
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} 152` : `0 0 ${width} 104`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  if (upright) {
    el("rect", { x: 22, y: Y - 4, width: 270, height: 8, rx: 4, class: "body" }, svg); // the leadpipe and tubing, to the bell
    el("rect", { x: 74, y: Y - 21, width: 124, height: 42, rx: 10, class: "body" }, svg); // the valves' casing
    if (side && valves > 3) el("rect", { x: VALVES[3] - 19, y: Y - 21, width: 38, height: 42, rx: 10, class: "body" }, svg); // the 4th's, on the side
    el("path", { d: `M274 ${Y + 4}V${Y - 8}C274 ${Y - 20} 268 ${Y - 29} 256 ${Y - 36}H312C300 ${Y - 29} 294 ${Y - 20} 294 ${Y - 8}V${Y + 4}Z`, class: "body bell" }, svg); // the bell, up
  } else {
    el("rect", { x: 22, y: Y - 4, width: 230, height: 8, rx: 4, class: "body" }, svg); // the leadpipe and valves' tubing
    el("path", { d: `M248 ${Y - 5}C272 ${Y - 7} 290 ${Y - 14} 306 ${Y - 26}V${Y + 26}C290 ${Y + 14} 272 ${Y + 7} 248 ${Y + 5}Z`, class: "body" }, svg); // the bell
  }
  el("rect", { x: 8, y: Y - 5, width: 16, height: 10, rx: 3, class: "mouth" }, svg); // the mouthpiece
  for (let i = 0; i < valves; i++) {
    const g = el("g", { class: f.valves[i] ? "key down" : "key", "data-key": `valve${i + 1}` }, svg);
    el("circle", { cx: VALVES[i], cy: Y, r: 15 }, g);
    text(g, VALVES[i], Y + 0.5, String(i + 1));
  }
  const hand = (x1: number, x2: number, name: string) => {
    el("path", { d: `M${x1} 84v4H${x2}v-4`, class: "hand" }, svg);
    text(svg, (x1 + x2) / 2, 98, name, { class: "hand-name" });
  };
  hand(76, 196, "RIGHT HAND");
  if (side && valves > 3) hand(VALVES[3] - 22, VALVES[3] + 22, "LEFT");
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(8, 18, "mouthpiece", "start");
    call(136, upright ? 8 : 14, "valves");
    call(width - 14, upright ? -6 : 6, upright ? "bell (up)" : "bell", "end");
    if (valves > 3) call(VALVES[3], 72, side ? "4th, on the side" : "4th valve");
  }
  return svg;
}
