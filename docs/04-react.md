# Ch. 4 — React

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Découpage en composants : `BadgeType`, `CartePokemon`, `GrillePokemons`

- **Point du cours** : ch. 4, « Les composants », « Les props », étapes 3 et 4.
- **Choix** : trois composants **serveur** (aucun état, aucun événement) avec export par défaut
  et nom en majuscule :
  - `BadgeType({ type })` : un badge ;
  - `CartePokemon({ pokemon })` : reçoit un `Pokemon` complet (type du ch. 3) ;
  - `GrillePokemons({ pokemons })` : la liste.
  Les props sont en lecture seule ; les données descendent de la page vers la grille, puis vers
  la carte et ses badges.
- **Fichiers** : `components/BadgeType.tsx`, `components/CartePokemon.tsx`,
  `components/GrillePokemons.tsx`.

## Règles du JSX appliquées

- **Point du cours** : ch. 4, « Les règles du JSX » — majuscule pour un composant, un seul
  élément racine (fragment `<>…</>` sinon), accolades pour le JavaScript, `className`, balises
  toujours fermées.
- **Application** : `app/page.tsx` renvoie un fragment (titre + grille) ; `<Image … />` fermée ;
  classes en `className`.

## Listes : `map` et `key` stable

- **Point du cours** : ch. 4, « Afficher une liste » — « Chaque élément d'une liste porte une
  prop key unique et stable […] N'utilisez pas l'index du tableau si la liste peut être triée
  ou filtrée. »
- **Choix** : `key={pokemon.id}` dans la grille (la liste sera filtrée et paginée au ch. 9) ;
  `key={type}` pour les badges (un Pokémon n'a jamais deux fois le même type).
- **Alternatives écartées** : l'index (faux dès que la liste est filtrée), `Math.random()`
  (change à chaque affichage).

## Rendu conditionnel : jamais `{liste.length && …}`

- **Point du cours** : ch. 4, « Afficher sous condition » — `{pokemons.length && <Grille />}`
  affiche « 0 » quand la liste est vide.
- **Choix** : `GrillePokemons` teste `if (pokemons.length === 0)` et renvoie le message
  « Aucun Pokémon à afficher. » (FR-004).
- **Vérifié** : avec `pokemons={[]}` (modification temporaire de la page), le HTML servi
  contient « Aucun Pokémon à afficher. ».

## Étapes 3–4 : données écrites à la main

- **Point du cours** : étape 4 — « Un fichier `data/exemples.ts` exporte un tableau de 6 Pokémon
  écrits à la main ».
- **Choix** : `exemples` (Bulbizarre, Salamèche, Carapuce, Pikachu, Ectoplasme, Dracolosse),
  valeurs relevées sur la PokéAPI, une seule statistique comme dans l'objet d'exemple du cours.
  Fichier temporaire, supprimé à l'étape 9.
- **Vérifié** : un objet `Pokemon` sans `poids` est refusé par TypeScript :
  `error TS2741: Property 'poids' is missing in type … but required in type 'Pokemon'.`
  (fichier d'essai créé puis supprimé, `npx tsc --noEmit`).
- **Fichiers** : `data/exemples.ts` (temporaire), `app/page.tsx`.

## Carte déjà au style de la direction validée

- **Constat** : la tâche T026 décrit déjà la carte finale de l'étape 6 (teinte, filigrane,
  `next/image`, survol, apparition). La direction artistique étant validée avant ces étapes, la
  carte est écrite directement dans sa forme « vignette » ; l'étape 5–6 (T029) en vérifie le
  rendu et documente les choix visuels dans `docs/05-tailwind-interface.md`. Le cours fait
  d'abord une carte nue avec `<img>` (étape 3), puis `next/image` à l'étape 7 : ici `next/image`
  est utilisé d'emblée puisque l'étape 7 est déjà faite.
