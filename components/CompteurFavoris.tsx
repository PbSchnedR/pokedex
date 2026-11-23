"use client";

import { useFavoris } from "@/stores/favoris";

// ch. 9 — sélecteur sur un nombre : le compteur ne se réaffiche que si ce nombre change.
export default function CompteurFavoris() {
  const nombre = useFavoris((etat) => etat.noms.length);
  return (
    <span className="rounded-full bg-fond px-2 text-xs font-bold tabular-nums dark:bg-fond-sombre">
      <span className="sr-only">(</span>
      {nombre}
      <span className="sr-only"> favoris)</span>
    </span>
  );
}
