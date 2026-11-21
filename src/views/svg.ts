// Making SVG elements.
const NS = "http://www.w3.org/2000/svg";

export function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, parent?: Element): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  parent?.appendChild(e);
  return e;
}

export function text(parent: Element, x: number, y: number, content: string, attrs: Record<string, string | number> = {}) {
  const t = el("text", { x, y, ...attrs }, parent);
  t.textContent = content;
  return t;
}
