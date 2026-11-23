// The alto voices of the bands' brass, both fingered like the trumpet: the mellophone in F (the marching
// band's, its bell forward) and the tenor horn in E♭ (the brass band's, upright; the alto horn in the US).
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, HARMONICS, THREE, TIP, WIKIPEDIA, YAMAHA } from "./brass";
import { LIP, threeValves } from "./three-valves";

export const ALTO_HORNS: Group = {
  id: "alto-horns",
  name: "Mellophone and tenor horn",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as both are fingered like the trumpet; that, and their ranges, from Wikipedia's ${WIKIPEDIA("Mellophone")} and ${WIKIPEDIA("Tenor_horn")}.`,
  instruments: [
    define({
      id: "mellophone", group: "alto-horns", name: "mellophone", kind: "Mellophone", title: "The mellophone, in F, sounding a fifth lower", clef: "treble", transposition: { steps: -4, semitones: -7 }, options: THREE,
      facts: [
        "<b>It sounds a fifth lower.</b> The mellophone is in F: a written C sounds the F below. The chart names written notes, and each card says what you'll hear.",
        `${ALIKE("")} It's played in marching bands in place of the French horn, its bell forward.`,
        HARMONICS,
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
    define({
      id: "tenor-horn", group: "alto-horns", name: "tenor horn", kind: "Tenor horn", title: "The E♭ tenor horn (the alto horn, in the US), sounding a major sixth lower", clef: "treble", transposition: { steps: -5, semitones: -9 }, options: { ...THREE, upright: true },
      facts: [
        "<b>It sounds a major sixth lower.</b> The tenor horn (the alto horn, in the US) is in E♭: a written C sounds the E♭ below. The chart names written notes, and each card says what you'll hear.",
        `${ALIKE("")} It's held upright, its bell up, and plays the inner parts of a brass band.`,
        HARMONICS,
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
