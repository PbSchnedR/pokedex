# Ch. 7 — Appels API

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Couche d'accès aux données : `conversion.ts` + `pokeapi.ts`

- **Point du cours** : ch. 7, leçon « Une couche d'accès aux données » — « On ne laisse pas
  d'adresses d'API éparpillées dans les pages. Deux fichiers : l'un convertit les données,
  l'autre les charge. » Code du cours repris tel quel.
- **Choix** :
  - `lib/conversion.ts` : `API` (adresse de base) et `versPokemon(brut)`, seul endroit qui
    connaît la forme de la réponse : `height / 10` (m), `weight / 10` (kg), illustration
    officielle avec **repli** sur le sprite `…/sprites/pokemon/{id}.png` (`??`) quand elle vaut
    `null`, `types` et `stats` aplatis.
  - `lib/pokeapi.ts` : `appeler<T>` (privée), `recupererPokemon`, `recupererPlusieurs`,
    `recupererListe`. Les pages demandent « donne-moi ce Pokémon » sans savoir d'où il vient.
- **Fichiers** : `lib/conversion.ts`, `lib/pokeapi.ts`.

## Pourquoi 404 → `null` et le reste → erreur

- **Point du cours** : ch. 7 (« Un 404 n'est pas une panne, c'est « ça n'existe pas » ») et
  ch. 1 (codes 200 / 404 / 429 / 500).
- **Justification** : un nom inconnu doit mener à la page « introuvable » (`notFound()`, ch. 8),
  une panne (429, 500, réseau) à `error.tsx` avec « Réessayer ». Le type de retour
  `Pokemon | null` oblige chaque appelant à traiter le cas « introuvable ».
- **Alternatives écartées** : lever une erreur aussi sur 404 (une faute de frappe afficherait
  « panne ») ; renvoyer `null` pour toute erreur (une panne passerait pour « introuvable »).

## Pourquoi le cache (`"use cache"` + `cacheLife("days")`)

- **Point du cours** : ch. 7, leçons sur `"use cache"` et « Régler la durée du cache » — la
  PokéAPI demande de mettre les réponses en cache ; les données d'un Pokémon ne changent presque
  jamais → profil `days`. Règle de Next.js 16 : toute donnée lue sur le serveur est soit en
  cache, soit sous un `<Suspense>`.
- **Choix** : `recupererPokemon` et `recupererListe` commencent par `"use cache"` puis
  `cacheLife("days")`. Les arguments servent de clé : `recupererPokemon("pikachu")` et
  `recupererPokemon("mew")` ont chacun leur entrée. Import `cacheLife` depuis `next/cache`,
  vérifié dans la documentation de la version installée (`node_modules/next/dist/docs/…/cacheLife.md`).
- **Alternatives écartées** : pas de cache (1 + 24 appels à chaque visite, risque de 429).

## Pourquoi `Promise.all`

- **Point du cours** : ch. 7, « Charger 24 Pokémon d'un coup » ; ch. 2, « Plusieurs appels en
  parallèle ».
- **Justification** : la liste ne donne que des noms ; il faut 24 appels de détail. `map` lance
  les 24 appels sans attendre et `Promise.all` attend qu'ils soient tous tenus, dans l'ordre.
  Une boucle avec `await` à chaque tour serait environ 24 fois plus longue. Le
  `filter((p): p is Pokemon => p !== null)` écarte les `null` et le dit à TypeScript. Si un seul
  appel échoue, tout échoue : « mieux vaut une erreur claire qu'une grille à trous ».
- **Fichiers** : `lib/pokeapi.ts`.

## Étape 8 — de vraies données

- **Point du cours** : ch. 7, étape 8 — la page d'accueil affiche la carte de Pikachu chargée par
  `recupererPokemon("pikachu")`, « Pokémon introuvable » pour un nom inexistant ; retirer
  `"use cache"` un instant et lire le message de Next.js ; supprimer `data/exemples.ts`.
- **Vérifié** :
  - `/` sert la carte de Pikachu (`alt="pikachu"` dans le HTML), en clair et en sombre à 375 px ;
  - avec `recupererPokemon("pikachuu")` (modification temporaire), la page affiche
    « Pokémon introuvable. » : le 404 de l'API devient `null`, pas une erreur.
- **Message de Next.js sans `"use cache"`** (deux essais, puis fichier restauré à l'identique,
  `git diff` vide) :
  1. Retirer **seulement** la directive laisse `cacheLife("days")` hors cache ; Next.js 16.4
     s'arrête d'abord sur cette erreur (page en 500) :
     `` Route "/": `cacheLife()` can only be called inside a `"use cache"` or `"use cache: private"` function. ``
  2. En retirant aussi `cacheLife`, on obtient le message visé par le cours (page servie, erreur
     dans le terminal et la console) :
     `Route "/": Next.js encountered uncached data during prerendering.` puis
     `` `fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route from
     being prerendered, blocking the page load […] `` et trois solutions : `[stream]` un
     `<Suspense fallback>`, `[cache]` `"use cache"`, `[block]` `export const instant = false`.
  C'est la règle de Next.js 16 rappelée par le cours : une donnée lue sur le serveur est soit en
  cache, soit sous un `<Suspense>`.
- **Écart d'ordre** : `data/exemples.ts` est supprimé dès l'étape 8, comme le demande la liste de
  l'étape 8 du cours (la tâche T031 le plaçait à l'étape 9) ; plus aucun fichier ne l'importait.
- **Fichiers** : `app/page.tsx`, `data/exemples.ts` (supprimé).

## Étape 9 — la grille complète

- **Point du cours** : ch. 7, étape 9 — `app/page.tsx` affiche `recupererListe(24)` dans
  `GrillePokemons` ; appels en parallèle ; cache de plusieurs jours ; « le deuxième affichage est
  nettement plus rapide ».
- **Vérifié** (serveur de développement) :
  - 24 cartes, n° 1 à 24 dans l'ordre des numéros (#001 Bulbasaur → #024 Arbok), à 375 px
    (2 colonnes, pas de défilement horizontal) et à 1 280 px (6 colonnes), en clair et en sombre ;
  - temps de réponse de `/` mesurés avec `curl` : **4,07 s** à la première visite (1 appel de liste
    + 24 appels de détail), puis **0,20 s** et **0,28 s** : les visites suivantes lisent le cache.
- **Fichiers** : `app/page.tsx`.

## Étape 10 — prévoir l'attente et la panne

### `<Suspense>` et squelette

- **Point du cours** : ch. 7, « Suspense : afficher la page sans attendre » — le titre part tout
  de suite, la liste (composant serveur async `ListeChargee`) arrive dans un `<Suspense>` dont le
  `fallback` est `SqueletteGrille`.
- **`SqueletteGrille`** : code du cours (24 blocs, même grille, `aria-busy="true"`,
  `animate-pulse`), avec deux ajustements : la forme reprend la vignette de la direction (cadre,
  champ carré, trois barres) au lieu d'un bloc `h-64`, pour que la page ne saute pas à l'arrivée
  des cartes ; `motion-reduce:animate-none` (ch. 5 : animations coupées sur demande).
- **`app/loading.tsx`** : code du cours, `Suspense` automatique autour de la page entière.
- **Vérifié** :
  - lenteur : serveur redémarré avec un cache vide et réseau du navigateur ralenti (latence 2 s,
    50 Ko/s, émulation Chrome) ; capture à 2,5 s : titre « Pokédex » affiché et 24 blocs de
    squelette ; à la fin, 24 cartes et plus aucun `aria-busy` ;
  - thème sombre : squelette capturé en sombre à 375 px (liste retardée de 6 s par une
    modification temporaire, retirée ensuite) ;
  - au build, `/` reste pré-rendue (`○ /`, cache `1d` / `1w`) : en production, le squelette ne
    se voit que si le cache est vide.

### `error.tsx`

- **Point du cours** : ch. 7, « error.tsx » — composant client (le bouton réagit au clic, et il
  attrape aussi les erreurs du navigateur), props `{ error: unknown; retry: () => void }`,
  message via `error instanceof Error`, titre « Le Pokédex ne répond plus », bouton « Réessayer ».
  La prop `retry` est bien celle de Next.js 16.4 (vérifié dans
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`).
- **Choix** : code du cours, bouton au style de la direction (pilule, états du ch. 5).
- **Vérifié — panne** (fausse adresse dans `API`, puis rétablie, `git diff` vide ensuite) :
  - **piège constaté** : une fausse adresse **sur le bon domaine**
    (`https://pokeapi.co/api/v2-panne`) ne déclenche pas `error.tsx` : la PokéAPI répond 404,
    `appeler` renvoie `null` comme prévu, `recupererListe` renvoie `[]` et la page affiche
    « Aucun Pokémon à afficher. ». C'est le comportement voulu du cours (404 = « n'existe pas »),
    mais ce n'est pas une panne ;
  - avec un **domaine inexistant** (`https://pokeapi-panne.invalid/api/v2`), `fetch` rejette
    (`ENOTFOUND`), l'erreur remonte et `error.tsx` s'affiche dans le layout (en-tête et pied de
    page conservés) : « Le Pokédex ne répond plus », message `fetch failed`, bouton
    « Réessayer » ; vu à 375 px en sombre et à 1 280 px en clair ;
  - « Réessayer » pendant la panne : l'erreur reste affichée ; adresse rétablie puis
    « Réessayer » : la grille revient (24 cartes), sans recharger la page.
- **Fichiers** : `components/SqueletteGrille.tsx`, `app/loading.tsx`, `app/error.tsx`,
  `app/page.tsx`.
