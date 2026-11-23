import type { Statistique } from "@/types/pokemon";
import { NOMS_FR, type EntreeNomFr } from "./noms-fr";
import { normaliser } from "./texte";

// ch. 9 — « Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc non fiable. »
// Même style que lib/parametres.ts : fonctions pures, testées (lib/comparaison.test.ts).

type Valeur = string | string[] | undefined;
const premiere = (valeur: Valeur): string => (Array.isArray(valeur) ? valeur[0] ?? "" : valeur ?? "");

export type ParametresComparaison = { a?: Valeur; b?: Valeur };

// Un nom de l'API ne contient que des minuscules, des chiffres et des tirets (`mr-mime`,
// `porygon-z`) ; le plus long fait une trentaine de caractères.
const FORME_NOM = /^[a-z0-9-]{1,40}$/;

// Ce que la colonne doit afficher avant même d'appeler l'API :
// - `vide` : rien dans l'adresse (invitation à choisir) ;
// - `invalide` : saisie impossible pour un nom de l'API → « introuvable » sans requête ;
// - `nom` : à chercher dans l'API (qui peut encore répondre 404 → « introuvable »).
export type Choix =
  | { etat: "vide" }
  | { etat: "invalide"; saisi: string }
  | { etat: "nom"; nom: string };

// Bonus FR-033 — nom français normalisé → nom de l'API (« salameche » → « charmander »).
// Aucun nom français normalisé n'est le nom API d'un autre Pokémon (vérifié sur les 1 025) :
// l'ordre des deux règles ci-dessous ne change donc rien pour un nom API.
const PAR_NOM_FR = new Map(NOMS_FR.map((p) => [normaliser(p.nomFr), p.nom]));

export function lireChoix(valeur: Valeur): Choix {
  const saisi = premiere(valeur).trim();
  if (!saisi) return { etat: "vide" };
  // Saisie française (accents et casse ignorés) : le champ du comparateur attend un nom français ;
  // l'adresse garde aussi les noms de l'API, écrits par le lien « Comparer » de la fiche.
  const nomApi = PAR_NOM_FR.get(normaliser(saisi));
  if (nomApi) return { etat: "nom", nom: nomApi };
  const nom = saisi.toLowerCase(); // même règle que la fiche : insensible à la casse
  return FORME_NOM.test(nom) ? { etat: "nom", nom } : { etat: "invalide", saisi };
}

export function lireComparaison(parametres: ParametresComparaison) {
  return { a: lireChoix(parametres.a), b: lireChoix(parametres.b) };
}

export type Gagnant = "a" | "b" | "egalite";

// Pour chaque statistique de `a`, le côté qui a la plus grande valeur. Les stats sont associées
// par leur nom (et non par leur position) ; une stat absente chez `b` est ignorée.
export function meilleuresValeurs(a: Statistique[], b: Statistique[]): Record<string, Gagnant> {
  const resultat: Record<string, Gagnant> = {};
  for (const stat of a) {
    const autre = b.find((s) => s.nom === stat.nom);
    if (!autre) continue;
    resultat[stat.nom] = stat.valeur > autre.valeur ? "a" : stat.valeur < autre.valeur ? "b" : "egalite";
  }
  return resultat;
}

// Q-C1 (choix de l'utilisateur : option C) — nom introuvable → Pokémon dont le nom français
// contient la saisie (bonus FR-033 : accents et casse ignorés, nom anglais non cherché), dans
// l'ordre des numéros (ordre de `entrees`), au plus `limite`. Renvoie les noms de l'API, pour
// les liens. Saisie vide → aucune.
export const LIMITE_SUGGESTIONS = 8;

export function suggerer(
  saisi: string,
  entrees: Pick<EntreeNomFr, "nom" | "nomFr">[],
  limite = LIMITE_SUGGESTIONS
): string[] {
  const texte = normaliser(saisi);
  if (!texte) return [];
  return entrees
    .filter((entree) => normaliser(entree.nomFr).includes(texte))
    .slice(0, limite)
    .map((entree) => entree.nom);
}

// Valeur à recopier dans l'adresse pour l'autre côté (null : rien à recopier).
export function valeurChoix(choix: Choix): string | null {
  return choix.etat === "nom" ? choix.nom : choix.etat === "invalide" ? choix.saisi : null;
}

// Lien d'une suggestion : remplace un côté, conserve l'autre tel qu'il est dans l'adresse.
export function lienComparaison(cote: "a" | "b", nom: string, autre: string | null): string {
  const parametres = new URLSearchParams();
  const autreCote = cote === "a" ? "b" : "a";
  parametres.set(cote, nom);
  if (autre) parametres.set(autreCote, autre);
  parametres.sort(); // toujours ?a=…&b=…
  return `/comparer?${parametres.toString()}`;
}
