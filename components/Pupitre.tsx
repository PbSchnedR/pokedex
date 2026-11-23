import { Suspense } from "react";
import BoutonHasard from "./BoutonHasard";
import CompteurFavoris from "./CompteurFavoris";
import Icone from "./Icone";
import IndicateurSacoche from "./IndicateurSacoche";
import LienNav from "./LienNav";

// Composant serveur. Refonte « Console de poche » — le pupitre de la coque : cinq touches de
// navigation (des liens, ch. 6 / ch. 11 : on va vers une page), « Au hasard » (un bouton) et le
// logement des flèches de feuilletage.
// ch. 10 — usePathname dans LienNav : chaque touche sous <Suspense>, avec sa forme en repli.

function Repli({ libelle }: { libelle: string }) {
  return (
    <span className="touche">
      <span aria-hidden="true" className="voyant" />
      <span className="touche-libelle">{libelle}</span>
    </span>
  );
}

export default function Pupitre() {
  return (
    <nav aria-label="Navigation principale" className="pupitre">
      <Suspense fallback={<Repli libelle="Pokédex" />}>
        <LienNav href="/" className="touche">
          <span aria-hidden="true" className="voyant" />
          <span className="touche-libelle">Pokédex</span>
        </LienNav>
      </Suspense>
      <Suspense fallback={<Repli libelle="Favoris" />}>
        <LienNav href="/favoris" className="touche">
          <span aria-hidden="true" className="voyant" />
          <span className="touche-libelle">Favoris</span>
          <CompteurFavoris />
        </LienNav>
      </Suspense>
      <Suspense fallback={<Repli libelle="Sacoche" />}>
        <IndicateurSacoche />
      </Suspense>
      {/* Bonus (T095) — combat de sacoches et quiz. Le comparateur reste accessible depuis
          chaque fiche (bouton « Comparer »). */}
      <Suspense fallback={<Repli libelle="Combat" />}>
        <LienNav href="/combat" className="touche">
          <span aria-hidden="true" className="voyant" />
          <span className="touche-libelle">Combat</span>
        </LienNav>
      </Suspense>
      <Suspense fallback={<Repli libelle="Quiz" />}>
        <LienNav href="/quiz" className="touche">
          <span aria-hidden="true" className="voyant" />
          <span className="touche-libelle">Quiz</span>
        </LienNav>
      </Suspense>

      {/* Stries de prise moulées, colonne de grand écran seulement (décor). */}
      <span aria-hidden="true" className="stries hidden paysage:block" />

      <div className="pupitre-actions">
        <BoutonHasard />
        {/* Logement des flèches : sans page à feuilleter, les touches sont dessinées inactives
            (décor, aria-hidden). L'accueil et la fiche posent leurs vraies flèches par-dessus
            (Fleches.tsx, même position fixe). */}
        <div className="logement">
          <div aria-hidden="true" className="fleches">
            <span aria-disabled="true" className="touche-sombre">
              <Icone nom="triangleGauche" className="size-5" />
            </span>
            <span className="afficheur">- - -</span>
            <span aria-disabled="true" className="touche-sombre">
              <Icone nom="triangleDroite" className="size-5" />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
