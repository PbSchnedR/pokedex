# Ch. 0 — Démarrage

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Outils vérifiés

- **Point du cours** : ch. 0, « Les trois outils à installer » (Node.js LTS ≥ 20, VS Code avec
  Tailwind CSS IntelliSense / ESLint / Prettier, Git).
- **Constaté le 2026-11-23** : `node -v` → `v24.13.0`, `npm -v` → `11.1.0`,
  `git --version` → `2.46.0.windows.1`. Les extensions VS Code ne sont pas vérifiables depuis
  le terminal : à contrôler par l'étudiant.
- **Fichiers** : aucun.

## Création du projet avec `create-next-app@16`, hors du dossier, puis copie

- **Point du cours** : ch. 0, « Créer l'application » — réponses : TypeScript Oui, ESLint Oui,
  Tailwind CSS Oui, dossier `src/` Non, App Router Oui, alias `@/*` par défaut. « Ce cours suit
  Next.js 16. »
- **Commande lancée** (dans un dossier temporaire hors du projet) :
  `npx create-next-app@16 pokedex --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --disable-git --yes`
  - les drapeaux remplacent les réponses de l'assistant (exécution non interactive) ;
  - `--yes` garde les valeurs par défaut des questions que le cours ne cite pas (React
    Compiler : non activé ; `AGENTS.md` : généré, c'est la valeur par défaut) ;
  - `--disable-git` : le dépôt est créé à la main dans `pokedex-frontend` (voir plus bas).
- **Version obtenue** : `next` 16.4.6, `react` / `react-dom` 19.3.0, `tailwindcss` 4.3.3
  (chargé par `@tailwindcss/turbopack`, pas de `postcss.config.mjs`), ESLint 9.
- **Justification** : le dossier contenait déjà Spec Kit (`.claude/`, `.specify/`, `specs/`) et
  le cours (`cours/`) ; `create-next-app` refuse un dossier non vide. Générer ailleurs puis
  copier sans écraser garde la structure du cours à la racine (research R1). `@16` (au lieu de
  `@latest` écrit dans le cours) fige la version que le cours suit.
- **Alternatives écartées** : générer dans un sous-dossier (casse la structure à la racine) ;
  écrire la configuration à la main (s'écarte de l'étape 0).
- **Écart de nom** : le cours nomme le projet `pokedex` ; c'est le `name` de `package.json`.
  Le dossier reste `pokedex-frontend`.
- **Fichiers** : `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`,
  `eslint.config.mjs`, `app/`, `public/`, `.gitignore`, `AGENTS.md`, `README.md` (généré, réécrit
  à l'étape 18).

## `next.config.ts` : `cacheComponents` et `partialPrefetching`

- **Point du cours** : ch. 0 — « Le fichier next.config.ts généré contient
  `cacheComponents: true` et `partialPrefetching: true` : ne supprimez pas ces lignes, tout le
  chapitre 7 repose dessus. »
- **Constaté** : les deux clés sont présentes dans le fichier généré, ainsi que le bloc
  `turbopack` (règle `*.css` → `@tailwindcss/turbopack`) que le ch. 6 demande de garder. Le
  serveur affiche au démarrage « Cache Components enabled » et « Partial Prefetching enabled ».
  Aucun écart à consigner.
- **Garde-fou** : `next.config.test.ts` échoue si l'une des deux clés disparaît.
- **Fichiers** : `next.config.ts`, `next.config.test.ts`.

## Dépôt Git dédié

- **Point du cours** : ch. 0, étape 0 — « J'ai fait un premier commit Git » ; ch. 11, étape 18
  (GitHub + Vercel).
- **Choix** : `git init -b main` dans `pokedex-frontend` ; la ligne `pokedex-frontend/` est
  ajoutée au `.gitignore` du dépôt parent `TP-B3` (research R2, décision utilisateur). Branche
  `main` : nom par défaut de GitHub et de Vercel (renommable par `git branch -m`).
- **Alternatives écartées** : rester dans le dépôt `TP-B3` avec un *Root Directory* Vercel
  (historique mélangé avec les autres TP).
- **Fichiers** : `.git/`, `../.gitignore`.

## Fichiers ignorés par Git

- **Choix** : `/cours/` ajouté au `.gitignore` (research R14 : contenu du formateur, à ne pas
  republier sur un dépôt public). `.env*` est déjà ignoré par le `.gitignore` généré, ce qui
  couvre `.env.local` (ch. 11 : jamais commité).
- **Vérifié** : `git check-ignore -v .env.local cours/cours-pokedex.html` → règles `.env*` et
  `/cours/`.
- **Fichiers** : `.gitignore`.

## ESLint : outillage tiers exclu

- **Choix** : `.claude/**` et `.specify/**` ajoutés aux `globalIgnores` de `eslint.config.mjs`.
- **Justification** : ces dossiers contiennent les scripts des skills (dont un fichier minifié)
  et de Spec Kit, qui ne font pas partie de l'application ; ils produisaient 93 avertissements
  sans rapport avec le code du Pokédex, ce qui aurait masqué les vrais avertissements.
- **Alternatives écartées** : laisser les avertissements (bruit permanent dans la porte de
  qualité).
- **Fichiers** : `eslint.config.mjs`.

## Étape 0 — « Mon Pokédex »

- **Point du cours** : ch. 0, étape 0 — contenu de `app/page.tsx` repris tel quel.
- **Vérifié** : `npm run dev` → la page `/` renvoie 200 et contient
  `<h1>Mon Pokédex</h1><p>Bientôt 1 025 Pokémon ici.</p>`.
- **Fichiers** : `app/page.tsx`.

## Tests : Vitest ciblé (décision Q-3)

- **Point du cours** : aucun (ajout hors cours, **approuvé par l'utilisateur**, Q-3 / research
  R13) — limité aux fonctions pures dont une erreur passerait inaperçue.
- **Choix** : `vitest` en dépendance de développement, script `"test": "vitest run"`,
  `vitest.config.ts` avec l'alias `@/` vers la racine (comme `tsconfig.json`). Premier test :
  `next.config.test.ts`.
- **Version** : **Vitest 4.1.12** et non la 5.1.1 (`latest`). La 5 exige `@types/node` ≥ 22
  alors que le projet généré déclare `@types/node ^20` (`npm install -D vitest` → `ERESOLVE`).
  La 4 accepte `^20` : aucun fichier généré n'est modifié.
- **Incident d'outillage** : avec npm 11.1.0, `npm install -D vitest@^4.1.12` plante
  (`Cannot read properties of null (reading 'edgesOut')`, bogue interne d'arborist, reproduit
  hors OneDrive). L'installation a été faite une fois avec `npx npm@latest` (npm 12.2.3) ; le
  `package-lock.json` obtenu (format 3) s'installe ensuite normalement avec npm 11.1.0
  (`npm ci` et `npm install` vérifiés).
- **Fichiers** : `package.json`, `package-lock.json`, `vitest.config.ts`, `next.config.test.ts`.
