// A German-system (Oehler) clarinet fingering's diagram, laid out as the Boehm clarinet's (../clarinet/diagram.ts):
// the clarinet standing, facing you, the mouthpiece at the top, the left hand's keys and then the right's down
// it. The finger holes are circles with their numbers, the sliver keys small ones between them (F between left
// 1 and 2, E♭ between left 2 and 3, B♭ between right 2 and 3), the other keys pills with their names, each on
// the side it's on (as the photo the key's drawing is traced from has them): on the right (the player's left),
// the side G♯ key and the left pinky's (C♯ the topmost, then F♯ and E further out, then its B♭ and G♯ levers,
// dashed: only some models have them); on the left (the player's right), the four side keys, 1 the topmost, and
// the right pinky's (G♯, F under it). The A key on the front, above left 1; the thumb's hole and register key,
// behind, drawn on the left at the top. Filled is pressed.
import type { OehlerFingering, OehlerKey } from "./notation";
import { el, text } from "../../views/svg";

const X = 60; // the body's axis
const LEFT = [56, 92, 128], RIGHT = [194, 230, 266]; // the finger holes' centres, down it
const NEAR = { left: 24, right: 76 }, FAR = { right: 100 }; // the side keys' columns: by the body, further out
const ROW = 17;

export function oehlerDiagram(f: OehlerFingering, label: string, legend = false): SVGSVGElement {
  const end = 310; // the body's foot
  const svg = el("svg", { viewBox: `-4 0 130 ${end + 4}`, class: `keys tall${legend ? " legend-keys" : ""}`, role: "img", "aria-label": label, style: "width: 8.5rem" });
  el("rect", { x: X - 10, y: 20, width: 20, height: end - 20, rx: 6, class: "body" }, svg);
  el("path", { d: `M${X - 5} 3H${X + 5}L${X + 7} 21H${X - 7}Z`, class: "mouth" }, svg);
  const on = (k: OehlerKey) => f.keys.includes(k);

  const hole = (cy: number, n: number, down: boolean, hand: string) => {
    const g = el("g", { class: down ? "key down" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx: X, cy, r: 12 }, g);
    text(g, X, cy + 0.5, String(n));
  };
  const small = (key: string, cy: number, down: boolean) => {
    const g = el("g", { class: `key small${down ? " down" : ""}`, "data-key": key }, svg);
    el("circle", { cx: X, cy, r: 5 }, g);
  };
  const pill = (key: string, x: number, y: number, w: number, name: string, down: boolean, minor = false) => {
    const g = el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, name);
  };

  // The left hand: the thumb's, behind; the A key and the side G♯; the fingers and the slivers; the pinky's.
  pill("register", 16, 26, 28, "reg", on("R"));
  const t = el("g", { class: on("T") ? "key small down" : "key small", "data-key": "thumb" }, svg);
  el("circle", { cx: 30, cy: 54, r: 7.5 }, t);
  text(t, 30, 54.5, "T");
  pill("a-key", X - 10, 24, 20, "A", on("A"));
  pill("g-sharp", NEAR.right, 30, 22, "G♯", on("G#"));
  hole(LEFT[0], 1, f.left[0], "left");
  small("sliver-f", 74, on("sF"));
  hole(LEFT[1], 2, f.left[1], "left");
  small("sliver-e-flat", 110, on("Eb"));
  hole(LEFT[2], 3, f.left[2], "left");
  pill("left-c-sharp", NEAR.right, 134, 22, "C♯", on("lC#"));
  pill("left-f-sharp", NEAR.right, 134 + ROW, 22, "F♯", on("lF#"));
  pill("left-e", FAR.right, 134 + ROW, 22, "E", on("lE"));
  pill("lever-b-flat", NEAR.right, 134 + 2 * ROW, 22, "B♭", on("levBb"), true);
  pill("lever-g-sharp", FAR.right, 134 + 2 * ROW, 22, "G♯", on("levG#"), true);
  // The right hand: the side keys; the fingers and the B♭ sliver; the pinky's.
  for (let i = 0; i < 4; i++) pill(`side${i + 1}`, 26, 138 + i * ROW, 19, String(i + 1), on(`s${i + 1}` as OehlerKey));
  hole(RIGHT[0], 1, f.right[0], "right");
  hole(RIGHT[1], 2, f.right[1], "right");
  small("sliver-b-flat", 248, on("Bb"));
  hole(RIGHT[2], 3, f.right[2], "right");
  pill("right-g-sharp", NEAR.left, 274, 22, "G♯", on("rG#"));
  pill("right-f", NEAR.left, 274 + ROW, 22, "F", on("rF"));
  return svg;
}
