// The chart: a section per register, a card per note (its staff, its name, what it sounds, its standard
// fingering, its alternatives folded under it), the diagrams' key, and the instrument's text around them (the
// heading, what to know, the registers' links, the footer's tip and credits). Made for an instrument, and made
// again when it's changed; the other hooks change what follows a choice.
import { group, instrument as find, type Instrument, type InstrumentId, type Shown } from "../data/instruments";
import type { Note } from "../data/types";
import { nameParts, nameText, rangeText, soundingText, type Names } from "../lib/notes";
import type { Alternatives } from "../lib/store.svelte";
import { staff, stepsFor } from "./staff";

export type Chart = { instrument(id: InstrumentId): void; names(names: Names): void; alternatives(how: Alternatives): void };

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { dataset?: Record<string, string> } = {}, ...children: (Node | string)[]) => {
  const { dataset, ...rest } = props;
  const e = Object.assign(document.createElement(tag), rest);
  if (dataset) Object.assign(e.dataset, dataset);
  e.append(...children);
  return e;
};

function fingering(f: Shown, standard: boolean) {
  return h("figure", { className: standard ? "fingering standard" : "fingering" },
    f.diagram(),
    h("figcaption", {},
      h("p", { className: "in-words" }, ...f.words.map(([label, text]) => h("span", {}, h("b", {}, `${label} `), text))),
      ...(f.note ? [h("p", { className: "comment" }, f.note)] : [])));
}

function card(n: Note<Shown>, fit: { low: number; high: number }) {
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
  let shown: Instrument;
  let notes: Note<Shown>[] = [];
  let cards = new Map<string, HTMLElement>();
  let names: Names = "letters", alternatives: Alternatives = "folded";

  const hooks: Chart = {
    instrument(id) {
      shown = find(id);
      document.documentElement.dataset.instrument = id;
      document.title = `Instrument Basics | ${shown.name[0].toUpperCase()}${shown.name.slice(1)} fingering chart`;
      const html = (selector: string, content: string) => { document.querySelector(selector)!.innerHTML = content; }; // (the data's own text)
      const items = (list: string[]) => list.map((s) => `<li>${s}</li>`).join("");
      document.querySelector("#intro-title")!.textContent = `Every fingering for the ${shown.name}`;
      html(".intro .facts", items(shown.facts));
      html(".legend-text ul", items(shown.legend));
      html("footer .tip", shown.tip);
      html("footer .sources", group(shown.group).sources);
      document.querySelector(".registers-nav")!.replaceChildren(...shown.registers.map((r) => h("a", { href: `#${r.id}` }, r.nav)));
      // An address naming a register this instrument hasn't, left without it.
      if (location.hash && !shown.registers.some((r) => `#${r.id}` === decodeURIComponent(location.hash))) history.replaceState(history.state, "", location.pathname + location.search);
      legend.querySelector(".legend-keys")?.remove();
      legend.prepend(shown.legendDiagram());
      root.replaceChildren(...shown.registers.map((r) => {
        const fit = stepsFor(r.notes.map((n) => n.pitch));
        return h("section", { className: "register", id: r.id },
          h("header", { className: "register-head" },
            h("p", { className: "range" }, rangeText(r.notes[0].pitch, r.notes.at(-1)!.pitch)),
            h("h2", { id: `${r.id}-title` }, r.name),
            h("p", { className: "about" }, r.about)),
          h("div", { className: "notes" }, ...r.notes.map((n) => card(n, fit))));
      }));
      for (const r of shown.registers) document.getElementById(r.id)!.setAttribute("aria-labelledby", `${r.id}-title`);
      notes = shown.registers.flatMap((r) => r.notes);
      cards = new Map(notes.map((n) => [n.id, root.querySelector<HTMLElement>(`[data-note="${CSS.escape(n.id)}"]`)!]));
      hooks.names(names);
      hooks.alternatives(alternatives);
      delete document.documentElement.dataset.pending;
    },
    names(to) {
      names = to;
      for (const n of notes) {
        const c = cards.get(n.id)!;
        const title = c.querySelector(".note-name")!;
        title.replaceChildren(...nameParts(n.pitch, names).flatMap((p, i) => [...(i ? [" / "] : []), p.name, ...(p.octave ? [h("sub", {}, p.octave)] : [])]));
        c.querySelector(".sounds")!.textContent = soundingText(n.pitch, names, shown.transposition);
        c.querySelector(".staff")!.setAttribute("aria-label", `Written ${nameText(n.pitch, names)} on the treble staff`);
      }
    },
    alternatives(how) {
      alternatives = how;
      document.body.dataset.alternatives = how;
      for (const d of root.querySelectorAll("details")) d.open = how === "open";
    },
  };
  return hooks;
}
