import Link from "next/link";
import Icone from "./Icone";

type Cible = { href: string; libelle: string } | null;

type Props = {
  precedent: Cible;
  suivant: Cible;
  affichage: string; // ce que montre le mini-afficheur (« 3/43 », « #025 »)
  lecture: string; // la même information, en phrase, pour les lecteurs d'écran
};

// Composant serveur. Refonte « Console de poche » — les touches fléchées physiques du pupitre.
// Ce sont de vrais liens (ch. 6 : naviguer = lien) rendus par la page qui a de quoi feuilleter ;
// la classe .fleches (position fixe, globals.css) les pose dans le logement de la coque, par-
// dessus les touches inactives dessinées par le pupitre. Le composant doit rester hors de tout
// conteneur de requêtes (@container) ou élément transformé : sinon la position fixe se
// rapporterait à lui et non à la fenêtre.
export default function Fleches({ precedent, suivant, affichage, lecture }: Props) {
  return (
    <div className="fleches fleches-page">
      <Touche cible={precedent} icone="triangleGauche" />
      <p className="afficheur">
        <span aria-hidden="true">{affichage}</span>
        <span className="sr-only">{lecture}</span>
      </p>
      <Touche cible={suivant} icone="triangleDroite" />
    </div>
  );
}

function Touche({ cible, icone }: { cible: Cible; icone: "triangleGauche" | "triangleDroite" }) {
  // ch. 9 — au bout de la liste, la touche reste dessinée mais inactive (comme « Précédent »
  // en page 1 dans le cours) : un <span aria-disabled>, pas un lien mort.
  if (!cible) {
    return (
      <span aria-disabled="true" className="touche-sombre">
        <Icone nom={icone} className="size-5" />
      </span>
    );
  }
  return (
    <Link href={cible.href} aria-label={cible.libelle} className="touche-sombre">
      <Icone nom={icone} className="size-5" />
    </Link>
  );
}
