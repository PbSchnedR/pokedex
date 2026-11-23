import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Pokemon } from "@/types/pokemon";

export const TAILLE_SACOCHE = 6;
// research R8 — surnom borné ; chaîne vide = pas de surnom (on affiche le nom).
export const LONGUEUR_SURNOM = 12;

// ch. 9 — Pick : seulement ce qu'il faut pour afficher un membre, pas les statistiques.
// Pas de nom français ici même après le bonus FR-033 : il se déduit du numéro (data-model).
export type Membre = Pick<Pokemon, "id" | "nom" | "image" | "types"> & { surnom: string };

type EtatSacoche = {
  equipe: Membre[];
  ajouter: (pokemon: Pick<Pokemon, "id" | "nom" | "image" | "types">) => void; // type = exactement ce que l'action lit
  retirer: (id: number) => void;
  renommer: (id: number, surnom: string) => void;
  vider: () => void;
  deplacer: (depuis: number, vers: number) => void;
};

// ch. 9 — les règles métier vivent dans les actions du store, pas dans les boutons : même si un
// bouton oubliait de se désactiver, la sacoche ne dépasserait jamais six ni n'aurait de doublon.
// Rien de calculable n'est stocké (« pleine », types couverts : dérivés de `equipe`).
export const useSacoche = create<EtatSacoche>()(
  persist(
    (set) => ({
      equipe: [],
      ajouter: (pokemon) =>
        set((etat) => {
          const dejaPresent = etat.equipe.some((membre) => membre.id === pokemon.id);
          if (dejaPresent || etat.equipe.length >= TAILLE_SACOCHE) return etat; // refus : état inchangé
          const { id, nom, image, types } = pokemon;
          return { equipe: [...etat.equipe, { id, nom, image, types, surnom: "" }] };
        }),
      retirer: (id) =>
        set((etat) => ({ equipe: etat.equipe.filter((membre) => membre.id !== id) })),
      renommer: (id, surnom) =>
        set((etat) => ({
          equipe: etat.equipe.map((membre) =>
            membre.id === id ? { ...membre, surnom: surnom.slice(0, LONGUEUR_SURNOM) } : membre
          ),
        })),
      vider: () => set({ equipe: [] }),
      // Bonus FR-040 (research R9) — nouveau tableau, comme les autres actions. Un indice hors
      // bornes (ou égal à l'autre) laisse l'état inchangé : ni perte ni doublon possible, et
      // le nombre de membres ne change jamais, donc les règles « 6 max » et « sans doublon » tiennent.
      deplacer: (depuis, vers) =>
        set((etat) => {
          const valide = (i: number) => Number.isInteger(i) && i >= 0 && i < etat.equipe.length;
          if (!valide(depuis) || !valide(vers) || depuis === vers) return etat;
          const equipe = [...etat.equipe];
          const [membre] = equipe.splice(depuis, 1);
          equipe.splice(vers, 0, membre);
          return { equipe };
        }),
    }),
    { name: "pokedex-sacoche", skipHydration: true }
  )
);
