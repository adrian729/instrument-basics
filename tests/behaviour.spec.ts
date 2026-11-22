// What the page does: the data it's made from, the chart in order, the switches and what they remember (the
// instrument in the address too), the theme, and the registers' links.
import { parseFingering } from "../src/data/fingerings";
import { INSTRUMENTS, instrument } from "../src/data/instruments";
import { staffStep } from "../src/lib/notes";
import { test, expect, open, register, registers, cards, card, noteName, standard, alternatives, switchButton, choose, themeSwitch, legendKeys, facts } from "./app";

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const semitone = (id: string) => { const m = /^([A-G]#?)(\d)$/.exec(id)!; return Number(m[2]) * 12 + CHROMATIC.indexOf(m[1]); };
const notesOf = (id: "flute" | "piccolo") => instrument(id).registers.flatMap((r) => r.notes);
const FLUTE = notesOf("flute"), PICCOLO = notesOf("piccolo");
const first = (notes: typeof FLUTE, id: string) => notes.find((n) => n.id === id)!.fingerings[0];

test.describe("the data", () => {
  for (const [id, lowest, highest] of [["flute", "B3", "F7"], ["piccolo", "D4", "D7"]] as const) {
    test(`the ${id}: every semitone from ${lowest} to ${highest}, once, in order`, () => {
      const notes = notesOf(id);
      expect(notes[0].id).toBe(lowest);
      expect(notes.at(-1)!.id).toBe(highest);
      const steps = notes.map((n) => semitone(n.id));
      steps.forEach((s, i) => { if (i) expect(s - steps[i - 1], notes[i].id).toBe(1); });
    });
  }

  test("every note has a standard fingering, and no fingering twice", () => {
    for (const n of [...FLUTE, ...PICCOLO]) {
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
    await expect(card(page, "C4").locator(".sounds")).toHaveText("Sounds as written");
    await expect(page.locator("details.alternatives[open]")).toHaveCount(0);
    await expect(facts(page, "flute")).toBeVisible();
    await expect(facts(page, "piccolo")).toBeHidden();
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
    await expect(card(page, "D4").locator(".sounds")).toHaveText("Sounds D5");
    await expect(register(page, "extreme").locator(".range")).toHaveText("C♯7 – D7");
    await expect(facts(page, "piccolo")).toBeVisible();
    await expect(facts(page, "flute")).toBeHidden();
    // No foot joint anywhere: not in the key, not in a card.
    await expect(page.locator('svg.keys [data-key^="low-"], svg.keys [data-key="gizmo"]')).toHaveCount(0);
    await page.goto("/");
    await expect(switchButton(page, "instrument", "piccolo")).toHaveAttribute("aria-pressed", "true");
    await expect(cards(page)).toHaveCount(PICCOLO.length);
    await choose(page, "instrument", "flute");
    await expect(page).toHaveURL(/\?instrument=flute$/);
    await expect(legendKeys(page).locator('[data-key="low-c"]')).toHaveCount(1);
  });

  test("a link to one instrument opens it, and it's remembered", async ({ page }) => {
    await open(page, { "instrument-basics-instrument": "flute" }, "/?instrument=piccolo#high");
    await expect(switchButton(page, "instrument", "piccolo")).toHaveAttribute("aria-pressed", "true");
    await expect(register(page, "high").locator("h2")).toBeInViewport();
    await expect(cards(page)).toHaveCount(PICCOLO.length);
    await page.goto("/");
    await expect(switchButton(page, "instrument", "piccolo")).toHaveAttribute("aria-pressed", "true");
  });

  test("solfège names, remembered, and kept when the instrument changes", async ({ page }) => {
    await open(page);
    await choose(page, "names", "solfege");
    await expect(noteName(page, "D4")).toHaveText("Re");
    await expect(noteName(page, "A#4")).toHaveText("La♯ / Si♭");
    await expect(card(page, "D4").locator(".sounds")).toHaveText("Sounds as written");
    await choose(page, "instrument", "piccolo");
    await expect(noteName(page, "D4")).toHaveText("Re");
    await expect(card(page, "D4").locator(".sounds")).toHaveText("Sounds an octave higher");
    await page.reload();
    await expect(switchButton(page, "names", "solfege")).toHaveAttribute("aria-pressed", "true");
    await expect(noteName(page, "G4")).toHaveText("Sol");
  });

  test("the alternatives: folded, opened one by one, all shown, or none, remembered", async ({ page }) => {
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
    await choose(page, "alternatives", "none");
    await expect(alternatives(page, "A#4")).toBeHidden();
    await page.reload();
    await expect(switchButton(page, "alternatives", "none")).toHaveAttribute("aria-pressed", "true");
    await expect(alternatives(page, "A#4")).toBeHidden();
    await choose(page, "alternatives", "folded");
    await expect(alternatives(page, "A#4")).toBeVisible();
    await expect(page.locator("details.alternatives[open]")).toHaveCount(0);
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

  test("every instrument is in the switch", async ({ page }) => {
    await open(page);
    await expect(page.locator('#switches [data-group="instrument"] button')).toHaveText(INSTRUMENTS.map((i) => i.name[0].toUpperCase() + i.name.slice(1)));
  });
});
