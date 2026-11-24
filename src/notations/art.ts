// An instrument drawn, for the key above its chart: traced by hand from a photo of it (art/: each drawing's
// file says whose), every key or valve the diagrams use labelled where it is on the real instrument, so that the
// cards' simplified diagrams can be read against it.
//
// A drawing is its parts, back to front, in its photo's pixels: a tube (its centre line and width: drawn as two
// lines, the page's colour between, so what's in front hides what's behind), a shape (filled with the page's
// colour, outlined), an open shape (filled, outlined but for its closing edge, where a tube joins it), a line
// (its width, if given, a share of the outline's), a fill (in the ink's colour: a hole, a dark pad) and a hidden
// part (dashed: a key on the far side, seen through the instrument). Then its labels, in the same pixels:
// marks (a key's: its finger's number in a circle, as on the cards, or its name in a pill, with a line to it),
// notes (words, with a line to what they name, if it isn't plain) and insets (a part of the drawing shown bigger,
// in a circle, with its own marks), and the box the drawing's shown in. scale makes its pixels the page's.
import { el, text } from "../views/svg";

export type Point = [number, number];
export type Part = ["tube", string, number] | ["shape", string] | ["open", string] | ["line", string, number?] | ["fill", string] | ["hidden", string];
export type Mark = { key: string; n?: number; text?: string; at: Point; to: Point; minor?: boolean };
export type Note = { at: Point; text: string[]; anchor?: "start" | "middle" | "end"; to?: Point; hand?: boolean };
export type Inset = { from: Point; r: number; at: Point; zoom: number; marks?: Mark[]; notes?: Note[] };
type Labels = { box: [number, number, number, number]; marks: Mark[]; notes: Note[]; insets?: Inset[] };
export type Art = Labels & {
  width: number; height: number; scale: number; wide?: boolean; parts: Part[];
  turned?: boolean; // (stood up on every screen: a clarinet, as it's played and charted)
  portrait?: Labels; // (a wide one's, for a narrow screen: see drawArt)
};

const LINE = 1.4; // the outline, at the page's size
const R = 8.5; // a finger's or valve's circle

// The drawing, labelled. A photo taken lying down can be drawn stood up, turned a quarter clockwise (its left
// end at the top): its parts and its marks' and insets' points are the photo's, turned; its labels', its insets'
// places and its box are in the turned drawing's pixels (x across from the left, y down from the top). A
// clarinet is always drawn so (turned); a wide one (a flute) may have it as a second layout, for a narrow
// screen (portrait), the page showing one or the other (styles.css).
export function drawArt(a: Art, label: string): SVGSVGElement | HTMLElement {
  const main = render(a, a, a.turned ?? false, label, a.portrait ? "landscape" : "");
  if (!a.portrait) return main;
  const both = document.createElement("div");
  both.className = "art-layouts";
  both.append(main, render(a, a.portrait, true, label, "portrait"));
  return both;
}

