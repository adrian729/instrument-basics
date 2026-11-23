// Every note of the Boehm concert flute, from the foot joint's low B (with a B foot; low C with the usual C
// foot) to F7, in the fourth octave. A flute sounds as written. Each note's first fingering is the
// standard one; the rest are alternatives, for tuning, soft or loud playing, response, or slurs. From The
// Woodwind Fingering Guide's flute pages (wfg.woodwind.org/flute/fl_alt_1.html, _2, _3, _4), its comments
// adapted: a choice of its alternatives, one or a few for each purpose, never those that need a half-covered
// hole, the C♯ trill key some flutes have, or another flute (bass, alto). (The notation: notations/flute/notation.ts.)
import { parseFlute, type FluteFingering } from "../../notations/flute/notation";
import { rows, type Register } from "../types";

export const FLUTE: Register<FluteFingering>[] = [
  {
    id: "low", name: "First octave", nav: "1st octave",
    about: "The low register, with a slow, relaxed air stream. The right pinky's foot-joint keys give the lowest notes: low C♯ and C on every flute, low B with a B foot.",
    notes: rows(parseFlute, [
      ["B3", ["B 123 | 123 lowB", "Only with a B foot. The right pinky on the low B key."]],
      ["C4", ["B 123 | 123 lowC", "The lowest note on a C foot. The right pinky on the low C roller."]],
      ["C#4", ["B 123 | 123 lowC#", "The right pinky on the low C♯ roller."]],
      ["D4", ["B 123 | 123", "Right pinky off: the E♭ key stays shut."]],
      ["D#4", "B 123 | 123 Eb"],
      ["E4", "B 123 | 12- Eb"],
      ["F4", "B 123 | 1-- Eb"],
      ["F#4", "B 123 | --3 Eb", ["B 123 | -2- Eb", "For slurs with E."]],
      ["G4", "B 123 | --- Eb"],
      ["G#4", "B 123 G# | --- Eb"],
      ["A4", "B 12- | --- Eb", ["B 12- G# | 1-- Eb", "Brighter, with more overtones."]],
      ["A#4", ["Bb 1-- | --- Eb", "The B♭ thumb lever. Not in passages that also have B."], ["B 1-- | 1-- Eb", "One-and-one: right 1 down. Fine next to B."], ["B 1-- | --- Eb side", "The side B♭ lever, with the side of right 1. For trills with B."]],
      ["B4", "B 1-- | --- Eb"],
      ["C5", "- 1-- | --- Eb"],
      ["C#5", ["- --- | --- Eb", "Only the right pinky's E♭ key: can be sharp and thin."], ["- --- | -23 Eb", "Better in tune."], ["- --3 G# | -23 Eb", "A clearer tone."], ["- -23 | 123 lowC#", "A fuller, more colourful tone."]],
    ]),
  },
  {
    id: "middle", name: "Second octave", nav: "2nd",
    about: "From E up, the first octave's fingers again, with faster, more focused air. D and D♯ lift the left index finger.",
    notes: rows(parseFlute, [
      ["D5", ["B -23 | 123", "Left 1 up, right pinky off E♭."], ["B 123 | 123", "Low D's fingering, overblown (a harmonic): darker, for slurs from low D."]],
      ["D#5", ["B -23 | 123 Eb", "Left 1 up."]],
      ["E5", "B 123 | 12- Eb", ["B 123 | 12- Eb trD#", "The D♯ trill key added keeps it from cracking."]],
      ["F5", "B 123 | 1-- Eb"],
      ["F#5", "B 123 | --3 Eb", ["B 123 | -2- Eb", "For slurs from E."]],
      ["G5", "B 123 | --- Eb"],
      ["G#5", "B 123 G# | --- Eb", ["B 123 G# | 123 lowC#", "Great for pp: low C♯'s fingering with the G♯ key, overblown (a harmonic)."]],
      ["A5", "B 12- | --- Eb", ["B 12- G# | 1-- Eb", "Good for ff, and less likely to crack up to E."]],
      ["A#5", ["Bb 1-- | --- Eb", "The B♭ thumb lever."], ["B 1-- | 1-- Eb", "One-and-one. Fine next to B."], ["B 1-- | --- Eb side", "The side B♭ lever. For trills with B."]],
      ["B5", "B 1-- | --- Eb", ["B 1-3 | 12- Eb", "Good for pp: a harmonic, low E's fingering with left 2 up."]],
      ["C6", "- 1-- | --- Eb", ["B 123 | 1-- Eb", "Low F's fingering, overblown (a harmonic): a veiled sound."], ["B -23 | 12- Eb", "Sharp. For slurs from D."]],
      ["C#6", ["- --- | --- Eb", "Can be sharp."], ["- --- | 123", "Flatter."], ["B -23 | -23 Eb", "For slurs from D."]],
    ]),
  },
  {
    id: "high", name: "Third octave", nav: "3rd",
    about: "Fingerings of their own, most of them harmonics of lower notes with a hole or two opened. Fast, narrow air, the throat open.",
    notes: rows(parseFlute, [
      ["D6", "B -23 | --- Eb", ["B -23 G# | 1-- Eb", "Very sharp: good for pp."]],
      ["D#6", "B 123 G# | 123 Eb", ["B 123 G# | 123 Eb lowC#", "Slightly flat. Excellent for ff."], ["B -23 | --- Eb trD#", "For slurs from D."]],
      ["E6", "B 12- | 12- Eb", ["B 12- | 12-", "Right pinky off. Flat, and good for hard attacks."], ["B 12- | 12- Eb trD#", "Sharp, and less likely to crack down to A."]],
      ["F6", "B 1-3 | 1-- Eb", ["B 1-3 | 1-3 Eb", "Flat."], ["B 1-3 | 1-3 Eb trD#", "Good for pp."]],
      ["F#6", "B 1-3 | --3 Eb", ["B 1-3 | -2- Eb", "For slurs with E."], ["B 1-3 | -23", "Flat. The piccolo's standard fingering."]],
      ["G6", "- 123 | --- Eb"],
      ["G#6", "- -23 G# | --- Eb", ["- -23 G# | -23 Eb", "Flatter: good for ff. The piccolo's standard fingering."]],
      ["A6", "B -2- | 1-- Eb", ["B -2- | 1-3 lowC#", "For slurs to F or F♯."]],
      ["A#6", ["B --- | 1-- trD", "Left hand off but the thumb; right 1 and the D trill key."], ["B --- | 1-- trD#", "The D♯ trill key instead. Sharp."], ["B 1-- | 1-- trD", "For slurs with F or A."]],
      ["B6", ["B 1-3 | --- trD#", "The D♯ trill key, right pinky off."], ["Bb 1-3 | --- trD# lowB", "Clearer, less shrill and more in tune. Needs a B foot."], ["B 1-3 | --3 trD#", "Flat."]],
      ["C7", ["- 123 G# | 1--", "The top of the usual range. Right pinky off."], ["- 123 G# | 1-- giz", "On a B foot: the gizmo key, for a clearer, surer C."], ["- 123 G# | 1-3", "Better balanced in the hands, on a C foot."], ["B 123 G# | 1--", "More in tune, but stuffy."]],
    ]),
  },
  {
    id: "extreme", name: "Extreme top", nav: "Top",
    about: "The fourth octave: in contemporary music and a few solos, hardly ever in orchestral parts. Very fast air, and loud. Every flute answers these differently: try each fingering.",
    notes: rows(parseFlute, [
      ["C#7", "- -2- G# | 1--", ["- -23 G# | 1--", "Flat."], ["- -2- | 1-- giz", "On a B foot, with the gizmo key: try it if the first is hard to make speak."]],
      ["D7", ["B --3 | 12- lowC", "The right pinky on the low C roller."], ["B --3 | 12- Eb", "The E♭ key instead of low C: the top notes differ from flute to flute, so try both."], ["Bb --- | --3 lowB", "Speaks well. Needs a B foot."], ["Bb --- | --3", "Easy to finger, but harder to make speak than with a foot key down."]],
      ["D#7", ["B --3 G# | -2- trD", "Right 2 and the D trill key."], ["B --3 | -2-", "Flat, with fewer keys."]],
      ["E7", ["- 12- | -2- trD#", "Sharp. On an open-hole flute, cover most of left 3's hole to bring it down."], ["- 12- | --3 Eb lowC# trD#", "Sharp, but speaks very easily."]],
      ["F7", ["- -2- | -2- trD#", "Left 2, right 2 and the D♯ trill key."], ["B 1-3 | 1-3 Eb lowB", "Sharp. Needs a B foot."]],
    ]),
  },
];
