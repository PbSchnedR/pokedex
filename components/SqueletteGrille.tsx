// ch. 7 — squelette à la forme des cartes à venir : la page ne « saute » pas à leur arrivée.
// Même grille que GrillePokemons ; animate-pulse n'anime que l'opacité, coupé par motion-reduce.
export default function SqueletteGrille({ nombre = 24 }: { nombre?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6" aria-busy="true">
      {Array.from({ length: nombre }, (_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-2xl bg-surface p-2 ring-1 ring-black/5 motion-reduce:animate-none
                     dark:bg-surface-sombre dark:ring-white/10"
        >
          <div className="aspect-square rounded-xl bg-fond dark:bg-fond-sombre" />
          <div className="p-2">
            <div className="h-4 w-8 rounded-full bg-fond dark:bg-fond-sombre" />
            <div className="mt-2 h-4 w-20 rounded-full bg-fond dark:bg-fond-sombre" />
            <div className="mt-2 h-4 w-12 rounded-full bg-fond dark:bg-fond-sombre" />
          </div>
        </li>
      ))}
    </ul>
  );
}
