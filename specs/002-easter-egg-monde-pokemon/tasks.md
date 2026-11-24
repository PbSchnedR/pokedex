---

description: "Liste des tâches de l'easter egg « Monde Pokémon »"
---

# Tasks: Easter egg « Monde Pokémon »

**Input**: Design documents from `/specs/002-easter-egg-monde-pokemon/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: le plan prévoit des tests unitaires (Vitest côté site, déjà approuvé en spec 001 ; `cargo test`
côté jeu) pour les règles pures : validation d'adresse, compteur de clics, règle de capture, code de
sacoche. Le reste se vérifie à la main avec `quickstart.md`.

**Organization**: tâches regroupées par user story (US1 à US5 = P1 à P5 de la spec).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : peut se faire en parallèle (fichiers différents, aucune dépendance sur une tâche non finie)
- **[Story]** : user story concernée (US1 à US5)
- **[-] … ~~barré~~** : tâche abandonnée le 2026-11-23 (jeu web local au lieu du lanceur et du mod Horizon, voir la note en tête de spec.md et plan.md) ; gardée pour l'historique.

## Path Conventions

- **Site** : chemins relatifs à la racine de ce dépôt (`components/`, `hooks/`, `lib/`, `app/`, `docs/`).
- **Jeu** : chemins préfixés par `pokemonde/` = le **dépôt séparé**
  `<dossier-des-projets>\pokemonde` (hors OneDrive, plan « Structure Decision »).
- Règle de la constitution pour toute tâche du site : identifiants en français, `type` plutôt
  qu'`interface`, `"use client"` au plus bas, aucune dépendance ajoutée, commentaire qui cite le chapitre
  quand le choix n'est pas évident.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: décisions en attente, prérequis du poste, squelette du dépôt du jeu

- [X] T001 Faire valider par l'utilisateur les 5 décisions du plan (nom `pokemonde://`, lanceur en Rust, recette de la Poké Ball fer + redstone + bouton, correspondance biomes → types de research R8, page `docs/bonus-monde-pokemon.md`) et consigner les réponses dans la ligne « IV. Décisions consultées » de specs/002-easter-egg-monde-pokemon/plan.md
- [-] ~~T002 Vérifier sur le poste : Minecraft Java 26.3 installé et lancé une fois, `horizon-launcher` dans le PATH et connecté, `rustc --version` ≥ 1.95, puis `cargo install --locked --git https://github.com/horizon-rust/horizon cargo-horizon-mod` ; noter les versions dans pokemonde/README.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T003 Créer le dépôt `pokemonde/` (git init) avec un espace de travail pokemonde/Cargo.toml (membres `mod`, `lanceur`, `outils/generer-especes`) et un pokemonde/.gitignore qui exclut `target/` et tout fichier de Minecraft (`*.jar`, `assets/minecraft/`)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T004 [P] Générer le mod natif avec `cargo horizon-mod new pokemonde` dans pokemonde/mod/ (id `pokemonde`) ; vérifier qu'il se construit avec `cargo horizon-mod build`~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T005 [P] Créer le binaire Rust pokemonde/lanceur/ (Cargo.toml, src/main.rs vide qui affiche sa version)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T006 [P] Créer le binaire Rust pokemonde/outils/generer-especes/ (Cargo.toml, src/main.rs vide)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T007 Créer l'instance Horizon `PokeMonde` avec le launcher (commande d'instance à lire dans `docs/launcher-commands.md` du dépôt Horizon) et y installer le mod de T004 ; noter les commandes exactes dans pokemonde/README.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: prouver les 4 hypothèses à risque (research S1 à S4), puis poser les données communes

**⚠️ CRITICAL**: aucune user story ne commence tant que les spikes ne sont pas tranchés. Tout repli qui
change ce que voit le joueur est soumis à l'utilisateur avant de continuer.

### Spikes (ordre = risque décroissant d'après research.md, mais S3 est le plus incertain)

- [-] ~~T008 Spike S1 : enregistrer à la main `HKCU\Software\Classes\pokemonde` (`URL Protocol`, `shell\open\command`) vers un script jetable qui exécute `horizon-launcher play --instance PokeMonde --world SpikeS1` ; cliquer sur `pokemonde://jouer?difficulte=normal` depuis Chrome et Edge ; noter le résultat (fenêtre de confirmation du navigateur, temps d'ouverture) dans la section R1 de specs/002-easter-egg-monde-pokemon/research.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T009 Spike S1 (suite) : dans pokemonde/mod/src/lib.rs, lancer une commande serveur `gamemode survival` quand le joueur entre dans le monde ; vérifier qu'elle s'applique ; noter le crochet utilisé dans la section R8 de research.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T010 Spike S2 : dans pokemonde/mod/src/lib.rs, mettre `event.spawn_cancelled = true` dans `finalize_spawn` pour toute créature hors de l'espace de noms `pokemonde` ; tester 10 min d'apparitions naturelles, un œuf d'apparition, un générateur de monstres et `/summon minecraft:zombie` ; noter ce qui passe à travers et la parade dans la section R3 de research.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T011 Spike S2 (dessin) : déclarer pokemonde/mod/data/pokemonde/horizon/entity_type/pikachu.json (`{"template": "minecraft:pig"}`) avec une texture de test, et un `EntityRenderer` dans pokemonde/mod/src/rendu.rs qui dessine un plan tourné vers la caméra (`ClientHost::camera()` lu dans un crochet client) ; à défaut, deux plans croisés en X ; noter la solution retenue dans la section R5 de research.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T012 Spike S3 : déclarer l'objet `pokemonde:poke_ball` et le projectile pokemonde/mod/data/pokemonde/horizon/entity_type/poke_ball.json (`{"template": "minecraft:snowball", "item": "pokemonde:poke_ball"}`) ; tenter de détecter « la Poké Ball touche une créature » par (1) le crochet de dégâts refusés, (2) un parcours des projectiles à chaque tour de jeu ; noter le résultat dans la section R6 de research.md. Si les deux échouent : **demander à l'utilisateur** d'accepter la capture par clic droit~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T013 Spike S4 : attacher une donnée au joueur (compteur) dans pokemonde/mod/src/lib.rs, fermer et rouvrir le monde, vérifier qu'elle est conservée ; ouvrir un écran de test par une touche, avec une liste défilante de 3 images ; noter le résultat dans la section R7 de research.md~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T014 Mettre à jour la table « Spikes » de specs/002-easter-egg-monde-pokemon/research.md (réussi ou repli pour S1 à S4) et retirer le code jetable des spikes de pokemonde/mod/src/lib.rs~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

### Données et types communs

- [-] ~~T015 Écrire pokemonde/outils/generer-especes/src/main.rs : pour les n° 1 à 151, lire la PokéAPI (`pokemon-species/{n}` pour le nom français et `capture_rate`, `pokemon/{n}` pour les types et l'illustration officielle), en séquence avec une pause entre les appels ; écrire pokemonde/mod/assets/pokemonde/especes.json (`numero` 1–151, `nom`, `types` 1 ou 2, `tauxCapture` « entier 3–255 »), les illustrations dans pokemonde/mod/assets/pokemonde/textures/entity/, les noms dans pokemonde/mod/assets/pokemonde/lang/fr_fr.json, et un fichier pokemonde/mod/data/pokemonde/horizon/entity_type/<nom>.json par espèce (`template` passif) plus `<nom>_sauvage.json` (`template` `minecraft:zombie`) si l'un des types est Spectre, Ténèbres ou Poison~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T016 Lancer `cargo run -p generer-especes`, vérifier 151 espèces dans especes.json, et lister dans pokemonde/README.md les espèces « sauvages » obtenues (vérifie la déduction de research R4 : aucune de type Ténèbres)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T017 [P] Charger especes.json au démarrage du mod dans pokemonde/mod/src/especes.rs (recherche par `numero` et par type de créature)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T018 [P] Créer le type `Difficulte` dans pokemonde/mod/src/difficulte.rs : uniquement `"paisible" | "normal" | "difficile"`, lu depuis les réglages du mod, toute autre valeur refusée (valeur par défaut : `normal`, avec un message dans le journal)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

**Checkpoint**: hypothèses tranchées, données prêtes ; les user stories peuvent commencer

---

## Phase 3: User Story 1 - Entrer dans le monde Pokémon en un clic (Priority: P1) 🎯 MVP

**Goal**: secret sur le site → choix de difficulté → jeu ouvert dans le monde de 512 × 512 où toutes les
créatures sont des Pokémon dessinés en 2D.

**Independent Test**: quickstart scénarios 1 à 7 et 13 à 16.

### Tests for User Story 1

- [-] ~~T019 [P] [US1] Tests `cargo test` de la validation d'adresse dans pokemonde/lanceur/src/adresse.rs : acceptés = les 3 adresses `pokemonde://jouer?difficulte=<paisible|normal|difficile>` (schéma insensible à la casse) ; refusés = autre action, paramètre inconnu ou en double, valeur hors liste, caractères encodés (`%`), plus de 64 caractères, `pokemonde://jouer?difficulte=../../x`~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [X] T020 [P] [US1] Tests Vitest de la règle du compteur dans lib/compteurClics.test.ts : 5 activations en moins de 3 s → déclenché ; 4 → non ; 5 étalées sur plus de 3 s → non ; remise à zéro après déclenchement — *Fait le 2026-11-23 : `lib/compteurClics.test.ts`.*

### Implementation for User Story 1 (jeu)

- [-] ~~T021 [US1] Implémenter la validation dans pokemonde/lanceur/src/adresse.rs selon specs/002-easter-egg-monde-pokemon/contracts/adresse-pokemonde.md (T019 passe)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T022 [US1] Implémenter pokemonde/lanceur/src/main.rs dans l'ordre du contrat : valider ; vérifier Horizon et l'instance `PokeMonde` (sinon fenêtre « ce qui manque », FR-005) ; recopier le monde modèle si `MondePokemon` est absent ou illisible ; écrire la difficulté dans les réglages du mod ; exécuter `horizon-launcher play --instance PokeMonde --world MondePokemon` avec des arguments fixes. Adresse invalide → fenêtre « Lien Monde Pokémon invalide », jeu non lancé~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T023 [US1] Implémenter `--installer` et `--desinstaller` dans pokemonde/lanceur/src/installation.rs : enregistrement et retrait de `HKCU\Software\Classes\pokemonde`, copie du mod et du monde modèle dans l'instance~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T024 [P] [US1] Choisir une graine qui donne 4 à 6 biomes cibles (research R8) à moins de 256 blocs du centre, générer le monde, fixer la bordure (`worldborder` de 512 centrée), et livrer le monde dans pokemonde/monde-modele/ avec pokemonde/monde-modele/README.md (graine, coordonnées du centre, biomes présents)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T025 [US1] Implémenter dans pokemonde/mod/src/apparitions.rs l'annulation de toute apparition hors espace de noms `pokemonde`, la parade trouvée en T010 pour les œufs, générateurs et `/summon`, et le retrait des créatures d'origine présentes à l'ouverture du monde (FR-006)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T026 [US1] Dans pokemonde/mod/src/apparitions.rs, faire apparaître des espèces paisibles tirées au hasard partout (règle provisoire remplacée en US3) ; non hostiles (FR-008)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T027 [US1] Dans pokemonde/mod/src/apparitions.rs, faire apparaître les variantes `_sauvage` **uniquement en Difficile et la nuit** ; vérifier qu'elles disparaissent au lever du jour (cas limite de la spec)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T028 [US1] Généraliser le dessin de T011 à toutes les espèces et variantes dans pokemonde/mod/src/rendu.rs (illustration de chaque espèce, taille selon la hitbox du modèle)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T029 [US1] Appliquer la difficulté quand le joueur entre, dans pokemonde/mod/src/difficulte.rs, selon la table de research R8 : Paisible = créatif, difficulté du jeu paisible, toujours de jour ; Normal = survie, difficulté du jeu paisible, toujours de jour, tout dégât refusé ; Difficile = survie, difficulté du jeu normale, cycle jour/nuit~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

### Implementation for User Story 1 (site)

- [X] T030 [P] [US1] Implémenter la règle pure dans lib/compteurClics.ts (export nommé, 5 activations, fenêtre de 3 000 ms, horloge passée en paramètre pour les tests) ; T020 passe — *Fait le 2026-11-23 : `lib/compteurClics.ts`.*
- [-] ~~T031 [P] [US1] Créer lib/mondePokemon.ts : table constante des 3 difficultés (`libelle`, `description` de la spec FR-001c, `href` constant `pokemonde://jouer?difficulte=…`), jamais construite à partir d'une saisie~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [X] T032 [US1] Créer hooks/useCompteurClics.ts (ch. 10 : `useRef` pour les horodatages, pas de lecture pendant le rendu), qui enveloppe lib/compteurClics.ts — *Fait le 2026-11-23 : `hooks/useCompteurClics.ts`.*
- [X] T033 [US1] Créer components/PorteMondePokemon.tsx (`"use client"`) : `<dialog>` natif ouvert par `showModal()`, titre, cube CSS 3D (6 faces, `transform` et `opacity` uniquement, moins de 0,5 s, `motion-reduce:` = simple apparition, couleurs du `@theme`, aucune texture Minecraft), puis 3 liens `<a>` de lib/mondePokemon.ts ; après un clic, si `document.hasFocus()` est encore vrai après 2 s, afficher « Si rien ne s'est ouvert, le Monde Pokémon n'est pas installé sur cet ordinateur » (FR-023) ; Échap et un bouton « Fermer » — *Fait le 2026-11-23 : adaptée : un seul lien « Entrer dans le Monde Pokémon » vers `http://127.0.0.1:8765/?sacoche=<code>` (nouvel onglet) au lieu des 3 difficultés ; « jeu absent » détecté par une requête `no-cors` seulement quand le site tourne en local.*
- [X] T034 [US1] Créer components/LogoPokedex.tsx (`"use client"`) : le `Link href="/"` avec ses classes actuelles, qui compte chaque activation (clic ou Entrée) avec useCompteurClics et ouvre PorteMondePokemon à la 5e, sans empêcher la navigation vers l'accueil — *Fait le 2026-11-23 : `components/LogoPokedex.tsx`.*
- [X] T035 [US1] Remplacer le `Link` du titre par `<LogoPokedex />` dans components/EnTete.tsx (EnTete reste un composant serveur) — *Fait le 2026-11-23 : `components/EnTete.tsx` : import `Link` retiré, import `LogoPokedex` ajouté, `<Link …>Mon Pokédex</Link>` remplacé par `<LogoPokedex />`.*
- [X] T036 [US1] Porte de qualité : `npm run lint`, `npm run build` et `npx vitest run` verts ; vérifier à 375 px, en thème sombre et au clavier ; jouer les scénarios 1 à 7 et 13 à 16 de specs/002-easter-egg-monde-pokemon/quickstart.md et noter le temps du scénario 5 (SC-001 : moins de 30 s) — *Fait le 2026-11-23 : lint, build et Vitest verts ; secret vérifié dans Chrome sans fenêtre (5 clics → ouvert, 4 → non, Entrée au clavier).*

**Checkpoint**: MVP jouable : secret → monde Pokémon sans aucun mob d'origine

---

## Phase 4: User Story 2 - Capturer des Pokémon (Priority: P2)

**Goal**: lancer une Poké Ball, capture réussie ou ratée selon le taux officiel, collection du joueur.

**Independent Test**: quickstart scénario 9.

### Tests for User Story 2

- [-] ~~T037 [P] [US2] Tests `cargo test` de la règle de capture dans pokemonde/mod/src/capture.rs : `chance = max(tauxCapture / 255, 0,05)` ; 255 → 1,0 ; 45 → environ 0,176 ; 3 → 0,05~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

### Implementation for User Story 2

- [-] ~~T038 [P] [US2] Finaliser l'objet Poké Ball (texture, nom « Poké Ball » dans fr_fr.json) et la recette validée en T001 dans pokemonde/mod/data/pokemonde/recipe/poke_ball.json~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T039 [US2] Implémenter la règle de capture dans pokemonde/mod/src/capture.rs (T037 passe), avec un tirage dans l'aléatoire du monde~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T040 [US2] Créer la collection attachée au joueur dans pokemonde/mod/src/collection.rs : `membres` = liste de `MembreCollection { numero, surnom, origine }` avec `surnom` « 0 à 12 caractères, "" = pas de surnom » et `origine` « "capture" ou "sacoche" » ; sauvegardée avec le monde (méthode de T013)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T041 [US2] Brancher la détection de T012 dans pokemonde/mod/src/capture.rs : sur un Pokémon touché, tirer la capture ; si réussie, retirer le Pokémon du monde et l'ajouter à la collection (`origine` `"capture"`) ; dans les deux cas, afficher le résultat au joueur (message et particules). Une Poké Ball qui ne touche rien se brise (comportement de la boule de neige, toujours le même)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T042 [US2] À la première entrée en Normal ou Difficile, afficher au joueur comment fabriquer des Poké Balls (scénario 3 de la story) dans pokemonde/mod/src/difficulte.rs ; en Paisible, Poké Ball présente dans l'inventaire créatif~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T043 [US2] Jouer le scénario 9 de quickstart.md et noter les résultats~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

**Checkpoint**: US1 et US2 fonctionnent chacune

---

## Phase 5: User Story 3 - Des Pokémon à leur place selon le biome (Priority: P3)

**Goal**: 4 à 6 biomes typés ; au moins 80 % des apparitions d'un biome ont le type associé.

**Independent Test**: quickstart scénario 8.

- [-] ~~T044 [P] [US3] Créer les étiquettes de biomes par type validées en T001 dans pokemonde/mod/data/pokemonde/tags/worldgen/biome/<type>.json (ex. `eau.json` : océans et rivières)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T045 [US3] Remplacer la règle provisoire de T026 dans pokemonde/mod/src/apparitions.rs : dans un biome typé, 80 % des tirages parmi les espèces qui ont l'un des types du biome et 20 % parmi toutes les espèces paisibles (data-model « Biome typé »)~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T046 [US3] Vérifier que le monde modèle de T024 contient bien 4 à 6 biomes typés distincts (FR-013) ; jouer le scénario 8 de quickstart.md et noter les pourcentages par biome~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

**Checkpoint**: exploration récompensée par biome

---

## Phase 6: User Story 4 - Consulter le Pokédex en jeu (Priority: P4)

**Goal**: écran Pokédex : inconnu, vu, capturé ; mêmes nom, numéro et types que le site.

**Independent Test**: quickstart scénario 10.

- [-] ~~T047 [US4] Ajouter `pokedex` (table `numero → "vu" | "capture"`, absent = inconnu) à la collection dans pokemonde/mod/src/collection.rs ; passer à « vu » quand un Pokémon apparaît à moins de 16 blocs du joueur ; « capturé » ne redevient jamais « vu » ; une capture ou un import passe à « capturé »~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T048 [US4] Créer l'écran pokemonde/mod/src/ecran_pokedex.rs, ouvert par une touche (P par défaut) : 151 lignes ; les inconnus montrent seulement « #NNN ??? » ; les vus et capturés montrent le numéro « #007 » (3 chiffres, comme `padStart` du site), le nom français, les types et l'illustration ; les capturés sont marqués d'une icône Poké Ball~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [-] ~~T049 [US4] Jouer le scénario 10 de quickstart.md (5 fiches comparées au site) et noter les résultats~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

**Checkpoint**: le Pokédex en jeu fait le lien avec le site

---

## Phase 7: User Story 5 - Faire venir sa sacoche du site dans le jeu (Priority: P5)

**Goal**: code `PKMD1` produit par le site et lu par la commande `/sacoche`.

**Prerequisite externe**: page Sacoche et store `stores/sacoche.ts` de la spec 001 (étape TP 16) terminés.

**Independent Test**: quickstart scénarios 11 et 12.

### Tests for User Story 5

- [-] ~~T050 [US5] Écrire les vecteurs partagés dans pokemonde/tests/vecteurs-sacoche.json selon specs/002-easter-egg-monde-pokemon/contracts/code-sacoche.md (sacoche `[{id:25, surnom:"Pika"}]` et son code figé ; ce code avec une lettre de `<donnees>` changée ; sacoche `[{id:448, surnom:""},{id:1, surnom:""}]`)~~ — **Abandonnée le 2026-11-23** : vecteurs écrits directement dans les tests de `crates/pokemonde-web/src/sacoche.rs` et de `lib/codeSacoche.test.ts`.
- [X] T051 [P] [US5] Tests Vitest dans lib/codeSacoche.test.ts qui reprennent les vecteurs de T050 (copiés dans le test) — *Fait le 2026-11-23 : `lib/codeSacoche.test.ts`.*
- [-] ~~T052 [P] [US5] Tests `cargo test` dans pokemonde/mod/src/sacoche.rs qui lisent pokemonde/tests/vecteurs-sacoche.json~~ — **Abandonnée le 2026-11-23** : remplacée par les tests de `crates/pokemonde-web/src/sacoche.rs` (jeu web).

### Implementation for User Story 5

- [X] T053 [US5] Implémenter `creerCodeSacoche` dans lib/codeSacoche.ts (export nommé) : type `MembreTransfert = Pick<Membre, "id" | "surnom">` (ch. 3) ; JSON `{ "membres": [...] }` avec 1 à 6 membres, `id` 1–1025 sans doublon, `surnom` 0–12 caractères, aucun autre champ ; base64url sans `=` ; empreinte = 8 premiers caractères hexadécimaux du SHA-256 de `<donnees>` (Web Crypto) ; T051 passe — *Fait le 2026-11-23 : `lib/codeSacoche.ts` ; renvoie `null` pour une sacoche vide ou hors règles.*
- [-] ~~T054 [US5] Créer components/ExportSacoche.tsx (`"use client"`) : bouton « Exporter vers le Monde Pokémon » visible seulement si la sacoche n'est pas vide (sélecteur Zustand à une valeur, ch. 9), code dans un champ en lecture seule avec un libellé et un bouton « Copier » ; l'ajouter à app/sacoche/page.tsx~~ — **Abandonnée le 2026-11-23** : le lien du secret transporte le code (`?sacoche=`) : plus de bouton « Exporter » ni de champ à copier.
- [-] ~~T055 [US5] Implémenter la lecture du code dans pokemonde/mod/src/sacoche.rs (préfixe, base64url, JSON, empreinte, règles des champs ; tout écart → « Code de sacoche invalide. ») ; T052 passe~~ — **Abandonnée le 2026-11-23** : remplacée par `lire_code` dans `crates/pokemonde-web/src/sacoche.rs` (jeu web).
- [-] ~~T056 [US5] Ajouter la commande `/sacoche <code>` dans pokemonde/mod/src/sacoche.rs : `id` > 151 ignoré avec « Le Pokémon #<n> n'existe pas dans ce monde. » ; un membre déjà importé (même `numero` et même `surnom`, origine `"sacoche"`) ignoré sans erreur ; sinon ajout à la collection (`origine` `"sacoche"`) et Pokédex « capturé » ; dernière ligne « <n> Pokémon importés. »~~ — **Abandonnée le 2026-11-23** : plus de commande `/sacoche` : import automatique à l'ouverture d'une partie (`crates/pokemonde-web/src/sacoche.rs`).
- [X] T057 [US5] Jouer les scénarios 11 et 12 de quickstart.md ; porte de qualité du site (`npm run lint`, `npm run build`, `npx vitest run`) — *Fait le 2026-11-23 : porte de qualité du site verte ; import vérifié dans le jeu par `?partie=survie&sacoche=<vecteur>`.*

**Checkpoint**: toutes les stories fonctionnent

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T058 [P] Documenter dans docs/05-tailwind-interface.md (cube : choix, chapitre, justification, alternatives, fichiers), docs/09-interactivite-avancee.md (export de la sacoche) et docs/10-hooks.md (`useCompteurClics`), au format du principe III de la constitution — *Fait le 2026-11-23 : entrées ajoutées dans les trois documents.*
- [X] T059 [P] Écrire docs/bonus-monde-pokemon.md (si validé en T001) : but du bonus, décisions de specify et clarify, lien vers le dépôt du jeu, limites connues (détection « jeu non installé », empreinte du code de sacoche) ; y renvoyer depuis README.md — *Fait le 2026-11-23 : `docs/bonus-monde-pokemon.md` écrit ; renvoi depuis README.md **non fait** (à décider : il dévoilerait le secret).*
- [-] ~~T060 [P] Écrire pokemonde/README.md : prérequis, installation et désinstallation (quickstart), avertissement « projet personnel non officiel, non affilié à Mojang, Microsoft, Nintendo ni The Pokémon Company ; aucun fichier de Minecraft inclus »~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.
- [ ] T061 Mesurer Lighthouse en production après déploiement : supérieur à 90 dans chaque catégorie (SC-007) ; comparer avec la mesure d'avant l'easter egg
- [-] ~~T062 Rejouer les 16 scénarios de specs/002-easter-egg-monde-pokemon/quickstart.md et noter chaque résultat (réussi, échoué, écart) en bas du fichier~~ — **Abandonnée le 2026-11-23** : jeu web local en Rust/WebAssembly à la place du lanceur, de `pokemonde://` et du mod Horizon.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : T001 d'abord (les décisions conditionnent T038, T044 et T059).
- **Foundational (Phase 2)** : après Setup. **Bloque toutes les stories.** Les spikes T008 à T013 peuvent
  se faire dans n'importe quel ordre, mais un repli refusé par l'utilisateur peut changer le plan.
- **US1 (P1)** : après la phase 2. Côté site (T030 à T035), elle peut avancer en parallèle du côté jeu.
- **US2 (P2)** : après la phase 2 ; elle a besoin d'un monde jouable (T022, T025) pour son test.
- **US3 (P3)** : remplace la règle d'apparition de T026 (US1).
- **US4 (P4)** : a besoin de la collection de T040 (US2).
- **US5 (P5)** : a besoin de la collection de T040 (US2) et de l'**étape TP 16 de la spec 001**.
- **Polish** : après les stories voulues.

### Within Each User Story

- Tests avant l'implémentation de la règle testée (ils doivent d'abord échouer).
- Données avant crochets, crochets avant écrans.

### Parallel Opportunities

- Phase 1 : T004, T005, T006.
- Phase 2 : T017 et T018 après T015 et T016.
- US1 : côté site (T020, T030, T031) en parallèle du côté jeu (T019, T024) ; T024 (monde) indépendant
  du code.
- US2 : T037 et T038 ensemble.
- US5 : T051 et T052 ensemble, puis T053 (site) en parallèle de T055 (jeu).
- Polish : T058, T059 et T060.

---

## Parallel Example: User Story 1

```text
Tâche : « Tests de validation d'adresse dans pokemonde/lanceur/src/adresse.rs » (T019)
Tâche : « Tests du compteur dans lib/compteurClics.test.ts » (T020)
Tâche : « Monde modèle dans pokemonde/monde-modele/ » (T024)
Tâche : « Table des difficultés dans lib/mondePokemon.ts » (T031)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1, y compris T001 (décisions validées).
2. Phase 2 : **les spikes d'abord**. S'ils échouent sans repli acceptable, on s'arrête avant d'avoir écrit
   le gros du code.
3. Phase 3 (US1), puis **arrêt et validation** avec les scénarios du quickstart.

### Incremental Delivery

US1 (entrer, monde sans mob d'origine) → US2 (capture) → US3 (biomes) → US4 (Pokédex) → US5 (sacoche,
après la spec 001). Chaque étape se joue seule.

### Priorité par rapport à la spec 001

La spec 001 (le Pokédex noté) passe d'abord (Assumptions de la spec). Seules les tâches du site de
l'US1 (T030 à T035) touchent le dépôt noté ; elles ne sont fusionnées qu'avec la porte de qualité T036
au vert.

---

## Notes

- [P] = fichiers différents, sans dépendance sur une tâche non finie.
- Commit après chaque tâche ou groupe logique ; dans ce dépôt, seulement avec `npm run lint` et
  `npm run build` verts (constitution).
- Ne jamais committer de fichier de Minecraft dans `pokemonde/`.
