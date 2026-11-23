"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CLASSES_CHAMP } from "./classes";
import Icone from "./Icone";

// ch. 9 — le texte de la recherche vit dans l'adresse (?q=), pas dans un état partagé.
export default function BarreRecherche() {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();
  const actuel = parametres.get("q") ?? "";
  const [texte, setTexte] = useState(actuel);

  useEffect(() => {
    if (texte === actuel) return;
    // ch. 9 — temporisation : l'adresse ne change que 300 ms après la dernière frappe ; le
    // nettoyage annule le minuteur précédent (sinon une requête par lettre).
    const minuteur = setTimeout(() => {
      const suivants = new URLSearchParams(parametres.toString());
      if (texte) suivants.set("q", texte);
      else suivants.delete("q");
      suivants.delete("page"); // nouvelle recherche → première page
      router.replace(`${chemin}?${suivants.toString()}`); // pas une entrée d'historique par lettre
    }, 300);
    return () => clearTimeout(minuteur);
  }, [texte, actuel, parametres, chemin, router]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-doux dark:text-doux-sombre">
        <Icone nom="loupe" className="size-4" />
      </span>
      <input
        type="search"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Rechercher un Pokémon"
        aria-label="Rechercher un Pokémon"
        className={CLASSES_CHAMP}
      />
    </div>
  );
}
