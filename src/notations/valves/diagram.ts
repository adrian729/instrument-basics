// A valved fingering's diagram. Each valve a circle with its number, filled when pressed, 1 nearest the
// mouthpiece: the right hand's 1 2 3, and a 4th set apart. A trumpet's (and the cornet's, flugelhorn's and
// mellophone's, held the same way) is the instrument seen from above as it's played: the mouthpiece on the
// left, the leadpipe to the valves, the bell on the right; the piccolo trumpet's 4th valve pressed by the right
// pinky or the left hand, depending on the trumpet. An upright instrument's (the tenor horn, baritone,
// euphonium) is its valves alone, as the usual charts draw them: the key's diagram draws the instrument
// standing, seen from the front, its bell up and its valves on top, and on a compensating euphonium the 4th
// on the side, lower down, the left index finger's ("midway down the right side": Wikipedia's "Euphonium";
// Brass Techniques and Pedagogy, "The Euphonium").
import type { ValveFingering } from "./notation";
import { el, text } from "../../views/svg";

const Y = 40; // the valves' centre
const VALVES = [96, 136, 176, 226];
const SIDE = 12; // how much lower a side 4th valve is drawn

export function valvesDiagram(f: ValveFingering, label: string, valves: number, upright: boolean, side: boolean, legend = false): SVGSVGElement {
  if (upright) return legend ? standing(f, label, valves, side) : valvesOnly(f, label, valves, side);
  const width = 320;
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} 152` : `0 0 ${width} 104`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 22, y: Y - 4, width: 230, height: 8, rx: 4, class: "body" }, svg); // the leadpipe and valves' tubing
  el("path", { d: `M248 ${Y - 5}C272 ${Y - 7} 290 ${Y - 14} 306 ${Y - 26}V${Y + 26}C290 ${Y + 14} 272 ${Y + 7} 248 ${Y + 5}Z`, class: "body" }, svg); // the bell
  el("rect", { x: 8, y: Y - 5, width: 16, height: 10, rx: 3, class: "mouth" }, svg); // the mouthpiece
  for (let i = 0; i < valves; i++) valve(svg, i, VALVES[i], Y, f.valves[i]);
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

// The key's: the instrument standing, seen from the front, the mouthpiece on the left, the bell up on the right,
// the valves on top (their caps the circles, numbered), and a side 4th valve on the bell's tube, lower down.
function standing(f: ValveFingering, label: string, valves: number, side: boolean): SVGSVGElement {
  const svg = el("svg", { viewBox: "0 -16 340 240", class: "keys legend-keys standing", role: "img", "aria-label": label });
  const drawn = (d: string) => el("path", { d, class: "drawn" }, svg);
  // The bell, its tube and the bow under it, round to the tube up to the valves.
  drawn("M176 8C196 14 204 40 204 70V172C204 194 100 194 100 172V128H74V172C74 222 230 222 230 172V70C230 40 276 14 296 8Z");
  el("ellipse", { cx: 236, cy: 8, rx: 60, ry: 5, class: "drawn" }, svg);
  drawn("M100 136H112V146H100Z"); // into valve 1
  drawn("M180 136H204V146H180Z"); // out of valve 3, to the bell
  const cx = [122, 146, 170];
  for (const x of cx) {
    drawn(`M${x - 10} 92H${x + 10}V160H${x - 10}Z`); // the casing
    drawn(`M${x - 3} 76H${x + 3}V92H${x - 3}Z`); // the stem
  }
  drawn("M112 100L30 84V92L112 108Z"); // the leadpipe
  el("rect", { x: 12, y: 82, width: 18, height: 10, rx: 3, class: "mouth" }, svg); // the mouthpiece
  for (let i = 0; i < 3; i++) valve(svg, i, cx[i], 66, f.valves[i], 10);
  const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
  if (valves > 3) {
    const y = side ? 135 : 66, x = side ? 254 : 200;
    if (side) {
      drawn("M206 120H228V150H206Z"); // its casing, on the bell's tube
      drawn("M228 132H244V138H228Z"); // its stem
    } else drawn(`M${x - 3} 76H${x + 3}V92H${x - 3}Z`);
    valve(svg, 3, x, y, f.valves[3], 10);
    call(x + 16, y - 5, "4th valve", "start");
    if (side) call(x + 16, y + 7, "left index", "start");
  }
  call(12, 74, "mouthpiece", "start");
  call(146, 44, "valves: right hand");
  call(300, 22, "bell", "start");
  return svg;
}
