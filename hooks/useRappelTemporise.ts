"use client";

import { useCallback, useEffect, useRef } from "react";

// ch. 10 — temporise un rappel au lieu d'une valeur : on l'appelle depuis l'événement (onChange),
// sans effet qui « surveille » la saisie. useRef garde le minuteur et la dernière version du
// rappel sans provoquer de nouvel affichage ; useCallback rend la fonction renvoyée stable.
export function useRappelTemporise<A extends unknown[]>(rappel: (...args: A) => void, delai = 300) {
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dernierRappel = useRef(rappel);

  useEffect(() => {
    dernierRappel.current = rappel; // toujours la version la plus récente
  });

  useEffect(() => {
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current); // nettoyage à la disparition
    };
  }, []);

  return useCallback(
    (...args: A) => {
      if (minuteur.current) clearTimeout(minuteur.current);
      minuteur.current = setTimeout(() => dernierRappel.current(...args), delai);
    },
    [delai]
  );
}
