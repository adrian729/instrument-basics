// A note on the treble staff, at written pitch: the clef, then each spelling (C♯, then D♭) as a whole note
// with its accidental and the ledger lines it needs. Drawn in the music font's units (glyphs.ts, from
// Bravura): a staff space is 250, so one step (a line to the next space) is 125; the bottom line is at 0.
// The lines' thickness and the ledger lines' reach are the font's engraving defaults; the gaps are in
// staff spaces.
import type { Pitch } from "../data/fingerings";
import { spellings, staffStep } from "../lib/notes";
import { ENGRAVING, GLYPHS, type Glyph } from "./glyphs";
import { el } from "./svg";

const SPACE = ENGRAVING.space, STEP = SPACE / 2;
const HEAD = GLYPHS.whole, HEAD_W = HEAD.x1 - HEAD.x0;
const CLEF_X = 0.25 * SPACE, CLEF_LINE = 1; // the clef's left edge, and its line (G4, the second from the bottom)
const CLEF_END = CLEF_X + (GLYPHS.clef.x1 - GLYPHS.clef.x0) + 0.5 * SPACE; // where the first spelling starts
const ACC_GAP = 0.6 * SPACE, NATURAL_GAP = 0.6 * SPACE, NOTE_GAP = 1.4 * SPACE; // after an accidental, before a natural, between spellings
const PAD = 0.25 * SPACE; // above and below the drawing
const accidentalWidth = (gl: Glyph) => gl.x1 - gl.x0 + ACC_GAP;
// Every staff as wide as one with two spellings, so that the notes' names beside them line up.
const WIDTH = CLEF_END + accidentalWidth(GLYPHS.sharp) + accidentalWidth(GLYPHS.flat) + 2 * HEAD_W + NOTE_GAP + 0.33 * SPACE;

const SPACE_REM = 0.61; // the drawing's scale: a staff with no ledger lines is 4.6rem high

const stepY = (step: number) => step * STEP;

// The staff's height, in steps from the bottom line, that every note of a group fits in (so that a
// register's staves are drawn at one size): the clef's, and the highest note's.
export function stepsFor(pitches: Pitch[]): { low: number; high: number } {
  const steps = pitches.flatMap((p) => spellings(p).map((s) => staffStep(s.letter, s.octave)));
  return { low: Math.min(-1, ...steps), high: Math.max(8, ...steps) };
}

export function staff(p: Pitch, fit: { low: number; high: number }, label: string): SVGSVGElement {
  const parts = spellings(p);
  const clefY = CLEF_LINE * SPACE;
  // y up in the font, down in SVG: the drawing is flipped, so the view box is in -y.
  const top = Math.max(clefY + GLYPHS.clef.y1, stepY(fit.high) + HEAD.y1) + PAD;
  const bottom = Math.min(clefY + GLYPHS.clef.y0, stepY(fit.low) + HEAD.y0) - PAD;
  const svg = el("svg", { viewBox: `0 ${-top} ${WIDTH} ${top - bottom}`, class: "staff", role: "img", "aria-label": label });
  svg.style.height = `${((top - bottom) / SPACE) * SPACE_REM}rem`; // every staff at one scale, however many ledger lines it has room for
  const g = el("g", { transform: "scale(1 -1)" }, svg);
  const line = (x: number, width: number, step: number, thickness: number) => el("rect", { x, y: stepY(step) - thickness / 2, width, height: thickness, class: "line" }, g);
  for (let i = 0; i < 5; i++) line(0, WIDTH, 2 * i, ENGRAVING.staffLine);
  const glyph = (gl: Glyph, x: number, y: number, cls: string) => el("path", { d: gl.d, transform: `translate(${x - gl.x0} ${y})`, class: cls }, g);
  glyph(GLYPHS.clef, CLEF_X, clefY, "clef");

  let x = CLEF_END;
  for (const s of parts) {
    const step = staffStep(s.letter, s.octave), y = stepY(step);
    if (s.accidental) {
      const acc = s.accidental === "♯" ? GLYPHS.sharp : GLYPHS.flat;
      glyph(acc, x, y, "accidental");
      x += accidentalWidth(acc);
    } else x += NATURAL_GAP;
    const ledger = (l: number) => line(x - ENGRAVING.legerExtension, HEAD_W + 2 * ENGRAVING.legerExtension, l, ENGRAVING.legerLine);
    for (let l = 10; l <= step; l += 2) ledger(l);
    for (let l = -2; l >= step; l -= 2) ledger(l);
    glyph(HEAD, x, y, "head");
    x += HEAD_W + NOTE_GAP;
  }
  return svg;
}
