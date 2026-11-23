import type { Statistique } from "@/types/pokemon";

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

export function lireChoix(valeur: Valeur): Choix {
  const saisi = premiere(valeur).trim();
  if (!saisi) return { etat: "vide" };
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
