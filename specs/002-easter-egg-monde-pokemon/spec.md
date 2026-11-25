# Feature Specification: Easter egg « Monde Pokémon » (mini monde ouvert sur le moteur Horizon)

> **Mise à jour 2026-11-23** : le jeu est désormais un jeu web original en Rust/WebAssembly servi
> en local (dépôt `<dossier-des-projets>\pokemonde`, voir son `docs/etape3.md`) ; le
> lanceur, le protocole `pokemonde://` et le mod Horizon sont abandonnés. Restent valables : le
> déclencheur secret (5 activations du logo en moins de 3 s, au clavier aussi), le `<dialog>` natif
> avec l'animation du cube, et le code de sacoche (`contracts/code-sacoche.md`), transmis par
> `http://127.0.0.1:8765/?sacoche=<code>` et importé à l'ouverture d'une partie (plus de commande
> `/sacoche`). Le site déployé ne contient pas le jeu.

**Feature Branch**: `002-easter-egg-monde-pokemon`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "actuellement ya dejà une spec en cours : la création du pokedex web, mais là
je veux que tu touches au moteur rust de minecraft pour faire un easteregg qui sera un mini minecraft en
rapport avec les pokemon, tu peux me grill, me faire des suggestions..." — précisé ensuite : « en 1 clic
de bouton caché on rejoint un monde minecraft MAIS minimaliste : pas besoin de créer un monde, un seul
par défaut, un monde limité, remplacer tous les mobs par des pokemons, un mini monde ouvert pokemon mais
avec le moteur minecraft ». Fonctionnalités retenues : capture, biomes par type, Pokédex en jeu, lien
avec la sacoche du site.

> Cadre : cette fonctionnalité est un **bonus hors cours**, demandé explicitement par l'utilisateur
> (constitution, principes I et IV). La partie « site » reste soumise à toute la constitution ; la
> partie « jeu » vit hors du dépôt du Pokédex et n'est pas évaluée par la grille du cours.
> Elle ne doit pas retarder la spec 001.

## Clarifications

### Session 2026-11-23

- Q: Où est le bouton caché ? → A: Sur le site Pokédex ; le clic ouvre le jeu installé sur l'ordinateur.
- Q: À quoi ressemblent les Pokémon dans le monde ? → A: D'abord des images 2D tournées vers le
  joueur (mêmes illustrations que le site) ; des modèles 3D pourront venir plus tard, hors de cette
  version.
- Q: Qui joue ? → A: Uniquement l'utilisateur, sur son ordinateur (démo personnelle ou soutenance) ;
  rien n'est publié.
- Q: Comment le visiteur déclenche-t-il le bouton caché sur le site ? → A: 5 clics (ou 5 appuis sur
  Entrée) sur le logo/titre « Mon Pokédex », avec une animation de cube façon blocs.
- Q: Dans quel mode de jeu le joueur arrive-t-il, et qui le choisit ? → A: Le joueur choisit la
  difficulté sur le site, après le cube, parmi 3 boutons : Paisible (créatif), Normal (survie
  adoucie), Difficile (survie classique) ; le clic sur la difficulté ouvre le jeu. Même monde pour
  les 3 niveaux, niveau modifiable à chaque entrée.
- Q: En Difficile, les Pokémon de nuit attaquent-ils le joueur ? → A: Oui, seulement les Pokémon de type
  Spectre, Ténèbres et Poison, la nuit ; tous les autres restent paisibles.
- Q: De quoi dépend la réussite d'une capture ? → A: Du taux de capture officiel de l'espèce (PokéAPI),
  avec un minimum de 5 %.
- Q: Quelle taille doit avoir le monde limité ? → A: 512 × 512 blocs, 4 à 6 biomes typés.

## Faits vérifiés sur le moteur (2026-11-23)

- Horizon (`horizon-rust/horizon`) est une réécriture de Minecraft Java Edition 26.3, sous licence
  LGPL-3.0 (le code antérieur au changement reste sous MIT).
- Il tourne **uniquement sur ordinateur** (Windows, macOS, Linux), pas dans un navigateur.
- Il ne contient **aucun fichier de Minecraft** : il les reconstruit à partir de la copie du jeu achetée
  par le joueur (version 26.3, lancée une fois).
