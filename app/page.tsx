import CartePokemon from "@/components/CartePokemon";
import { recupererPokemon } from "@/lib/pokeapi";

// Étape 8 (temporaire) : une seule carte, chargée depuis l'API par la couche d'accès aux données.
export default async function Accueil() {
  const pikachu = await recupererPokemon("pikachu");
  if (!pikachu) return <p>Pokémon introuvable.</p>;
  return (
    <div className="w-48">
      <CartePokemon pokemon={pikachu} />
    </div>
  );
}
