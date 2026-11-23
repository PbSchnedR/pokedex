import GrillePokemons from "@/components/GrillePokemons";
import { exemples } from "@/data/exemples";

// Étapes 3–4 (temporaire) : la grille affiche des données écrites à la main.
export default function Accueil() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Pokédex</h1>
      <div className="mt-6">
        <GrillePokemons pokemons={exemples} />
      </div>
    </>
  );
}
