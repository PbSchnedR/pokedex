"use client";

import { useEffect, useState } from "react";
import { chargerPokemon } from "@/lib/pokeapi-client";
import type { Pokemon } from "@/types/pokemon";

type Etat = "chargement" | "pret" | "erreur";

// ch. 10 — la logique de chargement côté navigateur (effet + annulation, ch. 4) rangée dans un
// hook : la page Favoris n'a plus de useEffect.
export function usePokemons(noms: string[]) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [etat, setEtat] = useState<Etat>("chargement");

  useEffect(() => {
    let annule = false; // une réponse arrivée après un changement de `noms` est ignorée
    Promise.all(noms.map(chargerPokemon))
      .then((resultats) => {
        if (annule) return;
        setPokemons(resultats.filter((p): p is Pokemon => p !== null));
        setEtat("pret");
      })
      .catch(() => {
        if (!annule) setEtat("erreur");
      });
    return () => {
      annule = true;
    };
  }, [noms]);

  return { pokemons, etat };
}
