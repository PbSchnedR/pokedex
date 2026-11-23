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
