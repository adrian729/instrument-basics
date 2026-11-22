// The page: the theme's switch, the chart and its key, the switches above it, and the chart following them.
import "./styles.css";
import "./lib/theme";
import { flushSync, mount } from "svelte";
import SwitchBar from "./ui/SwitchBar.svelte";
import { hashId, makeChart } from "./views/chart";
import { follow } from "./views/controller.svelte";
import { toc } from "./views/toc";

// The header's height and the switches', for what sticks below them and where a register's link scrolls to.
const measure = (selector: string, name: string) =>
  new ResizeObserver(([entry]) => document.documentElement.style.setProperty(name, `${entry.borderBoxSize[0].blockSize}px`)).observe(document.querySelector(selector)!);
measure("body > header", "--header-height");
measure("#switches", "--switches-height");

const chart = makeChart(document.querySelector<HTMLElement>("#chart")!, document.querySelector<HTMLElement>("#legend")!);
mount(SwitchBar, { target: document.querySelector("#switches")! });
follow(chart);
toc(document.querySelector<HTMLElement>(".toc")!);
flushSync(); // (the chart made now, not after this script)

// Back or forward to another instrument, the keyboard's focus on the picker's kinds or the page's links (made
// again): put back on the one pressed, or the same link.
addEventListener("popstate", () => {
  const was = document.activeElement;
  const href = was?.closest(".toc-links a")?.getAttribute("href");
  const picker = !!was?.closest(".picker");
  if (!href && !picker) return;
  flushSync();
  if (document.activeElement !== document.body) return;
  const to = picker ? document.querySelector<HTMLElement>('.picker [aria-pressed="true"]') ?? document.querySelector<HTMLElement>(".picker select")
    : document.querySelector<HTMLElement>(`.toc-links a[href="${CSS.escape(href!)}"]`) ?? document.querySelector<HTMLElement>(".toc-links a");
  to?.focus();
});

// Opened at a register's link (#high), there once the chart is in.
if (hashId()) document.getElementById(hashId())?.scrollIntoView({ behavior: "instant" });
