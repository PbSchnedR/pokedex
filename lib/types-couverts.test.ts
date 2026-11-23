import { describe, expect, it } from "vitest";
import { calculerTypesCouverts } from "@/lib/types-couverts";

const membre = (...types: string[]) => ({ types });

describe("calculerTypesCouverts", () => {
  it("renvoie un tableau vide pour une sacoche vide", () => {
    expect(calculerTypesCouverts([])).toEqual([]);
  });

  it("ne garde chaque type qu'une fois", () => {
    expect(calculerTypesCouverts([membre("grass", "poison"), membre("grass", "poison"), membre("poison")])).toEqual([
      "grass",
      "poison",
    ]);
  });

  it("suit l'ordre de la table TYPES, pas celui des membres", () => {
    // Dracaufeu (Feu/Vol), Bulbizarre (Plante/Poison), Pikachu (Électrik), Carapuce (Eau)
    const equipe = [membre("fire", "flying"), membre("grass", "poison"), membre("electric"), membre("water")];
    expect(calculerTypesCouverts(equipe)).toEqual(["fire", "water", "electric", "grass", "poison", "flying"]);
    // Même équipe dans un autre ordre : même résultat.
    expect(calculerTypesCouverts([...equipe].reverse())).toEqual(calculerTypesCouverts(equipe));
  });

  it("place un type inconnu de la table après les types connus, sans le perdre", () => {
    expect(calculerTypesCouverts([membre("stellar"), membre("water")])).toEqual(["water", "stellar"]);
  });

  it("ne modifie pas l'équipe reçue", () => {
    const equipe = [membre("water", "ice")];
    const copie = structuredClone(equipe);
    calculerTypesCouverts(equipe);
    expect(equipe).toEqual(copie);
  });
});
