<!--
  The switches at the top of the page, in named groups: the instrument (its group, from a list in sections that can
  grow long, then its kind among the group's, if there's more than one, and its key system, if the group has more
  than one: the clarinets' Boehm and German), how notes are named, the view (full, or compact), and in full,
  what's shown of the alternatives.
-->
<script lang="ts">
  import { GROUPS, SECTIONS, instrument, type GroupId } from "../data/instruments";
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
  const VIEWS: Choice[] = [
    { value: "full", text: "Full", title: "Each note in full: its staff, its fingerings, drawn and in words, and what they're for" },
    { value: "compact", text: "Compact", title: "Each note's standard fingering, small, for an overview: an octave on a screen" },
  ];
  // (Each list in VALUES' order, its first the default.)
  const ordered = (key: keyof Choices, list: Choice[]) => (VALUES[key] as string[]).map((v) => list.find((c) => c.value === v)!);

  const shown = $derived(instrument(choices.instrument));
  const all = $derived(GROUPS.find((g) => g.id === shown.group)!.instruments);
  // Each kind once, in the system shown if it has it (the bass clarinet is Boehm's alone); each system the
  // group has, its button the kind shown in it, if there is one.
  const kinds = $derived([...new Set(all.map((i) => i.kind))].map((k) => all.find((i) => i.kind === k && i.system === shown.system) ?? all.find((i) => i.kind === k)!));
  const systems = $derived([...new Set(all.flatMap((i) => (i.system ? [i.system] : [])))].map((name) => ({ name, to: all.find((i) => i.kind === shown.kind && i.system === name) })));
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
          {#each SECTIONS as s (s.name)}
            <optgroup label={s.name}>
              {#each s.groups as g (g.id)}
                <option value={g.id}>{g.name}</option>
              {/each}
            </optgroup>
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
      {#if systems.length > 1}
        <div class="switch" role="group" aria-label="Key system">
          {#each systems as s (s.name)}
            <button type="button" data-system={s.name} title={s.to ? s.to.title : `No ${s.name}-system ${shown.name} here`} disabled={!s.to} aria-pressed={shown.system === s.name} onclick={() => s.to && choose("instrument", s.to.id)}>{s.name}</button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  {@render group("Note names", "names", NAMES)}
  {@render group("View", "view", VIEWS)}
  {#if choices.view === "full"}{@render group("Alternatives", "alternatives", ALTERNATIVES)}{/if}
</div>
