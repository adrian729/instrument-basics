// A note on the treble staff, at written pitch: the clef, then each spelling (C♯, then D♭) as a whole note
// with its accidental and the ledger lines it needs. Drawn in the music font's units (glyphs.ts): staff
// lines 244 apart, so one step (a line to the next space) is 122.
import type { Pitch } from "../data/fingerings";
import { spellings, staffStep } from "../lib/notes";
import { GLYPHS, type Glyph } from "./glyphs";
import { el } from "./svg";

const SPACE = 244, STEP = SPACE / 2, LINE = 24;
const BOTTOM = 12; // the bottom line's centre, in the font's units
const GLYPH_CENTRE = 134; // the note's and accidentals' vertical centre as drawn (the first space)
const HEAD = GLYPHS.whole, HEAD_W = HEAD.x1 - HEAD.x0;
const LEDGER_OVER = 90; // how far a ledger line reaches past the note head on each side
const CLEF_END = 60 + (GLYPHS.clef.x1 - GLYPHS.clef.x0) + 120; // where the first spelling starts
const ACC_GAP = 150, NATURAL_GAP = 140, NOTE_GAP = 340; // after an accidental, before a natural, between spellings
const accidentalWidth = (gl: Glyph) => gl.x1 - gl.x0 + ACC_GAP;
// Every staff as wide as one with two spellings, so that the notes' names beside them line up.
const WIDTH = CLEF_END + accidentalWidth(GLYPHS.sharp) + accidentalWidth(GLYPHS.flat) + 2 * HEAD_W + NOTE_GAP + 80;

const UNITS_PER_REM = 400; // the drawing's scale: a staff with no ledger lines is 4.6rem high

const stepY = (step: number) => BOTTOM + step * STEP;

// The staff's height, in steps from the bottom line, that every note of a group fits in (so that a
// register's staves are drawn at one size): the clef's, and the highest note's.
export function stepsFor(pitches: Pitch[]): { low: number; high: number } {
  const steps = pitches.flatMap((p) => spellings(p).map((s) => staffStep(s.letter, s.octave)));
  return { low: Math.min(-1, ...steps), high: Math.max(8, ...steps) };
}

export function staff(p: Pitch, fit: { low: number; high: number }, label: string): SVGSVGElement {
  const parts = spellings(p);
  // y up in the font, down in SVG: the drawing is flipped, so the view box is in -y.
  const top = Math.max(GLYPHS.clef.y1 + 60, stepY(fit.high) + HEAD.y1 - GLYPH_CENTRE + 60);
  const bottom = Math.min(GLYPHS.clef.y0 - 60, stepY(fit.low) + HEAD.y0 - GLYPH_CENTRE - 60);
  const svg = el("svg", { viewBox: `0 ${-top} ${WIDTH} ${top - bottom}`, class: "staff", role: "img", "aria-label": label });
  svg.style.height = `${(top - bottom) / UNITS_PER_REM}rem`; // every staff at one scale, however many ledger lines it has room for
  const g = el("g", { transform: "scale(1 -1)" }, svg);
  for (let i = 0; i < 5; i++) el("rect", { x: 0, y: BOTTOM + i * SPACE - LINE / 2, width: WIDTH, height: LINE, class: "line" }, g);
  const glyph = (gl: Glyph, x: number, y: number, cls: string) => el("path", { d: gl.d, transform: `translate(${x - gl.x0} ${y})`, class: cls }, g);
  glyph(GLYPHS.clef, 60, 0, "clef");

  let x = CLEF_END;
  for (const s of parts) {
    const step = staffStep(s.letter, s.octave), y = stepY(step);
    if (s.accidental) {
      const acc = s.accidental === "♯" ? GLYPHS.sharp : GLYPHS.flat;
      glyph(acc, x, y - GLYPH_CENTRE, "accidental");
      x += accidentalWidth(acc);
    } else x += NATURAL_GAP;
    for (let l = 10; l <= step; l += 2) el("rect", { x: x - LEDGER_OVER, y: stepY(l) - LINE / 2, width: HEAD_W + 2 * LEDGER_OVER, height: LINE, class: "line" }, g);
    for (let l = -2; l >= step; l -= 2) el("rect", { x: x - LEDGER_OVER, y: stepY(l) - LINE / 2, width: HEAD_W + 2 * LEDGER_OVER, height: LINE, class: "line" }, g);
    glyph(HEAD, x, y - GLYPH_CENTRE, "head");
    x += HEAD_W + NOTE_GAP;
  }
  return svg;
}
