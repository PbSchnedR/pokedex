import Link from "next/link";
import type { Tri } from "@/lib/parametres";

// ch. 9 — même principe que FiltreTypes : le tri vit dans l'adresse, il change avec un lien.
// Changer de tri conserve la recherche et le type, et revient à la première page (comme un
// changement de type) ; `tri=numero` (défaut) n'est pas écrit dans l'adresse.
function adresse(q: string, type: string, tri: Tri) {
  const parametres = new URLSearchParams();
  if (q) parametres.set("q", q);
  if (type) parametres.set("type", type);
  if (tri === "nom") parametres.set("tri", "nom");
  return `/?${parametres.toString()}`;
}

const CHOIX: { tri: Tri; libelle: string }[] = [
  { tri: "numero", libelle: "Numéro" },
  { tri: "nom", libelle: "Nom" },
];

// Bonus FR-036 — composant serveur, aucun JavaScript côté navigateur. Le choix actif est signalé
// par aria-current et par le contraste plein (encre sur surface), pas seulement par la couleur.
export default function SelecteurTri({ q, type, tri }: { q: string; type: string; tri: Tri }) {
  return (
    <nav aria-label="Trier les résultats" className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-doux dark:text-doux-sombre">Trier par</span>
      <ul className="flex rounded-md bg-surface p-1 shadow-sm ring-1 ring-black/5 dark:bg-surface-sombre dark:ring-white/10">
        {CHOIX.map((choix) => (
          <li key={choix.tri}>
            <Link
              href={adresse(q, type, choix.tri)}
              aria-current={choix.tri === tri ? "true" : undefined}
              className={`block rounded-md px-4 py-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex dark:focus-visible:outline-pokedex-sombre ${
                choix.tri === tri
                  ? "bg-encre text-surface dark:bg-encre-sombre dark:text-fond-sombre"
                  : "text-encre hover:bg-fond dark:text-encre-sombre dark:hover:bg-fond-sombre"
              }`}
            >
              {choix.libelle}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
