import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Pokemon } from "@/types/pokemon";
import { teinteType } from "@/lib/types";
import AjoutRapide from "./AjoutRapide";
import BadgeType from "./BadgeType";
import BoutonFavori from "./BoutonFavori";

// Composant serveur. Refonte « Console de poche » : une fiche de registre affichée sur l'écran.
// Bande à la teinte du type (numéro « #025 » en police pixel, ajout rapide, étoile), champ de
// l'illustration teinté, puis nom et types. « Le physique est arrondi, l'affichage est net » :
// les fiches de l'écran ont de petits arrondis, la coque et ses touches de grands.
// ch. 11 — niveau de titre réglable : <h2> dans une grille de page, <h3> sous la section
// « Évolutions » (<h2>) de la fiche, pour garder des titres dans l'ordre.
export default function CartePokemon({
  pokemon,
  titre: Titre = "h2",
  prioritaire = false,
}: {
  pokemon: Pokemon;
  titre?: "h2" | "h3";
  prioritaire?: boolean;
}) {
  const chiffres = String(pokemon.id).padStart(3, "0");
  const numero = `#${chiffres}`;
  // ch. 5 — la teinte du type principal passe par une variable CSS locale, lue par les classes.
  const teinte = { "--teinte": teinteType(pokemon.types[0]) } as CSSProperties;

  return (
    <article
      style={teinte}
      className="carte group relative h-full animate-apparition rounded-md bg-surface shadow-sm ring-1 ring-black/10
                 transition-transform duration-200 ease-out hover:-translate-y-1 focus-within:-translate-y-1
                 motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0
                 motion-reduce:focus-within:translate-y-0 dark:bg-surface-sombre dark:ring-white/10"
    >
      {/* Tout le contenu mène à la fiche. */}
      <Link
        href={`/pokemon/${pokemon.nom}`}
        className="block h-full overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre"
      >
        {/* Bande : le numéro lisible (FR-002), blanc sur la teinte (≥ 4,6:1 pour les 18 types). */}
        <p className="flex h-8 items-center bg-(--teinte) px-2 font-pixel text-base text-white tabular-nums">{numero}</p>
        <div className="relative aspect-square overflow-hidden bg-radial-[at_50%_35%] from-(--teinte)/30 to-(--teinte)/8">
          {/* Numéro en filigrane : décoratif, le numéro lisible est dans la bande. */}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 right-1 font-pixel text-6xl leading-none tabular-nums text-(--teinte)/20"
          >
            {chiffres}
          </span>
          <Image
            src={pokemon.image}
            alt={pokemon.nomFr}
            width={160}
            height={160}
            // ch. 11 — mesure Lighthouse (T076) : l'image LCP de la grille était chargée en différé.
            // Les premières cartes, visibles sans défiler, sont chargées tout de suite.
            loading={prioritaire ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 160px, (min-width: 640px) 30vw, 45vw"
            className="relative mx-auto size-full object-contain p-3 drop-shadow-lg transition-transform duration-300 ease-out
                       group-hover:scale-108 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="p-2">
          <Titre className="truncate text-base font-bold">{pokemon.nomFr}</Titre>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <BadgeType key={type} type={type} />
            ))}
          </div>
        </div>
      </Link>
      {/* ch. 9 — un bouton dans un lien pose un problème d'accessibilité et de clic : les deux
          boutons sont hors du Link, posés sur la bande. Bonus FR-034 — seuls les champs d'un
          membre traversent la frontière serveur → client (pas les statistiques). */}
      <div className="absolute right-0 top-0 z-10 flex h-8 items-center">
        <AjoutRapide
          pokemon={{ id: pokemon.id, nom: pokemon.nom, image: pokemon.image, types: pokemon.types }}
          libelle={pokemon.nomFr}
        />
        <BoutonFavori nom={pokemon.nom} libelle={pokemon.nomFr} surBande />
      </div>
    </article>
  );
}
