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

## Bonus — combat de sacoches

### Règle de combat (FR-039, research R10)

- **Point du cours** : « Pour aller plus loin » — « Un combat simulé entre deux sacoches, à partir
  des statistiques ». Le cours ne fixe pas la règle : elle a été décidée en clarification (spec,
  séance du 2026-11-23) puis au plan (R10).
- **Choix** : `lib/combat.ts` (T091, déjà validé) : duels 1 contre 1 dans l'ordre des sacoches ;
  score = total des 6 stats de base × meilleur multiplicateur de type (table
  `data/table-types.json`) ; le plus haut score gagne, égalité = duel nul ; issue = plus de duels
  gagnés. Aucune part d'aléatoire : seule la sacoche adverse est tirée au hasard.
- **Fichiers** : `lib/combat.ts`, `lib/combat.test.ts`.

### Sacoche adverse dans l'adresse : `lireAdversaire`

- **Point du cours** : ch. 9 — « tout ce qui vient de l'adresse est saisi par l'utilisateur, donc
  non fiable » ; même forme que `lireFiltres` / `bornerPage` (fonctions pures testées, Q-3).
- **Choix** : `lireAdversaire(valeur)` rend 1 à 6 numéros entiers uniques entre 1 et 1 025, ou
  `null`. Chaque morceau doit être écrit en chiffres (`/^\d+$/`) avant `Number`, qui accepterait
  sinon `""`, `" 7"`, `1e2` ou `0x10`. Une liste avec un seul défaut est rejetée en entier (pas de
  combat contre une sacoche « à moitié devinée »). Paramètre répété → le premier, comme ailleurs.
- **Alternatives écartées** : filtrer les numéros invalides et garder les autres (l'adresse ne
  décrirait plus le combat affiché).
- **Fichiers** : `lib/parametres.ts`, `lib/parametres.test.ts`.

### Page `/combat` : page client sur le modèle de la page Favoris

- **Point du cours** : ch. 9, « La page Favoris : un chargement côté navigateur » (la sacoche
  n'existe que dans le navigateur) ; ch. 6 (`metadata` réservé au serveur → `layout.tsx` du
  dossier) ; ch. 10, « useSearchParams demande toujours un Suspense ».
- **Choix** :
  - `app/combat/layout.tsx` exporte `metadata = { title: "Combat" }` → onglet « Combat · Pokédex ».
  - `app/combat/page.tsx` (`"use client"`) : le `h1` et l'explication de la règle sont hors du
    `<Suspense>` ; le composant `Combat`, qui lit `useSearchParams`, est dedans.
  - Adresse : `?adversaire=` validé par `lireAdversaire`, puis ramené à la taille de la sacoche
    (`slice`). Absent, invalide ou **plus court** que la sacoche → nouveau tirage écrit par
    `router.replace` (pas d'entrée d'historique). Plus long → adresse réécrite à la bonne taille,
    pour que « même adresse = même combat ».
  - Tirage (`tirerAdversaire`) seulement dans un effet ou un clic, jamais pendant le rendu : le
    HTML du serveur et celui du navigateur resteraient sinon différents (ch. 6, hydratation).
  - Chargement des deux équipes par `chargerPokemon` (`Promise.all`, annulation dans le
    nettoyage de l'effet, états chargement / erreur), comme la page Favoris. Le résultat garde la
    clé (`équipe|adversaire`) qui l'a produit : une clé différente affiche « Préparation du
    combat… » sans remettre d'état à zéro dans l'effet.
  - Sacoche pas encore relue : `useSyncExternalStore` (modèle `useEstMonte` du ch. 10) branché sur
    `useSacoche.persist.hasHydrated` / `onFinishHydration`. Sans lui, la sacoche paraît vide au
    premier affichage (`skipHydration`) et la page montrerait « sacoche vide » un instant. Si le
    stockage est indisponible, la sacoche est traitée comme vide (contracts/stockage-local.md).
  - Sacoche vide → message et lien vers le Pokédex.
  - « Nouvel adversaire » : un `<button>` et non un `Link` (la destination est tirée au moment du
    clic), qui fait `router.push` : « Précédent » ramène au combat d'avant.
- **Fichiers** : `app/combat/layout.tsx`, `app/combat/page.tsx`.

### Affichage du résultat : `ResultatCombat`

- **Point du cours** : ch. 5 (direction « Album » : vignettes `rounded-2xl`, champ image en
  dégradé de la teinte du type par variable CSS locale, chiffres étroits très gras, mouvement
  `animate-apparition` coupé par `motion-reduce:`) ; ch. 11 (un seul `h1`, titres dans l'ordre :
  `h2` issue, `h2` « Les duels », `h3` par duel ; l'information n'est jamais portée par la seule
  couleur).
- **Choix** : composant sans hook (pas de `"use client"` propre ; il est rendu par la page
  client). Bandeau d'issue (« Victoire ! » / « Défaite » / « Match nul », décompte
  gagnés/perdus/nuls, marque « 2–1 » décorative en `aria-hidden`, bouton fourni par la page via
  `children`). Chaque duel : deux vignettes « Vous » / « Adversaire » avec total des stats,
  multiplicateur (`×0,25`, `×2`…, format `fr-FR`) et score ; le vainqueur a un cadre rouge **et**
  une pastille « Vainqueur » ; la ligne du duel dit « X l'emporte » ou « Égalité ».