- Il propose une **API de mods officielle** ; les mods peuvent être isolés dans un bac à sable.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrer dans le monde Pokémon en un clic (Priority: P1)

Le joueur trouve un bouton caché, clique une fois, et se retrouve directement dans un petit monde déjà
prêt. Il n'a ni monde à créer, ni réglage à faire. Partout où le jeu ferait apparaître un animal ou un
monstre, il voit un Pokémon. Il peut se promener, casser et poser des blocs comme dans le jeu d'origine.

**Why this priority**: c'est l'easter egg lui-même. Sans cette entrée en un clic dans un monde peuplé de
Pokémon, les autres stories n'ont pas de support. C'est aussi la démonstration la plus visible.

**Independent Test**: sur un ordinateur où le jeu est prêt, cliquer sur le bouton caché, chronométrer
l'arrivée dans le monde, puis parcourir le monde jusqu'à ses limites en notant chaque créature croisée.

**Acceptance Scenarios**:

1. **Given** le jeu prêt sur l'ordinateur, **When** le joueur déclenche le secret puis clique sur un
   niveau de difficulté, **Then** il apparaît dans le monde Pokémon à ce niveau, sans aucun écran de
   création ou de choix de monde dans le jeu.
2. **Given** le joueur dans le monde, **When** une créature apparaît, **Then** c'est un Pokémon, jamais
   un mob d'origine (animal, monstre ou villageois).
3. **Given** le joueur qui marche vers le bord, **When** il atteint la limite du monde, **Then** il ne
   peut pas aller plus loin et comprend visuellement qu'il est au bord.
4. **Given** le joueur qui a modifié le monde, **When** il quitte puis reclique sur le bouton caché,
   **Then** il retrouve le même monde avec ses modifications.
5. **Given** un ordinateur sans le jeu prêt, **When** le joueur clique sur le bouton caché, **Then** un
   message clair explique ce qui manque et comment l'installer, sans erreur technique brute.

---

### User Story 2 - Capturer des Pokémon (Priority: P2)

Le joueur fabrique ou reçoit des Poké Balls et les lance sur un Pokémon. La capture peut réussir ou
échouer ; un Pokémon capturé disparaît du monde et rejoint la collection du joueur.

**Why this priority**: c'est ce qui transforme une promenade en jeu, et c'est la base du Pokédex en jeu
(story 4) et de la sacoche (story 5).

**Independent Test**: lancer 20 Poké Balls sur un Pokémon au taux maximal (doit réussir à chaque fois),
puis 20 sur un Pokémon au taux minimal (environ 1 réussite attendue, au moins un échec) ; vérifier que la
collection contient exactement les Pokémon capturés.

**Acceptance Scenarios**:

1. **Given** un joueur avec des Poké Balls, **When** il en lance une qui touche un Pokémon, **Then** une
   capture est tentée et le résultat (réussite ou échec) est clairement montré.
2. **Given** une capture réussie, **When** le joueur ouvre sa collection, **Then** le Pokémon y figure.
3. **Given** un joueur sans Poké Ball, **When** il veut capturer, **Then** il sait comment en obtenir.
4. **Given** une Poké Ball qui ne touche rien, **When** elle retombe, **Then** elle est perdue ou
   récupérable, de façon cohérente et toujours la même.

---

### User Story 3 - Des Pokémon à leur place selon le biome (Priority: P3)

Le monde limité contient plusieurs biomes. Chaque biome fait apparaître surtout des Pokémon d'un type qui
lui correspond : Eau près de l'eau, Feu en zone chaude et sèche, Glace dans la neige, Plante en forêt, etc.

**Why this priority**: donne envie d'explorer tout le monde, mais le jeu reste jouable sans (les Pokémon
peuvent apparaître au hasard).

**Independent Test**: dans chaque biome, observer les 20 premiers Pokémon apparus et compter ceux dont un
type correspond au biome.

**Acceptance Scenarios**:

1. **Given** le joueur dans un biome associé à un type, **When** des Pokémon apparaissent, **Then** la
   grande majorité ont ce type.
2. **Given** le monde par défaut, **When** le joueur le parcourt, **Then** il rencontre au moins 4 biomes
   associés à des types différents.

---

### User Story 4 - Consulter le Pokédex en jeu (Priority: P4)

