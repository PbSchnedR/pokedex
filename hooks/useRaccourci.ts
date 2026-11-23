"use client";

import { useEffect } from "react";

// ch. 10 — un raccourci clavier global ; ignoré quand on écrit déjà dans un champ (la touche
// s'écrit alors normalement, FR-022). Nettoyage : l'écouteur est retiré à la disparition.
export function useRaccourci(touche: string, action: () => void) {
  useEffect(() => {
    const ecouter = (evenement: KeyboardEvent) => {
      const cible = evenement.target as HTMLElement;
      if (evenement.key !== touche || cible.tagName === "INPUT" || cible.tagName === "TEXTAREA") return;
      evenement.preventDefault();
      action();
    };
    window.addEventListener("keydown", ecouter);
    return () => window.removeEventListener("keydown", ecouter);
  }, [touche, action]);
}
