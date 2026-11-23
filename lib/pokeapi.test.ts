import { describe, expect, it, vi } from "vitest";

// lib/pokeapi.ts importe cacheLife de next/cache, qui n'existe que dans Next.js.
vi.mock("next/cache", () => ({ cacheLife: () => {} }));

const { aplatir } = await import("@/lib/pokeapi");

type Maillon = { species: { name: string }; evolves_to: Maillon[] };
const maillon = (nom: string, ...evolutions: Maillon[]): Maillon => ({ species: { name: nom }, evolves_to: evolutions });

describe("aplatir (ch. 8 — chaîne d'évolution récursive)", () => {
  it("chaîne linéaire : Salamèche → 3 noms dans l'ordre", () => {
    const chaine = maillon("charmander", maillon("charmeleon", maillon("charizard")));
    expect(aplatir(chaine)).toEqual(["charmander", "charmeleon", "charizard"]);
  });

  it("arbre ramifié : Évoli → la base puis toutes les branches", () => {
    const branches = ["vaporeon", "jolteon", "flareon", "espeon", "umbreon", "leafeon", "glaceon", "sylveon"];
    const chaine = maillon("eevee", ...branches.map((nom) => maillon(nom)));
    expect(aplatir(chaine)).toEqual(["eevee", ...branches]);
  });

  it("branches à plusieurs niveaux : parcours en profondeur", () => {
    const chaine = maillon("oddish", maillon("gloom", maillon("vileplume"), maillon("bellossom")));
    expect(aplatir(chaine)).toEqual(["oddish", "gloom", "vileplume", "bellossom"]);
  });

  it("maillon sans évolution : un seul nom", () => {
    expect(aplatir(maillon("tauros"))).toEqual(["tauros"]);
  });
});
