# Data Model: Easter egg « Monde Pokémon »

Les entités viennent de la spec (section Key Entities). Côté **site** : TypeScript (types du cours,
`type` plutôt que `interface`). Côté **jeu** : données du mod.

## Espèce (`Espece`), générée depuis la PokéAPI (R9)

| Champ | Type | Règle |
|---|---|---|
| `numero` | entier 1–151 | identifiant unique ; affiché « #007 » (`padStart`, comme le site) |
| `nom` | texte | nom français de la PokéAPI, identique au site (FR-016) |
| `types` | 1 ou 2 types parmi les 18 | ordre de la PokéAPI |
| `tauxCapture` | entier 3–255 | `capture_rate` de la PokéAPI |
| `illustration` | image PNG | illustration officielle, copiée dans les fichiers du mod |
| `sauvage` | booléen (calculé) | vrai si l'un des types est Spectre, Ténèbres ou Poison → une variante `<nom>_sauvage` existe |

Règle de capture (FR-011) : `chance = max(tauxCapture / 255, 0,05)`.

## Biome typé (`BiomeType`)

| Champ | Type | Règle |
|---|---|---|
| `biomes` | liste de biomes du jeu | ex. `minecraft:desert`, `minecraft:badlands` |
| `types` | 1 ou 2 types | ex. Feu, Sol |
| `especes` | liste de `numero` | calculée : espèces qui ont l'un des `types` |

Contraintes : 4 à 6 biomes typés présents dans le monde (FR-013) ; au moins 80 % des apparitions d'un
biome ont un type associé (FR-014). Les 20 % restants sont tirés parmi toutes les espèces paisibles.

## Monde Pokémon (`MondePokemon`)

| Champ | Valeur |
|---|---|
| dossier | `MondePokemon` (instance Horizon `PokeMonde`) |
| taille | bordure de 512 × 512 blocs centrée sur l'apparition du joueur |
| graine | choisie à la génération du modèle, notée dans le dépôt du jeu |
| difficulté | lue dans les réglages du mod à chaque entrée (voir ci-dessous) |

Cycle de vie : *absent ou illisible* → (le lanceur copie le modèle) → *prêt* → (le joueur joue) →
*modifié*, sauvegardé par le jeu. Ce n'est jamais recréé tant qu'il est lisible.

## Difficulté (`Difficulte`)

`"paisible" | "normal" | "difficile"`. Elle n'existe que dans cette liste, à la fois dans l'adresse
`pokemonde://` et dans les réglages du mod. Toute autre valeur est refusée. La table des effets est
dans `research.md` (R8).

## Collection du joueur (`Collection`), attachée au joueur et sauvegardée avec le monde

| Champ | Type | Règle |
|---|---|---|
| `membres` | liste de `MembreCollection` | sans limite de taille |
| `pokedex` | table `numero → "vu" \| "capture"` | absent = inconnu ; « capturé » ne redevient jamais « vu » |

`MembreCollection` : `numero`, `surnom` (0 à 12 caractères, `""` = pas de surnom, comme sur le site),
`origine` (`"capture"` ou `"sacoche"`). Le `numero` du jeu correspond à l'`id` du site.

Transitions du Pokédex : *inconnu* → (le Pokémon apparaît à moins de 16 blocs du joueur) → *vu* →
(capture ou import) → *capturé*.

Unicité : un membre d'origine `"sacoche"` est identifié par (`numero`, `surnom`) ; un import qui
redonne le même couple n'ajoute rien (FR-018). Les captures ne sont jamais fusionnées (deux Pikachu
capturés = deux membres).

## Code de transfert de sacoche (`CodeSacoche`)

Voir `contracts/code-sacoche.md`. Il contient de 1 à 6 membres `{ id, surnom }`, sans doublon d'`id`,
conformément aux règles de la sacoche du site (spec 001, `stores/sacoche.ts`). `surnom` vaut `""` quand
il n'y a pas de surnom, comme sur le site.

Type côté site (ch. 3 : `Pick<>` sur le type `Membre` de la spec 001) :

```ts
export type MembreTransfert = Pick<Membre, "id" | "surnom">;
```

**Pokémon hors du jeu** : la sacoche du site accepte les 1 025 Pokémon, le jeu seulement les 151
premiers. À l'import, un membre dont l'`id` est supérieur à 151 est **ignoré**, avec un message qui donne
son numéro (« Le Pokémon #448 n'existe pas dans ce monde. ») ; les autres membres sont importés. Le
message ne donne pas le nom, que le jeu ne connaît pas au-delà de 151.
