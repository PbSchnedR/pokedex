import GrillePokemons from "@/components/GrillePokemons";
import { recupererListe } from "@/lib/pokeapi";

// Étape 9 : les 24 premiers Pokémon, chargés en parallèle et mis en cache (ch. 7).
export default async function Accueil() {
  const pokemons = await recupererListe(24);
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Pokédex</h1>
      <div className="mt-6">
        <GrillePokemons pokemons={pokemons} />
      </div>
    </>
  );
}
