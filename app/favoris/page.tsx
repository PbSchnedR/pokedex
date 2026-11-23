"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GrillePokemons from "@/components/GrillePokemons";
import { chargerPokemon } from "@/lib/pokeapi-client";
import { useFavoris } from "@/stores/favoris";
import type { Pokemon } from "@/types/pokemon";

const TEXTE = "py-8 text-center text-base text-doux dark:text-doux-sombre";

// ch. 9 — le serveur ne connaît pas les favoris (ils sont dans le navigateur) : la page charge
// ses données côté navigateur, sur le modèle du ch. 4 (effet + annulation).
export default function PageFavoris() {
  const noms = useFavoris((etat) => etat.noms);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [etat, setEtat] = useState<"chargement" | "pret" | "erreur">("chargement");

  useEffect(() => {
    let annule = false; // ignore une réponse arrivée après un nouveau changement de favoris
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

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Mes favoris</h1>
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
