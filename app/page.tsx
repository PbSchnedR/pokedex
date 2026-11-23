import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import { CLASSES_CHAMP } from "@/components/classes";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import Icone from "@/components/Icone";
import SqueletteGrille from "@/components/SqueletteGrille";
import { bornerPage, lireFiltres, PAR_PAGE, type ParametresRecherche } from "@/lib/parametres";
import { recupererNomsParType, recupererPlusieurs, recupererTousLesNoms } from "@/lib/pokeapi";

type Props = {
  searchParams: Promise<ParametresRecherche>;
};

// ch. 9 — la page n'est pas async : les paramètres de l'adresse ne sont connus qu'à la visite,
// ils sont lus sous <Suspense> par Resultats ; le titre et la recherche partent tout de suite.
export default function Accueil({ searchParams }: Props) {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Pokédex</h1>
      <div className="mt-4 md:w-80">
        <Suspense fallback={<ChampInactif />}>
          <BarreRecherche />
        </Suspense>
      </div>
      <Suspense fallback={<div className="mt-6"><SqueletteGrille /></div>}>
        <Resultats searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function ChampInactif() {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-doux dark:text-doux-sombre">
        <Icone nom="loupe" className="size-4" />
      </span>
      <input disabled placeholder="Rechercher un Pokémon" aria-label="Rechercher un Pokémon" className={CLASSES_CHAMP} />
    </div>
  );
}

async function Resultats({ searchParams }: Props) {
  const parametres = await searchParams;
  // ch. 9 — tout ce qui vient de l'adresse est validé (lib/parametres.ts, testé).
  const { q, texte, type } = lireFiltres(parametres);
  // Ordre des numéros conservé : aucune recherche ne trie par nom (clarification « Analyse »).
  let noms = type ? await recupererNomsParType(type) : await recupererTousLesNoms();
  if (texte) noms = noms.filter((nom) => nom.includes(texte));
  const { pageCourante, nombrePages } = bornerPage(parametres.page, noms.length);
  // Seuls les 24 Pokémon visibles sont chargés en détail.
  const visibles = noms.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);
  const pokemons = await recupererPlusieurs(visibles);

  return (
    <>
      <div className="mt-2">
        <FiltreTypes q={q} typeActif={type} />
      </div>
      <p className="mt-2 text-base text-doux dark:text-doux-sombre">{noms.length.toLocaleString("fr-FR")} Pokémon</p>
      <div className="mt-4">
        {noms.length === 0 ? (
          <p className="py-8 text-center text-base text-doux dark:text-doux-sombre">
            Aucun Pokémon ne correspond à cette recherche.
          </p>
        ) : (
          <GrillePokemons pokemons={pokemons} />
        )}
      </div>
      <Pagination page={pageCourante} nombrePages={nombrePages} q={q} type={type} />
    </>
  );
}
