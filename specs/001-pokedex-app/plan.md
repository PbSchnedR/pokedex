# Implementation Plan: Application Pokédex

**Branch**: `001-pokedex-app` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-pokedex-app/spec.md`

## Summary

Pokédex de 1 025 Pokémon construit **exactement selon le cours** « Pokédex — 35 heures »
(copie locale : `cours/cours-pokedex.html`) : Next.js 16 App Router, composants serveur par
défaut, couche d'accès aux données (`lib/conversion.ts`, `lib/pokeapi.ts`) mise en cache avec
`"use cache"` + `cacheLife("days")`, état de recherche/filtre/page dans l'adresse, favoris et
sacoche en stores Zustand persistés (`skipHydration` + `HydratationStores`), hooks
personnalisés du ch. 10, Route Handler `/api/aleatoire`, déploiement Vercel.

Le socle (stories 1–7) reprend **les noms de fichiers, de fonctions et de composants du cours**
pour que chaque fichier se rattache à une leçon. Les bonus (story 8) s'ajoutent par-dessus sans
modifier ce socle : noms français issus d'un fichier généré, tri, comparateur, combat de
sacoches, quiz, glisser-déposer natif. Le thème est clair par défaut avec bascule sombre
mémorisée. La direction artistique est arrêtée en phase C (skills impeccable + taste-skill)
dans les limites du ch. 5.

## Technical Context

**Language/Version**: TypeScript (version fournie par `create-next-app@16`), Node.js LTS ≥ 20

**Primary Dependencies**: Next.js 16 (App Router, `cacheComponents`, `partialPrefetching`),
React 19, Tailwind CSS 4, Zustand (ajouté à l'étape 15, ch. 9). Aucune autre dépendance
d'exécution (décision utilisateur : glisser-déposer natif, pas de bibliothèque).

**Storage**: aucun serveur de données. PokéAPI (lecture seule, mise en cache Next.js) ;
`localStorage` du navigateur pour favoris, sacoche et thème ; fichier statique
`data/pokemons-fr.json` + `data/table-types.json` générés une fois par script (bonus).

**Testing**: Vitest en dépendance de développement (hors cours, **approuvé par l'utilisateur**,
Q-3), limité aux fonctions pures : `aplatir`, `lib/parametres.ts`, `lib/texte.ts`,
`lib/combat.ts`. Le reste : `npm run lint`, `npm run build`, scénarios manuels de
[quickstart.md](./quickstart.md) (un par story), Lighthouse en production et en ligne.

**Target Platform**: navigateurs récents (desktop et mobile, 375 px minimum), hébergement
Vercel.

**Project Type**: application web frontend Next.js (rendu serveur + îlots client), projet
unique à la racine, sans dossier `src/`.

**Performance Goals**: Lighthouse > 90 dans les 4 catégories en production ; premier contenu
utile (squelette ou cartes) < 1 s ; 151 fiches pré-générées.

**Constraints**: respecter la PokéAPI (cache obligatoire, pas de rafale d'appels au runtime) ;
peu de composants client, placés bas dans l'arbre ; animations < 0,5 s sur `transform` /
`opacity` avec `motion-reduce:` ; aucune erreur d'hydratation ; classes Tailwind jamais
construites dynamiquement.

**Scale/Scope**: 1 025 Pokémon, 18 types ; 8 routes de page + 1 Route Handler ; ~30 composants.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Vérification | Statut |
|----------|--------------|--------|
| I. Le cours fait loi | Socle = fichiers, fonctions, étapes TP du cours ; bonus en surcouche ; conflits tranchés en faveur du cours (combat entre sacoches, pagination classique) | ✅ |
| II. Architecture imposée | Next 16 / TS / Tailwind 4 `@theme` / Zustand / PokéAPI ; `cacheComponents` + `partialPrefetching` conservés ; serveur par défaut ; couche `appeler`/`versPokemon`/`recupererPokemon` ; URL validée ; stores avec règles dans les actions | ✅ |
| III. Documentation par chapitre | `docs/00…11-*.md` créés au fil des étapes ; commentaires `// ch. N —` | ✅ (prévu en tâches) |
| IV. Décisions consultées | Décisions non imposées posées à l'utilisateur (clarify + plan : 9 réponses) ; direction artistique en phase C ; Vitest approuvé (Q-3) | ✅ |
| V. Design encadré | Skills impeccable + taste-skill en phase C, bornés par le ch. 5 ; **TODO** : impeccable non installé | ⚠️ bloquant pour la phase C uniquement |
| VI. Qualité vérifiable | lint/build verts à chaque étape, Lighthouse > 90, checklist accessibilité ch. 11, états chargement/erreur/404 | ✅ |

