# T012 : directions artistiques du Pokédex

Statut : **proposition, en attente de validation de l'utilisateur (STOP C)**. Aucun code d'interface
n'a été écrit dans l'application ; seuls ce document et trois maquettes statiques existent.

Maquettes (ouvrir dans un navigateur, connexion internet requise pour Tailwind, les polices et les
images) :

- `direction-1.html` : Planche naturaliste
- `direction-2.html` : Album à compléter
- `direction-3.html` : Signalétique

Chaque maquette contient l'en-tête, la recherche, les filtres par type, une grille de 8 cartes
réelles (n° 1, 4, 7, 25, 94, 130, 149, 150), la pagination, un aperçu de la fiche de Pikachu et un
aperçu de la sacoche (3 membres, 3 emplacements libres). Le bouton de thème fonctionne et mémorise
le choix dans `localStorage["pokedex-theme"]` (`"clair"` / `"sombre"`, même contrat que research R7).
Ajouter `?theme=sombre` à l'adresse ouvre directement la version sombre. Les étoiles de favoris
fonctionnent et mettent à jour le compteur de l'en-tête.

Tailwind est chargé par CDN (`@tailwindcss/browser@4.3.3`, même version que le projet) dans ces
maquettes seulement. Les classes ont été écrites pour pouvoir être reprises telles quelles dans les
composants.

---

## 1. Ce que les trois directions ont en commun (imposé par le cours)

| Règle du ch. 5 (ou ch. 8, 11) | Application dans les trois maquettes |
|---|---|
| Hiérarchie : image, puis nom, puis types ; numéro discret | Image dans un champ carré en haut de carte, nom en gras sous l'image, badges dessous, numéro en petit et en filigrane |
| Espace : échelle 2, 4, 6, 8 | Marges, `gap` et `padding` de mise en page limités à 2/4/6/8. Exception reprise du cours : l'intérieur des badges (`py-0.5`) |
| Couleur porteuse d'information | Variable locale `--teinte: var(--color-type-<type principal>)` posée sur chaque carte, utilisée par `from-(--teinte)/25`, le filigrane `text-(--teinte)/20`, les barres de stats et l'ombre de survol |
| Cohérence | Un seul système d'arrondis par direction (décrit plus bas), mêmes boutons partout |
| Une couleur d'accent + les couleurs de type | Un jeton `--color-pokedex` par direction (nom du cours conservé), décliné clair / sombre |
| 2 ou 3 tailles de texte | 3 tailles lisibles par direction ; le filigrane, décoratif et `aria-hidden`, n'en fait pas partie |
| Ombres légères, plus fortes au survol | `shadow-sm` au repos ; au survol, une ombre teintée par le type apparaît |
| États survol, focus, inactif visibles | `focus-visible:outline-2`, `disabled:opacity-40` + `cursor-not-allowed`, `active:scale-95` |
| Mouvement < 0,5 s, `transform` et `opacity` seulement, `motion-reduce:` | Voir les durées par direction. L'ombre de survol est un pseudo-élément dont seule l'**opacité** est animée (le cours anime `box-shadow` avec `transition` ; c'est plus strict que le cours, sans contredire son objectif) |
| `animate-apparition` | Gardé avec la même définition que le cours, à 0,32 s au lieu de 0,4 s, plus un décalage de 30 ms par carte plafonné à 150 ms : 0,47 s au total au maximum |
| Grille 2 → 6 colonnes | `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6` (classes du cours) |
| Carte : survol qui soulève, image qui grossit, ombre portée sur l'image, filigrane | Présents dans les trois directions (checklist de l'étape 6) |
| Barres de stats (ch. 8) | Structure du cours (`dl`, grille `7rem / nombre / barre`, `MAXIMUM = 255`, largeur par `style`) ; seule la couleur de remplissage change : `--teinte` au lieu de l'accent |
| Thème clair par défaut + bascule (FR-023, R7) | `@custom-variant dark (&:where(.dark, .dark *));` et script en tête qui pose la classe avant l'affichage. La syntaxe fonctionne dans Tailwind 4.3.3 (vérifié par le rendu des maquettes en sombre) |
| Accessibilité (ch. 11) | Lien d'évitement, un seul `h1`, `h2` par carte, `aria-current="page"` sur la navigation, `aria-pressed` sur les étoiles et le bouton de thème, `label` du champ de recherche, `alt` sur les images |

Vérifications faites sur les maquettes :

