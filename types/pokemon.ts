// ch. 3 — deux types : la réponse brute de l'API (PokemonApi, seulement les champs utiles)
// et la forme simple manipulée par l'application (Pokemon). versPokemon relie les deux (ch. 7).

export type Statistique = {
  nom: string;
  valeur: number;
};

export type Pokemon = {
  id: number;
  nom: string;
  image: string;
  types: string[];
  taille: number;   // en mètres
  poids: number;    // en kilogrammes
  stats: Statistique[];
};

export type PokemonApi = {
  id: number;
  name: string;
  height: number;   // en décimètres
  weight: number;   // en hectogrammes
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: { other: { "official-artwork": { front_default: string | null } } };
};
