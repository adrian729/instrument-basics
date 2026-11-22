// The page's choices (the switches above the chart), in one place: read from the address (?instrument=, for a
// link to one instrument's chart) or what this browser remembers, changed only by the actions here, each
// saved as it's made. The switches show them (SwitchBar.svelte); the chart follows them
// (views/controller.svelte.ts). index.html's first script reads the instrument the same way, before the page
// is drawn.
import { GROUPS, INSTRUMENTS, instrument, type GroupId, type InstrumentId } from "../data/instruments";
import type { Names } from "./notes";

export type Alternatives = "folded" | "open" | "none"; // under each note: folded away, shown, or left out
export type Choices = { instrument: InstrumentId; names: Names; alternatives: Alternatives };

// Each switch's choices, the most used first, the first its default.
export const VALUES = {
  instrument: INSTRUMENTS.map((i) => i.id),
  names: ["letters", "solfege"] as Names[],
  alternatives: ["folded", "open", "none"] as Alternatives[],
};
const KEY: Record<keyof Choices, string> = { instrument: "instrument-basics-instrument", names: "instrument-basics-names", alternatives: "instrument-basics-alternatives" };

const stored = (key: string): string | null => { try { return localStorage.getItem(key); } catch { return null; } };
const store = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch {} };
const valid = <K extends keyof Choices>(key: K, v: string | null): v is Choices[K] => (VALUES[key] as string[]).includes(v ?? "");
const read = <K extends keyof Choices>(key: K): Choices[K] => {
  const v = stored(KEY[key]);
  return valid(key, v) ? v : (VALUES[key][0] as Choices[K]);
};

// The address's instrument wins, and is remembered.
const linked = new URLSearchParams(location.search).get("instrument");
if (valid("instrument", linked)) store(KEY.instrument, linked);

export const choices: Choices = $state({ instrument: read("instrument"), names: read("names"), alternatives: read("alternatives") });

// The instrument last chosen in each group, for the picker to come back to.
const KINDS = "instrument-basics-kinds";
const kinds = (): Partial<Record<GroupId, InstrumentId>> => { try { return JSON.parse(stored(KINDS) ?? "{}"); } catch { return {}; } };

// A group chosen: its instrument chosen last, if it's still one of its, else its first.
export function chooseGroup(id: GroupId) {
  const group = GROUPS.find((g) => g.id === id)!;
  const last = kinds()[id];
  choose("instrument", group.instruments.find((i) => i.id === last)?.id ?? group.instruments[0].id);
}

export function choose<K extends keyof Choices>(key: K, value: Choices[K]) {
  choices[key] = value;
  store(KEY[key], value);
  // A chosen instrument goes in the address too, so that the page's link is to its chart.
  if (key === "instrument") {
    const id = value as InstrumentId;
    store(KINDS, JSON.stringify({ ...kinds(), [instrument(id).group]: id }));
    const url = new URL(location.href);
    url.searchParams.set("instrument", value);
    history.replaceState(history.state, "", url);
  }
}
