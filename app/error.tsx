"use client";

// ch. 7 — composant client : il réagit au clic « Réessayer » et attrape aussi les erreurs
// survenues dans le navigateur. L'erreur (`error: unknown`) n'est plus affichée (T073, décision
// du manager) : son message est technique et en anglais (« fetch failed »), et Next.js le masque
// de toute façon en production pour une erreur du serveur. Elle reste dans les journaux du serveur.
export default function Erreur({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="py-20 text-center">
      {/* ch. 11 — un <h1> : cette page remplace le contenu de la page, qui n'a plus d'autre titre. */}
      <h1 className="font-pixel text-3xl text-balance">Le Pokédex ne répond plus</h1>
      <p className="my-4 text-base text-doux dark:text-doux-sombre">
        Les données des Pokémon sont momentanément indisponibles. Réessayez dans un instant.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-md bg-pokedex px-4 py-2 font-semibold text-white transition-transform
                   hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-pokedex motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre"
      >
        Réessayer
      </button>
    </div>
  );
}
