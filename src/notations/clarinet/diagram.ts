// A clarinet fingering's diagram, as the usual charts draw it (Yamaha's, for one): the clarinet standing,
// facing you, the mouthpiece at the top, the left hand's keys and then the right's down it. The finger holes
// are circles with their numbers (the sliver keys small ones between 2 and 3), the other keys pills with their
// names, each on the side of the instrument it's on: on the right (the player's left), the side G♯ key and the
// left pinky's (C♯ the topmost, F beside it, further out, then E and F♯ under them: the photo's and The
// Woodwind Fingering Guide's; the bass clarinet's low D lever under F♯); on the left (the player's right), the four side keys, 1 the topmost, between left
// 3 and right 1, and the right pinky's (G♯ and F♯ further out, then F and E under them; the bass clarinet's low
// E♭ under E). The A key on the front, above left 1; the thumb's hole and register key, behind, drawn on the
// left at the top as the charts draw them, and the bass clarinet's right thumb keys (low D, C♯ and C), behind
// too, on the right by right 1 and 2. Filled is pressed; a half-holed left 1 half filled.
import type { ClarinetFingering, ClarinetKey } from "./notation";
import { el, text } from "../../views/svg";

const X = 60; // the body's axis
const LEFT = [56, 92, 128], RIGHT = [194, 230, 266]; // the finger holes' centres, down it
const NEAR = { left: 24, right: 76 }, FAR = { left: 0, right: 100 }; // the side keys' columns: by the body, further out
const ROW = 17;

export function clarinetDiagram(f: ClarinetFingering, label: string, bass: boolean, legend = false): SVGSVGElement {
  const end = bass ? 326 : 310; // the body's foot
  const svg = el("svg", { viewBox: `-4 0 130 ${end + 4}`, class: `keys tall${legend ? " legend-keys" : ""}`, role: "img", "aria-label": label, style: "width: 8.5rem" });
  el("rect", { x: X - 10, y: 20, width: 20, height: end - 20, rx: 6, class: "body" }, svg);
  el("path", { d: `M${X - 5} 3H${X + 5}L${X + 7} 21H${X - 7}Z`, class: "mouth" }, svg);
  const on = (k: ClarinetKey) => f.keys.includes(k);

  const hole = (cy: number, n: number, down: boolean | "half", hand: string) => {
    const g = el("g", { class: down === true ? "key down" : down === "half" ? "key half" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx: X, cy, r: 12 }, g);
    if (down === "half") el("path", { d: `M${X} ${cy - 12}A12 12 0 0 1 ${X} ${cy + 12}Z`, class: "half-fill" }, g);
    text(g, X, cy + 0.5, String(n));
  };
  const small = (key: string, cy: number, down: boolean) => {
    const g = el("g", { class: `key small${down ? " down" : ""}`, "data-key": key }, svg);
    el("circle", { cx: X, cy, r: 5 }, g);
  };
  const pill = (key: string, x: number, y: number, w: number, name: string, down: boolean) => {
    const g = el("g", { class: `key small${down ? " down" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, name);
  };

  // The left hand: the thumb's, behind; the A key and the side G♯; the fingers and the E♭ sliver; the pinky's.
  pill("register", 16, 26, 28, "reg", on("R"));
  const t = el("g", { class: on("T") ? "key small down" : "key small", "data-key": "thumb" }, svg);
  el("circle", { cx: 30, cy: 54, r: 7.5 }, t);
  text(t, 30, 54.5, "T");
  pill("a-key", X - 10, 24, 20, "A", on("A"));
  pill("g-sharp", NEAR.right, 30, 22, "G♯", on("G#"));
  hole(LEFT[0], 1, f.left[0], "left");
  hole(LEFT[1], 2, f.left[1], "left");
  small("sliver-e-flat", 110, on("Eb"));
  hole(LEFT[2], 3, f.left[2], "left");
  pill("left-c-sharp", NEAR.right, 134, 22, "C♯", on("lC#"));
  pill("left-f", FAR.right, 134, 22, "F", on("lF"));
  pill("left-e", NEAR.right, 134 + ROW, 22, "E", on("lE"));
  pill("left-f-sharp", FAR.right, 134 + ROW, 22, "F♯", on("lF#"));
  // The right hand: the side keys; the fingers and the B sliver; the pinky's (and the bass clarinet's lowest).
  for (let i = 0; i < 4; i++) pill(`side${i + 1}`, 26, 138 + i * ROW, 19, String(i + 1), on(`s${i + 1}` as ClarinetKey));
  hole(RIGHT[0], 1, f.right[0], "right");
  hole(RIGHT[1], 2, f.right[1], "right");
  small("sliver-b", 248, on("B"));
  hole(RIGHT[2], 3, f.right[2], "right");
  pill("right-g-sharp", NEAR.left, 274, 22, "G♯", on("rG#"));
  pill("right-f-sharp", FAR.left, 274, 22, "F♯", on("rF#"));
  pill("right-f", NEAR.left, 274 + ROW, 22, "F", on("rF"));
  pill("right-e", FAR.left, 274 + ROW, 22, "E", on("rE"));
  if (bass) {
    pill("low-e-flat", FAR.left, 274 + 2 * ROW, 22, "E♭", on("lowEb"));
    pill("left-low-d", FAR.right, 134 + 2 * ROW, 18, "D", on("lD"));
    pill("low-d", NEAR.right, 186, 18, "D", on("lowD"));
    pill("low-c-sharp", NEAR.right, 186 + ROW, 22, "C♯", on("lowC#"));
    pill("low-c", NEAR.right, 186 + 2 * ROW, 18, "C", on("lowC"));
  }
  return svg;
}
