# Ch. 5 — Tailwind CSS et interface

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.
> La direction artistique (phase C, T012) et le thème clair/sombre (T014, research R7) seront
> consignés ici après validation de l'utilisateur.

## Thème Tailwind 4 dans `globals.css` (`@theme`)

- **Point du cours** : ch. 5, leçon « Thème personnalisé et couleurs par type » — fichier
  `app/globals.css` : `@import "tailwindcss";` puis un bloc `@theme` avec `--color-pokedex` et
  les 18 `--color-type-*`. Les valeurs hexadécimales sont celles du cours, à l'identique.
- **Choix** : le contenu généré par `create-next-app` (`:root`, `@theme inline` pour les
  polices Geist, `@media (prefers-color-scheme: dark)`, `body { font-family: Arial }`) est
  remplacé par le fichier du cours.
- **Justification** : le cours donne le fichier complet. Le bloc `prefers-color-scheme`
  généré aurait de plus mis le site en sombre selon le système, ce que FR-023 refuse (clair par
  défaut, bascule mémorisée : T014). La police sera posée par `next/font` à l'étape 7 (T018),
  après le choix de la phase C.
- **Alternatives écartées** : un `tailwind.config.js` (Tailwind 4 se configure dans le CSS) ;
  garder les styles générés (thème sombre système, police Arial).
- **Vérifié** : après `npm run build`, la feuille produite contient `--color-type-fire`,
  `.bg-type-fire`, `.bg-type-fairy`, `--color-pokedex` et `@keyframes apparition`.
- **Fichiers** : `app/globals.css`.

## Animation `apparition`

- **Point du cours** : ch. 5, « Le mouvement : discret et utile » —
  `--animate-apparition: apparition 0.4s ease-out both;` et ses `@keyframes` dans `@theme`.
- **Choix** : repris tel quel. Durée 0,4 s (< 0,5 s), seules `opacity` et `transform`
  (`translateY(8px)` → `none`) sont animées : elles ne forcent pas de recalcul de mise en page.
  Le réglage « réduire les animations » sera respecté par `motion-reduce:` sur chaque élément
  animé (étapes 5–6, T026).
- **Fichiers** : `app/globals.css`.

## Couleurs de type : table de correspondance `TYPES`

- **Point du cours** : ch. 5, même leçon — piège « `bg-type-${type}` ne produit aucun style » ;
  `lib/types.ts` avec `TYPES: Record<string, { libelle: string; classe: string }>`.
- **Choix** : 18 entrées, clé = nom anglais de l'API, `libelle` français, `classe` **écrite en
  entier** (`"bg-type-fire"`). « La donnée reste en anglais […] On ne la traduit qu'à
  l'affichage. »
- **Justification** : Tailwind lit les fichiers comme du texte et ne garde que les classes
  complètes qu'il y trouve ; une classe construite à l'exécution n'existe pas dans la feuille.
- **Alternatives écartées** : classes construites dynamiquement (aucun style produit) ;
  `style={{ background }}` en ligne (le cours réserve `style` aux barres de stats et aux
  variables CSS).
- **Fichiers** : `lib/types.ts`.

## Teinte de carte par variable CSS : `teinteType`

- **Point du cours** : ch. 5, leçon « Design », « Une teinte par carte, avec une variable CSS »
  — `teinteType(type)` renvoie `var(--color-type-${type})`, repli `var(--color-gray-500)`.
- **Choix** : repris tel quel ; la carte (T026) posera `--teinte` en style local et les classes
  l'utiliseront (`from-(--teinte)/25`).
- **Vérifié** (exécution du module) : 18 types, `teinteType("fire")` →
  `var(--color-type-fire)`, `teinteType("licorne")` → `var(--color-gray-500)`.
- **Limite constatée, à traiter au ch. 9** : `type in TYPES` est aussi vrai pour les clés
  héritées d'`Object.prototype` (`teinteType("toString")` → `var(--color-type-toString)`).
  Sans effet ici (les types viennent de l'API), mais la validation de `?type=` dans l'adresse
  (ch. 9, FR-011) ne devra pas accepter `?type=constructor`. Signalé au manager ; le code du
  cours est conservé tel quel.
- **Fichiers** : `lib/types.ts`.
