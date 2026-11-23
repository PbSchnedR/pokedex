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

_Aucune entrée pour l'instant : ce chapitre n'a pas encore été mis en œuvre._

## Bonus — comparateur (T087, T088, FR-035, research R12)

### Les deux Pokémon vivent dans l'adresse (`/comparer?a=…&b=…`)

- **Point du cours** : ch. 11, « Pour aller plus loin » — « Un comparateur : deux Pokémon côte à
  côte, statistiques en regard » ; ch. 9, « Où ranger le texte de la recherche ? » (l'adresse).
- **Choix** : `a` et `b` dans l'adresse (clarification de la spec, R12). La page n'est pas async :
  comme l'accueil (ch. 8-9), elle passe la promesse `searchParams` à `Comparaison`, sous
  `<Suspense>` ; le titre et le champ s'affichent tout de suite. Les deux Pokémon sont chargés
  ensemble (`Promise.all`, ch. 7) avec `recupererPokemon`, déjà en cache.
- **Alternatives écartées** : l'exemple du ch. 10 (« useReducer : un comparateur de deux
  Pokémon », état `gauche`/`droite` dans le composant) — l'état serait perdu au rechargement et
  ne se partagerait pas, contraire à FR-035.
- **Fichiers** : `app/comparer/page.tsx`, `app/comparer/layout.tsx` (`metadata` « Comparer » →
  onglet « Comparer · Pokédex », même forme que favoris et sacoche).

### Validation de `a` et `b` (`lib/comparaison.ts`, testé)

- **Point du cours** : ch. 9 — « Tout ce qui vient de l'adresse est saisi par l'utilisateur, donc
  non fiable. »
- **Choix** : `lireChoix` → `vide` (rien), `invalide` (pas la forme d'un nom de l'API :
  `^[a-z0-9-]{1,40}$` après `trim` et `toLowerCase`) ou `nom`. Une saisie invalide (`../type/fire`,
  accents, espaces) est signalée « Aucun Pokémon nommé … » **sans appeler l'API** ; un nom bien
  formé mais inconnu passe par l'API, qui répond 404 → `null` (ch. 7) → même message, dans sa
  colonne, pas de `notFound()` global. Paramètre répété → le premier, comme `lib/parametres.ts`.
  `meilleuresValeurs` associe les stats **par nom** (pas par position) et rend `a`, `b` ou
  `egalite`. 10 tests (`lib/comparaison.test.ts`).
- **Alternatives écartées** : appeler l'API avec n'importe quelle saisie (une requête et une
  entrée de cache par faute de frappe) ; `notFound()` (efface la colonne valide).
- **Fichiers** : `lib/comparaison.ts`, `lib/comparaison.test.ts`.

### Tableau côte à côte, meilleure valeur pas seulement par la couleur

- **Point du cours** : ch. 11, accessibilité ; ch. 5, couleur porteuse d'information et teinte par
  variable CSS locale (`--teinte`) ; ch. 1, HTML sémantique.
- **Choix** : un vrai `<table>` (`caption` masquée, `th scope="col"` pour chaque Pokémon,
  `th scope="row"` pour chaque stat) : un lecteur d'écran annonce « Attaque, Raichu, 90 ». La
  meilleure valeur a un fond teinté **et** un cadre, une graisse plus forte, le signe `▲` et le
  texte masqué « , meilleure valeur » ; l'égalité a `=` et « , égalité ». Une légende visible
  explique `▲` et `=`. Barres à la même échelle que `BarresStats` (255). Colonne sans Pokémon :
  message dans un cadre pointillé (« Choisissez un second Pokémon… », « Aucun premier Pokémon »
  avec un lien vers le Pokédex, « Aucun Pokémon nommé « … » ») et `—` / « non disponible »
  dans les cellules. Composant serveur (aucune interactivité).
- **Alternatives écartées** : réutiliser `BarresStats` deux fois (pas d'alignement ligne à ligne,
  pas de place pour le repère) ; une couleur seule pour le gagnant (ch. 11).
- **Écart mineur** : les 6 libellés (PV, Attaque…) sont recopiés de `BarresStats`, où ils ne sont
  pas exportés (fichier hors du périmètre de ce bonus). À factoriser si on l'autorise.
- **Fichiers** : `components/TableauComparaison.tsx`.

### Le champ écrit `b` ; le lien « Comparer » de la fiche écrit `a`

- **Point du cours** : ch. 9, « La barre de recherche écrit dans l'adresse » (temporisation de
  300 ms, `router.replace`, composant sous `<Suspense>` car il lit `useSearchParams`) ; ch. 10,
  « useId : relier un libellé à son champ » ; ch. 9, « Préférez un `Link` … c'est un vrai lien ».
