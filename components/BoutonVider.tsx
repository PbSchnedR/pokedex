"use client";

import { useState } from "react";
import { useSacoche } from "@/stores/sacoche";

// ch. 9, exercice « Vider la sacoche, avec confirmation ». L'état « à confirmer » ne concerne
// que ce bouton : il reste dans un useState, pas dans le store.
export default function BoutonVider() {
  const nombre = useSacoche((etat) => etat.equipe.length);
  const vider = useSacoche((etat) => etat.vider);
  const [aConfirmer, setAConfirmer] = useState(false);

  if (nombre === 0) return null;
  return (
    <button
      type="button"
      onClick={() => {
        if (aConfirmer) vider();
        setAConfirmer(!aConfirmer);
      }}
      onBlur={() => setAConfirmer(false)}
      className={`rounded-full px-4 py-2 text-base font-bold transition-transform active:scale-95 focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-pokedex motion-reduce:transition-none
                  dark:focus-visible:outline-pokedex-sombre ${
                    aConfirmer
                      ? "bg-pokedex text-white"
                      : "text-pokedex hover:bg-pokedex/10 dark:text-pokedex-sombre"
                  }`}
    >
      {aConfirmer ? "Confirmer ?" : "Vider la sacoche"}
    </button>
  );
}
