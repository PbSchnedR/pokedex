// Bonus FR-039 (research R10, data-model « Combat ») : combat simulé entre deux sacoches.
// Entièrement déterministe : même entrée = même résultat, aucune part d'aléatoire.
import tableTypes from "@/data/table-types.json";

// Typage structurel : tout objet ayant ces champs (dont le futur `Pokemon`) peut combattre.
export type Combattant = {
  id: number;
  nom: string;
  types: string[];
  stats: { nom: string; valeur: number }[];
};

export type Vainqueur = "a" | "b" | "nul";

export type Duel<T extends Combattant = Combattant> = {
  a: T;
  b: T;
  scoreA: number;
  scoreB: number;
  multA: number;
  multB: number;
  vainqueur: Vainqueur;
};

export type ResultatCombat<T extends Combattant = Combattant> = {
  duels: Duel<T>[];
  victoiresA: number;
  victoiresB: number;
  issue: "victoire" | "defaite" | "nul";
};

// Table générée par scripts/generer-donnees.mjs : efficacité attaquant → défenseur (0, 0.5, 1, 2).
const TABLE: Record<string, Record<string, number>> = tableTypes;

// Un type absent de la table (donnée inattendue) est traité comme neutre (×1).
const efficacite = (attaquant: string, defenseur: string): number =>
  TABLE[attaquant]?.[defenseur] ?? 1;

// Meilleur type attaquant : max sur `t ∈ attaquant` du produit des efficacités de `t`
// contre chaque type défenseur (deux faiblesses se cumulent : ×4, deux résistances : ×0,25).
// Sans type attaquant, le multiplicateur est neutre (×1).
export function multiplicateur(attaquant: string[], defenseur: string[]): number {
  if (attaquant.length === 0) {
    return 1;
  }
  return Math.max(
    ...attaquant.map((t) => defenseur.reduce((produit, d) => produit * efficacite(t, d), 1)),
  );
}

// Score de A contre B : somme des 6 statistiques de base de A × multiplicateur(A → B).
export function scoreDuel(a: Combattant, b: Combattant): number {
  const total = a.stats.reduce((somme, stat) => somme + stat.valeur, 0);
  return total * multiplicateur(a.types, b.types);
}

const dueler = <T extends Combattant>(a: T, b: T): Duel<T> => {
  const scoreA = scoreDuel(a, b);
  const scoreB = scoreDuel(b, a);
  const vainqueur: Vainqueur = scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : "nul";
  return {
    a,
    b,
    scoreA,
    scoreB,
    multA: multiplicateur(a.types, b.types),
    multB: multiplicateur(b.types, a.types),
    vainqueur,
  };
};

// Duels 1 contre 1 dans l'ordre des sacoches ; l'issue est donnée du point de vue de A.
// Les sacoches ont normalement la même taille (FR-039) ; sinon, les membres en trop ne
// combattent pas.
export function combattre<T extends Combattant>(equipeA: T[], equipeB: T[]): ResultatCombat<T> {
  const nombre = Math.min(equipeA.length, equipeB.length);
  const duels = equipeA.slice(0, nombre).map((a, i) => dueler(a, equipeB[i]));
  const victoiresA = duels.filter((duel) => duel.vainqueur === "a").length;
  const victoiresB = duels.filter((duel) => duel.vainqueur === "b").length;
  const issue =
    victoiresA > victoiresB ? "victoire" : victoiresB > victoiresA ? "defaite" : "nul";
  return { duels, victoiresA, victoiresB, issue };
}