Sans quitter le jeu, le joueur ouvre un Pokédex qui liste les Pokémon vus et capturés. Pour chacun, il
voit le nom français, le numéro au format « #007 », les types et l'illustration, comme sur le site.

**Why this priority**: fait le lien avec le Pokédex web et donne un objectif de collection, mais dépend
des stories 1 et 2.

**Independent Test**: voir 3 Pokémon, en capturer 1, ouvrir le Pokédex en jeu et comparer chaque fiche
avec la fiche du même Pokémon sur le site.

**Acceptance Scenarios**:

1. **Given** un Pokémon vu mais pas capturé, **When** le joueur ouvre le Pokédex, **Then** il apparaît
   comme « vu » et se distingue d'un Pokémon capturé.
2. **Given** un Pokémon jamais rencontré, **When** le joueur ouvre le Pokédex, **Then** il n'est pas
   révélé.
3. **Given** une fiche ouverte, **When** le joueur la compare au site, **Then** le nom, le numéro et les
   types sont identiques.

---

### User Story 5 - Faire venir sa sacoche du site dans le jeu (Priority: P5)

Le joueur a composé sur le site une sacoche de 6 Pokémon au maximum. Il la transfère dans le jeu (par
exemple avec un code à copier-coller) et retrouve ces Pokémon dans sa collection, avec leurs surnoms.

**Why this priority**: c'est le pont le plus original entre le site et le jeu, mais aussi le plus
complexe ; tout le reste fonctionne sans lui.

**Independent Test**: composer une sacoche de 3 Pokémon dont un avec un surnom, la transférer, vérifier
la collection en jeu ; puis transférer un code modifié à la main et vérifier qu'il est refusé.

**Acceptance Scenarios**:

1. **Given** une sacoche de 1 à 6 Pokémon sur le site, **When** le joueur la transfère, **Then** la
   collection en jeu contient ces Pokémon, avec leurs surnoms.
2. **Given** un code de transfert invalide, abîmé ou modifié, **When** le joueur le saisit, **Then** il
   est refusé avec un message clair et rien n'est ajouté.
3. **Given** la même sacoche transférée deux fois, **When** le joueur regarde sa collection, **Then**
   aucun doublon n'a été créé.

---

### Edge Cases

- En Difficile, le jour se lève alors que des Pokémon agressifs sont encore là : ils cessent d'attaquer
  ou disparaissent, de façon toujours identique (comportement exact précisé à la planification).
- Un Pokémon agressif peut-il être capturé ? Hypothèse : oui, comme les autres.
- Un visiteur clique 2 ou 3 fois sur le logo en naviguant normalement : rien ne se déclenche et la
  navigation vers l'accueil fonctionne comme d'habitude.
- Le bouton caché est trouvé par un visiteur qui n'a ni le jeu ni Minecraft : il doit comprendre ce qui
  manque, sans page cassée.
- La version de Minecraft installée n'est pas la 26.3 : message explicite.
- Le monde par défaut est corrompu ou supprimé : il est recréé à l'identique au clic suivant.
- Un mob d'origine apparaît malgré tout (par exemple via un œuf, un générateur ou une commande) : il est
  remplacé par un Pokémon ou empêché d'apparaître.
- Le joueur se connecte à un autre monde ou serveur : le contenu Pokémon ne doit pas le perturber.
- La sacoche du site contient un Pokémon au-delà du n° 151 (le site en a 1 025) : ce membre est ignoré
  avec un message qui donne son numéro, les autres sont importés (relevé à la planification).
- Une sacoche vide sur le site : le transfert ne propose rien ou explique qu'il n'y a rien à transférer.
- Hors connexion : le monde reste jouable ; seules les données qui doivent venir d'Internet manquent, et
  le joueur le voit.

## Requirements *(mandatory)*

### Functional Requirements

**Entrée et monde**

- **FR-001**: Un bouton caché **sur le site Pokédex** DOIT permettre, en un seul clic, d'ouvrir le jeu
  installé sur l'ordinateur et d'entrer directement dans le monde Pokémon.
- **FR-001a**: Le bouton caché se déclenche par **5 activations rapprochées du logo/titre « Mon
  Pokédex »** (5 clics, ou 5 appuis sur Entrée quand il a le focus). Les activations du logo
  continuent de ramener à l'accueil comme d'habitude ; un compteur qui n'atteint pas 5 dans un délai
  court (hypothèse : 3 secondes) repart de zéro.
