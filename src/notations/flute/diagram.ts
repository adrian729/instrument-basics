// A fingering's diagram: the instrument seen from above as it's played, the embouchure hole on the left, the left
// hand's keys and then the right's, each finger's key a circle with its number, the small keys pills with
// their names. Filled is pressed. Along it, every key is where it is on the instrument; across it, the keys on
// the player's side (the thumb's, the side lever, the trill keys' touches and the right pinky's) are drawn
// below the body, the left pinky's G♯ above it, as in The Woodwind Fingering Guide's labelled photos. A
// flute's has its foot joint's keys too, clustered with E♭ as on the instrument. Keys few notes use are dashed
// while up, or left out.
import type { FluteFingering as Fingering } from "./notation";
import { el, text } from "../../views/svg";

const LEFT = [84, 114, 144];
const RIGHT = [196, 234, 272];
const Y = 40; // the finger keys' centre
const UNDER = 60; // the top of the keys drawn below the body

export function keysDiagram(f: Fingering, label: string, foot: boolean, legend = false): SVGSVGElement {
  const width = foot ? 360 : 320;
  const more = foot ? 17 : 0; // the foot joint's second row of keys
  const svg = el("svg", { viewBox: legend ? `0 -16 ${width} ${152 + more}` : `0 0 ${width} ${104 + more}`, class: legend ? "keys legend-keys" : "keys", role: "img", "aria-label": label });
  el("rect", { x: 8, y: 28, width: width - 16, height: 24, rx: 12, class: "body" }, svg);
  el("ellipse", { cx: 26, cy: Y, rx: 7, ry: 5, class: "mouth" }, svg);

  const finger = (cx: number, n: number, down: boolean, hand: string) => {
    const g = el("g", { class: down ? "key down" : "key", "data-key": `${hand}${n}` }, svg);
    el("circle", { cx, cy: Y, r: 13 }, g);
    text(g, cx, Y + 0.5, String(n));
  };
  // A small key: minor ones (the trill keys, the B foot's) dashed while up, as most notes don't use them.
  const pill = (key: string, x: number, y: number, w: number, label: string, down: boolean, minor = false) => {
    const g = el("g", { class: `key small${down ? " down" : ""}${minor ? " minor" : ""}`, "data-key": key }, svg);
    el("rect", { x, y, width: w, height: 15, rx: 7.5 }, g);
    text(g, x + w / 2, y + 8, label);
  };

  LEFT.forEach((x, i) => finger(x, i + 1, f.left[i], "left"));
  RIGHT.forEach((x, i) => finger(x, i + 1, f.right[i], "right"));
  pill("g-sharp", 152, 8, 24, "G♯", f.gSharp); // the left pinky's, past left 3, on the far side
  pill("thumb-bb", 40, UNDER, 22, "B♭", f.thumb === "Bb"); // the thumb's: the B♭ lever nearer the head than the B key
  pill("thumb-b", 64, UNDER, 22, "B", f.thumb === "B");
  const side = f.extras.includes("side");
  if (side || legend) pill("side", 170, UNDER, 28, "side", side, legend); // by right 1, drawn only when used
  pill("tr-d", 205, UNDER, 20, "D", f.extras.includes("trD"), true); // between right 1 and 2
  pill("tr-d-sharp", 243, UNDER, 20, "D♯", f.extras.includes("trD#"), true); // between right 2 and 3
  pill("e-flat", 282, UNDER, 22, "E♭", f.eFlat); // the right pinky's, past right 3
  if (foot) { // and around it, the foot joint's: the C♯ and C rollers, a B foot's low B and its gizmo (drawn only when used)
    pill("low-c-sharp", 307, UNDER, 22, "C♯", f.foot.includes("lowC#"));
    pill("low-c", 284, UNDER + 17, 18, "C", f.foot.includes("lowC"));
    pill("low-b", 305, UNDER + 17, 18, "B", f.foot.includes("lowB"), true);
    const giz = f.foot.includes("giz");
    if (giz || legend) pill("gizmo", 326, UNDER + 17, 22, "giz", giz, true);
  }

  const hand = (x1: number, x2: number, name: string) => {
    el("path", { d: `M${x1} ${84 + more}v4H${x2}v-4`, class: "hand" }, svg);
    text(svg, (x1 + x2) / 2, 98 + more, name, { class: "hand-name" });
  };
  hand(38, 180, "LEFT HAND");
  hand(186, width - 8, "RIGHT HAND");
  if (legend) {
    const call = (x: number, y: number, t: string, anchor = "middle") => text(svg, x, y, t, { class: "callout", "text-anchor": anchor });
    call(18, 6, "embouchure hole", "start");
    call(164, -6, "left pinky");
    const y1 = 114 + more, y2 = 126 + more;
    call(63, y1, "thumb keys");
    call(184, y2, "side lever");
    call(234, y1, "trill keys");
    if (foot) {
      call(width - 4, y1, "right pinky", "end");
      call(width - 4, y2, "+ foot joint", "end");
    } else call(width - 4, y2, "right pinky", "end");
  }
  return svg;
}
