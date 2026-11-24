"use client";

import Link from "next/link";
import { useState } from "react";
import PorteMondePokemon, { type EtatJeuLocal } from "./PorteMondePokemon";
import { useCompteurClics } from "@/hooks/useCompteurClics";
import { creerCodeSacoche } from "@/lib/codeSacoche";
import { jeuLocalRepond, verificationPossible } from "@/lib/mondePokemon";
import { useSacoche } from "@/stores/sacoche";

// Bonus « Monde Pokémon » (spec 002) — pour tout le monde, le titre reste le lien d'accueil du
// cours. Un clic (ou Entrée, qui déclenche aussi `click` sur un lien) est compté ; la 5e activation
// en moins de 3 s ouvre la porte. C'est le seul morceau client de l'en-tête (« use client » au plus bas).
export default function LogoPokedex() {
  const compter = useCompteurClics();
  const [ouverte, setOuverte] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [nombreMembres, setNombreMembres] = useState(0);
  const [jeu, setJeu] = useState<EtatJeuLocal>("inconnu");

  function activer() {
    if (!compter()) return;
    // ch. 9 — lecture ponctuelle du store dans l'événement : pas d'abonnement, rien à redessiner.
    const equipe = useSacoche.getState().equipe;
    setNombreMembres(equipe.length);
    setCode(null);
    setOuverte(true);
    creerCodeSacoche(equipe).then(setCode, () => setCode(null));
    if (verificationPossible(window.location.hostname)) {
      setJeu("verification");
      jeuLocalRepond().then((repond) => setJeu(repond ? "present" : "absent"));
    } else {
      setJeu("inconnu");
    }
  }

  return (
    <>
      <Link
        href="/"
        onClick={activer}
        className="rounded-full py-2 text-base font-extrabold tracking-tight font-stretch-85% focus-visible:outline-2 focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre"
      >
        Mon Pokédex
      </Link>
      <PorteMondePokemon
        ouverte={ouverte}
        codeSacoche={code}
        nombreMembres={code ? nombreMembres : 0}
        jeu={jeu}
        onFermer={() => setOuverte(false)}
      />
    </>
  );
}
