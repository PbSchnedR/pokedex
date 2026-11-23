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
import GrillePokemons from "@/components/GrillePokemons";
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

  const evolutions = await recupererPlusieurs(await recupererEvolutions(pokemon.id));
  const chiffres = String(pokemon.id).padStart(3, "0");
  const teinte = { "--teinte": teinteType(pokemon.types[0]) } as CSSProperties;

  return (
    <article style={teinte} className="grid gap-8 md:grid-cols-[2fr_3fr]">
      {/* Vignette inclinée de 1° à l'arrêt (direction « Album »), redressée si l'on réduit les animations. */}
      <div className="relative self-start -rotate-1 rounded-2xl bg-surface p-2 shadow-md ring-1 ring-black/5 motion-reduce:rotate-0 dark:bg-surface-sombre dark:ring-white/10">
        <div className="relative overflow-hidden rounded-xl bg-radial-[at_50%_35%] from-(--teinte)/40 to-(--teinte)/10">
          <span
            aria-hidden="true"
            className="absolute -bottom-4 right-2 text-9xl leading-none font-extrabold tracking-tight tabular-nums font-stretch-75% text-(--teinte)/25"
          >
            {chiffres}
          </span>
          <Image
            src={pokemon.image}
            alt={pokemon.nom}
            width={400}
            height={400}
            loading="eager"
            className="relative mx-auto aspect-square w-full object-contain p-6 drop-shadow-xl"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold tabular-nums text-doux dark:text-doux-sombre">#{chiffres}</p>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight capitalize font-stretch-85%">{pokemon.nom}</h1>
          <BoutonFavori nom={pokemon.nom} />
        </div>
        <div className="mt-2 flex gap-2">
          {pokemon.types.map((type) => (
            <BadgeType key={type} type={type} />
          ))}
        </div>
        <dl className="mt-4 flex gap-4">
          <div className="rounded-2xl bg-surface px-4 py-2 ring-1 ring-black/5 dark:bg-surface-sombre dark:ring-white/10">
            <dt className="text-xs font-semibold text-doux dark:text-doux-sombre">Taille</dt>
            <dd className="text-base font-bold">{nombre(pokemon.taille)} m</dd>
          </div>
          <div className="rounded-2xl bg-surface px-4 py-2 ring-1 ring-black/5 dark:bg-surface-sombre dark:ring-white/10">
            <dt className="text-xs font-semibold text-doux dark:text-doux-sombre">Poids</dt>
            <dd className="text-base font-bold">{nombre(pokemon.poids)} kg</dd>
          </div>
        </dl>
        <h2 className="mt-6 text-base font-bold">Statistiques de base</h2>
        <div className="mt-2">
          <BarresStats stats={pokemon.stats} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <BoutonSacoche pokemon={pokemon} />
          {/* FR-035 — un lien (navigation), pas un bouton ; contour, comme le prévoit la direction « Album ». */}
          <Link
            href={`/comparer?a=${pokemon.nom}`}
            className="rounded-full border-2 border-pokedex px-4 py-2 text-base font-bold text-pokedex transition-transform hover:bg-pokedex/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex active:scale-95 motion-reduce:transition-none dark:border-pokedex-sombre dark:text-pokedex-sombre dark:focus-visible:outline-pokedex-sombre"
          >
            Comparer
          </Link>
        </div>
      </div>

      <section className="md:col-span-2">
        <h2 className="mb-4 text-base font-bold">Évolutions</h2>
        <GrillePokemons pokemons={evolutions} titre="h3" />
      </section>
    </article>
  );
}

// ch. 8 — titre propre à chaque fiche ; grâce au cache, l'API n'est appelée qu'une fois pour la
// fiche et ses métadonnées.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  if (!pokemon) return { title: "Pokémon introuvable" };
  const titre = pokemon.nom.charAt(0).toUpperCase() + pokemon.nom.slice(1);
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
