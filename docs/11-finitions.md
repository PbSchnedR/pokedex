# Ch. 11 — Finitions

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Route Handler `GET /api/aleatoire` et `await connection()`

- **Point du cours** : ch. 11, « Un Route Handler » — `app/api/aleatoire/route.ts` renvoie un
  Pokémon tiré au hasard en JSON ; `await connection()` « dit à Next.js d'attendre une vraie
  requête avant de continuer. Sans cette ligne, il tenterait de préparer la réponse à l'avance, et
  le tirage serait le même pour tout le monde. »
- **Choix** : code du cours, conforme au contrat `specs/001-pokedex-app/contracts/api-aleatoire.md`
  (200 avec l'objet `Pokemon`, 404 `{ "erreur": "Pokémon introuvable" }`, 500 si la PokéAPI est
  en panne). Import de `connection` depuis `next/server` vérifié dans la documentation installée.
- **Vérifié** : trois appels successifs → Orthworm (#968), Absol (#359), Bramblin (#946).
- **Fichiers** : `app/api/aleatoire/route.ts`.

## Bouton « Au hasard »

- **Point du cours** : ch. 11, exercice « Bouton Au hasard » — `fetch("/api/aleatoire")`, puis
  `router.push` vers la fiche ; désactivé et « Tirage… » pendant l'appel ; `finally` remet le
  bouton en état même en cas d'échec.
- **Choix** : code du cours, style de la maquette (bouton contour rouge avec l'icône « mélange »
  Phosphor, pour ne pas concurrencer la pilule pleine de la page courante). `router.push` et non
  `Link` : la destination n'est connue qu'après l'appel (ch. 10).
- **Vérifié** : 3 clics depuis `/sacoche` → « Tirage… » inactif pendant l'appel, puis
  `/pokemon/banette`, `/pokemon/drifblim`, `/pokemon/cloyster`.
- **En-tête réorganisé** (direction « Album ») : avec ce bouton, titre + navigation + boutons ne
  tiennent sur une ligne qu'à partir de 1 024 px. En dessous, titre et boutons sur la 1re ligne,
  navigation sur la 2e (`order-last`, puis `lg:order-none`). L'exercice du ch. 5 plaçait le
  passage sur une ligne à `sm:` ; le seuil passe à `lg:` parce que l'en-tête contient plus
  d'éléments (vu à 640 px : les boutons passaient seuls à la ligne). L'ordre du DOM reste celui de
  l'écran large (titre, navigation, boutons) : c'est l'ordre de la touche Tab.
- **Fichiers** : `components/BoutonHasard.tsx`, `components/EnTete.tsx`, `components/Icone.tsx`.

## Variables d'environnement

- **Point du cours** : ch. 11, « Variables d'environnement » — `.env.local` n'est jamais commité ;
  une variable sans préfixe `NEXT_PUBLIC_` n'est lisible que sur le serveur ; ne jamais mettre une
  clé privée dans une variable `NEXT_PUBLIC_`.
- **Choix** : le projet n'a **aucune** variable d'environnement : la PokéAPI est publique, sans
  clé. Pas de fichier `.env.local` créé. La règle `.env*` du `.gitignore` généré le couvrirait
  (vérifié à l'étape 0 avec `git check-ignore`).

## Accessibilité : la liste de contrôle du ch. 11 (T073)

Liste du cours : clavier et élément actif visible ; `alt` et libellés ; un seul `<h1>` puis des
titres dans l'ordre ; texte lisible sur son fond (badges) ; bouton pour une action, lien pour une
navigation. S'y ajoutent `lang="fr"` et `motion-reduce` (constitution VI, FR-025).

### Parcours réel au clavier

Touches Tab et Entrée envoyées à Chrome sans interface par le protocole DevTools (pas de
simulation en JavaScript), focus relevé après chaque Tab, zones capturées et regardées.

- **`/` (1 280 px, clair), 34 Tab** : lien d'évitement « Aller au contenu » → « Mon Pokédex » →
  Pokédex → Favoris → Sacoche → « Au hasard » → « Thème sombre » → champ de recherche →
  « Tous » et les 18 types → pour chaque carte : le lien de la carte puis son étoile. Chaque
  élément a `:focus-visible` et un contour visible (`2px solid #d2232f`, ou l'anneau du champ).
  Entrée sur la 4ᵉ carte → `/pokemon/charmander`.
- **`/pokemon/pikachu` (375 px, sombre)** : en-tête, étoile, « Ajouter à la sacoche ». Contour
  `#ff7a80` en sombre. Entrée sur l'étoile → `aria-pressed="true"`.
- **`/sacoche` (375 px, sombre, 2 membres)** : « Vider la sacoche », champ de surnom, bouton
  « Retirer … », emplacements libres. Entrée sur un emplacement libre → `/`.
- **Corrigé grâce au parcours** : sur la page Sacoche (boutons « Retirer », emplacements libres) et
  dans le pied de page, le contour de focus restait `#d2232f` en thème sombre : 3,53:1 sur le fond
  et 3,17:1 sur une carte sombre. Ajout de `dark:focus-visible:outline-pokedex-sombre`
  (`#ff7a80`, 7,33:1), comme partout ailleurs.

### Structure de chaque page (audit automatique, 1 280 px)

| Page | `<h1>` | Plan des titres | Images sans `alt` | Champs sans libellé | Boutons / liens sans nom | Bouton dans un lien |
|---|---|---|---|---|---|---|
| `/` | 1 | h1 > h2 (cartes) | 0 | 0 | 0 | 0 |
| `/pokemon/eevee` | 1 | h1 > h2 > h3 | 0 | 0 | 0 | 0 |
| `/favoris` | 1 | h1 | 0 | 0 | 0 | 0 |
| `/sacoche` | 1 | h1 | 0 | 0 | 0 | 0 |
| 404 | 1 | h1 | 0 | 0 | 0 | 0 |

`<html lang="fr">` partout ; aucun `div` ou `span` cliquable.

- **Corrigé** :
  - fiche : les cartes de la section « Évolutions » (`<h2>`) portaient elles aussi un `<h2>`.
    `CartePokemon` et `GrillePokemons` acceptent maintenant `titre="h3"`, utilisé par la fiche
    (note de T073) ;
  - `app/error.tsx` : titre en `<h1>` (la page d'erreur remplace le contenu, qui n'a plus d'autre
    titre) et message en français pour le visiteur, au lieu du message technique `fetch failed`
    (note de T073). Vérifié pendant une panne simulée (adresse d'API invalide, puis rétablie) :
    « Le Pokédex ne répond plus », « Les données des Pokémon sont momentanément indisponibles.
    Réessayez dans un instant. ».

### Contraste et mouvement

- Badges : texte blanc de 4,60:1 à 9,52:1 sur les 18 couleurs (Q-T012-b, `docs/05`).
- Texte secondaire : 5,68:1 (clair) et 7,79:1 (sombre) sur le fond.
- `motion-reduce:` sur toutes les animations et transitions (vérifié à l'étape 5–6 par émulation).

### Boutons et liens

- Actions (favori, sacoche, retirer, vider, thème, hasard, réessayer) : `<button type="button">`.
- Navigations (cartes, en-tête, filtres, pagination, emplacements libres) : `Link`.

- **Fichiers** : `app/error.tsx`, `components/CartePokemon.tsx`, `components/GrillePokemons.tsx`,
  `app/pokemon/[nom]/page.tsx`, `app/sacoche/page.tsx`, `components/PiedDePage.tsx`.

## Performance : Lighthouse en production (T076)

- **Point du cours** : ch. 11, « Performance » — audit sur la version de production
  (`npm run build` puis `npm start`), viser plus de 90 dans chaque catégorie ; leviers :
  `next/image`, `loading="eager"` sur la grande image de la fiche, le cache, peu de composants
  client.
- **Méthode** : `npx lighthouse@12` (12.8.2, outil lancé à la demande, **pas** ajouté à
  `package.json`), Chrome sans interface, `npm start` sur un build neuf, 4 pages : `/`,
  `/pokemon/pikachu`, `/favoris`, `/sacoche`. Profil **mobile** par défaut de Lighthouse (réseau
  « 4G lent » simulé, processeur ralenti ×4) répété 4 fois, puis profil **ordinateur**
  (`--preset=desktop`) une fois.

### Résultats

Accessibilité, bonnes pratiques et référencement : **100** sur les 4 pages, dans toutes les
mesures retenues ci-dessous.

| Page | Ordinateur : perf. / FCP / LCP | Mobile : perf. sur 4 mesures | Mobile : FCP | Mobile : LCP |
|---|---|---|---|---|
| `/` | **98** / 0,3 s / 1,1 s | 76 · 76 · 84 · 88 | 0,9 s | 3,6 – 4,2 s |
| `/pokemon/pikachu` | **100** / 0,2 s / 0,7 s | 89 · 78 · 95 · 92 | 0,8 s | 2,8 – 3,2 s |
| `/favoris` | **100** / 0,2 s / 0,6 s | 81 · 78 · 89 · 92 | 0,8 s | 2,6 – 2,8 s |
| `/sacoche` | **100** / 0,2 s / 0,6 s | 95 · 78 · 96 · 84 | 0,8 – 1,0 s | 2,5 – 3,1 s |

- **First Contentful Paint** (cible SC-003 : < 1 s) : 0,2 – 0,3 s sur ordinateur, 0,8 – 1,0 s en
  mobile simulé.
- **Ordinateur** : objectif atteint partout (> 90 dans les 4 catégories).
- **Mobile** : objectif **non atteint de façon stable** en performance. Les mesures varient
  beaucoup d'une passe à l'autre : l'indice de puissance que Lighthouse mesure sur la machine
  (`benchmarkIndex`) est allé de 496 à 2 120 pendant ces passes (d'autres travaux tournaient sur
  le poste), ce qui fait varier le temps de blocage (TBT) de 50 à 730 ms pour un même code.
  Le point qui reste stable est le **LCP de l'accueil (3,6 à 4,2 s)** : l'élément LCP est la
  1re image de la grille, qui arrive dans la zone `<Suspense>` diffusée après la coque ; Lighthouse
  attribue l'essentiel du temps à un « délai d'affichage » (plus de 3 s), pas au téléchargement de
  l'image (9 ms observés).

### Ce qui a été changé d'après la mesure

1. **Image LCP chargée en différé** (audit `lcp-lazy-loaded` en échec à la première mesure) : les
   **6 premières cartes de l'accueil** passent en `loading="eager"` (prop `prioritaires` de
   `GrillePokemons`, 0 par défaut, 6 sur l'accueil : une rangée sur grand écran, trois sur
   téléphone). C'est la décision sur l'avertissement `loading="eager"` noté à l'étape 5–6 :
   l'audit est désormais réussi ; l'effet sur la durée du LCP mobile est faible (le délai est
   ailleurs, voir ci-dessus). Les grilles de la fiche (évolutions) et des favoris restent en
   chargement différé. L'ajustement « opt-in » (6 sur l'accueil seulement) a été fait après les
   passes v4 ; la passe v5 l'inclut.
2. **`sizes`** sur l'image des cartes (`(min-width: 1024px) 160px, (min-width: 640px) 30vw,
   45vw`) : le navigateur choisit une taille d'image proche de l'affichage (audit
   `uses-responsive-images`).
3. **Police plus légère** : Bricolage Grotesque chargée avec l'axe `wdth` seul (sans `opsz`) :
   fichier de **129 Kio à 77 Kio**. Les numéros étroits (signature de la direction) sont gardés.
4. **Contraste en accessibilité** (score 96 à la première mesure, audit `color-contrast`) : les
   boutons « Précédent » / « Suivant » inactifs de la pagination (`<span>` estompé, code du cours)
   portent maintenant `aria-disabled="true"`, ce qui les signale comme inactifs aux technologies
   d'assistance ; l'audit passe (accessibilité 100).

### Pistes non appliquées (au-delà du socle, à décider)

- Réduire le JavaScript côté navigateur sur l'accueil (24 boutons « favori » client, un par
  carte), par exemple en ne les hydratant qu'à l'approche de l'écran : modifie la structure du
  cours (ch. 9).
- Pré-rendre la 1re page de l'accueil sans `searchParams` pour sortir la grille de la zone
  diffusée : modifie la structure du ch. 9 (état dans l'adresse lu sous `<Suspense>`).
- **Mesurer en ligne** (T077, critère SC-004) : sur Vercel, le serveur et le réseau ne sont plus
  ceux du poste ; c'est cette mesure qui compte pour la grille.
- **Fichiers** : `components/CartePokemon.tsx`, `components/GrillePokemons.tsx`, `app/page.tsx`,
  `app/layout.tsx`, `components/Pagination.tsx`.
