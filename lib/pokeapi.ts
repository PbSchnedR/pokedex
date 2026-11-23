import { cacheLife } from "next/cache";
import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";

// ch. 7 — 404 → null (« ça n'existe pas », pas une panne) ; tout autre échec → erreur levée,
// attrapée par error.tsx. fetch ne rejette pas tout seul sur un 404 ou un 500 (ch. 2).
async function appeler<T>(adresse: string): Promise<T | null> {
  const reponse = await fetch(adresse.startsWith("http") ? adresse : `${API}${adresse}`);
  if (reponse.status === 404) return null;
  if (!reponse.ok) {
    throw new Error(`La PokéAPI a répondu ${reponse.status} pour ${adresse}`);
  }
  return reponse.json() as Promise<T>;
}

export async function recupererPokemon(nom: string): Promise<Pokemon | null> {
  "use cache";
  cacheLife("days"); // ch. 7 — données stables : on ménage la PokéAPI (cache demandé par l'API)
  const brut = await appeler<PokemonApi>(`/pokemon/${encodeURIComponent(nom.toLowerCase())}`);
  return brut ? versPokemon(brut) : null;
}

// ch. 7 — les appels partent ensemble (Promise.all) ; un seul échec fait échouer le tout,
// voulu : mieux vaut une erreur claire qu'une grille à trous.
export async function recupererPlusieurs(noms: string[]): Promise<Pokemon[]> {
  const pokemons = await Promise.all(noms.map(recupererPokemon));
  return pokemons.filter((p): p is Pokemon => p !== null);
}

export async function recupererListe(limite = 24, decalage = 0): Promise<Pokemon[]> {
  "use cache";
  cacheLife("days");
  const page = await appeler<{ results: { name: string }[] }>(
    `/pokemon?limit=${limite}&offset=${decalage}`
  );
  return page ? recupererPlusieurs(page.results.map((p) => p.name)) : [];
}

// ch. 8 — la chaîne d'évolution est un arbre : chaque maillon contient d'autres maillons de même
// forme, sur une profondeur inconnue.
type Maillon = {
  species: { name: string };
  evolves_to: Maillon[];
};

// ch. 8 — récursion : le nom du maillon, puis la même fonction appliquée à chaque branche.
// Export nommé pour être testée (lib/pokeapi.test.ts, décision Q-3) ; le cours la garde privée.
export function aplatir(maillon: Maillon): string[] {
  return [maillon.species.name, ...maillon.evolves_to.flatMap(aplatir)];
}

export async function recupererEvolutions(id: number): Promise<string[]> {
  "use cache";
  cacheLife("days");
  // Deux appels : l'espèce donne l'adresse de la chaîne, puis la chaîne elle-même.
  const espece = await appeler<{ evolution_chain: { url: string } }>(`/pokemon-species/${id}`);
  if (!espece) return [];
  const chaine = await appeler<{ chain: Maillon }>(espece.evolution_chain.url);
  return chaine ? aplatir(chaine.chain) : [];
}

export const TOTAL_POKEMONS = 1025;

export async function recupererTousLesNoms(): Promise<string[]> {
  "use cache";
  cacheLife("days");
  const page = await appeler<{ results: { name: string }[] }>(`/pokemon?limit=${TOTAL_POKEMONS}`);
  // Sans cette liste, ni recherche ni pré-génération : c'est une panne, pas un « introuvable ».
  if (!page) throw new Error("La liste des Pokémon est introuvable");
  return page.results.map((p) => p.name);
}
