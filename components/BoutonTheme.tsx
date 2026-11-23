"use client";

import { useSyncExternalStore } from "react";
import Icone from "./Icone";

// FR-023 / contracts/stockage-local.md — "clair" | "sombre", absent = clair.
const CLE_THEME = "pokedex-theme";

// La source de vérité est la classe `dark` de <html>, posée avant l'affichage par le script de
// layout.tsx. On l'observe au lieu de la copier dans un état : pas d'erreur d'hydratation
// (le serveur rend « clair », le navigateur corrige juste après).
function abonner(rappel: () => void) {
  const observateur = new MutationObserver(rappel);
  observateur.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observateur.disconnect();
}
const lireSombre = () => document.documentElement.classList.contains("dark");
const sombreCoteServeur = () => false;

export default function BoutonTheme() {
  const sombre = useSyncExternalStore(abonner, lireSombre, sombreCoteServeur);

  function basculer() {
    const suivant = !lireSombre();
    document.documentElement.classList.toggle("dark", suivant);
    try {
      localStorage.setItem(CLE_THEME, suivant ? "sombre" : "clair");
    } catch {
      // Stockage indisponible : le thème change pour cette visite seulement.
    }
  }

  // Refonte « Console de poche » : interrupteur à glissière du rétroéclairage, gravé sur la
  // coque (soleil à gauche, lune à droite). Le curseur suit la classe `dark` en CSS (.curseur).
  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={sombre}
      aria-label="Thème sombre"
      className="sur-coque flex shrink-0 items-center gap-2 rounded-md p-1.5"
    >
      <Icone nom="soleil" className="size-4" />
      <span aria-hidden="true" className="glissiere">
        <span className="curseur" />
      </span>
      <Icone nom="lune" className="size-4" />
    </button>
  );
}
