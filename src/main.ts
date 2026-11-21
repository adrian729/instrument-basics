// The page: the theme's switch, the chart and its key, the switches above it, and the chart following them.
import "./styles.css";
import "./lib/theme";
import { mount } from "svelte";
import SwitchBar from "./ui/SwitchBar.svelte";
import { makeChart } from "./views/chart";
import { follow } from "./views/controller.svelte";

// The header's height and the switches', for what sticks below them and where a register's link scrolls to.
const measure = (selector: string, name: string) =>
  new ResizeObserver(([entry]) => document.documentElement.style.setProperty(name, `${entry.borderBoxSize[0].blockSize}px`)).observe(document.querySelector(selector)!);
measure("body > header", "--header-height");
measure("#switches", "--switches-height");

const chart = makeChart(document.querySelector<HTMLElement>("#chart")!, document.querySelector<HTMLElement>("#legend")!);
mount(SwitchBar, { target: document.querySelector("#switches")! });
follow(chart);

// Opened at a register's link (#high), there once the chart is in.
if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: "instant" });
