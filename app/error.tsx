"use client";

// ch. 7 — composant client : il réagit au clic « Réessayer » et attrape aussi les erreurs
// survenues dans le navigateur. L'erreur est `unknown` : on peut lever n'importe quelle valeur.
export default function Erreur({ error, retry }: { error: unknown; retry: () => void }) {
  const message = error instanceof Error ? error.message : "Erreur inconnue";
  return (
    <div className="py-20 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight font-stretch-85%">Le Pokédex ne répond plus</h2>
      <p className="my-4 text-base text-doux dark:text-doux-sombre">{message}</p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-full bg-pokedex px-4 py-2 font-semibold text-white transition-transform
                   hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-pokedex motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre"
      >
        Réessayer
      </button>
    </div>
  );
}
