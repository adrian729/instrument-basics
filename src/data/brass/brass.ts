// What the brass groups share: Yamaha's trumpet chart (the fingerings of every three-valve instrument here),
// the valves as most have them, and the facts and the footer's tip about them.
export const YAMAHA = "https://www.yamaha.com/en/musical_instrument_guide/common/images/trumpet/fingering.pdf";
export const WIKIPEDIA = (article: string, text = article.replaceAll("_", " ")) => `<a href="https://en.wikipedia.org/wiki/${article}">${text}</a>`;
// Three valves, lowering 2, 1 and 3 semitones, on a horn whose lowest harmonic is written C3 (in treble clef,
// every one here: the euphonium's and baritone's an octave and a tone below the trumpet's).
export const THREE = { valves: [2, 1, 3], openHorn: "C3" };
export const HARMONICS = "<b>Three valves, every note.</b> Each fingering plays a series of notes, its harmonics, and the lips choose which: so C, G and the C above are all open.";
export const ALIKE = (others: string) => `<b>Fingered like the trumpet</b>${others}: the same written note takes the same valves.`;
export const NINTH = (name: string) => `<b>It sounds a major ninth lower</b> (an octave and a tone). Read in treble clef, as in brass bands, the ${name} is in B♭: a written C sounds the B♭ an octave and a tone below. In bass clef it's read at concert pitch: this chart is the treble clef's.`;
export const TIP = "Most alternatives are for tuning, or for a passage where another valve combination is easier. Try them with a tuner, and keep what works on yours.";

// The credit for an instrument's drawing (notations/valves/drawings.ts): traced from a photo of Yamaha's.
export const DRAWN = (model: string, file: string) => ` The drawing is traced from Yamaha Corporation's photo of the ${model} (<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>), and shared under the same licence.`;
