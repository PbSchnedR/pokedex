// Bonus « Monde Pokémon » (spec 002) — le jeu PokéMonde n'est pas publié : il tourne seulement en
// local sur l'ordinateur de son créateur (dépôt séparé, servi par `sh outils/servir.sh`).
// Adresse constante, jamais construite à partir d'une saisie.
export const ADRESSE_MONDE_POKEMON = "http://127.0.0.1:8765/";

// Le code de sacoche n'utilise que [A-Za-z0-9._-] ; encodeURIComponent par sécurité.
export function adresseMondePokemon(codeSacoche: string | null): string {
  return codeSacoche ? `${ADRESSE_MONDE_POKEMON}?sacoche=${encodeURIComponent(codeSacoche)}` : ADRESSE_MONDE_POKEMON;
}

// Vérifier que le jeu répond n'a de sens (et ne déclenche aucune demande d'autorisation « réseau
// local » du navigateur) que si le site lui-même est servi depuis cet ordinateur.
export function verificationPossible(hote: string): boolean {
  return hote === "localhost" || hote === "127.0.0.1" || hote === "[::1]";
}

// `no-cors` : la réponse est opaque, mais une promesse tenue suffit à dire « quelqu'un répond ».
export async function jeuLocalRepond(delaiMs = 1500): Promise<boolean> {
  try {
    await fetch(ADRESSE_MONDE_POKEMON, { mode: "no-cors", cache: "no-store", signal: AbortSignal.timeout(delaiMs) });
    return true;
  } catch {
    return false;
  }
}
