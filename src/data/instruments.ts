// Every instrument, in the picker's sections, groups and order (woodwinds, then brass, the brass from high to low).
// The first group's default is the page's.
import { BARITONE_HORN } from "./brass/baritone-horn";
import { CORNET } from "./brass/cornet";
import { EUPHONIUM } from "./brass/euphonium";
import { FLUGELHORN } from "./brass/flugelhorn";
import { MELLOPHONE } from "./brass/mellophone";
import { TENOR_HORN } from "./brass/tenor-horn";
import { TRUMPETS } from "./brass/trumpets";
import { CLARINETS } from "./woodwinds/clarinets";
import { FLUTES } from "./woodwinds/flutes";
import { SAXOPHONES } from "./woodwinds/saxophones";
import type { Group, GroupId, Instrument, InstrumentId, Section } from "./instrument";

export { defaultOf } from "./instrument";
export type { Group, GroupId, Instrument, InstrumentId, Options, Section, Shown, Transposition } from "./instrument";

export const GROUPS: Group[] = [FLUTES, CLARINETS, SAXOPHONES, TRUMPETS, CORNET, FLUGELHORN, MELLOPHONE, TENOR_HORN, BARITONE_HORN, EUPHONIUM];
export const SECTIONS: { name: Section; groups: Group[] }[] = [...new Set(GROUPS.map((g) => g.section))].map((name) => ({ name, groups: GROUPS.filter((g) => g.section === name) }));
export const INSTRUMENTS: Instrument[] = GROUPS.flatMap((g) => g.instruments);
export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;
export const group = (id: GroupId) => GROUPS.find((g) => g.id === id)!;
