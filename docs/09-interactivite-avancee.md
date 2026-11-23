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
