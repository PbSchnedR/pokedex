// Contrat `specs/001-pokedex-app/contracts/stockage-local.md` : « stockage indisponible ou
// corrompu → stores vides, aucune erreur affichée ». Le stockage du navigateur est une entrée
// non fiable, comme l'adresse (ch. 9) : on ne garde que ce qui a la forme attendue, élément par
// élément, au lieu de faire confiance au JSON relu (défaut D1 de la recette finale).
import type { Membre } from "@/stores/sacoche";

const TAILLE_MAX = 6; // = TAILLE_SACOCHE (non importée : stores/sacoche importe ce fichier)
const LONGUEUR_SURNOM = 12;

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return typeof valeur === "object" && valeur !== null && !Array.isArray(valeur);
}

// Favoris : liste de noms (chaînes non vides), sans doublon.
export function validerFavoris(persiste: unknown): { noms: string[] } {
  const noms = estObjet(persiste) && Array.isArray(persiste.noms) ? persiste.noms : [];
  return { noms: [...new Set(noms.filter((n): n is string => typeof n === "string" && n !== ""))] };
}

function versMembre(valeur: unknown): Membre | null {
  if (!estObjet(valeur)) return null;
  const { id, nom, image, types, surnom } = valeur;
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) return null;
  if (typeof nom !== "string" || nom === "" || typeof image !== "string") return null;
  if (!Array.isArray(types) || types.length === 0 || !types.every((t) => typeof t === "string")) return null;
  return { id, nom, image, types, surnom: typeof surnom === "string" ? surnom.slice(0, LONGUEUR_SURNOM) : "" };
}

// Sacoche : membres bien formés seulement, sans doublon d'id, 6 au plus (mêmes règles que
// l'action `ajouter`, ch. 9) ; l'ordre stocké est conservé.
export function validerSacoche(persiste: unknown): { equipe: Membre[] } {
  const brut = estObjet(persiste) && Array.isArray(persiste.equipe) ? persiste.equipe : [];
  const equipe: Membre[] = [];
  for (const element of brut) {
    const membre = versMembre(element);
    if (membre && !equipe.some((m) => m.id === membre.id)) equipe.push(membre);
    if (equipe.length === TAILLE_MAX) break;
  }
  return { equipe };
}
