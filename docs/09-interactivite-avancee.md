# Ch. 9 — Interactivité avancée

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## L'état de recherche vit dans l'adresse

- **Point du cours** : ch. 9, « Où ranger le texte de la recherche ? » — l'adresse
  (`/?q=pika&type=electric&page=2`) plutôt que `useState` : le lien se partage, « Précédent »
  fonctionne, et le serveur filtre.
- **Choix** : `app/page.tsx` n'est pas async ; il transmet la promesse `searchParams` à
  `Resultats`, placé sous `<Suspense>` (squelette en attendant). Le titre et la barre de recherche
  s'affichent tout de suite.
- **Alternatives écartées** : état React ou store (non partageable, perdu au rechargement).
- **Fichiers** : `app/page.tsx`.

## Chercher parmi 1 025 noms

- **Point du cours** : ch. 9, « Chercher parmi 1 025 Pokémon » — la PokéAPI n'a pas de recherche
  par nom : on récupère une fois la liste des noms (`recupererTousLesNoms`, en cache), on la filtre,
  puis on ne charge le détail que des 24 Pokémon affichés. `recupererNomsParType` croise la liste
  complète avec `/type/{type}`.
- **Choix** : code du cours. Les résultats gardent **l'ordre des numéros** (l'ordre de la liste
  complète), y compris avec une recherche ou un type (décision « Analyse » de la spec) : aucun tri
  par nom.
