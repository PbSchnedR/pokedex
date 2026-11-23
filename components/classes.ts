// Classes partagées entre un composant client et son équivalent serveur (repli de Suspense) :
// un module "use client" ne peut pas fournir une simple valeur à un composant serveur.
export const CLASSES_CHAMP =
  "w-full rounded-full border border-black/10 bg-surface py-2 pl-8 pr-4 text-base shadow-sm placeholder:text-doux " +
  "focus:border-pokedex focus:outline-none focus:ring-4 focus:ring-pokedex/20 disabled:opacity-40 " +
  "dark:border-white/10 dark:bg-surface-sombre dark:placeholder:text-doux-sombre";
