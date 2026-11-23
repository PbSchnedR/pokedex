import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { teinteType } from "@/lib/types";
import BadgeType from "./BadgeType";

// Composant serveur. Direction « Album à compléter » (T012) : une vignette au cadre blanc.
export default function CartePokemon({ pokemon }: { pokemon: Pokemon }) {
  const chiffres = String(pokemon.id).padStart(3, "0");
  const numero = `#${chiffres}`;
  // ch. 5 — la teinte du type principal passe par une variable CSS locale, lue par les classes.
  const teinte = { "--teinte": teinteType(pokemon.types[0]) } as CSSProperties;

  return (
    <article
      style={teinte}
      className="carte group relative h-full animate-apparition rounded-2xl bg-surface p-2 shadow-sm ring-1 ring-black/5
                 transition-transform duration-200 ease-out hover:-translate-y-1 hover:-rotate-1 focus-within:-translate-y-1
                 motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0
                 motion-reduce:hover:rotate-0 motion-reduce:focus-within:translate-y-0
                 dark:bg-surface-sombre dark:ring-white/10"
    >
      {/* Tout le contenu mène à la fiche ; les futurs boutons (favori, sacoche) resteront hors
          du lien, positionnés sur la carte (relative). */}
      <Link
        href={`/pokemon/${pokemon.nom}`}
        className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4
                   focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-radial-[at_50%_35%] from-(--teinte)/35 to-(--teinte)/10">
          {/* Numéro en filigrane : décoratif, le numéro lisible est plus bas. */}
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-2 text-7xl leading-none font-extrabold tracking-tight tabular-nums font-stretch-75% text-(--teinte)/25"
          >
            {chiffres}
          </span>
          <Image
            src={pokemon.image}
            alt={pokemon.nom}
            width={160}
            height={160}
            className="relative mx-auto size-full object-contain p-4 drop-shadow-lg transition-transform duration-300 ease-out
                       group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="p-2">
          <p className="text-xs font-semibold tabular-nums text-doux dark:text-doux-sombre">{numero}</p>
          <h2 className="truncate text-base font-bold capitalize">{pokemon.nom}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <BadgeType key={type} type={type} />
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
