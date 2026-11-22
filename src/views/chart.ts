// The chart: a section per register, a card per note (its staff, its name, what it sounds, its standard
// fingering, its alternatives folded under it), and the diagrams' key. Made for an instrument, and made again
// when it's changed; the other hooks change what follows a choice.
import { parseFingering, type Fingering, type Note } from "../data/fingerings";
import { instrument as find, type Instrument, type InstrumentId } from "../data/instruments";
import { fingeringLabel, fingeringText, nameParts, nameText, soundingText, type Names } from "../lib/notes";
import type { Alternatives } from "../lib/store.svelte";
import { keysDiagram } from "./keys";
import { staff, stepsFor } from "./staff";

export type Chart = { instrument(id: InstrumentId): void; names(names: Names): void; alternatives(how: Alternatives): void };

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { dataset?: Record<string, string> } = {}, ...children: (Node | string)[]) => {
  const { dataset, ...rest } = props;
  const e = Object.assign(document.createElement(tag), rest);
  if (dataset) Object.assign(e.dataset, dataset);
  e.append(...children);
  return e;
};

function fingering(f: Fingering, standard: boolean, foot: boolean) {
  const words = fingeringText(f);
  return h("figure", { className: standard ? "fingering standard" : "fingering" },
    keysDiagram(f, fingeringLabel(f), foot),
    h("figcaption", {},
      h("p", { className: "in-words" }, h("span", {}, h("b", {}, "Left "), words.left), h("span", {}, h("b", {}, "Right "), words.right)),
      ...(f.note ? [h("p", { className: "comment" }, f.note)] : [])));
}

function card(n: Note, fit: { low: number; high: number }, foot: boolean) {
  const [first, ...rest] = n.fingerings;
  const article = h("article", { className: "note", dataset: { note: n.id } },
    h("div", { className: "note-head" },
      staff(n.pitch, fit, ""),
      h("div", {}, h("h3", { className: "note-name" }), h("p", { className: "sounds" }))),
    fingering(first, true, foot));
  if (rest.length) {
    article.append(h("details", { className: "alternatives" },
      h("summary", {}, rest.length === 1 ? "1 alternative" : `${rest.length} alternatives`),
      h("div", { className: "alternative-list" }, ...rest.map((f) => fingering(f, false, foot)))));
  }
  return article;
}

const LEGEND: Record<InstrumentId, string> = {
  flute: "The keys: the thumb's B♭ lever and B key; left 1, 2 and 3; the G♯ key; right 1, 2 and 3, the side B♭ lever by right 1 and the D and D♯ trill keys between them; the E♭ key; the foot joint's low C♯, C and B keys and the gizmo",
  piccolo: "The keys: the thumb's B♭ lever and B key; left 1, 2 and 3; the G♯ key; right 1, 2 and 3, the side B♭ lever by right 1 and the D and D♯ trill keys between them; the E♭ key",
};

export function makeChart(root: HTMLElement, legend: HTMLElement): Chart {
  let shown: Instrument;
  let notes: Note[] = [];
  let cards = new Map<string, HTMLElement>();
  let names: Names = "letters", alternatives: Alternatives = "folded";

  const hooks: Chart = {
    instrument(id) {
      shown = find(id);
      document.documentElement.dataset.instrument = id;
      document.title = `Instrument Basics | ${shown.name[0].toUpperCase()}${shown.name.slice(1)} fingering chart`;
      legend.querySelector(".legend-keys")?.remove();
      legend.prepend(keysDiagram(parseFingering("- --- | ---"), LEGEND[id], shown.foot, true));
      root.replaceChildren(...shown.registers.map((r) => {
        const fit = stepsFor(r.notes.map((n) => n.pitch));
        return h("section", { className: "register", id: r.id },
          h("header", { className: "register-head" },
            h("p", { className: "range" }, r.range),
            h("h2", { id: `${r.id}-title` }, r.name),
            h("p", { className: "about" }, r.about)),
          h("div", { className: "notes" }, ...r.notes.map((n) => card(n, fit, shown.foot))));
      }));
      for (const r of shown.registers) document.getElementById(r.id)!.setAttribute("aria-labelledby", `${r.id}-title`);
      notes = shown.registers.flatMap((r) => r.notes);
      cards = new Map(notes.map((n) => [n.id, root.querySelector<HTMLElement>(`[data-note="${CSS.escape(n.id)}"]`)!]));
      hooks.names(names);
      hooks.alternatives(alternatives);
    },
    names(to) {
      names = to;
      for (const n of notes) {
        const c = cards.get(n.id)!;
        const title = c.querySelector(".note-name")!;
        title.replaceChildren(...nameParts(n.pitch, names).flatMap((p, i) => [...(i ? [" / "] : []), p.name, ...(p.octave ? [h("sub", {}, p.octave)] : [])]));
        c.querySelector(".sounds")!.textContent = soundingText(n.pitch, names, shown.octavesUp);
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
