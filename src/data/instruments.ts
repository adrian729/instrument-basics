// Every instrument, in the picker's groups and order. The first group's first instrument is the page's
// default; each group's first, the group's.
import { FLUTES } from "./flutes";
import type { Group, GroupId, Instrument, InstrumentId } from "./instrument";

export type { Group, GroupId, Instrument, InstrumentId, Options, Shown, Transposition } from "./instrument";

export const GROUPS: Group[] = [FLUTES];
export const INSTRUMENTS: Instrument[] = GROUPS.flatMap((g) => g.instruments);
export const instrument = (id: InstrumentId) => INSTRUMENTS.find((i) => i.id === id)!;
export const group = (id: GroupId) => GROUPS.find((g) => g.id === id)!;