- **Noms** : `nom` de l'API, capitalisé en CSS (comme la grille) ; à remplacer par le nom
  français quand le bonus FR-033 sera fusionné.
- **Fichiers** : `components/ResultatCombat.tsx`.

### Intégration restante (à la fusion, T095)

- Lien « Combat » dans `components/EnTete.tsx`, avec `LienNav` (page courante surlignée), sous
  `<Suspense>` comme les autres liens, après « Sacoche ».


## Bonus — comparateur (T087, T088, FR-035, research R12)

### Les deux Pokémon vivent dans l'adresse (`/comparer?a=…&b=…`)

- **Point du cours** : ch. 11, « Pour aller plus loin » — « Un comparateur : deux Pokémon côte à
  côte, statistiques en regard » ; ch. 9, « Où ranger le texte de la recherche ? » (l'adresse).
- **Choix** : `a` et `b` dans l'adresse (clarification de la spec, R12). La page n'est pas async :
  comme l'accueil (ch. 8-9), elle passe la promesse `searchParams` à `Comparaison`, sous
  `<Suspense>` ; le titre et le champ s'affichent tout de suite. Les deux Pokémon sont chargés
  ensemble (`Promise.all`, ch. 7) avec `recupererPokemon`, déjà en cache.
- **Alternatives écartées** : l'exemple du ch. 10 (« useReducer : un comparateur de deux
  Pokémon », état `gauche`/`droite` dans le composant) — l'état serait perdu au rechargement et
  ne se partagerait pas, contraire à FR-035.
- **Fichiers** : `app/comparer/page.tsx`, `app/comparer/layout.tsx` (`metadata` « Comparer » →
  onglet « Comparer · Pokédex », même forme que favoris et sacoche).

### Validation de `a` et `b` (`lib/comparaison.ts`, testé)

- **Point du cours** : ch. 9 — « Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc
  non fiable. »
- **Choix** : `lireChoix` → `vide` (rien), `invalide` (pas la forme d'un nom de l'API :
  `^[a-z0-9-]{1,40}$` après `trim` et `toLowerCase`) ou `nom`. Une saisie invalide (`../type/fire`,
  accents, espaces) est signalée « Aucun Pokémon nommé … » **sans appeler l'API** ; un nom bien
  formé mais inconnu passe par l'API, qui répond 404 → `null` (ch. 7) → même message, dans sa
  colonne, pas de `notFound()` global. Paramètre répété → le premier, comme `lib/parametres.ts`.
  `meilleuresValeurs` associe les stats **par nom** (pas par position) et rend `a`, `b` ou
  `egalite`. 10 tests (`lib/comparaison.test.ts`).
- **Alternatives écartées** : appeler l'API avec n'importe quelle saisie (une requête et une
  entrée de cache par faute de frappe) ; `notFound()` (efface la colonne valide).
- **Fichiers** : `lib/comparaison.ts`, `lib/comparaison.test.ts`.

### Tableau côte à côte, meilleure valeur pas seulement par la couleur

- **Point du cours** : ch. 11, accessibilité ; ch. 5, couleur porteuse d'information et teinte par
  variable CSS locale (`--teinte`) ; ch. 1, HTML sémantique.
