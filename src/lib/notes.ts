// Notes' names (letters or solfège), what's heard of a written note, and where a note sits on the staff.
import type { Transposition } from "../data/instrument";
import type { Letter, Pitch } from "../data/types";

export type Names = "letters" | "solfege";
type Spelling = { letter: Letter; accidental: "" | "♯" | "♭"; octave: number };

const LETTERS: Letter[] = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const SOLFEGE: Record<Letter, string> = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };

const spell = (letter: Letter, names: Names) => (names === "letters" ? letter : SOLFEGE[letter]);
const semitone = (s: Spelling) => s.octave * 12 + NATURAL[s.letter] + (s.accidental === "♯" ? 1 : s.accidental === "♭" ? -1 : 0);
const fromSemitone = (n: number): Pitch => {
  const octave = Math.floor(n / 12), within = n - octave * 12;
  const natural = LETTERS.find((l) => NATURAL[l] === within);
  return natural ? { letter: natural, sharp: false, octave } : { letter: LETTERS.find((l) => NATURAL[l] === within - 1)!, sharp: true, octave };
};

// The pitch's spellings: one for a natural, the sharp and then the flat for the others (C♯ and D♭).
export function spellings(p: Pitch): Spelling[] {
  if (!p.sharp) return [{ letter: p.letter, accidental: "", octave: p.octave }];
  const next = LETTERS[(LETTERS.indexOf(p.letter) + 1) % 7];
  return [{ letter: p.letter, accidental: "♯", octave: p.octave }, { letter: next, accidental: "♭", octave: p.letter === "B" ? p.octave + 1 : p.octave }];
}

const parts = (ss: Spelling[], names: Names) => ss.map((s) => ({ name: spell(s.letter, names) + s.accidental, octave: names === "letters" ? String(s.octave) : "" }));
// Its name, as the card shows it: the spellings, each with its octave in scientific pitch (4 is middle C's)
// for letters; solfège without one, since its octaves are counted differently from country to country.
export const nameParts = (p: Pitch, names: Names) => parts(spellings(p), names);
export const nameText = (p: Pitch, names: Names) => nameParts(p, names).map((n) => n.name + n.octave).join(" / ");
// A range of notes, as a register's head shows it: "B3 – C♯5".
export const rangeText = (low: Pitch, high: Pitch) => [low, high].map((p) => { const [n] = nameParts(p, "letters"); return n.name + n.octave; }).join(" – ");

// What's heard of each written spelling: moved by the transposition's letters and semitones (a written C♯ on
// a B♭ trumpet sounds B, a written D♭ C♭); those that would need a double accidental or are E♯, B♯, C♭ or F♭
// dropped, as no one would call them that; if none is left, the plain spelling of the pitch heard.
export function sounding(p: Pitch, t: Transposition): Spelling[] {
  const heard: Spelling[] = [];
  for (const s of spellings(p)) {
    const i = LETTERS.indexOf(s.letter) + t.steps;
    const letter = LETTERS[((i % 7) + 7) % 7], octave = s.octave + Math.floor(i / 7);
    const shift = semitone(s) + t.semitones - semitone({ letter, accidental: "", octave });
    const accidental = shift === 0 ? "" : shift === 1 ? "♯" : shift === -1 ? "♭" : null;
    if (accidental === null || (accidental === "♯" && (letter === "E" || letter === "B")) || (accidental === "♭" && (letter === "C" || letter === "F"))) continue;
    if (!heard.some((h) => semitone(h) === semitone({ letter, accidental, octave }) && h.letter === letter)) heard.push({ letter, accidental, octave });
  }
  return heard.length ? heard : spellings(fromSemitone(semitone(spellings(p)[0]) + t.semitones)).slice(0, 1);
}

const SIMPLE: Record<string, string> = {
  "0,0": "", "1,1": "a semitone", "1,2": "a tone", "2,3": "a minor third", "2,4": "a major third", "3,5": "a fourth", "3,6": "an augmented fourth",
  "4,6": "a diminished fifth", "4,7": "a fifth", "5,8": "a minor sixth", "5,9": "a major sixth", "6,10": "a minor seventh", "6,11": "a major seventh",
};
// The transposition in words: "a tone lower", "an octave and a major sixth lower"; "" for none.
export function intervalWords(t: Transposition): string {
  if (!t.semitones) return "";
  const steps = Math.abs(t.steps), semis = Math.abs(t.semitones), octaves = Math.floor(steps / 7);
  const simple = SIMPLE[`${steps % 7},${semis - 12 * octaves}`];
  if (simple === undefined) throw new Error(`no words for ${t.steps} letters, ${t.semitones} semitones`);
  const whole = ["", "an octave", "two octaves", "three octaves"][octaves];
  return `${[whole, simple].filter(Boolean).join(" and ")} ${t.semitones > 0 ? "higher" : "lower"}`;
}

// The card's line on what's heard: as written; or the note heard, with its octave for letters; in solfège
// (no octaves) the interval, with the note unless it's octaves away (where it's the same name).
export function soundingText(p: Pitch, names: Names, t: Transposition): string {
  if (!t.semitones) return "Sounds as written";
  if (names === "letters") return `Sounds ${parts(sounding(p, t), names).map((n) => n.name + n.octave).join(" / ")}`;
  if (t.semitones % 12 === 0) return `Sounds ${intervalWords(t)}`;
  return `Sounds ${parts(sounding(p, t), names).map((n) => n.name).join(" / ")}, ${intervalWords(t)}`;
}

// Diatonic steps above the treble staff's bottom line (E4 is 0, F4 1, D4 -1).
export const staffStep = (letter: Letter, octave: number) => octave * 7 + LETTERS.indexOf(letter) - (4 * 7 + 2);
