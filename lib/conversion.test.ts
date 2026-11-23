import { describe, expect, it } from "vitest";
import { versPokemon } from "@/lib/conversion";
import type { PokemonApi } from "@/types/pokemon";

const brut = (id: number, name: string): PokemonApi => ({
  id,
  name,
  height: 6,
  weight: 85,
  types: [{ type: { name: "fire" } }],
  stats: [{ base_stat: 39, stat: { name: "hp" } }],
  sprites: { other: { "official-artwork": { front_default: null } } },
});

describe("versPokemon — bonus FR-033", () => {
  it("ajoute le nom français ; le nom de l'API reste dans `nom` (adresses, clés)", () => {
    const pokemon = versPokemon(brut(4, "charmander"));
    expect(pokemon.nom).toBe("charmander");
    expect(pokemon.nomFr).toBe("Salamèche");
  });

  it("numéro absent du fichier (forme spéciale) → repli sur le nom de l'API", () => {
    expect(versPokemon(brut(10100, "raichu-alola")).nomFr).toBe("raichu-alola");
  });
});
