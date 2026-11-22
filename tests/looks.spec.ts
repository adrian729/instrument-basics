// How the page looks: the intro and key, each register of the flute, the piccolo's start and its third octave
// (where the two differ most), the B♭ trumpet's start and low register, the piccolo trumpet's low register,
// the alto saxophone's start and high register, the baritone's low register,
// a few switches and the dark theme, on desktop, and the start (and a trumpet's picker) on a phone;
// compared with tests/screenshots. After a change meant to change them: `pnpm test:update`, then look at the
// new ones before committing.
import { test, expect, open, register, choose } from "./app";

const TALL = { stylePath: "tests/screenshot.css" }; // (see the file)
const settle = async (page: import("@playwright/test").Page) => { await page.mouse.move(0, 0); await page.evaluate(() => document.fonts.ready); };

test("look intro", async ({ page }) => {
  await open(page);
  await settle(page);
  await expect(page).toHaveScreenshot("intro.png");
});

for (const id of ["low", "middle", "high", "extreme"]) {
  test(`look ${id}`, async ({ page }) => {
    await open(page);
    await settle(page);
    await expect(register(page, id)).toHaveScreenshot(`${id}.png`, TALL);
  });
}

test("look piccolo", async ({ page }) => {
  await open(page, { "instrument-basics-instrument": "piccolo" });
  await settle(page);
  await expect(page).toHaveScreenshot("piccolo-intro.png");
  await expect(register(page, "low")).toHaveScreenshot("piccolo-low.png", TALL);
  await expect(register(page, "high")).toHaveScreenshot("piccolo-high.png", TALL);
});

test("look trumpets", async ({ page }) => {
  await open(page, { "instrument-basics-instrument": "bb-trumpet" });
  await settle(page);
  await expect(page).toHaveScreenshot("trumpet-intro.png");
  await expect(register(page, "low")).toHaveScreenshot("trumpet-low.png", TALL);
  await page.goto("/?instrument=piccolo-trumpet");
  await settle(page);
  await expect(register(page, "low")).toHaveScreenshot("piccolo-trumpet-low.png", TALL);
});

test("look saxophones", async ({ page }) => {
  await open(page, { "instrument-basics-instrument": "alto-sax" });
  await settle(page);
  await expect(page).toHaveScreenshot("sax-intro.png");
  await expect(register(page, "high")).toHaveScreenshot("sax-high.png", TALL);
  await page.goto("/?instrument=baritone-sax");
  await settle(page);
  await expect(register(page, "low")).toHaveScreenshot("baritone-low.png", TALL);
});

test("look alternatives open, solfège", async ({ page }) => {
  await open(page);
  await choose(page, "alternatives", "open");
  await choose(page, "names", "solfege");
  await settle(page);
  await expect(register(page, "high")).toHaveScreenshot("high-open-solfege.png", TALL);
});

test("look dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await open(page);
  await settle(page);
  await expect(page).toHaveScreenshot("intro-dark.png");
  await expect(register(page, "low")).toHaveScreenshot("low-dark.png", TALL);
});

test("look phone @phone", async ({ page }) => {
  await open(page);
  await settle(page);
  await expect(page).toHaveScreenshot("phone-intro.png");
  await page.getByRole("link", { name: "3rd" }).click();
  await expect(register(page, "high").locator("h2")).toBeInViewport();
  await page.evaluate(() => new Promise((r) => setTimeout(r, 600))); // (the smooth scroll's end)
  await expect(page).toHaveScreenshot("phone-high.png");
});

test("look phone trumpet @phone", async ({ page }) => {
  await open(page, { "instrument-basics-instrument": "piccolo-trumpet" });
  await settle(page);
  await page.locator("#switches").scrollIntoViewIfNeeded();
  await expect(page.locator("#switches")).toHaveScreenshot("phone-picker.png");
  await expect(register(page, "low").locator("article.note").first()).toHaveScreenshot("phone-trumpet-card.png");
});
