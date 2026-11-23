// Classes partagées entre un composant client et son équivalent serveur (repli de Suspense) :
// un module "use client" ne peut pas fournir une simple valeur à un composant serveur.
export const CLASSES_CHAMP =
  "w-full rounded-md border border-black/10 bg-surface py-2 pl-8 pr-4 text-base shadow-sm placeholder:text-doux " +
  "focus:border-pokedex focus:outline-none focus:ring-4 focus:ring-pokedex/20 disabled:opacity-40 " +
  "dark:border-white/10 dark:bg-surface-sombre dark:placeholder:text-doux-sombre";

// ch. 5 — grille 2 → 6 colonnes. Refonte « Console de poche » : la grille vit dans l'écran de la
// console, dont la largeur n'est pas celle de la fenêtre (coque, colonne de touches). Les seuils
// sont donc des requêtes de conteneur (@container, posé par l'enveloppe de la grille) sur la
// largeur réelle de la zone : 2 colonnes, 3 dès 30rem (480 px), 4 dès 40rem (640 px), 6 dès
// 52rem (832 px). Mesuré : 2 colonnes à 375 px, 6 colonnes à 1 280 px.
export const CLASSES_GRILLE =
  "grid grid-cols-2 gap-3 @min-[30rem]:grid-cols-3 @min-[30rem]:gap-4 @min-[40rem]:grid-cols-4 @min-[52rem]:grid-cols-6";
