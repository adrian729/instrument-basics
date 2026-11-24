// The clarinets: the E♭, B♭ (the usual first), A and bass clarinets, Boehm-system, by size, fingered alike; and
// the E♭, B♭ and A in the German (Oehler) system, as played in Germany and Austria, fingered alike too.
import { CLARINET_NOTATION } from "../../notations/clarinet/notation";
import { OEHLER_NOTATION } from "../../notations/oehler/notation";
import { intervalWords } from "../../lib/notes";
import { define, type Group } from "../instrument";
import { DRAWINGS } from "../drawn";
import { CLARINET } from "./clarinet";
import { OEHLER } from "./oehler";

const WFG = "https://www.wfg.woodwind.org/clarinet/";
const WRITTEN = "The chart names written notes, and each card says what you'll hear.";
const TWELFTH = "<b>It overblows a twelfth.</b> The register key takes the chalumeau's fingerings up an octave and a fifth, not an octave as on the flute or saxophone: clarion B is low E's fingering, and so on.";
const ALIKE = "<b>Fingered alike on every size</b>, E♭ to bass, up to clarion C: the same written note takes the same keys (the bass clarinet's altissimo is its own).";
const TIP = "Most alternatives are for an easier passage: the pinkies' keys taking turns, the sliver and side keys in chromatic passages. Others are for tone and tuning, above all on the throat notes. Try them with a tuner, and keep what works on yours.";
const about = (id: "eb-clarinet" | "bb-clarinet" | "a-clarinet" | "bass-clarinet", name: string, kind: string, key: string, steps: number, semitones: number) => ({
  id, group: "clarinets" as const, name, kind, system: "Boehm", title: `The ${name}, in ${key}, sounding ${intervalWords({ steps, semitones })}`, clef: "treble" as const,
  transposition: { steps, semitones }, tip: TIP,
});
const german = (id: "eb-clarinet-german" | "bb-clarinet-german" | "a-clarinet-german", kind: string, steps: number, semitones: number) => ({
  id, group: "clarinets" as const, name: `German-system ${kind} clarinet`, kind, system: "German", clef: "treble" as const,
  title: `The ${kind} clarinet, German (Oehler) system, sounding ${intervalWords({ steps, semitones })}`, transposition: { steps, semitones }, tip: GERMAN_TIP,
});
const GERMAN_TIP = "Most alternatives are for an easier passage: the levers and sliver keys in chromatic passages, the fork where it's handier. Others are for tone and tuning, above all on the throat notes. German clarinets differ in their extra keys: use those yours has.";
const OEHLER_IS = "<b>The German (Oehler) system</b>, played mostly in Germany and Austria: Müller's clarinet as Oskar Oehler finished it about 1905, with extra tone holes to put the forked B♭ and F in tune, a narrower bore and a longer, narrower mouthpiece.";
const OEHLER_FINGERS = "<b>Fingered unlike the Boehm clarinet</b> in places: the pinkies' keys aren't doubled (low E and clarion B take both pinkies), the thumb alone is F♯, F is left 1 with a side key, B♭ is right 1 and 2 with a sliver key, and clarion C is left 2. The throat notes and the altissimo are much as on the Boehm.";

