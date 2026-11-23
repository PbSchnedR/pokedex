# Ch. 1 — Rappels web

> Journal des choix du chapitre (constitution, principe III). Ce chapitre ne produit pas de code
> propre : il fixe des règles appliquées dans tout le projet.

## GET uniquement vers la PokéAPI

- **Point du cours** : ch. 1, « Anatomie d'une requête » — « La PokéAPI ne propose que de la
  lecture : vous n'utiliserez que GET. »
- **Application** : toutes les lectures passent par `fetch` sans méthode (GET par défaut), dans
  la couche d'accès aux données (ch. 7). Le seul point d'API du projet, `/api/aleatoire`
  (ch. 11), est lui aussi en GET.
- **Fichiers** : `lib/pokeapi.ts` (ch. 7), `app/api/aleatoire/route.ts` (ch. 11).

## Codes de statut traités

- **Point du cours** : ch. 1, « Les codes de statut » — 200 (Pokémon renvoyé), 404 (nom
  inexistant), 429 (trop de requêtes), 500 (API en panne).
- **Application prévue** : 404 → `null` puis page « introuvable » (`notFound()`) ; tout autre
  échec (429, 500…) → erreur levée puis `error.tsx` avec « Réessayer » (ch. 7). Le 429 est
  évité en amont par la mise en cache (`"use cache"` + `cacheLife`).
- **Alternatives écartées** : traiter 404 comme une erreur (une faute de frappe afficherait
  « panne » au lieu de « introuvable »).
- **Fichiers** : `lib/pokeapi.ts`, `app/error.tsx`, `app/not-found.tsx` (à venir).

## Format JSON et unités de l'API

- **Point du cours** : ch. 1, « Le format JSON » et exercice « Lire une réponse réelle » —
  `height` en décimètres, `weight` en hectogrammes, image dans
  `sprites.other["official-artwork"].front_default`.
- **Application** : conversion en mètres et kilogrammes dans `versPokemon` (ch. 3 et 7).
- **Fichiers** : `types/pokemon.ts`, `lib/conversion.ts` (à venir).

## HTML sémantique

- **Point du cours** : ch. 1, « HTML : donner du sens » — `<button>` pour une action, `<a>`
  (ici `Link`) pour aller ailleurs, `<h1>` à `<h3>` pour les titres, `<ul>` pour une liste,
  `alt` sur toute image.
- **Application** : grille de cartes en `<ul>`/`<li>`, un seul `<h1>` par page, favoris et
  sacoche en `<button>`, navigation en `Link`, `alt` = nom du Pokémon (ch. 4 à 11).
- **Alternatives écartées** : `<div onClick>` pour les actions (inaccessible au clavier et aux
  lecteurs d'écran).

## Grid pour la grille, Flexbox pour l'en-tête

- **Point du cours** : ch. 1, « Flexbox et Grid » — « Pour la grille du Pokédex, vous
  utiliserez Grid. Pour l'en-tête, Flexbox. » ; modèle de boîte (padding intérieur, margin
  extérieur, `gap` entre enfants).
- **Application** : `GrillePokemons` en `grid grid-cols-2 … lg:grid-cols-6` (ch. 5) ;
  `EnTete` en `flex` (ch. 5–6).
- **Justification** : Grid range sur deux axes (lignes et colonnes de cartes) ; Flexbox aligne
  sur un seul axe (titre d'un côté, navigation de l'autre).
- **Fichiers** : `components/GrillePokemons.tsx`, `components/EnTete.tsx` (à venir).
