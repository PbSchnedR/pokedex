# Contrat : adresse `pokemonde://` (site → lanceur)

Le site produit l'adresse ; le **lanceur** la reçoit du système, la valide, puis ouvre le jeu.

## Forme acceptée (la seule)

```text
pokemonde://jouer?difficulte=<paisible|normal|difficile>
```

| Partie | Règle |
|---|---|
| schéma | `pokemonde`, insensible à la casse |
| action | exactement `jouer` |
| paramètres | exactement un : `difficulte`, valeur parmi les 3 de la liste, en minuscules |
| longueur totale | 64 caractères maximum |

Tout le reste est **refusé**, sans lancer le jeu : autre action, paramètre inconnu ou en double, valeur
hors liste, caractères encodés, longueur dépassée. Le lanceur affiche alors une petite fenêtre
d'erreur : « Lien Monde Pokémon invalide ».

Raison : n'importe quel site peut créer un lien `pokemonde://` ; l'adresse est une entrée hostile
(research R1).

## Ce que fait le lanceur, dans l'ordre

1. Valide l'adresse (ci-dessus).
2. Vérifie que Horizon et l'instance `PokeMonde` existent ; sinon, une fenêtre explique ce qui manque
   (FR-005).
3. Si le monde `MondePokemon` est absent ou illisible, il copie le monde modèle.
4. Écrit la difficulté dans les réglages du mod.
5. Exécute `horizon-launcher play --instance PokeMonde --world MondePokemon`, avec des arguments fixes :
   aucune partie de l'adresse n'est transmise telle quelle.

## Côté site

- Les 3 choix sont des `<a>` dont le `href` est une **constante** (table de 3 entrées), jamais
  construite à partir de l'adresse de la page ni d'une saisie.
- Après le clic, si la page garde le focus pendant 2 s, le message « Si rien ne s'est ouvert, le Monde
  Pokémon n'est pas installé sur cet ordinateur » s'affiche avec un lien vers le mode d'emploi
  (FR-023).