export const CLARINETS: Group = {
  id: "clarinets",
  name: "Clarinets",
  section: "Woodwinds",
  default: "bb-clarinet",
  sources: `The fingerings are from <a href="${WFG}">The Woodwind Fingering Guide</a>, their comments adapted: its Boehm clarinet pages (basic: <a href="${WFG}cl_bas_1.html">chalumeau</a>, <a href="${WFG}cl_bas_2.html">clarion</a>, <a href="${WFG}cl_bas_3.html">lower altissimo</a>; alternate: <a href="${WFG}cl_alt_1.html">chalumeau and throat</a>, <a href="${WFG}cl_alt_4.html">upper altissimo</a>) and bass clarinet pages (<a href="${WFG}basscl_alt_1.html">chalumeau</a>, <a href="${WFG}basscl_alt_2.html">altissimo</a>). The ranges and keys from Wikipedia's <a href="https://en.wikipedia.org/wiki/Clarinet">Clarinet</a> and <a href="https://en.wikipedia.org/wiki/Bass_clarinet">Bass clarinet</a>. The German system's fingerings from the guide's Oehler/Albert pages (basic: <a href="${WFG}ocl_bas_1.html">chalumeau</a>, <a href="${WFG}ocl_bas_2.html">clarion</a>, <a href="${WFG}ocl_bas_3.html">altissimo</a>; alternate: <a href="${WFG}ocl_alt_4.html">upper altissimo</a>), its comments adapted, checked against <a href="https://data.yamaha.com/files/download/other_assets/5/331715/G_Clarinet_2013_web.pdf">Yamaha's German-system clarinet owner's manual</a> and <a href="https://a-klarinette.de/files/A-KLARINETTE/content/dokumente/Klarinette_Grifftabelle.pdf">A-Klarinette's fingering chart</a>; its history and keys from Wikipedia's <a href="https://en.wikipedia.org/wiki/Oehler_system">Oehler system</a> and <a href="https://de.wikipedia.org/wiki/Oehler-System">Oehler-System</a> (German).${DRAWINGS(["Yamaha Corporation", "YCL-CSGIII clarinet", "Yamaha Clarinet YCL-CSGIII.tif"], ["Yamaha Corporation", "YCL-622II bass clarinet", "Yamaha Bass Clarinet YCL-622II.jpg"], ["Yamaha Corporation", "YCL-457II-22 German-system clarinet", "Yamaha Clarinet YCL-457II-22 (8K).jpg"])}`,
  instruments: [
    define({
      ...about("eb-clarinet", "E♭ clarinet", "E♭", "E♭", 2, 3), options: { drawing: "clarinet" },
      facts: [`<b>It sounds a minor third higher.</b> The E♭ clarinet, the small one, is in E♭: a written C sounds the E♭ above. ${WRITTEN}`, ALIKE, TWELFTH],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...about("bb-clarinet", "B♭ clarinet", "B♭", "B♭", -1, -2), options: { drawing: "clarinet" },
      facts: [`<b>It sounds a tone lower.</b> The B♭ clarinet, the usual one, is in B♭: a written C sounds B♭. ${WRITTEN}`, TWELFTH, ALIKE],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...about("a-clarinet", "A clarinet", "A", "A", -2, -3), options: { drawing: "clarinet" },
      facts: [`<b>It sounds a minor third lower.</b> The A clarinet, common in orchestras alongside the B♭, is in A: a written C sounds the A below. ${WRITTEN}`, ALIKE, TWELFTH],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...about("bass-clarinet", "bass clarinet", "Bass", "B♭", -8, -14), options: { bass: true, drawing: "bass-clarinet" },
      facts: [
        `<b>It sounds a major ninth lower</b> (an octave and a tone). The bass clarinet is in B♭, an octave below the B♭ clarinet, and read in treble clef, as most of its parts are. ${WRITTEN}`,
        "<b>Its lowest notes.</b> Every bass clarinet has a low E♭ key; a low C one adds D, C♯ and C, the chart's first three notes. On a low E♭ bass clarinet, start at E♭.",
        "<b>Fingered like the B♭ clarinet</b> up to clarion C. From altissimo D up, left 1 is mostly half-holed, its ring pressed and the hole left open, where the smaller clarinets lift it.",
      ],
    }, CLARINET_NOTATION, CLARINET),
    define({
      ...german("eb-clarinet-german", "E♭", 2, 3), options: { drawing: "german-clarinet" },
      facts: [`<b>It sounds a minor third higher.</b> The E♭ clarinet, the small one, is in E♭: a written C sounds the E♭ above. ${WRITTEN}`, OEHLER_IS, OEHLER_FINGERS, TWELFTH],
    }, OEHLER_NOTATION, OEHLER),
    define({
      ...german("bb-clarinet-german", "B♭", -1, -2), options: { drawing: "german-clarinet" },
      facts: [`<b>It sounds a tone lower.</b> The B♭ clarinet, the usual one, is in B♭: a written C sounds B♭. ${WRITTEN}`, OEHLER_IS, OEHLER_FINGERS, TWELFTH],
    }, OEHLER_NOTATION, OEHLER),
    define({
      ...german("a-clarinet-german", "A", -2, -3), options: { drawing: "german-clarinet" },
      facts: [`<b>It sounds a minor third lower.</b> The A clarinet, common in orchestras alongside the B♭, is in A: a written C sounds the A below. ${WRITTEN}`, OEHLER_IS, OEHLER_FINGERS, TWELFTH],
    }, OEHLER_NOTATION, OEHLER),
  ],
};
