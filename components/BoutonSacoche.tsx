"use client";

import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

const BASE =
  "rounded-full px-4 py-2 text-base font-bold transition-transform active:scale-95 focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-pokedex motion-reduce:transition-none " +
  "dark:focus-visible:outline-pokedex-sombre";

// ch. 9 — la fiche (serveur) passe l'objet pokemon, des données simples, à ce composant client.
// Le bouton reflète la règle ; c'est l'action `ajouter` du store qui la garantit.
export default function BoutonSacoche({ pokemon }: { pokemon: Pokemon }) {
  const dedans = useSacoche((etat) => etat.equipe.some((m) => m.id === pokemon.id));
  const pleine = useSacoche((etat) => etat.equipe.length >= TAILLE_SACOCHE); // dérivé, jamais stocké
  const ajouter = useSacoche((etat) => etat.ajouter);
  const retirer = useSacoche((etat) => etat.retirer);

  if (dedans) {
    return (
      <button
        type="button"
        onClick={() => retirer(pokemon.id)}
        className={`${BASE} border-2 border-pokedex text-pokedex hover:bg-pokedex/10 dark:border-pokedex-sombre dark:text-pokedex-sombre`}
      >
        Retirer de la sacoche
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => ajouter(pokemon)}
      disabled={pleine}
      className={`${BASE} bg-pokedex text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {pleine ? `Sacoche pleine (${TAILLE_SACOCHE}/${TAILLE_SACOCHE})` : "Ajouter à la sacoche"}
    </button>
  );
}
