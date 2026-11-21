// The page's choices (the switches above the chart), in one place: read from what this browser remembers,
// changed only by the actions here, each saved as it's made. The switches show them (SwitchBar.svelte); the
// chart follows them (views/controller.svelte.ts).
import type { Names } from "./notes";

export type Alternatives = "folded" | "open" | "none"; // under each note: folded away, shown, or left out
export type Choices = { names: Names; alternatives: Alternatives };

// Each switch's choices, the most used first, the first its default.
export const VALUES = {
  names: ["letters", "solfege"] as Names[],
  alternatives: ["folded", "open", "none"] as Alternatives[],
};
const KEY: Record<keyof Choices, string> = { names: "piccolo-names", alternatives: "piccolo-alternatives" };

const stored = (key: string): string | null => { try { return localStorage.getItem(key); } catch { return null; } };
const store = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch {} };
const read = <K extends keyof Choices>(key: K): Choices[K] => {
  const v = stored(KEY[key]);
  return ((VALUES[key] as string[]).includes(v ?? "") ? v : VALUES[key][0]) as Choices[K];
};

export const choices: Choices = $state({ names: read("names"), alternatives: read("alternatives") });

export function choose<K extends keyof Choices>(key: K, value: Choices[K]) {
  choices[key] = value;
  store(KEY[key], value);
}
