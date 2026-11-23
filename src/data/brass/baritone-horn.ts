// The baritone horn, in B♭, read here in treble clef (as in brass bands): the euphonium's narrower relative,
// with three valves, fingered like the trumpet an octave and a tone lower.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, NINTH, THREE, TIP, WIKIPEDIA, YAMAHA } from "./brass";
import { LIP, threeValves } from "./three-valves";

export const BARITONE_HORN: Group = {
  id: "baritone-horn",
  name: "Baritone horn",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as the baritone horn is fingered like the trumpet; that, and its range, from Wikipedia's ${WIKIPEDIA("Baritone_horn")}.`,
  instruments: [
    define({
      id: "baritone-horn", group: "baritone-horn", name: "baritone horn", kind: "Baritone", title: "The baritone horn, three valves, in B♭ treble clef, sounding a major ninth lower", clef: "treble", transposition: { steps: -8, semitones: -14 }, options: { ...THREE, upright: true },
      facts: [
        NINTH("baritone horn"),
        `${ALIKE(", an octave and a tone lower")} Narrower than the euphonium, with a brighter sound.`,
        "<b>Three valves</b>, on most: down to written F♯3. One with a 4th valve plays the euphonium's chart.",
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
