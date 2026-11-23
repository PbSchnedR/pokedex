# Quickstart — Valider le Pokédex

Guide de validation, story par story. Chaque scénario est une preuve à joindre au rapport de
l'agent (constitution VI). Formats d'adresse : [contracts/routes.md](./contracts/routes.md).

## Prérequis

- Node.js LTS ≥ 20 (`node -v`), npm, Git.
- Dépendances installées : `npm install`.
- Bonus noms FR / combat : `data/pokemons-fr.json` et `data/table-types.json` présents (sinon
  `node scripts/generer-donnees.mjs`, quelques minutes, réseau requis).

## Commandes

```bash
npm run dev      # développement : http://localhost:3000
npm run lint     # doit finir sans erreur
npm test         # Vitest : fonctions pures (évolutions, adresse, texte, combat) — tout vert
npm run build    # doit finir sans erreur et lister les pages (151 fiches pré-générées)
npm start        # production locale — pour Lighthouse et les mesures de vitesse
```

## Porte de qualité (à chaque étape TP)

1. `npm run lint`, `npm test` (dès T006) et `npm run build` verts.
2. Affichage vérifié à **375 px** (outils du navigateur) et en **thème sombre**.
3. Console sans erreur (notamment hydratation).
4. `docs/NN-*.md` du chapitre mis à jour.
5. Commit Git.

## Scénarios

### US1 — Parcourir
- `/` : 24 cartes (image, `#001`, nom, badges colorés), teinte du type principal.
- Les cartes sont dans l'ordre des numéros (#001 à #024).
- 375 px : 2 colonnes, pas de défilement horizontal ; ≥ 1024 px : 6 colonnes.
- Réseau ralenti (outils → *Slow 3G*) : squelette visible avant les cartes.

### US2 — Fiche
- Clic sur une carte → `/pokemon/{nom}` sans rechargement ; onglet « Pikachu · Pokédex ».
- `/pokemon/eevee` : toutes les évolutions, chacune cliquable.
- `/pokemon/pikachuu` → page 404 du layout.
- Fausse adresse d'API (temporaire, ch. 7 étape 10) → `error.tsx` + « Réessayer », puis rétablir.

### US3 — Recherche et filtres
- Pagination : « Suivant » → `?page=2` (Pokémon 25–48) ; « Précédent » inactif en page 1,
  « Suivant » inactif en dernière page.
- Taper `PIKA` : après ~300 ms, `?q=PIKA`, résultats dans l'ordre des numéros, `page` retiré, indicateur
  « Recherche… ».
- `?q=pi&type=electric` copié dans un nouvel onglet → même écran ; « Précédent » revient à
  l'écran d'avant.
- `?type=licorne`, `?page=9999`, `?page=abc` → aucun plantage.
- Recherche sans résultat → message clair.

### US4 — Favoris
- Étoile sur une carte : ★, compteur d'en-tête +1, on reste sur la page.
- Recharger, fermer/rouvrir → favoris conservés, aucune erreur d'hydratation.
- `/favoris` vide → message d'invitation ; avec favoris → grille.

### US5 — Sacoche
- Ajouter 6 Pokémon → indicateur 6/6 ; 7ᵉ refusé avec message ; doublon refusé.
- Surnom « Pika » → affiché et conservé après rechargement ; > 12 caractères impossible.
- 4 membres → 2 emplacements vides dessinés.
- « Vider la sacoche » → « Confirmer ? » → vidée au second clic.

### US6 — Navigation et finitions
- Lien de la page courante surligné dans l'en-tête.
- Touche `/` hors champ → focus dans la recherche ; dans un champ, `/` s'écrit normalement.
- « Au hasard » ×3 → trois fiches (en général différentes) ; `/api/aleatoire` rechargé change
  de Pokémon.
- Bascule de thème → sombre, conservé après rechargement, **pas de flash clair** au
  chargement ; thème clair au premier passage.
- Tout le parcours au clavier (Tab, Entrée), focus visible partout.
- Réglage système « réduire les animations » → plus de soulèvement ni d'apparition animée.

### US7 — Publication
- `npm start` + Lighthouse : > 90 dans les 4 catégories, FCP < 1 s ; **puis Lighthouse sur
  l'adresse Vercel** (critère SC-004).
- Site Vercel ouvert sur un téléphone : stories 1–6 fonctionnent, favoris et sacoche
  persistants.
- README présent ; `docs/` couvre les ch. 0–11.

### US8 — Bonus (chacun après livraison)
- **Noms FR** : la grille affiche « Bulbizarre » ; `?q=bulbi` le trouve ; `?q=bulbasaur` ne
  trouve rien (clarification Q1) ; l'adresse de fiche reste `/pokemon/bulbasaur`.
- **Tri** : `?tri=nom&page=3` dans un nouvel onglet → même tri, même page.
- **Sacoche** : badges des types couverts ; ajout rapide depuis une carte, refusé si pleine.
- **Comparateur** : fiche Pikachu → « Comparer » → choisir Raichu → `/comparer?a=pikachu&b=raichu`,
  meilleure valeur de chaque ligne mise en évidence ; lien copié → même écran ; `b=inconnu` →
  message.
- **Glisser-déposer** : déplacer le 3ᵉ membre en tête (souris) puis avec « Monter »
  (clavier) → ordre conservé après rechargement.
- **Combat** : sacoche de 3 → adversaire de 3 dans `?adversaire=` ; détail de chaque duel
  (scores, multiplicateurs) ; même adresse rechargée → même résultat ; sacoche vide → message.
- **Quiz** : silhouette noire ; « SALAMECHE » pour Salamèche → juste ; autre réponse → faux,
  Pokémon révélé dans les deux cas ; réponse vide refusée.
