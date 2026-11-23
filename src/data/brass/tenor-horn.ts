// The tenor horn, in E♭ (the alto horn, in the US): the brass band's, held upright; fingered like the trumpet.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, HARMONICS, THREE, TIP, WIKIPEDIA, YAMAHA } from "./brass";
import { LIP, threeValves } from "./three-valves";

export const TENOR_HORN: Group = {
  id: "tenor-horn",
  name: "Tenor horn",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as the tenor horn is fingered like the trumpet; that, and its range, from Wikipedia's ${WIKIPEDIA("Tenor_horn")} and ${WIKIPEDIA("Mellophone")}.`,
  instruments: [
    define({
      id: "tenor-horn", group: "tenor-horn", name: "tenor horn", kind: "Tenor horn", title: "The E♭ tenor horn (the alto horn, in the US), sounding a major sixth lower", clef: "treble", transposition: { steps: -5, semitones: -9 }, options: { ...THREE, upright: true },
      facts: [
        "<b>It sounds a major sixth lower.</b> The tenor horn (the alto horn, in the US) is in E♭: a written C sounds the E♭ below. The chart names written notes, and each card says what you'll hear.",
        `${ALIKE("")} It's held upright, its bell up, and plays the inner parts of a brass band.`,
        HARMONICS,
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
