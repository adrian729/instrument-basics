// The page's choices (the switches at the top of the page), in one place: read from the address (?instrument=, for a
// link to one instrument's chart) or what this browser remembers, changed only by the actions here, each
// saved as it's made. The switches show them (SwitchBar.svelte); the chart follows them
// (views/controller.svelte.ts). index.html's first script reads the instrument the same way, before the page
// is drawn.
import { flushSync } from "svelte";
import { defaultOf, GROUPS, INSTRUMENTS, instrument, type GroupId, type InstrumentId } from "../data/instruments";
import type { Names } from "./notes";

export type Alternatives = "folded" | "open"; // under each note: folded away, or shown
export type View = "full" | "compact"; // each note's card in full, or its name and standard fingering, small, for an overview
export type Choices = { instrument: InstrumentId; names: Names; alternatives: Alternatives; view: View };

// Each switch's choices, the most used first, the first its default.
export const VALUES = {
  instrument: INSTRUMENTS.map((i) => i.id),
  names: ["letters", "solfege"] as Names[],
  alternatives: ["folded", "open"] as Alternatives[],
  view: ["full", "compact"] as View[],
};
const KEY: Record<keyof Choices, string> = { instrument: "instrument-basics-instrument", names: "instrument-basics-names", alternatives: "instrument-basics-alternatives", view: "instrument-basics-view" };

const stored = (key: string): string | null => { try { return localStorage.getItem(key); } catch { return null; } };
const store = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch {} };
const valid = <K extends keyof Choices>(key: K, v: string | null): v is Choices[K] => (VALUES[key] as string[]).includes(v ?? "");
const read = <K extends keyof Choices>(key: K): Choices[K] => {
  const v = stored(KEY[key]);
  return valid(key, v) ? v : (VALUES[key][0] as Choices[K]);
};

// The address's instrument wins, and is remembered; one that isn't (misspelled, or an old link's), taken out
// of it, so that a copy of the address doesn't name it.
const linked = () => new URLSearchParams(location.search).get("instrument");
if (valid("instrument", linked())) store(KEY.instrument, linked()!);
else if (linked() !== null) {
  const url = new URL(location.href);
  url.searchParams.delete("instrument");
  history.replaceState(history.state, "", url);
}

// (the address's read from it, not from storage, which may be blocked or full)
const link = linked();
export const choices: Choices = $state({ instrument: valid("instrument", link) ? link : read("instrument"), names: read("names"), alternatives: read("alternatives"), view: read("view") });

// The instrument last chosen in each group, for the picker to come back to; the one the page opened on, too:
// a link's always, a remembered one if its group has none yet. Kept here, and saved when storage allows.
const KINDS = "instrument-basics-kinds";
const readKinds = (): Partial<Record<GroupId, InstrumentId>> => {
  try { const v = JSON.parse(stored(KINDS) ?? "{}"); return v && typeof v === "object" && !Array.isArray(v) ? v : {}; } catch { return {}; }
};
const kinds = readKinds();
// One group's kind set, over what other tabs may have saved since (read again first).
const saveKind = (group: GroupId, id: InstrumentId) => { Object.assign(kinds, readKinds(), { [group]: id }); store(KINDS, JSON.stringify(kinds)); };
const opened = instrument(choices.instrument).group;
if (valid("instrument", linked()) || !kinds[opened]) saveKind(opened, choices.instrument);

// Back or forward to an entry whose address names another instrument (the registers' links add entries): that
// one, the chart made again before this returns (main.ts calls it on popstate). While it's made,
// `traversal.now` says so, for the chart to keep the entry's fragment.
export const traversal = { now: false };
export function traverse() {
  const id = linked();
  if (!valid("instrument", id) || id === choices.instrument) return;
  traversal.now = true;
  try { choose("instrument", id); flushSync(); } finally { traversal.now = false; }
}

// A group chosen: its instrument chosen last, if it's still one of its, else its default.
export function chooseGroup(id: GroupId) {
  const group = GROUPS.find((g) => g.id === id)!;
  const last = kinds[id];
  choose("instrument", group.instruments.find((i) => i.id === last)?.id ?? defaultOf(group));
}

export function choose<K extends keyof Choices>(key: K, value: Choices[K]) {
  choices[key] = value;
  store(KEY[key], value);
  // A chosen instrument goes in the address too, so that the page's link is to its chart.
  if (key === "instrument") {
    const id = value as InstrumentId;
    saveKind(instrument(id).group, id);
    const url = new URL(location.href);
    url.searchParams.set("instrument", value);
    history.replaceState(history.state, "", url);
  }
}
