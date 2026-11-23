import Link from "next/link";
import BoutonTheme from "./BoutonTheme";

const LIEN_NAV =
  "rounded-full px-2 py-2 text-base font-semibold hover:bg-fond focus-visible:outline-2 " +
  "focus-visible:outline-pokedex sm:px-4 dark:hover:bg-fond-sombre dark:focus-visible:outline-pokedex-sombre";

// ch. 5 / ch. 6 — Flexbox : titre et navigation empilés sur téléphone, aux deux extrémités dès sm:.
// En-tête collant et légèrement translucide (« Les détails qui font la différence »).
export default function EnTete() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-surface/85 backdrop-blur dark:border-white/10 dark:bg-surface-sombre/85">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="self-start rounded-full py-2 text-base font-extrabold tracking-tight font-stretch-85% focus-visible:outline-2 focus-visible:outline-pokedex sm:self-auto dark:focus-visible:outline-pokedex-sombre"
        >
          Mon Pokédex
        </Link>
        <div className="flex items-center justify-between gap-2">
          <nav aria-label="Navigation principale" className="flex items-center gap-2">
            <Link href="/" className={LIEN_NAV}>Pokédex</Link>
            <Link href="/favoris" className={LIEN_NAV}>Favoris</Link>
            <Link href="/sacoche" className={LIEN_NAV}>Sacoche</Link>
          </nav>
          <BoutonTheme />
        </div>
      </div>
    </header>
  );
}
