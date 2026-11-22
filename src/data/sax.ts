// Every note of the saxophone below the altissimo, written A3 (the baritone's low A) or B♭3 to F♯6: the
// same for soprano, alto, tenor and baritone, which are fingered alike. Each note's first fingering is the
// standard one; the rest are alternatives, for an easier passage, tuning or tone. From The Woodwind Fingering
// Guide's saxophone pages (wfg.woodwind.org/sax/sax_bas_1.html, _2; sax_alt_1.html, _2, _4), its comments
// adapted: a choice of its alternatives, one or a few for each purpose. Left out: the altissimo above F♯6,
// whose fingerings differ from one saxophone to another. (The notation: notations/sax.)
import { parseSax, type SaxFingering } from "../notations/sax/notation";
import { rows, type Register } from "./types";

export const SAX: Register<SaxFingering>[] = [
  {
    id: "low", name: "Low register", nav: "Low",
    about: "No octave key: relaxed air and a loose embouchure. The pinkies' keys give the lowest notes, which are the hardest to play softly.",
    notes: rows(parseSax, [
      ["A3", ["lowA 123 | 123 lowC", "The lowest note, on the baritone only: its low A key, with the left thumb.", ["baritone-sax"]]],
      ["A#3", "123 lowBb | 123 lowC"],
      ["B3", "123 lowB | 123 lowC"],
      ["C4", "123 | 123 lowC"],
      ["C#4", "123 lowC# | 123 lowC"],
      ["D4", "123 | 123"],
      ["D#4", "123 | 123 Eb"],
      ["E4", "123 | 12-"],
      ["F4", "123 | 1--"],
      ["F#4", "123 | -2-", ["123 | 1-- altF#", "The alternate F♯ key, between right 2 and 3: next to F."]],
      ["G4", "123 | ---"],
      ["G#4", "123 G# | ---", ["123 lowC# | ---", "The low C♯ key opens G♯ too: next to low C♯."], ["123 lowB | ---", "The same, next to low B."], ["123 lowBb | ---", "The same, next to low B♭."]],
      ["A4", "12- | ---"],
      ["A#4", ["12- | sBb ---", "The side B♭ key, with the side of right 1: good anywhere, especially in chromatic passages."], ["1-- bis | ---", "The bis key, pressed by left 1 together with the B key: in flat keys, where there's no B."], ["1-- | 1--", "One-and-one: next to F."], ["1-- | -2-", "Next to F♯."]],
      ["B4", "1-- | ---"],
      ["C5", "-2- | ---", ["1-- | sC ---", "The side C key: next to B."], ["-23 G# | ---", "In fast passages with A♭."]],
      ["C#5", "--- | ---", ["T --3 | 123", "In tune as the leading note to D."], ["--- | 123 Eb", "Next to E♭. Flat when loud on a soprano."]],
    ]),
  },
  {
    id: "middle", name: "Middle register", nav: "Middle",
    about: "The low register's fingers again from D, with the left thumb on the octave key, and faster air.",
    notes: rows(parseSax, [
      ["D5", "T 123 | 123", ["pD 123 | 123", "The palm D key instead of the octave key: a better tone."], ["T 123 lowB | 123", "Better in tune."]],
      ["D#5", "T 123 | 123 Eb", ["T pD pEb 123 | 123 Eb", "With the palm D and E♭ keys: a bigger, richer tone, a little awkward when fast."]],
      ["E5", "T 123 | 12-"],
      ["F5", "T 123 | 1--"],
      ["F#5", "T 123 | -2-", ["T 123 | 1-- altF#", "The alternate F♯ key: next to F."]],
      ["G5", "T 123 | ---"],
      ["G#5", "T 123 G# | ---", ["T 123 lowC# | ---", "The low C♯ key opens G♯ too: next to fingerings with it."]],
      ["A5", "T 12- | ---"],
      ["A#5", ["T 12- | sBb ---", "The side B♭ key: good anywhere."], ["T 1-- bis | ---", "The bis key: in flat keys, where there's no B."], ["T 1-- | 1--", "One-and-one: next to F."], ["T 1-- | -2-", "Next to F♯."]],
      ["B5", "T 1-- | ---"],
      ["C6", "T -2- | ---", ["T 1-- | sC ---", "The side C key: next to B."]],
      ["C#6", ["T --- | ---", "The octave key alone."], ["T --- | 123", "A better tone, and steadier."]],
    ]),
  },
  {
    id: "high", name: "High register", nav: "High",
    about: "The palm keys (left hand) and the side keys (right hand) add D to F, then F♯ with the high F♯ key. Above it is the altissimo, left out here: its fingerings differ from one saxophone to another.",
    notes: rows(parseSax, [
      ["D6", ["T pD --- | ---", "The palm D key, with the side of left 1."], ["T pEb -2- | ---", "Next to C."]],
      ["D#6", "T pD pEb --- | ---", ["T pEb --- | ---", "Lower in pitch."]],
      ["E6", ["T pD pEb --- | sE ---", "Two palm keys, and the side E key with the side of right 1."], ["T pEb --- | sE ---", "Lower in pitch."], ["T fF -23 | ---", "The front F key: in fast passages with C and C♯."]],
      ["F6", "T pD pEb pF --- | sE ---", ["T fF -2- | ---", "The front F key: next to C."]],
      ["F#6", ["T pD pEb pF --- | sE hiF# ---", "The high F♯ key, on most saxophones made today."], ["T 12- | hiF# ---", "In tune, easy to start, good in fast passages."], ["T fF -2- G# | sBb ---", "For a saxophone without a high F♯ key. Steady from mp up on tenor and baritone, from mf on alto."]],
    ]),
  },
];
