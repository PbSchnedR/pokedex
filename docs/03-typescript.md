# Ch. 3 — TypeScript

> Journal des choix du chapitre (constitution, principe III). Une entrée par choix : le choix,
> le point du cours appliqué, la justification, les alternatives écartées, les fichiers.

## Étape 2 — deux types pour un Pokémon : `PokemonApi` et `Pokemon`

- **Point du cours** : ch. 3, leçon « Type de l'API, type de l'application » et étape 2 —
  fichier `types/pokemon.ts` repris tel quel.
- **Choix** :
  - `PokemonApi` décrit la réponse **brute** de `/pokemon/{nom}`, en anglais et imbriquée, en ne
    gardant que les champs utiles : `id`, `name`, `height` (décimètres), `weight`
    (hectogrammes), `types`, `stats`, `sprites.other["official-artwork"].front_default`
    (`string | null` : l'illustration peut manquer).
  - `Pokemon` est la forme **simple, à plat et en unités utiles** que manipulent les
    composants : `id`, `nom`, `image` (toujours une chaîne : le repli est choisi à la
    conversion), `types: string[]`, `taille` (m), `poids` (kg), `stats: Statistique[]`.
  - `Statistique` : `{ nom, valeur }`.
- **Justification (pourquoi deux types)** : la conversion `PokemonApi → Pokemon` se fait à un
  seul endroit (`versPokemon`, ch. 7). Les composants reçoivent des données propres, dans les
  unités voulues, et si l'API change un jour de forme, un seul fichier est à corriger. Le type
  brut n'est pas « tout ce que renvoie l'API » mais le contrat minimal qu'on en attend.
- **`type` plutôt qu'`interface`** : « Ce cours utilise type partout, pour rester simple »
  (ch. 3, « Décrire un objet ») ; règle reprise par la constitution (principe II).
- **Exports nommés** : un fichier de types n'a pas d'export par défaut (ch. 2, « Modules »).
- **Vérification contre l'API réelle** (`GET https://pokeapi.co/api/v2/pokemon/pikachu`,
  2026-11-23), champs utiles extraits :

  ```json
  { "id": 25, "name": "pikachu", "height": 4, "weight": 60,
    "types": [{ "slot": 1, "type": { "name": "electric", "url": "…/type/13/" } }],
    "stats": [{ "base_stat": 35, "stat": { "name": "hp" } }, … 6 entrées …],
    "sprites.other.official-artwork.front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" }
  ```

  Chaque champ de `PokemonApi` existe avec le type annoncé. Les champs supplémentaires
  (`slot`, `url`, `effort`…) sont ignorés volontairement. L'image est sur
  `raw.githubusercontent.com`, le domaine que le ch. 6 autorise pour `next/image`.
- **Alternatives écartées** : utiliser la réponse brute partout (noms anglais imbriqués et
  unités de l'API dispersés dans les composants) ; typer toute la réponse de l'API (des
  centaines de champs inutiles).
- **Fichiers** : `types/pokemon.ts`.

## Génériques (rappel pour la suite)

- **Point du cours** : ch. 3, « Les génériques, en bref » — `Promise<Pokemon>`,
  `Record<string, …>`.
- **Application prévue** : `appeler<T>(adresse): Promise<T | null>` (ch. 7) et
  `TYPES: Record<string, { libelle: string; classe: string }>` (ch. 5, `lib/types.ts`).