- **375 px sans défilement horizontal** : largeur du document mesurée dans un cadre de 375 px avec Chrome
  headless, `scrollWidth = clientWidth` pour les trois. La direction 2 débordait de 15 px (pilules de
  navigation) ; c'est corrigé et mesuré à nouveau.
- **Thème sombre** : captures en clair et en sombre, à 375 px et 1 280 px, contrôlées une par une.
- **Interactions** : clic simulé sur le bouton de thème (classe, `aria-pressed`, libellé, stockage)
  et sur les étoiles (compteur, synchronisation carte / fiche), dans les trois maquettes.

Un piège du cours est apparu pendant ces contrôles : la pastille « Fée » restait sans couleur, parce
que Tailwind 4 n'émet `--color-type-fairy` que si une classe l'utilise. Les maquettes utilisent
`@theme static` ; dans l'application, la table `TYPES` (qui contient les 18 classes écrites en
entier) suffit, comme l'explique le cours.

## 2. Couleurs de type : contraste du texte blanc

Les badges du cours sont en `text-xs font-bold text-white` (12 px). Ce n'est pas un « grand texte » au
sens WCAG : il faut donc **4,5:1**. Contrastes calculés (formule de luminance relative WCAG 2.x, script
Python) :

| Type | Cours | Blanc sur cours | Proposition | Blanc sur proposition |
|---|---|---|---|---|
| normal | `#7b7b6c` | 4,29 | `#767668` | 4,60 |
| fire | `#d2571c` | 4,10 | `#c4511a` | 4,63 |
| water | `#2f6fd0` | 4,88 | inchangé | 4,88 |
| electric | `#9a7400` | 4,31 | `#946f00` | 4,63 |
| grass | `#3f8f3a` | 4,04 | `#3a8436` | 4,63 |
| ice | `#2e8f93` | 3,84 | `#298083` | 4,66 |
| fighting | `#a8322a` | 6,66 | inchangé | 6,66 |
| poison | `#8a3fa0` | 6,37 | inchangé | 6,37 |
| ground | `#9c7a2e` | 4,01 | `#8f702a` | 4,65 |
| flying | `#5b78c9` | 4,22 | `#5371c6` | 4,62 |
| psychic | `#d43d6c` | 4,48 | `#d33969` | 4,61 |
| bug | `#7c8a1a` | 3,81 | `#6f7b17` | 4,64 |
| rock | `#8f7d35` | 4,08 | `#857431` | 4,63 |
| ghost | `#5a4a8c` | 7,52 | inchangé | 7,52 |
| dragon | `#5a3fd6` | 6,74 | inchangé | 6,74 |
| dark | `#50433a` | 9,52 | inchangé | 9,52 |
| steel | `#6d6d85` | 5,03 | inchangé | 5,03 |
| fairy | `#c2528f` | 4,29 | `#bf4a8a` | 4,60 |

**11 couleurs sur 18 échouent** avec le texte blanc. La proposition garde la teinte et la saturation
de chaque couleur et baisse seulement la luminosité, du minimum nécessaire pour atteindre 4,6:1 (un
peu de marge). L'écart est à peine visible. Les maquettes utilisent les valeurs proposées. Ce choix
vaut pour les trois directions et se décide indépendamment de la direction retenue (question
Q-T012-b ci-dessous).

En thème sombre, les badges reçoivent `dark:ring-1 dark:ring-white/20`, parce que `dark`, `ghost`,
`dragon`, `fighting` et `poison` ont moins de 3:1 contre une surface sombre (`#50433a` contre
`#16181d` : 1,86). Le texte du badge reste lisible ; l'anneau garde la forme visible.

## 3. Méthode

- **Skill impeccable v4.10.0.** Le lanceur `scripts/impeccable.cmd context` a fonctionné. Il
  signale l'absence de `PRODUCT.md` et demande de passer par `init`. Je n'ai pas le droit d'écrire
  hors de `design/`, donc pas de `PRODUCT.md`. Conséquence : `concept-seed` (le tirage des
  directions) a refusé de tourner (`NO_PRODUCT_MD`), et la page de décision, les maquettes
  générées par image, la revue de fin et le `DESIGN.md` n'ont pas été produits. J'ai suivi à la main
  les étapes 1 à 3 de `reference/new-work-world.md`, les règles du mode **Operate**
  (`reference/mode-operate.md`) et le plancher de qualité (`reference/craft-floor.md`).
