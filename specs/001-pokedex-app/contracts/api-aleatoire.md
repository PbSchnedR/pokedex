# Contrat — `GET /api/aleatoire` [cours, ch. 11]

Route Handler `app/api/aleatoire/route.ts`. Commence par `await connection()` pour que le tirage
soit fait à chaque requête (sinon Next.js préparerait une réponse unique pour tous).

## Requête
`GET /api/aleatoire` — aucun paramètre.

## Réponses

| Statut | Corps | Quand |
|--------|-------|-------|
| 200 | objet `Pokemon` (voir [data-model.md](../data-model.md)), y compris `nomFr` une fois le bonus livré | tirage réussi (id uniforme dans 1–1 025) |
| 404 | `{ "erreur": "Pokémon introuvable" }` | l'API ne connaît pas l'id tiré |
| 500 | (erreur levée par `appeler`) | panne de la PokéAPI |

## Consommateurs
- `BoutonHasard` (en-tête) : `router.push("/pokemon/" + pokemon.nom)` ; bouton désactivé
  pendant le tirage (« Tirage… ») ; un échec ne bloque pas le bouton (`finally`).
- Quiz *(bonus)* : tire la question suivante.
