"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import ResultatCombat from "@/components/ResultatCombat";
import { combattre } from "@/lib/combat";
import { lireAdversaire, NUMERO_MAX } from "@/lib/parametres";
import { chargerPokemon } from "@/lib/pokeapi-client";
import { useSacoche } from "@/stores/sacoche";
import type { Pokemon } from "@/types/pokemon";

const TEXTE = "py-8 text-center text-base text-doux dark:text-doux-sombre";

// Bonus FR-039 (research R10) — tirage de la sacoche adverse : `taille` numéros distincts.
// Appelé seulement dans un effet ou un clic, jamais pendant le rendu (sinon le HTML du serveur
// et celui du navigateur différeraient).
function tirerAdversaire(taille: number): string {
  const ids = new Set<number>();
  while (ids.size < taille) ids.add(1 + Math.floor(Math.random() * NUMERO_MAX));
  return [...ids].join(",");
}

// ch. 10 — useSyncExternalStore (modèle de useEstMonte) : vaut false sur le serveur et pendant
// l'hydratation, puis suit `persist` de Zustand. Sans lui, la sacoche paraît vide au premier
// affichage (skipHydration) : on montrerait « sacoche vide » le temps d'un éclair.
const sAbonnerHydratation = (rappel: () => void) => useSacoche.persist.onFinishHydration(rappel);
// Stockage indisponible (navigation privée stricte…) : `persist` n'hydrate jamais ; la sacoche
// est alors vide (contracts/stockage-local.md) et non « en chargement » pour toujours.
const estHydratee = () => useSacoche.persist.hasHydrated() || !useSacoche.persist.getOptions().storage;
const surServeur = () => false;

type Equipes = { cle: string; equipeA: Pokemon[]; equipeB: Pokemon[] };

const chargerEquipe = async (ids: number[]): Promise<Pokemon[]> => {
  const pokemons = await Promise.all(ids.map((id) => chargerPokemon(String(id))));
  // 404 → null (ch. 7) : impossible pour un numéro validé entre 1 et 1 025, traité en erreur.
  if (pokemons.some((p) => p === null)) throw new Error("Pokémon introuvable");
  return pokemons as Pokemon[];
};

function Combat() {
  const router = useRouter();
  const parametres = useSearchParams();
  const hydratee = useSyncExternalStore(sAbonnerHydratation, estHydratee, surServeur);
  const equipe = useSacoche((etat) => etat.equipe);

  // ch. 9 — l'adresse est non fiable : validée, puis ramenée à la taille de la sacoche.
  // Une liste plus courte que la sacoche ne permet pas un combat à armes égales (FR-039) :
  // elle est traitée comme invalide.
  const brut = parametres.get("adversaire");
  const valides = lireAdversaire(parametres.getAll("adversaire"));
  const taille = equipe.length;
  const adversaire = valides !== null && valides.length >= taille ? valides.slice(0, taille) : null;
  // Chaînes (et non tableaux) pour les dépendances des effets : stables d'un rendu à l'autre.
  const cleAdversaire = adversaire?.join(",") ?? "";
  const cleEquipe = equipe.map((membre) => membre.id).join(",");
  const cle = `${cleEquipe}|${cleAdversaire}`;

  // Adresse absente, invalide ou trop longue → adresse corrigée sans entrée d'historique.
  useEffect(() => {
    if (!hydratee || taille === 0) return;
    if (cleAdversaire === "") router.replace(`/combat?adversaire=${tirerAdversaire(taille)}`);
    else if (brut !== cleAdversaire) router.replace(`/combat?adversaire=${cleAdversaire}`);
  }, [hydratee, taille, brut, cleAdversaire, router]);

  // ch. 9 — chargement côté navigateur, modèle de la page Favoris (effet + annulation).
  // Le résultat garde la clé qui l'a produit : une autre clé = chargement en cours, sans
  // remettre un état à zéro dans l'effet.
  const [equipes, setEquipes] = useState<Equipes | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!hydratee || cleEquipe === "" || cleAdversaire === "") return;
    let annule = false; // ignore une réponse arrivée après un changement d'adversaire
    Promise.all([chargerEquipe(cleEquipe.split(",").map(Number)), chargerEquipe(cleAdversaire.split(",").map(Number))])
      .then(([equipeA, equipeB]) => {
        if (!annule) setEquipes({ cle: `${cleEquipe}|${cleAdversaire}`, equipeA, equipeB });
      })
      .catch(() => {
        if (!annule) setErreur(`${cleEquipe}|${cleAdversaire}`);
      });
    return () => {
      annule = true;
    };
  }, [hydratee, cleEquipe, cleAdversaire]);

  if (!hydratee) return <p className={TEXTE}>Chargement de votre sacoche…</p>;
  if (taille === 0) {
    return (
      <p className={TEXTE}>
        Votre sacoche est vide : ajoutez au moins un Pokémon depuis le{" "}
        <Link href="/" className="font-semibold text-encre underline underline-offset-4 dark:text-encre-sombre">
          Pokédex
        </Link>{" "}
        pour combattre.
      </p>
    );
  }
  // Un clic, mais pas un Link (ch. 10) : la destination est tirée au hasard au moment du clic.
  // push et non replace : « Précédent » ramène au combat d'avant.
  const nouvelAdversaire = (
    <button
      type="button"
      onClick={() => router.push(`/combat?adversaire=${tirerAdversaire(taille)}`)}
      className="rounded-full bg-pokedex px-4 py-2 text-base font-bold text-white transition-transform active:scale-95
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex
                 motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre"
    >
      Nouvel adversaire
    </button>
  );

  if (erreur === cle) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-base text-doux dark:text-doux-sombre">Impossible de charger le combat.</p>
        {nouvelAdversaire}
      </div>
    );
  }
  if (equipes?.cle !== cle) return <p className={TEXTE}>Préparation du combat…</p>;

  return <ResultatCombat resultat={combattre(equipes.equipeA, equipes.equipeB)}>{nouvelAdversaire}</ResultatCombat>;
}

export default function PageCombat() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Combat</h1>
      <p className="mt-2 max-w-prose text-base text-doux dark:text-doux-sombre">
        Votre sacoche affronte une sacoche adverse du même nombre de Pokémon, en duels dans l&apos;ordre.
        Chaque score est le total des statistiques de base, multiplié par l&apos;avantage de type.
      </p>
      <div className="mt-6">
        {/* ch. 10 — useSearchParams demande toujours un Suspense. */}
        <Suspense fallback={<p className={TEXTE}>Chargement de votre sacoche…</p>}>
          <Combat />
        </Suspense>
      </div>
    </>
  );
}
