"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { useRaccourci } from "@/hooks/useRaccourci";
import { useRappelTemporise } from "@/hooks/useRappelTemporise";
import { CLASSES_CHAMP } from "./classes";
import Icone from "./Icone";

// ch. 10 — version finale : plus aucun useEffect. La navigation part de l'événement (onChange),
// temporisée de 300 ms ; useTransition signale l'attente (« Recherche… »).
// Le texte de la recherche vit toujours dans l'adresse (?q=), ch. 9.
export default function BarreRecherche() {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();
  const [texte, setTexte] = useState(parametres.get("q") ?? "");
  const [enAttente, demarrer] = useTransition();
  const champ = useRef<HTMLInputElement>(null);

  const naviguer = useRappelTemporise((valeur: string) => {
    const suivants = new URLSearchParams(parametres.toString());
    if (valeur) suivants.set("q", valeur);
    else suivants.delete("q");
    suivants.delete("page"); // nouvelle recherche → première page
    demarrer(() => router.replace(`${chemin}?${suivants.toString()}`)); // pas d'historique par lettre
  });

  // ch. 10 — touche « / » : useRef donne accès au champ ; fonction stable pour l'effet du hook.
  const focaliser = useCallback(() => champ.current?.focus(), []);
  useRaccourci("/", focaliser);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-doux dark:text-doux-sombre">
        <Icone nom="loupe" className="size-4" />
      </span>
      <input
        ref={champ}
        type="search"
        value={texte}
        onChange={(e) => {
          setTexte(e.target.value);
          naviguer(e.target.value);
        }}
        placeholder="Rechercher (touche /)"
        aria-label="Rechercher un Pokémon"
        className={CLASSES_CHAMP}
      />
      {enAttente ? (
        <span role="status" className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-semibold text-doux dark:text-doux-sombre">
          Recherche…
        </span>
      ) : null}
    </div>
  );
}