**Re-check après Phase 1** : le design (data-model, contrats) n'introduit ni dépendance ni
composant client hors besoin ; les seuls écarts sont listés dans *Complexity Tracking* et sont
des surcouches de bonus approuvées. Gate : **PASS** (avec le TODO impeccable).

## Project Structure

### Documentation (this feature)

```text
specs/001-pokedex-app/
├── plan.md              # Ce fichier
├── research.md          # Phase 0 : décisions et justifications
├── data-model.md        # Phase 1 : types, stores, règles
├── quickstart.md        # Phase 1 : scénarios de validation
├── contracts/
│   ├── routes.md        # Adresses publiques et paramètres d'URL
│   ├── api-aleatoire.md # Route Handler /api/aleatoire
│   └── stockage-local.md# Clés et schémas localStorage
├── brief-agent.md       # Brief de l'agent développeur
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

Fichiers **en gras** = noms imposés par le cours (avec chapitre) ; les autres sont des
surcouches (bonus, thème) ou des choix documentés.

```text
app/
├── layout.tsx              # ch. 6 — lang="fr", metadata "%s · Pokédex", police, EnTete,
│                           #   PiedDePage, HydratationStores ; + script de thème (FR-023)
├── globals.css             # ch. 5 — @theme : --color-pokedex, --color-type-*, animate-apparition
│                           #   + variante dark par classe (FR-023)
├── page.tsx                # ch. 9 — Accueil + Resultats (q, type, page, tri) sous Suspense
├── loading.tsx             # ch. 7
├── error.tsx               # ch. 7 — client, retry, error: unknown
├── not-found.tsx           # ch. 6
├── pokemon/[nom]/page.tsx  # ch. 8 — Fiche sous Suspense, generateMetadata, generateStaticParams(151)
├── favoris/page.tsx        # ch. 9/10 — client, usePokemons
├── sacoche/page.tsx        # ch. 9 — membres, surnoms, emplacements vides, BoutonVider
├── comparer/page.tsx       # bonus FR-035 — ?a=&b=
├── combat/page.tsx         # bonus FR-039 — client (sacoche locale), ?adversaire=
├── quiz/page.tsx           # bonus FR-038 — client
└── api/aleatoire/route.ts  # ch. 11 (Finitions) — await connection()

components/
├── BadgeType.tsx  CartePokemon.tsx  GrillePokemons.tsx  SqueletteGrille.tsx   # ch. 4–7
├── EnTete.tsx  PiedDePage.tsx  LienNav.tsx                                    # ch. 6, 10
├── BarreRecherche.tsx  FiltreTypes.tsx  Pagination.tsx                        # ch. 9, 10
├── BarresStats.tsx                                                            # ch. 8
├── BoutonFavori.tsx  BoutonSacoche.tsx  IndicateurSacoche.tsx  BoutonVider.tsx # ch. 9
├── CompteurFavoris.tsx                                                        # ch. 9 (étape 15)
├── HydratationStores.tsx  BoutonHasard.tsx                                    # ch. 9, 11
├── BoutonTheme.tsx                                    # FR-023
├── SelecteurTri.tsx  TypesCouverts.tsx  AjoutRapide.tsx  # bonus
├── TableauComparaison.tsx  ChoixComparaison.tsx           # bonus FR-035
├── ResultatCombat.tsx  Quiz.tsx                            # bonus
└── ListeSacocheReordonnable.tsx                           # bonus FR-040

hooks/            # ch. 10 — "use client", un fichier par hook
├── usePokemons.ts  useRappelTemporise.ts  useRaccourci.ts
└── useTypesCouverts.ts                                    # bonus étape 17

