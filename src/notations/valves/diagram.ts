// A valved fingering's diagram: the trumpet seen from above as it's played, the mouthpiece on the left, the
// leadpipe to the valves, the bell on the right. Each valve a circle with its number, filled when pressed: 1
// nearest the mouthpiece, the right hand's 1 2 3; a 4th (the piccolo trumpet's) set apart, as it's pressed
// by the right pinky or the left hand, depending on the trumpet.
import type { ValveFingering } from "./notation";
import { el, text } from "../../views/svg";

const Y = 40; // the valves' centre
const VALVES = [96, 136, 176, 226];

export function valvesDiagram(f: ValveFingering, label: string, valves: number, legend = false): SVGSVGElement {
  const width = 320;
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} 152` : `0 0 ${width} 104`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 22, y: Y - 4, width: 230, height: 8, rx: 4, class: "body" }, svg); // the leadpipe and valves' tubing
  el("path", { d: `M248 ${Y - 5}C272 ${Y - 7} 290 ${Y - 14} 306 ${Y - 26}V${Y + 26}C290 ${Y + 14} 272 ${Y + 7} 248 ${Y + 5}Z`, class: "body" }, svg); // the bell
  el("rect", { x: 8, y: Y - 5, width: 16, height: 10, rx: 3, class: "mouth" }, svg); // the mouthpiece
  for (let i = 0; i < valves; i++) {
    const g = el("g", { class: f.valves[i] ? "key down" : "key", "data-key": `valve${i + 1}` }, svg);
    el("circle", { cx: VALVES[i], cy: Y, r: 15 }, g);
    text(g, VALVES[i], Y + 0.5, String(i + 1));
  }
  el("path", { d: `M76 84v4H196v-4`, class: "hand" }, svg);
  text(svg, 136, 98, "RIGHT HAND", { class: "hand-name" });
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(8, 18, "mouthpiece", "start");
    call(136, 14, "valves");
    call(width - 14, 6, "bell", "end");
    if (valves > 3) call(VALVES[3], 72, "4th valve");
  }
  return svg;
}
