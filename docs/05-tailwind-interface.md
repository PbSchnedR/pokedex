# Ch. 5 — Tailwind CSS et interface

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.
> La direction artistique (phase C, T012) et le thème clair/sombre (T014, research R7) seront
> consignés ici après validation de l'utilisateur.

## Thème Tailwind 4 dans `globals.css` (`@theme`)

- **Point du cours** : ch. 5, leçon « Thème personnalisé et couleurs par type » — fichier
  `app/globals.css` : `@import "tailwindcss";` puis un bloc `@theme` avec `--color-pokedex` et
  les 18 `--color-type-*`. Les valeurs hexadécimales sont celles du cours, à l'identique.
- **Choix** : le contenu généré par `create-next-app` (`:root`, `@theme inline` pour les
  polices Geist, `@media (prefers-color-scheme: dark)`, `body { font-family: Arial }`) est
  remplacé par le fichier du cours.
- **Justification** : le cours donne le fichier complet. Le bloc `prefers-color-scheme`
  généré aurait de plus mis le site en sombre selon le système, ce que FR-023 refuse (clair par
  défaut, bascule mémorisée : T014). La police sera posée par `next/font` à l'étape 7 (T018),
  après le choix de la phase C.
- **Alternatives écartées** : un `tailwind.config.js` (Tailwind 4 se configure dans le CSS) ;
  garder les styles générés (thème sombre système, police Arial).
- **Vérifié** : après `npm run build`, la feuille produite contient `--color-type-fire`,
  `.bg-type-fire`, `.bg-type-fairy`, `--color-pokedex` et `@keyframes apparition`.
- **Fichiers** : `app/globals.css`.

## Animation `apparition`

- **Point du cours** : ch. 5, « Le mouvement : discret et utile » —
  `--animate-apparition: apparition 0.4s ease-out both;` et ses `@keyframes` dans `@theme`.
- **Choix** : repris tel quel. Durée 0,4 s (< 0,5 s), seules `opacity` et `transform`
  (`translateY(8px)` → `none`) sont animées : elles ne forcent pas de recalcul de mise en page.
  Le réglage « réduire les animations » sera respecté par `motion-reduce:` sur chaque élément
  animé (étapes 5–6, T026).
- **Fichiers** : `app/globals.css`.

## Couleurs de type : table de correspondance `TYPES`

- **Point du cours** : ch. 5, même leçon — piège « `bg-type-${type}` ne produit aucun style » ;
  `lib/types.ts` avec `TYPES: Record<string, { libelle: string; classe: string }>`.
- **Choix** : 18 entrées, clé = nom anglais de l'API, `libelle` français, `classe` **écrite en
  entier** (`"bg-type-fire"`). « La donnée reste en anglais […] On ne la traduit qu'à
  l'affichage. »
- **Justification** : Tailwind lit les fichiers comme du texte et ne garde que les classes
  complètes qu'il y trouve ; une classe construite à l'exécution n'existe pas dans la feuille.
- **Alternatives écartées** : classes construites dynamiquement (aucun style produit) ;
  `style={{ background }}` en ligne (le cours réserve `style` aux barres de stats et aux
  variables CSS).
- **Fichiers** : `lib/types.ts`.

## Teinte de carte par variable CSS : `teinteType`

- **Point du cours** : ch. 5, leçon « Design », « Une teinte par carte, avec une variable CSS »
  — `teinteType(type)` renvoie `var(--color-type-${type})`, repli `var(--color-gray-500)`.
- **Choix** : repris tel quel ; la carte (T026) posera `--teinte` en style local et les classes
  l'utiliseront (`from-(--teinte)/25`).
- **Vérifié** (exécution du module) : 18 types, `teinteType("fire")` →
  `var(--color-type-fire)`, `teinteType("licorne")` → `var(--color-gray-500)`.
