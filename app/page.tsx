import { Suspense } from "react";
import GrillePokemons from "@/components/GrillePokemons";
import SqueletteGrille from "@/components/SqueletteGrille";
import { recupererListe } from "@/lib/pokeapi";

// ch. 7 — le titre part tout de suite ; la liste arrive dans la zone <Suspense>, avec un
// squelette en attendant.
export default function Accueil() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Pokédex</h1>
      <div className="mt-6">
        <Suspense fallback={<SqueletteGrille />}>
          <ListeChargee />
        </Suspense>
      </div>
    </>
  );
}

async function ListeChargee() {
  const pokemons = await recupererListe(24);
  return <GrillePokemons pokemons={pokemons} />;
}
