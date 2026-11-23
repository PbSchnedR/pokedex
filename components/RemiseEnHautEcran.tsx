"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Refonte « Console de poche » — seul composant client ajouté par la refonte. La page ne défile
// plus : c'est l'écran (<main id="contenu">) qui défile. Next.js ne remet pas ce conteneur en
// haut de façon fiable après une navigation : il ne fait défiler que si le haut de la nouvelle
// page est hors de la fenêtre (mesuré : un écran défilé de 20 à 80 px le restait après
// « Page suivante »). Ici, chaque changement d'adresse (chemin ou paramètres : pagination,
// filtre, tri) ramène l'écran en haut, comme une page web classique.
// ch. 10 — usePathname / useSearchParams (sous <Suspense>, dans le layout) ; dépendances en
// chaînes, stables d'un rendu à l'autre ; l'effet synchronise avec le DOM, son vrai usage.
export default function RemiseEnHautEcran() {
  const chemin = usePathname();
  const parametres = useSearchParams().toString();
  useEffect(() => {
    document.getElementById("contenu")?.scrollTo(0, 0);
  }, [chemin, parametres]);
  return null;
}
