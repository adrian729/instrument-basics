// A valved fingering's diagram. Each valve a circle with its number, filled when pressed, 1 nearest the
// mouthpiece: the right hand's 1 2 3, and a 4th set apart. A trumpet's is the instrument seen from above as
// it's played: the mouthpiece on the
// left, the leadpipe to the valves, the bell on the right; the piccolo trumpet's 4th valve pressed by the right
// pinky or the left hand, depending on the trumpet. The other instruments' (each drawn: drawings.ts) is their
// valves alone, as the usual charts draw them, 1 2 3 from the left, and the key's diagram the instrument
// itself, its valves numbered where they are; on a compensating euphonium the 4th on the side, lower down,
// the left index finger's ("midway down the right side": Wikipedia's "Euphonium"; Brass Techniques and
// Pedagogy, "The Euphonium").
import type { ValveFingering } from "./notation";
import type { Drawn } from "../../data/instrument";
import { el, text } from "../../views/svg";
import { DRAWINGS, type Drawing } from "./drawings";

const Y = 40; // the valves' centre
const VALVES = [96, 136, 176, 226];
const SIDE = 12; // how much lower a side 4th valve is drawn

export function valvesDiagram(f: ValveFingering, label: string, valves: number, drawing: Drawn | undefined, side: boolean, legend = false): SVGSVGElement {
  if (drawing) return legend ? drawn(f, label, valves, DRAWINGS[drawing]) : valvesOnly(f, label, valves, side);
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

// The key's: the instrument drawn (drawings.ts), scaled to a size of the page's (the upright ones 300 high, the
// others 330 wide, so their lines and words come out alike), each valve's number over its button, the 4th's
// beside its own, and the callouts.
function drawn(f: ValveFingering, label: string, valves: number, d: Drawing): SVGSVGElement {
  const s = d.upright ? 300 / d.height : 330 / d.width;
  const w = d.width * s, h = d.height * s;
  const [left, right, top, bottom] = d.upright ? [d.fourth ? 66 : 8, 40, 6, 22] : [62, 34, 22, 8];
  const svg = el("svg", { viewBox: `${-left} ${-top} ${w + left + right} ${h + top + bottom}`, class: `keys legend-keys drawing ${d.upright ? "upright" : "lying"}`, role: "img", "aria-label": label });
  const art = el("g", { transform: `scale(${s})`, class: "art" }, svg);
  const line = 1.4 / s; // (the outline, 1.4 at the page's size)
  for (const [kind, path, size] of d.parts) {
    if (kind === "tube") {
      el("path", { d: path, class: "ink", "stroke-width": size + 2 * line }, art);
      el("path", { d: path, class: "paper", "stroke-width": size }, art);
    } else if (kind === "shape") el("path", { d: path, class: "sheet", "stroke-width": line }, art);
    else if (kind === "open") {
      el("path", { d: `${path}Z`, class: "sheet bare" }, art);
      el("path", { d: path, class: "ink", "stroke-width": line }, art);
    } else el("path", { d: path, class: "ink", "stroke-width": line * (size ?? 1) }, art);
  }
  // The numbers spread out over the buttons, a line from each down to its own.
  const mid = (d.buttons[0][0] + d.buttons[2][0]) * s / 2, gap = d.upright ? -22 : 22;
  d.buttons.slice(0, 3).forEach(([x, y], i) => {
    const cx = mid + (i - 1) * gap, cy = y * s - 26;
    el("path", { d: `M${cx} ${cy + 8.5}L${x * s} ${y * s - 3}`, class: "leader" }, svg);
    valve(svg, i, cx, cy, f.valves[i], 8.5);
  });
  if (valves > 3 && d.fourth) valve(svg, 3, d.fourth[0] * s - 4, d.fourth[1] * s - 16, f.valves[3], 8.5);
  for (const c of d.callouts) c.text.forEach((t, i) => text(svg, c.at[0] * s + (c.dx ?? 0), c.at[1] * s + (c.dy ?? 0) + i * 11, t, { class: "callout", "text-anchor": c.anchor ?? "middle" }));
  return svg;
}
