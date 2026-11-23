import { create } from "zustand";
import { persist } from "zustand/middleware";

type EtatFavoris = {
  noms: string[];
  basculer: (nom: string) => void;
};

// ch. 9 — état partagé (étoiles, compteur, page Favoris) et propre au visiteur : un store.
// Pas de Provider : le store est un module importé là où il sert.
export const useFavoris = create<EtatFavoris>()(
  persist(
    (set) => ({
      noms: [],
      // Nouveau tableau à chaque fois, jamais de push (comme avec useState).
      basculer: (nom) =>
        set((etat) => ({
          noms: etat.noms.includes(nom)
            ? etat.noms.filter((n) => n !== nom)
            : [...etat.noms, nom],
        })),
    }),
    // ch. 9 — skipHydration : le stockage n'est relu qu'après le premier affichage
    // (HydratationStores), sinon le HTML du navigateur différerait de celui du serveur.
    { name: "pokedex-favoris", skipHydration: true }
  )
);
