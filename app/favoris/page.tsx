"use client";

import Link from "next/link";
import GrillePokemons from "@/components/GrillePokemons";
import { usePokemons } from "@/hooks/usePokemons";
import { useFavoris } from "@/stores/favoris";

const TEXTE = "py-8 text-center text-base text-doux dark:text-doux-sombre";

// ch. 9 — le serveur ne connaît pas les favoris (ils sont dans le navigateur) : la page charge
// ses données côté navigateur, par le hook usePokemons (ch. 10).
export default function PageFavoris() {
  const noms = useFavoris((etat) => etat.noms);
  const { pokemons, etat } = usePokemons(noms); // ch. 10 — plus de useEffect dans la page

  return (
    <>
      <h1 className="font-pixel text-3xl">Mes favoris</h1>
      <div className="mt-6">
        {etat === "erreur" ? (
          <p className={TEXTE}>Impossible de charger vos favoris.</p>
        ) : etat === "chargement" ? (
          <p className={TEXTE}>Chargement de vos favoris…</p>
        ) : pokemons.length === 0 ? (
          <p className={TEXTE}>
            Aucun favori pour le moment. Cliquez sur une étoile dans le{" "}
            <Link href="/" className="font-semibold text-encre underline underline-offset-4 dark:text-encre-sombre">
              Pokédex
            </Link>
            .
          </p>
        ) : (
          <GrillePokemons pokemons={pokemons} />
        )}
      </div>
    </>
  );
}
