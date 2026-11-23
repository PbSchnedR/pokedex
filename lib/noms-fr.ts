// Bonus FR-033 (research R5) — noms français des 1 025 Pokémon, lus dans un fichier généré une
// fois par `scripts/generer-donnees.mjs` (aucun appel à la PokéAPI au moment de l'affichage).
// Comme pour les types (ch. 5), la donnée reste en anglais dans les adresses et les clés : seul
// l'affichage est traduit.
import pokemonsFr from "@/data/pokemons-fr.json";

export type EntreeNomFr = { id: number; nom: string; nomFr: string };

export const NOMS_FR: EntreeNomFr[] = pokemonsFr;

const PAR_ID = new Map(NOMS_FR.map((p) => [p.id, p.nomFr]));
const PAR_NOM = new Map(NOMS_FR.map((p) => [p.nom, p.nomFr]));

// Nom français d'un Pokémon par son numéro ; repli sur `repli` (le nom API) s'il est inconnu.
export function nomFrancais(id: number, repli = ""): string {
  return PAR_ID.get(id) ?? repli;
}

// Nom français à partir du nom API (« charmander » → « Salamèche ») ; repli sur le nom API.
export function nomFrancaisDepuisNom(nom: string): string {
  return PAR_NOM.get(nom) ?? nom;
}
