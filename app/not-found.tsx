import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-pixel text-3xl text-balance">Ce Pokémon s’est enfui</h1>
      <p className="my-4 text-base text-doux dark:text-doux-sombre">La page demandée n’existe pas.</p>
      <Link
        href="/"
        className="inline-block rounded-md bg-pokedex px-4 py-2 font-semibold text-white transition-transform
                   hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-pokedex motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre"
      >
        Retour au Pokédex
      </Link>
    </div>
  );
}
