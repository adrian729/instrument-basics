// The instruments the chart is for: the concert flute and the piccolo, both Boehm-system, fingered alike for
// the first two octaves. The first is the page's default.
import type { Register } from "./fingerings";
import { FLUTE } from "./flute";
import { PICCOLO } from "./piccolo";

export type InstrumentId = "flute" | "piccolo";
export type Instrument = {
  id: InstrumentId;
  name: string; // as in a sentence: "the flute"
  octavesUp: number; // how far above the written note it sounds
  foot: boolean; // a foot joint, with the right pinky's low C♯, C and B keys
  registers: Register[];
};

export const INSTRUMENTS: Instrument[] = [
  { id: "flute", name: "flute", octavesUp: 0, foot: true, registers: FLUTE },
  { id: "piccolo", name: "piccolo", octavesUp: 1, foot: false, registers: PICCOLO },
];
export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;
