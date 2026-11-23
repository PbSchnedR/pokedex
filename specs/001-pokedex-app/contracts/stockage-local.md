# Contrat — Stockage du navigateur (`localStorage`)

Ces clés sont un format persistant : les changer casse les données des visiteurs. Toute
évolution de forme doit passer par l'option `version` / `migrate` de `persist`.

| Clé | Écrit par | Forme (partie `state`) |
|-----|-----------|------------------------|
| `pokedex-favoris` | `persist` (Zustand) | `{ "noms": string[] }` |
| `pokedex-sacoche` | `persist` (Zustand) | `{ "equipe": Membre[] }` (ordre = ordre d'affichage et de combat) |
| `pokedex-theme` | `BoutonTheme` | `"clair"` \| `"sombre"` (absent = clair) |

`persist` enveloppe l'état : `{ "state": { … }, "version": 0 }`.

## Règles
- Lecture des stores **après** le premier affichage uniquement (`skipHydration` +
  `HydratationStores`) → aucune erreur d'hydratation.
- `pokedex-theme` est lu **avant** l'affichage par le script de `layout.tsx` (pas de flash),
  ce qui n'affecte pas React : seule la classe de `<html>` change.
- Stockage indisponible ou corrompu → stores vides, thème clair, aucune erreur affichée.
