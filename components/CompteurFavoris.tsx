"use client";

import { useFavoris } from "@/stores/favoris";

// ch. 9 — sélecteur sur un nombre : le compteur ne se réaffiche que si ce nombre change.
// Refonte « Console de poche » : mini-afficheur ambre de la touche « Favoris ».
export default function CompteurFavoris() {
  const nombre = useFavoris((etat) => etat.noms.length);
  return (
    <span className="afficheur touche-compteur">
      <span className="sr-only">(</span>
      {nombre}
      <span className="sr-only"> favoris)</span>
    </span>
  );
}