- **Choix** : un vrai `<table>` (`caption` masquée, `th scope="col"` pour chaque Pokémon,
  `th scope="row"` pour chaque stat) : un lecteur d'écran annonce « Attaque, Raichu, 90 ». La
  meilleure valeur a un fond teinté **et** un cadre, une graisse plus forte, le signe `▲` et le
  texte masqué « , meilleure valeur » ; l'égalité a `=` et « , égalité ». Une légende visible
  explique `▲` et `=`. Barres à la même échelle que `BarresStats` (255). Colonne sans Pokémon :
  message dans un cadre pointillé (« Choisissez un second Pokémon… », « Aucun premier Pokémon »
  avec un lien vers le Pokédex, « Aucun Pokémon nommé « … » ») et `—` / « non disponible »
  dans les cellules. Composant serveur (aucune interactivité).
- **Alternatives écartées** : réutiliser `BarresStats` deux fois (pas d'alignement ligne à ligne,
  pas de place pour le repère) ; une couleur seule pour le gagnant (ch. 11).
- **Écart mineur** : les 6 libellés (PV, Attaque…) sont recopiés de `BarresStats`, où ils ne sont
  pas exportés (fichier hors du périmètre de ce bonus). À factoriser si on l'autorise.
- **Fichiers** : `components/TableauComparaison.tsx`.

### Le champ écrit `b` ; le lien « Comparer » de la fiche écrit `a`

- **Point du cours** : ch. 9, « La barre de recherche écrit dans l'adresse » (temporisation de
  300 ms, `router.replace`, composant sous `<Suspense>` car il lit `useSearchParams`) ; ch. 10,
  « useId : relier un libellé à son champ » ; ch. 9, « Préférez un `Link` … c'est un vrai lien ».
- **Choix** : `ChoixComparaison` (client) reprend le code de `BarreRecherche` mais écrit `b` et
  conserve `a`. `replace` : pas une entrée d'historique par lettre ; la comparaison finale reste
  donc l'entrée d'historique de la page, et « Précédent » depuis la fiche de Raichu la restitue.
  Libellé visible « Second Pokémon » relié par `useId`. Sur la fiche, un seul `Link` « Comparer »
  (contour, comme prévu par la direction « Album ») vers `/comparer?a={nom}`, à côté du bouton
  sacoche.
- **Alternatives écartées** : un bouton + `router.push` (moins accessible, pas préchargé) ;
  `router.push` à chaque frappe (historique pollué).
- **Limite connue** : pendant la saisie (« rai »), la colonne affiche « Aucun Pokémon nommé
  « rai » », désormais suivi de suggestions (Q-C1, ci-dessous) ; les noms sont les noms anglais de l'API tant que les noms français (R5) ne
  sont pas branchés.
- **Fichiers** : `components/ChoixComparaison.tsx`, `app/pokemon/[nom]/page.tsx`.

### Vérifié (serveur de production, Chrome sans interface, 2026-11-23)

- Fiche Pikachu → lien « Comparer » (`/comparer?a=pikachu`) → colonne Raichu vide avec invitation
  → saisie « raichu » → `/comparer?a=pikachu&b=raichu` (adresse inchangée 150 ms après la frappe,
  écrite après la temporisation) → 6 lignes, les 6 meilleures valeurs côté Raichu (60, 90, 55,
  90, 80, 110) → clic sur Raichu → « Précédent » → même adresse, même tableau.
- Même adresse ouverte directement (lien partagé) : même tableau, à 375 px (clair et sombre) et
  1 280 px ; pas de défilement horizontal ; console sans erreur ni avertissement.
- `b=inconnu` → « Aucun Pokémon nommé « inconnu » » dans la colonne de droite, Pikachu affiché ;
  `/comparer` seul → deux messages ; `a=PIKACHU&b=../type/fire&b=mew` → Pikachu + message ;
  `a=pikachu&b=Pikachu` → `=` sur chaque ligne, aucun cadre.

### Suggestions quand un nom est introuvable (décision Q-C1 : option C)

- **Décision de l'utilisateur** : Q-C1, option C — côté serveur, proposer en liens les noms qui
  contiennent la saisie.
- **Point du cours** : ch. 9, « Chercher parmi 1 025 Pokémon » (liste complète en cache, filtrée
  par `includes`) et « Le filtre par type : de simples liens » ; ch. 6, composants serveur par
  défaut.
