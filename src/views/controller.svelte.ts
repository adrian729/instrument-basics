// The chart follows the choices (the store): each change applied as it's made, through the chart's hooks.
import { choices } from "../lib/store.svelte";
import type { Chart } from "./chart";

export function follow(chart: Chart) {
  $effect.root(() => {
    $effect(() => chart.names(choices.names));
    $effect(() => chart.alternatives(choices.alternatives));
  });
}
