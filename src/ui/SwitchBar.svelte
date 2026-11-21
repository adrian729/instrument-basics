<!--
  The switches above the chart, in named groups: the instrument, how notes are named, and what's shown of the
  alternatives.
-->
<script lang="ts">
  import { choices, choose, VALUES, type Choices } from "../lib/store.svelte";

  type Choice = { value: string; text: string; title: string };
  const INSTRUMENT: Choice[] = [
    { value: "flute", text: "Flute", title: "The concert flute, in C" },
    { value: "piccolo", text: "Piccolo", title: "The piccolo, sounding an octave higher" },
  ];
  const NAMES: Choice[] = [
    { value: "letters", text: "C D E", title: "Letter names, with octave numbers (C4 is middle C)" },
    { value: "solfege", text: "Do Re Mi", title: "Solfège names" },
  ];
  const ALTERNATIVES: Choice[] = [
    { value: "folded", text: "Folded", title: "The alternatives folded under each note, opened one by one" },
    { value: "open", text: "Shown", title: "Every alternative shown" },
    { value: "none", text: "None", title: "The standard fingerings alone" },
  ];
  // (Each list in VALUES' order, its first the default.)
  const ordered = (key: keyof Choices, list: Choice[]) => (VALUES[key] as string[]).map((v) => list.find((c) => c.value === v)!);
</script>

{#snippet group(name: string, key: keyof Choices, list: Choice[])}
  <div class="switch-group" data-group={key}>
    <span class="group-name" id={`group-${key}`}>{name}</span>
    <div class="switch" role="group" aria-labelledby={`group-${key}`}>
      {#each ordered(key, list) as c (c.value)}
        <button type="button" {...{ [`data-${key}`]: c.value }} title={c.title} aria-pressed={choices[key] === c.value} onclick={() => choose(key, c.value as never)}>{c.text}</button>
      {/each}
    </div>
  </div>
{/snippet}

<div class="switch-row">
  {@render group("Instrument", "instrument", INSTRUMENT)}
  {@render group("Note names", "names", NAMES)}
  {@render group("Alternatives", "alternatives", ALTERNATIVES)}
</div>
