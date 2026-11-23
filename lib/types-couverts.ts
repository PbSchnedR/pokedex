import { TYPES } from "@/lib/types";

// Bonus FR-034 — types couverts par l'équipe : une valeur dérivée de `equipe`, calculée à
// l'affichage et jamais stockée (data-model). Fonction pure, testée sans React ni store.
// Ordre : celui de la table TYPES (Normal, Feu, Eau…), pour que les badges ne changent pas de
// place selon l'ordre des membres. Un type absent de la table (nouveau type de l'API) n'est pas
// perdu : il suit, dans l'ordre de sa première apparition (BadgeType l'affiche en gris).
export function calculerTypesCouverts(equipe: readonly { types: readonly string[] }[]): string[] {
  const presents = new Set(equipe.flatMap((membre) => membre.types));
  const connus = Object.keys(TYPES).filter((type) => presents.has(type));
  const inconnus = [...presents].filter((type) => !(type in TYPES));
  return [...connus, ...inconnus];
}