- **FR-001b**: Le déclenchement joue une **animation de cube en blocs** (cube qui apparaît et tourne)
  avant l'ouverture du jeu. Elle respecte la constitution (principe V) : moins de 0,5 s, uniquement
  sur `transform` et `opacity`, et remplacée par une simple apparition si le visiteur a demandé moins
  d'animations. Le cube est dessiné pour le projet, sans reprendre de texture de Minecraft.
- **FR-001c**: Après l'animation, le site DOIT proposer 3 boutons de difficulté, utilisables au clavier ;
  le clic sur l'un d'eux ouvre le jeu directement dans le monde Pokémon à ce niveau :
  - **Paisible** : mode créatif, tous les blocs, Poké Balls illimitées, vol possible ;
  - **Normal** : survie adoucie, on récolte et on fabrique, sans dégâts ni faim, toujours de jour ;
  - **Difficile** : survie classique avec santé, faim et cycle jour/nuit (des Pokémon agressifs
    remplacent les monstres de nuit, voir FR-008).
- **FR-001d**: Les 3 niveaux partagent le même monde et la même collection ; le niveau peut changer à
  chaque entrée.
- **FR-002**: Il DOIT exister un seul monde Pokémon, fourni par défaut ; le joueur ne crée ni ne choisit
  aucun monde.
- **FR-003**: Le monde DOIT mesurer 512 × 512 blocs et être limité par une bordure infranchissable et
  visible ; le joueur apparaît près du centre.
- **FR-004**: Les modifications du joueur (blocs, collection) DOIVENT être conservées entre deux sessions.
- **FR-005**: Si le jeu n'est pas prêt, le joueur DOIT voir un message clair qui indique ce qui manque.

**Créatures**

- **FR-006**: Toutes les créatures (animaux, monstres, villageois) DOIVENT être remplacées par des
  Pokémon ; aucun mob d'origine ne doit être visible dans le monde Pokémon.
- **FR-007**: Chaque Pokémon DOIT être reconnaissable visuellement, représenté par une image 2D toujours
  tournée vers le joueur (la même illustration que sur le site). Les modèles 3D sont hors de cette
  version.
- **FR-008**: Les Pokémon DOIVENT se déplacer dans le monde et ne pas être hostiles, sauf en Difficile la
  nuit : les Pokémon de type Spectre, Ténèbres ou Poison qui apparaissent la nuit attaquent le joueur.
  En Paisible et Normal, aucun Pokémon n'est jamais hostile.
- **FR-009**: Les Pokémon disponibles DOIVENT être un sous-ensemble défini ; hypothèse : les 151
  premiers, comme les fiches pré-générées du site.

**Capture**

- **FR-010**: Le joueur DOIT pouvoir obtenir des Poké Balls : illimitées en Paisible, à obtenir en jeu en
  Normal et Difficile.
- **FR-011**: Lancer une Poké Ball sur un Pokémon DOIT tenter une capture. La chance de réussite est le
  taux de capture officiel de l'espèce rapporté au taux maximal (ex. 255/255 → 100 %, 45/255 → environ
  18 %), avec un minimum de 5 %. Les mêmes règles valent pour tous les niveaux de difficulté.
- **FR-012**: Un Pokémon capturé DOIT disparaître du monde et rejoindre la collection du joueur.

**Biomes**

- **FR-013**: Le monde DOIT contenir de 4 à 6 biomes, associés chacun à un type de Pokémon différent.
- **FR-014**: Au moins 80 % des Pokémon qui apparaissent dans un biome DOIVENT avoir le type associé.

**Pokédex en jeu**

- **FR-015**: Le joueur DOIT pouvoir ouvrir un Pokédex en jeu qui distingue les Pokémon vus, capturés et
  inconnus.
- **FR-016**: Le nom français, le numéro « #007 » et les types DOIVENT être identiques à ceux du site.

**Sacoche**

- **FR-017**: La page Sacoche du site DOIT pouvoir produire un code de transfert contenant ses Pokémon
  (6 au maximum) et leurs surnoms.
- **FR-018**: Le jeu DOIT accepter ce code, refuser tout code invalide ou modifié, et ne jamais créer de
  doublon.

