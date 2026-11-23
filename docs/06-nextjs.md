# Ch. 6 — Next.js

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Étape 7 — la coque de l'application (layout racine)

- **Point du cours** : ch. 6, « Le layout racine » et étape 7 — `EnTete` et `PiedDePage` affichés
  par `app/layout.tsx` sur toutes les pages, contenu centré par
  `mx-auto max-w-6xl px-4 py-6`, `<html lang="fr">`.
- **Choix** : `app/layout.tsx` importe `globals.css`, la police, l'en-tête, le `<main>` du cours
  et le pied de page. Le layout reste en place d'une page à l'autre : seul `children` change.
- **Ajouts** :
  - lien d'évitement « Aller au contenu » (visible au focus clavier), repris de la maquette
    validée et utile au critère clavier du ch. 11 ;
  - `<main id="contenu">` porte la cible du lien ;
  - `app/page.tsx` (étape 0) perd son propre `<main>` : sinon la page aurait deux `<main>`
    imbriqués.
- **Fichiers** : `app/layout.tsx`, `app/page.tsx`.

## `EnTete` : liens `Link`, libellés

- **Point du cours** : ch. 6, « Le composant Link » — `Link` remplace seulement ce qui change et
  précharge la destination ; ch. 5, exercice « Un en-tête responsive » (Flexbox, empilé sur
  téléphone, aux deux extrémités dès `sm:`).
- **Choix** : titre-lien « Mon Pokédex » vers `/` ; navigation `Link` « Pokédex » (`/`),
  « Favoris » (`/favoris`), « Sacoche » (`/sacoche`) ; `BoutonTheme` à droite. En-tête collant
  et translucide (`sticky`, `bg-surface/85`, `backdrop-blur`), comme le propose le ch. 5.
- **Écarts de libellé** :
  - le cours écrit « Tous » pour le lien vers `/` ; il devient « Pokédex » (T017/T021) : avec la
    sacoche et les favoris, « Tous » ne dit plus de quoi il s'agit, alors que « Pokédex » nomme
    la page (son `<title>` est « Pokédex ») ;
  - le titre du cours est « Pokédex » ; il devient « Mon Pokédex », comme dans la maquette
    validée (T012), pour ne pas répéter le libellé du premier lien de navigation.
- **Pas encore là** (étapes suivantes) : compteurs de favoris et de sacoche (étapes 15–16), page
  courante surlignée (`LienNav`, étape 17), bouton « Au hasard » (étape 18).
- **Fichiers** : `components/EnTete.tsx`.

## Composant serveur par défaut, un seul composant client

- **Point du cours** : ch. 6, « Composants serveur et client » — rester côté serveur, isoler
  l'interactivité dans de petits composants client placés le plus bas possible.
- **Choix** : `layout.tsx`, `EnTete`, `PiedDePage`, `Icone` et `not-found.tsx` sont des
  composants serveur. Seul `BoutonTheme` porte `"use client"` (il réagit à un clic et écrit
  dans `localStorage`). `EnTete` (serveur) l'affiche sans lui passer de fonction.
- **Fichiers** : `components/BoutonTheme.tsx`.

## `next/image` : domaine autorisé

- **Point du cours** : ch. 6, « Le composant Image » — clé `images.remotePatterns` pour
  `raw.githubusercontent.com`, en gardant `cacheComponents`, `partialPrefetching` et le bloc
  `turbopack` généré.
- **Choix** : ajouté tel quel dans `next.config.ts` ; le garde-fou `next.config.test.ts` passe
  toujours. Les images elles-mêmes arrivent avec la carte (étapes 5–6).
- **Fichiers** : `next.config.ts`.

## Police avec `next/font`

- **Point du cours** : ch. 6, « Les polices » — `next/font/google` (exemple du cours : Inter).
- **Choix** : **Bricolage Grotesque** (décision Q-T012-a), `subsets: ["latin"]`, exposée en
  variable CSS `--font-bricolage` puis branchée sur `font-sans` dans `@theme inline`. Axes
  `opsz` et `wdth` chargés : l'axe de largeur sert les numéros et titres étroits
  (`font-stretch-85%`, `font-stretch-75%`). Geist, installée par `create-next-app`, est retirée.
- **Justification** : `next/font` télécharge la police au build et la sert depuis le site : pas
  de requête vers Google chez le visiteur, pas de décalage de mise en page (police de repli
  ajustée, visible dans `font-family` : « Bricolage Grotesque Fallback »).
- **Alternatives écartées** : Inter (exemple du cours, mais police « par défaut » que les skills
  de design demandent d'éviter) ; balise `<link>` Google Fonts (requête externe, décalage).
- **Fichiers** : `app/layout.tsx`, `app/globals.css`.

## Titre et description des pages (`metadata`)

- **Point du cours** : ch. 6, « Titre et description des pages » —
  `title: { default: "Pokédex", template: "%s · Pokédex" }` et la description du cours.
- **Vérifié** : l'onglet de `/` affiche « Pokédex ».
- **Fichiers** : `app/layout.tsx`.

## Page 404 soignée

- **Point du cours** : ch. 6, « Une page 404 soignée » — `app/not-found.tsx` : « Ce Pokémon
  s’est enfui », texte, `Link` « Retour au Pokédex ».
- **Choix** : code du cours ; le titre devient un `<h1>` du gabarit de la direction (`text-3xl`
  étroit), le bouton passe de `rounded-lg` à `rounded-full` (dans la direction, tout ce qui est
  interactif est en pilule) avec les états du ch. 5 (survol, appui, focus).
- **Vérifié** : `/nimporte-quoi` affiche la page dans le layout (en-tête et pied de page
  visibles), en clair à 1 280 px et en sombre à 375 px.
- **Fichiers** : `app/not-found.tsx`.

## Script de thème dans `<head>`

- **Point du cours** : aucun (FR-023, research R7) ; voir `docs/05-tailwind-interface.md`.
- **Vérification Next.js 16** : le guide `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`
  (section « Themes ») recommande exactement ce montage : script en ligne dans `<head>` du layout
  racine, `try/catch`, `suppressHydrationWarning` sur `<html>`. Il reste compatible avec
  `cacheComponents` : la page `/` est toujours pré-rendue en statique (`○ /` au build), et la
  console du navigateur reste vide en développement.
- **Fichiers** : `app/layout.tsx`.

## Complément de l'étape 7 : pages provisoires `/favoris` et `/sacoche`

- **Point du cours** : ch. 6, exercice « Deux nouvelles pages » (`app/favoris/page.tsx` :
  `<h1>Mes favoris</h1>`), « Titre et description des pages »
  (`export const metadata = { title: "Favoris" }`) et liste de l'étape 7 (« La navigation entre
  « Tous » et « Favoris » ne recharge pas la page »).
- **Constat** : sans ces pages, le préchargement des liens de l'en-tête (`Link`) provoquait en
  production une erreur 404 dans la console sur chaque page.
- **Décision du manager** : créer la page du cours pour `/favoris` et une page de même forme
  pour `/sacoche` (`<h1>Ma sacoche</h1>`, titre « Sacoche »). Elles seront remplacées aux étapes
  15 et 16 ; leur `metadata` passera alors dans un `layout.tsx` serveur, puisque les pages
  deviendront des composants client.
- **Vérifié** (`npm start`) : onglets « Favoris · Pokédex » et « Sacoche · Pokédex », console
  vide sur ces pages. Restent les 404 de préchargement des fiches `/pokemon/{nom}`, qui
  disparaîtront à l'étape 11.
- **Fichiers** : `app/favoris/page.tsx`, `app/sacoche/page.tsx`.
