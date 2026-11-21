// The chart follows the choices (the store): each change applied as it's made, through the chart's hooks. The
// instrument's first, as the chart is made again for it (keeping the names and alternatives it has).
import { choices } from "../lib/store.svelte";
import type { Chart } from "./chart";

export function follow(chart: Chart) {
  $effect.root(() => {
    $effect(() => chart.instrument(choices.instrument));
    $effect(() => chart.names(choices.names));
    $effect(() => chart.alternatives(choices.alternatives));
  });
}
