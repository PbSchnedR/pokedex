import { TYPES } from "./types";

// ch. 9 — « Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc non fiable. »
// Même logique que Resultats dans le cours, extraite ici en fonctions pures pour être testée
// (décision Q-3, research R13). Deux fonctions et non une seule : le nombre de pages dépend du
// nombre de résultats, qui dépend lui-même du texte et du type validés.

export const PAR_PAGE = 24;

// Next.js donne `string[]` quand un paramètre est répété (`?q=a&q=b`) : on garde le premier.
type Valeur = string | string[] | undefined;
const premiere = (valeur: Valeur): string => (Array.isArray(valeur) ? valeur[0] ?? "" : valeur ?? "");

export type ParametresRecherche = { q?: Valeur; type?: Valeur; page?: Valeur; tri?: Valeur };

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

// Bonus FR-036 — `?tri=` (contracts/routes.md) : `numero` (défaut, ordre du Pokédex,
// clarification « Analyse ») ou `nom`. Toute autre valeur, ou son absence, donne `numero`.
export type Tri = "numero" | "nom";

export function lireTri(valeur: Valeur): Tri {
  return premiere(valeur) === "nom" ? "nom" : "numero";
}

// Bonus FR-039 — `/combat?adversaire=25,6,94` (contracts/routes.md) : 1 à 6 numéros entiers,
// uniques, entre 1 et 1 025. Tout écart rend la liste entière invalide (`null`) : la page tire
// alors une nouvelle sacoche adverse, plutôt que de combattre une sacoche à moitié devinée.
export const TAILLE_MAX_ADVERSAIRE = 6;
export const NUMERO_MAX = 1025;

export function lireAdversaire(valeur: Valeur): number[] | null {
  const morceaux = premiere(valeur).split(",");
  if (morceaux.length > TAILLE_MAX_ADVERSAIRE) return null;
  // /^\d+$/ avant Number : Number accepte aussi "", " 7", "1e2", "0x10" ou "2.0".
  if (!morceaux.every((morceau) => /^\d+$/.test(morceau))) return null;
  const ids = morceaux.map(Number);
  if (ids.some((id) => id < 1 || id > NUMERO_MAX)) return null;
  return new Set(ids).size === ids.length ? ids : null;
}
