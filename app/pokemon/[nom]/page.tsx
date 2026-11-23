import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BadgeType from "@/components/BadgeType";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import Fleches from "@/components/Fleches";
import GrillePokemons from "@/components/GrillePokemons";
import { nomFrancaisDepuisNom } from "@/lib/noms-fr";
import { teinteType } from "@/lib/types";
import {
  recupererEvolutions,
  recupererPlusieurs,
  recupererPokemon,
  recupererTousLesNoms,
} from "@/lib/pokeapi";

type Props = {
  params: Promise<{ nom: string }>;
};

const nombre = (valeur: number) => valeur.toLocaleString("fr-FR");

// ch. 8 — la page n'est pas async : le nom n'est connu qu'à la visite (donnée propre à la
// requête), il est donc lu sous <Suspense> par Fiche, et le reste de la page part tout de suite.
export default function PageFiche({ params }: Props) {
  return (
    <Suspense fallback={<p className="py-20 text-center text-base text-doux dark:text-doux-sombre">Chargement de la fiche…</p>}>
      <Fiche params={params} />
    </Suspense>
  );
}

async function Fiche({ params }: Props) {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  // ch. 8 — nom inconnu → page 404 (not-found.tsx) ; une panne de l'API, elle, lève une erreur
  // attrapée par error.tsx.
  if (!pokemon) notFound();

  // Refonte « Console de poche » — les touches fléchées de la coque feuillettent la fiche :
  // Pokémon précédent et suivant dans l'ordre des numéros (liste en cache, ch. 7 / ch. 9).
  const [evolutions, noms] = await Promise.all([
    recupererEvolutions(pokemon.id).then(recupererPlusieurs),
    recupererTousLesNoms(),
  ]);
  const rang = noms.indexOf(pokemon.nom);
  const voisin = (i: number) =>
    rang >= 0 && noms[i]
      ? { href: `/pokemon/${noms[i]}`, libelle: `${i < rang ? "Pokémon précédent" : "Pokémon suivant"} : ${nomFrancaisDepuisNom(noms[i])}` }
      : null;
  const chiffres = String(pokemon.id).padStart(3, "0");
  const teinte = { "--teinte": teinteType(pokemon.types[0]) } as CSSProperties;

  return (
    <article style={teinte}>
      {/* @container : les deux colonnes dépendent de la largeur de l'écran de la console, pas de
          la fenêtre. Les flèches (position fixe) restent hors de ce conteneur. */}
      <div className="@container">
        <div className="grid gap-6 @min-[40rem]:grid-cols-[2fr_3fr]">
          {/* Fiche de l'illustration : même bande que les cartes de la grille. */}
          <div className="self-start overflow-hidden rounded-md bg-surface shadow-sm ring-1 ring-black/10 dark:bg-surface-sombre dark:ring-white/10">
            {/* Le numéro lisible (« #025 », ch. 2), blanc sur la teinte du type. */}
            <p className="flex h-9 items-center bg-(--teinte) px-3 font-pixel text-xl text-white tabular-nums">
              #{chiffres}
            </p>
            <div className="relative overflow-hidden bg-radial-[at_50%_35%] from-(--teinte)/35 to-(--teinte)/8">
              <span
                aria-hidden="true"
                className="absolute -bottom-2 right-2 font-pixel text-8xl leading-none tabular-nums text-(--teinte)/20"
              >
                {chiffres}
              </span>
              <Image
                src={pokemon.image}
                alt={pokemon.nomFr}
                width={400}
                height={400}
                loading="eager"
                className="relative mx-auto aspect-square w-full max-w-56 object-contain p-4 @min-[40rem]:max-w-80 @min-[40rem]:p-6 drop-shadow-xl"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="font-pixel text-3xl">{pokemon.nomFr}</h1>
              <BoutonFavori nom={pokemon.nom} libelle={pokemon.nomFr} />
            </div>
            <div className="mt-2 flex gap-2">
              {pokemon.types.map((type) => (
                <BadgeType key={type} type={type} />
              ))}
            </div>
            {/* Taille et poids : deux petits afficheurs, chiffres en police pixel. */}
            <dl className="mt-4 grid max-w-xs grid-cols-2 gap-3">
              <div className="rounded-md bg-surface px-3 py-2 ring-1 ring-black/10 dark:bg-surface-sombre dark:ring-white/10">
                <dt className="text-xs font-semibold text-doux dark:text-doux-sombre">Taille</dt>
                <dd className="font-pixel text-xl">{nombre(pokemon.taille)} m</dd>
              </div>
              <div className="rounded-md bg-surface px-3 py-2 ring-1 ring-black/10 dark:bg-surface-sombre dark:ring-white/10">
                <dt className="text-xs font-semibold text-doux dark:text-doux-sombre">Poids</dt>
                <dd className="font-pixel text-xl">{nombre(pokemon.poids)} kg</dd>
              </div>
            </dl>
            <h2 className="mt-6 font-pixel text-xl">Statistiques de base</h2>
            <div className="mt-2">
              <BarresStats stats={pokemon.stats} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <BoutonSacoche pokemon={pokemon} />
              {/* FR-035 — un lien (navigation), pas un bouton ; bouton d'écran à contour. */}
              <Link
                href={`/comparer?a=${pokemon.nom}`}
                className="rounded-md border-2 border-pokedex-texte px-4 py-2 text-base font-bold text-pokedex-texte transition-transform hover:bg-pokedex/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex active:scale-95 motion-reduce:transition-none dark:border-pokedex-sombre dark:text-pokedex-sombre dark:focus-visible:outline-pokedex-sombre"
              >
                Comparer
              </Link>
            </div>
          </div>

          <section className="@min-[40rem]:col-span-2">
            <h2 className="mb-3 font-pixel text-xl">Évolutions</h2>
            <GrillePokemons pokemons={evolutions} titre="h3" />
          </section>
        </div>
      </div>
      <nav aria-label="Pokémon voisins">
        <Fleches precedent={voisin(rang - 1)} suivant={voisin(rang + 1)} affichage={`#${chiffres}`} lecture={`Fiche n° ${pokemon.id}`} />
      </nav>
    </article>
  );
}

// ch. 8 — titre propre à chaque fiche ; grâce au cache, l'API n'est appelée qu'une fois pour la
// fiche et ses métadonnées.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  if (!pokemon) return { title: "Pokémon introuvable" };
  const titre = pokemon.nomFr; // bonus FR-033 — « Salamèche · Pokédex » (gabarit du layout)
  return {
    title: titre,
    description: `${titre} : types, statistiques et évolutions.`,
    openGraph: { images: [pokemon.image] },
  };
}


// ch. 8, étape 12 — les 151 premiers Pokémon sont construits au build.
export async function generateStaticParams() {
  const noms = await recupererTousLesNoms();
  return noms.slice(0, 151).map((nom) => ({ nom }));
}
