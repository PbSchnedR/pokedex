// ch. 6 — page provisoire du cours (exercice « Deux nouvelles pages » et « Titre et description »).
// Remplacée à l'étape 15 (T057) par la page client ; la metadata passera alors dans layout.tsx.
export const metadata = { title: "Favoris" }; // onglet : « Favoris · Pokédex »

export default function PageFavoris() {
  return <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Mes favoris</h1>;
}
