// Notes' names (letters or solfège), where they sit on the staff, and how a fingering reads aloud.
import type { Fingering, Letter, Pitch } from "../data/fingerings";

export type Names = "letters" | "solfege";

const LETTERS: Letter[] = ["C", "D", "E", "F", "G", "A", "B"];
const SOLFEGE: Record<Letter, string> = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };

const spell = (letter: Letter, names: Names) => (names === "letters" ? letter : SOLFEGE[letter]);

// The pitch's spellings: one for a natural, the sharp and then the flat for the others (C♯ and D♭).
export function spellings(p: Pitch): { letter: Letter; accidental: "" | "♯" | "♭"; octave: number }[] {
  if (!p.sharp) return [{ letter: p.letter, accidental: "", octave: p.octave }];
  const next = LETTERS[(LETTERS.indexOf(p.letter) + 1) % 7];
  return [{ letter: p.letter, accidental: "♯", octave: p.octave }, { letter: next, accidental: "♭", octave: p.letter === "B" ? p.octave + 1 : p.octave }];
}

// Its name, as the card shows it: the spellings, each with its octave in scientific pitch (4 is middle C's)
// for letters; solfège without one, since its octaves are counted differently from country to country.
export function nameParts(p: Pitch, names: Names): { name: string; octave: string }[] {
  return spellings(p).map((s) => ({ name: spell(s.letter, names) + s.accidental, octave: names === "letters" ? String(s.octave) : "" }));
}
export const nameText = (p: Pitch, names: Names) => nameParts(p, names).map((n) => n.name + n.octave).join(" / ");

// What's heard: an octave above what's written.
export const soundingText = (p: Pitch, names: Names) =>
  names === "letters" ? `Sounds ${nameParts({ ...p, octave: p.octave + 1 }, names)[0].name}${p.octave + 1}` : "Sounds an octave higher";

// Diatonic steps above the treble staff's bottom line (E4 is 0, F4 1, D4 -1).
export const staffStep = (letter: Letter, octave: number) => octave * 7 + LETTERS.indexOf(letter) - (4 * 7 + 2);

// A fingering in words, hand by hand, for the line under its diagram.
export function fingeringText(f: Fingering): { left: string; right: string } {
  const fingers = (down: boolean[]) => down.flatMap((d, i) => (d ? [String(i + 1)] : [])).join(" ");
  const left = [f.thumb === "Bb" ? "thumb B♭" : f.thumb === "B" ? "thumb B" : "", fingers(f.left), f.gSharp ? "G♯" : ""].filter(Boolean);
  const right = [
    fingers(f.right), f.extras.includes("side") ? "side B♭" : "", f.extras.includes("trD") ? "D trill" : "", f.extras.includes("trD#") ? "D♯ trill" : "", f.eFlat ? "E♭" : "",
  ].filter(Boolean);
  return { left: left.join(" · ") || "nothing", right: right.join(" · ") || "nothing" };
}

// The same, for a screen reader: every key pressed.
export function fingeringLabel(f: Fingering): string {
  const keys = [
    f.thumb === "Bb" ? "B-flat thumb lever" : f.thumb === "B" ? "B thumb key" : "",
    ...f.left.flatMap((d, i) => (d ? [`left ${i + 1}`] : [])), f.gSharp ? "G-sharp key" : "",
    ...f.right.flatMap((d, i) => (d ? [`right ${i + 1}`] : [])),
    f.extras.includes("side") ? "side B-flat lever" : "", f.extras.includes("trD") ? "D trill key" : "", f.extras.includes("trD#") ? "D-sharp trill key" : "",
    f.eFlat ? "E-flat key" : "",
  ].filter(Boolean);
  return keys.length ? `Press: ${keys.join(", ")}` : "Every key open";
}
