// The euphonium, in B♭, read here in treble clef (as in brass bands): four valves, the 4th for its lowest
// notes, fingered from its own chart (euphonium-chart.ts).
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { NINTH, TIP, WIKIPEDIA, DRAWN } from "./brass";
import { EUPHONIUM_CHART, EVERETT } from "./euphonium-chart";

export const EUPHONIUM: Group = {
  id: "euphonium",
  name: "Euphonium",
  section: "Brass",
  sources: `The fingerings are from Micah Everett's <a href="${EVERETT}">chromatic fingering chart for euphonium (treble clef)</a>, University of Mississippi, in its order of preference. The range, and the 4th valve, from Wikipedia's ${WIKIPEDIA("Euphonium")}.${DRAWN("YEP-621 euphonium", "Yamaha Euphonium YEP-621.tif")}`,
  instruments: [
    define({
      id: "euphonium", group: "euphonium", name: "euphonium", kind: "Euphonium", title: "The euphonium, four valves, in B♭ treble clef, sounding a major ninth lower", clef: "treble", transposition: { steps: -8, semitones: -14 },
      options: { valves: [2, 1, 3, 5], openHorn: "C3", valvesOnly: true, sideValve: true, drawing: "euphonium" },
      facts: [
        NINTH("euphonium"),
        "<b>The 4th valve</b> lowers a fourth: in place of 1–3 and 1–2–3, better in tune, and with the others down to written C♯3. On a compensating euphonium (the better ones have it) the lowest notes are in tune too.",
        "<b>Not compensating?</b> Then the notes under written F♯3 are sharp: play each with the fingering the chart gives a semitone lower (written F3 with 1–2–4, or 1–4), and low C♯3 only as a weak false tone, with 1–2–3–4.",
      ],
      tip: TIP,
    }, VALVES_NOTATION, EUPHONIUM_CHART),
  ],
};
