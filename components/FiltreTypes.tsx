import Link from "next/link";
import type { Tri } from "@/lib/parametres";
import { TYPES } from "@/lib/types";

function adresse(q: string, type: string, tri: Tri) {
  const parametres = new URLSearchParams();
  if (q) parametres.set("q", q);
  if (type) parametres.set("type", type);
  if (tri === "nom") parametres.set("tri", "nom"); // bonus FR-036 : le tri est conservé
  return `/?${parametres.toString()}`;
}

const PASTILLE =
  "block whitespace-nowrap rounded-md px-4 py-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre";

// ch. 9 — composant serveur, sans JavaScript côté navigateur : un état rangé dans l'adresse se
// modifie avec un lien. Le type actif est signalé par aria-current et un anneau (pas seulement
// par la couleur) ; les pastilles inactives gardent leur couleur pleine (contraste du texte blanc).
export default function FiltreTypes({ q, typeActif, tri }: { q: string; typeActif: string; tri: Tri }) {
  return (
    <nav aria-label="Filtrer par type" className="-mx-3 overflow-x-auto px-3 sm:-mx-4 sm:px-4 md:mx-0 md:overflow-visible md:px-0">
      <ul className="flex gap-2 py-2 md:flex-wrap">
        <li>
          <Link
            href={adresse(q, "", tri)}
            aria-current={typeActif ? undefined : "true"}
            className={`${PASTILLE} ${
              typeActif
                ? "bg-surface text-encre ring-1 ring-black/10 hover:bg-fond dark:bg-surface-sombre dark:text-encre-sombre dark:ring-white/10"
                : "bg-encre text-surface dark:bg-encre-sombre dark:text-fond-sombre"
            }`}
          >
            Tous
          </Link>
        </li>
        {Object.entries(TYPES).map(([type, style]) => (
          <li key={type}>
            <Link
              href={adresse(q, type, tri)}
              aria-current={type === typeActif ? "true" : undefined}
              className={`${PASTILLE} text-white transition-opacity hover:opacity-85 motion-reduce:transition-none ${style.classe} ${
                type === typeActif ? "ring-2 ring-encre ring-offset-2 ring-offset-fond dark:ring-encre-sombre dark:ring-offset-fond-sombre" : ""
              }`}
            >
              {style.libelle}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