- **Choix** : `suggerer(saisi, noms, 8)` (fonction pure) garde les noms de
  `recupererTousLesNoms()` qui contiennent la saisie, dans l'ordre des numéros, au plus 8 ; saisie
  vide → aucune. La liste n'est lue que si une colonne est introuvable. Chaque suggestion est un
  `Link` construit par `lienComparaison`, qui remplace son côté et conserve l'autre
  (`?a=pika&b=raichu` → « pikachu » mène à `?a=pikachu&b=raichu`). Aucun résultat → le message
  seul. Tableau toujours serveur : aucun JavaScript client en plus pour les suggestions.
- **Correction liée dans `ChoixComparaison`** : le champ gardait son texte quand `b` changeait
  sans lui (clic sur une suggestion, « Précédent ») et son effet réécrivait aussitôt l'ancien texte
  dans l'adresse (vu : clic sur « raichu » → retour à `b=rai`). Le champ reprend maintenant la
  valeur de l'adresse quand elle change de l'extérieur (motif React « ajuster l'état pendant
  l'affichage », états `vu` et `ecrit`), sans écraser les lettres tapées pendant la temporisation.
  `BarreRecherche` a la même faiblesse en théorie (aucun lien de l'accueil ne change `q`
  aujourd'hui) ; non modifiée, hors périmètre.
- **Alternatives écartées** : `<datalist>` des 1 025 noms (environ 12 Ko de plus dans la page,
  option B) ; suggestions côté client (composant client en plus).
- **Vérifié** (production, Chrome sans interface, 375 px sombre) : saisie « rai » → 8 suggestions
  (raichu, remoraid, raikou, masquerain, darkrai, braixen, koraidon, miraidon) → clic sur
  raichu → `?a=pikachu&b=raichu`, tableau complet (6 meilleures valeurs), champ « raichu » et
  adresse stable une seconde plus tard → « Précédent » → `?a=pikachu&b=rai`, champ « rai ».
  `?a=pika&b=raichu` → suggestion pikachu vers `?a=pikachu&b=raichu` ; `b=zzz` → message seul.
  Console sans erreur.
- **Fichiers** : `lib/comparaison.ts` (`suggerer`, `lienComparaison`, `valeurChoix`),
  `lib/comparaison.test.ts` (+9 tests), `app/comparer/page.tsx`,
  `components/TableauComparaison.tsx`, `components/ChoixComparaison.tsx`.

## Bonus — quiz silhouettes (T094, FR-038, research R11)

### Le jeu : silhouette, saisie libre, révélation

- **Point du cours** : « Pour aller plus loin » — « Un quiz « Qui est ce Pokémon ? » à partir de
  la silhouette (`brightness-0` en Tailwind) ». Forme du jeu décidée en clarification (Q3 de la
  spec : saisie libre du nom français, accents et majuscules ignorés) et au plan (R11).
- **Choix** : `/quiz` = page serveur (titre `<h1>` « Qui est ce Pokémon ? » et consigne) qui rend
  un seul îlot client, `components/Quiz.tsx`. Le tirage appelle notre Route Handler
  `fetch("/api/aleatoire")` (ch. 11, contracts/api-aleatoire.md), au montage puis à chaque
  « Suivant ». La silhouette est l'illustration elle-même avec `brightness-0`, avec
  `alt="Silhouette mystère"` (le nom n'est ni dans l'`alt` ni à l'écran ; le numéro est masqué :
  « #??? »). Champ libre avec libellé visible « Nom du Pokémon (en français) », bouton
  « Valider » (`<form>` : la touche Entrée valide aussi).
- **Révélation** : deux calques de la même image superposés (silhouette, puis couleur) ; seule
  leur **opacité** change, en 300 ms, `motion-reduce:transition-none` (ch. 5 : < 0,5 s,
  `transform`/`opacity` seulement ; `filter` n'est jamais animé). La même adresse d'image sert aux
  deux calques : un seul téléchargement. Une fois révélé, l'`alt` de la silhouette devient vide et
  celui de l'image en couleur devient le nom français. Une `key` par Pokémon remonte les calques
  au tirage suivant : la nouvelle image part masquée sans rejouer la transition.
- **Verdict annoncé** : « Juste ! C'est bien Salamèche. » / « Faux, c'était Salamèche. » dans une
  zone `aria-live="polite"` reliée au champ (`aria-describedby`) ; le verdict est porté par le
  texte, pas par une couleur (ch. 11).
- **Clavier (ch. 11)** : après la révélation, le focus va sur « Suivant » ; à la question
  suivante, il revient dans le champ ; après une panne, sur « Réessayer ». Sans cela, le bouton
  cliqué disparaît et le focus tombe sur `<body>`. Au premier affichage, le focus n'est pas
  déplacé (pas de clavier virtuel qui s'ouvre tout seul sur mobile).
- **États** : chargement (cadre pulsé + « Tirage d'un Pokémon… », `motion-reduce:animate-none`) ;
  panne de `/api/aleatoire` (tout statut non 2xx) → « Impossible de tirer un Pokémon au sort. » +
  « Réessayer » (`role="alert"`). Premier tirage dans un `useEffect` avec annulation (ch. 4),
  les suivants dans le gestionnaire de clic.
- **`metadata`** : `app/quiz/layout.tsx` (« Quiz » → onglet « Quiz · Pokédex »), comme Combat.
- **Alternatives écartées** : choix parmi 4 propositions (écarté en clarification Q3) ; filtre
  CSS animé de `brightness(0)` à `brightness(1)` (interdit par le ch. 5) ; masquer l'image par
  `mask-image` (même résultat, moins lisible que la classe du cours).
- **Fichiers** : `app/quiz/page.tsx`, `app/quiz/layout.tsx`, `components/Quiz.tsx`.

### Vérification de la réponse : `verifierReponse` (fonction pure testée)

- **Point du cours / spec** : FR-038 (« salameche » = « Salamèche », réponse vide refusée) ;
  Q-3 / R13 (Vitest sur les fonctions pures).
- **Choix** : `verifierReponse(saisie, nomAttendu)` rend `"vide"`, `"juste"` ou `"faux"`, en
  comparant `normaliser(saisie) === normaliser(nomAttendu)` (`lib/texte.ts`). Le nom attendu est
  `nomFrancais(pokemon.id, pokemon.nom)` (`lib/noms-fr.ts`, module partagé, non modifié). Une
  saisie vide ou faite d'espaces est refusée par un message (« Écrivez un nom avant de
  valider. ») et ne révèle pas le Pokémon. Le nom anglais n'est pas accepté (Q3 : nom français).
- **Tests** (`lib/quiz.test.ts`, 5) : « SALAMECHE » juste pour Salamèche ; accents dans les deux
  sens (« evoli » / « Évoli ») ; espaces en début et en fin ; vide et espaces seuls refusés ;
  « Carapuce », « salamech » et « charmander » faux.
- **Fichiers** : `lib/quiz.ts`, `lib/quiz.test.ts`.

### Vérifié (serveur de production, Chrome sans interface, 2026-11-23)

Scénario quickstart (US8 › Quiz) rejoué deux fois, 375 px sombre et 1 280 px clair, avec un
script CDP. Pour tester Salamèche, la réponse de `/api/aleatoire` est remplacée dans le navigateur
par Salamèche (données réelles de la PokéAPI) ; les deux dernières étapes utilisent le vrai tirage.

- Silhouette noire (`filter: brightness(0)`), `alt` « Silhouette mystère », numéro « #??? » ;
  onglet « Quiz · Pokédex », un seul `<h1>`.
- « Valider » sur un champ vide → « Écrivez un nom avant de valider. », rien n'est révélé.
- « ␣␣SALAMECHE␣ » → « Juste ! C'est bien Salamèche. », image en couleur (`alt` « Salamèche »),
  « #004 », focus sur « Suivant ».
- « Suivant » → nouvelle silhouette, champ vidé, focus dans le champ ; « Carapuce » → « Faux,
  c'était Salamèche. », révélé aussi.
- Réponse 500 simulée → message + « Réessayer » (focus sur ce bouton) → vrai tirage : silhouette,
  puis « zzz » → « Faux, c'était Têtampoule. » (375 px) et « Faux, c'était Superdofin. »
  (1 280 px).
- Aucun défilement horizontal (`scrollWidth = clientWidth`) ; console sans erreur, hormis la
  ligne « 500 » de la panne volontairement simulée.

### Intégration restante (à la fusion, T095)

- Lien « Quiz » dans `components/EnTete.tsx` (via `LienNav`), hors du périmètre de cette branche.
- En thème sombre, la silhouette noire est posée sur un fond gris clair dégradé
  (`dark:from-doux-sombre/70`) pour rester visible ; ce fond est un choix d'interface non imposé,
  soumis à validation.
