import { Suspense } from "react";
import ChoixComparaison from "@/components/ChoixComparaison";
import { CLASSES_CHAMP } from "@/components/classes";
import Icone from "@/components/Icone";
import TableauComparaison, { type Colonne } from "@/components/TableauComparaison";
import {
  lienComparaison,
  lireComparaison,
  suggerer,
  valeurChoix,
  type Choix,
  type ParametresComparaison,
} from "@/lib/comparaison";
import { recupererPokemon, recupererTousLesNoms } from "@/lib/pokeapi";
import type { Pokemon } from "@/types/pokemon";

type Props = {
  searchParams: Promise<ParametresComparaison>;
};

// ch. 8-9 — comme l'accueil : la page n'est pas async ; `a` et `b` ne sont connus qu'à la visite,
// ils sont lus sous <Suspense> par Comparaison, et le titre et le champ partent tout de suite.
export default function PageComparer({ searchParams }: Props) {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Comparer</h1>
      <div className="mt-4 md:w-80">
        <Suspense fallback={<ChampInactif />}>
          <ChoixComparaison />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense
          fallback={<p className="py-20 text-center text-base text-doux dark:text-doux-sombre">Chargement de la comparaison…</p>}
        >
          <Comparaison searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

// Repli serveur du champ (useSearchParams l'oblige à être sous Suspense) : même aspect, désactivé.
function ChampInactif() {
  return (
    <div>
      <p className="text-sm font-semibold">Second Pokémon</p>
      <div className="relative mt-1">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-doux dark:text-doux-sombre">
          <Icone nom="loupe" className="size-4" />
        </span>
        <input disabled placeholder="ex. raichu" aria-label="Second Pokémon" className={CLASSES_CHAMP} />
      </div>
    </div>
  );
}

// ch. 7 — 404 → null : un nom inconnu devient un message dans sa colonne, pas un notFound()
// global (FR-035). Une panne de l'API, elle, lève une erreur attrapée par error.tsx.
async function chercher(choix: Choix): Promise<Pokemon | null> {
  return choix.etat === "nom" ? recupererPokemon(choix.nom) : null; // invalide → aucune requête
}

// Q-C1 — colonne introuvable : suggestions prises dans la liste complète (en cache, ordre des
// numéros), chacune en lien qui conserve l'autre côté de la comparaison.
function versColonne(choix: Choix, pokemon: Pokemon | null, cote: "a" | "b", autre: Choix, noms: string[]): Colonne {
  if (pokemon) return { etat: "trouve", pokemon };
  if (choix.etat === "vide") return { etat: "vide" };
  const saisi = choix.etat === "nom" ? choix.nom : choix.saisi;
  const suggestions = suggerer(saisi, noms).map((nom) => ({ nom, lien: lienComparaison(cote, nom, valeurChoix(autre)) }));
  return { etat: "introuvable", saisi, suggestions };
}

async function Comparaison({ searchParams }: Props) {
  // ch. 9 — tout ce qui vient de l'adresse est validé (lib/comparaison.ts, testé).
  const { a, b } = lireComparaison(await searchParams);
  // ch. 7 — les deux appels partent ensemble.
  const [pokemonA, pokemonB] = await Promise.all([chercher(a), chercher(b)]);
  // La liste des noms n'est lue que si une saisie n'a rien donné.
  const manque = (choix: Choix, pokemon: Pokemon | null) => choix.etat !== "vide" && !pokemon;
  const noms = manque(a, pokemonA) || manque(b, pokemonB) ? await recupererTousLesNoms() : [];
  return (
    <TableauComparaison
      a={versColonne(a, pokemonA, "a", b, noms)}
      b={versColonne(b, pokemonB, "b", a, noms)}
    />
  );
}
