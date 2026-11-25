# Contrat : code de transfert de sacoche (site → jeu)

## Format

```text
PKMD1.<donnees>.<empreinte>
```

| Partie | Règle |
|---|---|
| `PKMD1` | préfixe et version du format ; tout autre préfixe est refusé |
| `<donnees>` | base64url (sans `=`) du JSON ci-dessous, encodé en UTF-8 |
| `<empreinte>` | 8 caractères hexadécimaux minuscules : début du SHA-256 de la chaîne `<donnees>` |

JSON :

```json
{ "membres": [ { "id": 25, "surnom": "Pika" }, { "id": 1, "surnom": "" } ] }
```

- `membres` : 1 à 6 éléments, `id` entiers de 1 à 1025, sans doublon ;
- `surnom` : chaîne de 0 à 12 caractères ;
- aucun autre champ n'est accepté.

## Production (site, page Sacoche)

- Bouton « Exporter vers le Monde Pokémon », visible seulement si la sacoche n'est pas vide.
- Le code s'affiche dans un champ en lecture seule, avec un bouton « Copier ».
- Fonction pure dans `lib/codeSacoche.ts` (`creerCodeSacoche`), sans dépendance (Web Crypto pour le
  SHA-256), et testée.

## Lecture (jeu)

Commande : `/sacoche <code>`

| Situation | Résultat |
|---|---|
| préfixe, base64, JSON, empreinte ou règles invalides | « Code de sacoche invalide. » ; rien n'est ajouté |
| membre avec `id` > 151 | ignoré : « Le Pokémon #<n> n'existe pas dans ce monde. » (numéro au format « #448 » ; le jeu ne connaît pas le nom des Pokémon au-delà de 151) |
| membre déjà importé (même `id` et même `surnom`) | ignoré sans message d'erreur |
| sinon | ajouté à la collection (origine `sacoche`), marqué « capturé » dans le Pokédex |

Dernière ligne affichée : « <n> Pokémon importés. »

## Vecteurs de test partagés

Les deux côtés (site et jeu) DOIVENT passer les mêmes exemples, écrits dans le dépôt du jeu et copiés
dans les tests du site :

1. sacoche `[{25,"Pika"}]` → code calculé une fois, puis figé dans les tests ;
2. ce code avec une lettre de `<donnees>` changée → refusé ;
3. sacoche `[{448,""},{1,""}]` → 1 importé, 1 message « hors monde ».

## Limite connue

L'empreinte détecte un code abîmé ou retouché à la main ; elle n'empêche pas quelqu'un qui recalcule
l'empreinte (research R11). Usage personnel uniquement (FR-021).
