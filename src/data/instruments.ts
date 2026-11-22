// Every instrument, in the picker's groups and order. The first group's default is the page's.
import { FLUTES } from "./flutes";
import { SAXOPHONES } from "./saxophones";
import { TRUMPETS } from "./trumpets";
import type { Group, GroupId, Instrument, InstrumentId } from "./instrument";

export { defaultOf } from "./instrument";
export type { Group, GroupId, Instrument, InstrumentId, Options, Shown, Transposition } from "./instrument";

export const GROUPS: Group[] = [FLUTES, TRUMPETS, SAXOPHONES];
export const INSTRUMENTS: Instrument[] = GROUPS.flatMap((g) => g.instruments);
export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;
export const group = (id: GroupId) => GROUPS.find((g) => g.id === id)!;
