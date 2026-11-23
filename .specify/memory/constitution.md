<!--
Sync Impact Report
==================
Version change: (template non rempli) → 1.0.0
Principes ajoutés :
  - I. Le cours fait loi (NON NÉGOCIABLE)
  - II. Architecture imposée par le cours
  - III. Documentation et justification par chapitre
  - IV. Décisions consultées (grill)
  - V. Design soigné, encadré par le cours
  - VI. Qualité vérifiable : accessibilité, performance, build
Sections ajoutées :
  - Conformité au cours, chapitre par chapitre
  - Flux de travail et portes de qualité
  - Governance
Sections supprimées : aucune
Templates : aucun template modifié (ils lisent la constitution à l'exécution).
TODO différés : aucun (1.0.1 : TODO(IMPECCABLE_SKILL) résolu, skill installé le 2026-11-23).
Source du cours : https://claude.ai/artifact/J6VJ7b5TNAbH6pUCtxauJn (lu le 2026-11-23).
-->

# Pokédex Frontend Constitution

## Core Principles

### I. Le cours fait loi (NON NÉGOCIABLE)

Le projet est une application web Pokédex (1 025 Pokémon) construite en suivant le cours
« Pokédex — 35 heures » (référence ci-dessus). Chaque point de chaque chapitre, du chapitre 0
« Démarrage » au chapitre 11 « Finitions », DOIT être inspecté et respecté.

- Toute règle, convention ou étape « TP Pokédex » du cours est une exigence du projet.
- En cas de conflit entre le cours et une autre source (skill de design, inspiration Dribbble,
  habitude personnelle, documentation tierce), **le cours l'emporte**. Les autres sources ne
  s'appliquent que dans l'espace que le cours laisse libre.
- Une déviation au cours n'est permise que si l'utilisateur l'approuve explicitement, et elle
  DOIT être consignée dans le document du chapitre concerné (voir principe III).
- La grille d'évaluation du cours (20 points) est le critère d'acceptation final du projet.

Justification : le livrable est évalué sur la conformité au cours ; une esthétique supérieure
ne compense pas un point de grille manqué.

### II. Architecture imposée par le cours

- Pile : Next.js 16 (App Router, sans dossier `src/`, alias `@/*`), React, TypeScript, Tailwind
  CSS (thème en `@theme` dans `globals.css`), Zustand, PokéAPI. Node.js LTS ≥ 20.
- `next.config.ts` DOIT conserver `cacheComponents: true` et `partialPrefetching: true`.
- Composants serveur par défaut ; `"use client"` seulement si nécessaire et le plus bas possible
  dans l'arbre. Les props serveur → client sont des données simples, jamais des fonctions.
- Accès aux données centralisé dans une couche dédiée (`appeler`, `versPokemon`,
  `recupererPokemon`) : 404 → `null`, autres échecs → erreur levée ; type brut API et type
  applicatif distincts, reliés par une fonction de conversion.
- Mise en cache via `"use cache"` et `cacheLife` pour respecter la PokéAPI.
- L'état de recherche, de filtre et de pagination vit dans l'URL (`?q=`, `?type=`, `?page=`) et
  toute entrée d'URL DOIT être validée.
- Zustand uniquement pour l'état client partagé et persistant (favoris, sacoche) ; les règles
  métier sont appliquées dans les actions du store ; aucune valeur calculable n'est stockée.
- Conventions de code du cours : `const`/`let` (jamais `var`), `===`, `??`, copies immuables,
  `type` plutôt que `interface`, exports par défaut pour pages et composants, exports nommés
  pour utilitaires et types, hooks personnalisés dans `hooks/`. Le nommage suit le cours
  (identifiants en français, ex. `recupererPokemon`, `useRappelTemporise`).

Justification : ces choix sont enseignés et évalués (« Code : types, couche d'accès aux
données, découpage »).

### III. Documentation et justification par chapitre

- Chaque choix frontend DOIT être documenté, justifié et expliqué dans `docs/`, avec un fichier
  par chapitre du cours qui produit du code :
  `docs/00-demarrage.md`, `docs/01-rappels-web.md`, `docs/02-javascript-moderne.md`,
  `docs/03-typescript.md`, `docs/04-react.md`, `docs/05-tailwind-interface.md`,
  `docs/06-nextjs.md`, `docs/07-appels-api.md`, `docs/08-routes-dynamiques.md`,
  `docs/09-interactivite-avancee.md`, `docs/10-hooks.md`, `docs/11-finitions.md`.
- Chaque entrée de ces fichiers indique : le choix, le point du cours qu'il applique, la
  justification, les alternatives écartées et les fichiers concernés.
- Le code DOIT être commenté là où un choix n'est pas évident, en citant le chapitre
  (ex. `// ch. 7 — couche d'accès aux données : 404 → null`). Pas de commentaire qui paraphrase
  le code.
- Le `README.md` présente le projet, le lancement, le déploiement, et renvoie vers `docs/`.

Justification : l'utilisateur doit pouvoir défendre chaque choix à l'évaluation (questions
ouvertes), en suivant la même structure que le cours.

### IV. Décisions consultées (grill)

- Tout choix **non imposé par le cours** DOIT être soumis à l'utilisateur avant d'être appliqué,
  sous forme de question avec options et recommandation : direction artistique, palette,
  typographie, mise en page, micro-interactions, nommage libre, bonus « Pour aller plus loin »,
  bibliothèques supplémentaires.
- Les points **imposés par le cours** sont appliqués sans question, mais documentés (principe III).
- Une décision prise est consignée dans le document du chapitre concerné et n'est pas rediscutée
  sauf demande de l'utilisateur.

Justification : l'utilisateur reste l'auteur du projet et doit en maîtriser chaque arbitrage.

### V. Design soigné, encadré par le cours

- Le design DOIT être produit avec les skills Claude **impeccable** et **taste-skill**
  (`design-taste-frontend`, et ses variantes si pertinent), et s'inspirer de références de type
  Dribbble pour viser une interface moderne, non générique.
- Skill impeccable installé le 2026-11-23 dans `.claude/skills/impeccable` (v4.10.0, dépôt
  officiel pbakaus/impeccable).
- Ces skills s'appliquent **dans les limites du chapitre 5** : quatre principes (hiérarchie,
  espace, couleur porteuse d'information, cohérence) ; teinte de carte par variable CSS locale ;
  mobile d'abord (375 px minimum), thème sombre ; animations de moins de 0,5 s sur `transform`
  et `opacity` uniquement, avec `motion-reduce:` ; pas de classes Tailwind construites
  dynamiquement (table de correspondance pour les couleurs de type).
- Toute recommandation d'un skill qui contredit le cours (bibliothèque d'animation lourde,
  multiplication des composants client, mouvement long ou bloquant) est écartée et l'écart est
  noté dans `docs/05-tailwind-interface.md`.
