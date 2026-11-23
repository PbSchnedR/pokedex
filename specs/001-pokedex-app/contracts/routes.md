# Contrat — Adresses publiques

L'adresse est une interface publique : elle se partage, se met en favori et doit résister à
toute saisie (ch. 9 : « tout ce qui vient de l'adresse est non fiable »).

| Adresse | Rendu | Contenu | Titre d'onglet |
|---------|-------|---------|----------------|
| `/` | serveur ; `Resultats` sous `Suspense` | grille paginée, recherche, filtre, tri | « Pokédex » |
| `/pokemon/{nom}` | serveur ; `Fiche` sous `Suspense` ; 151 pré-générées | fiche détaillée | « {Nom} · Pokédex » |
| `/favoris` | client (`usePokemons`) | favoris | « Favoris · Pokédex » |
| `/sacoche` | client | membres + emplacements libres | « Sacoche · Pokédex » |
| `/comparer` | serveur, sous `Suspense` | comparateur *(bonus)* | « Comparer · Pokédex » |
| `/combat` | client | combat de sacoches *(bonus)* | « Combat · Pokédex » |
| `/quiz` | client | quiz silhouettes *(bonus)* | « Quiz · Pokédex » |
| `/api/aleatoire` | Route Handler | voir [api-aleatoire.md](./api-aleatoire.md) | — |
| toute autre | `not-found.tsx` | page 404 dans le layout | — |

Pour `/favoris`, `/sacoche`, `/combat`, `/quiz` (pages client), le titre d'onglet passe par un
`layout.tsx` serveur du dossier qui exporte `metadata` (l'export `metadata` est réservé aux
composants serveur, ch. 6).

## `/` — paramètres

| Paramètre | Valeurs acceptées | Invalide → | Exemple |
|-----------|------------------|-----------|---------|
| `q` | texte | — (texte libre) | `?q=pika` |
| `type` | clé de `TYPES` (anglais) | ignoré (tous les types) | `?type=electric` |
| `page` | entier ≥ 1 | ramené dans `[1, nombrePages]` ; `abc` → 1 | `?page=3` |
| `tri` *(bonus)* | `numero`, `nom` | `numero` | `?tri=nom` |

Règles : nouvelle recherche → `page` supprimé ; `FiltreTypes` et `Pagination` conservent `q`,
`type` (et `tri`) ; `page=1` n'est pas écrit dans l'adresse.

## `/pokemon/{nom}`

- `{nom}` : nom API anglais (`charmander`), insensible à la casse (`toLowerCase`).
- Inconnu → `notFound()` ; panne API → `error.tsx` avec « Réessayer ».

## `/comparer` *(bonus)*

- `?a={nom}&b={nom}` ; `a` seul → champ pour choisir `b` ; nom inconnu → message dans la
  colonne concernée, pas de 404 global.

## `/combat` *(bonus)*

- `?adversaire={id},{id},…` : 1 à 6 entiers uniques entre 1 et 1 025. Absent ou invalide →
  nouvelle sacoche adverse tirée et inscrite par `router.replace`. Taille ramenée à celle de la
  sacoche du visiteur. Sacoche du visiteur vide → message et lien vers le Pokédex.
