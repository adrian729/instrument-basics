// The flugelhorn, in B♭: a valved bugle, not a trumpet (a wide conical bore, a darker sound), fingered like
// the trumpet at the same pitch.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, THREE, TIP, WIKIPEDIA, YAMAHA, DRAWN } from "./brass";
import { LIP, threeValves } from "./three-valves";

export const FLUGELHORN: Group = {
  id: "flugelhorn",
  name: "Flugelhorn",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as the flugelhorn is fingered like the trumpet; that, and its range, from Wikipedia's ${WIKIPEDIA("Flugelhorn")}.${DRAWN("YFH-8310Z flugelhorn", "Yamaha Flugelhorn YFH-8310Z.tif")}`,
  instruments: [
    define({
      id: "flugelhorn", group: "flugelhorn", name: "flugelhorn", kind: "Flugelhorn", title: "The B♭ flugelhorn, sounding a tone lower", clef: "treble", transposition: { steps: -1, semitones: -2 }, options: { ...THREE, bell: "flugelhorn", drawing: "flugelhorn" },
      facts: [
        "<b>It sounds a tone lower.</b> The flugelhorn is in B♭: a written C sounds B♭. The chart names written notes, and each card says what you'll hear.",
        `${ALIKE(" and the cornet, at the same pitch")} Its bore is a bugle's, wide and conical, for a darker sound; its top notes are harder to keep clear and in tune.`,
        "<b>Three valves.</b> Some flugelhorns have a 4th, lowering a fourth, for a few lower notes: the chart is the three-valve one.",
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
