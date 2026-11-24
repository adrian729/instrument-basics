// The trumpets: the B♭ trumpet (the usual one), the C trumpet (common in orchestras), fingered alike for the same
// written notes, and the four-valve piccolo trumpet in B♭.
import { VALVES_NOTATION } from "../../notations/valves/notation";
import { define, type Group } from "../instrument";
import { DRAWINGS } from "../drawn";
import { HARMONICS, THREE, TIP, YAMAHA } from "./brass";
import { PICCOLO_TRUMPET } from "./piccolo-trumpet";
import { SLIDE, threeValves } from "./three-valves";

const SLIDES = "<b>Tuning slides.</b> 1–3 and 1–2–3 are sharp: push the 3rd valve slide out with the left ring finger (the 1st valve's, with the left thumb, helps too).";
const TRUMPET = threeValves(SLIDE);

export const TRUMPETS: Group = {
  id: "trumpets",
  name: "Trumpets",
  section: "Brass",
  sources: `The fingerings and alternatives are from <a href="${YAMAHA}">Yamaha's trumpet fingering chart</a>; the tuning advice, the ranges and the piccolo trumpet's 4th valve from Wikipedia's <a href="https://en.wikipedia.org/wiki/Trumpet">Trumpet</a> and <a href="https://en.wikipedia.org/wiki/Piccolo_trumpet">Piccolo trumpet</a>.${DRAWINGS(["Yamaha Corporation", "YTR-8335LA trumpet", "Yamaha Trumpet YTR-8335LA.tif"], ["Yamaha Corporation", "YTR-9835 piccolo trumpet", "Yamaha Piccolo trumpet YTR-9835.jpg"])}`,
  instruments: [
    define({
      id: "bb-trumpet", group: "trumpets", name: "B♭ trumpet", kind: "B♭", title: "The B♭ trumpet, the usual one, sounding a tone lower", clef: "treble", transposition: { steps: -1, semitones: -2 }, options: { ...THREE, drawing: "trumpet" },
      facts: [
        "<b>It sounds a tone lower.</b> The B♭ trumpet, the usual one, sounds B♭ for a written C. The chart names written notes, and each card says what you'll hear.",
        HARMONICS,
        SLIDES,
      ],
      tip: TIP,
    }, VALVES_NOTATION, TRUMPET),
    define({
      id: "c-trumpet", group: "trumpets", name: "C trumpet", kind: "C", title: "The C trumpet, sounding as written", clef: "treble", transposition: { steps: 0, semitones: 0 }, options: { ...THREE, drawing: "trumpet" },
      facts: [
        "<b>It sounds as written.</b> The C trumpet, common in orchestras (American ones especially) alongside the B♭, reads concert pitch: the note on the page is the note you hear.",
        "<b>Fingered like the B♭ trumpet.</b> The same written note takes the same valves; it just sounds a tone higher.",
        SLIDES,
      ],
      tip: TIP,
    }, VALVES_NOTATION, TRUMPET),
    define({
      id: "piccolo-trumpet", group: "trumpets", name: "piccolo trumpet", kind: "Piccolo", title: "The piccolo trumpet in B♭, four valves, sounding a minor seventh higher", clef: "treble", transposition: { steps: 6, semitones: 10 }, options: { valves: [2, 1, 3, 5], openHorn: "C3", drawing: "piccolo-trumpet" },
      facts: [
        "<b>It sounds a minor seventh higher.</b> The piccolo trumpet in B♭ is an octave above the B♭ trumpet: a written C sounds the B♭ above it.",
        "<b>The 4th valve</b> lowers a fourth: in tune where 1–3 and 1–2–3 are sharp, and with the others down to written C♯3.",
        "<b>Fingered like the trumpet</b> everywhere else: the same written note, the same valves, up to written G5 (sounding F6).",
      ],
      tip: TIP,
    }, VALVES_NOTATION, PICCOLO_TRUMPET),
  ],
};
