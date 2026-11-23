# Ch. 2 — JavaScript moderne

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Étape 1 — laboratoire hors du projet

- **Point du cours** : ch. 2, leçon « Promesses, async et await », étape 1 — « Toujours dans
  `labo.mjs`, hors du projet Next.js ».
- **Choix** : le script vit dans `../pokedex-labo/labo.mjs` (dossier frère, non suivi par le
  dépôt du Pokédex). Il reprend la correction du cours et ajoute l'affichage des 10 noms
  (première case de l'étape) et un exemple de `??`.
- **Exécution** (`node labo.mjs`, 2026-11-23) :

  ```text
  bulbasaur, ivysaur, venusaur, charmander, charmeleon, charizard, squirtle, wartortle, blastoise, caterpie
  #001 bulbasaur — grass, poison
  #002 ivysaur — grass, poison
  …
  #006 charizard — fire, flying
  …
  #010 caterpie — bug
  Erreur 404 sur /pokemon/pikachuu
  Inconnu
  ```

- **Alternatives écartées** : écrire le labo dans le projet (le cours le place dehors ; il
  aurait été lu par ESLint et TypeScript sans servir l'application).
- **Fichiers** : `../pokedex-labo/labo.mjs` (hors dépôt).

## Enseignements appliqués dans tout le projet

| Point du cours (ch. 2) | Règle retenue | Où on le retrouvera |
|---|---|---|
| « Déclarer » | `const` par défaut, `let` si la valeur change, jamais `var` | partout |
| « Conditions et comparaisons » | `===` / `!==` toujours (`==` convertit en silence : `"25" == 25`) | partout |
| idem | `??` pour une valeur de secours si `null`/`undefined` ; `?.` pour lire sans planter | `versPokemon` (image de repli), surnoms |
| Exercice « Formater un numéro » | `` `#${String(id).padStart(3, "0")}` `` → `#007`, `#150` | `CartePokemon` |
| « Fonctions » | fonctions fléchées, valeurs par défaut des paramètres (`limite = 24, decalage = 0`) | `recupererListe` |
| « Objets et tableaux » | déstructuration ; copies par décomposition (`[...liste, x]`, `{ ...objet }`), jamais `push` sur un état | stores Zustand, `useState` |
| « Méthodes de tableau » | `map` (cartes), `filter` (recherche, type), `find`, `slice` (pagination) ; `sort` sur une copie | `Resultats`, grille |
| « Modules » | export par défaut pour pages et composants, exports nommés pour utilitaires et types ; alias `@/` = racine | tout le projet |
| « Promesses, async et await » | `fetch` **ne rejette pas** sur 404/500 : tester `reponse.ok` ; `Promise.all` pour des appels en parallèle | `appeler`, `recupererPlusieurs` (ch. 7) |

- **Justification** : ces règles sont celles du cours et figurent dans la constitution
  (principe II, « Conventions de code du cours »).