- Les références d'inspiration retenues sont citées dans la documentation (pas de copie d'un
  design existant).

Justification : l'objectif est un Pokédex au design de qualité sans perdre de points sur
l'accessibilité, la performance ou la conformité.

### VI. Qualité vérifiable : accessibilité, performance, build

- Accessibilité (ch. 11) : utilisable au clavier, focus visible, `alt` et libellés, un seul
  `<h1>` puis titres dans l'ordre, contraste suffisant des badges de type, `<button>` pour les
  actions et lien pour la navigation, `lang="fr"`.
- Performance : `next/image` (avec `width`/`height`, `loading="eager"` pour la grande image),
  cache, peu de composants client. Lighthouse en production > 90 dans chaque catégorie.
- `npm run lint` et `npm run build` DOIVENT passer sans erreur avant tout commit de fin d'étape.
- Aucune erreur d'hydratation (favoris et sacoche via `skipHydration` + `rehydrate()`).
- États de chargement (squelettes, `loading.tsx`, `<Suspense>`), d'erreur (`error.tsx` avec
  « Réessayer ») et 404 (`notFound()`, `not-found.tsx`) présents partout où le cours les prévoit.

Justification : ces critères sont vérifiables et figurent dans la grille d'évaluation.

## Conformité au cours, chapitre par chapitre

Chaque chapitre ci-dessous DOIT être relu dans le cours au moment de sa mise en œuvre ; la liste
résume les points obligatoires et ne remplace pas le cours.

- **Ch. 0 Démarrage** : Node LTS ≥ 20, VS Code (Tailwind IntelliSense, ESLint, Prettier), Git ;
  `create-next-app` avec TypeScript, ESLint, Tailwind, App Router, sans `src/`, alias `@/*` ;
  étape 0 : « Mon Pokédex » + premier commit.
- **Ch. 1 Rappels web** : requête/réponse, GET seul pour la PokéAPI, codes 200/404/429/500,
  JSON ; HTML sémantique (`button`, `a`, titres, listes, `alt`) ; modèle de boîte ; Grid pour la
  grille, Flexbox pour l'en-tête.
- **Ch. 2 JavaScript moderne** : `const`/`let`, gabarits, `===`, `??`, numéro formaté `#007`
  (`padStart`), fonctions fléchées, déstructuration, décomposition immuable,
  `map`/`filter`/`find`/`slice`, modules et alias `@/` ; `async`/`await`, test de `reponse.ok`,
  `Promise.all` ; étape 1.
