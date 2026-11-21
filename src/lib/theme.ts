// The theme: the system's, or the one chosen with the header's switch (kept in this browser; the head's
// script sets it before the page is drawn).
const dark = matchMedia("(prefers-color-scheme: dark)");
const button = document.querySelector<HTMLButtonElement>(".theme-switch")!;
const show = () => {
  const isDark = (document.documentElement.dataset.theme ?? (dark.matches ? "dark" : "light")) === "dark";
  button.setAttribute("aria-pressed", String(isDark));
  button.title = isDark ? "Light theme" : "Dark theme";
};
button.addEventListener("click", () => {
  const next = button.getAttribute("aria-pressed") === "true" ? "light" : "dark";
  if (next === (dark.matches ? "dark" : "light")) { delete document.documentElement.dataset.theme; try { localStorage.removeItem("theme"); } catch {} } // (the system's again)
  else { document.documentElement.dataset.theme = next; try { localStorage.setItem("theme", next); } catch {} }
  show();
});
dark.addEventListener("change", show);
show();
