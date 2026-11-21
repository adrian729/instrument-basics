// How the page looks: the intro and key, each register, a few switches and the dark theme, on desktop, and
// the same's start on a phone; compared with tests/screenshots. After a change meant to change them:
// `pnpm test:update`, then look at the new ones before committing.
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
