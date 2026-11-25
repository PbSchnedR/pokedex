# Research: Easter egg « Monde Pokémon »

**Date**: 2026-11-23 · **Source principale** : dépôt `horizon-rust/horizon` (clone partiel de `docs/`,
`crates/horizon-mod-api`, `launcher`, branche `main` du 2026-11-23).

Légende des preuves : **Vérifié** = lu dans la doc ou le code (fichier cité). **Déduit** = suit de faits
vérifiés plus une hypothèse énoncée. **À prouver** = non vérifié ; une tâche « spike » le teste avant
de construire dessus.

---

## R1. Ouvrir le jeu depuis le site, directement dans le monde

- **Décision** : un **protocole d'adresse personnalisé** `pokemonde://` enregistré sous Windows (clé
  utilisateur `HKCU\Software\Classes\pokemonde`), qui lance un petit programme **lanceur** maison.
  Le lanceur valide l'adresse, prépare le monde et la difficulté, puis exécute
  `horizon-launcher play --instance PokeMonde --world MondePokemon`.
- **Preuves** :
  - Vérifié : `horizon-launcher play --world` « ouvre ou crée ce monde à l'instant », et `--instance`
    choisit l'instance (`docs/launcher-commands.md`, l. 91-104).
  - Vérifié : aucun protocole d'adresse n'est fourni par Horizon (recherche de « url scheme »,
    « deep link », « horizon:// » dans `docs/` et `launcher/` : aucun résultat).
  - Déduit (mécanisme Windows standard) : une clé `HKCU\Software\Classes\<schéma>` avec
    `URL Protocol` et `shell\open\command` fait ouvrir un programme par le navigateur, après une
    fenêtre de confirmation du navigateur. **À prouver** sur le poste (spike S1).
- **Sécurité** : n'importe quel site peut déclencher `pokemonde://…`. Le lanceur traite donc l'adresse
  comme une entrée hostile : une seule forme acceptée (`pokemonde://jouer?difficulte=<paisible|normal|difficile>`),
  rien n'est transmis tel quel au jeu ni à une commande.
- **Alternatives écartées** :
  - Lancer `horizon-launcher` directement depuis le protocole : impossible de valider l'entrée ni de
    préparer le monde et la difficulté.
  - Lanceur en script PowerShell : plus court, mais risque d'injection de commande si l'adresse est mal
    découpée ; le lanceur est écrit en **Rust**, comme le mod (même chaîne d'outils).

## R2. Une instance dédiée pour isoler le contenu Pokémon

- **Décision** : une instance Horizon **« PokeMonde »** qui contient seulement le mod Pokémon et le
  monde `MondePokemon`.
- **Preuve** : Vérifié, les instances sont séparées et `play --instance` en choisit une
  (`docs/launcher-commands.md`).
- **Raison** : le cas limite « d'autres mondes ne doivent pas être perturbés » est réglé par
  construction : les autres instances n'ont pas le mod.

## R3. Remplacer tous les mobs d'origine

- **Décision** : le mod annule **toute apparition** d'une créature qui n'est pas une espèce Pokémon,
  dans le crochet `finalize_spawn` (`event.spawn_cancelled = true`), et retire les créatures d'origine
  déjà présentes à l'ouverture du monde.
- **Preuves** :
  - Vérifié : `finalize_spawn` permet `spawn_cancelled = true`, qui « n'ajoute aucun mob »
    (`docs/modding/src/how-to/world/spawning.md`, l. 9 et 83-90).
  - Vérifié : section « Keeping or removing a mob » et « Walking every entity in a level »
    (même fichier, l. 30 et 164).
  - **À prouver** (spike S2) : que `finalize_spawn` passe aussi pour les œufs d'apparition, les
    générateurs et `/summon`. Sinon : retrait au moment où la créature entre dans le monde.
- **Alternative écartée** : forker le moteur. Inutile, l'API de mods suffit pour ce point.

## R4. Les espèces Pokémon comme créatures

- **Décision** : **un type de créature par espèce**, déclaré en données
  (`data/pokemonde/horizon/entity_type/<nom>.json`) en copiant une créature d'origine :
  - espèce paisible → modèle d'une créature passive (ex. `minecraft:pig`) ;
  - espèces Spectre/Ténèbres/Poison → en plus, une variante **sauvage** `<nom>_sauvage` copiée d'une
    créature hostile qui brûle au soleil (ex. `minecraft:zombie`) ; elle n'apparaît que la nuit en
    Difficile. Le lever du jour la fait disparaître, ce qui règle le cas limite de la spec.
- **Preuves** :
  - Vérifié : « A mod entity type is declared in `data/<id>/horizon/entity_type/<name>.json`. It copies a
    vanilla type: […] or a living mob » (`docs/modding/src/how-to/content-mods.md`, l. 594-595 et 627).
  - Vérifié : où une créature de mod apparaît, par étiquette de biome (`biome_tag`)
    (`spawning.md`, l. 12-22).
- **Déduit** : dans les 151 premiers Pokémon, aucun n'est de type Ténèbres. Les sauvages sont donc les
  lignées Spectre (Fantominus…) et Poison (Nidoran, Abo, Taupiqueur…). À vérifier quand les données
  seront générées.
- **Alternative écartée** : garder les créatures d'origine et seulement changer leur dessin. Les
  comportements (le cochon, la vache…) ne correspondent pas, et les créatures restent celles d'origine
  dans les menus et les commandes.

## R5. Dessiner un Pokémon en image 2D

- **Décision** : un **dessin personnalisé par type de créature** (`EntityRenderer`) qui affiche
  l'illustration du Pokémon sur un plan tourné vers la caméra. Repli : deux plans croisés en X (comme
  les fleurs), visibles sous tous les angles sans connaître la caméra.
- **Preuves** :
  - Vérifié : un mod peut dessiner un type de créature vivante, d'origine ou de mod, avec son propre
    dessin, qui remplace entièrement celui du modèle (`docs/modding/src/how-to/client/entity-renderers.md`).
  - Vérifié : la fonction de dessin n'a pas accès au monde (« A renderer has no `Host` ») ;
    `ClientHost::camera()` donne la caméra dans les crochets côté client
    (`how-to/client/camera-and-collision-reads.md`, l. 42).
  - **À prouver** (spike S2) : transmettre l'orientation de la caméra au dessin d'une image à l'autre.
    Sinon, on utilise le repli en X.

## R6. La Poké Ball et la capture

- **Décision** : un objet **Poké Ball** et un type **projectile** copié de la boule de neige
  (`{ "template": "minecraft:snowball", "item": "pokemonde:poke_ball" }`). Quand il touche un Pokémon, la
  capture est tentée avec `chance = max(taux_capture / 255, 0,05)`.
- **Preuves** :
  - Vérifié : projectile de mod copié de la boule de neige, lancé par l'objet, avec un dessin
    personnalisable (`content-mods.md`, l. 594-610).
  - **À prouver** (spike S3) : **aucun crochet « le projectile a touché quelque chose » n'a été trouvé**
    (recherche de `projectile_impact`, `projectile_hit`, `on_hit` : aucun résultat). Pistes, dans l'ordre :
    1. crochet de dégâts (`how-to/entities/refused-damage-attempts.md`) : la Poké Ball fait 0 dégât
       mais déclenche une tentative de dégâts dont la source est le projectile ;
    2. parcours des projectiles à chaque tour de jeu pour détecter leur disparition près d'un Pokémon ;
    3. repli : capture par clic droit sur le Pokémon avec la Poké Ball en main (pas de lancer).
- **Recette** : en Normal et Difficile, Poké Ball fabriquée avec du fer, du redstone et un bouton
  (recette à valider par l'utilisateur au moment des tâches). En Paisible, inventaire créatif.

## R7. Collection du joueur et Pokédex en jeu

- **Décision** : la collection et l'état du Pokédex (inconnu, vu, capturé) sont attachés au joueur et
  sauvegardés avec le monde ; le Pokédex en jeu est un **écran** ouvert par une touche.
- **Preuves** :
  - Vérifié : les mods ont des écrans (`how-to/client/screens.md`), des touches
    (`how-to/client/input.md`) et des données attachées aux entités (`concepts/attachments.md`).
  - **À prouver** (spike S4) : qu'une donnée attachée au joueur survit à une fermeture du monde, et
    qu'un écran peut afficher une liste défilante d'images.

## R8. Le monde par défaut et la difficulté

- **Décision** :
  - Un **monde modèle** de 512 × 512 blocs, généré une fois avec une graine choisie pour contenir 4 à
    6 biomes cibles près du centre, puis livré avec le lanceur. Une **bordure** de 512 est fixée au
    centre.
  - Le lanceur copie le modèle dans l'instance s'il manque ou s'il est illisible (cas limite
    « monde corrompu »).
  - La difficulté choisie est écrite par le lanceur dans le **fichier de réglages du mod**
    (`how-to/mod-settings.md`). Le mod l'applique quand le joueur entre dans le monde, par commandes
    serveur (`how-to/entities/server-commands.md`) :

    | Niveau | Mode de jeu | Difficulté du jeu | Règles ajoutées |
    |---|---|---|---|
    | Paisible | créatif | paisible | toujours de jour |
    | Normal | survie | paisible | toujours de jour, aucun dégât (crochet de dégâts refusés) |
    | Difficile | survie | normale | cycle jour/nuit |

- **Preuves** : vérifiées pour l'existence des réglages de mod et des commandes serveur ; **à prouver**
  que les commandes passent au moment où le joueur entre (spike S1).
- **Correspondance biomes → types** (Déduit, à ajuster avec la graine) :
  océan et rivière → Eau ; désert et badlands → Feu et Sol ; neige → Glace ; forêt et jungle → Plante
  et Insecte ; plaine → Normal ; montagne → Roche et Combat.

## R9. Données Pokémon dans le jeu (hors ligne)

- **Décision** : un **outil de génération** lit la PokéAPI une seule fois, au moment de construire le
  mod. Il écrit les 151 espèces (numéro, nom français, types, taux de capture) et leurs illustrations
  dans les fichiers du mod. Le jeu ne va jamais sur Internet.
- **Raison** : le cas limite « hors connexion » est réglé, la PokéAPI n'est pas sollicitée pendant
  le jeu, et les données sont identiques à celles du site (même source, FR-016).

## R10. Le secret sur le site

- **Décision** :
  - Un composant client **`LogoPokedex`**, le plus bas possible dans l'arbre, remplace le texte du
    lien dans `EnTete` (qui reste un composant serveur). Le lien vers l'accueil fonctionne comme avant ;
    un compteur compte 5 activations en moins de 3 secondes.
  - Ensuite, une boîte de dialogue native `<dialog>` affiche le **cube** (CSS 3D : `transform` et
    `opacity` seulement, moins de 0,5 s, remplacé par une simple apparition avec `motion-reduce:`), puis
    les 3 choix de difficulté.
  - Les 3 choix sont des **liens** (`<a href="pokemonde://jouer?difficulte=…">`) : ouvrir le jeu est
    une navigation (règle du cours : un lien pour naviguer, un bouton pour agir).
  - Si la page est toujours au premier plan 2 secondes après le clic, un message explique que le jeu
    ne semble pas installé (FR-023).
- **Limite connue** : un navigateur ne dit pas à la page si le protocole existe. La détection par
  « la page n'a pas perdu le focus » peut se tromper dans les deux sens ; le message reste donc
  prudent (« si rien ne s'est ouvert… »).
- **Aucune dépendance ajoutée** : CSS et `<dialog>` natifs (constitution, principe IV).

## R11. Code de transfert de la sacoche

- **Décision** : format texte `PKMD1.<données>.<empreinte>` :
  - `<données>` : JSON `{ "membres": [{ "id": 25, "surnom": "Pika" }] }` encodé en base64url (mêmes noms
    de champs que le type `Membre` du site) ;
  - `<empreinte>` : les 8 premiers caractères hexadécimaux du SHA-256 de `<données>` (Web Crypto côté
    site, sans dépendance).
- Dans le jeu, le joueur colle le code avec une commande `/sacoche <code>`.
- **Limite honnête** : l'empreinte détecte un code abîmé ou modifié à la main sans recalcul, mais pas
  quelqu'un qui recalcule l'empreinte (le calcul est visible dans le code du site). C'est suffisant
  pour un usage personnel (FR-021). Une vraie signature demanderait un secret côté serveur : écarté.
- **Pas de doublon** : un membre importé est identifié par (numéro, surnom, origine « sacoche ») ;
  réimporter la même sacoche n'ajoute rien.
- **Hors des 151** : un membre au-delà du n° 151 est ignoré, avec un message qui donne son numéro (voir
  le modèle de données).
- **Dépend de la spec 001** : la page Sacoche et son store doivent exister (étape TP 16).

## R12. Type de mod : natif plutôt que WebAssembly

- **Décision** : **mod natif** (compilé pour l'ordinateur).
- **Preuve** : Vérifié, les deux routes partagent la même API, mais certains éléments sont marqués
  « Not on wasm » (`crates/horizon-mod-api/src/lib.rs`, l. 3-6 et 46).
- **Raison** : usage personnel uniquement (FR-021), donc le bac à sable WebAssembly n'apporte rien et
  pourrait bloquer une fonction.
- **Prérequis vérifié** : Rust 1.95 ou plus récent et l'outil `cargo horizon-mod`
  (`docs/modding/src/start/first-content-mod.md`).

---

## Spikes à faire en premier (ordre = risque décroissant)

| # | Ce qu'on prouve | Si ça échoue |
|---|---|---|
| S1 | Un clic sur `pokemonde://jouer?difficulte=normal` dans le navigateur ouvre Horizon dans `MondePokemon`, en mode survie | Repli : raccourci bureau « Monde Pokémon » ; le site affiche seulement le secret et le mode d'emploi (à soumettre à l'utilisateur) |
| S2 | Aucun mob d'origine en 10 minutes (œuf d'apparition et `/summon` compris) ; une espèce de test apparaît, dessinée en image 2D | Retrait à l'entrée dans le monde ; dessin en X |
| S3 | Une Poké Ball lancée qui touche une créature est détectée par le mod | Capture par clic droit (R6, piste 3), à soumettre à l'utilisateur |
| S4 | Une donnée attachée au joueur survit à une fermeture ; un écran affiche une liste d'images | Sauvegarde dans un fichier du mod à côté du monde |