- **Vérifié** : `?q=pi&type=electric` → « 3 Pokémon » : Pikachu (#025), Pichu (#172), Pincurchin
  (#871), dans cet ordre ; pastille « Électrik » marquée active.
- **Fichiers** : `lib/pokeapi.ts`.

## Validation de l'adresse extraite dans `lib/parametres.ts` (forme différente du cours)

- **Point du cours** : ch. 9 — « Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc
  non fiable. Le code vérifie que `type` existe dans `TYPES` et que `page` est un nombre dans les
  bornes. » Code du cours : `type in TYPES`, `Math.ceil`, `Math.min(Math.max(1, Number(page) || 1),
  nombrePages)`.
- **Choix** : même logique, sortie de `Resultats` en deux fonctions pures pour être testée
  (décision Q-3) :
  - `lireFiltres({ q, type })` → `{ q, texte, type }` : `texte = q.trim().toLowerCase()`, type gardé
    seulement si `Object.hasOwn(TYPES, type)` ;
  - `bornerPage(page, nombreResultats)` → `{ pageCourante, nombrePages }`.
- **Écarts au code du cours, et pourquoi** :
  - deux fonctions au lieu d'une seule `lireRecherche(…, nombreResultats)` prévue par T046 : le
    nombre de résultats dépend du texte et du type déjà validés ; une fonction unique devrait les
    connaître avant de les avoir calculés ;
  - `Object.hasOwn` au lieu de `in` : `"constructor" in TYPES` est vrai (propriété héritée), donc
    `?type=constructor` passait la validation du cours (décision du manager, T045) ;
  - un paramètre répété (`?q=Pika&q=mew`) arrive en **tableau** : le code du cours aurait appelé
    `.trim()` sur un tableau et planté ; on garde la première valeur ;
  - `page=2.5` est arrondi à 2 (`Math.floor`), sinon « Page 2.5 » se serait affiché.
- **Tests** (`lib/parametres.test.ts`, 13 tests) : `licorne`, `constructor`, `toString`,
  `__proto__`, `hasOwnProperty` ignorés ; `q` nettoyé ; paramètres répétés ; `page=abc` → 1,
  `page=9999` → 43, `page=-3` et `page=0` → 1, `page=2.5` → 2, 0 résultat → 1 page, 42 résultats →
  2 pages (exemple du cours).
- **Vérifié dans le navigateur** : `?type=licorne` et `?type=constructor` → « 1 025 Pokémon »,
  pastille « Tous » active, aucune erreur ; `?q=Pika&q=mew` → Pikachu.
- **Fichiers** : `lib/parametres.ts`, `lib/parametres.test.ts`, `app/page.tsx`.

## `BarreRecherche` (version du ch. 9) : temporisation de 300 ms

- **Point du cours** : ch. 9, « La barre de recherche écrit dans l'adresse » — composant client,
  `useSearchParams`, minuteur de 300 ms dans un effet avec nettoyage, `router.replace`,
  suppression de `page`, placé sous `<Suspense>`.
- **Choix** : code du cours ; mise en forme de la direction (pilule, loupe Phosphor). Le repli
  du `<Suspense>` est un champ désactivé de même forme (`ChampInactif`). Les classes du champ sont
  dans `components/classes.ts` : un module `"use client"` ne peut pas fournir une simple chaîne à
  un composant serveur.
- **Pourquoi** : sans temporisation, chaque lettre déclencherait une navigation et une requête ;
  `replace` évite une entrée d'historique par lettre ; une nouvelle recherche repart de la page 1.
- **Vérifié** (frappe simulée « P », « PI », « PIKA » à 100 ms d'intervalle depuis `/?page=3`) :
  150 ms après la dernière lettre, l'adresse est encore `?page=3` ; ensuite elle devient
  `/?q=PIKA` (`page` supprimé) et la grille montre Pikachu.
- **Version finale** : remplacée au ch. 10 par `useRappelTemporise` + `useTransition` (étape 17).
- **Fichiers** : `components/BarreRecherche.tsx`, `components/classes.ts`, `components/Icone.tsx`.

## `FiltreTypes` : de simples liens, composant serveur

- **Point du cours** : ch. 9, « Le filtre par type : de simples liens » — « Tous » + 18 types,
  conservent `q`, `aria-current` sur le type actif, `aria-label="Filtrer par type"`, aucun
  JavaScript côté navigateur.
- **Choix** : code du cours, avec trois ajustements :
  - liste `<ul>` / `<li>` (ch. 1 : une liste) ;
  - les pastilles inactives gardent leur couleur pleine au lieu de `opacity-70` : avec 70 %
    d'opacité, le texte blanc passerait sous 4,5:1 ; le type actif est marqué par un anneau
    (`ring-2 ring-offset-2`) et `aria-current`, pas par la couleur seule ;
  - mise en page de la maquette : rangée qui défile horizontalement sur téléphone (pas de
    défilement de la page : `scrollWidth = 375`), puis retour à la ligne dès `md:` pour voir les
    19 pastilles (la maquette n'en montrait que 9).
- **Fichiers** : `components/FiltreTypes.tsx`.

## Recherche sans résultat

- **Choix** : « Aucun Pokémon ne correspond à cette recherche. » (phrase de la maquette du
  ch. 0 du cours), avec le compteur « 0 Pokémon ». Le compteur est formaté à la française
  (« 1 025 Pokémon »).
- **Vérifié** : `?q=zzzz`.

## Étape 14 — `Pagination` (composant serveur)

- **Point du cours** : ch. 9, leçon « Pagination » — liens « Précédent » / « Suivant » qui
  conservent `q` et `type`, `page` écrit seulement s'il vaut plus de 1, « Page X sur Y »,
  `Math.ceil`, renvoie `null` s'il n'y a qu'une page, affiché à la fin de `Resultats`.
- **Choix** : code du cours, plus l'ajout FR-037 : numéros de page avec `aria-current="page"`
  sur la page courante. Avec 43 pages, on affiche la première, la dernière et les voisines de la
  page courante, séparées par « … » (`aria-hidden`). Sur téléphone, le texte du cours
  « Page X sur Y » remplace les numéros (ils ne tiennent pas en 375 px avec les deux boutons) ;
  les numéros apparaissent dès `sm:`. Bouton inactif : `<span>` estompé (`opacity-40`,
  `cursor-not-allowed`), comme dans le cours ; style de la maquette (« Suivant » plein rouge).
- **Vérifié** (développement et production) :
  - `/` : #001 → #024, « Précédent » inactif, numéros 1 (courant), 2, 43 ;
  - `?page=2` : #025 → #048 (scénario 5 de US3), à 375 px en sombre « Page 2 sur 43 » ;
  - `?page=9999` → page 43 (#1009 → #1025, 17 cartes), « Suivant » inactif ;
  - `?page=abc` → page 1 ;
  - `?q=a&type=water&page=2` → « Page 2 sur 4 », liens qui gardent `q` et `type` ;
  - clic sur « Suivant » depuis `/` → `?page=2`, #025 ; clic sur « Feu » → `?type=fire` ;
    « Précédent » du navigateur → retour à `?page=2`.
- **Fichiers** : `components/Pagination.tsx`, `app/page.tsx`.

## Squelette entre deux pages : `<Suspense>` à clé (décision Q-14, écart au cours)

- **Point du cours** : liste de l'étape 14 — « Le squelette de la grille apparaît pendant le
  chargement d'une nouvelle page ».
- **Constat avant correction** : en cliquant sur « Suivant » vers une page jamais chargée, aucun
  squelette n'apparaissait, ni en développement ni en production (`[aria-busy=true]` sondé
  toutes les 50 ms) : l'ancienne grille restait affichée jusqu'à l'arrivée de la nouvelle. Une
  navigation de Next.js est une transition React, et React n'y remontre pas le `fallback` d'un
  `<Suspense>` déjà affiché (explication tirée de la documentation de React, non vérifiée dans
  son code).
- **Décision du manager (Q-14, option A)** : la plus petite correction possible. Un composant
  serveur `ZoneResultats`, lui-même sous le `<Suspense>` du cours, lit les paramètres validés et
  entoure `Resultats` d'un second `<Suspense key={q|type|page}>`. Une nouvelle clé = une nouvelle
  zone, qui montre son squelette. Le reste de la structure du cours est inchangé.
- **Vérifié en production** (`npm start`, page 20 → 21 jamais chargée, 1 280 px) : le squelette
  apparaît 1,55 s après le clic (en même temps que la nouvelle adresse), la nouvelle grille à
  2,35 s. La recherche continue de fonctionner (« mew » → Mewtwo #150 puis Mew #151, champ
  conservé).
- **Limite constatée en développement** (`npm run dev`, page 40 → 41) : l'adresse et la nouvelle
  grille arrivent ensemble 4,2 s après le clic ; le squelette n'est présent qu'un instant (vu dans
  une seule mutation du DOM). Le serveur de développement semble attendre la réponse complète
  avant d'afficher la nouvelle page ; je ne l'ai pas cherché plus loin. Le critère est rempli dans
  la version de production.
- **Fichiers** : `app/page.tsx`.

## Étape 15 — les favoris avec Zustand

### Pourquoi un store (et pas Context, pas l'adresse)

- **Point du cours** : ch. 9, « Les favoris doivent être connus de composants éloignés » (étoiles,
  compteur d'en-tête, page Favoris) ; encadré « Quelle différence avec le Context de React ? »
  et « Faut-il tout mettre dans un store ? ».
- **Choix** : Zustand (`npm install zustand`, dépendance du cours ; version installée 5.1.0).
  Context : tous les lecteurs se réaffichent à chaque changement et il faut un Provider ;
  Zustand ajoute les sélecteurs et la persistance, sans Provider. Les favoris ne vont pas dans
  l'adresse : ils sont propres au visiteur et durables, pas un état de navigation.
- **Fichiers** : `stores/favoris.ts`, `package.json`.

### Le store `useFavoris`

- **Point du cours** : code du cours — `noms: string[]`, `basculer(nom)` qui renvoie un **nouveau
  tableau** (`filter` ou décomposition, jamais `push`), `persist` sous la clé `pokedex-favoris`
  (contrat `contracts/stockage-local.md`), `skipHydration: true`.
- **Vérifié** : après deux clics, `localStorage["pokedex-favoris"]` vaut
  `{"state":{"noms":["bulbasaur","charmander"]},"version":0}`.

### Sélecteurs à une valeur

- **Point du cours** : « Un sélecteur ne doit pas fabriquer un nouvel objet ou un nouveau tableau
  à chaque appel […] Sélectionnez une valeur à la fois ».
- **Choix** : `BoutonFavori` lit `etat.noms.includes(nom)` et `etat.basculer` (deux appels du
  hook) ; `CompteurFavoris` lit `etat.noms.length`. Cliquer sur une étoile ne réaffiche que ce
  bouton et le compteur.

### Le piège de l'hydratation

- **Point du cours** : « Le serveur n'a pas de localStorage » ; `skipHydration` + `rehydrate()`
  dans un effet (`HydratationStores`, placé en tête de `<body>`).
- **Vérifié** :
  - développement : 6 rechargements de `/` avec des favoris enregistrés, en clair et en sombre →
    étoiles pleines et compteur justes, **aucune erreur d'hydratation** ni autre erreur dans la
    console (seul l'avertissement LCP connu) ;
  - production (`npm start`) : clic sur deux étoiles puis 3 rechargements → état conservé, console
    vide ; `/favoris` liste les deux Pokémon ;
  - une fois en développement, juste après une recompilation, la page rechargée montrait encore
    0 favori 5 s après le chargement. Non reproduit ensuite (10 essais). Explication probable, non
    prouvée : le JavaScript n'était pas encore chargé, la page affichait le HTML du serveur (0).
- **Non vérifié** : la fermeture complète du navigateur (le profil de test est réutilisé, pas
  fermé et rouvert) ; `localStorage` survit par construction à la fermeture.

### `BoutonFavori` hors du lien, icônes SVG

- **Point du cours** : « Un bouton placé à l'intérieur d'un lien pose un problème d'accessibilité
  et de clic. Dans la carte, sortez le bouton du Link : relative sur la carte, absolute … z-10
  sur le bouton. » ; `aria-pressed` et `aria-label` « Ajouter / Retirer {nom} des favoris ».
- **Choix** : bouton après le `Link`, `absolute right-4 top-4 z-10` (coin haut droit de la
  maquette validée au lieu de `left-2 top-2`) ; étoile vide / pleine en SVG Phosphor au lieu de
  « ☆ / ★ » (décision Q-T012-c) ; « coller » : `active:scale-90`, survol `scale-110`, 150 ms,
  coupés par `motion-reduce:`. Même bouton sur la fiche, à droite du nom.
- **Vérifié** : clic sur l'étoile de Bulbasaur → `aria-pressed="true"`, libellé « Retirer
  bulbasaur des favoris », compteur « 1 », l'adresse reste `/` (pas d'ouverture de la fiche).

### Compteur d'en-tête

- **Choix** : `CompteurFavoris` (client) dans le lien « Favoris » de l'en-tête (pastille de la
  maquette) ; pour les lecteurs d'écran, le lien se lit « Favoris (2 favoris) ».

### Page Favoris : chargement côté navigateur

- **Point du cours** : « Le serveur ne connaît pas vos favoris » ; `lib/pokeapi-client.ts`
  (`chargerPokemon`, même conversion, 404 → `null`) ; page client avec effet et annulation, états
  chargement / erreur / vide / grille.
- **Choix** : code du cours, plus un `<h1>` « Mes favoris » (un titre par page, ch. 11) et un lien
  vers le Pokédex dans le message vide. La `metadata` (« Favoris ») est passée dans
  `app/favoris/layout.tsx`, serveur, puisque la page est désormais client (décision du manager,
  note de T057).
- **Vérifié** : sans favori → « Aucun favori pour le moment. Cliquez sur une étoile dans le
  Pokédex. » ; avec deux favoris → leurs deux cartes ; onglet « Favoris · Pokédex » ; 375 px en
  sombre regardé.
- **Fichiers** : `components/BoutonFavori.tsx`, `components/CompteurFavoris.tsx`,
  `components/HydratationStores.tsx`, `components/CartePokemon.tsx`, `components/EnTete.tsx`,
  `components/Icone.tsx`, `lib/pokeapi-client.ts`, `app/favoris/page.tsx`,
  `app/favoris/layout.tsx`, `app/layout.tsx`, `app/pokemon/[nom]/page.tsx`.

## Étape 16 — la sacoche

### La règle vit dans le store

- **Point du cours** : ch. 9, « Dernière grande fonctionnalité » — « La sacoche obéit à des règles
  métier, et c'est le store qui les fait respecter, pas les boutons » ; code de
  `stores/sacoche.ts` repris : `TAILLE_SACOCHE = 6`, `ajouter` renvoie **l'état inchangé** si le
  Pokémon est déjà là ou si l'équipe est pleine, `retirer`, `renommer` par `map` + copie, `vider`,
  `persist` sous `pokedex-sacoche` avec `skipHydration`, réhydraté dans `HydratationStores`.
- **Ajout (research R8, note de la tâche T059)** : `renommer` borne le surnom à
  **12 caractères** (`slice(0, LONGUEUR_SURNOM)`) dans l'action elle-même ; le champ a aussi
  `maxLength={12}`, mais c'est le store qui garantit la règle.
- **`Pick`** : `Membre = Pick<Pokemon, "id" | "nom" | "image" | "types"> & { surnom }` — seulement
  ce qu'il faut pour afficher un membre, pas les statistiques.
- **Rien de calculable n'est stocké** : « pleine » (`equipe.length >= 6`), le nombre de membres de
  l'indicateur et les types couverts sont calculés à l'affichage.
- **Vérifié** (développement puis production, même scénario automatisé) :
  - ajouts depuis 6 fiches → indicateur « Sacoche : 6 Pokémon sur 6 » ; 7ᵉ fiche (Mew) : bouton
    « Sacoche pleine (6/6) » inactif (spec US5-1) ;
  - fiche de Pikachu déjà présent : seul « Retirer de la sacoche » est proposé (pas de doublon) ;
  - surnom : une saisie de 16 caractères injectée directement (sans passer par `maxLength`) est
    ramenée à 12 par le store (« Pikachuuuuuu ») ; « Pika » conservé après rechargement ;
  - 4 membres → 2 emplacements libres dessinés, indicateur 4/6 ;
  - « Vider la sacoche » → « Confirmer ? » (rien n'est vidé) → second clic : 0 membre,
    6 emplacements libres, le bouton disparaît ;
  - rechargements : aucune erreur d'hydratation, console vide (production) ;
  - onglet « Sacoche · Pokédex » (la `metadata` est dans `app/sacoche/layout.tsx`, la page étant
    client).
- **Fichiers** : `stores/sacoche.ts`, `components/HydratationStores.tsx`.

### `BoutonSacoche` (fiche)

- **Point du cours** : code du cours (sélecteurs à une valeur ; la fiche serveur passe l'objet
  `pokemon`, des données simples, au composant client). Libellés de la tâche T061 : « Ajouter à
  la sacoche », « Retirer de la sacoche », « Sacoche pleine (6/6) ». Le libellé « Coller dans la
  sacoche » de la maquette n'est pas repris (il était marqué « à valider »).
- **Fichiers** : `components/BoutonSacoche.tsx`, `app/pokemon/[nom]/page.tsx`.

### `IndicateurSacoche` (en-tête)

- **Point du cours** : six pastilles pleines ou vides, sélecteur sur `etat.equipe.length`, lien
  vers `/sacoche`, `aria-label` « Sacoche : N Pokémon sur 6 ».
- **Choix (direction « Album »)** : l'indicateur **est** le lien « Sacoche » de la navigation
  (texte « Sacoche » + pastilles), pour ne pas avoir deux liens vers la même page côte à côte.
  Sur téléphone, « 3/6 » en texte (six pastilles ne tiennent pas dans la ligne de 375 px).
- **Vérifié** : en-tête à 375 px (« Sacoche 6/6 »), 640 px et 1 280 px (pastilles), en clair et
  en sombre, sans débordement.
- **Fichiers** : `components/IndicateurSacoche.tsx`, `components/EnTete.tsx`.

### Page Sacoche et emplacements numérotés (geste signature de la direction)

- **Point du cours** : page client ; membres avec image, surnom modifiable (`input` avec libellé,
  `maxLength={12}`), types et bouton retirer ; emplacements libres **dessinés** et menant à `/` ;
  « {n} / 6 Pokémon · {k} type(s) couvert(s) ».
- **Choix** : structure du cours mise en forme selon la maquette : vignettes numérotées 1 à 6, les
  vides en tirets avec leur grand numéro et « Emplacement libre » ; bouton retirer en croix
  (SVG Phosphor) avec `aria-label` « Retirer {nom} de la sacoche » ; libellé visible « Surnom de
  {nom} » relié au champ (`htmlFor`).
- **Correction faite pendant la vérification** : à 1 280 px, les emplacements libres débordaient
  et se chevauchaient (`aspect-[3/4]` combiné à `h-full`) ; remplacé par `h-full min-h-48`.
- **Fichiers** : `app/sacoche/page.tsx`, `app/sacoche/layout.tsx`, `components/Icone.tsx`.

### `BoutonVider` : confirmation en deux clics

- **Point du cours** : exercice « Vider la sacoche, avec confirmation » — affiché seulement si la
  sacoche n'est pas vide ; 1er clic « Confirmer ? », 2e clic vide ; l'état « à confirmer » reste
  dans un `useState` (il ne concerne que ce bouton), remis à zéro quand le bouton perd le focus.
- **Fichiers** : `components/BoutonVider.tsx`.

## Bonus — glisser-déposer (FR-040, research R9, tâches T089–T090)

### `deplacer(depuis, vers)` : la règle reste dans le store

- **Point du cours** : ch. 9, « c'est le store qui fait respecter les règles » et mises à jour
  immuables (nouveau tableau). L'action copie `equipe`, retire le membre à `depuis` (`splice`) et
  le réinsère à `vers`. Indice hors bornes, non entier ou égal à l'autre → **l'état est renvoyé
  tel quel** (comme un refus de `ajouter`). Le nombre de membres ne change jamais : les règles
  « 6 au plus » et « sans doublon » restent vraies sans code supplémentaire.
- **Persistance** : rien à ajouter, `persist` enregistre le nouvel ordre sous `pokedex-sacoche` ;
  la forme du contrat (`{ state: { equipe }, version: 0 }`) ne change pas — vérifié par un test.
- **Tests** (`stores/sacoche.test.ts`, Vitest) : en tête, en fin, au milieu dans les deux sens,
  nouveau tableau, hors bornes (−1, 4, 1,5, NaN), même indice, surnom conservé, règles 6 / sans
  doublon après déplacements, forme stockée. Vitest tourne sans `localStorage` : le test en
  fournit un en mémoire (`vi.hoisted` + `vi.stubGlobal`) **avant** d'importer le store, car
  `persist` cherche le stockage à la création.

### `ListeSacocheReordonnable` : deux chemins, une seule action

- **Choix imposé (R9)** : API HTML5 native, **aucune bibliothèque** — `draggable` sur la carte,
  `onDragStart` (indice mémorisé, `effectAllowed = "move"`, `setData` requis par Firefox,
  `setDragImage` sur toute la carte même quand on saisit l'illustration), `onDragOver`
  (`preventDefault` pour autoriser le dépôt, ignoré si rien n'est tenu dans la page), `onDrop`,
  `onDragEnd`. Glisser depuis le champ du surnom ne soulève pas la carte (sélection du texte).
- **Retour visuel** : la carte tenue passe en `opacity-40` (transition d'opacité de 150 ms,
  `motion-reduce:transition-none`) ; la carte survolée reçoit un contour en tirets couleur Pokédex
  (contour statique, pas d'animation).
- **Alternative clavier et tactile (FR-040)** : boutons « Monter » / « Descendre » sur chaque
  carte (le glisser HTML5 ne fonctionne pas au doigt). Texte accessible « Monter {surnom ou nom} »
  (`sr-only`), flèche visible décorative (`aria-hidden`). Désactivés aux extrémités. Après un
  clic, **le focus reste sur le membre déplacé** : un `useRef` (ch. 10) garde la carte et le
  bouton à refocaliser, un `useEffect` sur `equipe` le refocalise — ou l'autre bouton si le
  premier vient d'être désactivé (membre arrivé en tête ou en fin).
- **Annonce** (ch. 11, accessibilité) : un paragraphe `aria-live="polite"` (`sr-only`), toujours
  présent dans la page, reçoit « {nom} est maintenant en position n sur N. Nouvel ordre : … ».
- **État local** : membre tenu, carte survolée et texte annoncé ne concernent que la liste →
  `useState` (ch. 9), pas le store.
- **Intégration minimale** dans `app/sacoche/page.tsx` : le contenu des cartes (image, numéro,
  surnom, types, retirer) reste écrit dans la page et est passé par `rendreMembre` ; les
  emplacements libres sont passés en `children` ; `BoutonVider` et le compteur n'ont pas bougé.
- **Écart** : la consigne demandait les icônes du composant `Icone`, qui n'a pas de flèche, et
  `components/Icone.tsx` était hors du périmètre de ce bonus → caractères « ↑ » / « ↓ »
  décoratifs en attendant (question posée au manager).
- **Fichiers** : `stores/sacoche.ts`, `stores/sacoche.test.ts`,
  `components/ListeSacocheReordonnable.tsx`, `app/sacoche/page.tsx`.
