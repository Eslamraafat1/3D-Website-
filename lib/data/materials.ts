import type { ArtSpec, MaterialId } from "./types";

export const materialIds: MaterialId[] = ["limestone", "concrete", "steel", "oak", "travertine", "stone"];

export const materialArt: Record<MaterialId, ArtSpec> = {
  limestone: { variant: "limestone", seed: 201, tone: "warm" },
  concrete: { variant: "concrete", seed: 202, tone: "cool" },
  steel: { variant: "steel", seed: 203, tone: "dusk" },
  oak: { variant: "oak", seed: 204, tone: "night" },
  travertine: { variant: "travertine", seed: 205, tone: "warm" },
  stone: { variant: "stone", seed: 206, tone: "cool" },
};
