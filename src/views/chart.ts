// The chart: a section per register, a card per note (its staff, its name, what it sounds, its standard
// fingering, its alternatives folded under it), the diagrams' key, and the instrument's text around them (the
// heading, what to know, the page's links, the footer's tip and credits). Made for an instrument, and made
// again when it's changed; the other hooks change what follows a choice.
import { group, instrument as find, type Instrument, type InstrumentId, type Shown } from "../data/instruments";
import type { Note } from "../data/types";
import { nameParts, nameText, rangeText, soundingText, spoken, type Names } from "../lib/notes";
import { traversal, type Alternatives } from "../lib/store.svelte";
import { staff, stepsFor } from "./staff";

// The id the address's fragment names ("" if none, or if it's malformed: "#%").
export const hashId = () => { try { return decodeURIComponent(location.hash.slice(1)); } catch { return ""; } };

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
  let made = false;

  // The chart made for an instrument, its text put in.
  function make(id: InstrumentId) {
    shown = find(id);
    document.documentElement.dataset.instrument = id;
    document.title = `Instrument Basics | ${shown.name[0].toUpperCase()}${shown.name.slice(1)} fingering chart`;
    const html = (selector: string, content: string) => { document.querySelector(selector)!.innerHTML = content; }; // (the data's own text)
    const items = (list: string[]) => list.map((s) => `<li>${s}</li>`).join("");
    document.querySelector("#intro-title")!.textContent = `Fingerings for the ${shown.name}`;
    html(".intro .facts", items(shown.facts));
    html(".legend-text ul", items(shown.legend));
    html("footer .tip", shown.tip);
    html("footer .sources", group(shown.group).sources);
    document.querySelector(".toc-links")!.replaceChildren(h("p", { className: "toc-title", ariaHidden: "true" }, "Contents"), h("a", { href: "#intro" }, "Overview"), ...shown.registers.map((r) => h("a", { href: `#${r.id}` }, r.nav)));
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
    // An address naming what this page hasn't (another instrument's register, a malformed "#%"), left without it;
    // and, the instrument changed by a choice (not back or forward to it), one naming a register: it's in another
    // place now, the view where it was.
    const hash = hashId();
    const register = made && !traversal.now && shown.registers.some((r) => r.id === hash);
    if (location.hash && (!hash || !document.getElementById(hash) || register)) history.replaceState(history.state, "", location.pathname + location.search);
    hooks.names(names);
    hooks.alternatives(alternatives);
    if (made) document.querySelector("#announce")!.textContent = spoken(`${shown.name[0].toUpperCase()}${shown.name.slice(1)} fingering chart`); // (for screen readers: the chart changed)
    made = true;
  }

  const hooks: Chart = {
    instrument(id) {
      try { make(id); } finally { delete document.documentElement.dataset.pending; } // (the text shown, whatever happens)
    },
    names(to) {
      names = to;
      for (const n of notes) {
        const c = cards.get(n.id)!;
        const title = c.querySelector(".note-name")!;
        title.replaceChildren(...nameParts(n.pitch, names).flatMap((p, i) => [...(i ? [" / "] : []), p.name, ...(p.octave ? [h("sub", {}, p.octave)] : [])]));
        title.setAttribute("aria-label", spoken(nameText(n.pitch, names))); // (sharps and flats in words, for screen readers; the same below)
        const sounds = soundingText(n.pitch, names, shown.transposition);
        c.querySelector(".sounds")!.replaceChildren(h("span", { ariaHidden: "true" }, sounds), h("span", { className: "visually-hidden" }, spoken(sounds)));
        c.querySelector(".staff")!.setAttribute("aria-label", spoken(`Written ${nameText(n.pitch, names)}${names === "letters" ? "" : ` (${nameText(n.pitch, "letters")})`} on the treble staff`)); // (the octave, solfège's names have none)
      }
    },
    alternatives(how) {
      alternatives = how;
      for (const d of root.querySelectorAll("details")) d.open = how === "open";
    },
  };
  return hooks;
}
