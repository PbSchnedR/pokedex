# Ch. 11 — Finitions

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix, au format
> ci-dessous. Les décisions de l'utilisateur sont citées avec leur numéro (Q-n).

<!-- Gabarit d'entrée :
## <Choix>
- **Point du cours** : ch. N, leçon « … »
- **Justification** : …
- **Alternatives écartées** : …
- **Fichiers** : …
-->

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
