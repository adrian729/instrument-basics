// Every instrument, in the picker's sections, groups and order (woodwinds, then brass, each as a score lists
// them). The first group's default is the page's.
import { CORNETS } from "./brass/cornets";
import { EUPHONIUMS } from "./brass/euphoniums";
import { ALTO_HORNS } from "./brass/alto-horns";
import { TRUMPETS } from "./brass/trumpets";
import { CLARINETS } from "./woodwinds/clarinets";
import { FLUTES } from "./woodwinds/flutes";
import { SAXOPHONES } from "./woodwinds/saxophones";
import type { Group, GroupId, Instrument, InstrumentId, Section } from "./instrument";

export { defaultOf } from "./instrument";
export type { Group, GroupId, Instrument, InstrumentId, Options, Section, Shown, Transposition } from "./instrument";

export const GROUPS: Group[] = [FLUTES, CLARINETS, SAXOPHONES, TRUMPETS, CORNETS, ALTO_HORNS, EUPHONIUMS];
export const SECTIONS: { name: Section; groups: Group[] }[] = [...new Set(GROUPS.map((g) => g.section))].map((name) => ({ name, groups: GROUPS.filter((g) => g.section === name) }));
export const INSTRUMENTS: Instrument[] = GROUPS.flatMap((g) => g.instruments);
export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;
export const group = (id: GroupId) => GROUPS.find((g) => g.id === id)!;
