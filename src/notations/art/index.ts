// Every instrument's drawing (../art.ts), each in its own file here, named for it. Generated with them: the
// files are listed as they are, not edited by hand.
import type { Art } from "../art";
import altoSax from "./alto-sax";
import baritoneHorn from "./baritone-horn";
import baritoneSax from "./baritone-sax";
import bassClarinet from "./bass-clarinet";
import clarinet from "./clarinet";
import cornet from "./cornet";
import euphonium from "./euphonium";
import flugelhorn from "./flugelhorn";
import flute from "./flute";
import mellophone from "./mellophone";
import piccolo from "./piccolo";
import piccoloTrumpet from "./piccolo-trumpet";
import sopranoSax from "./soprano-sax";
import tenorHorn from "./tenor-horn";
import tenorSax from "./tenor-sax";
import trumpet from "./trumpet";

export type ArtId =
  | "flute" | "piccolo" | "clarinet" | "bass-clarinet" | "soprano-sax" | "alto-sax" | "tenor-sax" | "baritone-sax"
  | "trumpet" | "piccolo-trumpet" | "cornet" | "flugelhorn" | "mellophone" | "tenor-horn" | "baritone-horn" | "euphonium";

export const ART: Partial<Record<ArtId, Art>> = { "alto-sax": altoSax, "baritone-horn": baritoneHorn, "baritone-sax": baritoneSax, "bass-clarinet": bassClarinet, "clarinet": clarinet, "cornet": cornet, "euphonium": euphonium, "flugelhorn": flugelhorn, "flute": flute, "mellophone": mellophone, "piccolo": piccolo, "piccolo-trumpet": piccoloTrumpet, "soprano-sax": sopranoSax, "tenor-horn": tenorHorn, "tenor-sax": tenorSax, "trumpet": trumpet };
