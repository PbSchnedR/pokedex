"use client";

import { useCallback, useRef } from "react";
import { enregistrerActivation } from "@/lib/compteurClics";

// ch. 10 — useRef garde les horodatages entre deux affichages sans en provoquer : compter un clic
// ne doit rien redessiner. La fonction renvoyée est appelée depuis l'événement (jamais pendant le
// rendu) et renvoie vrai à la 5e activation en moins de 3 s.
export function useCompteurClics() {
  const horodatages = useRef<number[]>([]);

  return useCallback(() => {
    const resultat = enregistrerActivation(horodatages.current, Date.now());
    horodatages.current = resultat.horodatages;
    return resultat.declenche;
  }, []);
}
