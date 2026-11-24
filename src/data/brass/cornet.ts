// The cornet, in B♭: its own instrument, not a trumpet (a conical bore, a compact shape, a mellower sound, and
// its own parts in brass and concert bands), but fingered like the trumpet at the same pitch.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, HARMONICS, THREE, TIP, WIKIPEDIA, YAMAHA, DRAWN } from "./brass";
import { LIP, threeValves } from "./three-valves";

export const CORNET: Group = {
  id: "cornet",
  name: "Cornet",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as the cornet is fingered like the trumpet; that, and its range, from Wikipedia's ${WIKIPEDIA("Cornet")}.${DRAWN("YCR-6330II cornet", "Yamaha Cornet YCR-6330II.tif")}`,
  instruments: [
    define({
      id: "cornet", group: "cornet", name: "cornet", kind: "Cornet", title: "The B♭ cornet, sounding a tone lower", clef: "treble", transposition: { steps: -1, semitones: -2 }, options: { ...THREE, bell: "cornet", drawing: "cornet" },
      facts: [
        "<b>It sounds a tone lower.</b> The cornet is in B♭: a written C sounds B♭. The chart names written notes, and each card says what you'll hear.",
        `${ALIKE(", at the same pitch")} Its bore is conical and its shape more compact, for a mellower sound.`,
        HARMONICS,
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
