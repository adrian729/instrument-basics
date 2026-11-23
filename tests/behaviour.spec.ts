// What the page does: the data it's made from, the chart in order, the switches and what they remember (the
// instrument in the address too), the theme, and the registers' links.
import { FLUTE as FLUTE_DATA } from "../src/data/woodwinds/flute";
import { defaultOf, GROUPS, INSTRUMENTS, SECTIONS, instrument } from "../src/data/instruments";
import { PICCOLO as PICCOLO_DATA } from "../src/data/woodwinds/piccolo";
import { parseFlute as parseFingering } from "../src/notations/flute/notation";
import { parseClarinet } from "../src/notations/clarinet/notation";
import { parseSax } from "../src/notations/sax/notation";
import { parseValves } from "../src/notations/valves/notation";
import { parsePitch } from "../src/data/types";
import { intervalWords, soundingText, staffStep } from "../src/lib/notes";
import { test, expect, open, register, registers, cards, card, noteName, standard, alternatives, switchButton, choose, themeSwitch, legendKeys, facts, legendText, pick, groupSelect } from "./app";

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const semitone = (id: string) => { const m = /^([A-G]#?)(\d)$/.exec(id)!; return Number(m[2]) * 12 + CHROMATIC.indexOf(m[1]); };
const notesOf = (id: "flute" | "piccolo") => (id === "flute" ? FLUTE_DATA : PICCOLO_DATA).flatMap((r) => r.notes);
const FLUTE = notesOf("flute"), PICCOLO = notesOf("piccolo");
const first = (notes: typeof FLUTE, id: string) => notes.find((n) => n.id === id)!.fingerings[0];

test.describe("the data", () => {
  const RANGES = [["flute", "B3", "F7"], ["piccolo", "D4", "D7"],
    ["eb-clarinet", "E3", "G6"], ["bb-clarinet", "E3", "G6"], ["a-clarinet", "E3", "G6"], ["bass-clarinet", "C3", "G6"],
    ["soprano-sax", "A#3", "F#6"], ["alto-sax", "A#3", "F#6"], ["tenor-sax", "A#3", "F#6"], ["baritone-sax", "A3", "F#6"],
    ["bb-trumpet", "F#3", "C6"], ["c-trumpet", "F#3", "C6"], ["piccolo-trumpet", "C#3", "G5"], ["cornet", "F#3", "C6"], ["flugelhorn", "F#3", "C6"],
    ["mellophone", "F#3", "C6"], ["tenor-horn", "F#3", "C6"], ["euphonium", "C#3", "E6"], ["baritone-horn", "F#3", "C6"]] as const;
  test("every instrument's range is tested", () => expect(RANGES.map((r) => r[0])).toEqual(INSTRUMENTS.map((i) => i.id)));
  for (const [id, lowest, highest] of RANGES) {
    test(`the ${id}: every semitone from ${lowest} to ${highest}, once, in order`, () => {
      const notes = instrument(id).registers.flatMap((r) => r.notes);
      expect(notes[0].id).toBe(lowest);
      expect(notes.at(-1)!.id).toBe(highest);
      const steps = notes.map((n) => semitone(n.id));
      steps.forEach((s, i) => { if (i) expect(s - steps[i - 1], notes[i].id).toBe(1); });
    });
  }

  test("every note has a standard fingering, and no fingering twice", () => {
    for (const n of INSTRUMENTS.flatMap((i) => i.registers.flatMap((r) => r.notes))) {
      expect(n.fingerings.length, n.id).toBeGreaterThan(0);
      const sources = n.fingerings.map((f) => f.source.replace(/\s+/g, " "));
      expect(new Set(sources).size, n.id).toBe(sources.length);
    }
  });

  test("the notation is read as written, and a typo is refused", () => {
    expect(parseFingering("B 123 G# | 1-3 Eb trD#")).toMatchObject({
      thumb: "B", left: [true, true, true], gSharp: true, right: [true, false, true], eFlat: true, foot: [], extras: ["trD#"],
    });
    expect(parseFingering("- --- | ---")).toMatchObject({ thumb: null, left: [false, false, false], gSharp: false, right: [false, false, false], eFlat: false, foot: [], extras: [] });
    expect(parseFingering("Bb 1-3 | --- trD# lowB")).toMatchObject({ thumb: "Bb", foot: ["lowB"], extras: ["trD#"] });
    for (const bad of ["B 123 123 Eb", "X 123 | 123", "B 12 | 123", "B 123 Eb | 123", "B 123 | 123 trE", "B 123 | 123 Eb Eb", "B 123 | 123 lowD", "B 123 lowC | 123", "B 123 | 123 giz giz"])
      expect(() => parseFingering(bad), bad).toThrow();
  });

  test("the valves: written as pressed, and a typo refused", () => {
    expect(parseValves("13").valves).toEqual([true, false, true, false]);
    expect(parseValves("0").valves).toEqual([false, false, false, false]);
    expect(parseValves("1234").valves).toEqual([true, true, true, true]);
    for (const bad of ["", "31", "5", "00", "1 3", "112", "0 1"]) expect(() => parseValves(bad), bad).toThrow();
  });

  test("every valve fingering is a harmonic of the open horn, lowered by its valves", () => {
    const PARTIALS = [12, 19, 24, 28, 31, 36, 38, 40, 43]; // above the lowest: the 2nd to the 10th harmonics, but the 7th (flat), and the 12th
    const valved = INSTRUMENTS.filter((i) => i.options.valves);
    expect(valved.map((i) => i.id)).toEqual(["bb-trumpet", "c-trumpet", "piccolo-trumpet", "cornet", "flugelhorn", "mellophone", "tenor-horn", "euphonium", "baritone-horn"]);
    for (const i of valved) {
      const open = semitone(i.options.openHorn!);
      for (const n of i.registers.flatMap((r) => r.notes)) for (const f of n.fingerings) {
        const lowered = parseValves(f.source).valves.reduce((sum, down, v) => sum + (down ? i.options.valves![v] : 0), 0);
        expect(PARTIALS, `${i.id} ${n.id}: ${f.source}`).toContain(semitone(n.id) + lowered - open);
      }
    }
  });

  test("the trumpets' fingerings everyone knows", () => {
    const valves = (id: string, note: string) => instrument(id as "bb-trumpet").registers.flatMap((r) => r.notes).find((n) => n.id === note)!.fingerings[0].source;
    for (const id of ["bb-trumpet", "c-trumpet"]) expect(["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"].map((n) => valves(id, n))).toEqual(["0", "13", "12", "1", "0", "12", "2", "0"]);
    expect(valves("piccolo-trumpet", "D4")).toBe("4");
    expect(valves("piccolo-trumpet", "C#3")).toBe("1234");
    for (const id of ["cornet", "flugelhorn", "mellophone", "tenor-horn", "baritone-horn"]) expect(["C4", "D4", "G4", "C5"].map((n) => valves(id, n))).toEqual(["0", "13", "0", "0"]);
    expect(["C#3", "F3", "G3", "D4", "G4"].map((n) => valves("euphonium", n))).toEqual(["1234", "14", "4", "4", "0"]); // (the 4th valve standard for 1–3's notes)
  });

  test("the clarinet's notation: read as written, and a typo refused", () => {
    expect(parseClarinet("T R 123 E | 123 F")).toMatchObject({ left: [true, true, true], right: [true, true, true], keys: ["T", "R", "lE", "rF"] });
    expect(parseClarinet("R A --- | s2 ---")).toMatchObject({ left: [false, false, false], keys: ["R", "A", "s2"] });
    expect(parseClarinet("T R 023 | 1-- B G#")).toMatchObject({ left: ["half", true, true], right: [true, false, false], keys: ["T", "R", "B", "rG#"] });
    for (const bad of ["123 123", "123 | 123 | 123", "123 C# | 123 C#", "123 | 123 Eb", "T T 123 | 123", "123 | 12", "023 | 023", "123 lowC | 123", "123 | s5 123"]) expect(() => parseClarinet(bad), bad).toThrow();
  });

  test("the clarinets' fingerings everyone knows, and the bass clarinet's lowest notes and half-hole only on it", () => {
    const keys = (id: string, note: string) => instrument(id as "bb-clarinet").registers.flatMap((r) => r.notes).find((n) => n.id === note)?.fingerings[0].source;
    for (const id of ["eb-clarinet", "bb-clarinet", "a-clarinet", "bass-clarinet"]) {
      expect(keys(id, "G3")).toBe("T 123 | 123");
      expect(keys(id, "C4")).toBe("T 123 | ---");
      expect(keys(id, "G4")).toBe("--- | ---"); // open G
      expect(keys(id, "A#4")).toBe("R A --- | ---");
      expect(keys(id, "D5")).toBe("T R 123 | 123"); // low G's, a twelfth up
      expect(keys(id, "C6")).toBe("T R --- | ---");
      expect(keys(id, "C3")).toBe(id === "bass-clarinet" ? "T 123 | lowC 123" : undefined);
      expect(keys(id, "E6")).toBe(id === "bass-clarinet" ? "T R 023 | --- G#" : "T R -23 | --- G#");
    }
  });

  test("the saxophone's notation: read as written, and a typo refused", () => {
    expect(parseSax("T pD pEb pF --- | sE hiF# ---")).toMatchObject({ left: [false, false, false], right: [false, false, false], keys: ["T", "pD", "pEb", "pF", "sE", "hiF#"] });
    expect(parseSax("1-- bis | ---")).toMatchObject({ left: [true, false, false], keys: ["bis"] });
    expect(parseSax("123 lowBb | 123 lowC")).toMatchObject({ left: [true, true, true], right: [true, true, true], keys: ["lowBb", "lowC"] });
    for (const bad of ["123 123", "123 | 123 | 123", "123 sE | 123", "123 | 123 G#", "T T 123 | 123", "123 | 12", "12- 1-- | ---", "123 | 123 Bb"]) expect(() => parseSax(bad), bad).toThrow();
  });

  test("the saxophones' fingerings everyone knows, and the baritone's low A only on it", () => {
    const keys = (id: string, note: string) => instrument(id as "alto-sax").registers.flatMap((r) => r.notes).find((n) => n.id === note)?.fingerings[0].source;
    for (const id of ["soprano-sax", "alto-sax", "tenor-sax", "baritone-sax"]) {
      expect(keys(id, "D4")).toBe("123 | 123");
      expect(keys(id, "G4")).toBe("123 | ---");
      expect(keys(id, "C#5")).toBe("--- | ---");
      expect(keys(id, "D5")).toBe("T 123 | 123");
      expect(keys(id, "A3")).toBe(id === "baritone-sax" ? "lowA 123 | 123 lowC" : undefined);
    }
  });

  test("the piccolo has no foot joint: none of its fingerings uses one", () => {
    for (const n of PICCOLO) for (const f of n.fingerings) expect(f.foot, `${n.id}: ${f.source}`).toEqual([]);
  });

  test("a few fingerings everyone knows", () => {
    for (const notes of [FLUTE, PICCOLO]) {
      expect(first(notes, "D4")).toMatchObject({ thumb: "B", left: [true, true, true], right: [true, true, true], eFlat: false, foot: [] }); // all down, pinky up
      expect(first(notes, "G4")).toMatchObject({ thumb: "B", left: [true, true, true], right: [false, false, false], eFlat: true });
      expect(first(notes, "C#5")).toMatchObject({ thumb: null, left: [false, false, false], right: [false, false, false], eFlat: true });
      expect(first(notes, "D5")).toMatchObject({ left: [false, true, true], eFlat: false }); // left 1 lifted
    }
    expect(first(FLUTE, "B3")).toMatchObject({ right: [true, true, true], eFlat: false, foot: ["lowB"] });
    expect(first(FLUTE, "C4")).toMatchObject({ right: [true, true, true], eFlat: false, foot: ["lowC"] });
    expect(first(FLUTE, "C#4")).toMatchObject({ right: [true, true, true], eFlat: false, foot: ["lowC#"] });
    expect(first(FLUTE, "F#6")).toMatchObject({ right: [false, false, true], eFlat: true }); // the flute's and the piccolo's differ here
    expect(first(PICCOLO, "F#6")).toMatchObject({ right: [false, true, true], eFlat: false });
  });

  test("what's heard: the transposition in words, and the note heard", () => {
    const t = (steps: number, semitones: number) => ({ steps, semitones });
    expect(intervalWords(t(0, 0))).toBe("");
    expect(intervalWords(t(7, 12))).toBe("an octave higher"); // piccolo
    expect(intervalWords(t(-1, -2))).toBe("a tone lower"); // B♭ trumpet, soprano saxophone
    expect(intervalWords(t(6, 10))).toBe("a minor seventh higher"); // B♭ piccolo trumpet
    expect(intervalWords(t(-5, -9))).toBe("a major sixth lower"); // alto saxophone
    expect(intervalWords(t(-8, -14))).toBe("an octave and a tone lower"); // tenor saxophone
    expect(intervalWords(t(-12, -21))).toBe("an octave and a major sixth lower"); // baritone saxophone
    expect(intervalWords(t(2, 3))).toBe("a minor third higher"); // E♭ clarinet
    expect(intervalWords(t(-2, -3))).toBe("a minor third lower"); // A clarinet
    expect(intervalWords(t(-4, -7))).toBe("a fifth lower"); // mellophone
    const heard = (id: string, steps: number, semitones: number, names: "letters" | "solfege" = "letters") => soundingText(parsePitch(id), names, t(steps, semitones));
    expect(heard("C4", 0, 0)).toBe("Sounds as written");
    expect(heard("D4", 7, 12)).toBe("Sounds D5");
    expect(heard("D4", 7, 12, "solfege")).toBe("Sounds an octave higher");
    expect(heard("C4", -1, -2)).toBe("Sounds B♭3");
    expect(heard("C#4", -1, -2)).toBe("Sounds B3"); // (not C♭4)
    expect(heard("D#4", -1, -2)).toBe("Sounds C♯4 / D♭4");
    expect(heard("C4", -1, -2, "solfege")).toBe("Sounds Si♭, a tone lower");
    expect(heard("C4", -5, -9)).toBe("Sounds E♭3");
    expect(heard("F#4", -5, -9)).toBe("Sounds A3"); // (not B𝄫)
    expect(heard("A3", -12, -21)).toBe("Sounds C2");
    expect(heard("C4", 6, 10)).toBe("Sounds B♭4");
    for (const i of INSTRUMENTS) for (const r of i.registers) for (const n of r.notes)
      for (const names of ["letters", "solfege"] as const) expect(soundingText(n.pitch, names, i.transposition), `${i.id} ${n.id}`).toMatch(/^Sounds \S/);
  });

  test("the staff's steps: D4 under the bottom line, F5 the top line", () => {
    expect(staffStep("B", 3)).toBe(-3);
    expect(staffStep("D", 4)).toBe(-1);
    expect(staffStep("E", 4)).toBe(0);
    expect(staffStep("F", 5)).toBe(8);
    expect(staffStep("C", 7)).toBe(19);
  });
});

test.describe("first visit", () => {
  test("the flute: the registers in order, every note a card, letters and the alternatives folded", async ({ page }) => {
    await open(page);
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "flute");
    await expect(page).toHaveTitle("Instrument Basics | Flute fingering chart");
    await expect(registers(page).locator("h2")).toHaveText(["First octave", "Second octave", "Third octave", "Extreme top"]);
    await expect(cards(page)).toHaveCount(FLUTE.length);
    expect(await cards(page).evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.note))).toEqual(FLUTE.map((n) => n.id));
    for (const r of instrument("flute").registers) await expect(register(page, r.id).locator("article.note")).toHaveCount(r.notes.length);
    // Each switch's first choice is its default.
    for (const [key, value] of [["instrument", "flute"], ["names", "letters"], ["alternatives", "folded"]]) {
      await expect(switchButton(page, key, value)).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(`#switches [data-group="${key}"] button`).first()).toHaveAttribute("aria-pressed", "true");
    }
    await expect(noteName(page, "C4")).toHaveText("C4");
    await expect(noteName(page, "C#5")).toHaveText("C♯5 / D♭5");
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds as written");
    await expect(page.locator("details.alternatives[open]")).toHaveCount(0);
    await expect(page.locator("h1")).toHaveText("Fingerings for the flute");
    await expect(facts(page)).toContainText("The foot joint");
    await expect(legendText(page)).toContainText("gizmo");
    await expect(page.locator(".toc-links a")).toHaveText(["Overview", "1st octave", "2nd", "3rd", "Top"]);
    await expect(page.locator("html")).not.toHaveAttribute("data-pending");
    await expect(page).toHaveURL(/\/$/); // the address left alone until a choice
  });

  test("every card has its staff, its diagram and the fingering in words, for both instruments", async ({ page }) => {
    await open(page);
    for (const id of ["flute", "piccolo"] as const) {
      await choose(page, "instrument", id);
      for (const n of notesOf(id)) {
        const c = card(page, n.id);
        await expect(c.locator("svg.staff")).toHaveAttribute("aria-label", /on the treble staff/);
        await expect(standard(page, n.id).locator("svg.keys")).toHaveAttribute("aria-label", /^(Press: |Every key open)/);
        await expect(standard(page, n.id).locator(".in-words")).toContainText("Left");
        await expect(c.locator(".fingering")).toHaveCount(n.fingerings.length);
      }
    }
  });

  test("a diagram presses what its fingering says", async ({ page }) => {
    await open(page);
    const keys = standard(page, "G#4").locator("svg.keys");
    await expect(keys).toHaveAttribute("aria-label", "Press: B thumb key, left 1, left 2, left 3, G-sharp key, E-flat key");
    const down = await keys.locator(".key.down").evaluateAll((els) => els.map((e) => (e as SVGElement).dataset.key));
    expect(down.sort()).toEqual(["e-flat", "g-sharp", "left1", "left2", "left3", "thumb-b"]);
    await expect(standard(page, "G#4").locator(".in-words")).toHaveText("Left thumb B · 1 2 3 · G♯Right E♭");
    // The foot joint's keys.
    await expect(standard(page, "C4").locator('[data-key="low-c"]')).toHaveClass(/down/);
    await expect(standard(page, "C4").locator('[data-key="e-flat"]')).not.toHaveClass(/down/);
    await expect(standard(page, "C4").locator(".in-words")).toHaveText("Left thumb B · 1 2 3Right 1 2 3 · low C");
    await expect(standard(page, "B3").locator("svg.keys")).toHaveAttribute("aria-label", /low B key$/);
    // A trill key, pressed; the side lever and the gizmo drawn only where they're used.
    await expect(standard(page, "A#6").locator('[data-key="tr-d"]')).toHaveClass(/down/);
    await expect(standard(page, "G4").locator('[data-key="side"], [data-key="gizmo"]')).toHaveCount(0);
    await expect(alternatives(page, "C7").locator('[data-key="gizmo"].down')).toHaveCount(1);
  });

  test("the keys on the player's side drawn below the body, the G♯ key above it", async ({ page }) => {
    await open(page);
    const box = async (sel: string) => (await legendKeys(page).locator(sel).first().boundingBox())!;
    const body = await box(".body");
    for (const key of ["thumb-b", "thumb-bb", "side", "tr-d", "tr-d-sharp", "e-flat", "low-c-sharp", "low-c", "low-b", "gizmo"])
      expect((await box(`[data-key="${key}"]`)).y, key).toBeGreaterThan(body.y + body.height);
    const g = await box('[data-key="g-sharp"]');
    expect(g.y + g.height).toBeLessThan(body.y);
    // Along it: the right pinky's keys past right 3.
    expect((await box('[data-key="e-flat"]')).x).toBeGreaterThan((await box('[data-key="right3"]')).x);
  });

  test("the staves: a natural once, a sharp note as both spellings, the ledger lines", async ({ page }) => {
    await open(page);
    await expect(card(page, "G4").locator(".staff .head")).toHaveCount(1);
    await expect(card(page, "G#4").locator(".staff .head")).toHaveCount(2);
    await expect(card(page, "G#4").locator(".staff .accidental")).toHaveCount(2);
    await expect(card(page, "B3").locator(".staff .line")).toHaveCount(5 + 1); // the staff and middle C's
    await expect(card(page, "C7").locator(".staff .line")).toHaveCount(5 + 5);
    await expect(card(page, "F7").locator(".staff .line")).toHaveCount(5 + 7);
    // Every staff at one scale.
    const scale = await page.locator("svg.staff").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height / (e as SVGSVGElement).viewBox.baseVal.height));
    for (const s of scale) expect(s).toBeCloseTo(scale[0], 5);
  });
});

