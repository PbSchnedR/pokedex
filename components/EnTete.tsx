import { Suspense } from "react";
import BoutonHasard from "./BoutonHasard";
import BoutonTheme from "./BoutonTheme";
import CompteurFavoris from "./CompteurFavoris";
import IndicateurSacoche from "./IndicateurSacoche";
import LogoPokedex from "./LogoPokedex";
import LienNav from "./LienNav";

const LIEN_NAV =
  "rounded-full px-2 py-2 text-base font-semibold hover:bg-fond focus-visible:outline-2 " +
  "focus-visible:outline-pokedex sm:px-4 dark:hover:bg-fond-sombre dark:focus-visible:outline-pokedex-sombre";

// ch. 5 / ch. 6 — Flexbox : titre et navigation empilés sur téléphone, aux deux extrémités dès sm:.
// En-tête collant et légèrement translucide (« Les détails qui font la différence ») à partir de
// md: ; sur téléphone il occupe 3 lignes (~150 px) et défile avec la page (recette, défaut D2).
export default function EnTete() {
  return (
    <header className="relative z-10 md:sticky md:top-0 border-b border-black/5 bg-surface/85 backdrop-blur dark:border-white/10 dark:bg-surface-sombre/85">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <LogoPokedex />
        <nav aria-label="Navigation principale" className="order-last flex w-full flex-wrap items-center gap-x-2 gap-y-1 lg:order-none lg:ml-auto lg:w-auto">
            {/* ch. 10 — usePathname dans un composant client : chaque lien sous <Suspense>, avec
                son texte en repli. */}
            <Suspense fallback={<span className={LIEN_NAV}>Pokédex</span>}>
              <LienNav href="/" className={LIEN_NAV}>Pokédex</LienNav>
            </Suspense>
            <Suspense fallback={<span className={LIEN_NAV}>Favoris</span>}>
              <LienNav href="/favoris" className={`${LIEN_NAV} inline-flex items-center gap-2`}>
                Favoris <CompteurFavoris />
              </LienNav>
            </Suspense>
            <Suspense fallback={<span className={LIEN_NAV}>Sacoche</span>}>
              <IndicateurSacoche className={LIEN_NAV} />
            </Suspense>
            {/* Bonus (T095) — combat de sacoches et quiz, mêmes liens surlignés que le reste. Le
                comparateur reste accessible depuis chaque fiche (bouton « Comparer »). */}
            <Suspense fallback={<span className={LIEN_NAV}>Combat</span>}>
              <LienNav href="/combat" className={LIEN_NAV}>Combat</LienNav>
            </Suspense>
            <Suspense fallback={<span className={LIEN_NAV}>Quiz</span>}>
              <LienNav href="/quiz" className={LIEN_NAV}>Quiz</LienNav>
            </Suspense>
        </nav>
        {/* Ordre du DOM = ordre visuel sur grand écran (titre, navigation, boutons) : c'est l'ordre
            de la touche Tab. Sous lg, la navigation passe en 2e ligne (order-last) : avec « Au hasard »,
            tout ne tient sur une seule ligne qu'à partir de 1 024 px. */}
        <div className="flex items-center gap-2">
          <BoutonHasard />
          <BoutonTheme />
        </div>
      </div>
    </header>
  );
}
