"use client";

import Link from "next/link";
import { TAILLE_SACOCHE, useSacoche } from "@/stores/sacoche";

type Props = { className: string };

// ch. 9 — six pastilles pleines ou vides. Le sélecteur renvoie un nombre : l'indicateur ne se
// réaffiche que si la taille de l'équipe change (pas quand on modifie un surnom).
// Direction « Album » : c'est le lien « Sacoche » de la navigation lui-même.
export default function IndicateurSacoche({ className }: Props) {
  const nombre = useSacoche((etat) => etat.equipe.length);
  return (
    <Link
      href="/sacoche"
      aria-label={`Sacoche : ${nombre} Pokémon sur ${TAILLE_SACOCHE}`}
      className={`${className} inline-flex items-center gap-2`}
    >
      Sacoche
      {/* Téléphone : « 3/6 » ; dès sm : les six pastilles. */}
      <span className="text-xs font-bold tabular-nums sm:hidden">
        {nombre}/{TAILLE_SACOCHE}
      </span>
      <span className="hidden items-center gap-1 sm:flex">
        {Array.from({ length: TAILLE_SACOCHE }, (_, i) => (
          <span
            key={i}
            className={`size-2 rounded-full ${i < nombre ? "bg-pokedex dark:bg-pokedex-sombre" : "bg-doux/30 dark:bg-doux-sombre/40"}`}
          />
        ))}
      </span>
    </Link>
  );
}
