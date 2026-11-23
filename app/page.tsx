import { Suspense } from "react";
import BarreRecherche from "@/components/BarreRecherche";
import { CLASSES_CHAMP } from "@/components/classes";
import FiltreTypes from "@/components/FiltreTypes";
import GrillePokemons from "@/components/GrillePokemons";
import Pagination from "@/components/Pagination";
import SelecteurTri from "@/components/SelecteurTri";
import Icone from "@/components/Icone";
import SqueletteGrille from "@/components/SqueletteGrille";
import { nomFrancaisDepuisNom } from "@/lib/noms-fr";
import { bornerPage, lireFiltres, lireTri, PAR_PAGE, type ParametresRecherche } from "@/lib/parametres";
import { recupererNomsParType, recupererPlusieurs, recupererTousLesNoms } from "@/lib/pokeapi";
import { normaliser } from "@/lib/texte";

type Props = {
  searchParams: Promise<ParametresRecherche>;
};

// ch. 9 — la page n'est pas async : les paramètres de l'adresse ne sont connus qu'à la visite,
// ils sont lus sous <Suspense> par Resultats ; le titre et la recherche partent tout de suite.
export default function Accueil({ searchParams }: Props) {
  return (
    <>
      <h1 className="font-pixel text-3xl">Pokédex</h1>
      <div className="mt-4 md:w-80">
        <Suspense fallback={<ChampInactif />}>
          <BarreRecherche />
        </Suspense>
      </div>
      <Suspense fallback={<Squelette />}>
        <ZoneResultats searchParams={searchParams} />
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
      <input disabled placeholder="Rechercher (touche /)" aria-label="Rechercher un Pokémon" className={CLASSES_CHAMP} />
    </div>
  );
}

function Squelette() {
  return (
    <div className="mt-6">
      <SqueletteGrille />
    </div>
  );
}

// Q-14 (décision du manager, écart au cours) — une navigation est une transition React : sans
// clé, le même <Suspense> garde l'ancienne grille au lieu de remontrer le squelette quand on
// change de page. Une clé tirée de l'adresse fait de chaque recherche, type ou page une nouvelle
// zone, qui affiche donc son squelette (liste de l'étape 14). docs/09.
async function ZoneResultats({ searchParams }: Props) {
  const parametres = await searchParams;
  const { texte, type } = lireFiltres(parametres);
  const cle = [texte, type, String(parametres.page ?? "1"), lireTri(parametres.tri)].join("|");
  return (
    <Suspense key={cle} fallback={<Squelette />}>
      <Resultats searchParams={searchParams} />
    </Suspense>
  );
}

async function Resultats({ searchParams }: Props) {
  const parametres = await searchParams;
  // ch. 9 — tout ce qui vient de l'adresse est validé (lib/parametres.ts, testé).
  const { q, type } = lireFiltres(parametres);
  // Ordre des numéros par défaut (clarification « Analyse ») ; le tri par nom est le bonus FR-036.
  let noms = type ? await recupererNomsParType(type) : await recupererTousLesNoms();
  // Bonus FR-033 (clarification Q1) — recherche sur le nom français SEUL, accents et casse
  // ignorés (« bulbi » → Bulbizarre ; « bulbasaur » → rien). Les noms filtrés restent ceux de l'API.
  const recherche = normaliser(q);
  if (recherche) noms = noms.filter((nom) => normaliser(nomFrancaisDepuisNom(nom)).includes(recherche));
  // Bonus FR-036 — tri par nom français, AVANT le découpage en pages. Copie d'abord : sans
  // recherche, `noms` est le tableau mis en cache par "use cache", qu'il ne faut pas modifier.
  const tri = lireTri(parametres.tri);
  if (tri === "nom") {
    noms = [...noms].sort((a, b) => nomFrancaisDepuisNom(a).localeCompare(nomFrancaisDepuisNom(b), "fr"));
  }
  const { pageCourante, nombrePages } = bornerPage(parametres.page, noms.length);
  // Seuls les 24 Pokémon visibles sont chargés en détail.
  const visibles = noms.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);
  const pokemons = await recupererPlusieurs(visibles);

  return (
    <>
      <div className="mt-2">
        <FiltreTypes q={q} typeActif={type} tri={tri} />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base text-doux dark:text-doux-sombre">{noms.length.toLocaleString("fr-FR")} Pokémon</p>
        <SelecteurTri q={q} type={type} tri={tri} />
      </div>
      <div className="mt-4">
        {noms.length === 0 ? (
          <p className="py-8 text-center text-base text-doux dark:text-doux-sombre">
            Aucun Pokémon ne correspond à cette recherche.
          </p>
        ) : (
          // T076 — 6 premières images chargées tout de suite : la 1re rangée sur grand écran, les
          // trois premières sur téléphone ; la 1re carte est l'élément LCP de la page.
          <GrillePokemons pokemons={pokemons} prioritaires={6} />
        )}
      </div>
      <Pagination page={pageCourante} nombrePages={nombrePages} q={q} type={type} tri={tri} />
    </>
  );
}
