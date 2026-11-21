// The chart: a section per register, a card per note (its staff, its name, its standard fingering, its
// alternatives folded under it), and the key's diagram. Made once; the hooks change what follows a choice.
import { REGISTERS, parseFingering, type Fingering, type Note } from "../data/fingerings";
import { fingeringLabel, fingeringText, nameParts, nameText, soundingText, type Names } from "../lib/notes";
import type { Alternatives } from "../lib/store.svelte";
import { keysDiagram } from "./keys";
import { staff, stepsFor } from "./staff";

export type Chart = { names(names: Names): void; alternatives(how: Alternatives): void };

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { dataset?: Record<string, string> } = {}, ...children: (Node | string)[]) => {
  const { dataset, ...rest } = props;
  const e = Object.assign(document.createElement(tag), rest);
  if (dataset) Object.assign(e.dataset, dataset);
  e.append(...children);
  return e;
};

function fingering(f: Fingering, standard: boolean) {
  const words = fingeringText(f);
  return h("figure", { className: standard ? "fingering standard" : "fingering" },
    keysDiagram(f, fingeringLabel(f)),
    h("figcaption", {},
      h("p", { className: "in-words" }, h("span", {}, h("b", {}, "Left "), words.left), h("span", {}, h("b", {}, "Right "), words.right)),
      ...(f.note ? [h("p", { className: "comment" }, f.note)] : [])));
}

function card(n: Note, fit: { low: number; high: number }) {
  const [first, ...rest] = n.fingerings;
  const article = h("article", { className: "note", dataset: { note: n.id } },
    h("div", { className: "note-head" },
      staff(n.pitch, fit, ""),
      h("div", {}, h("h3", { className: "note-name" }), h("p", { className: "sounds" }))),
    fingering(first, true));
  if (rest.length) {
    article.append(h("details", { className: "alternatives" },
      h("summary", {}, rest.length === 1 ? "1 alternative" : `${rest.length} alternatives`),
      h("div", { className: "alternative-list" }, ...rest.map((f) => fingering(f, false)))));
  }
  return article;
}

export function makeChart(root: HTMLElement, legend: HTMLElement): Chart {
  legend.prepend(keysDiagram(parseFingering("- --- | ---"), "The keys: the thumb's B♭ lever and B key; left 1, 2 and 3; the G♯ key; right 1, 2 and 3, with the D and D♯ trill keys between them and the side B♭ lever beside right 1; the E♭ key", true));
  for (const r of REGISTERS) {
    const fit = stepsFor(r.notes.map((n) => n.pitch));
    root.append(h("section", { className: "register", id: r.id },
      h("header", { className: "register-head" },
        h("p", { className: "range" }, r.range),
        h("h2", { id: `${r.id}-title` }, r.name),
        h("p", { className: "about" }, r.about)),
      h("div", { className: "notes" }, ...r.notes.map((n) => card(n, fit)))));
    root.lastElementChild!.setAttribute("aria-labelledby", `${r.id}-title`);
  }
  const notes = REGISTERS.flatMap((r) => r.notes);
  const cards = new Map(notes.map((n) => [n.id, root.querySelector<HTMLElement>(`[data-note="${CSS.escape(n.id)}"]`)!]));

  return {
    names(names) {
      for (const n of notes) {
        const c = cards.get(n.id)!;
        const title = c.querySelector(".note-name")!;
        title.replaceChildren(...nameParts(n.pitch, names).flatMap((p, i) => [...(i ? [" / "] : []), p.name, ...(p.octave ? [h("sub", {}, p.octave)] : [])]));
        c.querySelector(".sounds")!.textContent = soundingText(n.pitch, names);
        c.querySelector(".staff")!.setAttribute("aria-label", `Written ${nameText(n.pitch, names)} on the treble staff`);
      }
    },
    alternatives(how) {
      document.body.dataset.alternatives = how;
      for (const d of root.querySelectorAll("details")) d.open = how === "open";
    },
  };
}
