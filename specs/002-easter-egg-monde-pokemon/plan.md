# Implementation Plan: Easter egg « Monde Pokémon »

> **Mise à jour 2026-11-23** : le jeu est désormais un jeu web original en Rust/WebAssembly servi
> en local (dépôt `<dossier-des-projets>\pokemonde`, voir son `docs/etape3.md`) ; le
> lanceur, le protocole `pokemonde://` et le mod Horizon sont abandonnés. Restent valables : le
> déclencheur secret (5 activations du logo en moins de 3 s, au clavier aussi), le `<dialog>` natif
> avec l'animation du cube, et le code de sacoche (`contracts/code-sacoche.md`), transmis par
> `http://127.0.0.1:8765/?sacoche=<code>` et importé à l'ouverture d'une partie (plus de commande
> `/sacoche`). Le site déployé ne contient pas le jeu.

**Branch**: `002-easter-egg-monde-pokemon` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-easter-egg-monde-pokemon/spec.md`

## Summary

Un secret sur le site Pokédex (5 activations du logo, cube animé, 3 choix de difficulté) ouvre, par une
adresse `pokemonde://`, un **lanceur** installé sur l'ordinateur. Le lanceur prépare un monde unique de
512 × 512 blocs et lance Horizon dans une instance dédiée. Un **mod Horizon natif** y remplace toutes les
créatures par les 151 premiers Pokémon, dessinés en images 2D. Il ajoute aussi la capture par Poké
Ball, les apparitions par biome typé, un Pokédex en jeu et l'import de la sacoche du site par un code.

Approche (research.md) : **pas de fork du moteur**. L'API de mods couvre l'annulation des apparitions,
les créatures et projectiles de mod et le dessin personnalisé (vérifié dans la doc). **Quatre points
restent à prouver** par des spikes avant de construire (S1 à S4) ; le plus risqué est la détection
d'une Poké Ball qui touche un Pokémon (S3 : aucun crochet trouvé).

## Technical Context

**Language/Version**: site : TypeScript 5, Next.js 16.4.6 et React 19.3 (pile du cours, inchangée).
Jeu : Rust 1.95 ou plus récent (exigé par `cargo horizon-mod`).

