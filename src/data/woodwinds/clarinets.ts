// The clarinets: the E♭, B♭ (the usual first), A and bass clarinets, Boehm-system, by size, fingered alike.
import { CLARINET_NOTATION } from "../../notations/clarinet/notation";
import { intervalWords } from "../../lib/notes";
import { define, type Group } from "../instrument";
import { CLARINET } from "./clarinet";

const WFG = "https://www.wfg.woodwind.org/clarinet/";
const WRITTEN = "The chart names written notes, and each card says what you'll hear.";
const TWELFTH = "<b>It overblows a twelfth.</b> The register key takes the chalumeau's fingerings up an octave and a fifth, not an octave as on the flute or saxophone: clarion B is low E's fingering, and so on.";
const ALIKE = "<b>Fingered alike on every size</b>, E♭ to bass: the same written note takes the same keys.";
const TIP = "Most alternatives are for an easier passage: the pinkies' keys taking turns, the sliver and side keys in chromatic passages. Others are for tone and tuning, above all on the throat notes. Try them with a tuner, and keep what works on yours.";
const about = (id: "eb-clarinet" | "bb-clarinet" | "a-clarinet" | "bass-clarinet", name: string, kind: string, key: string, steps: number, semitones: number) => ({
  id, group: "clarinets" as const, name, kind, title: `The ${name}, in ${key}, sounding ${intervalWords({ steps, semitones })}`, clef: "treble" as const,
  transposition: { steps, semitones }, tip: TIP,
});

export const CLARINETS: Group = {
  id: "clarinets",
  name: "Clarinets",
  section: "Woodwinds",
  default: "bb-clarinet",
  sources: `The fingerings are from <a href="${WFG}">The Woodwind Fingering Guide</a>, their comments adapted: its Boehm clarinet pages (basic: <a href="${WFG}cl_bas_1.html">chalumeau</a>, <a href="${WFG}cl_bas_2.html">clarion</a>, <a href="${WFG}cl_bas_3.html">lower altissimo</a>; alternate: <a href="${WFG}cl_alt_1.html">chalumeau and throat</a>, <a href="${WFG}cl_alt_4.html">upper altissimo</a>) and bass clarinet pages (<a href="${WFG}basscl_alt_1.html">chalumeau</a>, <a href="${WFG}basscl_alt_2.html">altissimo</a>). The ranges and keys from Wikipedia's <a href="https://en.wikipedia.org/wiki/Clarinet">Clarinet</a> and <a href="https://en.wikipedia.org/wiki/Bass_clarinet">Bass clarinet</a>.`,
  instruments: [
    define({
      ...about("eb-clarinet", "E♭ clarinet", "E♭", "E♭", 2, 3), options: {},
      facts: [`<b>It sounds a minor third higher.</b> The E♭ clarinet, the small one, is in E♭: a written C sounds the E♭ above. ${WRITTEN}`, ALIKE, TWELFTH],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...about("bb-clarinet", "B♭ clarinet", "B♭", "B♭", -1, -2), options: {},
      facts: [`<b>It sounds a tone lower.</b> The B♭ clarinet, the usual one, is in B♭: a written C sounds B♭. ${WRITTEN}`, TWELFTH, ALIKE],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...about("a-clarinet", "A clarinet", "A", "A", -2, -3), options: {},
      facts: [`<b>It sounds a minor third lower.</b> The A clarinet, common in orchestras alongside the B♭, is in A: a written C sounds the A below. ${WRITTEN}`, ALIKE, TWELFTH],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...about("bass-clarinet", "bass clarinet", "Bass", "B♭", -8, -14), options: { bass: true },
      facts: [
        `<b>It sounds a major ninth lower</b> (an octave and a tone). The bass clarinet is in B♭, an octave below the B♭ clarinet, and read in treble clef, as most of its parts are. ${WRITTEN}`,
        "<b>Its lowest notes.</b> Every bass clarinet has a low E♭ key; a low C one adds D, C♯ and C, the chart's first three notes. On a low E♭ bass clarinet, start at E♭.",
        "<b>Fingered like the B♭ clarinet</b> up to clarion C. From altissimo D up, left 1 is half-holed, its ring pressed and the hole left open, where the smaller clarinets lift it.",
      ],
    }, CLARINET_NOTATION, CLARINET),
  ],
};
