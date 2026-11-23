import type { Pokemon } from "@/types/pokemon";
import CartePokemon from "./CartePokemon";

// `prioritaires` : nombre de premières cartes dont l'image est chargée tout de suite (T076) ;
// 0 par défaut (fiche, favoris : la grille est plus bas dans la page).
export default function GrillePokemons({
  pokemons,
  titre,
  prioritaires = 0,
}: {
  pokemons: Pokemon[];
  titre?: "h2" | "h3";
  prioritaires?: number;
}) {
  // ch. 4 — vraie comparaison : `pokemons.length && …` afficherait « 0 ».
  if (pokemons.length === 0) {
    return <p className="py-8 text-center text-base text-doux dark:text-doux-sombre">Aucun Pokémon à afficher.</p>;
  }
  return (
    // ch. 1 / ch. 5 — Grid : 2 colonnes sur téléphone, 3 dès 640 px, 4 dès 768 px, 6 dès 1024 px.
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
      {pokemons.map((pokemon, i) => (
        // ch. 4 — clé stable : l'identifiant, pas l'index (la liste sera filtrée).
        <li key={pokemon.id}>
          <CartePokemon pokemon={pokemon} titre={titre} prioritaire={i < prioritaires} />
        </li>
      ))}
    </ul>
  );
}
