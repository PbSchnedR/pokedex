import type { Pokemon } from "@/types/pokemon";
import CartePokemon from "./CartePokemon";

export default function GrillePokemons({ pokemons }: { pokemons: Pokemon[] }) {
  // ch. 4 — vraie comparaison : `pokemons.length && …` afficherait « 0 ».
  if (pokemons.length === 0) {
    return <p className="py-8 text-center text-base text-doux dark:text-doux-sombre">Aucun Pokémon à afficher.</p>;
  }
  return (
    // ch. 1 / ch. 5 — Grid : 2 colonnes sur téléphone, 3 dès 640 px, 4 dès 768 px, 6 dès 1024 px.
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
      {pokemons.map((pokemon) => (
        // ch. 4 — clé stable : l'identifiant, pas l'index (la liste sera filtrée).
        <li key={pokemon.id}>
          <CartePokemon pokemon={pokemon} />
        </li>
      ))}
    </ul>
  );
}