function render(a: Art, l: Labels, turned: boolean, label: string, layout: string): SVGSVGElement {
  const s = a.scale;
  const [x0, y0, x1, y1] = l.box;
  const svg = el("svg", {
    viewBox: `${x0 * s} ${y0 * s} ${(x1 - x0) * s} ${(y1 - y0) * s}`, class: `keys legend-keys drawing${a.wide && !a.turned ? " wide" : ""}${layout ? ` ${layout}` : ""}`, role: "img", "aria-label": label,
    style: `width: ${((x1 - x0) * s) / 16}rem`,
  });
  // A point of the drawing's in the layout: turned, a quarter clockwise, (x, y) is (height − y, x).
  const turn = (p: Point): Point => (turned ? [a.height - p[1], p[0]] : p);
  const spin = turned ? ` translate(${a.height} 0) rotate(90)` : "";
  paint(el("g", { transform: `scale(${s})${spin}`, class: "art" }, svg), a.parts, s);
  const id = `inset-${Math.random().toString(36).slice(2, 8)}`;
  (l.insets ?? []).forEach((inset, i) => {
    const k = s * inset.zoom, [fx, fy] = turn(inset.from), [ax, ay] = inset.at, big = inset.r * inset.zoom;
    // The lens on the drawing, a line to the inset, and the inset: the drawing again, bigger, in a circle.
    const dx = ax - fx, dy = ay - fy, len = Math.hypot(dx, dy);
    if (len > inset.r + big) el("path", { d: `M${(fx + (dx / len) * inset.r) * s} ${(fy + (dy / len) * inset.r) * s}L${(ax - (dx / len) * big) * s} ${(ay - (dy / len) * big) * s}`, class: "lens" }, svg);
    el("circle", { cx: fx * s, cy: fy * s, r: inset.r * s, class: "lens" }, svg);
    const clip = el("clipPath", { id: `${id}-${i}` }, el("defs", {}, svg));
    el("circle", { cx: ax * s, cy: ay * s, r: big * s }, clip);
    el("circle", { cx: ax * s, cy: ay * s, r: big * s, class: "inset-ground" }, svg);
    const g = el("g", { "clip-path": `url(#${id}-${i})` }, svg);
    paint(el("g", { transform: `translate(${ax * s} ${ay * s}) scale(${k}) translate(${-fx} ${-fy})${spin}`, class: "art" }, g), a.parts, k);
    el("circle", { cx: ax * s, cy: ay * s, r: big * s, class: "inset-edge" }, svg);
  });
  // Where a point on the drawing is on the page: in an inset, through its zoom.
  const place = (p: Point, inset?: Inset): Point => {
    const [x, y] = turn(p);
    if (!inset) return [x * s, y * s];
    const [fx, fy] = turn(inset.from);
    return [(inset.at[0] + (x - fx) * inset.zoom) * s, (inset.at[1] + (y - fy) * inset.zoom) * s];
  };
  const notes = (list: Note[], inset?: Inset) => list.forEach((n) => {
    const [x, y] = [n.at[0] * s, n.at[1] * s];
    if (n.to) { // (from the words' edge nearest what they name: above or below them, or beside)
      const [tx, ty] = place(n.to, inset), half = (n.text.length * 11) / 2 + 2;
      const wide = Math.max(...n.text.map((t) => t.length)) * 2.7 + 3; // (half the words' width: DM Mono's 0.6em at 9px)
      const [sx, sy] = Math.abs(ty - y) > half ? [x, ty < y ? y - half : y + half] : [n.anchor === "start" ? x - 3 : n.anchor === "end" ? x + 3 : tx > x ? x + wide : x - wide, y];
      el("path", { d: `M${sx} ${sy}L${tx} ${ty}`, class: "leader" }, svg);
      el("circle", { cx: tx, cy: ty, r: 1.3, class: "pin" }, svg);
    }
    n.text.forEach((t, i) => text(svg, x, y + (i - (n.text.length - 1) / 2) * 11, t, { class: n.hand ? "hand-name" : "callout", "text-anchor": n.anchor ?? "middle", "dominant-baseline": "central" }));
  });
  const marks = (list: Mark[], inset?: Inset) => {
    for (const m of list) { // the lines first, under every label
      const [ax, ay] = place(m.at, inset);
      el("path", { d: `M${ax} ${ay}L${m.to[0] * s} ${m.to[1] * s}`, class: "leader" }, svg);
      el("circle", { cx: ax, cy: ay, r: 1.3, class: "pin" }, svg);
    }
    for (const m of list) {
      const [x, y] = [m.to[0] * s, m.to[1] * s];
      const g = el("g", { class: `key${m.n ? "" : " small"}${m.minor ? " minor" : ""}`, "data-key": m.key }, svg);
      if (m.n) {
        el("circle", { cx: x, cy: y, r: R }, g);
        text(g, x, y + 0.5, String(m.n));
      } else {
        const w = [...m.text!].length * 5.8 + 9;
        el("rect", { x: x - w / 2, y: y - 7, width: w, height: 14, rx: 7 }, g);
        text(g, x, y + 0.5, m.text!);
      }
    }
  };
  notes(l.notes);
  (l.insets ?? []).forEach((inset) => notes(inset.notes ?? [], inset));
  marks(l.marks);
  (l.insets ?? []).forEach((inset) => marks(inset.marks ?? [], inset));
  return svg;
}

// The parts, at a scale of k page pixels to the drawing's (the outline the same width at any).
function paint(g: SVGGElement, parts: Part[], k: number) {
  const line = LINE / k;
  for (const [kind, path, size] of parts) {
    if (kind === "tube") {
      el("path", { d: path, class: "ink", "stroke-width": size! + 2 * line }, g);
      el("path", { d: path, class: "paper", "stroke-width": size! }, g);
    } else if (kind === "shape") el("path", { d: path, class: "sheet", "stroke-width": line }, g);
    else if (kind === "open") {
      el("path", { d: `${path}Z`, class: "sheet bare" }, g);
      el("path", { d: path, class: "ink", "stroke-width": line }, g);
    } else if (kind === "fill") el("path", { d: path, class: "solid" }, g);
    else if (kind === "hidden") el("path", { d: path, class: "ink", "stroke-width": line * 0.9, "stroke-dasharray": `${3 / k} ${2.2 / k}` }, g);
    else el("path", { d: path, class: "ink", "stroke-width": line * (size ?? 1) }, g);
  }
}
