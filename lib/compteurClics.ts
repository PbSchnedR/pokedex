// Bonus « Monde Pokémon » (spec 002, FR-001) — règle pure du secret : 5 activations du logo en
// moins de 3 s. L'heure est passée en paramètre (ch. 10 : rien n'est lu pendant le rendu, et les
// tests n'ont pas besoin de faux minuteurs).

export const ACTIVATIONS_SECRET = 5;
export const FENETRE_SECRET_MS = 3000;

export type ResultatActivation = {
  horodatages: number[];
  declenche: boolean;
};

// Copie immuable (ch. 2) : on garde les activations de moins de 3 s, on ajoute la nouvelle.
// Une fois déclenché, le compte repart de zéro.
export function enregistrerActivation(horodatages: number[], maintenant: number): ResultatActivation {
  const recents = [...horodatages.filter((t) => maintenant - t < FENETRE_SECRET_MS), maintenant];
  if (recents.length >= ACTIVATIONS_SECRET) return { horodatages: [], declenche: true };
  return { horodatages: recents, declenche: false };
}
