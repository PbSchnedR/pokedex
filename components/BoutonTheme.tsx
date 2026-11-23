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

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={sombre}
      aria-label="Thème sombre"
      className="grid size-10 shrink-0 place-items-center rounded-full transition-transform hover:bg-fond
                 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex
                 motion-reduce:transition-none dark:hover:bg-fond-sombre dark:focus-visible:outline-pokedex-sombre"
    >
      <Icone nom="lune" className="size-5 dark:hidden" />
      <Icone nom="soleil" className="hidden size-5 dark:block" />
    </button>
  );
}