- **Limite constatée, à traiter au ch. 9** : `type in TYPES` est aussi vrai pour les clés
  héritées d'`Object.prototype` (`teinteType("toString")` → `var(--color-type-toString)`).
  Sans effet ici (les types viennent de l'API), mais la validation de `?type=` dans l'adresse
  (ch. 9, FR-011) ne devra pas accepter `?type=constructor`. Signalé au manager ; le code du
  cours est conservé tel quel.
- **Fichiers** : `lib/types.ts`.

## Direction artistique retenue : « Album à compléter » (T012, décision Q-T012-a)

- **Point du cours** : ch. 5, leçon « Design » — quatre principes (hiérarchie, espace, couleur
  porteuse d'information, cohérence), « une couleur d'accent, plus les couleurs de type »,
  « deux ou trois tailles de texte », mouvement < 0,5 s sur `transform` et `opacity`.
- **Décision de l'utilisateur** (2026-11-23) : direction 2 « Album à compléter », parmi trois
  propositions faites avec les skills impeccable et design-taste-frontend. Dossier complet :
  `specs/001-pokedex-app/design/directions.md` ; maquette de référence :
  `specs/001-pokedex-app/design/direction-2.html`.
- **Ce que la direction fixe** :
  - accent : `--color-pokedex: #d2232f`, **valeur du cours conservée** ; en thème sombre,
    `#ff7a80` quand l'accent sert de texte ;
  - neutres bleu-gris froids : fond `#eef1f5` / `#11141a`, surface `#ffffff` / `#1a1f27`,
    texte `#161a22` / `#eceff4`, texte secondaire `#575f6d` / `#a1a9b6` (contrastes ≥ 4,5:1,
    calculés dans `directions.md`) ;
  - police : **Bricolage Grotesque** (Google Fonts, chargée par `next/font`), axes graisse,
    largeur et taille optique ; numéros et titres en version étroite très grasse ;
  - trois tailles de texte : `text-xs`, `text-base`, `text-3xl` (le filigrane décoratif,
    `aria-hidden`, n'en fait pas partie) ;
  - carte = vignette : cadre blanc `rounded-2xl` `p-2` autour d'un champ image `rounded-xl` en
    dégradé radial de la teinte du type, numéro en filigrane étroit qui déborde en bas à droite ;
  - en-tête collant translucide (proposition du cours), navigation en pilules `rounded-full` ;
  - geste signature : la sacoche en 6 emplacements numérotés (étape 16) ;
  - micro-interactions : survol de carte `-translate-y-1` + `-rotate-1` (200 ms), image
    `scale-110` (300 ms), ombre teintée animée par son **opacité** (200 ms), étoile `scale-110`
    puis `scale-90` à l'appui (150 ms) ; tout est coupé par `motion-reduce:`.
- **Alternatives écartées** : direction 1 « Planche naturaliste » (accent encre bleue, la plus
  proche de la carte du cours, jugée familière) ; direction 3 « Signalétique » (accent noir et
  blanc discutable au regard de « une couleur d'accent », zéros barrés de la police).
- **Inspirations citées** (aucune copiée) : albums d'autocollants à compléter (vignettes
  numérotées, emplacements vides imprimés) ; shots Dribbble listés en section 10 de
  `directions.md`, dont les visuels n'ont pas pu être consultés par l'agent.

## Couleurs de type assombries pour le contraste (décision Q-T012-b, écart au cours)

- **Point du cours** : ch. 5 donne les 18 couleurs ; ch. 11 exige un « contraste suffisant des
  badges de type ».
- **Constat** : les badges sont en texte blanc gras de 12 px (`text-xs`), donc soumis au seuil
  WCAG AA de 4,5:1. 11 couleurs du cours sur 18 sont en dessous (de 3,81:1 à 4,48:1).
- **Décision de l'utilisateur** : assombrir ces 11 couleurs, en gardant teinte et saturation, du
  minimum nécessaire pour atteindre au moins 4,6:1. **C'est un écart au code du cours, consigné
  ici comme correction d'accessibilité (ch. 11).** Les 7 autres sont inchangées.

  | Type | Cours | Retenu | Blanc sur retenu |
  |---|---|---|---|
  | normal | `#7b7b6c` | `#767668` | 4,60 |
  | fire | `#d2571c` | `#c4511a` | 4,63 |
  | electric | `#9a7400` | `#946f00` | 4,63 |
  | grass | `#3f8f3a` | `#3a8436` | 4,63 |
  | ice | `#2e8f93` | `#298083` | 4,66 |
  | ground | `#9c7a2e` | `#8f702a` | 4,65 |
  | flying | `#5b78c9` | `#5371c6` | 4,62 |
  | psychic | `#d43d6c` | `#d33969` | 4,61 |
  | bug | `#7c8a1a` | `#6f7b17` | 4,64 |
  | rock | `#8f7d35` | `#857431` | 4,63 |
  | fairy | `#c2528f` | `#bf4a8a` | 4,60 |

- **Alternatives écartées** : badges en 14 px gras (seuil 3:1, mais une taille de texte de plus) ;
  couleurs du cours inchangées (badges non conformes AA).
- **Fichiers** : `app/globals.css` (T013).

## Icônes SVG Phosphor copiées dans le code (décision Q-T012-c)

- **Point du cours** : aucun (le cours n'impose pas d'icônes ; la spec écrit « ☆ / ★ »).
- **Décision de l'utilisateur** : quelques tracés SVG de **Phosphor Icons** (licence MIT,
  © Phosphor Icons, https://phosphoricons.com) copiés directement dans un composant, **sans
  dépendance npm**. L'étoile des favoris reste une étoile vide / pleine (SVG au lieu des
  caractères « ☆ / ★ » de T054), avec `aria-pressed` et `aria-label` inchangés.
- **Alternatives écartées** : caractères Unicode (rendu inégal selon les polices) ; dépendance
  `@phosphor-icons/react` (hors pile du cours).

## Recommandations des skills écartées (cours et constitution prioritaires)

Le détail est dans la section 9 de `directions.md`. En résumé : pas de bibliothèque d'animation
(Motion, GSAP), pas d'animation d'ombre, de flou ou de couleur (seules `transform` et `opacity`),
pas de thème selon `prefers-color-scheme` par défaut (FR-023), rail gris des barres de stats
conservé (ch. 8), pas de dépendance d'icônes, en-tête translucide du cours conservé malgré le
conseil « pas de verre » d'impeccable.

Un réglage de la maquette **n'est pas repris** : elle raccourcit `animate-apparition` à 0,32 s
avec un décalage par carte. L'application garde la définition du cours (0,4 s, `ease-out`, sans
décalage) : aucun écart à justifier, et la durée reste sous 0,5 s.

## Jetons de la direction dans `@theme` (T013)

- **Choix** : `app/globals.css` reçoit l'accent du cours (`--color-pokedex`) et sa variante de
  texte en sombre (`--color-pokedex-sombre`), les neutres `fond`, `surface`, `encre`, `doux` en
  versions claire et sombre, et les 18 couleurs de type (11 ajustées, valeur du cours en
  commentaire). Pas de jeton de rayon ni d'ombre : la direction utilise ceux de Tailwind
  (`rounded-xl`, `rounded-2xl`, `rounded-full`, `shadow-sm`), ce qui suffit à la cohérence.
- **Contrastes recalculés** par l'agent (formule WCAG 2.x, script Node) : blanc sur les 18 types
  de 4,60:1 à 9,52:1 ; accent sur blanc 5,22:1, sur fond 4,61:1 ; texte secondaire 5,68:1 (fond
  clair) et 7,79:1 (fond sombre) ; accent sombre `#ff7a80` 6,58:1 sur surface sombre.
- **Fichiers** : `app/globals.css`.

## Thème clair par défaut, bascule sombre mémorisée (FR-023, research R7)

- **Point du cours** : ch. 5, « États et thème sombre » (classes `dark:`) et étape 5 —
  « L'interface reste lisible en thème sombre ». Le cours ne fixe pas comment le thème est choisi.
- **Choix (décision utilisateur)** : clair par défaut, bouton de bascule, choix mémorisé dans
  `localStorage["pokedex-theme"]` (`"clair"` | `"sombre"`).
  - `@custom-variant dark (&:where(.dark, .dark *));` dans `globals.css` : la variante `dark:`
    suit la classe `dark` de `<html>` et non plus le réglage du système. Syntaxe vérifiée sur
    Tailwind 4.3.3 : la feuille produite contient les règles `.dark` et le rendu sombre a été
    contrôlé à l'écran.
  - Script en ligne dans `<head>` (`app/layout.tsx`) : pose la classe avant le premier affichage,
    donc pas de flash clair ; `try/catch` si le stockage est indisponible.
  - `BoutonTheme` (client) : bascule la classe et écrit le choix. Son état affiché est **lu** dans
    la classe de `<html>` par `useSyncExternalStore` (valeur serveur : clair), au lieu d'être
    copié dans un `useState` : aucune erreur d'hydratation et aucune valeur dupliquée.
  - Accessibilité : `aria-pressed` (vrai en sombre) et libellé **fixe** « Thème sombre » : avec
    `aria-pressed`, changer aussi le libellé ferait annoncer un état contradictoire. L'icône
    (lune / soleil) change par CSS (`dark:hidden` / `dark:block`), sans attendre JavaScript.
- **Vérifié** (Chrome sans interface, serveur de développement) : premier passage sans clé →
  fond `#eef1f5` ; clé `"sombre"` → classe `dark` présente dès le chargement, fond `#11141a` ;
  clic → `aria-pressed="true"`, classe `dark`, stockage `"sombre"` ; second clic → retour en
  clair, stockage `"clair"` ; console vide.
- **Alternatives écartées** : `next-themes` (dépendance hors pile) ; thème selon le système
  (refusé par l'utilisateur) ; état React initialisé dans un `useEffect` (flash et règle ESLint
  contre `setState` dans un effet).
- **Fichiers** : `app/globals.css`, `app/layout.tsx`, `components/BoutonTheme.tsx`,
  `components/Icone.tsx`.
