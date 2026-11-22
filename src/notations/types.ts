// A notation: how one kind of instrument's fingerings are written in the data, drawn and said. Flutes have
// one (flute/), valved brass another, saxophones another. An instrument (data/instruments.ts) names its
// notation; the chart only meets fingerings through it.
//
// Every diagram follows one convention, which the page's styles and the tests rely on: an svg.keys
// (.legend-keys for the key above the chart) with role img and a label, each key a g.key with a data-key, and
// .down while pressed.
import type { Fingered } from "../data/types";
import type { Options } from "../data/instruments";

export interface Notation<F extends Fingered> {
  // A fingering from the data's notation; throws on anything else, so that a typo fails the tests.
  parse(source: string, note?: string): F;
  // Its diagram, for an instrument with these options; the legend's has every key and callouts.
  diagram(f: F, options: Options, label: string, legend?: boolean): SVGSVGElement;
  // In words, as label and text pairs: [["Left", "thumb B · 1 2 3"], ["Right", "1 2 3 · E♭"]].
  words(f: F): [string, string][];
  // For a screen reader: every key pressed.
  label(f: F): string;
  // The legend's fingering (nothing pressed), and its label for an instrument with these options.
  blank: string;
  legendLabel(options: Options): string;
}
