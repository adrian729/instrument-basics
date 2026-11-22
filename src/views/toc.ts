// The page's links, the overview then the registers (index.html's .toc; the chart puts in the instrument's). On a narrower screen they're
// folded under a button, closed again by a link, Escape or a click elsewhere. The register being read is marked
// (aria-current): the last whose top has gone under what's stuck at the top of the page, else the overview. At
// the page's end, where a short last register can't scroll up that far, the register linked to (if it's in
// sight) or the last.
import { hashId } from "./chart";

export function toc(nav: HTMLElement) {
  const button = nav.querySelector<HTMLButtonElement>(".toc-toggle")!;
  const links = nav.querySelector<HTMLElement>(".toc-links")!;
  const show = (open: boolean) => {
    button.setAttribute("aria-expanded", String(open));
    nav.toggleAttribute("data-open", open);
  };
  button.addEventListener("click", () => show(!nav.hasAttribute("data-open")));
  links.addEventListener("click", (e) => { if ((e.target as Element).closest("a")) show(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.hasAttribute("data-open")) { show(false); button.focus(); }
  });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target as Node)) show(false); });

  let queued = false;
  const mark = () => {
    queued = false;
    const top = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const registers = [...document.querySelectorAll<HTMLElement>("section.register")];
    let current = registers.filter((r) => r.getBoundingClientRect().top <= top + 1).at(-1)?.id ?? "intro";
    if (registers.length && scrollY + innerHeight >= document.documentElement.scrollHeight - 1) {
      const linked = registers.find((r) => r.id === hashId() && r.getBoundingClientRect().top < innerHeight);
      current = (linked ?? registers.at(-1)!).id;
    }
    for (const a of links.querySelectorAll("a")) {
      if (a.getAttribute("href") === `#${current}`) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(mark); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  addEventListener("hashchange", queue);
  new MutationObserver(queue).observe(links, { childList: true }); // (another instrument's links)
  queue();
}
