# Research — Application Pokédex (Phase 0)

Chaque décision indique sa source : **[cours]** = imposé par le cours (`cours/cours-pokedex.html`),
**[utilisateur]** = tranché par l'utilisateur, **[plan]** = choix technique découlant des deux
précédents (à contester en revue si besoin). Les points marqués **À vérifier** viennent de la
mémoire ou du cours et doivent être confirmés à l'exécution (version réellement installée).

## R1. Création du projet dans un dossier non vide — [plan]

- **Decision** : générer l'application avec `npx create-next-app@16` dans un dossier temporaire
  **hors** du projet (réponses du ch. 0 : TypeScript oui, ESLint oui, Tailwind oui, `src/` non,
  App Router oui, alias `@/*` par défaut), puis copier son contenu dans `pokedex-frontend` sans
  écraser `.claude/`, `.specify/`, `specs/`, `cours/`.
- **Rationale** : le dossier contient déjà Spec Kit ; `create-next-app` peut refuser un dossier
  non vide. Le `@16` aligne la version sur le cours (constitution II).
- **À vérifier** : que le `next.config.ts` généré contient bien `cacheComponents: true` et
  `partialPrefetching: true` (affirmé par le cours). S'ils manquent, les ajouter et le consigner.
- **Alternatives** : générer dans un sous-dossier (casse la structure à la racine) ; écrire la
  configuration à la main (s'écarte de l'étape 0).

## R2. Dépôt Git — [utilisateur]

- **Decision** : `git init` dans `pokedex-frontend`, dépôt GitHub dédié, Vercel branché dessus ;
  ajouter `pokedex-frontend/` au `.gitignore` du dépôt parent `TP-B3`.
- **Rationale** : étape 18 (GitHub + Vercel, redéploiement à chaque push), historique propre.
- **Alternatives** : rester dans `TP-B3` avec *Root Directory* Vercel (historique mélangé).

## R3. Couche d'accès aux données — [cours]

- **Decision** : reprendre `lib/conversion.ts` (`API`, `versPokemon`) et `lib/pokeapi.ts`
  (`appeler` : 404 → `null`, autre échec → `Error` ; `recupererPokemon`, `recupererPlusieurs`
  avec `Promise.all`, `recupererListe`, `recupererEvolutions` + `aplatir` récursif,
  `TOTAL_POKEMONS = 1025`, `recupererTousLesNoms`, `recupererNomsParType`), chacune en
  `"use cache"` + `cacheLife("days")` ; `lib/pokeapi-client.ts` (`chargerPokemon`) pour le
  navigateur.
- **Rationale** : critère « Code : types, couche d'accès aux données » (2 pts) ; respect de la
  PokéAPI.

## R4. Recherche, filtre, pagination, tri — [cours] + [utilisateur]

- **Decision** : `Resultats` (sous `Suspense`) lit `searchParams` ; `type` validé contre `TYPES`,
  `page` bornée (`Math.ceil`, `Math.min/max`) ; résultats **toujours dans l'ordre des numéros**
  (code du cours, décision utilisateur « comme un Pokédex ») ; `BarreRecherche` version finale du ch. 10
  (`useRappelTemporise` 300 ms + `useTransition` + `router.replace`, suppression de `page`) ;
  `FiltreTypes` et `Pagination` en liens serveur. Pagination classique uniquement (FR-037).
  Bonus tri : paramètre `?tri=numero|nom` validé (défaut `numero`), appliqué à la liste de noms
  avant découpage.
- **Rationale** : grille « Recherche et filtre par type, rangés dans l'adresse » (3 pts).
- **Écart signalé** : le cours propose aussi le tri « par statistique » ; il exigerait le détail
  des 1 025 Pokémon. Exclu (la spec dit « au minimum numéro et nom »).

## R5. Noms français — [utilisateur]

- **Decision** : `scripts/generer-donnees.mjs` (Node, lancé à la main, hors build) appelle
  `/pokemon-species/{id}` pour 1 → 1 025 par lots de 20 avec une pause entre lots, et écrit
  `data/pokemons-fr.json` : `[{ id, nom, nomFr }]`. Fichier commité. `lib/noms-fr.ts` expose
  `nomFrancais(id)` et la liste. `versPokemon` ajoute `nomFr` ; les membres de la sacoche ne le
  stockent pas (calculé par `nomFrancais(id)`). Adresses et clés restent en
  anglais (`/pokemon/charmander`) : comme pour les types, « la donnée reste en anglais, on ne
  la traduit qu'à l'affichage » [cours, ch. 5]. Recherche : nom français uniquement
  (clarification Q1), comparaison via `normaliser()`.
- **Rationale** : zéro appel au runtime, aucun risque de 429, recherche instantanée.
- **Coût connu** : le JSON (~30 Ko brut) est inclus dans le JS client des pages qui appellent
  `chargerPokemon` (Favoris, Combat, Quiz). À mesurer avec Lighthouse ; si besoin, ne servir
  que `{ id → nomFr }`.
- **Alternatives** : cache serveur avec 1 025 appels (lent, 429) ; hybride (deux mécanismes).

## R6. Normalisation du texte — [plan]

- **Decision** : `normaliser(t) = t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()`
  dans `lib/texte.ts` ; utilisée par la recherche FR et le quiz.
- **Rationale** : « salameche » = « Salamèche » (FR-038).
- **À vérifier** : le support de `\p{Diacritic}` par la cible TypeScript générée ; repli :
  `/[̀-ͯ]/g`.

## R7. Thème clair par défaut + bascule sombre — [utilisateur] + [plan]

