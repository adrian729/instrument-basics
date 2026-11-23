// A saxophone fingering's diagram, as the usual charts draw it (Conn-Selmer's basic chart, for one): the keys
// in a column down the instrument, the neck at the top, the saxophone facing you, each key drawn in its shape
// and where it is, with no body and no names, as a player knows them by where they are. Down the column, the
// left hand's 1, the bis key, 2 and 3, then the right hand's 1, 2, the alternate F♯ key and 3, the numbers
// the fingers. Around it: at the top, the front F key above left 1, the octave key (the baritone's low A key
// under it) beside it, under the left thumb; the palm keys up on the right (E♭ the topmost, D the outermost,
// F the lower: The Woodwind Fingering Guide's sax_fing page); the left pinky's table on the right, under left
// 3 (G♯ the topmost, B the inner, C♯ the outer, B♭ the bottommost); the side keys on the left, by the right
// hand (E, C and B♭ down, the high F♯ key above them); the right pinky's E♭ and C under right 3. Filled is
// pressed; keys few fingerings use dashed while up. The key's diagram names them.
import type { SaxFingering, SaxKey } from "./notation";
import { el, text } from "../../views/svg";

const X = 60; // the column
const LEFT = [42, 76, 106], RIGHT = [168, 198, 228]; // the finger keys' centres, down it

export function saxDiagram(f: SaxFingering, label: string, lowA: boolean, legend = false): SVGSVGElement {
  const svg = el("svg", { viewBox: legend ? "-62 0 250 262" : "16 4 92 256", class: legend ? "keys tall legend-keys" : "keys tall", role: "img", "aria-label": label });
  const on = (k: SaxKey) => f.keys.includes(k);
  const key = (name: string, down: boolean, minor = false) => el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": name }, svg);

  const finger = (cy: number, n: number, down: boolean, hand: string) => {
    const g = el("g", { class: down ? "key down" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx: X, cy, r: 12 }, g);
    text(g, X, cy + 0.5, String(n));
  };
  const dot = (name: string, cx: number, cy: number, r: number, down: boolean, minor = false) => el("circle", { cx, cy, r }, key(name, down, minor));
  const bar = (name: string, x: number, y: number, w: number, h: number, down: boolean, minor = false, turn = 0) =>
    el("rect", { x, y, width: w, height: h, rx: Math.min(w, h) / 2, ...(turn ? { transform: `rotate(${turn} ${x + w / 2} ${y + h / 2})` } : {}) }, key(name, down, minor));

  // The left hand: the front F key, the octave key (and low A), the palm keys, the fingers and bis, the pinky's table.
  bar("front-f", X - 7, 14, 14, 7, on("fF"), true);
  bar("octave", X - 34, 30, 9, 17, on("T"));
  if (lowA) bar("low-a", X - 34, 52, 9, 13, on("lowA"));
  bar("palm-e-flat", X + 18, 12, 8, 16, on("pEb"), false, 25);
  bar("palm-d", X + 31, 26, 8, 16, on("pD"), false, 25);
  bar("palm-f", X + 19, 40, 8, 16, on("pF"), false, 25);
  finger(LEFT[0], 1, f.left[0], "left");
  dot("bis", X, 59, 4.5, on("bis"));
  finger(LEFT[1], 2, f.left[1], "left");
  finger(LEFT[2], 3, f.left[2], "left");
  bar("g-sharp", X + 16, 114, 22, 8, on("G#"));
  bar("low-b", X + 16, 125, 10, 15, on("lowB"));
  bar("low-c-sharp", X + 29, 125, 10, 15, on("lowC#"));
  bar("low-b-flat", X + 16, 143, 22, 8, on("lowBb"));
  // The right hand: the side keys (and the high F♯ key), the fingers and the alternate F♯ key, the pinky's.
  bar("high-f-sharp", X - 34, 128, 8, 14, on("hiF#"), true);
  bar("side-e", X - 34, 146, 8, 19, on("sE"));
  bar("side-c", X - 34, 168, 8, 19, on("sC"));
  bar("side-b-flat", X - 34, 190, 8, 19, on("sBb"));
  finger(RIGHT[0], 1, f.right[0], "right");
  finger(RIGHT[1], 2, f.right[1], "right");
  dot("alt-f-sharp", X + 20, 213, 4.5, on("altF#"), true);
  finger(RIGHT[2], 3, f.right[2], "right");
  bar("e-flat", X - 36, 238, 22, 8, on("Eb"));
  bar("low-c", X - 36, 249, 22, 8, on("lowC"));

  if (legend) { // each key named, and what's whose
    const name = (x: number, y: number, t: string, anchor = "start") => text(svg, x, y, t, { class: "key-name", "text-anchor": anchor });
    const call = (x: number, y: number, t: string, anchor = "end") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    name(X + 30, 15, "E♭"); name(X + 44, 30, "D"); name(X + 31, 50, "F");
    call(X + 66, 30, "palm keys", "start");
    call(X - 12, 18, "front F");
    call(X - 38, 39, "octave key");
    if (lowA) call(X - 38, 59, "low A");
    name(X + 8, 59, "bis", "start");
    name(X + 41, 118, "G♯"); name(X + 42, 135, "C♯"); name(X + 41, 147, "B♭"); name(X + 13, 133, "B", "end");
    call(X + 50, 165, "left pinky", "start");
    name(X - 38, 136, "F♯", "end"); name(X - 38, 156, "E", "end"); name(X - 38, 178, "C", "end"); name(X - 38, 200, "B♭", "end");
    call(X - 50, 220, "side keys", "end");
    name(X + 26, 213, "alt F♯");
    name(X - 40, 248, "E♭ C", "end"); call(X - 40, 259, "right pinky");
    call(X + 22, 92, "LEFT HAND", "start"); call(X + 22, 198, "RIGHT HAND", "start");
  }
  return svg;
}
