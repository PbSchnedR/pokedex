import type { Pokemon } from "@/types/pokemon";

// ch. 4, étape 4 — données écrites à la main, temporaires : remplacées par l'API à l'étape 9.
const image = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const exemples: Pokemon[] = [
  { id: 1, nom: "bulbasaur", image: image(1), types: ["grass", "poison"], taille: 0.7, poids: 6.9, stats: [{ nom: "hp", valeur: 45 }] },
  { id: 4, nom: "charmander", image: image(4), types: ["fire"], taille: 0.6, poids: 8.5, stats: [{ nom: "hp", valeur: 39 }] },
  { id: 7, nom: "squirtle", image: image(7), types: ["water"], taille: 0.5, poids: 9, stats: [{ nom: "hp", valeur: 44 }] },
  { id: 25, nom: "pikachu", image: image(25), types: ["electric"], taille: 0.4, poids: 6, stats: [{ nom: "hp", valeur: 35 }] },
  { id: 94, nom: "gengar", image: image(94), types: ["ghost", "poison"], taille: 1.5, poids: 40.5, stats: [{ nom: "hp", valeur: 60 }] },
  { id: 149, nom: "dragonite", image: image(149), types: ["dragon", "flying"], taille: 2.2, poids: 210, stats: [{ nom: "hp", valeur: 91 }] },
];