test.describe("the switches", () => {
  test("the piccolo: its chart, its key and its facts, in the address, remembered", async ({ page }) => {
    await open(page);
    await choose(page, "instrument", "piccolo");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "piccolo");
    await expect(page).toHaveTitle("Instrument Basics | Piccolo fingering chart");
    await expect(page).toHaveURL(/\?instrument=piccolo$/);
    await expect(cards(page)).toHaveCount(PICCOLO.length);
    await expect(cards(page).first()).toHaveAttribute("data-note", "D4");
    await expect(card(page, "D4").locator(".sounds [aria-hidden]")).toHaveText("Sounds D5");
    await expect(register(page, "extreme").locator(".range")).toHaveText("C♯7 – D7");
    await expect(page.locator("h1")).toHaveText("Fingerings for the piccolo");
    await expect(facts(page)).toContainText("There's no foot joint");
    await expect(legendText(page)).not.toContainText("gizmo");
    await expect(page.locator("footer .tip")).not.toContainText("fast slur"); // (the piccolo's own tip)
    // No foot joint anywhere: not in the key, not in a card.
    await expect(page.locator('svg.keys [data-key^="low-"], svg.keys [data-key="gizmo"]')).toHaveCount(0);
    await page.goto("/");
    await expect(switchButton(page, "instrument", "piccolo")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(PICCOLO.length);
    await choose(page, "instrument", "flute");
    await expect(page).toHaveURL(/\?instrument=flute$/);
    await expect(legendKeys(page).locator('[data-key="low-c"]')).toHaveCount(1);
  });

  test("the trumpets: from the list, their chart, what's heard, their valves, in the address", async ({ page }) => {
    await open(page, {}, "/#extreme");
    await groupSelect(page).selectOption("trumpets");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "bb-trumpet");
    await expect(page).toHaveURL(/\?instrument=bb-trumpet$/); // (the flute's #extreme dropped)
    await expect(page).toHaveTitle("Instrument Basics | B♭ trumpet fingering chart");
    await expect(page.locator("h1")).toHaveText("Fingerings for the B♭ trumpet");
    await expect(page.locator(".toc-links a")).toHaveText(["Overview", "Low", "Middle", "High"]);
    await expect(cards(page)).toHaveCount(instrument("bb-trumpet").registers.flatMap((r) => r.notes).length);
    await expect(cards(page).first()).toHaveAttribute("data-note", "F#3");
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds B♭3");
    await expect(standard(page, "C4").locator(".in-words")).toHaveText("Valves none (open)");
    await expect(standard(page, "D4").locator(".in-words")).toHaveText("Valves 1 3");
    await expect(standard(page, "D4").locator("svg.keys")).toHaveAttribute("aria-label", "Press: valve 1, valve 3");
    const down = await standard(page, "D4").locator(".key.down").evaluateAll((els) => els.map((e) => (e as SVGElement).dataset.key));
    expect(down).toEqual(["valve1", "valve3"]);
    await expect(legendKeys(page).locator(".key")).toHaveCount(3);
    await expect(facts(page)).toContainText("a tone lower");
    await expect(page.locator("footer .sources")).toContainText("Yamaha");
    await choose(page, "instrument", "c-trumpet");
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds as written");
    await choose(page, "instrument", "piccolo-trumpet");
    await expect(legendKeys(page).locator(".key")).toHaveCount(4);
    await expect(standard(page, "D4").locator('[data-key="valve4"]')).toHaveClass(/down/);
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds B♭4");
    await expect(cards(page).first()).toHaveAttribute("data-note", "C#3");
  });

  test("the saxophones: the alto first, what's heard, their keys, the baritone's low A", async ({ page }) => {
    await open(page);
    await groupSelect(page).selectOption("saxophones");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "alto-sax");
    await expect(page.locator('#switches [data-group="instrument"] button')).toHaveText(["Soprano", "Alto", "Tenor", "Baritone"]);
    await expect(page.locator("h1")).toHaveText("Fingerings for the alto saxophone");
    await expect(cards(page).first()).toHaveAttribute("data-note", "A#3");
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds E♭3");
    await expect(standard(page, "A#4").locator(".in-words")).toHaveText("Left 1 2Right side B♭");
    await expect(standard(page, "F#6").locator(".in-words")).toHaveText("Left octave · palm D · palm E♭ · palm FRight side E · high F♯");
    const down = await standard(page, "D5").locator(".key.down").evaluateAll((els) => els.map((e) => (e as SVGElement).dataset.key));
    expect(down.sort()).toEqual(["left1", "left2", "left3", "octave", "right1", "right2", "right3"]);
    await expect(legendKeys(page).locator('[data-key="low-a"]')).toHaveCount(0);
    await expect(register(page, "low").locator(".range")).toHaveText("B♭3 – C♯5"); // its low B♭, not A♯
    await choose(page, "instrument", "tenor-sax");
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds B♭2");
    await choose(page, "instrument", "baritone-sax");
    await expect(cards(page).first()).toHaveAttribute("data-note", "A3");
    await expect(standard(page, "A3").locator('[data-key="low-a"]')).toHaveClass(/down/);
    await expect(card(page, "C4").locator(".sounds [aria-hidden]")).toHaveText("Sounds E♭2");
    await expect(register(page, "low").locator(".range")).toHaveText("A3 – C♯5");
  });

  test("each group comes back to the kind last chosen in it", async ({ page }) => {
    await open(page);
    await choose(page, "instrument", "piccolo");
    await pick(page, "trumpets", "c-trumpet");
    await groupSelect(page).selectOption("flutes");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "piccolo");
    await page.reload();
    await groupSelect(page).selectOption("trumpets");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "c-trumpet");
    await expect(groupSelect(page)).toHaveValue("trumpets");
  });

  test("a link to one instrument opens it, and it's remembered", async ({ page }) => {
    await open(page, { "instrument-basics-instrument": "flute" }, "/?instrument=piccolo#high");
    await expect(switchButton(page, "instrument", "piccolo")).toHaveAttribute("aria-pressed", "true");
    await expect(register(page, "high").locator("h2")).toBeInViewport();
    await expect(cards(page)).toHaveCount(PICCOLO.length);
    await expect(page.locator("html")).not.toHaveAttribute("data-pending");
    await expect(facts(page)).toContainText("There's no foot joint");
    await page.goto("/");
    await expect(switchButton(page, "instrument", "piccolo")).toHaveAttribute("aria-pressed", "true");
  });

  test("solfège names, remembered, and kept when the instrument changes", async ({ page }) => {
    await open(page);
    await choose(page, "names", "solfege");
    await expect(noteName(page, "D4")).toHaveText("Re");
    await expect(noteName(page, "A#4")).toHaveText("La♯ / Si♭");
    await expect(card(page, "D4").locator(".sounds [aria-hidden]")).toHaveText("Sounds as written");
    await choose(page, "instrument", "piccolo");
    await expect(noteName(page, "D4")).toHaveText("Re");
    await expect(card(page, "D4").locator(".sounds [aria-hidden]")).toHaveText("Sounds an octave higher");
    await page.reload();
    await expect(switchButton(page, "names", "solfege")).toHaveAttribute("aria-pressed", "true");
    await expect(noteName(page, "G4")).toHaveText("Sol");
  });

  test("the alternatives: folded, opened one by one, or all shown, remembered", async ({ page }) => {
    await open(page);
    const alt = alternatives(page, "A#4");
    await expect(alt.locator("summary")).toHaveText("2 alternatives");
    await expect(alt.locator(".fingering").first()).toBeHidden();
    await alt.locator("summary").click();
    await expect(alt.locator(".fingering")).toHaveCount(2);
    await expect(alt.locator(".fingering").first()).toBeVisible();
    await choose(page, "alternatives", "open");
    await expect(page.locator("details.alternatives:not([open])")).toHaveCount(0);
    await choose(page, "instrument", "piccolo"); // the new chart's, shown too
    await expect(page.locator("details.alternatives:not([open])")).toHaveCount(0);
    await page.reload();
    await expect(switchButton(page, "alternatives", "open")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("details.alternatives:not([open])")).toHaveCount(0);
    await choose(page, "alternatives", "folded");
    await expect(page.locator("details.alternatives[open]")).toHaveCount(0);
    await expect(switchButton(page, "alternatives", "none")).toHaveCount(0);
  });

  test("the alternatives left out before (a choice no longer offered): folded", async ({ page }) => {
    await open(page, { "instrument-basics-alternatives": "none" });
    await expect(switchButton(page, "alternatives", "folded")).toHaveAttribute("aria-pressed", "true");
    await expect(alternatives(page, "A#4")).toBeVisible();
  });

  test("a stored value that isn't a choice falls back to the default", async ({ page }) => {
    await open(page, { "instrument-basics-instrument": "tuba", "instrument-basics-names": "klingon", "instrument-basics-alternatives": "all" }, "/?instrument=oboe");
    await expect(switchButton(page, "instrument", "flute")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "flute");
    await expect(switchButton(page, "names", "letters")).toHaveAttribute("aria-pressed", "true");
    await expect(switchButton(page, "alternatives", "folded")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("the page", () => {
  test("odd addresses and storage: a malformed fragment, an unknown instrument, broken memory", async ({ page }) => {
    await page.goto("/?instrument=alto-sax#%");
    await expect(card(page, "D5")).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("data-pending");
    await expect(page).toHaveURL(/\?instrument=alto-sax$/);
    await page.goto("/?instrument=trumpet");
    await expect(cards(page).first()).toBeVisible();
    await expect(page).not.toHaveURL(/instrument=trumpet/);
    await page.evaluate(() => localStorage.setItem("instrument-basics-kinds", "null"));
    await page.reload();
    await pick(page, "saxophones", "alto-sax");
  });

  test("a link to the key keeps its fragment and scrolls to it", async ({ page }) => {
    await open(page, {}, "/?instrument=tenor-sax#legend");
    await expect(page).toHaveURL(/#legend$/);
    await expect(page.locator("#legend h2")).toBeInViewport();
  });

  test("back to an entry that names another instrument: that one", async ({ page }) => {
    await open(page, {}, "/?instrument=flute");
    await page.locator(".toc").getByRole("link", { name: "3rd" }).click();
    await pick(page, "trumpets", "bb-trumpet");
    await page.goBack();
    await expect(page).toHaveURL(/\?instrument=flute$/);
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "flute");
    await expect(groupSelect(page)).toHaveValue("flutes");
  });

  test("a group comes back to the kind the page opened on", async ({ page }) => {
    await open(page, {}, "/?instrument=piccolo");
    await pick(page, "trumpets", "bb-trumpet");
    await groupSelect(page).selectOption("flutes");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "piccolo");
  });

  test("the last register marked at the page's end, though too short to reach the top", async ({ page }) => {
    await open(page, {}, "/?instrument=piccolo");
    const toc = page.locator(".toc");
    await toc.getByRole("link", { name: "Top" }).click();
    await expect(toc.getByRole("link", { name: "Top" })).toHaveAttribute("aria-current", "location");
  });

  test("at the page's end after a register's link, the last register marked, not the one linked", async ({ page }) => {
    await open(page, {}, "/?instrument=flute#low");
    await page.keyboard.press("End");
    await expect(page.locator(".toc").getByRole("link", { name: "Top" })).toHaveAttribute("aria-current", "location");
  });

  test("a link's instrument becomes its group's kind, over the one remembered", async ({ page }) => {
    await open(page, { "instrument-basics-kinds": JSON.stringify({ saxophones: "alto-sax" }) }, "/?instrument=tenor-sax");
    await pick(page, "flutes", "flute");
    await groupSelect(page).selectOption("saxophones");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "tenor-sax");
  });

  test("another instrument: a register's fragment dropped, the view where it was", async ({ page }) => {
    await open(page, {}, "/?instrument=flute#high");
    await pick(page, "flutes", "piccolo");
    await expect(page).toHaveURL(/\?instrument=piccolo$/);
  });

  test("storage blocked: a link's instrument still shown, and each group's kind still remembered", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } }));
    await page.goto("/?instrument=tenor-sax");
    await expect(page.locator("h1")).toHaveText("Fingerings for the tenor saxophone");
    await pick(page, "flutes", "piccolo");
    await groupSelect(page).selectOption("saxophones");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "tenor-sax");
    await groupSelect(page).selectOption("flutes");
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "piccolo");
  });

  test("back or forward keeps the entry's register fragment", async ({ page }) => {
    await open(page, {}, "/?instrument=flute");
    await page.locator(".toc").getByRole("link", { name: "1st octave" }).click();
    await expect(page).toHaveURL(/#low$/);
    await page.goBack();
    await pick(page, "saxophones", "alto-sax");
    await page.goForward();
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "flute");
    await expect(page).toHaveURL(/\?instrument=flute#low$/);
  });

  test("another instrument announced to screen readers", async ({ page }) => {
    await open(page);
    await expect(page.locator("#announce")).toHaveText("");
    await pick(page, "trumpets", "bb-trumpet");
    await expect(page.locator("#announce")).toHaveText("B-flat trumpet fingering chart");
    await expect(card(page, "C#4").locator(".staff")).toHaveAttribute("aria-label", "Written C-sharp 4 / D-flat 4 on the treble staff");
    await expect(page.getByRole("heading", { name: "C-sharp 4 / D-flat 4" })).toBeVisible();
    await expect(card(page, "C4").locator(".sounds")).toContainText("Sounds B-flat 3");
    await expect(page.getByRole("button", { name: "B-flat", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("on a short screen (a phone turned, or zoomed in) the switches don't stay stuck", async ({ page }) => {
    await page.setViewportSize({ width: 740, height: 360 });
    await open(page);
    await expect(page.locator("#switches")).toHaveCSS("position", "static");
  });

  test("back or forward to another group: the keyboard's focus put back on the kind pressed", async ({ page }) => {
    await open(page, {}, "/?instrument=flute");
    await page.locator(".toc").getByRole("link", { name: "3rd" }).click();
    await pick(page, "saxophones", "tenor-sax");
    await switchButton(page, "instrument", "tenor-sax").focus();
    await page.goBack();
    await expect(page.locator("html")).toHaveAttribute("data-instrument", "flute");
    await expect(switchButton(page, "instrument", "flute")).toBeFocused();
  });

  test("each group's kind kept across tabs", async ({ page, context }) => {
    await open(page, {}, "/?instrument=flute");
    const other = await context.newPage();
    await other.goto("/?instrument=flute");
    await expect(cards(other).first()).toBeVisible();
    await pick(other, "saxophones", "tenor-sax");
    await pick(page, "flutes", "piccolo");
    const third = await context.newPage();
    await third.goto("/?instrument=flute");
    await groupSelect(third).selectOption("saxophones");
    await expect(third.locator("html")).toHaveAttribute("data-instrument", "tenor-sax");
  });

  test("forced colours, whatever theme is chosen: the staff and the keys in the system's colours", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", colorScheme: "light" });
    await open(page, { theme: "dark" });
    const fills = await standard(page, "D4").evaluate((fig) => ({
      down: getComputedStyle(fig.querySelector(".key.down :is(circle, rect)")!).fill,
      card: getComputedStyle(fig.closest(".note")!).backgroundColor,
    }));
    expect(fills.down).not.toBe(fills.card);
    expect(fills.down).not.toBe("rgb(232, 232, 227)"); // (not the dark theme's light text colour)
  });

  test("printed in the dark theme: dark text on white, and the contents left out", async ({ page }) => {
    await open(page, { theme: "dark" });
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("body")).toHaveCSS("color", "rgb(0, 0, 0)");
    await expect(page.locator(".toc")).toBeHidden();
  });

  test("the key says how pressed keys look, true in both themes: filled, the rest outlined", async ({ page }) => {
    await open(page);
    await expect(legendText(page)).toContainText("Filled is pressed, outlined is up.");
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") {
        await themeSwitch(page).click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      }
      const looks = await standard(page, "D4").evaluate((fig) => {
        const fill = (sel: string) => getComputedStyle(fig.querySelector(sel)!).fill;
        const card = getComputedStyle(fig.closest(".note")!).backgroundColor, text = getComputedStyle(document.body).color;
        return { down: fill(".key.down :is(circle, rect)"), up: fill(".key:not(.down) :is(circle, rect)"), card, text };
      });
      expect(looks.down, theme).toBe(looks.text);
      expect(looks.up, theme).toBe(looks.card);
    }
  });

  test("the page's links stand beside the chart, the part being read marked", async ({ page }) => {
    await open(page, {}, "/?instrument=alto-sax");
    const toc = page.locator(".toc");
    await expect(toc.locator(".toc-toggle")).toBeHidden();
    await expect(toc.getByRole("link")).toHaveText(["Overview", "Low", "Middle", "High"]);
    await expect(toc.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "location");
    await toc.getByRole("link", { name: "Middle" }).click();
    await expect(page).toHaveURL(/#middle$/);
    await expect(toc.getByRole("link", { name: "Middle" })).toHaveAttribute("aria-current", "location");
    await expect(toc.locator("[aria-current]")).toHaveCount(1);
    await toc.getByRole("link", { name: "Overview" }).click();
    await expect(page.locator("h1")).toBeInViewport();
    await expect(toc.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "location");
    await pick(page, "trumpets", "bb-trumpet"); // (another instrument: the overview's address kept)
    await expect(page).toHaveURL(/#intro$/);
  });

  test("the page's links fold under a button on a phone @phone", async ({ page }) => {
    await open(page, {}, "/?instrument=bb-trumpet");
    const button = page.getByRole("button", { name: "Contents" });
    const high = page.locator(".toc").getByRole("link", { name: "High" });
    await expect(high).toBeHidden();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await high.click();
    await expect(page).toHaveURL(/#high$/);
    await expect(high).toBeHidden();
    await expect(register(page, "high")).toBeInViewport();
    await button.click();
    await page.keyboard.press("Escape");
    await expect(high).toBeHidden();
    await expect(button).toBeFocused();
    await button.click();
    await page.locator("h1").click({ force: true });
    await expect(high).toBeHidden();
    await button.click(); // the keyboard's focus leaving it closes it too
    await page.keyboard.press("Tab");
    await expect(page.locator(".toc").getByRole("link", { name: "Overview" })).toBeFocused();
    for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
    await expect(high).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("the theme's switch, remembered, and back to the system's", async ({ page }) => {
    await open(page);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    await themeSwitch(page).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(themeSwitch(page)).toHaveAttribute("aria-pressed", "true");
    await themeSwitch(page).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  });

  test("a register's link scrolls to it, under the header and the switches", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "3rd" }).click();
    await expect(page).toHaveURL(/#high$/);
    await expect(register(page, "high").locator("h2")).toBeInViewport();
    const stuckBottom = () => page.evaluate(() => Math.max(...["body > header", "#switches"].map((s) => document.querySelector(s)!.getBoundingClientRect().bottom)));
    await expect.poll(async () => (await register(page, "high").evaluate((e) => e.getBoundingClientRect().top)) - (await stuckBottom())).toBeGreaterThanOrEqual(0);
  });

  test("opened at a register's link, it's there", async ({ page }) => {
    await open(page, {}, "/#extreme");
    await expect(register(page, "extreme").locator("h2")).toBeInViewport();
  });

  test("every instrument is in the picker: its group in the list, then its kind", async ({ page }) => {
    await open(page);
    await expect(groupSelect(page).locator("optgroup")).toHaveCount(SECTIONS.length);
    for (const [i, s] of SECTIONS.entries()) {
      await expect(groupSelect(page).locator("optgroup").nth(i)).toHaveAttribute("label", s.name);
      await expect(groupSelect(page).locator("optgroup").nth(i).locator("option")).toHaveText(s.groups.map((g) => g.name));
    }
    expect(SECTIONS.map((s) => s.name)).toEqual(["Woodwinds", "Brass"]);
    for (const g of GROUPS) {
      await groupSelect(page).selectOption(g.id);
      await expect(page.locator("html")).toHaveAttribute("data-instrument", defaultOf(g));
      const pills = page.locator('#switches [data-group="instrument"] button');
      if (g.instruments.length > 1) await expect(pills).toHaveText(g.instruments.map((i) => i.kind));
      else await expect(pills).toHaveCount(0);
    }
  });
});
