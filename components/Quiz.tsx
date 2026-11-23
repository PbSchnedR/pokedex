"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { nomFrancais } from "@/lib/noms-fr";
import { verifierReponse } from "@/lib/quiz";
import type { Pokemon } from "@/types/pokemon";

// Bonus FR-038 (research R11) — « Qui est ce Pokémon ? » : silhouette, saisie libre, révélation.
type Etat =
  | { statut: "chargement" }
  | { statut: "erreur" }
  | { statut: "question"; pokemon: Pokemon }
  | { statut: "revele"; pokemon: Pokemon };

// ch. 11 — notre propre Route Handler (contracts/api-aleatoire.md) ; tout statut ≠ 2xx est un échec.
async function tirerPokemon(): Promise<Pokemon> {
  const reponse = await fetch("/api/aleatoire");
  if (!reponse.ok) throw new Error("Tirage impossible");
  return reponse.json();
}

const BOUTON =
  "rounded-md bg-pokedex px-4 py-2 text-base font-bold text-white transition-transform active:scale-95 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex " +
  "motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre";

export default function Quiz() {
  const [etat, setEtat] = useState<Etat>({ statut: "chargement" });
  const [saisie, setSaisie] = useState("");
  const [message, setMessage] = useState("");
  const idChamp = useId();
  const champ = useRef<HTMLInputElement>(null);
  // « Suivant » après la révélation, « Réessayer » après une panne : un seul de ces boutons existe.
  const action = useRef<HTMLButtonElement>(null);
  // Le focus ne bouge qu'après une action du joueur, pas au premier affichage de la page.
  const aJoue = useRef(false);

  // ch. 4 — premier tirage au montage, avec annulation si le composant disparaît entre-temps.
  useEffect(() => {
    let annule = false;
    tirerPokemon()
      .then((pokemon) => {
        if (!annule) setEtat({ statut: "question", pokemon });
      })
      .catch(() => {
        if (!annule) setEtat({ statut: "erreur" });
      });
    return () => {
      annule = true;
    };
  }, []);

  // ch. 11 — clavier : après la révélation (ou une panne), le focus va sur le bouton qui permet de
  // continuer ; à la question suivante, il revient dans le champ. Sans cela, il tomberait sur <body>
  // quand le bouton cliqué disparaît.
  useEffect(() => {
    if (!aJoue.current) return;
    if (etat.statut === "revele" || etat.statut === "erreur") action.current?.focus();
    if (etat.statut === "question") champ.current?.focus();
  }, [etat.statut]);

  const nouvelleQuestion = async () => {
    aJoue.current = true;
    setEtat({ statut: "chargement" });
    setSaisie("");
    setMessage("");
    try {
      setEtat({ statut: "question", pokemon: await tirerPokemon() });
    } catch {
      setEtat({ statut: "erreur" });
    }
  };

  if (etat.statut === "chargement") {
    return (
      <div className="mx-auto max-w-sm">
        <div className="mx-auto aspect-square max-w-52 animate-pulse rounded-md bg-surface shadow-sm sm:max-w-none ring-1 ring-black/5 motion-reduce:animate-none dark:bg-surface-sombre dark:ring-white/10" />
        <p className="mt-4 text-center text-base text-doux dark:text-doux-sombre">Tirage d&apos;un Pokémon…</p>
      </div>
    );
  }

  if (etat.statut === "erreur") {
    return (
      <div className="flex flex-col items-center gap-4 py-8" role="alert">
        <p className="text-base text-doux dark:text-doux-sombre">Impossible de tirer un Pokémon au sort.</p>
        <button ref={action} type="button" onClick={nouvelleQuestion} className={BOUTON}>
          Réessayer
        </button>
      </div>
    );
  }

  const { pokemon } = etat;
  const revele = etat.statut === "revele";
  const nomFr = nomFrancais(pokemon.id, pokemon.nom);

  const valider = (evenement: React.FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (revele) return;
    const verdict = verifierReponse(saisie, nomFr);
    aJoue.current = true;
    if (verdict === "vide") {
      setMessage("Écrivez un nom avant de valider.");
      champ.current?.focus();
      return;
    }
    setEtat({ statut: "revele", pokemon });
    setMessage(verdict === "juste" ? `Juste ! C'est bien ${nomFr}.` : `Faux, c'était ${nomFr}.`);
  };

  return (
    <div className="mx-auto max-w-sm">
      {/* Refonte « Console de poche » : silhouette réduite sur téléphone, pour que la question,
          le champ et « Valider » tiennent presque dans l'écran de la console. */}
      <div className="mx-auto max-w-52 rounded-md bg-surface p-2 shadow-sm ring-1 ring-black/5 sm:max-w-none dark:bg-surface-sombre dark:ring-white/10">
        {/* La clé remonte les deux calques à chaque tirage : la nouvelle image part masquée,
            sans rejouer la transition de la précédente. */}
        <div
          key={pokemon.id}
          className="relative aspect-square overflow-hidden rounded-sm bg-radial-[at_50%_40%] from-white to-fond
                     dark:from-doux-sombre/70 dark:to-doux-sombre/20"
        >
          {/* Cours, « Pour aller plus loin » : la silhouette est l'image elle-même en brightness-0.
              ch. 5 — révélation par l'opacité de deux calques superposés (< 0,5 s, motion-reduce). */}
          <Image
            src={pokemon.image}
            alt={revele ? "" : "Silhouette mystère"}
            width={400}
            height={400}
            loading="eager"
            className={`absolute inset-0 size-full object-contain p-6 brightness-0 transition-opacity duration-300
                        motion-reduce:transition-none ${revele ? "opacity-0" : "opacity-100"}`}
          />
          <Image
            src={pokemon.image}
            alt={revele ? nomFr : ""}
            width={400}
            height={400}
            loading="eager"
            className={`absolute inset-0 size-full object-contain p-6 drop-shadow-xl transition-opacity duration-300
                        motion-reduce:transition-none ${revele ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        <p className="p-2 text-xs font-semibold tabular-nums text-doux dark:text-doux-sombre">
          {revele ? `#${String(pokemon.id).padStart(3, "0")}` : "#???"}
        </p>
      </div>

      <form onSubmit={valider} noValidate className="mt-4 sm:mt-6">
        <label htmlFor={idChamp} className="text-sm font-semibold">
          Nom du Pokémon (en français)
        </label>
        <input
          ref={champ}
          id={idChamp}
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          readOnly={revele}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-describedby={`${idChamp}-message`}
          placeholder="ex. Pikachu"
          className="mt-1 w-full rounded-md border border-black/10 bg-surface px-4 py-2 text-base shadow-sm
                     placeholder:text-doux focus:border-pokedex focus:outline-none focus:ring-4
                     focus:ring-pokedex/20 dark:border-white/10 dark:bg-surface-sombre dark:placeholder:text-doux-sombre"
        />
        {/* ch. 11 — zone annoncée par les lecteurs d'écran : refus, puis verdict. */}
        <p
          id={`${idChamp}-message`}
          aria-live="polite"
          className="mt-2 min-h-6 text-base font-semibold text-encre dark:text-encre-sombre"
        >
          {message}
        </p>
        <div className="mt-4 flex justify-end">
          {revele ? (
            <button ref={action} type="button" onClick={nouvelleQuestion} className={BOUTON}>
              Suivant
            </button>
          ) : (
            <button type="submit" className={BOUTON}>
              Valider
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