- **Choix** : `ChoixComparaison` (client) reprend le code de `BarreRecherche` mais écrit `b` et
  conserve `a`. `replace` : pas une entrée d'historique par lettre ; la comparaison finale reste
  donc l'entrée d'historique de la page, et « Précédent » depuis la fiche de Raichu la restitue.
  Libellé visible « Second Pokémon » relié par `useId`. Sur la fiche, un seul `Link` « Comparer »
  (contour, comme prévu par la direction « Album ») vers `/comparer?a={nom}`, à côté du bouton
  sacoche.
- **Alternatives écartées** : un bouton + `router.push` (moins accessible, pas préchargé) ;
  `router.push` à chaque frappe (historique pollué).
- **Limite connue** : pendant la saisie (« rai »), la colonne affiche « Aucun Pokémon nommé
  « rai » », désormais suivi de suggestions (Q-C1, ci-dessous) ; les noms sont les noms anglais de l'API tant que les noms français (R5) ne
  sont pas branchés.
- **Fichiers** : `components/ChoixComparaison.tsx`, `app/pokemon/[nom]/page.tsx`.

### Vérifié (serveur de production, Chrome sans interface, 2026-11-23)

- Fiche Pikachu → lien « Comparer » (`/comparer?a=pikachu`) → colonne Raichu vide avec invitation
  → saisie « raichu » → `/comparer?a=pikachu&b=raichu` (adresse inchangée 150 ms après la frappe,
  écrite après la temporisation) → 6 lignes, les 6 meilleures valeurs côté Raichu (60, 90, 55,
  90, 80, 110) → clic sur Raichu → « Précédent » → même adresse, même tableau.
- Même adresse ouverte directement (lien partagé) : même tableau, à 375 px (clair et sombre) et
  1 280 px ; pas de défilement horizontal ; console sans erreur ni avertissement.
- `b=inconnu` → « Aucun Pokémon nommé « inconnu » » dans la colonne de droite, Pikachu affiché ;
  `/comparer` seul → deux messages ; `a=PIKACHU&b=../type/fire&b=mew` → Pikachu + message ;
  `a=pikachu&b=Pikachu` → `=` sur chaque ligne, aucun cadre.

### Suggestions quand un nom est introuvable (décision Q-C1 : option C)

- **Décision de l'utilisateur** : Q-C1, option C — côté serveur, proposer en liens les noms qui
  contiennent la saisie.
- **Point du cours** : ch. 9, « Chercher parmi 1 025 Pokémon » (liste complète en cache, filtrée
  par `includes`) et « Le filtre par type : de simples liens » ; ch. 6, composants serveur par
  défaut.
- **Choix** : `suggerer(saisi, noms, 8)` (fonction pure) garde les noms de
  `recupererTousLesNoms()` qui contiennent la saisie, dans l'ordre des numéros, au plus 8 ; saisie
  vide → aucune. La liste n'est lue que si une colonne est introuvable. Chaque suggestion est un
  `Link` construit par `lienComparaison`, qui remplace son côté et conserve l'autre
  (`?a=pika&b=raichu` → « pikachu » mène à `?a=pikachu&b=raichu`). Aucun résultat → le message
  seul. Tableau toujours serveur : aucun JavaScript client en plus pour les suggestions.
- **Correction liée dans `ChoixComparaison`** : le champ gardait son texte quand `b` changeait
  sans lui (clic sur une suggestion, « Précédent ») et son effet réécrivait aussitôt l'ancien texte
  dans l'adresse (vu : clic sur « raichu » → retour à `b=rai`). Le champ reprend maintenant la
  valeur de l'adresse quand elle change de l'extérieur (motif React « ajuster l'état pendant
  l'affichage », états `vu` et `ecrit`), sans écraser les lettres tapées pendant la temporisation.
  `BarreRecherche` a la même faiblesse en théorie (aucun lien de l'accueil ne change `q`
  aujourd'hui) ; non modifiée, hors périmètre.
- **Alternatives écartées** : `<datalist>` des 1 025 noms (environ 12 Ko de plus dans la page,
  option B) ; suggestions côté client (composant client en plus).
- **Vérifié** (production, Chrome sans interface, 375 px sombre) : saisie « rai » → 8 suggestions
  (raichu, remoraid, raikou, masquerain, darkrai, braixen, koraidon, miraidon) → clic sur
  raichu → `?a=pikachu&b=raichu`, tableau complet (6 meilleures valeurs), champ « raichu » et
  adresse stable une seconde plus tard → « Précédent » → `?a=pikachu&b=rai`, champ « rai ».
  `?a=pika&b=raichu` → suggestion pikachu vers `?a=pikachu&b=raichu` ; `b=zzz` → message seul.
  Console sans erreur.
- **Fichiers** : `lib/comparaison.ts` (`suggerer`, `lienComparaison`, `valeurChoix`),
  `lib/comparaison.test.ts` (+9 tests), `app/comparer/page.tsx`,
  `components/TableauComparaison.tsx`, `components/ChoixComparaison.tsx`.
