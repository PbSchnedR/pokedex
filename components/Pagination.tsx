import Link from "next/link";
import Fleches from "./Fleches";
import type { Tri } from "@/lib/parametres";

type Props = {
  page: number;
  nombrePages: number;
  q: string;
  type: string;
  tri: Tri;
};

// ch. 9 — chaque lien conserve la recherche, le type et le tri (bonus) ; `page=1` et
// `tri=numero` (défauts) ne sont pas écrits.
function adresse({ q, type, tri }: Props, page: number) {
  const parametres = new URLSearchParams();
  if (q) parametres.set("q", q);
  if (type) parametres.set("type", type);
  if (tri === "nom") parametres.set("tri", "nom");
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

const ACTIF =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre";

// Refonte « Console de poche » — « Précédent » et « Suivant » deviennent les touches fléchées
// physiques de la coque (Fleches : vrais liens, posés dans le logement du pupitre) ; leur
// afficheur montre « 3/43 ». Sous la grille, dans l'écran, restent les numéros de page (FR-037).
export default function Pagination(props: Props) {
  const { page, nombrePages } = props;
  // ch. 9 — renvoyer null : la façon habituelle de ne rien afficher.
  if (nombrePages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-6">
      <Fleches
        precedent={page > 1 ? { href: adresse(props, page - 1), libelle: "Page précédente" } : null}
        suivant={page < nombrePages ? { href: adresse(props, page + 1), libelle: "Page suivante" } : null}
        affichage={`${page}/${nombrePages}`}
        lecture={`Page ${page} sur ${nombrePages}`}
      />
      {/* Téléphone : l'afficheur de la coque suffit. À partir de sm : les numéros de page. */}
      <ol className="hidden items-center justify-center gap-2 sm:flex">
        {numerosAffiches(page, nombrePages).map((n, i) =>
          n === null ? (
            <li key={`saut-${i}`} aria-hidden="true" className="px-2 text-doux dark:text-doux-sombre">…</li>
          ) : (
            <li key={n}>
              <Link
                href={adresse(props, n)}
                aria-current={n === page ? "page" : undefined}
                aria-label={`Page ${n}`}
                className={`grid h-10 min-w-10 place-items-center rounded-md px-2 font-pixel text-base tabular-nums ${ACTIF} ${
                  n === page
                    ? "bg-encre text-surface dark:bg-encre-sombre dark:text-fond-sombre"
                    : "ring-1 ring-doux/40 hover:bg-surface dark:ring-doux-sombre/40 dark:hover:bg-surface-sombre"
                }`}
              >
                {n}
              </Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}
