"use client";

import { useEffect } from "react";
import { useFavoris } from "@/stores/favoris";

// ch. 9 — le piège de l'hydratation : on relit localStorage dans un effet, donc après le
// premier affichage, identique au HTML du serveur.
export default function HydratationStores() {
  useEffect(() => {
    useFavoris.persist.rehydrate();
  }, []);
  return null;
}