- **Skill design-taste-frontend.** Il se déclare lui-même hors champ pour une interface d'application
  (section 13). J'en ai gardé les garde-fous transposables : pas de violet IA, pas de tirets longs
  dans l'interface, une seule règle d'arrondis, contraste des boutons et des champs, états vide /
  chargement / erreur, et pas d'icônes dessinées à la main.
- **Mode Operate.** Le monde de chaque direction ne fournit que la typographie, la palette, la
  densité et **un geste signature**. La navigation, les contrôles et la mise en page restent ceux
  d'un catalogue web standard.
- **Ornières écartées** (étape 1 d'impeccable) : l'appareil Pokédex rouge et blanc avec des boutons
  ronds (la lecture littérale du nom du produit) et son contraire, le Pokédex « tech » sombre aux
  néons. Les trois directions viennent d'ailleurs dans le monde du public : le guide naturaliste,
  l'album d'autocollants à collectionner, la signalétique de transport.
- **Scène d'usage** (pour choisir clair ou sombre) : un étudiant ou un fan qui parcourt le catalogue
  sur téléphone ou ordinateur portable, souvent le soir. Le thème clair par défaut est imposé par
  FR-023 ; le sombre doit donc être soigné, pas seulement inversé.
- **Données réelles** : types, tailles, poids, statistiques et noms français vérifiés le 2026-11-23
  par appel à `pokeapi.co/api/v2/pokemon/{id}` et `pokemon-species/{id}`.
- **Polices** : disponibilité vérifiée dans `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`
  (Next 16.4.6 installé). Aucune ne figure dans les listes « par défaut » qu'impeccable demande
  d'éviter (Inter, DM Sans, Space Grotesk, IBM Plex…).
- **Icônes** : tracés copiés des fichiers SVG de Phosphor Icons (`@phosphor-icons/core@2.1.1`,
  licence MIT), intégrés directement dans le HTML. Aucune dépendance (voir Q-T012-c).

---

## 4. Direction 1 : Planche naturaliste

**Intention.** Le Pokédex comme un guide de terrain bien composé : chaque Pokémon est un spécimen
étiqueté, mesuré, rangé, avec la précision calme d'une planche de muséum.

**Palette** (stratégie « retenue » : neutres légèrement teintés vers le vert-gris, un accent encre
bleue ; les couleurs de type portent toute la couleur vive).

| Rôle | Clair | Sombre |
|---|---|---|
| Accent `--color-pokedex` | `#1d4f91` (encre) | `#93b6ea` |
| Texte sur accent | `#ffffff` (8,14:1) | `#0f1a2e` (8,38:1) |
| Fond | `#f2f5f3` | `#111613` |
| Surface (cartes, en-tête) | `#ffffff` | `#18201b` |
| Texte | `#17201c` (16,7:1 sur surface, 15,2:1 sur fond) | `#e6ece8` (13,9:1 / 15,3:1) |
| Texte secondaire | `#52605a` (6,6:1 / 6,0:1) | `#9aa9a1` (6,8:1 / 7,5:1) |
| Filets | `#dbe2de` | `#2b3630` |
| Accent comme texte | 8,1:1 sur surface, 7,4:1 sur fond | 8,0:1 / 8,8:1 |

**Typographie.** Schibsted Grotesk (variable 400 à 800, `next/font/google`), une grotesque
éditoriale nette, aux chiffres tabulaires propres. Tailles : `text-xs` (méta, badges, numéros,
libellés de stats), `text-base` (noms, navigation, boutons, corps), `text-2xl` (titres de page et de
fiche). Filigrane décoratif en `text-5xl` (carte) et `text-8xl` (fiche).

**Carte.** `rounded-xl`, bordure fine, `shadow-sm`. En haut, un champ carré teinté
`bg-linear-to-b from-(--teinte)/25 to-(--teinte)/5`, avec l'image (`drop-shadow-lg`) et le numéro en
filigrane en haut à droite (`text-(--teinte)/20`, chiffres tabulaires). En bas, séparée par un filet,
l'« étiquette » : nom à gauche, `#025` à droite en petit, badges dessous. Étoile de favori dans un
rond translucide en haut à gauche.

**En-tête.** Collant, surface blanche translucide avec `backdrop-blur` (proposition du cours), filet
bas. « Mon Pokédex » à gauche ; à droite la navigation en liens texte (page courante soulignée de 2 px
à l'accent), les compteurs en clair dans le lien (« Favoris 3 », « Sacoche 3/6 »), le bouton plein
« Au hasard » avec l'icône de mélange, et le bouton de thème (lune / soleil). À 375 px : titre et
boutons sur une ligne, navigation sur la seconde.

**Arrondis.** Cartes et fiche `rounded-xl` ; boutons et champ `rounded-lg` ; badges et filtres
`rounded-full`.

**Geste signature : la règle graduée.** Le rail des barres de statistiques porte une graduation tous
les 50 points (dégradé répété, aucun JavaScript), comme une règle de mesure. Taille et poids sont
présentés en fiche signalétique (deux cases séparées par un filet).

**Micro-interactions.** Survol de carte : `-translate-y-1` en 200 ms ; image `scale-110` en 300 ms ;
ombre teintée en opacité 200 ms ; étoile `scale-110` au survol, `scale-95` à l'appui, 150 ms ;
boutons `active:scale-95`. Au clavier, `focus-within` soulève la carte comme au survol. Tout est
coupé par `motion-reduce:`.

**Fiche.** Deux colonnes à partir de `md` : grande image sur champ teinté avec filigrane `025` ;
à droite numéro, nom, badge, taille et poids, barres graduées remplies de `--teinte`, boutons
« Ajouter à la sacoche » (plein) et « Comparer » (contour). Évolutions en rangée de vignettes
reliées par des flèches, l'étape courante surlignée par la teinte.

**Vigilance accessibilité.** Filigrane à 20 % d'opacité : décoratif, il n'est pas lisible et ne doit
pas l'être (`aria-hidden`, numéro lisible ailleurs). Le soulignement de la page courante ne repose
pas que sur la couleur (épaisseur 2 px + graisse). L'en-tête translucide doit rester opaque à plus de
80 % pour garder le contraste du texte au-dessus des cartes qui défilent.

**Risque.** C'est la direction la plus proche de la carte proposée par le cours : la plus sûre, mais
aussi la plus familière. Elle se distingue surtout par ses détails (étiquette, règle graduée).

## 5. Direction 2 : Album à compléter

**Intention.** Le Pokédex comme un album d'autocollants à remplir : chaque carte est une vignette
numérotée, les favoris et la sacoche se remplissent comme des emplacements, et l'envie de compléter
la collection guide le parcours.

**Palette** (retenue : neutres bleu-gris froids, **l'accent du cours conservé**).

| Rôle | Clair | Sombre |
|---|---|---|
| Accent `--color-pokedex` | `#d2232f` (valeur du cours) | `#d2232f` en fond, `#ff7a80` en texte |
| Texte sur accent | `#ffffff` (5,22:1) | `#ffffff` (5,22:1) |
| Fond | `#eef1f5` | `#11141a` |
| Surface | `#ffffff` | `#1a1f27` |
| Texte | `#161a22` (17,4:1 / 15,4:1) | `#eceff4` (14,4:1 / 16,0:1) |
| Texte secondaire | `#575f6d` (6,4:1 / 5,7:1) | `#a1a9b6` (7,0:1 / 7,8:1) |
| Accent comme texte | 5,2:1 sur surface, 4,6:1 sur fond | `#ff7a80` : 6,6:1 / 7,3:1 |

**Typographie.** Bricolage Grotesque (variable : graisse 400 à 800, largeur 75 à 100, taille optique),
une grotesque à caractère, qui reste lisible en petit. Son axe de largeur sert la signature : numéros
et titres en version étroite et très grasse (`font-stretch: 75 %` / `85 %`). Tailles : `text-xs`,
`text-base`, `text-3xl`. Filigrane décoratif en `text-7xl` (carte) et `text-9xl` (fiche).

**Carte.** Une vignette : cadre blanc `rounded-2xl` de 8 px (`p-2`) autour d'un champ image
`rounded-xl` en dégradé radial `bg-radial-[at_50%_35%] from-(--teinte)/35 to-(--teinte)/10`. Numéro
d'album en filigrane, étroit et très gras, qui déborde en bas à droite comme un numéro imprimé. Sous
l'image : « N° 025 », le nom en gras, les badges. Étoile dans un rond blanc en haut à droite.

**En-tête.** Collant, translucide. Navigation en pilules : la page courante est une pilule pleine
rouge, texte blanc. Favoris : compteur dans une petite pastille. Sacoche : **6 pastilles, dont 3
pleines** (état réel, pas une décoration ; « 3/6 » en texte à 375 px et pour les lecteurs d'écran).
« Au hasard » en bouton contour rouge, pour ne pas concurrencer la page courante.

**Arrondis.** Tout ce qui est interactif est `rounded-full` (pilules) ; vignettes `rounded-2xl` ;
champ image `rounded-xl`.

**Geste signature : les emplacements numérotés.** La sacoche montre 6 emplacements au format
vignette : les vides ont une bordure en tirets avec leur grand numéro étroit (4, 5, 6) et
« Emplacement libre ». Le même vocabulaire relie la grille (vignettes numérotées), les favoris et la
sacoche ; c'est la direction où le monde explique le mieux les fonctionnalités.

**Micro-interactions.** Survol de carte : `-translate-y-1` et `-rotate-1` (la vignette se décolle)
en 200 ms ; image `scale-110` en 300 ms ; ombre teintée en opacité 200 ms ; étoile `scale-110`, et
`scale-90` à l'appui (on « colle »), 150 ms. `motion-reduce:` annule déplacement et rotation. La
vignette de la fiche est inclinée de 1° à l'arrêt (aucune animation), redressée si l'utilisateur
réduit les animations.

**Fiche.** Grande vignette inclinée à gauche (2/5), contenu à droite (3/5). Taille et poids en
pastilles arrondies. Barres épaisses (`h-4`) arrondies, rail et remplissage dans la teinte du type.
Bouton « Coller dans la sacoche » (libellé à valider, sinon « Ajouter à la sacoche »). Évolutions en
petites vignettes, l'étape courante cerclée de la teinte.

**Vigilance accessibilité.** Rouge sur fond `#eef1f5` à 4,61:1 : juste au-dessus du seuil, donc
l'accent ne doit pas servir de texte en dessous de 14 px sur ce fond. La rotation au survol peut
gêner certains utilisateurs : elle est coupée par `motion-reduce:` et reste à 1°. Le filigrane étroit
est décoratif.

**Risque.** L'accent rouge est proche des types Feu et Combat ; il reste lisible parce qu'il n'apparaît
que dans l'interface (navigation, boutons), jamais sur une carte. Bricolage Grotesque avec trois axes
est sans doute plus lourd à télécharger qu'une police à un axe (non mesuré ; `next/font` ne garde que
le sous-ensemble latin).

## 6. Direction 3 : Signalétique

**Intention.** Le Pokédex comme un plan de transport : lisible d'un coup d'œil, dense, chiffres
alignés, et les couleurs de type utilisées comme des couleurs de lignes.

**Palette** (retenue, poussée au maximum : un accent « encre » noir et blanc, si bien que **les seules
couleurs vives de l'écran sont celles des types**).

| Rôle | Clair | Sombre |
|---|---|---|
| Accent `--color-pokedex` / encre | `#111317` | `#f1f2f4` |
| Texte sur accent | `#ffffff` (18,6:1) | `#0c0d10` (17,4:1) |
| En-tête | `#111317`, texte blanc | `#17191e`, texte blanc |
| Fond | `#f5f6f7` | `#0c0d10` |
| Surface | `#ffffff` | `#17191e` |
| Texte | `#111317` (18,6:1 / 17,2:1) | `#f1f2f4` (15,7:1 / 17,4:1) |
| Texte secondaire | `#4e5561` (7,5:1 / 6,9:1) | `#a4abb5` (7,6:1 / 8,4:1) |
| Filets | `#dfe2e6` | `#2a2e35` |

**Typographie.** Atkinson Hyperlegible Next (variable 200 à 800), dessinée pour le Braille Institute
afin de distinguer les caractères proches. Tailles : `text-xs`, `text-sm`, `text-xl` (la plus
compacte des trois). Filigrane décoratif en `text-6xl` et `text-9xl`.

**Carte.** `rounded-md`, bordure fine, pas d'ombre au repos. Champ image en 4:3 (cartes plus basses,
donc plus de Pokémon visibles par écran), dégradé `from-(--teinte)/20` en diagonale, numéro en
filigrane en bas à gauche. Étiquette : nom en gras, code `025` aligné à droite, badges **rectangulaires
`rounded-sm`** comme des indicateurs de ligne. Grille plus serrée : `gap-2` puis `sm:gap-4`.

**En-tête.** Bandeau noir opaque, comme un panneau. Page courante en case blanche, texte noir.
Compteurs dans des cases (`Favoris 3`, `Sacoche 3/6`). « Au hasard » en bouton blanc. Le champ de
recherche affiche la touche `/` dans un `kbd`. Filtres par type en cases avec un carré de couleur.

**Arrondis.** Conteneurs `rounded-md` ; badges, filtres et compteurs `rounded-sm`. Évolutions en
cercles (stations).

**Geste signature : la ligne d'évolution.** Sur la fiche, la chaîne d'évolution est dessinée comme une
ligne de métro : stations rondes cerclées de la teinte du type, reliées par un trait de 4 px de la même
teinte ; la station courante est remplie. Les branches (Évoli) se dessineraient comme un embranchement
de ligne. Uniquement du CSS, pas de SVG ni de JavaScript.

**Micro-interactions.** Les plus sobres : survol `-translate-y-0.5` en 150 ms, image `scale-105` en
200 ms, ombre teintée en opacité 200 ms, boutons `active:scale-95`.

**Fiche.** Image à gauche (2/5) sur champ teinté avec grand filigrane ; à droite nom et code, badge,
une ligne de trois mesures (taille, poids, **total des stats**, valeur calculée à l'affichage et non
stockée), barres fines à angles droits, boutons noirs. Ligne d'évolution en pleine largeur dessous.
Sacoche en liste numérotée 1 à 6, compacte.

**Vigilance accessibilité.** Atkinson Hyperlegible Next **barre ses zéros** (« Ø25 ») : c'est voulu
pour la lisibilité, mais cela surprend dans les numéros et « 1 Ø25 Pokémon ». À voir sur la maquette
avant de choisir. L'en-tête noir en thème clair est la zone la plus contrastée de la page : il attire
l'œil avant les cartes, ce qui affaiblit un peu la règle « l'image d'abord ».

**Risque.** L'accent noir et blanc est une lecture de la règle « une couleur d'accent » : on peut
estimer qu'il n'y a plus d'accent du tout (question Q-T012-a). L'en-tête opaque s'écarte aussi de la
suggestion du cours (« en-tête collant, légèrement translucide »), qui n'est pas une case de la
checklist.

---

## 7. Comparaison

| | 1. Planche naturaliste | 2. Album à compléter | 3. Signalétique |
|---|---|---|---|
| Proximité avec la carte du cours | Très proche | Proche (vignette) | Plus éloignée (4:3, angles vifs) |
| Accent | Encre bleue (nouveau) | Rouge du cours, inchangé | Encre noir / blanc |
| Caractère | Calme, précis | Chaleureux, ludique | Efficace, dense |
| Geste signature | Règle graduée des stats | Emplacements numérotés (sacoche, collection) | Ligne d'évolution en métro |
| Lien entre le monde et les fonctionnalités | Moyen | Fort (collection, favoris, sacoche de 6) | Fort sur la fiche, faible ailleurs |
| Densité de la grille | Moyenne | Aérée | Forte |
| Mouvement | Moyen | Le plus expressif (décollement) | Minimal |
| Point d'attention principal | Familière | Rouge à 4,61:1 sur fond, rotation | Zéros barrés, accent discutable |

## 8. Recommandation

**Je recommande la direction 2, « Album à compléter ».**

1. **Conformité au cours** : c'est la seule direction qui garde l'accent du cours tel quel
   (`--color-pokedex: #d2232f`). Il y a donc un écart de moins à documenter dans
   `docs/05-tailwind-interface.md`. Les quatre principes et la checklist des étapes 5 et 6 sont
   couverts, comme dans les deux autres.
2. **Le monde explique le produit** : la grille de vignettes numérotées, les favoris et surtout la
   sacoche de 6 emplacements (règle métier évaluée au ch. 9) parlent le même langage. La page Sacoche,
   souvent la plus pauvre, devient la plus réussie : les emplacements vides numérotés rendent la règle
   « 6 au plus » visible sans texte.
3. **Moins générique sans coûter en performance** : pas de bibliothèque, pas de composant client de
   plus. Le décollement des vignettes ne touche que `transform` et `opacity`.

Une amélioration possible, à la demande : reprendre dans la direction 2 la **ligne d'évolution** de la
direction 3. Ce serait un emprunt de composant, pas de monde ; je ne l'ai pas intégré pour garder les
trois directions comparables.

Pourquoi pas les autres : la direction 1 est excellente si l'utilisateur préfère la sécurité et la
sobriété, mais c'est celle qu'on devinerait à partir de la carte du cours. La direction 3 est la plus
lisible et la plus dense, mais son accent noir et blanc et ses zéros barrés demandent deux arbitrages
de plus.

## 9. Recommandations des skills écartées parce que le cours (ou la spec) l'interdit

| Recommandation | Source | Raison de l'écart |
|---|---|---|
| Bibliothèque Motion (`motion/react`), GSAP, animations au défilement | design-taste-frontend §3.A, §5 | Ch. 5 : mouvement discret, moins de 0,5 s ; constitution V et VI : pas de bibliothèque d'animation, peu de composants client (Lighthouse > 90) |
| `transition: all`, animer flou, `backdrop-filter`, `clip-path`, ombres | design-taste-frontend §7, impeccable craft-floor (Motion) | Ch. 5 : animer `transform` et `opacity` seulement. L'ombre de survol passe par l'opacité d'un pseudo-élément |
| Suivre `prefers-color-scheme` par défaut | design-taste-frontend §6.C, §8.C | FR-023 et research R7 : clair par défaut, bascule manuelle mémorisée |
| Pas de barres de progression avec rail rempli | design-taste-frontend §9.F | Ch. 8 : `BarresStats` du cours a un rail gris ; il est gardé |
| Installer une bibliothèque d'icônes (`@phosphor-icons/react`…) | design-taste-frontend §3.C | Constitution, Flux de travail : pas de dépendance hors pile sans accord. Les maquettes intègrent les tracés SVG Phosphor (MIT) sans dépendance ; voir Q-T012-c |
| Pas de caractères Unicode comme icônes (☆ / ★) | impeccable craft-floor | La spec (story 4) cite « ☆ / ★ ». Les maquettes utilisent des SVG ; c'est à confirmer (Q-T012-c) |
| Pas de verre ni de flou décoratif | impeccable craft-floor | Le cours propose l'en-tête « légèrement translucide » avec `backdrop-blur` : gardé dans les directions 1 et 2 |
| Palette « engagée » pour la coque (en-tête coloré, fond teinté) | impeccable mode-operate | Ch. 5 : « une couleur d'accent, plus les couleurs de type ». Seule la direction 3 a un en-tête plein, en noir (pas une couleur de plus) |
| Écrire `PRODUCT.md`, `DESIGN.md`, `.impeccable/`, surface brief, hook | impeccable Setup, new-work §5 à 7 | Interdiction d'écrire hors de `design/` pour cette tâche (un autre agent travaille dans le dépôt). À faire après validation si l'utilisateur le souhaite |
| Image hero, photos, maquettes générées par image | design-taste-frontend §4.8, impeccable comps | Ce n'est pas une page vitrine ; les seules images sont les illustrations officielles de la PokéAPI. Aucun outil de génération d'image dans cette session |

## 10. Références d'inspiration

Aucune n'a été copiée ; aucune charte, aucun logo Pokémon ou Nintendo n'est utilisé (les seules images
sont les illustrations de la PokéAPI, comme dans le cours).

**Dribbble.** Les pages de profil et de collection ci-dessous ont été lues le 2026-11-23 et listent bien
les shots cités. En revanche, les pages de shot renvoient une page vide aux robots (code HTTP 202) :
**je n'ai pas pu voir leurs visuels**. Elles prouvent qu'un Pokédex web en grille de cartes est un sujet
courant ; elles n'ont pas guidé un choix précis.

- Ray (rayc2045), « Pokédex made with PokeAPI », shots étiquetés grille, cartes, typographie :
  <https://dribbble.com/rayc2045> (profil lu) ; shots :
  <https://dribbble.com/shots/20375627-Pok-dex-made-with-PokeAPI>,
  <https://dribbble.com/shots/20373285-Pok-dex-made-with-PokeAPI>
- Dario Fiore, « Pokedex - Main deck page », « Empty State », « 404 Page » (utile pour les états
  vides et la page introuvable) : <https://dribbble.com/dariofiore> (profil lu) ;
  <https://dribbble.com/shots/13206320-Pokedex-Main-deck-page>,
  <https://dribbble.com/shots/13206252-Pokedex-Empty-State>,
  <https://dribbble.com/shots/13206178-Pokedex-404-Page>
- Katalin Kiss, collection « Pokédex » (« Info Card », « Interaction ») :
  <https://dribbble.com/kisskatalin/collections/7508842-Pok-dex> (collection lue)
- sulistryono, « Mobile Pokedex App - Design Exploration » :
  <https://dribbble.com/shots/16833947-Mobile-Pokedex-App-Design-Exploration> (listé sur
  <https://dribbble.com/sulistryono/shots>, page lue)

**Références du monde réel (décrites, sans lien)**, qui ont réellement orienté les directions :

- Direction 1 : les guides de terrain naturalistes et les étiquettes de spécimens de muséum (numéro
  d'inventaire, nom, mesures dans une case, règle graduée sur les planches).
- Direction 2 : les albums d'autocollants à compléter (vignettes numérotées, emplacements vides
  imprimés avec leur numéro, plaisir de « coller »).
- Direction 3 : les plans de métro et la signalétique de transport (couleurs de ligne, stations
  rondes, numéros alignés), et la police Atkinson Hyperlegible du Braille Institute.

## 11. Questions pour l'utilisateur

Les numéros sont provisoires ; le manager les renumérotera dans la suite des Q-n.

```
QUESTION Q-T012-a — Direction artistique
Contexte : FR-031, constitution IV ; T012 bloque T013 et tout le travail visuel.
Options :
  A. Planche naturaliste — sobre, proche du cours, accent encre bleue #1d4f91.
  B. Album à compléter — accent du cours #d2232f conservé, signature « emplacements numérotés ».
  C. Signalétique — dense et très lisible, accent noir/blanc, signature « ligne d'évolution ».
  D. B en reprenant la ligne d'évolution de C.
Recommandation : B parce que c'est la seule qui garde l'accent du cours et que son monde rend
visibles les règles de la sacoche et des favoris.
Bloquant pour : T013, T014 à T018 (police next/font), T029, puis toute l'interface.
```

```
QUESTION Q-T012-b — Ajuster 11 couleurs de type pour le contraste
Contexte : ch. 11 « contraste suffisant des badges de type » ; T013. Avec du texte blanc en 12 px
gras, 11 des 18 couleurs du cours sont sous 4,5:1 (de 3,81 à 4,48).
Options :
  A. Adopter les 11 valeurs assombries (tableau section 2), toutes à 4,60:1 ou plus.
  B. Garder les couleurs du cours et passer les badges en texte plus grand (au moins 14 px gras,
     seuil 3:1) — ajoute une taille de texte et grossit les badges.
  C. Garder les couleurs du cours telles quelles — badges non conformes à WCAG AA.
Recommandation : A parce que l'écart visuel est minime et que le point est évalué au ch. 11.
Bloquant pour : T013.
```

```
QUESTION Q-T012-c — Icônes (étoile, sacoche, hasard, thème)
Contexte : la spec (story 4) écrit « ☆ / ★ » ; le cours n'impose pas d'icônes ; impeccable
déconseille les caractères Unicode comme icônes ; une bibliothèque serait une dépendance hors pile.
Options :
  A. Caractères ☆ / ★ comme dans la spec, pas d'autres icônes.
  B. Quelques SVG copiés de Phosphor Icons (MIT) dans un petit composant serveur, sans dépendance
     (ce que montrent les maquettes).
  C. Ajouter la dépendance @phosphor-icons/react.
Recommandation : B parce que le rendu est net et identique partout, sans dépendance ni composant
client, avec la licence citée dans docs/05.
Bloquant pour : T015, T017, carte (T029), favoris (US4).
```

## 12. Ce qui reste à faire après validation

- Consigner la direction retenue, les ajustements de couleurs et les écarts listés en section 9 dans
  `docs/05-tailwind-interface.md` (exigé par T012 ; je ne l'ai pas fait, car je ne dois écrire que
  dans `design/`).
- T013 : reporter les jetons de la direction retenue dans `app/globals.css` (`@theme`), avec
  `--color-pokedex`, les neutres clair et sombre, les 18 couleurs de type et `--animate-apparition`.
- T018 : charger la police retenue avec `next/font/google` (remplace Geist, installé par
  `create-next-app`).
- Facultatif : lancer `impeccable init` puis `document` pour créer `PRODUCT.md` et `DESIGN.md`, et
  activer le hook de détection d'impeccable (`impeccable hooks on`).
- Non vérifié : poids réel des polices et score Lighthouse (rien n'est construit) ; rendu dans Safari
  et Firefox (seul Chrome a servi aux contrôles).
