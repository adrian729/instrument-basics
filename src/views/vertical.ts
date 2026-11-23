// A diagram stood up, for the compact view: every notation draws its diagrams lying down, the mouthpiece on
// the left and the body's axis at y = 40; here the same keys are laid out top to bottom, the mouthpiece at the
// top, what was drawn above the body now on its left and what was below it on its right. The keys keep their
// shape and their labels, upright (only where they are changes), the body and any curve (a bell) are turned
// with the rest, and across the body distances grow a little, so that two rows of keys stay apart. The hands'
// brackets and their names are left out.
const AXIS = 40; // the body's axis, as every notation draws it
const ACROSS = 1.5; // how much distances across the body grow
const X = 60; // the body's axis, stood up

const at = (x: number, y: number) => [X + (y - AXIS) * ACROSS, x] as const;
const num = (e: Element, name: string) => Number(e.getAttribute(name) ?? 0);
const set = (e: Element, attrs: Record<string, number | string>) => { for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v)); };

export function vertical(lying: SVGSVGElement, label: string): SVGSVGElement {
  const svg = lying.cloneNode(true) as SVGSVGElement;
  svg.querySelectorAll(".hand, .hand-name, .callout, .key-name").forEach((e) => e.remove());
  svg.removeAttribute("style"); // (a size set for the full view: the compact one's own)
  if (svg.classList.contains("tall")) { // (already standing: the saxophone's)
    svg.setAttribute("class", "keys tall mini-keys");
    svg.setAttribute("aria-label", label);
    return svg;
  }
  let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
  const fit = (x1: number, y1: number, x2: number, y2: number) => { left = Math.min(left, x1); right = Math.max(right, x2); top = Math.min(top, y1); bottom = Math.max(bottom, y2); };
  for (const e of svg.querySelectorAll("*")) {
    const tag = e.tagName;
    if (tag === "circle") {
      const [cx, cy] = at(num(e, "cx"), num(e, "cy")), r = num(e, "r");
      set(e, { cx, cy });
      fit(cx - r, cy - r, cx + r, cy + r);
    } else if (tag === "ellipse") {
      const [cx, cy] = at(num(e, "cx"), num(e, "cy")), rx = num(e, "ry") * ACROSS, ry = num(e, "rx");
      set(e, { cx, cy, rx, ry });
      fit(cx - rx, cy - ry, cx + rx, cy + ry);
    } else if (tag === "rect") {
      const x = num(e, "x"), y = num(e, "y"), w = num(e, "width"), h = num(e, "height");
      if (e.matches(".body, .mouth")) { // the body (the valves' tubing): turned, its corners too
        const [x1, y1] = at(x, y), rx = num(e, "rx");
        set(e, { x: x1, y: y1, width: h * ACROSS, height: w, rx: Math.min(rx * ACROSS, (h * ACROSS) / 2), ry: rx });
        fit(x1, y1, x1 + h * ACROSS, y1 + w);
      } else { // a key: where it was, upright
        const [cx, cy] = at(x + w / 2, y + h / 2);
        set(e, { x: cx - w / 2, y: cy - h / 2 });
        fit(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
      }
    } else if (tag === "text") {
      const [x, y] = at(num(e, "x"), num(e, "y"));
      set(e, { x, y });
    } else if (tag === "path" && e.classList.contains("half-fill")) { // a half-holed key: the half that was below, now on the right
      const c = e.parentElement!.querySelector("circle")!, cx = num(c, "cx"), cy = num(c, "cy"), r = num(c, "r");
      set(e, { d: `M${cx} ${cy - r}A${r} ${r} 0 0 1 ${cx} ${cy + r}Z` });
    } else if (tag === "path") { // a curve (a bell, a mouthpiece): turned whole
      set(e, { transform: `matrix(0 1 ${ACROSS} 0 ${X - AXIS * ACROSS} 0)` });
      const xs: number[] = [], ys: number[] = [];
      const d = e.getAttribute("d") ?? "";
      // (its extent, from its absolute points: the notations draw them with M, L, C, H, V and A)
      let px = 0, py = 0;
      for (const [, cmd, args] of d.matchAll(/([MLCHVAZ])([^MLCHVAZ]*)/g)) {
        const n = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
        if (cmd === "H") px = n.at(-1)!; else if (cmd === "V") py = n.at(-1)!;
        else if (cmd === "A") [px, py] = [n[5], n[6]];
        else for (let i = 0; i + 1 < n.length; i += 2) { [px, py] = [n[i], n[i + 1]]; xs.push(px); ys.push(py); }
        xs.push(px); ys.push(py);
      }
      for (let i = 0; i < xs.length; i++) { const [x, y] = at(xs[i], ys[i]); fit(x, y, x, y); }
    }
  }
  const pad = 2;
  set(svg, { viewBox: `${left - pad} ${top - pad} ${right - left + 2 * pad} ${bottom - top + 2 * pad}`, class: `${svg.getAttribute("class")} mini-keys`, "aria-label": label });
  return svg;
}
