import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { teinteType } from "@/lib/types";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";

// Composant serveur. Direction « Album à compléter » (T012) : une vignette au cadre blanc.
// ch. 11 — niveau de titre réglable : <h2> dans une grille de page, <h3> sous la section
// « Évolutions » (<h2>) de la fiche, pour garder des titres dans l'ordre.
export default function CartePokemon({ pokemon, titre: Titre = "h2" }: { pokemon: Pokemon; titre?: "h2" | "h3" }) {
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
      {/* Tout le contenu mène à la fiche. */}
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
            alt={pokemon.nomFr}
            width={160}
            height={160}
            className="relative mx-auto size-full object-contain p-4 drop-shadow-lg transition-transform duration-300 ease-out
                       group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="p-2">
          <p className="text-xs font-semibold tabular-nums text-doux dark:text-doux-sombre">{numero}</p>
          <Titre className="truncate text-base font-bold">{pokemon.nomFr}</Titre>
          <div className="mt-2 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <BadgeType key={type} type={type} />
            ))}
          </div>
        </div>
      </Link>
      {/* ch. 9 — un bouton dans un lien pose un problème d'accessibilité et de clic : il est
          hors du Link, positionné sur la carte (relative). */}
      <BoutonFavori nom={pokemon.nom} libelle={pokemon.nomFr} className="absolute right-4 top-4 z-10" />
    </article>
  );
}
