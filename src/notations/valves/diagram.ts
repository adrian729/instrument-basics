// A valved fingering's diagram. Each valve a circle with its number, filled when pressed, 1 nearest the
// mouthpiece: the right hand's 1 2 3, and a 4th set apart. Most draw the instrument simplified, seen from above
// as it's played: the mouthpiece on the left, the leadpipe to the valves, the bell on the right, the bell its own
// (the trumpet's, the cornet's shorter and conical, the flugelhorn's wide, the mellophone's large); the piccolo
// trumpet's 4th valve pressed by the right pinky or the left hand, depending on the trumpet. An upright one's
// (the tenor horn's, baritone's, euphonium's) is its valves alone, as the usual charts draw them, 1 2 3 from
// the left; on a compensating euphonium the 4th on the side, lower down, the left index finger's ("midway down
// the right side": Wikipedia's "Euphonium"; Brass Techniques and Pedagogy, "The Euphonium"). The key above the
// chart is the instrument itself, drawn (../art.ts).
import type { ValveFingering } from "./notation";
import type { Bell } from "../../data/instrument";
import { el, text } from "../../views/svg";

const Y = 40; // the valves' centre
const VALVES = [96, 136, 176, 226];
const SIDE = 12; // how much lower a side 4th valve is drawn

// Each bell's outline, above the tubing: where it starts flaring, its curve's two control points and its rim,
// as [x, height above the centre]. The cornet's starts at the valves (its bore conical), the flugelhorn's too
// and widest, the mellophone's the largest rim.
const BELLS: Record<Bell, number[][]> = {
  trumpet: [[248, 5], [272, 7], [290, 14], [306, 26]],
  cornet: [[214, 5], [258, 8], [284, 13], [300, 24]],
  flugelhorn: [[196, 6], [250, 10], [286, 20], [304, 32]],
  mellophone: [[236, 5], [268, 8], [286, 20], [300, 34]],
};

export function valvesDiagram(f: ValveFingering, label: string, valves: number, bell: Bell, alone: boolean, side: boolean, legend = false): SVGSVGElement {
  if (alone && !legend) return valvesOnly(f, label, valves, side);
  const width = 320;
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} 152` : `0 0 ${width} 104`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  const [p0, p1, p2, p3] = BELLS[bell];
  el("rect", { x: 22, y: Y - 4, width: p0[0] - 18, height: 8, rx: 4, class: "body" }, svg); // the leadpipe and valves' tubing
  el("path", { d: `M${p0[0]} ${Y - p0[1]}C${p1[0]} ${Y - p1[1]} ${p2[0]} ${Y - p2[1]} ${p3[0]} ${Y - p3[1]}V${Y + p3[1]}C${p2[0]} ${Y + p2[1]} ${p1[0]} ${Y + p1[1]} ${p0[0]} ${Y + p0[1]}Z`, class: "body" }, svg); // the bell
  el("rect", { x: 8, y: Y - 5, width: 16, height: 10, rx: 3, class: "mouth" }, svg); // the mouthpiece
  for (let i = 0; i < valves; i++) valve(svg, i, VALVES[i], Y, f.valves[i]);
  el("path", { d: `M76 84v4H196v-4`, class: "hand" }, svg);
  text(svg, 136, 98, "RIGHT HAND", { class: "hand-name" });
  return svg;
}

function valve(svg: SVGSVGElement, i: number, cx: number, cy: number, down: boolean, r = 15) {
  const g = el("g", { class: down ? "key down" : "key", "data-key": `valve${i + 1}` }, svg);
  el("circle", { cx, cy, r }, g);
  text(g, cx, cy + 0.5, String(i + 1));
}

// The valves alone, in a row, a side 4th lower and apart.
function valvesOnly(f: ValveFingering, label: string, valves: number, side: boolean): SVGSVGElement {
  const xs = [18, 54, 90, 132];
  const width = valves > 3 ? 152 : 110, height = side && valves > 3 ? 36 + SIDE : 36;
  const svg = el("svg", { viewBox: `0 0 ${width} ${height}`, class: "keys valves-only", role: "img", "aria-label": label, style: `width: ${(width * 1.1) / 16}rem` }); // (at a trumpet's valves' size)
  for (let i = 0; i < valves; i++) valve(svg, i, xs[i], 18 + (side && i === 3 ? SIDE : 0), f.valves[i]);
  return svg;
}