- **Ch. 3 TypeScript** : `type`, nullables et optionnels, type API brut ≠ type applicatif,
  génériques ; étape 2 : `types/pokemon.ts`.
- **Ch. 4 React** : règles du JSX, `children`, listes avec `key` stable, rendu conditionnel sans
  `{n && …}`, champ contrôlé, état immuable, chargement côté navigateur, règles des hooks,
  `useEffect` avec dépendances et nettoyage ; étapes 3–4.
- **Ch. 5 Tailwind CSS et interface** : échelle d'espacement, mobile d'abord (`sm`/`md`/`lg`/`xl`),
  `@theme`, couleurs de type par table, thème sombre, grille 2 → 6 colonnes, quatre principes
  de design, `group-hover:`, `aria-hidden`, mouvement discret ; étapes 5–6.
- **Ch. 6 Next.js** : fichiers réservés, layout racine, `Link`, `next/image` (domaine autorisé),
  polices, `metadata` avec gabarit « %s · Pokédex », `not-found.tsx` soignée, composants
  serveur/client, hydratation ; étape 7 (coque de l'application).
- **Ch. 7 Appels API** : liste paginée (`limit`/`offset`), couche d'accès aux données,
  24 Pokémon en parallèle, `"use cache"` + `cacheLife`, `<Suspense>` + squelette,
  `loading.tsx`, `error.tsx` ; étapes 8–10 (y compris tests de panne et de lenteur).
- **Ch. 8 Routes dynamiques** : `app/pokemon/[nom]/page.tsx`, `params` promesse sous
  `Suspense`, `notFound()` vs `error.tsx`, cartes reliées aux fiches, barres de statistiques
  (seul usage de `style`), chaîne d'évolution récursive, `generateMetadata`,
  `generateStaticParams` (151 premiers) ; étapes 11–12.
- **Ch. 9 Interactivité avancée** : recherche sur 1 025 noms en cache, état dans l'URL validé,
  debounce 300 ms + `router.replace` + remise à zéro de `page`, filtre par type en liens,
  pagination `Math.ceil` ; store Zustand, sélecteurs à une valeur, `persist`, piège de
  l'hydratation, page Favoris ; sacoche (6 max, sans doublon, surnom facultatif, `Pick<>`,
  emplacements vides, vidage avec confirmation), indicateurs d'en-tête ; étapes 13–16.
- **Ch. 10 Les hooks en profondeur** : règles et ordre d'appel, `useState` fonctionnel,
  `useReducer`, `useRef` (pas de lecture pendant le rendu), `useId` (pas pour les `key`),
  `useContext`, éviter les `useEffect` inutiles, mémoïser après mesure, `useTransition`, hooks
  React 19 et Next.js (`Suspense` requis), `Link` plutôt que `router.push` pour un clic ;
  étape 17 : `usePokemons`, `useRappelTemporise`, `useRaccourci`, page courante surlignée,
  touche « / ».
- **Ch. 11 Finitions** : Route Handler JSON (`await connection()`, bouton « Au hasard »),
  variables d'environnement (`.env.local` jamais commité, `NEXT_PUBLIC_` seulement si voulu
  côté client), accessibilité, performance, vérification, README, déploiement Vercel ; étape 18.
- **Ch. 12 Évaluation finale** : pas de code ; la documentation `docs/` DOIT permettre de
  répondre aux questions ouvertes.

## Flux de travail et portes de qualité

- Les fonctionnalités suivent le flux Spec Kit (`/speckit-specify` → `/speckit-clarify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`). Chaque plan DOIT contenir une
  vérification de conformité à cette constitution et citer les chapitres du cours concernés.
- L'ordre d'implémentation suit les étapes « TP Pokédex » du cours (0 → 18).
- Fin d'étape = porte de qualité : `npm run lint` et `npm run build` verts, vérification à
  375 px et en thème sombre, documentation du chapitre mise à jour, commit Git.
- Avant publication : Lighthouse > 90 en production, favoris et sacoche vérifiés en ligne.
- Pas de dépendance ajoutée hors de la pile du cours sans accord de l'utilisateur (principe IV).

## Governance

- Cette constitution prime sur toute autre pratique du projet ; le cours prime sur elle en cas
  de contradiction factuelle (la constitution est alors corrigée).
- Amendement : proposé par l'utilisateur ou soumis à son approbation, consigné avec un rapport
  d'impact, et versionné selon SemVer : MAJEUR pour une suppression ou redéfinition de principe,
  MINEUR pour un principe ou une section ajoutés, CORRECTIF pour une clarification.
- Chaque plan, revue de tâches et analyse (`/speckit-analyze`) DOIT vérifier la conformité aux
  principes I à VI ; toute violation est justifiée dans le plan ou corrigée.

**Version**: 1.0.1 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
