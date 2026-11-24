# Bonus — Monde Pokémon (easter egg, hors cours)

> Bonus demandé par l'utilisateur (spec `specs/002-easter-egg-monde-pokemon/`, page validée en
> T001). Il **ne fait pas partie du cours** et n'est pas évalué par la grille ; la partie « site »
> reste soumise à toute la constitution (identifiants en français, `type`, `"use client"` au plus
> bas, aucune dépendance, animations courtes sur `transform` et `opacity`).

## Ce que c'est

Le Pokédex cache une porte vers **PokéMonde**, un petit jeu original en Rust compilé en
WebAssembly : un monde en cubes peuplé des 151 premiers Pokémon, avec capture, Pokédex, équipe et
PC. **Le jeu n'est pas publié** : il tourne seulement en local, sur l'ordinateur de son créateur
(`http://127.0.0.1:8765/`, servi par `sh outils/servir.sh` depuis son dépôt). Le site déployé ne
contient aucun fichier du jeu, seulement le secret et le lien.

Mise à jour 2026-11-23 : la première version prévue (lanceur Windows, adresse `pokemonde://`, mod
pour le moteur Horizon) est abandonnée au profit de ce jeu web local. Le secret, la fenêtre au cube
et le code de sacoche sont restés.

## Le secret

- Activer **5 fois en moins de 3 s** le titre « Mon Pokédex » de l'en-tête (souris, doigt ou
  Entrée au clavier : Entrée sur un lien déclenche aussi `click`).
- Pour tout le monde, le titre reste le lien d'accueil du cours ; 1 à 4 clics ne font rien d'autre.
- À la 5e activation, une fenêtre `<dialog>` native s'ouvre : un cube dessiné en CSS se pose en
  tournant (0,45 s, `transform` et `opacity`, rien sous `motion-reduce`), le titre « Monde
  Pokémon » et le lien « Entrer dans le Monde Pokémon », qui ouvre le jeu dans un nouvel onglet.
- Une phrase prévient : « Ce monde ne s'ouvre que sur l'ordinateur de son créateur ». Quand le
  site lui-même tourne en local (`localhost`), la fenêtre vérifie aussi que le jeu répond (requête
  `no-cors` de 1,5 s au plus) et le dit s'il ne répond pas. Sur le site déployé, cette vérification
  n'est pas faite : une page publique qui interroge `127.0.0.1` peut déclencher une demande
  d'autorisation « réseau local » du navigateur, déroutante pour un visiteur.

## Le code de sacoche

Si la sacoche n'est pas vide, le lien emporte la sacoche : `?sacoche=<code>`. Le format est fixé
par `specs/002-easter-egg-monde-pokemon/contracts/code-sacoche.md` :

```text
PKMD1.<base64url du JSON {"membres":[{"id":25,"surnom":"Pika"}]}>.<8 hex du SHA-256 des données>
```

- `lib/codeSacoche.ts` (`creerCodeSacoche`) : 1 à 6 membres, `id` 1–1025 sans doublon, surnom de
  12 caractères au plus ; seuls `id` et `surnom` sont recopiés (`MembreTransfert = Pick<Membre,
  "id" | "surnom">`, ch. 3). SHA-256 par Web Crypto, base64url sans `=` : aucune dépendance.
- Les mêmes vecteurs de test sont vérifiés des deux côtés (`lib/codeSacoche.test.ts` et
  `crates/pokemonde-web/src/sacoche.rs` dans le dépôt du jeu).
- Dans le jeu : chaque membre de numéro 1 à 151 rejoint l'équipe (ou le PC si elle est pleine) au
  niveau 5 avec son surnom ; un numéro plus grand est ignoré avec « Le Pokémon #448 n'existe pas
  dans ce monde. » ; réimporter le même code n'ajoute rien. Si aucune partie n'est ouverte,
  l'accueil du jeu affiche « Sacoche du Pokédex : N Pokémon prêts à rejoindre ton équipe » et le
  code s'applique à la partie choisie.

**Limite connue** : l'empreinte détecte un code abîmé ou retouché à la main, pas quelqu'un qui la
recalcule. Usage personnel uniquement.

## Fichiers du site

| Fichier | Rôle |
|---|---|
| `lib/compteurClics.ts` (+ test) | règle pure « 5 activations en moins de 3 s » |
| `hooks/useCompteurClics.ts` | le compteur dans un `useRef` (ch. 10) |
| `components/LogoPokedex.tsx` | le titre de l'en-tête, seul morceau client ajouté à `EnTete` |
| `components/PorteMondePokemon.tsx` | la fenêtre `<dialog>` et son cube |
| `lib/codeSacoche.ts` (+ test) | le code de sacoche |
| `lib/mondePokemon.ts` | l'adresse constante du jeu local et la vérification « le jeu répond » |
| `app/globals.css` | l'animation `--animate-cube` dans `@theme` |

## Le jeu

Dépôt séparé, hors de ce projet : `<dossier-des-projets>\pokemonde` (voir son
`docs/etape3.md`). Lancement : `sh outils/servir.sh`, puis le secret du site.
