// The chart's data: the instruments (instruments.ts), each a list of registers, each a list of notes at
// written pitch, each with its fingerings, the standard one first (flute.ts, piccolo.ts). Here: the types,
// and the short notation the fingerings are written in.
//
// A fingering is written as the player reads it, left hand then right:
//   thumb  B (the B key), Bb (the B♭ lever) or - (off)
//   then   the left hand's fingers 1 2 3 (index, middle, ring), - for one up; then G# (the left pinky's key)
//   |      then the right hand's 1 2 3 the same way; then any of the keys below, once each, in any order:
//          Eb (the right pinky's E♭ key); on a flute's foot joint, lowC# and lowC (the pinky's rollers), lowB
//          (a B foot's low B key) and giz (a B foot's gizmo, for top C); trD (the D trill key, between right
//          1 and 2), trD# (the D♯ trill key, between right 2 and 3) and side (the side B♭ lever, by right 1)
// e.g. "B 123 G# | --- Eb": the B thumb key, all three left fingers, the G♯ key, and the E♭ key.

export type Thumb = "B" | "Bb" | null;
export type Extra = "trD" | "trD#" | "side";
export type Foot = "lowC#" | "lowC" | "lowB" | "giz";
export type Fingering = {
  thumb: Thumb;
  left: [boolean, boolean, boolean];
  gSharp: boolean;
  right: [boolean, boolean, boolean];
  eFlat: boolean;
  foot: Foot[];
  extras: Extra[];
  note: string;
  source: string; // as written in the data
};
export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Pitch = { letter: Letter; sharp: boolean; octave: number };
export type Note = { id: string; pitch: Pitch; fingerings: Fingering[] };
export type Register = { id: string; name: string; range: string; about: string; notes: Note[] };

const FINGERS = /^[1-][2-][3-]$/;
const EXTRAS: string[] = ["trD", "trD#", "side"];
const FOOT: string[] = ["lowC#", "lowC", "lowB", "giz"];

// One fingering from its notation (see above); throws on anything else, so that a typo fails the tests.
export function parseFingering(source: string, note = ""): Fingering {
  const [leftSide, rightSide, ...rest] = source.split("|").map((s) => s.trim().split(/\s+/));
  if (!leftSide || !rightSide || rest.length) throw new Error(`"${source}": needs one |`);
  const [thumb, left, ...leftKeys] = leftSide;
  const [right, ...rightKeys] = rightSide;
  if (!["B", "Bb", "-"].includes(thumb)) throw new Error(`"${source}": thumb is B, Bb or -`);
  if (!FINGERS.test(left ?? "") || !FINGERS.test(right ?? "")) throw new Error(`"${source}": fingers are like 1-3`);
  if (leftKeys.some((k) => k !== "G#") || leftKeys.length > 1) throw new Error(`"${source}": the left hand's only key is G#`);
  if (rightKeys.some((k) => k !== "Eb" && !EXTRAS.includes(k) && !FOOT.includes(k)) || new Set(rightKeys).size !== rightKeys.length)
    throw new Error(`"${source}": the right hand's keys are Eb, lowC#, lowC, lowB, giz, trD, trD# and side, once each`);
  const down = (s: string) => [s[0] !== "-", s[1] !== "-", s[2] !== "-"] as [boolean, boolean, boolean];
  return {
    thumb: thumb === "-" ? null : (thumb as Thumb), left: down(left), gSharp: leftKeys.includes("G#"), right: down(right),
    eFlat: rightKeys.includes("Eb"), foot: rightKeys.filter((k) => FOOT.includes(k)) as Foot[],
    extras: rightKeys.filter((k) => EXTRAS.includes(k)) as Extra[], note, source,
  };
}

export function parsePitch(id: string): Pitch {
  const m = /^([A-G])(#?)(\d)$/.exec(id);
  if (!m) throw new Error(`"${id}": a note is like D4 or F#5`);
  return { letter: m[1] as Letter, sharp: m[2] === "#", octave: Number(m[3]) };
}

// A register's notes from rows of [note, fingering, ...]: each fingering its notation, or [notation, comment].
export type Row = [id: string, ...fingerings: (string | [string, string])[]];
export const rows = (list: Row[]): Note[] => list.map(([id, ...fs]) => ({
  id, pitch: parsePitch(id), fingerings: fs.map((f) => (typeof f === "string" ? parseFingering(f) : parseFingering(f[0], f[1]))),
}));
