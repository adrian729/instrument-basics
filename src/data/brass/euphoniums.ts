// The euphonium and the baritone horn: the brass band's tenor voices, both in B♭, read here in treble clef
// (as in brass bands, sounding a major ninth lower) and fingered like the trumpet; the euphonium with a 4th
// valve for its lowest notes.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { ALIKE, HARMONICS, THREE, TIP, WIKIPEDIA, YAMAHA } from "./brass";
import { EUPHONIUM, EVERETT } from "./euphonium";
import { LIP, threeValves } from "./three-valves";

const NINTH = (name: string) => `<b>It sounds a major ninth lower</b> (an octave and a tone). Read in treble clef, as in brass bands, the ${name} is in B♭: a written C sounds the B♭ an octave and a tone below. In bass clef it's read at concert pitch: this chart is the treble clef's.`;

export const EUPHONIUMS: Group = {
  id: "euphoniums",
  name: "Euphonium and baritone",
  section: "Brass",
  sources: `The euphonium's fingerings are from Micah Everett's <a href="${EVERETT}">chromatic fingering chart for euphonium (treble clef)</a>, University of Mississippi, in its order of preference; the baritone's from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>, as it's fingered like the trumpet. Their ranges, and the 4th valve, from Wikipedia's ${WIKIPEDIA("Euphonium")} and ${WIKIPEDIA("Baritone_horn")}.`,
  instruments: [
    define({
      id: "euphonium", group: "euphoniums", name: "euphonium", kind: "Euphonium", title: "The euphonium, four valves, in B♭ treble clef, sounding a major ninth lower", clef: "treble", transposition: { steps: -8, semitones: -14 },
      options: { valves: [2, 1, 3, 5], openHorn: "C3", upright: true },
      facts: [
        NINTH("euphonium"),
        "<b>The 4th valve</b> lowers a fourth: in place of 1–3 and 1–2–3, better in tune, and with the others down to written C♯3. On a compensating euphonium (the better ones have it) the lowest notes are in tune too.",
        "<b>Not compensating?</b> Then the notes under written F♯3 are sharp: play each with the fingering the chart gives a semitone lower (written F3 with 1–2–4, or 1–4), and low C♯3 only as a weak false tone, with 1–2–3–4.",
      ],
      tip: TIP,
    }, VALVES_NOTATION, EUPHONIUM),
    define({
      id: "baritone-horn", group: "euphoniums", name: "baritone horn", kind: "Baritone", title: "The baritone horn, three valves, in B♭ treble clef, sounding a major ninth lower", clef: "treble", transposition: { steps: -8, semitones: -14 }, options: { ...THREE, upright: true },
      facts: [
        NINTH("baritone horn"),
        `${ALIKE(", an octave and a tone lower")} Narrower than the euphonium, with a brighter sound.`,
        "<b>Three valves</b>, on most: down to written F♯3. One with a 4th valve plays the euphonium's chart.",
      ],
      tip: TIP,
    }, VALVES_NOTATION, threeValves(LIP)),
  ],
};
