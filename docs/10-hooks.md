# Ch. 10 — Les hooks en profondeur

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Règles des hooks appliquées partout

- **Point du cours** : ch. 10, « Les règles et l'ordre d'appel » — un hook s'appelle au premier
  niveau d'un composant ou d'un autre hook, jamais dans un `if`, une boucle ou une fonction
  imbriquée, et toujours dans le même ordre ; son nom commence par `use` ; un hook renvoie des
  données et des fonctions, pas du JSX.
- **Application** : dans `BarreRecherche`, `BoutonFavori`, `BoutonSacoche`, etc., tous les hooks
  sont appelés en tête du composant, avant tout `return` conditionnel (par exemple `BoutonVider`
  lit le store et son `useState` **avant** le `return null` de la sacoche vide). ESLint
  (`react-hooks`, configuration de `create-next-app`) le vérifie : `npm run lint` passe.
- **Rangement** : `hooks/`, un fichier par hook, nommé comme le hook, avec `"use client"` en tête
  (ch. 10, « Où ranger ses hooks ? »).

## Quel hook pour quel besoin

| Hook | Où | Pourquoi ce hook |
|---|---|---|
| `useState` | `BarreRecherche` (texte saisi), `BoutonVider` (« à confirmer ») | état propre à un seul composant ; rien de partagé |
| `useSyncExternalStore` | `BoutonTheme` | lire une source extérieure à React (la classe de `<html>`) sans la recopier dans un état ; valeur serveur distincte, donc pas d'erreur d'hydratation |
| `useEffect` | `usePokemons`, `useRaccourci`, `HydratationStores`, nettoyage de `useRappelTemporise` | synchroniser avec l'extérieur (réseau, `window`, `localStorage`) après l'affichage, avec nettoyage |
| `useRef` | `useRappelTemporise` (minuteur, dernier rappel), `BarreRecherche` (le champ, pour la touche « / ») | garder une valeur ou un élément sans provoquer de nouvel affichage ; jamais lu pendant le rendu |
| `useCallback` | `useRappelTemporise` (fonction renvoyée), `BarreRecherche` (`focaliser`) | fonction stable : `useRaccourci` ne réabonne pas son écouteur à chaque affichage |
| `useTransition` | `BarreRecherche` | marquer la navigation comme non urgente et afficher « Recherche… » pendant qu'elle se fait |
| `usePathname`, `useSearchParams`, `useRouter` | `LienNav`, `BarreRecherche`, `BoutonHasard` | hooks de Next.js ; lus sous `<Suspense>` (exigence de Next.js 16 avec `cacheComponents`) |
| `useFavoris`, `useSacoche` | boutons, compteurs, pages | hooks fabriqués par Zustand : lisent un store hors des composants, avec un sélecteur à une valeur |

- **Non utilisés, volontairement** : `useReducer` (aucun état local à plusieurs transitions
  liées), `useContext` (Zustand fait le partage, sans Provider), `useMemo` / `memo` (le cours :
  mémoïser **après mesure** ; aucune lenteur mesurée), `useId` (les champs de surnom ont déjà un
  identifiant stable tiré du numéro), `useOptimistic`, `useActionState` (pas de formulaire envoyé
  au serveur).

## Étape 17 — `usePokemons` : la page Favoris sans `useEffect`

- **Point du cours** : ch. 10, `hooks/usePokemons.ts` et nouvelle `app/favoris/page.tsx`.
- **Choix** : code du cours ; la page garde son `<h1>` et ses messages (étape 15).
- **Vérifié** : la page Favoris s'affiche comme avant (vide → invitation, avec favoris → grille) ;
  `app/favoris/page.tsx` ne contient plus de `useEffect`.
- **Fichiers** : `hooks/usePokemons.ts`, `app/favoris/page.tsx`.

## `useRappelTemporise` et la `BarreRecherche` finale : pourquoi pas un `useEffect` pour une saisie

- **Point du cours** : ch. 10, « éviter les `useEffect` inutiles » — un effet qui « surveille » la
  valeur saisie pour naviguer est une réaction à un **événement** déguisée : c'est dans
  `onChange` qu'il faut agir. `useRappelTemporise` temporise le rappel (300 ms) au lieu de la
  valeur ; `useTransition` donne l'indicateur « Recherche… ».
- **Défaut de la version du ch. 9, corrigé ici** : l'effet comparait le texte saisi à `q` de
  l'adresse ; après « Précédent », l'adresse changeait, l'effet repartait et réécrivait l'ancienne
  recherche dans l'adresse.
- **Vérifié** (développement) : depuis `/`, clic sur « Feu » (`?type=fire`), frappe « c », « ch »,
  « char » → `?type=fire&q=char`, indicateur « Recherche… » vu pendant la navigation, résultats
  dans l'ordre des numéros (Charmander, Charmeleon, Charizard, Chimchar, Charcadet) ; « Précédent »
  → `/`, et l'adresse **reste** `/` 3 s plus tard.
- **Limite connue du code du cours** : après « Précédent », le champ affiche encore « char »
  (l'état `texte` n'est initialisé qu'une fois depuis l'adresse), alors que la grille montre tous
  les Pokémon. Non corrigé : ce serait un ajout au code du cours.
- **Fichiers** : `hooks/useRappelTemporise.ts`, `components/BarreRecherche.tsx`.

## `useRaccourci` et `useRef` : la touche « / »

- **Point du cours** : ch. 10, `hooks/useRaccourci.ts` ; la touche est ignorée dans un `INPUT` ou
  un `TEXTAREA` (FR-022).
- **Choix** : `BarreRecherche` passe un `focaliser` stable (`useCallback`) qui appelle
  `champ.current?.focus()` ; le texte d'aide du champ devient « Rechercher (touche /) ».
- **Vérifié** : « / » hors d'un champ → le focus va dans la recherche ; « / » dans le champ →
  l'événement n'est pas annulé, la barre oblique s'écrit.
- **Fichiers** : `hooks/useRaccourci.ts`, `components/BarreRecherche.tsx`, `app/page.tsx` (texte
  du champ de repli).

## `LienNav` : la page courante surlignée

- **Point du cours** : ch. 10, `components/LienNav.tsx` — `usePathname`, `aria-current="page"` ;
  `/` n'est actif que sur `/`, les autres liens par préfixe.
- **Choix** : style de la direction (pilule pleine rouge, texte blanc, au lieu du souligné du
  cours) via `aria-[current=page]:` ; chaque lien est sous un `<Suspense>` dont le repli est son
  texte (T070). `IndicateurSacoche` utilise aussi `LienNav` ; ses pastilles passent en blanc
  quand le lien est actif.
- **Vérifié** : `/` → « Pokédex » actif ; `/favoris` → « Favoris » ; `/sacoche` → « Sacoche » ;
  une fiche → aucun (captures à 375 px, clair et sombre).
- **Fichiers** : `components/LienNav.tsx`, `components/EnTete.tsx`,
  `components/IndicateurSacoche.tsx`.
