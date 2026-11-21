// A fingering's diagram: the piccolo seen from above as it's played, the mouthpiece on the left, the left
// hand's keys and then the right's, each finger's key a circle with its number, the small keys pills with
// their names. Dark is pressed. The thumb's keys, under the piccolo, are drawn below it, the rest above;
// along it, every key is where it is on the instrument. The keys no finger presses are left out.
import type { Fingering } from "../data/fingerings";
import { el, text } from "./svg";

const LEFT = [84, 114, 144];
const RIGHT = [196, 234, 272];
const Y = 40; // the finger keys' centre

export function keysDiagram(f: Fingering, label: string, legend = false): SVGSVGElement {
  const svg = el("svg", { viewBox: legend ? "0 -28 320 164" : "0 0 320 104", class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 8, y: 28, width: 304, height: 24, rx: 12, class: "body" }, svg);
  el("ellipse", { cx: 26, cy: Y, rx: 7, ry: 5, class: "mouth" }, svg);

  const finger = (cx: number, n: number, down: boolean, hand: string) => {
    const g = el("g", { class: down ? "key down" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx, cy: Y, r: 13 }, g);
    text(g, cx, Y + 0.5, String(n));
  };
  // A small key: minor ones (the trill keys) dashed while up, as most notes don't use them.
  const pill = (key: string, x: number, y: number, w: number, label: string, down: boolean, minor = false) => {
    const g = el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, label);
  };

  LEFT.forEach((x, i) => finger(x, i + 1, f.left[i], "left"));
  RIGHT.forEach((x, i) => finger(x, i + 1, f.right[i], "right"));
  pill("thumb-bb", 40, 60, 22, "B♭", f.thumb === "Bb"); // the thumb's: the B♭ lever nearer the mouthpiece than the B key
  pill("thumb-b", 64, 60, 22, "B", f.thumb === "B");
  pill("g-sharp", 152, 8, 24, "G♯", f.gSharp); // the left pinky's, past left 3
  pill("e-flat", 284, 8, 24, "E♭", f.eFlat); // the right pinky's, past right 3
  pill("tr-d", 204, 4, 22, "D", f.extras.includes("trD"), true); // between right 1 and 2
  pill("tr-d-sharp", 242, 4, 22, "D♯", f.extras.includes("trD#"), true); // between right 2 and 3
  if (f.extras.includes("side") || legend) pill("side", 183, 60, 28, "side", f.extras.includes("side"), legend); // beside right 1, shown only when used

  const hand = (x1: number, x2: number, name: string) => {
    el("path", { d: `M${x1} 84v4H${x2}v-4`, class: "hand" }, svg);
    text(svg, (x1 + x2) / 2, 98, name, { class: "hand-name" });
  };
  hand(38, 182, "LEFT HAND");
  hand(188, 312, "RIGHT HAND");
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(18, 4, "mouthpiece", "start");
    call(164, -2, "left pinky");
    call(234, -16, "trill keys");
    call(318, -2, "right pinky", "end");
    call(63, 116, "thumb keys");
    call(63, 128, "(under the piccolo)");
    call(197, 116, "side lever");
  }
  return svg;
}