**Contraintes du site (constitution)**

- **FR-019**: Le bouton caché ne DOIT pas gêner l'usage normal du site ni son accessibilité (un seul
  `<h1>`, clavier, focus) ; il DOIT rester activable au clavier.
- **FR-020**: L'ajout de l'easter egg ne DOIT pas faire baisser les scores Lighthouse du site sous 90
  ni ajouter de dépendance au site sans accord.

**Distribution**

- **FR-021**: Le contenu Pokémon ajouté au jeu est utilisé uniquement sur l'ordinateur de l'utilisateur
  (démo personnelle ou soutenance) ; il n'est ni publié ni distribué.
- **FR-023**: Sur le site en ligne, un visiteur qui n'a pas le jeu et trouve le bouton caché DOIT voir
  une explication claire (pas de page cassée ni d'erreur du navigateur sans explication).
- **FR-022**: Aucun fichier de Minecraft ne DOIT être inclus ni redistribué ; le joueur utilise sa
  propre copie du jeu.

### Key Entities

- **Monde Pokémon**: le monde unique par défaut ; 512 × 512 blocs, 4 à 6 biomes typés, modifications
  du joueur.
- **Biome typé**: une zone du monde associée à un type de Pokémon, avec sa liste de Pokémon possibles.
- **Espèce Pokémon**: numéro, nom français, types, illustration, taux de capture officiel ; mêmes
  données que sur le site.
- **Pokémon dans le monde**: une espèce présente à un endroit du monde, que l'on peut capturer.
- **Collection du joueur**: les Pokémon capturés ou importés, avec un surnom éventuel ; source du
  Pokédex en jeu.
- **Entrée de Pokédex**: pour chaque espèce, l'état inconnu, vu ou capturé.
- **Code de transfert de sacoche**: représentation de la sacoche du site (1 à 6 Pokémon, surnoms),
  vérifiable par le jeu.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Entre le clic sur un niveau de difficulté et le contrôle du personnage, il s'écoule moins de
  30 secondes sur l'ordinateur de démonstration, sans aucune autre action du joueur.
- **SC-002**: Sur une exploration de 15 minutes couvrant tous les biomes, 0 mob d'origine est observé.
- **SC-003**: Une personne qui découvre le jeu capture son premier Pokémon en moins de 5 minutes, sans
  aide.
- **SC-004**: Dans chaque biome typé, au moins 80 % des 20 premiers Pokémon apparus ont le type du biome.
- **SC-005**: 100 % des fiches du Pokédex en jeu vérifiées ont le même nom, numéro et types que le site.
- **SC-006**: Une sacoche de 6 Pokémon est transférée en moins de 1 minute ; 100 % des codes modifiés à la
  main sont refusés.
- **SC-007**: Après l'ajout du bouton caché, le site garde un score Lighthouse supérieur à 90 dans chaque
  catégorie et `npm run lint` et `npm run build` passent.

## Assumptions

- Le joueur possède Minecraft Java Edition 26.3 et a installé Horizon ; sans eux, seul le message
  d'explication (FR-005) est attendu.
- Le navigateur peut ouvrir une application installée depuis un lien du site. **Non vérifié pour Horizon** :
  à confirmer en premier à la planification. Si c'est impossible, on retombe sur un repli (par exemple
  un lanceur maison qui ouvre directement le monde), à soumettre à l'utilisateur.
- Le contenu Pokémon passe d'abord par l'**API de mods** du moteur ; le moteur n'est forké que si le
  remplacement de toutes les créatures (FR-006) est impossible par cette voie. Ce choix est vérifié à la
  planification.
- Le code du jeu vit dans un dépôt séparé du Pokédex ; ce dépôt-ci ne contient que la spec, le bouton
  caché et le code de transfert de sacoche.
- Pas de multijoueur : le monde Pokémon se joue seul.
- Les données Pokémon (noms français, types, illustrations) viennent de la PokéAPI, comme sur le site.
- Pas de combats Pokémon dans cette version.
- Projet étudiant non commercial ; Pokémon et Minecraft restent des marques de leurs propriétaires et le
  projet ne s'appelle pas « Minecraft ».
- La spec 001 (Pokédex web) reste prioritaire : l'easter egg ne démarre pas avant que le site soit
  conforme à la grille du cours.