lib/
├── conversion.ts   # ch. 7 — API, versPokemon (+ nomFr si bonus livré)
├── pokeapi.ts      # ch. 7–9 — appeler, recupererPokemon, recupererPlusieurs, recupererListe,
│                   #   recupererEvolutions, TOTAL_POKEMONS, recupererTousLesNoms, recupererNomsParType
├── pokeapi-client.ts # ch. 9 — chargerPokemon (navigateur)
├── types.ts        # ch. 5 — TYPES (libellé FR + classe complète), teinteType
├── parametres.ts   # ch. 9 — lireRecherche() (validation q/type/page, extraite de Resultats
│                   #   pour être testée) ; lireAdversaire() (bonus combat)
├── *.test.ts       # Vitest (Q-3) — pokeapi (aplatir), parametres, texte, combat
├── texte.ts        # bonus — normaliser() (accents, casse, espaces) pour quiz et recherche FR
├── noms-fr.ts      # bonus — accès à data/pokemons-fr.json
└── combat.ts       # bonus — multiplicateur(), scoreDuel(), combattre()

stores/
├── favoris.ts      # ch. 9 — noms, basculer ; persist "pokedex-favoris", skipHydration
└── sacoche.ts      # ch. 9 — equipe, ajouter/retirer/renommer/vider (+ deplacer, bonus)

types/pokemon.ts    # ch. 3 — Pokemon, Statistique, PokemonApi
data/               # bonus — pokemons-fr.json, table-types.json (générés, commités)
scripts/generer-donnees.mjs   # bonus — produit data/*.json depuis la PokéAPI
docs/00-demarrage.md … docs/11-finitions.md   # constitution III
cours/              # copie du cours — dans .gitignore (contenu du formateur, non republié)
next.config.ts      # cacheComponents, partialPrefetching, images.remotePatterns
vitest.config.ts    # alias @/ (Q-3)
.claude/skills/impeccable/   # skill de design (v4.10.0), utilisé en phase C (T012)
```

**Structure Decision**: projet Next.js unique à la racine, sans `src/` (ch. 0), arborescence
et noms du cours. Les bonus vivent dans des fichiers dédiés pour qu'aucun fichier du socle ne
dépende d'eux, sauf trois points d'extension documentés : `versPokemon` (champ `nomFr`),
`Resultats` (paramètre `tri`, recherche FR) et `stores/sacoche.ts` (action `deplacer`).

## Ordre de réalisation

1. Étapes TP 0 → 18 dans l'ordre du cours (stories 1 à 7), une étape = un STOP agent
   (voir [brief-agent.md](./brief-agent.md)). Le thème (FR-023) est intégré à l'étape 5–6.
2. Bonus, chacun livrable seul : noms FR (FR-033, prérequis du quiz) → tri (FR-036) →
   bonus sacoche (FR-034) → comparateur (FR-035) → glisser-déposer (FR-040) → combat (FR-039)
   → quiz (FR-038).

## Complexity Tracking

> Écarts ou ajouts par rapport au code du cours, tous approuvés par l'utilisateur.

| Écart / ajout | Pourquoi | Alternative plus simple écartée parce que |
|---------------|----------|-------------------------------------------|
| `data/pokemons-fr.json` généré par script (bonus FR-033) | Recherche FR sur 1 025 noms sans 1 025 appels au runtime | Cache serveur : premier chargement/build lents, risque de 429 (décision utilisateur) |
| `data/table-types.json` généré (bonus FR-039) | Table d'efficacité exacte, issue de la PokéAPI | Table tapée à la main : risque d'erreur silencieuse |
| Variante `dark` par classe + script de thème dans `layout.tsx` | Clair par défaut + bascule mémorisée sans flash (FR-023) | Thème selon le système seul : refusé par l'utilisateur |
| Glisser-déposer HTML5 natif + boutons monter/descendre | Pas de dépendance ; alternative clavier et mobile | dnd-kit : dépendance et JS client en plus (décision utilisateur) |
| `cours/` ignoré par Git | Ne pas republier le cours du formateur sur un dépôt public | — |
