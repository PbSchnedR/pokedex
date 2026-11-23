import Link from "next/link";

type Props = {
  page: number;
  nombrePages: number;
  q: string;
  type: string;
};

// ch. 9 — chaque lien conserve la recherche et le type ; `page=1` n'est pas écrit.
function adresse({ q, type }: Props, page: number) {
  const parametres = new URLSearchParams();
  if (q) parametres.set("q", q);
  if (type) parametres.set("type", type);
  if (page > 1) parametres.set("page", String(page));
  return `/?${parametres.toString()}`;
}

// FR-037 (ajout au cours) : numéros de page. Avec 43 pages, on montre la première, la dernière
// et les voisines de la page courante ; `null` marque un saut (« … »).
function numerosAffiches(page: number, nombrePages: number): (number | null)[] {
  const gardes = [...new Set([1, page - 1, page, page + 1, nombrePages])]
    .filter((n) => n >= 1 && n <= nombrePages)
    .sort((a, b) => a - b);
  return gardes.flatMap((n, i) => (i > 0 && n - gardes[i - 1] > 1 ? [null, n] : [n]));
}

const BOUTON = "rounded-full px-4 py-2 text-base font-bold";
const ACTIF =
  "transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex " +
  "motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre";

export default function Pagination(props: Props) {
  const { page, nombrePages } = props;
  // ch. 9 — renvoyer null : la façon habituelle de ne rien afficher.
  if (nombrePages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={adresse(props, page - 1)} className={`${BOUTON} ${ACTIF} bg-surface shadow-sm ring-1 ring-black/5 hover:bg-fond dark:bg-surface-sombre dark:ring-white/10 dark:hover:bg-fond-sombre`}>
          Précédent
        </Link>
      ) : (
        <span className={`${BOUTON} cursor-not-allowed bg-surface opacity-40 dark:bg-surface-sombre`}>Précédent</span>
      )}

      {/* Téléphone : le texte du cours. À partir de sm : les numéros de page. */}
      <span className="text-base font-semibold tabular-nums sm:hidden">
        Page {page} sur {nombrePages}
      </span>
      <ol className="hidden items-center gap-2 sm:flex">
        {numerosAffiches(page, nombrePages).map((n, i) =>
          n === null ? (
            <li key={`saut-${i}`} aria-hidden="true" className="px-2 text-doux dark:text-doux-sombre">…</li>
          ) : (
            <li key={n}>
              <Link
                href={adresse(props, n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`Page ${n}`}
                className={`grid size-10 place-items-center rounded-full text-base font-bold tabular-nums ${ACTIF} ${
                  n === page ? "bg-encre text-surface dark:bg-encre-sombre dark:text-fond-sombre" : "hover:bg-surface dark:hover:bg-surface-sombre"
                }`}
              >
                {n}
              </Link>
            </li>
          )
        )}
      </ol>

      {page < nombrePages ? (
        <Link href={adresse(props, page + 1)} className={`${BOUTON} ${ACTIF} bg-pokedex text-white hover:brightness-110`}>
          Suivant
        </Link>
      ) : (
        <span className={`${BOUTON} cursor-not-allowed bg-pokedex text-white opacity-40`}>Suivant</span>
      )}
    </nav>
  );
}
