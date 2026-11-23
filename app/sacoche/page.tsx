"use client";

import Image from "next/image";
import Link from "next/link";
import BadgeType from "@/components/BadgeType";
import BoutonVider from "@/components/BoutonVider";
import Icone from "@/components/Icone";
import ListeSacocheReordonnable from "@/components/ListeSacocheReordonnable";
import TypesCouverts from "@/components/TypesCouverts";
import { useTypesCouverts } from "@/hooks/useTypesCouverts";
import { nomFrancais } from "@/lib/noms-fr";
import { LONGUEUR_SURNOM, TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

// ch. 9 — page client : la sacoche n'existe que dans le navigateur.
// Direction « Album » : six emplacements numérotés, les vides restent dessinés.
export default function PageSacoche() {
  const equipe = useSacoche((etat) => etat.equipe);
  const retirer = useSacoche((etat) => etat.retirer);
  const renommer = useSacoche((etat) => etat.renommer);
  // Valeurs dérivées, calculées à l'affichage et jamais stockées (bonus : hook useTypesCouverts).
  const typesCouverts = useTypesCouverts();
  const emplacementsLibres = TAILLE_SACOCHE - equipe.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-pixel text-3xl">Ma sacoche</h1>
        <BoutonVider />
      </div>
      <p className="mt-2 text-base text-doux dark:text-doux-sombre">
        {equipe.length} / {TAILLE_SACOCHE} Pokémon · {typesCouverts.length} type(s) couvert(s)
      </p>
      <TypesCouverts />

      {/* Bonus FR-040 — la liste (cartes <li>, glisser-déposer, « Monter » / « Descendre ») est dans
          ListeSacocheReordonnable ; le contenu de chaque carte reste écrit ici. */}
      <ListeSacocheReordonnable
        rendreMembre={(membre, i) => (
          <>
            {/* Refonte « Console de poche » : même bande que les cartes de la grille, avec le numéro
                d'emplacement (décoratif : l'ordre de la liste le donne déjà). */}
            <p aria-hidden="true" className="flex h-8 items-center bg-(--teinte) px-2 font-pixel text-base text-white">
              {i + 1}
            </p>
            <div className="relative aspect-square overflow-hidden bg-radial-[at_50%_35%] from-(--teinte)/30 to-(--teinte)/8">
              <Image src={membre.image} alt={nomFrancais(membre.id, membre.nom)} width={96} height={96} className="relative mx-auto size-full object-contain p-4 drop-shadow-lg" />
            </div>
            <div className="p-2">
              <label htmlFor={`surnom-${membre.id}`} className="text-xs font-semibold text-doux dark:text-doux-sombre">
                Surnom de {nomFrancais(membre.id, membre.nom)}
              </label>
              <input
                id={`surnom-${membre.id}`}
                value={membre.surnom}
                onChange={(e) => renommer(membre.id, e.target.value)}
                placeholder={nomFrancais(membre.id, membre.nom)}
                maxLength={LONGUEUR_SURNOM}
                className="mt-1 w-full rounded-md border border-black/10 bg-fond px-2 py-1 text-base font-bold capitalize
                           placeholder:text-doux placeholder:normal-case focus:border-pokedex focus:outline-none focus:ring-4 focus:ring-pokedex/20
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
              aria-label={`Retirer ${nomFrancais(membre.id, membre.nom)} de la sacoche`}
              // Posé sur la bande : icône blanche (≥ 4,6:1 sur les 18 teintes), focus blanc intérieur.
              className="absolute right-0 top-0 grid size-8 place-items-center rounded-md text-white transition-transform
                         hover:bg-white/15 active:scale-90 focus-visible:outline-2 focus-visible:-outline-offset-2
                         focus-visible:outline-white motion-reduce:transition-none"
            >
              <Icone nom="croix" className="size-4" />
            </button>
          </>
        )}
      >
        {/* ch. 9 — les emplacements libres sont dessinés : on voit d'un coup d'œil les places
            restantes, et chaque case vide ramène au Pokédex. */}
        {Array.from({ length: emplacementsLibres }, (_, i) => (
          <li key={`libre-${i}`}>
            <Link
              href="/"
              className="relative grid h-full min-h-48 place-items-center rounded-md border-2 border-dashed border-doux/50
                         text-doux hover:border-pokedex-texte hover:text-pokedex-texte focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-pokedex dark:border-doux-sombre/40 dark:text-doux-sombre dark:focus-visible:outline-pokedex-sombre
                         dark:hover:border-pokedex-sombre dark:hover:text-pokedex-sombre"
            >
              <span aria-hidden="true" className="font-pixel text-6xl leading-none tabular-nums opacity-30">
                {equipe.length + i + 1}
              </span>
              <span className="absolute inset-x-2 bottom-2 text-center text-xs font-semibold">Emplacement libre</span>
            </Link>
          </li>
        ))}
      </ListeSacocheReordonnable>
    </>
  );
}
