// Every note of the Boehm piccolo, from its lowest D to the D three octaves up, at written pitch (it sounds an
// octave higher). Each note's first fingering is the standard one; the rest are alternatives, for tuning,
// soft or loud playing, or response. From The Woodwind Fingering Guide's piccolo pages
// (wfg.woodwind.org/flute/picc_alt_1.html, _2, _3), its comments adapted. A piccolo has no foot joint, so
// nothing here uses the flute's low C♯, C or B keys.
//
// A fingering is written as the player reads it, left hand then right:
//   thumb  B (the B key), Bb (the B♭ lever) or - (off)
//   then   the left hand's fingers 1 2 3 (index, middle, ring), - for one up; then G# (the left pinky's key)
//   |      then the right hand's 1 2 3 the same way; then Eb (the right pinky's key)
//   then   any of trD (the D trill key, between right 1 and 2), trD# (the D♯ trill key, between right 2
//          and 3) and side (the side B♭ lever, beside right 1)
// e.g. "B 123 G# | --- Eb": the B thumb key, all three left fingers, the G♯ key, and the E♭ key.

export type Thumb = "B" | "Bb" | null;
export type Extra = "trD" | "trD#" | "side";
export type Fingering = {
  thumb: Thumb;
  left: [boolean, boolean, boolean];
  gSharp: boolean;
  right: [boolean, boolean, boolean];
  eFlat: boolean;
  extras: Extra[];
  note: string;
  source: string; // as written in the table below
};
export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Pitch = { letter: Letter; sharp: boolean; octave: number };
export type Note = { id: string; pitch: Pitch; fingerings: Fingering[] };
export type Register = { id: string; name: string; range: string; about: string; notes: Note[] };

const FINGERS = /^[1-][2-][3-]$/;

// One fingering from its notation (see above); throws on anything else, so that a typo fails the tests.
export function parseFingering(source: string, note = ""): Fingering {
  const [leftSide, rightSide, ...rest] = source.split("|").map((s) => s.trim().split(/\s+/));
  if (!leftSide || !rightSide || rest.length) throw new Error(`"${source}": needs one |`);
  const [thumb, left, ...leftKeys] = leftSide;
  const [right, ...rightKeys] = rightSide;
  if (!["B", "Bb", "-"].includes(thumb)) throw new Error(`"${source}": thumb is B, Bb or -`);
  if (!FINGERS.test(left ?? "") || !FINGERS.test(right ?? "")) throw new Error(`"${source}": fingers are like 1-3`);
  if (leftKeys.some((k) => k !== "G#") || leftKeys.length > 1) throw new Error(`"${source}": the left hand's only key is G#`);
  const extras = rightKeys.filter((k) => k !== "Eb");
  if (rightKeys.filter((k) => k === "Eb").length > 1 || extras.some((k) => !["trD", "trD#", "side"].includes(k)) || new Set(extras).size !== extras.length)
    throw new Error(`"${source}": the right hand's keys are Eb, trD, trD# and side, once each`);
  const down = (s: string) => [s[0] !== "-", s[1] !== "-", s[2] !== "-"] as [boolean, boolean, boolean];
  return {
    thumb: thumb === "-" ? null : (thumb as Thumb), left: down(left), gSharp: leftKeys.includes("G#"), right: down(right),
    eFlat: rightKeys.includes("Eb"), extras: extras as Extra[], note, source,
  };
}

