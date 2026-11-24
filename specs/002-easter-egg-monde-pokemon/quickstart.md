# Quickstart : vérifier l'easter egg « Monde Pokémon »

## Prérequis (poste de l'utilisateur, Windows 11)

- Minecraft: Java Edition 26.3 installé et lancé une fois ; compte Microsoft connecté dans Horizon.
- Horizon installé (`horizon-launcher` dans le PATH).
- Rust 1.95 ou plus récent, et `cargo install --locked --git https://github.com/horizon-rust/horizon cargo-horizon-mod`.
- Dépôt du jeu cloné **hors de OneDrive** (ex. `<dossier-des-projets>\pokemonde`).

## Installer (dépôt du jeu)

```powershell
cargo run -p generer-especes          # lit la PokéAPI une fois, écrit les 151 espèces dans le mod
cargo horizon-mod build               # construit le mod (dossier mod/)
cargo run -p lanceur -- --installer   # crée l'instance PokeMonde, copie le mod et le monde modèle,
                                      # enregistre le protocole pokemonde:// pour l'utilisateur
```

Désinstaller : `cargo run -p lanceur -- --desinstaller` (retire le protocole et l'instance).

## Scénarios de validation

| # | Action | Résultat attendu | Exigences |
|---|---|---|---|
| 1 | Sur le site (`npm run dev`), cliquer 5 fois en moins de 3 s sur « Mon Pokédex » | Cube animé, puis 3 choix | FR-001a, FR-001b |
| 2 | Même chose au clavier : Tab jusqu'au logo, 5 fois Entrée | Même résultat ; le focus va dans la boîte de dialogue ; Échap la ferme | FR-019 |
| 3 | Cliquer 2 fois sur le logo | Retour à l'accueil, rien d'autre | cas limite |
| 4 | Activer « réduire les animations » dans Windows, refaire 1 | Pas de rotation, simple apparition | FR-001b |
| 5 | Choisir « Normal », chronométrer | Jeu ouvert dans le monde, en survie, en moins de 30 s | SC-001 |
| 6 | Marcher 15 min dans tous les biomes | 0 mob d'origine ; bordure visible à environ 256 blocs du centre | SC-002, FR-003 |
| 7 | `/summon minecraft:zombie` et œuf d'apparition | Aucun zombie | FR-006 |
| 8 | Compter les 20 premiers Pokémon par biome | Au moins 80 % du type du biome | SC-004 |
| 9 | 20 Poké Balls sur un Pokémon au taux 255, puis 20 sur un au taux minimal | 20/20 ; environ 1/20 | FR-011 |
| 10 | Ouvrir le Pokédex en jeu, comparer 5 fiches au site | Nom, numéro, types identiques | SC-005 |
| 11 | Exporter une sacoche (Pikachu « Pika », Lucario), `/sacoche <code>` deux fois | 1 importé, 1 message « hors monde », pas de doublon au 2e import | FR-017, FR-018 |
| 12 | Modifier une lettre du code, `/sacoche` | Refusé, rien d'ajouté | SC-006 |
| 13 | Choisir « Difficile », attendre la nuit | Pokémon Spectre/Poison agressifs ; disparition au lever du jour | FR-008 |
| 14 | Supprimer le dossier `MondePokemon`, recliquer | Monde modèle recopié | cas limite |
| 15 | Désinstaller, recliquer sur un choix | Message « si rien ne s'est ouvert… » après 2 s | FR-023 |
| 16 | Ouvrir `pokemonde://jouer?difficulte=../../x` dans le navigateur | « Lien Monde Pokémon invalide », le jeu ne s'ouvre pas | contrat adresse |

## Portes de qualité du site (constitution)

```powershell
npm run lint; if ($?) { npm run build }
```

Puis Lighthouse en production : supérieur à 90 dans chaque catégorie (SC-007), vérification à 375 px
et en thème sombre.