- **Decision** : dans `globals.css`, déclarer une variante `dark` pilotée par une classe `dark`
  sur `<html>` ; dans `layout.tsx`, un court script en ligne lit `localStorage["pokedex-theme"]`
  et pose la classe **avant** l'affichage (pas de flash) ; `<html suppressHydrationWarning>`
  (la classe diffère entre serveur et navigateur par construction) ; `BoutonTheme` (client)
  bascule la classe et mémorise. Toutes les classes `dark:` du cours restent valables.
- **Rationale** : FR-023 sans dépendance ; le cours ne fixe que « lisible en thème sombre ».
- **À vérifier** : syntaxe exacte de la variante personnalisée dans la version de Tailwind 4
  installée (de mémoire : `@custom-variant dark (&:where(.dark, .dark *));`) et compatibilité du
  script en ligne avec `cacheComponents`.
- **Alternatives** : `next-themes` (dépendance hors cours) ; thème selon le système (refusé).

## R8. Favoris et sacoche — [cours]

- **Decision** : `stores/favoris.ts` et `stores/sacoche.ts` tels que le cours (persist,
  `skipHydration: true`, `rehydrate()` dans `HydratationStores`), sélecteurs à une valeur ;
  `TAILLE_SACOCHE = 6`, `Membre = Pick<Pokemon, "id"|"nom"|"image"|"types"> & { surnom }` ;
  `ajouter` renvoie l'état inchangé si plein ou doublon ; rien de calculable stocké. Bonus :
  action `deplacer(depuis, vers)` (FR-040), `useTypesCouverts` (étape 17).
- **Surnom** : longueur bornée à **12 caractères** (`maxLength`), vide = pas de surnom.
  [plan] — valeur par défaut, à contester en revue.

## R9. Glisser-déposer — [utilisateur]

- **Decision** : API HTML5 native (`draggable`, `onDragStart/Over/Drop`) sur la page Sacoche +
  boutons « Monter » / « Descendre » (clavier et mobile), tous appelant `deplacer` ; ordre
  persistant via le store.
- **Rationale** : aucune dépendance, alternative accessible obligatoire (FR-040).

## R10. Combat entre sacoches — [utilisateur] + [plan]

- **Decision (règle)** : pour un duel A contre B :
  `multiplicateur(A→B)` = meilleur produit, parmi les types de A, des efficacités contre chacun
  des types de B (table `data/table-types.json`, générée depuis `/type/{nom}` →
  `damage_relations`) ; `score(A→B) = somme des 6 stats de base de A × multiplicateur(A→B)`.
  Le plus haut score gagne le duel ; égalité = duel nul. Duels dans l'ordre des sacoches ; la
  sacoche qui gagne le plus de duels l'emporte ; égalité = match nul (FR-039).
- **Sacoche adverse** : tirée au hasard, de la même taille que celle du visiteur, ses numéros
  inscrits dans l'adresse (`/combat?adversaire=25,6,94`) pour la rejouer ou la partager ; bouton
  « Nouvel adversaire ». [plan] — à contester en revue.
- **Rationale** : déterministe, explicable à l'écran, réutilise stats et types déjà chargés.
- **Page client** : la sacoche n'existe que dans le navigateur (modèle de la page Favoris).

## R11. Quiz — [utilisateur]

- **Decision** : page client ; tirage via `/api/aleatoire` (déjà requis par le ch. 11) ;
  silhouette = image avec `brightness-0` [cours, « Pour aller plus loin »] ; saisie libre
  comparée par `normaliser()` au `nomFr` ; révélation + juste/faux ; bouton « Suivant ».
- **Dépendance** : livré après les noms FR (R5).

## R12. Comparateur — [utilisateur]

- **Decision** : `/comparer?a=<nom>&b=<nom>` (composant serveur, lecture sous `Suspense`) ;
  bouton « Comparer » sur la fiche → `/comparer?a=<nom>` ; choix du second via un champ de
  recherche qui écrit `b` dans l'adresse ; nom inconnu → message, pas de plantage.

## R13. Tests et validation — [utilisateur]

- **Decision** : Vitest **ciblé** (Q-3) sur les fonctions pures dont une erreur passerait
  inaperçue : `aplatir`, `lib/parametres.ts` (validation `q`/`type`/`page`/`adversaire`,
  extraite de `Resultats` pour être testable), `lib/texte.ts`, `lib/combat.ts`. Plus lint,
  build, scénarios de [quickstart.md](./quickstart.md) et Lighthouse.
- **Rationale** : la table des types et la formule de combat peuvent être fausses sans aucun
  symptôme visible ; un test les attrape, un scénario manuel non.
- **Alternatives** : aucun test (risque silencieux) ; tests de composants (Testing Library :
  3 dépendances de plus, gain faible pour un projet évalué sur le rendu).
- **Écart de forme** : `aplatir` devient un export nommé, et la validation de `Resultats` est
  extraite dans `lib/parametres.ts` (même logique que le cours, documentée dans `docs/09`).

## R14. Copie du cours — [plan]

- **Decision** : `cours/` dans `.gitignore`.
- **Rationale** : c'est le contenu du formateur ; un dépôt GitHub public le republierait.

## R15. Direction artistique — reportée en phase C

Palette d'accent, typographie (`next/font`), forme des cartes et de l'en-tête, micro-interactions :
proposées par l'agent avec les skills **impeccable** (à installer) et **design-taste-frontend**,
références type Dribbble, puis validées par l'utilisateur. Contraintes fixes : couleurs de type
du cours (contraste vérifié), quatre principes du ch. 5, échelle d'espacement 2/4/6/8,
animations < 0,5 s.