export function parsePitch(id: string): Pitch {
  const m = /^([A-G])(#?)(\d)$/.exec(id);
  if (!m) throw new Error(`"${id}": a note is like D4 or F#5`);
  return { letter: m[1] as Letter, sharp: m[2] === "#", octave: Number(m[3]) };
}

type Row = [id: string, ...fingerings: (string | [string, string])[]];
const note = ([id, ...fs]: Row): Note => ({
  id, pitch: parsePitch(id), fingerings: fs.map((f) => (typeof f === "string" ? parseFingering(f) : parseFingering(f[0], f[1]))),
});

export const REGISTERS: Register[] = [
  {
    id: "low", name: "First octave", range: "D4 – C♯5",
    about: "The low register, with a slow, relaxed air stream. All six fingers down is the lowest note: there's no foot joint below it.",
    notes: ([
      ["D4", ["B 123 | 123", "The lowest note. Right pinky off the E♭ key."]],
      ["D#4", "B 123 | 123 Eb"],
      ["E4", "B 123 | 12- Eb"],
      ["F4", "B 123 | 1-- Eb"],
      ["F#4", "B 123 | --3 Eb", ["B 123 | -2- Eb", "Flatter. Good for fast slurs with E."]],
      ["G4", "B 123 | --- Eb"],
      ["G#4", "B 123 G# | --- Eb"],
      ["A4", "B 12- | --- Eb", ["B 12- G# | 1-- Eb", "Good for ff."]],
      ["A#4", ["Bb 1-- | --- Eb", "The B♭ thumb lever. Not in passages that also have B."], ["B 1-- | 1-- Eb", "One-and-one: right 1 down. Good for ff, and fine next to B."], ["B 1-- | --- Eb side", "The side B♭ lever, with the side of right 1. Good in fast passages."]],
      ["B4", "B 1-- | --- Eb"],
      ["C5", "- 1-- | --- Eb"],
      ["C#5", ["- --- | --- Eb", "Can be unstable and sharp."], ["- --- | 123 Eb", "Better in tune."]],
    ] as Row[]).map(note),
  },
  {
    id: "middle", name: "Second octave", range: "D5 – C♯6",
    about: "From E up, the first octave's fingers again, with faster, more focused air. D and D♯ lift the left index finger.",
    notes: ([
      ["D5", ["B -23 | 123", "Left 1 up, right pinky off E♭. Tends to be sharp."]],
      ["D#5", ["B -23 | 123 Eb", "Left 1 up."]],
      ["E5", "B 123 | 12- Eb", ["B 123 | 12- Eb trD", "The D trill key added keeps it from cracking."]],
      ["F5", "B 123 | 1-- Eb", ["B 123 | 1-- Eb trD", "Sharper. Keeps it from cracking."]],
      ["F#5", "B 123 | --3 Eb", ["B 123 | -2- Eb", "Flatter. Good for fast slurs with E."]],
      ["G5", "B 123 | --- Eb"],
      ["G#5", "B 123 G# | --- Eb"],
      ["A5", "B 12- | --- Eb", ["B 12- G# | 1-- Eb", "Good for ff."]],
      ["A#5", ["Bb 1-- | --- Eb", "The B♭ thumb lever."], ["B 1-- | 1-- Eb", "One-and-one. Good for ff."], ["B 1-- | --- Eb side", "The side B♭ lever."]],
      ["B5", "B 1-- | --- Eb", ["B 1-- | --3 Eb", "Brighter. Good for ff."]],
      ["C6", "- 1-- | --- Eb", ["- 1-- | --3 Eb", "Brighter. Good for ff."], ["- 123 | 1-3", "Sharp, but good for pp, with an excellent response."]],
      ["C#6", ["- --- | --- Eb", "Can be sharp."], ["- --- | 123 Eb", "Better in tune."]],
    ] as Row[]).map(note),
  },
  {
    id: "high", name: "Third octave", range: "D6 – C7",
    about: "Where piccolo and flute charts differ: F♯ and G♯ have piccolo fingerings of their own, and the flute's are kept as alternatives. Fast, narrow air, the throat open.",
    notes: ([
      ["D6", "B -23 | --- Eb", ["B -23 G# | 1-- Eb", "Sharp."], ["B -23 G# | -2- Eb", "Sharper. Good for pp."]],
      ["D#6", "B 123 G# | 123 Eb"],
      ["E6", "B 12- | 12- Eb", ["B 12- | 12- Eb trD", "The D trill key added keeps it from cracking."], ["B 12- | 12-", "Right pinky off. Hard to crack, a little flatter."]],
      ["F6", "B 1-3 | 1-- Eb", ["B 1-3 | 1-3 Eb", "Flatter. Good for ff."]],
      ["F#6", ["B 1-3 | -23", "The piccolo's fingering. Good for hard attacks."], ["B 1-3 | --3 Eb", "The flute's fingering. Slower to speak: avoid hard attacks."]],
      ["G6", "- 123 | --- Eb"],
      ["G#6", ["- -23 G# | -23 Eb", "The piccolo's fingering."], ["- -23 G# | --- Eb", "The flute's fingering. Sharper."]],
      ["A6", "B -2- | 1-- Eb", ["B -2- | 1-3", "Brighter. Good for ff."], ["B -2- | 1--", "Speaks more easily, but sharp."]],
      ["A#6", ["B --- | 1-- trD", "Left hand off but the thumb; right 1 and the D trill key."], ["Bb 1-3 | --- trD#", "The B♭ thumb lever and the D♯ trill key. In tune."]],
      ["B6", ["B 1-3 | --- trD#", "The D♯ trill key, right pinky off."], ["B 1-3 | --- trD", "The D trill key instead. In tune."], ["B 1-3 | -23 Eb trD#", "In tune, and speaks easily."]],
      ["C7", ["- 123 G# | 1--", "The top of the usual range."], ["- 123 G# | 1-- trD", "Speaks better."], ["B 123 G# | 1-- trD#", "Quick to speak and more in tune. Good for staccato."], ["- 1-3 | --- trD#", "Good for long ff notes. Trills easily with B."]],
    ] as Row[]).map(note),
  },
  {
    id: "extreme", name: "Extreme top", range: "C♯7 – D7",
    about: "Beyond the usual written range: rarely asked for, and needing strong, very fast air. Loud, and hard to tune.",
    notes: ([
      ["C#7", "- -23 G# | 1--", ["- -2- G# | 1--", "Sharper."], ["- -23 G# | 1-3 Eb trD#", "Flat, and speaks easily."]],
      ["D7", "B --3 | 12-", ["B --3 | 12- Eb", "With the E♭ key."], ["Bb --- | --3 Eb", "The B♭ thumb lever, right 3 and the E♭ key."]],
    ] as Row[]).map(note),
  },
];
