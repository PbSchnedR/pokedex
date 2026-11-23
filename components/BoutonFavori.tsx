"use client";

import { useFavoris } from "@/stores/favoris";
import Icone from "./Icone";

// ch. 9 — sélecteurs à une valeur : le bouton ne se réaffiche que si SON état change.
// Étoile vide / pleine en SVG Phosphor (décision Q-T012-c) au lieu de « ☆ / ★ ».
// Bonus FR-033 — `nom` (API) reste la clé stockée ; `libelle` (nom français) n'est qu'affiché.
export default function BoutonFavori({
  nom,
  libelle = nom,
  className = "",
}: {
  nom: string;
  libelle?: string;
  className?: string;
}) {
  const actif = useFavoris((etat) => etat.noms.includes(nom));
  const basculer = useFavoris((etat) => etat.basculer);
  return (
    <button
      type="button"
      onClick={() => basculer(nom)}
      aria-pressed={actif}
      aria-label={actif ? `Retirer ${libelle} des favoris` : `Ajouter ${libelle} aux favoris`}
      className={`grid size-10 place-items-center rounded-full bg-surface shadow-sm transition-transform duration-150
                  hover:scale-110 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-pokedex motion-reduce:transition-none dark:bg-surface-sombre
                  dark:focus-visible:outline-pokedex-sombre ${
                    actif ? "text-pokedex dark:text-pokedex-sombre" : "text-doux dark:text-doux-sombre"
                  } ${className}`}
    >
      <Icone nom={actif ? "etoilePleine" : "etoile"} className="size-5" />
    </button>
  );
}
