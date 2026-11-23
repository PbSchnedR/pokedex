import type { Pokemon, PokemonApi } from "@/types/pokemon";
import { API, versPokemon } from "./conversion";

// ch. 9 — version navigateur : les fonctions de lib/pokeapi.ts portent "use cache" et ne
// s'exécutent que sur le serveur. Même règle (404 → null) et même conversion.
export async function chargerPokemon(nom: string): Promise<Pokemon | null> {
  const reponse = await fetch(`${API}/pokemon/${encodeURIComponent(nom)}`);
  if (reponse.status === 404) return null;
  if (!reponse.ok) throw new Error(`La PokéAPI a répondu ${reponse.status} pour ${nom}`);
  return versPokemon((await reponse.json()) as PokemonApi);
}
