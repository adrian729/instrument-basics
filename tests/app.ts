// The page as the tests see it: every selector the tests depend on is here, built on what a user sees (roles,
// labels) or the switches' data attributes, so that a change of markup is one change here.
import { test as base, expect, type Page } from "@playwright/test";

// Every test fails on a page error or a console error.
export const test = base.extend<{ errors: string[] }>({
  errors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
    await use(errors);
    expect(errors, "page and console errors").toEqual([]);
  }, { auto: true }],
});
export { expect };

// Opens the page fresh (nothing remembered), or with `saved` in its storage, and waits for the chart.
export async function open(page: Page, saved: Record<string, string> = {}, path = "/") {
  await page.addInitScript((saved) => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    localStorage.clear();
    for (const [k, v] of Object.entries(saved)) localStorage.setItem(k, v);
  }, saved);
  await page.goto(path);
  await expect(card(page, "D4")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

export const register = (page: Page, id: string) => page.locator(`section.register#${id}`);
export const registers = (page: Page) => page.locator("section.register");
export const cards = (page: Page) => page.locator("article.note");
export const card = (page: Page, note: string) => page.locator(`article.note[data-note="${note}"]`);
export const noteName = (page: Page, note: string) => card(page, note).locator(".note-name");
export const standard = (page: Page, note: string) => card(page, note).locator(".fingering.standard");
export const alternatives = (page: Page, note: string) => card(page, note).locator("details.alternatives");
export const switchButton = (page: Page, key: string, value: string) => page.locator(`#switches [data-${key}="${value}"]`);
export const themeSwitch = (page: Page) => page.locator(".theme-switch");
export const legendKeys = (page: Page) => page.locator("#legend svg.keys");
export const facts = (page: Page, instrument: string) => page.locator(`.intro .facts[data-for="${instrument}"]`);

export async function choose(page: Page, key: string, value: string) {
  await switchButton(page, key, value).click();
  await expect(switchButton(page, key, value)).toHaveAttribute("aria-pressed", "true");
}
