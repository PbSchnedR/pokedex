"use client";

import { calculerTypesCouverts } from "@/lib/types-couverts";
import { useSacoche } from "@/stores/sacoche";

// Bonus ch. 10 (étape 17) — les types présents dans la sacoche, dans l'ordre de TYPES.
// ch. 9 (piège) — le sélecteur renvoie `equipe` telle quelle, jamais un tableau fabriqué : un
// sélecteur `(etat) => calculer(etat.equipe)` créerait un nouveau tableau à chaque appel et
// l'affichage tournerait en boucle. Le calcul se fait ensuite, pendant le rendu (ch. 10 : une
// valeur calculable ne passe ni par un état ni par un effet). Pas de useMemo : six membres au
// plus, le calcul coûte moins que la mémorisation (« ne mémorisez pas par réflexe »).
export function useTypesCouverts(): string[] {
  const equipe = useSacoche((etat) => etat.equipe);
  return calculerTypesCouverts(equipe);
}
