// The cornet and the flugelhorn: the trumpet's close relatives, in B♭ and fingered like it, with a conical
// bore (the flugelhorn's wider) and a mellower sound.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, HARMONICS, THREE, TIP, WIKIPEDIA, YAMAHA } from "./brass";
import { LIP, threeValves } from "./three-valves";

const TONE = (name: string) => `<b>It sounds a tone lower.</b> The ${name} is in B♭: a written C sounds B♭. The chart names written notes, and each card says what you'll hear.`;

export const CORNETS: Group = {
  id: "cornets",
  name: "Cornet and flugelhorn",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as both are fingered like the trumpet; that, and their ranges, from Wikipedia's ${WIKIPEDIA("Cornet")} and ${WIKIPEDIA("Flugelhorn")}.`,
  instruments: [
    define({
      id: "cornet", group: "cornets", name: "cornet", kind: "Cornet", title: "The B♭ cornet, sounding a tone lower", clef: "treble", transposition: { steps: -1, semitones: -2 }, options: THREE,
      facts: [
        TONE("cornet"),
        `${ALIKE(", at the same pitch")} Its bore is conical and its shape more compact, for a mellower sound.`,
        HARMONICS,
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
    define({
      id: "flugelhorn", group: "cornets", name: "flugelhorn", kind: "Flugelhorn", title: "The B♭ flugelhorn, sounding a tone lower", clef: "treble", transposition: { steps: -1, semitones: -2 }, options: THREE,
      facts: [
        TONE("flugelhorn"),
        `${ALIKE(" and the cornet, at the same pitch")} Its bore is a bugle's, wide and conical, for a darker sound; its top notes are harder to keep clear and in tune.`,
        "<b>Three valves.</b> Some flugelhorns have a 4th, lowering a fourth, for a few lower notes: the chart is the three-valve one.",
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
