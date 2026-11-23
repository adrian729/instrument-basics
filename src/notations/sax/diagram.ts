// A saxophone fingering's diagram: its keys laid out along the instrument, the mouthpiece on the left, the
// left hand's keys and then the right's, as they go down it. The finger keys are circles with their numbers
// (the bis and alternate F♯ keys small ones between them), the other keys pills with their names. Above the
// body, the left palm's keys and the front F key, and the right hand's side keys; below it, the left thumb's
// octave key (and the baritone's low A), the left pinky's table, the right pinky's keys. Filled is pressed;
// keys few fingerings use are dashed while up.
import type { SaxFingering, SaxKey } from "./notation";
import { el, text } from "../../views/svg";

const LEFT = [118, 160, 190];
const RIGHT = [266, 296, 334];
const Y = 40; // the finger keys' centre
const ABOVE = 8, UNDER = 60, ROW = 17; // the pills' rows: above the body, and two below it

export function saxDiagram(f: SaxFingering, label: string, lowA: boolean, legend = false): SVGSVGElement {
  const width = 360;
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} ${152 + ROW}` : `0 0 ${width} ${104 + ROW}`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 8, y: 28, width: width - 16, height: 24, rx: 12, class: "body" }, svg);
  el("ellipse", { cx: 24, cy: Y, rx: 7, ry: 5, class: "mouth" }, svg);
  const on = (k: SaxKey) => f.keys.includes(k);

  const finger = (cx: number, n: number, down: boolean, hand: string) => {
    const g = el("g", { class: down ? "key down" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx, cy: Y, r: 13 }, g);
    text(g, cx, Y + 0.5, String(n));
  };
  const small = (key: string, cx: number, down: boolean, minor = false) => {
    const g = el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": key }, svg);
    el("circle", { cx, cy: Y, r: 5.5 }, g);
  };
  const pill = (key: string, x: number, y: number, w: number, name: string, down: boolean, minor = false) => {
    const g = el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, name);
  };

  // The left hand: the palm keys and front F above, the thumb's below, the fingers and bis, the pinky's table.
  pill("palm-e-flat", 28, ABOVE, 22, "E♭", on("pEb")); // (E♭ the topmost, then D)
  pill("palm-d", 54, ABOVE, 20, "D", on("pD"));
  pill("palm-f", 78, ABOVE, 20, "F", on("pF"));
  pill("front-f", 108, ABOVE, 20, "f", on("fF"), true);
  pill("octave", 104, UNDER, 28, "oct", on("T")); // under left 1, where the thumb is
  if (lowA) pill("low-a", 136, UNDER, 20, "A", on("lowA"));
  finger(LEFT[0], 1, f.left[0], "left");
  small("bis", 139, on("bis"));
  finger(LEFT[1], 2, f.left[1], "left");
  finger(LEFT[2], 3, f.left[2], "left");
  // (G♯ the topmost, then B nearer the body and C♯ further out, B♭ the lowest)
  pill("g-sharp", 206, UNDER, 22, "G♯", on("G#"));
  pill("low-b", 230, UNDER, 22, "B", on("lowB"));
  pill("low-c-sharp", 206, UNDER + ROW, 22, "C♯", on("lowC#"));
  pill("low-b-flat", 230, UNDER + ROW, 22, "B♭", on("lowBb"));
  // The right hand: the side keys above, the fingers and the alternate F♯ key, the pinky's keys below.
  pill("side-e", 206, ABOVE, 18, "E", on("sE")); // (along the body above right 1, the high F♯ key's just above it)
  pill("side-c", 228, ABOVE, 18, "C", on("sC"));
  pill("side-b-flat", 250, ABOVE, 22, "B♭", on("sBb"));
  pill("high-f-sharp", 276, ABOVE, 22, "F♯", on("hiF#"), true);
  finger(RIGHT[0], 1, f.right[0], "right");
  finger(RIGHT[1], 2, f.right[1], "right");
  small("alt-f-sharp", 315, on("altF#"), true);
  finger(RIGHT[2], 3, f.right[2], "right");
  pill("e-flat", 306, UNDER, 22, "E♭", on("Eb")); // (E♭ the upper, C the lower)
  pill("low-c", 330, UNDER + ROW, 22, "C", on("lowC"));

  const hand = (x1: number, x2: number, name: string) => {
    el("path", { d: `M${x1} ${84 + ROW}v4H${x2}v-4`, class: "hand" }, svg);
    text(svg, (x1 + x2) / 2, 98 + ROW, name, { class: "hand-name" });
  };
  hand(34, 254, "LEFT HAND");
  hand(260, width - 8, "RIGHT HAND");
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(8, 68, "mouthpiece", "start");
    call(63, -6, "palm keys");
    call(118, -6, "front F");
    call(252, -6, "side keys (right hand)");
    const y1 = 114 + ROW, y2 = 126 + ROW;
    call(lowA ? 130 : 118, y1, lowA ? "thumb keys" : "octave key");
    call(229, y1, "left pinky");
    call(width - 4, y2, "right pinky", "end");
  }
  return svg;
}
