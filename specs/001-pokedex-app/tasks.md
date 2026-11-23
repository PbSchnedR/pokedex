---
description: "Liste des tâches — Application Pokédex (001-pokedex-app)"
---

# Tasks: Application Pokédex

**Input**: Design documents from `specs/001-pokedex-app/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Vitest **ciblé** (décision utilisateur Q-3, 2026-11-23) — uniquement les fonctions
pures à risque silencieux : `aplatir` (T037), validation d'adresse `lib/parametres.ts` (T046,
T092), `normaliser` (T081), combat (T092). Pas de tests de composants. Le reste se valide avec
les scénarios de [quickstart.md](./quickstart.md) et la porte de qualité (lint, **test**, build,
375 px, thème sombre, console propre, docs, commit).

**Organisation** : une phase par user story (ordre de priorité de la spec), qui suit aussi
l'ordre des étapes TP du cours. **`⏸ STOP étape N`** = fin d'une étape TP : l'agent rend son
rapport et attend le feu vert ([brief-agent.md](./brief-agent.md)).

**Avant chaque tâche** : relire la leçon citée dans `cours/cours-pokedex.html`. Le code du
cours est la référence : noms de fichiers, fonctions, composants et classes repris tels quels
sauf mention contraire.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche non terminée)
- **[USn]** : user story de la spec
- Chemins relatifs à la racine du dépôt `pokedex-frontend/` (pas de dossier `src/`)

---

## Phase 1: Setup — étapes TP 0 et 1 (ch. 0, 1, 2)

**Purpose**: projet Next.js créé selon le ch. 0, dépôt Git dédié, squelette de documentation.

- [X] T001 Vérifier Node.js LTS ≥ 20 (`node -v`), npm et Git ; dans un dossier temporaire **hors du projet** (ex. `../pokedex-tmp`), lancer `npx create-next-app@16` avec les réponses du ch. 0 : TypeScript Oui, ESLint Oui, Tailwind CSS Oui, dossier `src/` Non, App Router Oui, alias `@/*` par défaut ; copier le résultat à la racine de `pokedex-frontend/` **sans écraser** `.claude/`, `.specify/`, `specs/`, `cours/` (research R1)
- [X] T002 Vérifier que `next.config.ts` contient `cacheComponents: true` et `partialPrefetching: true` ; s'ils manquent, les ajouter et le consigner comme écart dans `docs/00-demarrage.md` (research R1, « À vérifier »)
- [X] T003 [P] Ajouter `cours/` au `.gitignore` de `pokedex-frontend/` et vérifier que `.env*.local` y figure (research R14)
- [X] T004 `git init` dans `pokedex-frontend/` ; ajouter la ligne `pokedex-frontend/` au `.gitignore` du dépôt parent `../.gitignore` (TP-B3) (research R2)
- [X] T005 Remplacer le contenu de `app/page.tsx` par la page « Mon Pokédex » de l'étape 0 ; vérifier `npm run dev` sur http://localhost:3000 ; premier commit Git
- [X] T006 Installer Vitest en dépendance de développement (`npm install -D vitest`), ajouter le script `"test": "vitest run"` dans `package.json` et `vitest.config.ts` avec l'alias `@/` vers la racine ; un premier test trivial passe ; `npm test` rejoint la porte de qualité (research R13, décision Q-3)
- [X] T007 [P] Créer `docs/00-demarrage.md` … `docs/11-finitions.md` (12 fichiers : 00-demarrage, 01-rappels-web, 02-javascript-moderne, 03-typescript, 04-react, 05-tailwind-interface, 06-nextjs, 07-appels-api, 08-routes-dynamiques, 09-interactivite-avancee, 10-hooks, 11-finitions), chacun avec le gabarit d'entrée : choix, point du cours appliqué (chapitre + leçon), justification, alternatives écartées, fichiers concernés (constitution III) ; remplir `docs/00-demarrage.md` (outils, réponses de l'assistant, R1, R2) et `docs/01-rappels-web.md` (GET seul, codes 200/404/429/500, HTML sémantique, Grid pour la grille et Flexbox pour l'en-tête)

⏸ **STOP étape 0**

- [ ] T008 [P] Étape 1, **hors du projet** (ex. `../pokedex-labo/labo.mjs`) : appeler `/pokemon?limit=10`, récupérer les 10 détails avec `Promise.all`, afficher `#001 bulbasaur — grass, poison`, provoquer une 404 et l'attraper en testant `reponse.ok` ; consigner les enseignements (`const`/`let`, `===`, `??`, `padStart`, `async`/`await`, `fetch` ne rejette pas sur 404) dans `docs/02-javascript-moderne.md`

⏸ **STOP étape 1**

---

## Phase 2: Foundational — étapes 2, 5 (socle), 7, 8 et phase C (design)

**Purpose**: types, thème Tailwind, direction artistique validée, coque de l'application,
couche d'accès aux données. Bloque toutes les stories.

**⚠️ CRITICAL**: aucune story ne commence avant la fin de cette phase.

- [ ] T009 Étape 2 : créer `types/pokemon.ts` avec `Statistique` (`nom`, `valeur`), `Pokemon` (`id`, `nom`, `image`, `types: string[]`, `taille` en mètres, `poids` en kilogrammes, `stats`) et `PokemonApi` (`id`, `name`, `height` en dm, `weight` en hg, `types`, `stats`, `sprites.other["official-artwork"].front_default: string | null`), en `type` et non `interface` ; comparer avec https://pokeapi.co/api/v2/pokemon/pikachu ; expliquer les deux types dans `docs/03-typescript.md`

⏸ **STOP étape 2**

- [ ] T010 [P] Dans `app/globals.css`, bloc `@theme` : `--color-pokedex`, les 18 `--color-type-*` du cours, et `--animate-apparition: apparition 0.4s ease-out both` avec ses `@keyframes` (opacity + translateY uniquement)
- [ ] T011 [P] Créer `lib/types.ts` : `TYPES: Record<string, { libelle: string; classe: string }>` avec les 18 types, libellé français et **classe complète** (`"bg-type-fire"`, jamais construite dynamiquement), et `teinteType(type)` qui renvoie `var(--color-type-${type})` (repli `var(--color-gray-500)`)
- [ ] T012 **Phase C — direction artistique (bloquant)** : vérifier que le skill **impeccable** est installé (sinon STOP et question Q-4) ; charger impeccable et `design-taste-frontend` ; proposer 2 ou 3 directions (couleur d'accent, neutres, typographie `next/font`, forme de carte, en-tête, micro-interactions) avec des références d'inspiration type Dribbble décrites et liées, dans les limites du ch. 5 (quatre principes, espacement 2/4/6/8, animations < 0,5 s sur `transform`/`opacity`, `motion-reduce:`) ; **aucun code d'interface avant la validation de l'utilisateur** ; consigner la direction retenue et les écarts écartés dans `docs/05-tailwind-interface.md`

⏸ **STOP C — validation de la direction artistique**

- [ ] T013 Appliquer les jetons validés en T012 dans `app/globals.css` (`@theme` : accent, neutres, rayons, ombres) sans retirer les couleurs de type ; vérifier le contraste du texte blanc sur chaque `--color-type-*` et ajuster si besoin (ch. 11)
- [ ] T014 Thème (FR-023, research R7) : dans `app/globals.css`, variante `dark` pilotée par la classe `dark` sur `<html>` (vérifier la syntaxe de la version de Tailwind installée) ; dans `app/layout.tsx`, script en ligne qui lit `localStorage["pokedex-theme"]` (`"clair"` | `"sombre"`, absent = clair) et pose la classe **avant** l'affichage ; `<html lang="fr" suppressHydrationWarning>`
- [ ] T015 [P] Créer `components/BoutonTheme.tsx` (`"use client"`) : bascule la classe `dark`, écrit `pokedex-theme`, `aria-pressed` et `aria-label` explicites ; stockage indisponible → reste en clair sans erreur ([contracts/stockage-local.md](./contracts/stockage-local.md))
- [ ] T016 [P] Créer `components/PiedDePage.tsx` : « Données : PokéAPI », PokéAPI étant un lien vers https://pokeapi.co
- [ ] T017 [P] Créer `components/EnTete.tsx` : Flexbox, titre et navigation empilés sur téléphone puis alignés aux deux extrémités à partir de `sm:` ; liens `Link` « Pokédex » (`/`), « Favoris » (`/favoris`), « Sacoche » (`/sacoche`) ; `BoutonTheme`
- [ ] T018 Étape 7 : `app/layout.tsx` — `import "./globals.css"`, police `next/font` retenue en T012, `metadata` `{ title: { default: "Pokédex", template: "%s · Pokédex" }, description }`, `EnTete`, `<main className="mx-auto max-w-6xl px-4 py-6">`, `PiedDePage`
- [ ] T019 Dans `next.config.ts`, ajouter `images.remotePatterns: [{ protocol: "https", hostname: "raw.githubusercontent.com" }]` en gardant `cacheComponents`, `partialPrefetching` et le reste ; redémarrer `npm run dev`
- [ ] T020 [P] Créer `app/not-found.tsx` : titre « Ce Pokémon s'est enfui », texte, `Link` « Retour au Pokédex » ; visiter `/nimporte-quoi` (en-tête et pied de page visibles)
- [ ] T021 Documenter l'étape 7 et les choix serveur/client, `Link`, `Image`, polices, `metadata`, page 404 dans `docs/06-nextjs.md` ; documenter le thème (R7) dans `docs/05-tailwind-interface.md` ; noter dans `docs/06-nextjs.md` l'écart de libellé « Pokédex » (au lieu de « Tous » dans le cours, étape 7) et sa raison

⏸ **STOP étape 7** (l'étape 5–6 visuelle est livrée avec US1)

- [ ] T022 Créer `lib/conversion.ts` : `export const API = "https://pokeapi.co/api/v2"` et `versPokemon(brut)` (`taille = height / 10`, `poids = weight / 10`, image official-artwork avec repli sur le sprite `…/sprites/pokemon/${id}.png`, `types` et `stats` aplatis)
- [ ] T023 Créer `lib/pokeapi.ts` : `appeler<T>(adresse)` (404 → `null`, autre `!reponse.ok` → `Error("La PokéAPI a répondu … pour …")`), `recupererPokemon(nom)` avec `"use cache"` + `cacheLife("days")` et `encodeURIComponent(nom.toLowerCase())`, `recupererPlusieurs(noms)` (`Promise.all` + filtre `(p): p is Pokemon => p !== null`), `recupererListe(limite = 24, decalage = 0)` en cache ; commenter `// ch. 7 —` aux points non évidents
- [ ] T024 Documenter la couche d'accès aux données (pourquoi 404 → `null`, pourquoi le cache, pourquoi `Promise.all`) dans `docs/07-appels-api.md`

**Checkpoint**: socle prêt (types, thème, coque, données).

---

## Phase 3: User Story 1 - Parcourir le Pokédex (Priority: P1) 🎯 MVP

**Goal**: grille de 24 vraies cartes stylisées, squelette pendant le chargement, page d'erreur.

**Independent Test**: [quickstart.md › US1](./quickstart.md) — la pagination est livrée en
Phase 5 (US3), comme dans le cours (étape 14).

- [ ] T025 [P] [US1] Créer `components/BadgeType.tsx` : lit `TYPES[type]`, repli `{ libelle: type, classe: "bg-gray-500" }`, libellé français, `rounded-full`, texte blanc lisible
- [ ] T026 [US1] Créer `components/CartePokemon.tsx` (composant serveur) : `numero = "#" + padStart(3, "0")`, variable locale `--teinte` via `teinteType(types[0])`, dégradé `from-(--teinte)/25` `aria-hidden`, numéro en filigrane `aria-hidden`, image `next/image` 160×160 avec ombre portée, `group` / `group-hover:scale-110`, soulèvement au survol, `animate-apparition`, `motion-reduce:` sur toutes les animations, nom capitalisé ; le contenu mène à `/pokemon/{nom}` par un `Link` en laissant la place à des boutons **hors** du lien (`relative` sur la carte)
- [ ] T027 [US1] Créer `components/GrillePokemons.tsx` : `<ul>` `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`, `key={pokemon.id}`, message « Aucun Pokémon » si `pokemons.length === 0` (jamais `{liste.length && …}`)
- [ ] T028 [US1] Étapes 3–4 (temporaire) : `data/exemples.ts` exporte 6 Pokémon écrits à la main ; `app/page.tsx` affiche la grille ; vérifier la liste vide et l'erreur de l'éditeur si un champ de `Pokemon` manque

⏸ **STOP étapes 3–4**

- [ ] T029 [US1] Étapes 5–6 : appliquer la direction validée (T012) à `BadgeType`, `CartePokemon` et `GrillePokemons` ; vérifier 375 px, thème sombre, réglage « réduire les animations » ; consigner les choix dans `docs/05-tailwind-interface.md` et les règles JSX/listes/clés dans `docs/04-react.md`

⏸ **STOP étapes 5–6**

- [ ] T030 [US1] Étape 8 : `app/page.tsx` affiche la carte de Pikachu chargée par `recupererPokemon("pikachu")`, et « Pokémon introuvable » pour un nom inexistant ; retirer `"use cache"` un instant, lire le message de Next.js, le remettre ; noter le message dans `docs/07-appels-api.md`

⏸ **STOP étape 8**

- [ ] T031 [US1] Étape 9 : `app/page.tsx` affiche `recupererListe(24)` dans `GrillePokemons` ; supprimer `data/exemples.ts` ; vérifier que le deuxième affichage est nettement plus rapide

⏸ **STOP étape 9**

- [ ] T032 [P] [US1] Créer `components/SqueletteGrille.tsx` (24 blocs, même grille que `GrillePokemons`, `aria-busy="true"`, `animate-pulse` + `motion-reduce:animate-none`) et `app/loading.tsx` qui l'affiche
- [ ] T033 [P] [US1] Créer `app/error.tsx` (`"use client"`) : props `{ error: unknown; retry: () => void }`, message via `error instanceof Error`, titre « Le Pokédex ne répond plus », bouton « Réessayer » qui appelle `retry()`
- [ ] T034 [US1] Dans `app/page.tsx`, `<h1>` affiché immédiatement et la liste dans un composant async sous `<Suspense fallback={<SqueletteGrille />}>`
- [ ] T035 [US1] Étape 10 : tester la panne (fausse adresse dans `API`, puis la rétablir) et la lenteur (réseau ralenti) ; documenter Suspense, `loading.tsx`, `error.tsx` dans `docs/07-appels-api.md`

⏸ **STOP étape 10**

**Checkpoint**: US1 utilisable seule (hors pagination).

---

## Phase 4: User Story 2 - Consulter la fiche d'un Pokémon (Priority: P2)

**Goal**: fiche `/pokemon/{nom}` complète, 404 et panne distinguées, titre par Pokémon, 151
fiches pré-générées.

**Independent Test**: [quickstart.md › US2](./quickstart.md)

- [ ] T036 [US2] Dans `lib/pokeapi.ts` : type `Maillon` (`species.name`, `evolves_to: Maillon[]`), `aplatir` **récursive**, `recupererEvolutions(id)` (espèce → `evolution_chain.url` → chaîne) en `"use cache"` + `cacheLife("days")`
- [ ] T037 [US2] Exporter `aplatir` (export nommé) dans `lib/pokeapi.ts` et écrire `lib/pokeapi.test.ts` (simuler `next/cache` avec `vi.mock`) : chaîne linéaire (charmander → 3 noms dans l'ordre), arbre ramifié (eevee → base + toutes les branches), maillon sans évolution (1 seul nom)
- [ ] T038 [US2] Dans `lib/pokeapi.ts` : `export const TOTAL_POKEMONS = 1025` et `recupererTousLesNoms()` (`/pokemon?limit=1025`, lève une erreur si la liste manque) en cache
- [ ] T039 [P] [US2] Créer `components/BarresStats.tsx` : `<dl>`, libellés français (`hp` PV, `attack` Attaque, `defense` Défense, `special-attack` Attaque Spé., `special-defense` Défense Spé., `speed` Vitesse), largeur de barre par `style` (seul usage légitime de `style`, ch. 8), échelle reprise du cours
- [ ] T040 [US2] Créer `app/pokemon/[nom]/page.tsx` : la page n'est **pas** async et passe la promesse `params` à `Fiche` sous `<Suspense>` ; `Fiche` fait `await params`, `recupererPokemon`, `notFound()` si `null`, image `next/image` 400×400 `loading="eager"`, numéro, types, taille (m) et poids (kg), `BarresStats`, section « Évolutions » avec `GrillePokemons` des évolutions (chacune cliquable)
- [ ] T041 [US2] Dans `app/pokemon/[nom]/page.tsx` : `generateMetadata` (titre = nom capitalisé, description « … : types, statistiques et évolutions. », `openGraph.images`, « Pokémon introuvable » si `null`)

⏸ **STOP étape 11**

- [ ] T042 [US2] Dans `app/pokemon/[nom]/page.tsx` : `generateStaticParams` qui renvoie les 151 premiers `{ nom }` de `recupererTousLesNoms()`
- [ ] T043 [US2] Étape 12 : `npm run build` liste les pages générées ; `npm start` comparé à `npm run dev` ; vérifier « Pikachu · Pokédex », `/pokemon/eevee` (branches), `/pokemon/pikachuu` → 404 ; documenter dans `docs/08-routes-dynamiques.md` (params promesse, `notFound()` vs `error.tsx`, récursion, pré-génération)

⏸ **STOP étape 12**

**Checkpoint**: US1 et US2 fonctionnent indépendamment.

---

## Phase 5: User Story 3 - Chercher et filtrer (Priority: P3)

**Goal**: recherche sur les 1 025 noms, filtre par type, pagination, le tout dans l'adresse et
validé ([contracts/routes.md](./contracts/routes.md)).

**Independent Test**: [quickstart.md › US3](./quickstart.md) + scénario 2 de US1 (pagination).

- [ ] T044 [US3] Dans `lib/pokeapi.ts` : `recupererNomsParType(type)` (liste complète ∩ `/type/{type}`, en cache, `[]` si type inconnu)
- [ ] T045 [US3] Réécrire `app/page.tsx` : `Accueil({ searchParams })` non async, `<h1>`, `BarreRecherche` sous `<Suspense fallback={<input disabled … />}>`, `Resultats` sous `<Suspense fallback={<SqueletteGrille />}>` ; `Resultats` : `PAR_PAGE = 24`, `type` pris en compte **seulement si** `type in TYPES`, filtre `includes` sur `q.trim().toLowerCase()` en **conservant l'ordre des numéros** (ordre de `recupererTousLesNoms`, aucun tri par nom — clarification « Analyse »), `nombrePages = Math.max(1, Math.ceil(n / 24))`, `pageCourante` bornée (`Number(page) || 1`), détail des seuls 24 visibles via `recupererPlusieurs`, compteur « N Pokémon », message clair si aucun résultat
- [ ] T046 [US3] Extraire la lecture des paramètres de `Resultats` dans `lib/parametres.ts` : fonction pure `lireRecherche({ q, type, page }, nombreResultats)` → `{ texte, type, pageCourante, nombrePages }`, utilisée par `app/page.tsx` ; la tester dans `lib/parametres.test.ts` : `type=licorne` ignoré, `page=abc` → 1, `page=9999` → dernière page, `page=-3` → 1, `q` entouré d'espaces → `trim` ; documenter l'extraction (même logique que le cours, forme différente) dans `docs/09-interactivite-avancee.md`
- [ ] T047 [P] [US3] Créer `components/BarreRecherche.tsx` (version du ch. 9) : `"use client"`, `useSearchParams`, champ `type="search"` avec `aria-label`, temporisation 300 ms dans un effet avec nettoyage, `router.replace`, suppression de `page` à chaque nouvelle recherche
- [ ] T048 [P] [US3] Créer `components/FiltreTypes.tsx` (serveur, sans JS client) : liens « Tous » + 18 types, conservent `q`, `aria-current` sur le type actif, `aria-label="Filtrer par type"`
- [ ] T049 [US3] Vérifier l'étape 13 ([quickstart.md › US3](./quickstart.md)) : recherche, filtre combiné, adresse copiée dans un autre onglet, `?type=licorne`

⏸ **STOP étape 13**

- [ ] T050 [US3] Créer `components/Pagination.tsx` (serveur) : renvoie `null` si `nombrePages <= 1` ; « Précédent » et « Suivant » en `Link`, inactifs (`<span>` estompé) en première et dernière page ; numéros de page avec la page courante indiquée (`aria-current="page"`) (FR-037) ; conserve `q` et `type`, n'écrit `page` que si > 1 ; `aria-label="Pagination"` ; l'afficher à la fin de `Resultats`
- [ ] T051 [US3] Étape 14 : vérifier `?page=9999`, `?page=abc`, le squelette entre deux pages, US3 scénario 5 (page 2 = n° 25 à 48) ; documenter l'état dans l'adresse, la validation et la temporisation dans `docs/09-interactivite-avancee.md`

⏸ **STOP étape 14**

**Checkpoint**: grille complète, recherchable et paginée (critères 1 et 3 de la grille).

---

## Phase 6: User Story 4 - Garder ses favoris (Priority: P4)

**Goal**: favoris Zustand persistés, étoile sur cartes et fiche, compteur, page Favoris.

**Independent Test**: [quickstart.md › US4](./quickstart.md)

- [ ] T052 [US4] `npm install zustand` ; créer `stores/favoris.ts` : `noms: string[]`, `basculer(nom)` (nouveau tableau, jamais `push`), `persist` avec `{ name: "pokedex-favoris", skipHydration: true }` ([contracts/stockage-local.md](./contracts/stockage-local.md))
- [ ] T053 [US4] Créer `components/HydratationStores.tsx` (`"use client"`, `useEffect(() => useFavoris.persist.rehydrate(), [])`, renvoie `null`) et l'ajouter en tête de `<body>` dans `app/layout.tsx`
- [ ] T054 [P] [US4] Créer `components/BoutonFavori.tsx` : sélecteurs **à une valeur** (`etat.noms.includes(nom)`, `etat.basculer`), ☆/★, `aria-pressed`, `aria-label` « Ajouter/Retirer {nom} des favoris » ; l'intégrer **hors du `Link`** dans `components/CartePokemon.tsx` (`absolute left-2 top-2 z-10`) et sur la fiche `app/pokemon/[nom]/page.tsx`
- [ ] T055 [P] [US4] Créer `components/CompteurFavoris.tsx` (client, sélecteur `etat.noms.length`) et l'afficher dans `components/EnTete.tsx` à côté du lien Favoris
- [ ] T056 [P] [US4] Créer `lib/pokeapi-client.ts` : `chargerPokemon(nom)` pour le navigateur (404 → `null`, autre échec → erreur), réutilise `versPokemon`
- [ ] T057 [US4] Créer `app/favoris/page.tsx` (`"use client"`, version du ch. 9 avec `useEffect` + annulation) : états chargement, erreur, liste vide (« Aucun favori pour le moment… »), grille ; créer `app/favoris/layout.tsx` (serveur) avec `metadata = { title: "Favoris" }` ([contracts/routes.md](./contracts/routes.md))
- [ ] T058 [US4] Étape 15 : rechargement, fermeture du navigateur, aucune erreur d'hydratation ; documenter store, sélecteurs, `persist`, piège de l'hydratation, Context vs Zustand dans `docs/09-interactivite-avancee.md`

⏸ **STOP étape 15**

**Checkpoint**: favoris complets (moitié du critère « Favoris et sacoche »).

---

## Phase 7: User Story 5 - Composer sa sacoche d'équipe (Priority: P5)

**Goal**: sacoche de 6 au plus, sans doublon, surnoms, emplacements vides, indicateur, vidage
confirmé, persistance.

**Independent Test**: [quickstart.md › US5](./quickstart.md)

- [ ] T059 [US5] Créer `stores/sacoche.ts` : `TAILLE_SACOCHE = 6`, `Membre = Pick<Pokemon, "id" | "nom" | "image" | "types"> & { surnom: string }`, `equipe: Membre[]`, `ajouter` qui **renvoie l'état inchangé si doublon d'`id` ou équipe pleine**, `retirer(id)`, `renommer(id, surnom)` par `map` avec surnom limité à **12 caractères** (`slice(0, 12)`, chaîne vide = pas de surnom), `vider()` ; `persist` `{ name: "pokedex-sacoche", skipHydration: true }` ; ne **pas** stocker `estPleine`
- [ ] T060 [US5] Ajouter `useSacoche.persist.rehydrate()` dans `components/HydratationStores.tsx`
- [ ] T061 [P] [US5] Créer `components/BoutonSacoche.tsx` : « Ajouter à la sacoche » / « Retirer de la sacoche » sur la fiche ; désactivé quand la sacoche est pleine avec le message « Sacoche pleine (6/6) » (dérivé `equipe.length >= TAILLE_SACOCHE`) ; l'intégrer dans `app/pokemon/[nom]/page.tsx`
- [ ] T062 [P] [US5] Créer `components/IndicateurSacoche.tsx` : six pastilles pleines ou vides, sélecteur sur `etat.equipe.length`, lien vers `/sacoche` ; l'afficher dans `components/EnTete.tsx`
- [ ] T063 [US5] Créer `app/sacoche/page.tsx` (`"use client"`) : membres avec image, surnom modifiable (`<input maxLength={12}>` avec libellé), types et bouton retirer ; emplacements libres **dessinés** et menant à `/` ; créer `app/sacoche/layout.tsx` avec `metadata = { title: "Sacoche" }`
- [ ] T064 [P] [US5] Créer `components/BoutonVider.tsx` : affiché seulement si la sacoche contient au moins 1 Pokémon ; 1er clic « Confirmer ? », 2e clic vide ; état « à confirmer » dans un `useState` (pas dans le store) ; l'intégrer dans `app/sacoche/page.tsx`
- [ ] T065 [US5] Étape 16 : 7ᵉ ajout refusé, doublon refusé, surnom persistant, rechargement sans erreur d'hydratation ; documenter « la règle vit dans le store », `Pick`, valeurs dérivées dans `docs/09-interactivite-avancee.md`

⏸ **STOP étape 16**

**Checkpoint**: critère « Favoris et sacoche avec Zustand » (4 pts) complet.

---

## Phase 8: User Story 6 - Navigation et finitions (Priority: P6)

**Goal**: hooks du ch. 10, page courante surlignée, touche « / », bouton « Au hasard »,
accessibilité complète.

**Independent Test**: [quickstart.md › US6](./quickstart.md)

- [ ] T066 [P] [US6] Créer `hooks/usePokemons.ts` (`"use client"`, renvoie `{ pokemons, etat }`) et réécrire `app/favoris/page.tsx` pour qu'il ne contienne plus de `useEffect`
- [ ] T067 [P] [US6] Créer `hooks/useRappelTemporise.ts` (`useRef` pour le minuteur et le dernier rappel, `useEffect` de nettoyage, `useCallback` stable)
- [ ] T068 [US6] Réécrire `components/BarreRecherche.tsx` (version finale du ch. 10) : `useRappelTemporise` appelé depuis `onChange`, `useTransition` + indicateur « Recherche… », plus aucun `useEffect` ; vérifier que « Précédent » revient bien à l'écran d'avant
- [ ] T069 [P] [US6] Créer `hooks/useRaccourci.ts` et l'utiliser dans `components/BarreRecherche.tsx` avec `useRef` : la touche « / » place le curseur dans le champ, sauf si l'utilisateur écrit déjà dans un `INPUT`/`TEXTAREA`
- [ ] T070 [P] [US6] Créer `components/LienNav.tsx` (`usePathname`, `aria-current="page"` sur la page courante) ; dans `components/EnTete.tsx`, chaque `LienNav` sous un `<Suspense>` avec le texte du lien en fallback

⏸ **STOP étape 17**

- [ ] T071 [US6] Créer `app/api/aleatoire/route.ts` selon [contracts/api-aleatoire.md](./contracts/api-aleatoire.md) : `await connection()`, id aléatoire dans 1–`TOTAL_POKEMONS`, 200 avec le `Pokemon`, 404 `{ erreur: "Pokémon introuvable" }`
- [ ] T072 [US6] Créer `components/BoutonHasard.tsx` : `fetch("/api/aleatoire")`, `router.push("/pokemon/" + nom)`, désactivé et « Tirage… » pendant l'appel, `finally` ; l'ajouter dans `components/EnTete.tsx`
- [ ] T073 [US6] Passer la liste de contrôle d'accessibilité du ch. 11 sur toutes les pages : clavier (Tab, Entrée), `focus-visible` partout, `alt` et libellés, un seul `<h1>` puis `<h2>` dans l'ordre, contraste des badges, `<button>` pour les actions et lien pour la navigation, `motion-reduce` ; corriger dans `app/**` et `components/**`, ajuster `--color-type-*` dans `app/globals.css` si un badge manque de contraste
- [ ] T074 [US6] Documenter les hooks (règles, ordre d'appel, choix de chaque hook, pourquoi pas `useEffect` pour une saisie) dans `docs/10-hooks.md` ; Route Handler, `connection()`, variables d'environnement (`.env.local` jamais commité, `NEXT_PUBLIC_`) et accessibilité dans `docs/11-finitions.md`

**Checkpoint**: critère « Qualité de l'interface » prêt pour l'audit.

---

## Phase 9: User Story 7 - Publier et justifier (Priority: P7)

**Goal**: application en ligne, README, documentation complète, score Lighthouse.

**Independent Test**: [quickstart.md › US7](./quickstart.md)

- [ ] T075 [US7] Écrire `README.md` : description du projet, captures d'écran, lancement (`npm install`, `npm run dev`), déploiement, lien vers `docs/`
- [ ] T076 [US7] `npm run lint` et `npm run build` sans erreur ; `npm start` + Lighthouse (performance, accessibilité, bonnes pratiques, référencement) : chaque score > 90, sinon corriger (`next/image`, `loading="eager"`, cache, composants client) ; consigner les scores et le First Contentful Paint (cible < 1 s, SC-003) dans `docs/11-finitions.md`
- [ ] T077 [US7] **Avec l'utilisateur** (action publique, son compte) : créer le dépôt GitHub, `git push`, importer le projet sur Vercel avec les réglages proposés ; noter l'adresse publique dans `README.md`
- [ ] T078 [US7] Étape 18 : Lighthouse sur **l'adresse Vercel** (4 catégories > 90, SC-004), scores consignés dans `docs/11-finitions.md` ; tester le site en ligne sur un téléphone ; favoris et sacoche persistants en ligne ; remplir dans `docs/11-finitions.md` l'auto-évaluation des 8 critères de la grille (20 pts) avec la preuve de chacun ; vérifier que `docs/00` à `docs/11` sont complets

⏸ **STOP étape 18** — socle terminé (20/20 visés)

---

## Phase 10: User Story 8 - Bonus « Pour aller plus loin » (Priority: P8)

**Goal**: bonus approuvés, chacun livrable seul, sans régression du socle.

**Independent Test**: [quickstart.md › US8](./quickstart.md), puis US1–US7 rejoués.

**Prérequis**: Phase 9 validée. Ordre imposé : noms FR → tri → bonus sacoche → comparateur →
glisser-déposer → combat → quiz. Un STOP par bonus.

### Noms français (FR-033, research R5)

- [ ] T079 [US8] Créer `scripts/generer-donnees.mjs` (Node, lancé à la main) : `/pokemon-species/{id}` pour 1–1 025 par lots de 20 avec une pause entre lots → `data/pokemons-fr.json` (`[{ id, nom, nomFr }]` trié par `id`, `nomFr` = entrée `names` où `language.name === "fr"`) ; `/type/{nom}` pour les 18 types → `data/table-types.json` (`Record<attaquant, Record<défenseur, 0 | 0.5 | 1 | 2>>` d'après `double_damage_to`, `half_damage_to`, `no_damage_to`, sinon 1) ; l'exécuter et commiter les deux fichiers
- [ ] T080 [P] [US8] Créer `lib/texte.ts` : `normaliser(t)` = NFD, suppression des diacritiques (`\p{Diacritic}` ou repli `[̀-ͯ]`), minuscules, `trim` (research R6)
- [ ] T081 [P] [US8] Écrire `lib/texte.test.ts` : « Salamèche », « salameche » et « SALAMECHE  » donnent la même valeur ; « Évoli » → « evoli » ; chaîne vide → chaîne vide
- [ ] T082 [US8] Créer `lib/noms-fr.ts` (accès à `data/pokemons-fr.json`, `nomFrancais(id)` avec repli sur `nom`) ; ajouter `nomFr: string` à `Pokemon` dans `types/pokemon.ts` et le remplir dans `versPokemon` (`lib/conversion.ts`) ; afficher `nomFr` dans `CartePokemon`, la fiche, `generateMetadata`, la sacoche **via `nomFrancais(membre.id)` à l'affichage — ne jamais ajouter `nomFr` à `Membre`** (valeur calculable : constitution II ; et forme de `pokedex-sacoche` inchangée, donc aucune migration), les `aria-label` ; adresses et clés restent en anglais
- [ ] T083 [US8] Dans `Resultats` (`app/page.tsx`), la recherche compare `normaliser(q)` à `normaliser(nomFr)` **uniquement** (un nom anglais ne trouve rien) ; le tri par nom suit `nomFr` ; mesurer le poids ajouté au JS client (research R5) et documenter dans `docs/11-finitions.md`

⏸ **STOP bonus noms FR**

### Tri (FR-036)

- [ ] T084 [US8] Créer `components/SelecteurTri.tsx` (liens serveur `?tri=numero` / `?tri=nom`, `aria-current`) ; dans `Resultats`, valider `tri` (`numero` | `nom`, sinon `numero`) et trier **avant** le découpage en pages ; `FiltreTypes`, `Pagination` et `BarreRecherche` conservent `tri`

⏸ **STOP bonus tri**

### Bonus sacoche (FR-034)

- [ ] T085 [P] [US8] Créer `hooks/useTypesCouverts.ts` (types distincts de `equipe`, calculés, jamais stockés) et `components/TypesCouverts.tsx` (badges) ; l'afficher dans `app/sacoche/page.tsx`
- [ ] T086 [US8] Créer `components/AjoutRapide.tsx` (client) sur chaque carte, **hors du `Link`**, qui appelle `ajouter` ; désactivé avec libellé explicite si pleine ou déjà présent ; l'intégrer dans `components/CartePokemon.tsx`

⏸ **STOP bonus sacoche**

### Comparateur (FR-035)

- [ ] T087 [US8] Créer `app/comparer/page.tsx` (lecture de `searchParams` `a` et `b` sous `<Suspense>`) et `app/comparer/layout.tsx` (`metadata` « Comparer ») ; `components/TableauComparaison.tsx` aligne les 6 statistiques et met en évidence la meilleure valeur de chaque ligne ; nom inconnu → message dans sa colonne, pas de 404 global
- [ ] T088 [US8] Ajouter un lien « Comparer » sur la fiche vers `/comparer?a={nom}` ; créer `components/ChoixComparaison.tsx` (client) : champ de recherche qui écrit `b` dans l'adresse

⏸ **STOP bonus comparateur**

### Glisser-déposer (FR-040, research R9)

- [ ] T089 [US8] Ajouter `deplacer(depuis, vers)` dans `stores/sacoche.ts` (indices hors bornes → état inchangé, ordre persistant)
- [ ] T090 [US8] Créer `components/ListeSacocheReordonnable.tsx` : glisser-déposer HTML5 natif (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) **et** boutons « Monter » / « Descendre » utilisables au clavier ; l'utiliser dans `app/sacoche/page.tsx`

⏸ **STOP bonus glisser-déposer**

### Combat de sacoches (FR-039, research R10)

- [ ] T091 [P] [US8] Créer `lib/combat.ts` : `multiplicateur(attaquant, defenseur)` = max sur les types attaquants du produit des efficacités contre chaque type défenseur (`data/table-types.json`) ; `scoreDuel(A, B)` = somme des 6 stats de base de A × `multiplicateur(A.types, B.types)` ; `combattre(equipeA, equipeB)` → duels dans l'ordre, vainqueur par score (égalité = duel nul), issue = plus de duels gagnés (égalité = match nul) ; aucune part d'aléatoire ([data-model.md](./data-model.md))
- [ ] T092 [US8] Écrire `lib/combat.test.ts` (à partir de `data/table-types.json`) : immunité ×0 (normal contre ghost), double faiblesse ×4 et double résistance ×0,25 (valeurs lues dans la table), choix du meilleur type attaquant, duel nul à score égal, match nul à victoires égales, même entrée = même résultat ; ajouter `lireAdversaire(valeur)` à `lib/parametres.ts` (1 à 6 ids entiers uniques entre 1 et 1 025, sinon `null`) avec ses tests dans `lib/parametres.test.ts`
- [ ] T093 [US8] Créer `app/combat/page.tsx` (`"use client"`) et `app/combat/layout.tsx` (`metadata` « Combat ») : lire et valider `?adversaire=` (1 à 6 ids uniques entre 1 et 1 025, ramené à la taille de la sacoche) ; s'il est absent ou invalide, tirer une sacoche adverse et l'écrire avec `router.replace` ; charger les stats des deux équipes avec `chargerPokemon` ; `components/ResultatCombat.tsx` affiche chaque duel (scores, multiplicateurs, vainqueur) et l'issue ; bouton « Nouvel adversaire » ; sacoche vide → message et lien vers le Pokédex

⏸ **STOP bonus combat**

### Quiz silhouettes (FR-038, research R11)

- [ ] T094 [US8] Créer `app/quiz/page.tsx` et `app/quiz/layout.tsx` (`metadata` « Quiz ») ; `components/Quiz.tsx` (client) : tirage via `/api/aleatoire`, image en `brightness-0` avec un `alt` qui ne révèle pas le nom (« Silhouette mystère »), saisie libre avec libellé, réponse vide refusée, comparaison `normaliser(saisie) === normaliser(nomFr)`, révélation + « Juste » / « Faux », bouton « Suivant »
- [ ] T095 [US8] Ajouter les liens « Combat » et « Quiz » dans `components/EnTete.tsx` (via `LienNav`) ; documenter chaque bonus et ses écarts dans `docs/11-finitions.md` (section « Pour aller plus loin ») ; rejouer [quickstart.md](./quickstart.md) US1–US7 pour vérifier l'absence de régression

⏸ **STOP bonus quiz**

---

## Phase 11: Polish & Cross-Cutting Concerns

- [ ] T096 Rejouer tout [quickstart.md](./quickstart.md) en production (`npm start`) et sur le site en ligne ; Lighthouse > 90 dans les 4 catégories après les bonus
- [ ] T097 [P] Relire `docs/00` à `docs/11` : chaque choix lié à son chapitre, décisions Q-n citées, aucune section vide (SC-008)
- [ ] T098 [P] Nettoyage : aucun `console.log`, aucun code mort, aucun fichier temporaire (`data/exemples.ts` supprimé) ; `npm run lint` et `npm run build` verts ; dernier push → redéploiement Vercel

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** : bloque tout. T012 (phase C) bloque T013
  et tout travail visuel.
- **US1 → US2 → US3 → US4 → US5 → US6 → US7** : ordre du cours, exécuté **séquentiellement**
  (un agent, un STOP par étape TP).
- **US8 (bonus)** : seulement après la validation de US7.
- **Polish** : en dernier.

### User Story Dependencies

- **US1** : socle seul.
- **US2** : réutilise `GrillePokemons` (US1) pour les évolutions.
- **US3** : réutilise `SqueletteGrille` (US1) et `recupererTousLesNoms` (US2, T038).
- **US4** : intègre l'étoile dans `CartePokemon` (US1) et la fiche (US2).
- **US5** : bouton sur la fiche (US2), `HydratationStores` (US4).
- **US6** : réécrit `BarreRecherche` (US3) et la page Favoris (US4).
- **US7** : toutes les précédentes.
- **US8** : noms FR (T079–T083) avant quiz (T094) ; `table-types.json` (T079) avant combat
  (T091) ; `deplacer` (T089) avant T090.

### Within Each Story

Données et types → composants serveur → îlots client → intégration dans les pages →
validation [quickstart.md](./quickstart.md) → documentation `docs/` → commit → STOP.

### Parallel Opportunities

Le flux prévu est séquentiel (un agent, des STOP). Les tâches [P] peuvent néanmoins être
écrites dans le même lot :
- Phase 2 : T010, T011 ; puis T015, T016, T017, T020.
- US1 : T032 et T033.
- US4 : T054, T055, T056.
- US5 : T061, T062, T064.
- US6 : T066, T067, T069, T070.
- US8 : T080 avec T079 ; T085 ; T091.

## Parallel Example: User Story 5

```text
Après T059–T060 (store + hydratation) :
Task: "T061 BoutonSacoche dans components/BoutonSacoche.tsx"
Task: "T062 IndicateurSacoche dans components/IndicateurSacoche.tsx"
Task: "T064 BoutonVider dans components/BoutonVider.tsx"
Puis T063 (page Sacoche, qui assemble) et T065 (validation + docs).
```

---

## Implementation Strategy

### MVP First

1. Phase 1 + Phase 2 (y compris la phase C : direction artistique validée).
2. Phase 3 (US1) : grille réelle stylisée, squelette, erreur → **STOP et validation**.
3. Déploiement possible dès ce point pour une démonstration (la mise en ligne officielle reste
   T077).

### Incremental Delivery

Chaque étape TP = un incrément validé (STOP) et commité. Après US3, les critères 1 et 3 de la
grille sont couverts ; après US5, le critère 4 ; après US7, les 20 points. Les bonus viennent
ensuite, un par un, sans toucher au socle sauf aux trois points d'extension documentés dans
[plan.md](./plan.md) (`versPokemon`, `Resultats`, `stores/sacoche.ts`).

## Notes

- Exercices du cours non repris comme tâches (ils servent à apprendre, pas au produit) :
  `carte.html`, `Titre`, `Compteur`, `Recherche` locale, bouton favori à état local, compteur
  dans l'onglet, page `/a-propos`. Leurs notions sont documentées dans `docs/` du chapitre.
- Avant le commit final : retirer le rapport d'impact (commentaire HTML) en tête de
  `.specify/memory/constitution.md`.
