import Quiz from "@/components/Quiz";

// Composant serveur : titre et consigne partent tout de suite ; seul le jeu est client (ch. 6).
export default function PageQuiz() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Qui est ce Pokémon ?</h1>
      <p className="mt-2 max-w-prose text-base text-doux dark:text-doux-sombre">
        Devinez le Pokémon d&apos;après sa silhouette et tapez son nom français. Accents et majuscules ne comptent pas.
      </p>
      <div className="mt-6">
        <Quiz />
      </div>
    </>
  );
}
