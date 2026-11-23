import { TYPES } from "./types";

// ch. 9 — « Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc non fiable. »
// Même logique que Resultats dans le cours, extraite ici en fonctions pures pour être testée
// (décision Q-3, research R13). Deux fonctions et non une seule : le nombre de pages dépend du
// nombre de résultats, qui dépend lui-même du texte et du type validés.

export const PAR_PAGE = 24;

// Next.js donne `string[]` quand un paramètre est répété (`?q=a&q=b`) : on garde le premier.
type Valeur = string | string[] | undefined;
const premiere = (valeur: Valeur): string => (Array.isArray(valeur) ? valeur[0] ?? "" : valeur ?? "");

export type ParametresRecherche = { q?: Valeur; type?: Valeur; page?: Valeur };

export function lireFiltres(parametres: ParametresRecherche) {
  const q = premiere(parametres.q);
  const type = premiere(parametres.type);
  return {
    q, // texte tel que saisi, conservé dans les liens
    texte: q.trim().toLowerCase(), // texte comparé aux noms
    // Object.hasOwn et non `type in TYPES` : `in` accepte aussi `constructor`, `toString`…
    type: Object.hasOwn(TYPES, type) ? type : "",
  };
}

export function bornerPage(page: Valeur, nombreResultats: number) {
  const nombrePages = Math.max(1, Math.ceil(nombreResultats / PAR_PAGE));
  // `abc` → NaN → 1 ; `2.5` → 2 ; puis ramené dans [1, nombrePages].
  const demandee = Math.floor(Number(premiere(page))) || 1;
  const pageCourante = Math.min(Math.max(1, demandee), nombrePages);
  return { pageCourante, nombrePages };
}
