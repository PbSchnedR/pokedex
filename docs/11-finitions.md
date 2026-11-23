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
