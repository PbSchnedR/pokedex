export default function Accueil() {
  // Le <main> est désormais posé par app/layout.tsx (étape 7) : un seul <main> par page.
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Mon Pokédex</h1>
      <p className="mt-2 text-base text-doux dark:text-doux-sombre">Bientôt 1 025 Pokémon ici.</p>
    </>
  );
}