**Primary Dependencies**: site : **aucune nouvelle** (`<dialog>` et CSS 3D natifs, Web Crypto).
Jeu : `horizon-mod-api` (crate `mod_api`), `cargo-horizon-mod`. Le lanceur et le générateur pourront
utiliser des crates courantes (lecture d'adresse, JSON, appels HTTP) : la liste sera proposée à
l'utilisateur dans les tâches, puisque le jeu est hors du périmètre de la constitution.

**Storage**: site : rien de nouveau (lecture du store `sacoche` de la spec 001). Jeu : sauvegarde du
monde par Horizon, données attachées au joueur, fichier de réglages du mod.

**Testing**: site : Vitest (déjà approuvé en spec 001) pour `lib/codeSacoche.ts` et le compteur de
clics. Jeu : `cargo test` (validation d'adresse, lecture du code, règle de capture) et outils de test du
mod (`docs/modding/src/concepts/testing.md`). Bout en bout : `quickstart.md`, à la main.

**Target Platform**: site : navigateurs, déployé sur Vercel. Jeu et lanceur : **Windows 11 x64
uniquement** (poste de l'utilisateur ; FR-021).

**Project Type**: application web existante, plus un projet de bureau séparé (mod, lanceur et outil).

**Performance Goals**: moins de 30 s entre le clic et le contrôle du personnage (SC-001) ;
Lighthouse supérieur à 90 maintenu (SC-007) ; animation du cube de moins de 0,5 s.

**Constraints**: le jeu fonctionne hors ligne ; aucun fichier de Minecraft dans les dépôts ; adresse
`pokemonde://` traitée comme une entrée hostile ; rien n'est publié (FR-021, FR-022).

**Scale/Scope**: 151 espèces (environ 170 types de créatures avec les variantes sauvages), 4 à 6 biomes
typés, 1 monde, 1 joueur.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitution régit le **site**. Le projet de jeu est hors cours ; il est cité ici seulement là où il
touche le site.

| Principe | Vérification | État |
|---|---|---|
| I. Le cours fait loi | Bonus hors cours **demandé explicitement** par l'utilisateur (spec, Input et Clarifications) ; il ne modifie aucune règle du cours ; il est consigné dans la documentation (voir III). La spec 001 reste prioritaire. | ✅ |
| II. Architecture | `EnTete` reste un composant serveur ; `"use client"` seulement dans `LogoPokedex` et `PorteMondePokemon`, au plus bas de l'arbre ; props simples ; hook `useCompteurClics` dans `hooks/` ; `type`, exports par défaut pour les composants, exports nommés pour `lib/` ; identifiants en français ; aucune dépendance ajoutée. | ✅ |
| III. Documentation par chapitre | Entrées ajoutées dans `docs/05-tailwind-interface.md` (cube, `motion-reduce`), `docs/09-interactivite-avancee.md` (export de la sacoche), `docs/10-hooks.md` (`useCompteurClics`), et une page `docs/bonus-monde-pokemon.md` qui rassemble le bonus et renvoie au dépôt du jeu (page en plus de la liste du principe III, validée par l'utilisateur, T001). | ✅ |
| IV. Décisions consultées | 10 décisions posées (specify et clarify). Les 5 décisions de ce plan (nom du protocole `pokemonde://`, lanceur en Rust, recette de la Poké Ball fer + redstone + bouton, correspondance biomes → types de research R8, page `docs/bonus-monde-pokemon.md`) ont été **validées par l'utilisateur le 2026-11-23** (T001). | ✅ |
| V. Design | Animation de moins de 0,5 s, `transform` et `opacity` seulement, `motion-reduce:` ; cube dessiné pour le projet (pas de texture Minecraft) ; aucune classe Tailwind construite dynamiquement. | ✅ |
| VI. Qualité | `<dialog>` natif (focus, Échap) ; déclencheur au clavier (Entrée) ; liens pour ouvrir le jeu, boutons pour les actions ; aucun impact attendu sur Lighthouse (petit composant client chargé avec l'en-tête : **à mesurer**) ; `npm run lint` et `npm run build` à chaque étape. | ✅ |

**Gate** : passe. Les deux ⚠️ ne sont pas des violations mais des choix à faire valider (principe IV),
regroupés dans le résumé final.

**Re-check après la phase 1** : les contrats et le modèle ne contredisent rien. Point ajouté : le code
de sacoche réutilise le type `Membre` de la spec 001 avec `Pick<>` (ch. 3), et ne stocke rien de
calculable (II). ✅

## Project Structure

### Documentation (this feature)

```text
specs/002-easter-egg-monde-pokemon/
├── plan.md              # ce fichier
├── research.md          # phase 0 : décisions R1-R12, spikes S1-S4
├── data-model.md        # phase 1
├── quickstart.md        # phase 1 : 16 scénarios de validation
├── contracts/
│   ├── adresse-pokemonde.md   # site → lanceur
│   └── code-sacoche.md        # site → jeu
└── tasks.md             # phase 2 (/speckit-tasks)
```

### Source Code

**Dépôt du site** (ce dépôt) : ajouts seulement.

```text
components/
├── EnTete.tsx                 # modifié : le texte du logo devient <LogoPokedex />
├── LogoPokedex.tsx            # "use client" : lien d'accueil + compteur de 5 activations
└── PorteMondePokemon.tsx      # "use client" : <dialog>, cube, 3 liens pokemonde://, message de repli
hooks/
└── useCompteurClics.ts        # enveloppe React de lib/compteurClics.ts
lib/
├── compteurClics.ts           # règle pure « 5 activations en moins de 3 s » (testable sans React)
├── compteurClics.test.ts
├── mondePokemon.ts            # table constante des 3 difficultés → adresse
├── codeSacoche.ts             # creerCodeSacoche (contrat code-sacoche)
└── codeSacoche.test.ts        # vecteurs de test partagés
app/sacoche/                   # (spec 001) + bouton « Exporter vers le Monde Pokémon »
docs/bonus-monde-pokemon.md    # à approuver (Constitution Check III)
```

**Dépôt du jeu** (nouveau, hors OneDrive, ex. `<dossier-des-projets>\pokemonde`) :

```text
Cargo.toml                     # espace de travail
mod/                           # mod Horizon natif « pokemonde »
├── horizon-mod.toml
├── src/                       # crochets : apparitions, capture, difficulté, Pokédex, /sacoche
├── data/pokemonde/horizon/    # entity_type/*.json, item/*.json (générés)
└── assets/pokemonde/          # illustrations, textures, traductions (générées)
lanceur/                       # programme du protocole pokemonde:// ; --installer / --desinstaller
outils/generer-especes/        # PokéAPI → données et images du mod (une fois)
monde-modele/                  # graine et monde de 512 × 512 (sans fichier Minecraft)
tests/vecteurs-sacoche.json    # partagés avec le site
```

**Structure Decision** : deux dépôts. Le site garde sa structure du cours et ne reçoit que de petits
ajouts. Tout ce qui touche Horizon vit à part, parce que c'est hors cours, sur Windows uniquement et
non évalué. Le dépôt de 880 Mo d'Horizon **n'est ni forké ni cloné** : le mod dépend de
`horizon-mod-api` par git.

## Ordre de réalisation

1. **Spikes S1 à S4** (research.md). Chacun a un repli décidé à l'avance ; tout repli qui change ce que
   voit le joueur est soumis à l'utilisateur.
2. P1 : lanceur et monde, remplacement des créatures, dessin 2D, secret sur le site.
3. P2 : Poké Ball et capture.
4. P3 : biomes typés.
5. P4 : Pokédex en jeu.
6. P5 : code de sacoche (après l'étape TP 16 de la spec 001).

## Complexity Tracking

| Écart | Pourquoi | Alternative plus simple écartée parce que |
|---|---|---|
| Deuxième dépôt (jeu) | Rust et Horizon, hors pile du cours | Le mettre dans ce dépôt mélangerait du code non évalué avec le livrable noté, et casserait `npm run build` et le lint |
| Programme lanceur | Valider l'adresse hostile, préparer le monde et la difficulté | Appeler `horizon-launcher` directement depuis le protocole : pas de validation, pas de choix de difficulté |
