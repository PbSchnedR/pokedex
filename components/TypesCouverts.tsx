"use client";

import { useTypesCouverts } from "@/hooks/useTypesCouverts";
import BadgeType from "./BadgeType";

// Bonus FR-034 — les types couverts par l'équipe, en badges (même BadgeType que les cartes).
// Leur nombre reste dans le compteur de la page (« n type(s) couvert(s) ») : pas de doublon ici.
export default function TypesCouverts() {
  const types = useTypesCouverts();
  return (
    <section aria-labelledby="titre-types-couverts" className="mt-4 mb-4">
      <h2 id="titre-types-couverts" className="text-sm font-bold">
        Types couverts
      </h2>
      {types.length === 0 ? (
        <p className="mt-2 text-sm text-doux dark:text-doux-sombre">
          Aucun type couvert : la sacoche est vide. Ajoutez des Pokémon depuis le Pokédex.
        </p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-2">
          {types.map((type) => (
            <li key={type}>
              <BadgeType type={type} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
