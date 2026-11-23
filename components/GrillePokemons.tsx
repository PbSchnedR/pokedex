import type { Pokemon } from "@/types/pokemon";
import CartePokemon from "./CartePokemon";
import { CLASSES_GRILLE } from "./classes";

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
    // ch. 1 / ch. 5 — Grid : 2 colonnes sur téléphone, 6 sur grand écran ; seuils mesurés sur la
    // largeur de l'écran de la console (requêtes de conteneur, voir CLASSES_GRILLE).
    <div className="@container">
      <ul className={CLASSES_GRILLE}>
        {pokemons.map((pokemon, i) => (
          // ch. 4 — clé stable : l'identifiant, pas l'index (la liste sera filtrée).
          <li key={pokemon.id}>
            <CartePokemon pokemon={pokemon} titre={titre} prioritaire={i < prioritaires} />
          </li>
        ))}
      </ul>
    </div>
  );
}
