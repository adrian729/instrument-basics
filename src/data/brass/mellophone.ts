// The mellophone, in F: the marching band's alto voice, played in place of the French horn, its bell forward;
// fingered like the trumpet.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, HARMONICS, THREE, TIP, WIKIPEDIA, YAMAHA, DRAWN } from "./brass";
import { LIP, threeValves } from "./three-valves";

export const MELLOPHONE: Group = {
  id: "mellophone",
  name: "Mellophone",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as the mellophone is fingered like the trumpet; that, and its range, from Wikipedia's ${WIKIPEDIA("Mellophone")}.${DRAWN("YMP-204MS mellophone", "Yamaha Mellophone YMP-204MS.tiff")}`,
  instruments: [
    define({
      id: "mellophone", group: "mellophone", name: "mellophone", kind: "Mellophone", title: "The mellophone, in F, sounding a fifth lower", clef: "treble", transposition: { steps: -4, semitones: -7 }, options: { ...THREE, drawing: "mellophone" },
      facts: [
        "<b>It sounds a fifth lower.</b> The mellophone is in F: a written C sounds the F below. The chart names written notes, and each card says what you'll hear.",
        `${ALIKE("")} It's played in marching bands in place of the French horn, its bell forward.`,
        HARMONICS,
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
