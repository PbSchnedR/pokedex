import { describe, expect, it } from "vitest";
import tableTypes from "@/data/table-types.json";
import { combattre, multiplicateur, scoreDuel, type Combattant } from "@/lib/combat";

const TABLE: Record<string, Record<string, number>> = tableTypes;
const TYPES = Object.keys(TABLE);

// Cherche dans la table un attaquant et deux défenseurs distincts ayant tous deux
// l'efficacité voulue (ex. 2 et 2 pour une double faiblesse).
const trouverPaire = (valeur: number) => {
  for (const t of TYPES) {
    const cibles = TYPES.filter((d) => TABLE[t][d] === valeur);
    if (cibles.length >= 2) {
      return { attaquant: t, defenseurs: [cibles[0], cibles[1]] };
    }
  }
  throw new Error(`aucune paire d'efficacité ${valeur} dans la table`);
};

// 6 statistiques de base dont la somme vaut `total`.
const creer = (id: number, types: string[], total: number): Combattant => ({
  id,
  nom: `pokemon-${id}`,
  types,
  stats: [
    { nom: "hp", valeur: total - 5 },
    { nom: "attack", valeur: 1 },
    { nom: "defense", valeur: 1 },
    { nom: "special-attack", valeur: 1 },
    { nom: "special-defense", valeur: 1 },
    { nom: "speed", valeur: 1 },
  ],
});

describe("table des types", () => {
  it("est complète (18 × 18) avec des valeurs 0, 0.5, 1 ou 2", () => {
    expect(TYPES).toHaveLength(18);
    for (const t of TYPES) {
      expect(Object.keys(TABLE[t]).sort()).toEqual([...TYPES].sort());
      for (const d of TYPES) {
        expect([0, 0.5, 1, 2]).toContain(TABLE[t][d]);
      }
    }
  });
});

describe("multiplicateur", () => {
  it("vaut 0 en cas d'immunité (normal contre ghost)", () => {
    expect(TABLE.normal.ghost).toBe(0);
    expect(multiplicateur(["normal"], ["ghost"])).toBe(0);
  });

  it("vaut 4 en cas de double faiblesse (paire lue dans la table)", () => {
    const { attaquant, defenseurs } = trouverPaire(2);
    expect(multiplicateur([attaquant], defenseurs)).toBe(4);
  });

  it("vaut 0,25 en cas de double résistance (paire lue dans la table)", () => {
    const { attaquant, defenseurs } = trouverPaire(0.5);
    expect(multiplicateur([attaquant], defenseurs)).toBe(0.25);
  });

  it("retient le meilleur type attaquant", () => {
    // normal ne touche pas ghost (×0) mais fire le touche : on garde le meilleur.
    const attendu = Math.max(TABLE.normal.ghost, TABLE.fire.ghost);
    expect(attendu).toBeGreaterThan(0);
    expect(multiplicateur(["normal", "fire"], ["ghost"])).toBe(attendu);
    expect(multiplicateur(["fire", "normal"], ["ghost"])).toBe(attendu);
  });
});

describe("scoreDuel", () => {
  it("multiplie la somme des 6 statistiques par le multiplicateur", () => {
    const a = creer(1, ["water"], 300);
    const b = creer(2, ["fire"], 300);
    expect(scoreDuel(a, b)).toBe(300 * TABLE.water.fire);
  });
});

describe("combattre", () => {
  it("déclare un duel nul à score égal", () => {
    const resultat = combattre([creer(1, ["normal"], 400)], [creer(2, ["normal"], 400)]);
    expect(resultat.duels[0].scoreA).toBe(resultat.duels[0].scoreB);
    expect(resultat.duels[0].vainqueur).toBe("nul");
    expect(resultat.issue).toBe("nul");
  });

  it("déclare un match nul à victoires égales", () => {
    const equipeA = [creer(1, ["normal"], 500), creer(2, ["normal"], 300)];
    const equipeB = [creer(3, ["normal"], 300), creer(4, ["normal"], 500)];
    const resultat = combattre(equipeA, equipeB);
    expect(resultat.duels.map((duel) => duel.vainqueur)).toEqual(["a", "b"]);
    expect(resultat.victoiresA).toBe(1);
    expect(resultat.victoiresB).toBe(1);
    expect(resultat.issue).toBe("nul");
  });

  it("donne la victoire à la sacoche qui gagne le plus de duels", () => {
    const equipeA = [creer(1, ["normal"], 500), creer(2, ["normal"], 500), creer(3, ["normal"], 300)];
    const equipeB = [creer(4, ["normal"], 300), creer(5, ["normal"], 300), creer(6, ["normal"], 600)];
    const resultat = combattre(equipeA, equipeB);
    expect([resultat.victoiresA, resultat.victoiresB]).toEqual([2, 1]);
    expect(resultat.issue).toBe("victoire");
    expect(combattre(equipeB, equipeA).issue).toBe("defaite");
  });

  it("donne le même résultat pour la même entrée", () => {
    const equipeA = [creer(1, ["fire", "flying"], 534), creer(2, ["water"], 530)];
    const equipeB = [creer(3, ["grass", "poison"], 525), creer(4, ["electric"], 320)];
    expect(combattre(equipeA, equipeB)).toEqual(combattre(equipeA, equipeB));
  });
});
