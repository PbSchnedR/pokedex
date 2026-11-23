"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icone from "./Icone";

// ch. 11, exercice « Bouton Au hasard » : appelle notre Route Handler puis navigue vers la fiche.
// router.push (et non Link) : la destination n'est connue qu'après l'appel.
export default function BoutonHasard() {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);

  const tirer = async () => {
    setEnCours(true);
    try {
      const reponse = await fetch("/api/aleatoire");
      if (!reponse.ok) throw new Error("Tirage impossible");
      const pokemon = await reponse.json();
      router.push(`/pokemon/${pokemon.nom}`);
    } finally {
      setEnCours(false); // un échec ne bloque pas le bouton
    }
  };

  return (
    <button
      type="button"
      onClick={tirer}
      disabled={enCours}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-pokedex px-4 py-2 text-base font-bold
                 text-pokedex transition-transform hover:bg-pokedex/10 active:scale-95 focus-visible:outline-2
                 focus-visible:outline-offset-2 focus-visible:outline-pokedex disabled:cursor-not-allowed disabled:opacity-40
                 motion-reduce:transition-none dark:border-pokedex-sombre dark:text-pokedex-sombre
                 dark:focus-visible:outline-pokedex-sombre"
    >
      <Icone nom="melange" className="size-4" />
      {enCours ? "Tirage…" : "Au hasard"}
    </button>
  );
}
