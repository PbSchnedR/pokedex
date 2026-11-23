# Data Model — Application Pokédex (Phase 1)

Types en `type` (pas `interface`) [cours, ch. 3]. Noms et unités du cours. Les champs marqués
*bonus* n'existent qu'après livraison du bonus correspondant.

## Données de l'API (brutes) — `types/pokemon.ts`

### PokemonApi [cours, ch. 3]
Seulement les champs utiles de `/pokemon/{nom|id}` :
`id: number`, `name: string`, `height: number` (dm), `weight: number` (hg),
`types: { type: { name: string } }[]`, `stats: { base_stat: number; stat: { name: string } }[]`,
`sprites: { other: { "official-artwork": { front_default: string | null } } }`.

### Maillon [cours, ch. 8] — local à `lib/pokeapi.ts`
`species: { name: string }`, `evolves_to: Maillon[]` (arbre, profondeur inconnue → `aplatir`
récursif).

## Données de l'application

### Pokemon [cours, ch. 3]
| Champ | Type | Règle |
|-------|------|-------|
| `id` | `number` | 1 – 1 025 ; clé stable des listes (`key`) |
| `nom` | `string` | nom API anglais, minuscules ; sert d'identifiant d'adresse (`/pokemon/{nom}`) |
| `nomFr` *(bonus FR-033)* | `string` | lu dans `data/pokemons-fr.json` ; repli : `nom` |
| `image` | `string` | official-artwork ; repli : sprite par défaut (`versPokemon`) |
| `types` | `string[]` | 1 ou 2 valeurs anglaises (`"fire"`) ; traduites à l'affichage via `TYPES` |
| `taille` | `number` | mètres (`height / 10`) |
| `poids` | `number` | kilogrammes (`weight / 10`) |
| `stats` | `Statistique[]` | 6 entrées |

### Statistique [cours, ch. 3]
`nom: string` (clé API : `hp`, `attack`, `defense`, `special-attack`, `special-defense`,
`speed`, libellé français à l'affichage), `valeur: number` (≥ 0).

### Type — `lib/types.ts` [cours, ch. 5]
`TYPES: Record<string, { libelle: string; classe: string }>` — 18 entrées, `classe` **complète**
(`"bg-type-fire"`), jamais construite dynamiquement. `teinteType(type)` → `var(--color-type-…)`.
Couleurs dans `@theme` (`--color-type-*`), contraste du libellé blanc à vérifier (ch. 11).

### Membre (sacoche) — `stores/sacoche.ts` [cours, ch. 9]
`Pick<Pokemon, "id" | "nom" | "image" | "types"> & { surnom: string }`.
- **Pas de `nomFr` dans `Membre`**, même après le bonus FR-033 : il se calcule par
  `nomFrancais(id)` (constitution II : rien de calculable n'est stocké ; la forme de
  `pokedex-sacoche` reste stable, aucune migration).
- `surnom` : 0 à 12 caractères ; chaîne vide = pas de surnom [plan R8].

## Stores (état partagé client)

### useFavoris — `stores/favoris.ts` [cours, ch. 9]
| Élément | Détail |
|---------|--------|
| État | `noms: string[]` — ensemble sans doublon de noms API |
| Action | `basculer(nom)` : retire si présent, sinon ajoute (nouveau tableau) |
| Persistance | `persist`, clé `pokedex-favoris`, `skipHydration: true` |
| Sélecteurs | une valeur à la fois : `etat.noms.includes(nom)`, `etat.noms.length`, `etat.basculer` |

### useSacoche — `stores/sacoche.ts` [cours, ch. 9]
| Élément | Détail |
|---------|--------|
| État | `equipe: Membre[]`, ordre significatif, 0 ≤ longueur ≤ `TAILLE_SACOCHE` (6) |
| `ajouter(pokemon)` | **refus silencieux** (état renvoyé inchangé) si doublon d'`id` ou équipe pleine |
| `retirer(id)` | filtre |
| `renommer(id, surnom)` | `map` + copie du membre |
| `vider()` | `equipe: []` |
| `deplacer(depuis, vers)` *(bonus FR-040)* | réordonne ; indices hors bornes → état inchangé |
| Persistance | `persist`, clé `pokedex-sacoche`, `skipHydration: true` |
| Dérivés (jamais stockés) | `estPleine = equipe.length >= 6` ; types couverts (`useTypesCouverts`) |

Message « sacoche pleine » (spec US5-1) : affiché par l'interface à partir du dérivé `estPleine`,
la règle elle-même reste dans `ajouter`.

### Thème (FR-023) — hors store
`localStorage["pokedex-theme"]` ∈ `"clair" | "sombre"` ; absent = clair. Lu par le script de
`layout.tsx`, écrit par `BoutonTheme`. Pas de store : une seule valeur, un seul composant.

## État d'adresse (validé côté serveur)

| Page | Paramètre | Validation | Défaut |
|------|-----------|-----------|--------|
| `/` | `q` | texte libre, `trim` ; FR : `normaliser()` | `""` |
| `/` | `type` | doit être une clé de `TYPES`, sinon ignoré | aucun |
| `/` | `page` | entier, borné à `[1, nombrePages]` | `1` |
| `/` | `tri` *(bonus)* | `numero` \| `nom`, sinon défaut | `numero` |
| `/comparer` | `a`, `b` | nom existant ; inconnu → message | — |
| `/combat` | `adversaire` | liste de 1 à 6 ids entiers 1–1 025, uniques | tirage |

Détail des formats : [contracts/routes.md](./contracts/routes.md).

## Données générées (bonus)

### data/pokemons-fr.json
`{ id: number; nom: string; nomFr: string }[]` — 1 025 entrées triées par `id`, produites par
`scripts/generer-donnees.mjs` depuis `/pokemon-species/{id}` (`names[language.name = "fr"]`).

### data/table-types.json
`Record<typeAttaquant, Record<typeDefenseur, 0 | 0.5 | 1 | 2>>` — 18 × 18, depuis `/type/{nom}`
(`damage_relations` : `double_damage_to`, `half_damage_to`, `no_damage_to` ; sinon 1).

## Combat (bonus FR-039) — `lib/combat.ts`

- `multiplicateur(attaquant: string[], defenseur: string[])` = max sur `t ∈ attaquant` du
  produit sur `d ∈ defenseur` de `table[t][d]`.
- `scoreDuel(A, B)` = `Σ A.stats.valeur × multiplicateur(A.types, B.types)`.
- `Duel = { a: Pokemon; b: Pokemon; scoreA; scoreB; multA; multB; vainqueur: "a" | "b" | "nul" }`.
- `combattre(equipeA, equipeB)` → `{ duels: Duel[]; victoiresA; victoiresB; issue: "victoire" | "defaite" | "nul" }`.
- Déterministe : aucune part d'aléatoire.

## Transitions d'état

- **Favori** : absent ⇄ présent (`basculer`).
- **Membre** : absent → présent (`ajouter`, si < 6 et non doublon) → renommé (`renommer`) →
  déplacé (`deplacer`) → absent (`retirer` / `vider` après confirmation).
- **Quiz** : `question` → `répondu` (juste | faux, Pokémon révélé) → `question` suivante.
- **Chargement client** (`usePokemons`) : `chargement` → `pret` | `erreur`.
