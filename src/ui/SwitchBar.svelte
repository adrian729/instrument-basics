<!--
  The switches above the chart, in named groups: the instrument (its group, from a list that can grow long,
  then its kind among the group's, if there's more than one), how notes are named, and what's shown of the
  alternatives.
-->
<script lang="ts">
  import { GROUPS, instrument, type GroupId } from "../data/instruments";
  import { choices, choose, chooseGroup, VALUES, type Choices } from "../lib/store.svelte";
  import { spoken } from "../lib/notes";

  type Choice = { value: string; text: string; title: string };
  const NAMES: Choice[] = [
    { value: "letters", text: "C D E", title: "Letter names, with octave numbers (C4 is middle C)" },
    { value: "solfege", text: "Do Re Mi", title: "Solfège names" },
  ];
  const ALTERNATIVES: Choice[] = [
    { value: "folded", text: "Folded", title: "The alternatives folded under each note, opened one by one" },
    { value: "open", text: "Shown", title: "Every alternative shown" },
  ];
  // (Each list in VALUES' order, its first the default.)
  const ordered = (key: keyof Choices, list: Choice[]) => (VALUES[key] as string[]).map((v) => list.find((c) => c.value === v)!);

  const shown = $derived(instrument(choices.instrument));
  const kinds = $derived(GROUPS.find((g) => g.id === shown.group)!.instruments);
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
  <div class="switch-group" data-group="instrument">
    <span class="group-name" id="group-instrument">Instrument</span>
    <div class="picker">
      <span class="select">
        <select aria-label="Instrument family" value={shown.group} onchange={(e) => chooseGroup(e.currentTarget.value as GroupId)}>
          {#each GROUPS as g (g.id)}
            <option value={g.id}>{g.name}</option>
          {/each}
        </select>
      </span>
      {#if kinds.length > 1}
        <div class="switch" role="group" aria-label="Kind">
          {#each kinds as i (i.id)}
            <button type="button" data-instrument={i.id} title={i.title} aria-label={spoken(i.kind)} aria-pressed={choices.instrument === i.id} onclick={() => choose("instrument", i.id)}>{i.kind}</button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  {@render group("Note names", "names", NAMES)}
  {@render group("Alternatives", "alternatives", ALTERNATIVES)}
</div>
