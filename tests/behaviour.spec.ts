// What the page does: the data it's made from, the chart in order, the switches and what they remember,
// the theme, and the registers' links.
import { REGISTERS, parseFingering } from "../src/data/fingerings";
import { staffStep } from "../src/lib/notes";
import { test, expect, open, register, registers, cards, card, noteName, standard, alternatives, switchButton, choose, themeSwitch } from "./app";

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const semitone = (id: string) => { const m = /^([A-G]#?)(\d)$/.exec(id)!; return Number(m[2]) * 12 + CHROMATIC.indexOf(m[1]); };
const NOTES = REGISTERS.flatMap((r) => r.notes);

test.describe("the data", () => {
  test("every semitone from D4 to D7, once, in order", () => {
    const steps = NOTES.map((n) => semitone(n.id));
    expect(NOTES[0].id).toBe("D4");
    expect(NOTES.at(-1)!.id).toBe("D7");
    steps.forEach((s, i) => { if (i) expect(s - steps[i - 1], NOTES[i].id).toBe(1); });
  });

  test("every note has a standard fingering, and no fingering twice", () => {
    for (const n of NOTES) {
      expect(n.fingerings.length, n.id).toBeGreaterThan(0);
      const sources = n.fingerings.map((f) => f.source.replace(/\s+/g, " "));
      expect(new Set(sources).size, n.id).toBe(sources.length);
    }
  });

  test("the notation is read as written, and a typo is refused", () => {
    expect(parseFingering("B 123 G# | 1-3 Eb trD#")).toMatchObject({
      thumb: "B", left: [true, true, true], gSharp: true, right: [true, false, true], eFlat: true, extras: ["trD#"],
    });
    expect(parseFingering("- --- | ---")).toMatchObject({ thumb: null, left: [false, false, false], gSharp: false, right: [false, false, false], eFlat: false, extras: [] });
    for (const bad of ["B 123 123 Eb", "X 123 | 123", "B 12 | 123", "B 123 Eb | 123", "B 123 | 123 trE", "B 123 | 123 Eb Eb"]) expect(() => parseFingering(bad), bad).toThrow();
  });

  test("a few fingerings everyone knows", () => {
    const first = (id: string) => NOTES.find((n) => n.id === id)!.fingerings[0];
    expect(first("D4")).toMatchObject({ thumb: "B", left: [true, true, true], right: [true, true, true], eFlat: false }); // all down, pinky up
    expect(first("G4")).toMatchObject({ thumb: "B", left: [true, true, true], right: [false, false, false], eFlat: true });
    expect(first("C#5")).toMatchObject({ thumb: null, left: [false, false, false], right: [false, false, false], eFlat: true });
    expect(first("D5")).toMatchObject({ left: [false, true, true], eFlat: false }); // left 1 lifted
  });

  test("the staff's steps: D4 under the bottom line, F5 the top line", () => {
    expect(staffStep("D", 4)).toBe(-1);
    expect(staffStep("E", 4)).toBe(0);
    expect(staffStep("F", 5)).toBe(8);
    expect(staffStep("C", 7)).toBe(19);
  });
});

test.describe("first visit", () => {
  test("the registers in order, every note a card, letters and the alternatives folded", async ({ page }) => {
    await open(page);
    await expect(registers(page).locator("h2")).toHaveText(["First octave", "Second octave", "Third octave", "Extreme top"]);
    await expect(cards(page)).toHaveCount(NOTES.length);
    expect(await cards(page).evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.note))).toEqual(NOTES.map((n) => n.id));
    for (const r of REGISTERS) await expect(register(page, r.id).locator("article.note")).toHaveCount(r.notes.length);
    await expect(switchButton(page, "names", "letters")).toHaveAttribute("aria-pressed", "true");
    await expect(switchButton(page, "alternatives", "folded")).toHaveAttribute("aria-pressed", "true");
    // Each switch's first choice is its default.
    for (const key of ["names", "alternatives"]) await expect(page.locator(`#switches [data-group="${key}"] button`).first()).toHaveAttribute("aria-pressed", "true");
    await expect(noteName(page, "D4")).toHaveText("D4");
    await expect(noteName(page, "C#5")).toHaveText("C♯5 / D♭5");
    await expect(card(page, "D4").locator(".sounds")).toHaveText("Sounds D5");
    await expect(page.locator("details.alternatives[open]")).toHaveCount(0);
  });

  test("every card has its staff, its diagram and the fingering in words", async ({ page }) => {
    await open(page);
    for (const n of NOTES) {
      const c = card(page, n.id);
      await expect(c.locator("svg.staff")).toHaveAttribute("aria-label", /on the treble staff/);
      await expect(standard(page, n.id).locator("svg.keys")).toHaveAttribute("aria-label", /^(Press: |Every key open)/);
      await expect(standard(page, n.id).locator(".in-words")).toContainText("Left");
      await expect(c.locator(".fingering")).toHaveCount(n.fingerings.length);
    }
  });

  test("a diagram presses what its fingering says", async ({ page }) => {
    await open(page);
    const keys = standard(page, "G#4").locator("svg.keys");
    await expect(keys).toHaveAttribute("aria-label", "Press: B thumb key, left 1, left 2, left 3, G-sharp key, E-flat key");
    const down = await keys.locator(".key.down").evaluateAll((els) => els.map((e) => (e as SVGElement).dataset.key));
    expect(down.sort()).toEqual(["e-flat", "g-sharp", "left1", "left2", "left3", "thumb-b"]);
    await expect(standard(page, "G#4").locator(".in-words")).toHaveText("Left thumb B · 1 2 3 · G♯Right E♭");
    // A trill key, pressed; the side lever drawn only where it's used.
    await expect(standard(page, "A#6").locator('[data-key="tr-d"]')).toHaveClass(/down/);
    await expect(standard(page, "G4").locator('[data-key="side"]')).toHaveCount(0);
  });

  test("the staves: a natural once, a sharp note as both spellings", async ({ page }) => {
    await open(page);
    await expect(card(page, "G4").locator(".staff .head")).toHaveCount(1);
    await expect(card(page, "G#4").locator(".staff .head")).toHaveCount(2);
    await expect(card(page, "G#4").locator(".staff .accidental")).toHaveCount(2);
    await expect(card(page, "C7").locator(".staff .line")).toHaveCount(5 + 5); // the staff and five ledger lines
  });
});

test.describe("the switches", () => {
  test("solfège names, remembered", async ({ page }) => {
    await open(page);
    await choose(page, "names", "solfege");
    await expect(noteName(page, "D4")).toHaveText("Re");
    await expect(noteName(page, "A#4")).toHaveText("La♯ / Si♭");
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
    await choose(page, "alternatives", "none");
    await expect(alt).toBeHidden();
    await page.reload();
    await expect(switchButton(page, "alternatives", "none")).toHaveAttribute("aria-pressed", "true");
    await expect(alternatives(page, "A#4")).toBeHidden();
    await choose(page, "alternatives", "folded");
    await expect(alternatives(page, "A#4")).toBeVisible();
    await expect(page.locator("details.alternatives[open]")).toHaveCount(0);
  });

  test("a stored value that isn't a choice falls back to the default", async ({ page }) => {
    await open(page, { "piccolo-names": "klingon", "piccolo-alternatives": "all" });
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

  test("no foot-joint keys anywhere", async ({ page }) => {
    await open(page);
    await expect(page.locator('svg.keys [data-key^="low-"], svg.keys [data-key*="foot"]')).toHaveCount(0);
  });
});
