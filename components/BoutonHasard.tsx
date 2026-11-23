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

  // Refonte « Console de poche » : touche sombre du pupitre (seule touche d'action de la coque).
  return (
    <button type="button" onClick={tirer} disabled={enCours} className="touche-sombre flex-1 font-pixel text-base">
      <Icone nom="melange" className="size-5" />
      {enCours ? "Tirage…" : "Au hasard"}
    </button>
  );
}
