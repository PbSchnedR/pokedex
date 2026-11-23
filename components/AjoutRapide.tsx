"use client";

import { TAILLE_SACOCHE, useSacoche, type Membre } from "@/stores/sacoche";
import Icone from "./Icone";

// ch. 9 — la carte (serveur) ne transmet que les champs qu'un membre de la sacoche garde : des
// données simples, sans les statistiques, qui passent la frontière serveur → client.
// `libelle` : nom affiché (français, bonus FR-033), fourni par la carte serveur comme pour
// BoutonFavori — ce composant client n'importe pas le fichier des noms (poids du JS client).
type Props = {
  pokemon: Pick<Membre, "id" | "nom" | "image" | "types">;
  libelle?: string;
  className?: string;
};

// Bonus FR-034 — ajout rapide depuis la grille, hors du Link de la carte (comme BoutonFavori).
// Le bouton reflète la règle FR-016 ; c'est l'action `ajouter` du store qui la garantit.
export default function AjoutRapide({ pokemon, libelle: nomAffiche = pokemon.nom, className = "" }: Props) {
  // ch. 9 — un sélecteur par valeur simple (booléens) : la carte ne se réaffiche que si SON état change.
  const dedans = useSacoche((etat) => etat.equipe.some((m) => m.id === pokemon.id));
  const pleine = useSacoche((etat) => etat.equipe.length >= TAILLE_SACOCHE); // dérivé, jamais stocké
  const ajouter = useSacoche((etat) => etat.ajouter);

  const indisponible = dedans || pleine;
  const libelle = dedans
    ? `${nomAffiche} est déjà dans la sacoche`
    : pleine
      ? `Sacoche pleine (${TAILLE_SACOCHE}/${TAILLE_SACOCHE}) : impossible d'ajouter ${nomAffiche}`
      : `Ajouter ${nomAffiche} à la sacoche`;

  return (
    <button
      type="button"
      // aria-disabled plutôt que disabled : un bouton `disabled` perd le focus au moment où il se
      // désactive (juste après l'ajout), et le clavier repartirait du haut de la page. Ici le focus
      // reste, le lecteur d'écran annonce « indisponible » et le nouveau libellé.
      aria-disabled={indisponible}
      onClick={() => {
        if (indisponible) return;
        // `ajouter` ne demande que id, nom, image et types (Pick dans stores/sacoche.ts) : le reste
        // du Pokémon (statistiques…) ne traverse pas la frontière serveur → client (ch. 6).
        ajouter(pokemon);
      }}
      aria-label={libelle}
      title={libelle}
      className={`grid size-10 place-items-center rounded-full shadow-sm transition-transform duration-150
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pokedex
                  motion-reduce:transition-none dark:focus-visible:outline-pokedex-sombre ${
                    dedans
                      ? "cursor-default bg-pokedex text-white" // blanc sur #d2232f, lisible dans les deux thèmes
                      : pleine
                        ? "cursor-not-allowed bg-surface text-doux opacity-50 dark:bg-surface-sombre dark:text-doux-sombre"
                        : "bg-surface text-pokedex hover:scale-110 active:scale-90 dark:bg-surface-sombre dark:text-pokedex-sombre"
                  } ${className}`}
    >
      <Icone nom={dedans ? "coche" : "plus"} className="size-5" />
    </button>
  );
}
