import { CLASSES_GRILLE } from "./classes";

// ch. 7 — squelette à la forme des cartes à venir : la page ne « saute » pas à leur arrivée.
// Même grille que GrillePokemons ; animate-pulse n'anime que l'opacité, coupé par motion-reduce.
export default function SqueletteGrille({ nombre = 24 }: { nombre?: number }) {
  return (
    <div className="@container">
      <ul className={CLASSES_GRILLE} aria-busy="true">
        {Array.from({ length: nombre }, (_, i) => (
          <li
            key={i}
            className="animate-pulse overflow-hidden rounded-md bg-surface ring-1 ring-black/10 motion-reduce:animate-none
                       dark:bg-surface-sombre dark:ring-white/10"
          >
            <div className="h-8 bg-doux/20 dark:bg-doux-sombre/20" />
            <div className="aspect-square bg-fond dark:bg-fond-sombre" />
            <div className="p-2">
              <div className="h-4 w-20 rounded-sm bg-fond dark:bg-fond-sombre" />
              <div className="mt-2 h-4 w-12 rounded-sm bg-fond dark:bg-fond-sombre" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
