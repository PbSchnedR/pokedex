"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import BoutonVider from "@/components/BoutonVider";
import Icone from "@/components/Icone";
import { teinteType } from "@/lib/types";
import { LONGUEUR_SURNOM, TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

// ch. 9 — page client : la sacoche n'existe que dans le navigateur.
// Direction « Album » : six emplacements numérotés, les vides restent dessinés.
export default function PageSacoche() {
  const equipe = useSacoche((etat) => etat.equipe);
  const retirer = useSacoche((etat) => etat.retirer);
  const renommer = useSacoche((etat) => etat.renommer);
  // Valeurs dérivées, calculées à l'affichage et jamais stockées.
  const typesCouverts = [...new Set(equipe.flatMap((membre) => membre.types))];
  const emplacementsLibres = TAILLE_SACOCHE - equipe.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Ma sacoche</h1>
        <BoutonVider />
      </div>
      <p className="mt-2 text-base text-doux dark:text-doux-sombre">
        {equipe.length} / {TAILLE_SACOCHE} Pokémon · {typesCouverts.length} type(s) couvert(s)
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
        {equipe.map((membre, i) => (
          <li
            key={membre.id}
            style={{ "--teinte": teinteType(membre.types[0]) } as CSSProperties}
            className="relative flex flex-col rounded-2xl bg-surface p-2 shadow-sm ring-1 ring-black/5 dark:bg-surface-sombre dark:ring-white/10"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-radial-[at_50%_35%] from-(--teinte)/35 to-(--teinte)/10">
              <span aria-hidden="true" className="absolute -bottom-2 right-2 text-6xl leading-none font-extrabold tabular-nums font-stretch-75% text-(--teinte)/25">
                {i + 1}
              </span>
              <Image src={membre.image} alt={membre.nom} width={96} height={96} className="relative mx-auto size-full object-contain p-4 drop-shadow-lg" />
            </div>
            <div className="p-2">
              <label htmlFor={`surnom-${membre.id}`} className="text-xs font-semibold text-doux dark:text-doux-sombre">
                Surnom de <span className="capitalize">{membre.nom}</span>
              </label>
              <input
                id={`surnom-${membre.id}`}
                value={membre.surnom}
                onChange={(e) => renommer(membre.id, e.target.value)}
                placeholder={membre.nom}
                maxLength={LONGUEUR_SURNOM}
                className="mt-1 w-full rounded-full border border-black/10 bg-fond px-2 py-1 text-base font-bold capitalize
                           placeholder:text-doux focus:border-pokedex focus:outline-none focus:ring-4 focus:ring-pokedex/20
                           dark:border-white/10 dark:bg-fond-sombre dark:placeholder:text-doux-sombre"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {membre.types.map((type) => (
                  <BadgeType key={type} type={type} />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => retirer(membre.id)}
              aria-label={`Retirer ${membre.nom} de la sacoche`}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-surface text-doux shadow-sm
                         transition-transform hover:text-pokedex active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-pokedex motion-reduce:transition-none dark:bg-surface-sombre dark:text-doux-sombre dark:focus-visible:outline-pokedex-sombre
                         dark:hover:text-pokedex-sombre"
            >
              <Icone nom="croix" className="size-4" />
            </button>
          </li>
        ))}
        {/* ch. 9 — les emplacements libres sont dessinés : on voit d'un coup d'œil les places
            restantes, et chaque case vide ramène au Pokédex. */}
        {Array.from({ length: emplacementsLibres }, (_, i) => (
          <li key={`libre-${i}`}>
            <Link
              href="/"
              className="relative grid h-full min-h-48 place-items-center rounded-2xl border-2 border-dashed border-doux/40
                         text-doux hover:border-pokedex hover:text-pokedex focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-pokedex dark:border-doux-sombre/40 dark:text-doux-sombre dark:focus-visible:outline-pokedex-sombre
                         dark:hover:border-pokedex-sombre dark:hover:text-pokedex-sombre"
            >
              <span aria-hidden="true" className="text-6xl leading-none font-extrabold tabular-nums opacity-30 font-stretch-75%">
                {equipe.length + i + 1}
              </span>
              <span className="absolute inset-x-2 bottom-2 text-center text-xs font-semibold">Emplacement libre</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
