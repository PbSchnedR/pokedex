"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { CLASSES_CHAMP } from "./classes";
import Icone from "./Icone";

// ch. 9 — même mécanique que BarreRecherche, mais le texte va dans `b` : le second Pokémon vit
// dans l'adresse, si bien qu'un lien partagé ou « Précédent » restitue la même comparaison (FR-035).
export default function ChoixComparaison() {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();
  const actuel = parametres.get("b") ?? "";
  const [texte, setTexte] = useState(actuel);
  const [vu, setVu] = useState(actuel); // dernière valeur de `b` lue dans l'adresse
  const [ecrit, setEcrit] = useState(actuel); // dernière valeur de `b` écrite par ce champ
  const id = useId(); // ch. 10 — relier le libellé visible à son champ

  // Q-C1 — `b` peut changer sans ce champ (clic sur une suggestion, « Précédent ») : le champ
  // reprend alors la valeur de l'adresse ; sinon l'effet ci-dessous réécrirait l'ancien texte.
  // Mise à jour pendant l'affichage (motif React « ajuster l'état quand une donnée change ») ;
  // une valeur que le champ vient d'écrire lui-même est ignorée, pour ne pas effacer les
  // lettres tapées depuis.
  if (actuel !== vu) {
    setVu(actuel);
    if (actuel !== ecrit) {
      setTexte(actuel);
      setEcrit(actuel); // sinon un « Précédent » vers une valeur écrite plus tôt serait ignoré
    }
  }

  useEffect(() => {
    if (texte === actuel) return;
    // ch. 9 — temporisation de 300 ms, nettoyage qui annule le minuteur précédent.
    const minuteur = setTimeout(() => {
      const suivants = new URLSearchParams(parametres.toString()); // `a` est conservé
      if (texte) suivants.set("b", texte);
      else suivants.delete("b");
      setEcrit(texte);
      router.replace(`${chemin}?${suivants.toString()}`); // pas une entrée d'historique par lettre
    }, 300);
    return () => clearTimeout(minuteur);
  }, [texte, actuel, parametres, chemin, router]);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        Second Pokémon
      </label>
      <div className="relative mt-1">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-doux dark:text-doux-sombre">
          <Icone nom="loupe" className="size-4" />
        </span>
        <input
          id={id}
          type="search"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="ex. Salamèche"
          autoComplete="off"
          className={CLASSES_CHAMP}
        />
      </div>
    </div>
  );
}
