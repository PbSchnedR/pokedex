# Ch. 8 — Routes dynamiques

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Segment dynamique `app/pokemon/[nom]/page.tsx` et `params` promesse

- **Point du cours** : ch. 8, « Un segment dynamique » — un dossier entre crochets répond à toutes
  les adresses `/pokemon/{nom}` ; `params` est une **promesse** ; « La page, elle, n'est pas
  async : elle transmet la promesse » au composant `Fiche`, placé sous `<Suspense>`.
- **Justification** : le nom n'est connu qu'à la visite (donnée propre à la requête). En le
  lisant sous `<Suspense>`, Next.js envoie tout de suite la coque de la page et complète la zone
  ensuite. Un `await params` directement dans la page serait signalé en développement (la page
  ne pourrait plus être préparée à l'avance).
- **Choix** : code du cours ; le `fallback` est le texte du cours « Chargement de la fiche… ».
  Le nom est passé en minuscules par `recupererPokemon` (`/pokemon/PIKACHU` fonctionne).
- **Fichiers** : `app/pokemon/[nom]/page.tsx`.

## `notFound()` contre `error.tsx`

- **Point du cours** : ch. 8, « Distinguer « introuvable » et « en panne » ».
- **Choix** : `recupererPokemon` renvoie `null` pour un nom inconnu → `notFound()` → la page
  `not-found.tsx` dans le layout. Une panne de l'API lève une erreur → `error.tsx` et
  « Réessayer ». « Réessayer » ne changerait rien à un nom mal tapé : c'est un 404.
- **Vérifié** : `/pokemon/pikachuu` affiche « Ce Pokémon s'est enfui », onglet « Pokémon
  introuvable · Pokédex » (`generateMetadata` renvoie ce titre quand le Pokémon est `null`).

## Cartes reliées aux fiches

- **Point du cours** : ch. 8, « Relier les cartes aux fiches » — `Link` vers
  `/pokemon/${pokemon.nom}`.
- **Vérifié** : clic sur la première carte de `/` → adresse `/pokemon/bulbasaur`, onglet
  « Bulbasaur · Pokédex », **sans rechargement** (une variable posée sur `window` avant le clic
  existe toujours après).

## Barres de statistiques et seul usage de `style`

- **Point du cours** : ch. 8, « Des barres de statistiques » — `<dl>`, libellés français,
  `MAXIMUM = 255`, grille `7rem / 2.5rem / 1fr`, largeur de la barre par `style` : « La largeur
  de la barre est une valeur calculée, différente pour chaque statistique : c'est le cas
  légitime d'un attribut `style`. »
- **Choix** : code du cours. Deux ajustements de la direction validée : le remplissage prend la
  teinte du type (`bg-(--teinte)`, au lieu de `bg-pokedex`) et la barre est plus épaisse
  (`h-4`) ; le rail reste neutre (`bg-black/10`, `dark:bg-white/10`), comme le rail gris du
  cours. La barre est `aria-hidden` : la valeur chiffrée est déjà lue dans son `<dd>`.
- **Fichiers** : `components/BarresStats.tsx`.

## Chaîne d'évolution : deux appels et une récursion

- **Point du cours** : ch. 8, « La chaîne d'évolution » — type `Maillon`, `aplatir` récursive,
  `recupererEvolutions(id)` : l'espèce donne l'adresse de la chaîne, puis la chaîne est un arbre.
- **Choix** : code du cours, en cache (`"use cache"` + `cacheLife("days")`). Seul écart de forme :
  `aplatir` est un **export nommé**, pour être testée (décision Q-3 ; research R13).
- **Tests** (`lib/pokeapi.test.ts`, `next/cache` simulé par `vi.mock`) : chaîne linéaire
  (Salamèche → 3 noms dans l'ordre), arbre ramifié (Évoli → base + 8 branches), branches à
  plusieurs niveaux (Mystherbe), maillon seul (Tauros). 4 tests verts.
- **Vérifié sur l'API réelle** : `/pokemon/eevee` affiche Eevee puis Vaporeon, Jolteon, Flareon,
  Espeon, Umbreon, Leafeon, Glaceon, Sylveon, chacun cliquable ; `/pokemon/pikachu` affiche
  Pichu, Pikachu, Raichu.
- **Pourquoi la récursion** : chaque maillon contient d'autres maillons de même forme, sur une
  profondeur inconnue ; une boucle à niveaux fixes casserait sur une chaîne plus longue.
- **Fichiers** : `lib/pokeapi.ts`, `lib/pokeapi.test.ts`.

## Assemblage de la fiche (direction « Album »)

- **Point du cours** : ch. 8, « Assembler la page » — image `next/image` 400 × 400
  `loading="eager"`, numéro, nom en `<h1>`, badges, taille et poids, barres, section
  « Évolutions » avec `GrillePokemons`.
- **Choix** : structure du cours, mise en forme de la maquette validée : grande vignette inclinée
  de 1° à l'arrêt (`-rotate-1`, aucune animation, redressée par `motion-reduce:rotate-0`), deux
  colonnes `2fr / 3fr` dès `md:`, taille et poids en pastilles (`<dl>`), titre
  « Statistiques de base ». Les nombres sont formatés à la française
  (`toLocaleString("fr-FR")` : « 0,4 m », « 6,5 kg ») au lieu de « 0.4 m ».
- **Différence avec la maquette** : la maquette montre les évolutions en petites vignettes ; la
  tâche T040 et le cours demandent `GrillePokemons`, gardé.
- **Vérifié** : Pikachu à 375 px en clair et en sombre (une colonne, `scrollWidth = 375`), Évoli à
  1 280 px en sombre (deux colonnes) ; console sans erreur.
- **À reprendre au ch. 11 (T073)** : dans la section « Évolutions » (`<h2>`), chaque carte porte
  aussi un `<h2>` : niveaux de titre égaux. Signalé, non modifié (composant partagé du cours).
- **Fichiers** : `app/pokemon/[nom]/page.tsx`.

## Un titre par Pokémon : `generateMetadata`

- **Point du cours** : ch. 8, « Un titre par Pokémon » — titre = nom capitalisé, description
  « … : types, statistiques et évolutions. », `openGraph.images`, « Pokémon introuvable » si
  `null`. « Grâce au cache, l'API n'est interrogée qu'une fois. »
- **Vérifié** : onglets « Pikachu · Pokédex », « Eevee · Pokédex ».

## `TOTAL_POKEMONS` et `recupererTousLesNoms`

- **Point du cours** : ch. 8, « Générer des pages à l'avance » — `/pokemon?limit=1025`, en cache ;
  si la liste manque, **erreur** (et non `[]`) : sans elle, ni recherche ni pré-génération.
- **Fichiers** : `lib/pokeapi.ts`.
