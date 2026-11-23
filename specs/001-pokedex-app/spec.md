# Feature Specification: Application Pokédex

**Feature Branch**: `001-pokedex-app`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Application web Pokédex moderne (1 025 Pokémon, PokéAPI) construite en
suivant le cours « Pokédex — 35 heures » (chapitres 0 à 11, étapes TP 0 à 18) et sa grille
d'évaluation sur 20 : liste paginée avec illustration/numéro/types, fiche détaillée (statistiques,
évolutions), recherche et filtre par type dans l'adresse, favoris et sacoche (6 max, sans doublon,
surnom, persistance), états de chargement/erreur/404, bouton « Au hasard », raccourci « / », thème
sombre, responsive 375 px, accessibilité, déploiement en ligne. Design moderne inspiré de Dribbble.
Documentation des choix par chapitre."

> Cadre : la constitution du projet (`.specify/memory/constitution.md`) s'applique intégralement.
> Le cours fait loi ; chaque story cite les chapitres et étapes TP qu'elle couvre, et le barème
> de la grille d'évaluation qu'elle sert.

## Clarifications

### Session 2026-11-23

- Q: Une fois les noms affichés en français, la recherche doit-elle aussi trouver un Pokémon par
  son nom anglais ? → A: Non, nom français uniquement.
- Q: Selon quelles règles le combat simulé désigne-t-il le vainqueur ? → A: Statistiques de base
  + avantage de type (multiplicateur de la table des types), détail du calcul affiché.
- Q: Dans le quiz des silhouettes, comment le joueur donne-t-il sa réponse ? → A: Saisie libre
  du nom français ; accents et majuscules ignorés.
- Q: Comment le défilement infini doit-il cohabiter avec la pagination exigée par le cours ?
  → A: Pas de défilement infini : une vraie pagination classique (bonus retiré, FR-037).
- Q: Comment le visiteur choisit-il les deux Pokémon à comparer, et la comparaison doit-elle
  pouvoir se partager par lien ? → A: Bouton « Comparer » sur la fiche, second Pokémon choisi par
  recherche ; les deux noms sont dans l'adresse (lien partageable).
- Planification (2026-11-23) : le combat oppose deux sacoches (texte du cours) et non deux
  Pokémon ; la règle de duel (stats + avantage de type) s'applique à chaque duel (FR-039).
- Analyse (2026-11-23) : dans quel ordre s'affichent les résultats, avec ou sans recherche ?
  → A: Toujours par numéro, comme un Pokédex (ordre du cours) ; le tri par nom n'existe que via
  le bonus de tri (FR-036). Les membres de la sacoche ne stockent pas le nom français : il se
  déduit du numéro.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parcourir le Pokédex (Priority: P1)

Un visiteur ouvre le site et voit une grille de cartes Pokémon : chaque carte montre
l'illustration officielle, le numéro au format « #007 », le nom et le ou les types sous forme de
badges colorés, dans l'ordre des numéros. (Le passage de page en page arrive avec la story 3,
comme dans le cours, étape 14.)

**Why this priority**: c'est le cœur du Pokédex et le premier critère de la grille (3 pts). Sans
lui, aucune autre fonctionnalité n'a de support.

**Couvre** : ch. 0–7, étapes TP 0 à 10.

**Independent Test**: ouvrir la page d'accueil, vérifier 24 cartes complètes (n° 1 à 24),
réduire à 375 px, ralentir le réseau.

**Acceptance Scenarios**:

1. **Given** la page d'accueil, **When** elle s'affiche, **Then** 24 cartes apparaissent (n° 1 à
   24, dans l'ordre), chacune avec illustration, numéro sur 3 chiffres précédé de « # », nom et
   badges de type colorés.
2. **Given** un écran de 375 px de large, **When** la grille s'affiche, **Then** elle tient sur
   2 colonnes sans défilement horizontal ; sur grand écran elle va jusqu'à 6 colonnes.
3. **Given** un chargement lent, **When** la page s'ouvre, **Then** des cartes squelettes
   s'affichent immédiatement à la place des cartes en attente.

---

### User Story 2 - Consulter la fiche d'un Pokémon (Priority: P2)

Depuis une carte, le visiteur ouvre la fiche détaillée : grande illustration, numéro, types,
taille, poids, statistiques de base sous forme de barres et chaîne d'évolution cliquable.

**Why this priority**: deuxième critère de la grille (3 pts) ; donne de la profondeur au parcours.

**Couvre** : ch. 8, étapes TP 11 et 12.

**Independent Test**: ouvrir l'adresse de la fiche d'un Pokémon connu (ex. « pikachu ») et d'un
nom inexistant.

**Acceptance Scenarios**:

1. **Given** la grille, **When** le visiteur clique sur une carte, **Then** la fiche s'ouvre sans
   rechargement complet de la page et l'onglet affiche « <Nom> · Pokédex ».
2. **Given** la fiche d'Évoli, **When** elle s'affiche, **Then** toutes ses évolutions (branches
   comprises) apparaissent et chacune mène à sa propre fiche.
3. **Given** une adresse de fiche avec un nom inconnu, **When** elle est ouverte, **Then** une page
   « introuvable » soignée s'affiche avec un lien de retour au Pokédex.
4. **Given** la source de données en panne, **When** une fiche est ouverte, **Then** un message
   d'erreur s'affiche avec un bouton « Réessayer » (distinct de la page « introuvable »).

---

### User Story 3 - Chercher et filtrer (Priority: P3)

Le visiteur tape un nom dans la barre de recherche ou choisit un type ; la grille se met à jour.
La recherche, le type et la page sont inscrits dans l'adresse : on peut partager le lien ou
utiliser « Précédent ».

**Why this priority**: troisième critère de la grille (3 pts).

**Couvre** : ch. 9 (recherche, filtres, pagination), étapes TP 13 et 14.

**Independent Test**: chercher « pi », filtrer « électrik », copier l'adresse dans un nouvel
onglet : le même résultat doit s'afficher.

**Acceptance Scenarios**:

1. **Given** la page d'accueil, **When** le visiteur tape « PIKA », **Then** après une courte pause
   de frappe les résultats contenant « pika » (sans tenir compte de la casse) s'affichent dans
   l'ordre des numéros, et la pagination repart à la page 1.
2. **Given** un filtre par type et une recherche actifs, **When** le visiteur copie l'adresse dans
   un nouvel onglet, **Then** exactement les mêmes résultats s'affichent.
3. **Given** une adresse contenant un type inexistant ou une page hors bornes, **When** elle est
   ouverte, **Then** l'application ignore ou corrige la valeur invalide sans planter.
4. **Given** une recherche sans résultat, **When** elle s'affiche, **Then** un message explicite
   remplace la grille vide.
5. **Given** la page 1, **When** le visiteur va à la page suivante, **Then** les Pokémon 25 à 48
   s'affichent et l'adresse contient `page=2` ; « Précédent » est inactif en page 1 et
   « Suivant » en dernière page.

---

### User Story 4 - Garder ses favoris (Priority: P4)

Le visiteur marque des Pokémon en favoris (☆ / ★) depuis la grille ou la fiche. L'en-tête
affiche le nombre de favoris, une page « Favoris » les liste, et ils sont conservés après
fermeture du navigateur.

**Why this priority**: partie du critère « Favoris et sacoche » (4 pts au total).

**Couvre** : ch. 9 (store, sélecteur, hydratation, page Favoris), étape TP 15.

**Independent Test**: ajouter 3 favoris, recharger la page, fermer puis rouvrir le navigateur.

**Acceptance Scenarios**:

1. **Given** une carte, **When** le visiteur clique sur l'étoile, **Then** elle devient pleine,
   le compteur de l'en-tête augmente, et il reste sur la page (le clic n'ouvre pas la fiche).
2. **Given** 3 favoris, **When** le visiteur recharge ou rouvre le site, **Then** les 3 favoris
   sont toujours là, sans clignotement ni incohérence à l'affichage.
3. **Given** aucun favori, **When** il ouvre la page Favoris, **Then** un message l'invite à en
   ajouter depuis le Pokédex.

---

### User Story 5 - Composer sa sacoche d'équipe (Priority: P5)

Le visiteur compose une équipe (la « sacoche ») de 6 Pokémon au plus, sans doublon, avec un
surnom facultatif pour chacun. La page Sacoche montre les membres et les emplacements libres ;
l'en-tête indique le remplissage ; il peut retirer un membre ou vider la sacoche après
confirmation.

**Why this priority**: complète le critère « Favoris et sacoche » (4 pts) ; règles métier
évaluées.

**Couvre** : ch. 9 (sacoche), étape TP 16.

**Independent Test**: ajouter 6 Pokémon, tenter un 7ᵉ et un doublon, donner un surnom, recharger,
vider.

**Acceptance Scenarios**:

1. **Given** une sacoche de 6 membres, **When** le visiteur tente d'en ajouter un 7ᵉ, **Then**
   l'ajout est refusé et un message explique que la sacoche est pleine.
2. **Given** Pikachu dans la sacoche, **When** il tente de l'ajouter à nouveau, **Then** l'ajout est
   refusé (pas de doublon), quel que soit l'endroit d'où vient la tentative.
3. **Given** un membre, **When** le visiteur lui donne le surnom « Pika », **Then** le surnom
   s'affiche et persiste après rechargement.
4. **Given** une sacoche de 4 membres, **When** la page Sacoche s'affiche, **Then** 4 membres et
   2 emplacements vides sont visibles, et l'en-tête indique 4/6.
5. **Given** une sacoche non vide, **When** il choisit « Vider », **Then** une confirmation est
   demandée ; la sacoche n'est vidée qu'après validation.

---

### User Story 6 - Navigation et finitions (Priority: P6)

Le visiteur dispose d'une coque d'application cohérente : en-tête avec navigation (Pokédex,
Favoris, Sacoche) où la page courante est mise en évidence, bouton « Au hasard » qui ouvre la
fiche d'un Pokémon tiré au sort, pied de page, thème sombre, interface utilisable entièrement
au clavier.

**Why this priority**: sert le critère « Qualité de l'interface » (2 pts) et les étapes 7, 17, 18.

**Couvre** : ch. 10, 11 ; étapes TP 17 et 18 (la coque de l'étape 7 et le thème sont posés dans
le socle).

**Independent Test**: naviguer dans tout le site au clavier seul, cliquer 3 fois sur « Au hasard »,
basculer en thème sombre.

**Acceptance Scenarios**:

1. **Given** n'importe quelle page, **When** le visiteur clique sur « Au hasard », **Then** la fiche
   d'un Pokémon tiré parmi les 1 025 s'ouvre (un tirage différent à chaque clic, en général).
2. **Given** la navigation au clavier seul, **When** il parcourt le site, **Then** chaque élément
   interactif est atteignable et son focus est visible.
3. **Given** le thème sombre actif, **When** une page s'affiche, **Then** tous les textes et
   badges restent lisibles (contraste suffisant).
4. **Given** un utilisateur qui a demandé à réduire les animations, **When** il navigue, **Then**
   aucune animation de déplacement n'est jouée.
5. **Given** n'importe quelle page, focus hors d'un champ de saisie, **When** le visiteur appuie
   sur « / », **Then** le focus va dans la barre de recherche ; s'il écrit déjà dans un champ, la
   touche « / » s'écrit normalement.

---

### User Story 7 - Publier et justifier (Priority: P7)

Le projet est accessible en ligne via une adresse publique et chaque choix frontend est
documenté par chapitre du cours, pour l'évaluation.

**Why this priority**: critère « Application déployée » (1 pt) et préparation des questions
ouvertes de l'évaluation finale.

**Couvre** : ch. 11, étape TP 18 ; principe III de la constitution.

**Independent Test**: ouvrir l'adresse publique sur un téléphone ; ouvrir la documentation et
retrouver la justification d'un choix quelconque.

**Acceptance Scenarios**:

1. **Given** l'adresse publique, **When** elle est ouverte sur mobile, **Then** toutes les stories
   1 à 6 fonctionnent, y compris favoris et sacoche persistants.
2. **Given** la documentation, **When** on cherche la justification d'un choix (ex. stockage des
   favoris), **Then** on la trouve dans le document du chapitre correspondant, avec le point du
   cours appliqué et les alternatives écartées.

---

### User Story 8 - Bonus « Pour aller plus loin » (Priority: P8)

Le visiteur voit les noms en français, trie la grille, compare deux
Pokémon, joue au quiz des silhouettes, simule un combat, voit les types couverts par sa sacoche,
y ajoute rapidement des Pokémon et la réordonne par glisser-déposer.

**Why this priority**: non noté par la grille ; valorise le projet une fois le barème sécurisé.
Chaque bonus est une tranche indépendante, livrable séparément.

**Couvre** : ch. 11 « Pour aller plus loin », bonus de l'étape TP 16.

**Independent Test**: chaque bonus se teste seul ; les tests des stories 1 à 7 doivent toujours
passer après son ajout.

**Acceptance Scenarios**:

1. **Given** la grille, **When** elle s'affiche, **Then** les noms sont en français et chercher
   « bulbi » trouve Bulbizarre.
2. **Given** un tri par nom puis la 3ᵉ page ouverte via la pagination, **When** l'adresse est
   copiée dans un nouvel onglet, **Then** le même tri et la même page sont restitués.
3. **Given** la fiche de Pikachu, **When** le visiteur clique « Comparer » puis choisit Raichu,
   **Then** leurs 6 statistiques sont alignées côte à côte, la meilleure valeur de chaque ligne
   est mise en évidence, et l'adresse copiée dans un nouvel onglet affiche la même comparaison.
4. **Given** le quiz sur Salamèche, **When** le visiteur tape « SALAMECHE », **Then** la réponse
   est jugée juste et le Pokémon est révélé ; une autre réponse est jugée fausse et le révèle
   aussi.
5. **Given** une sacoche de 3 membres, **When** le visiteur déplace le 3ᵉ en tête (souris ou
   clavier), **Then** le nouvel ordre s'affiche et persiste après rechargement.

---

### Edge Cases

- La source de données limite les requêtes (trop d'appels) ou est indisponible : message
  d'erreur avec « Réessayer », jamais d'écran blanc.
- Pokémon sans illustration officielle : une image de repli s'affiche, la carte reste alignée.
- Pokémon à un seul type ou à deux types : badges corrects dans les deux cas.
- Chaîne d'évolution ramifiée (Évoli) ou absente (Pokémon sans évolution) : affichage adapté.
- Adresse avec paramètres invalides (`page=-3`, `page=999`, `type=inconnu`) : valeurs corrigées
  ou ignorées.
- Stockage du navigateur indisponible ou effacé : favoris et sacoche repartent vides sans erreur.
- Surnom vide ou très long : vide = pas de surnom ; longueur bornée.
- Dernière page partielle : moins de 24 cartes, sans emplacement fantôme.

## Requirements *(mandatory)*

### Functional Requirements

**Liste et cartes**

- **FR-001**: Le système DOIT afficher les 1 025 Pokémon par pages de 24 cartes.
- **FR-002**: Chaque carte DOIT montrer l'illustration officielle, le numéro formaté « #NNN », le
  nom et un badge coloré par type ; la couleur dominante de la carte DOIT refléter le type
  principal.
- **FR-003**: La grille DOIT s'adapter de 2 colonnes (375 px) à 6 colonnes (grand écran).
- **FR-004**: Une liste vide DOIT afficher un message explicite.

**Fiche détaillée**

- **FR-005**: Le système DOIT afficher pour chaque Pokémon : illustration, numéro, nom, types,
  taille, poids, statistiques de base en barres proportionnelles, chaîne d'évolution complète
  dont chaque étape mène à sa fiche.
- **FR-006**: Chaque fiche DOIT avoir un titre d'onglet et une description propres.
- **FR-007**: Les fiches des 151 premiers Pokémon DOIVENT être prêtes à l'avance (ouverture
  instantanée).

**Recherche, filtre, pagination**

- **FR-008**: La recherche DOIT porter sur les 1 025 noms, sans tenir compte de la casse, avec des
  résultats dans l'ordre des numéros (ordre du Pokédex), et se déclencher après une pause de
  frappe d'environ 300 ms.
- **FR-009**: Le filtre par type DOIT être combinable avec la recherche.
- **FR-010**: Recherche, type et page DOIVENT être inscrits dans l'adresse ; une adresse partagée
  ou un retour « Précédent » DOIT restituer exactement le même état.
- **FR-011**: Toute valeur d'adresse invalide DOIT être corrigée ou ignorée.
- **FR-012**: Une nouvelle recherche DOIT ramener à la page 1.

**Favoris**

- **FR-013**: Le visiteur DOIT pouvoir ajouter et retirer un favori depuis la grille et la fiche,
  sans quitter la page en cours.
- **FR-014**: Les favoris DOIVENT persister entre les visites sur le même navigateur.
- **FR-015**: L'en-tête DOIT afficher le nombre de favoris ; une page Favoris DOIT les lister.

**Sacoche**

- **FR-016**: La sacoche DOIT contenir au plus 6 Pokémon, sans doublon ; ces règles DOIVENT être
  garanties quel que soit le point d'entrée de l'ajout.
- **FR-017**: Chaque membre PEUT recevoir un surnom facultatif, modifiable.
- **FR-018**: La page Sacoche DOIT afficher les membres et les emplacements libres ; l'en-tête
  DOIT indiquer le remplissage (ex. 4/6).
- **FR-019**: Le visiteur DOIT pouvoir retirer un membre et vider la sacoche après confirmation.
- **FR-020**: La sacoche DOIT persister entre les visites sur le même navigateur.

**Navigation et finitions**

- **FR-021**: L'en-tête DOIT proposer Pokédex, Favoris, Sacoche et « Au hasard », et mettre en
  évidence la page courante ; la navigation interne DOIT se faire sans rechargement complet.
- **FR-022**: La touche « / » DOIT placer le focus dans la recherche, sauf si l'utilisateur écrit
  déjà dans un champ de saisie (la touche s'écrit alors normalement).
- **FR-023**: L'application DOIT s'ouvrir en thème clair par défaut et proposer un bouton de
  bascule vers un thème sombre lisible ; le choix DOIT être mémorisé entre les visites et ne
  provoquer aucun flash du mauvais thème au chargement.
- **FR-024**: L'application DOIT être entièrement utilisable au clavier, avec focus visible,
  textes alternatifs, un seul titre principal par page et une hiérarchie de titres ordonnée.
- **FR-025**: Les animations DOIVENT durer moins d'une demi-seconde et être supprimées pour les
  utilisateurs qui demandent moins d'animations.

**États de chargement et d'erreur**

- **FR-026**: Tout contenu en attente DOIT afficher un squelette ou un indicateur de chargement.
- **FR-027**: Toute panne de la source de données DOIT afficher un message avec « Réessayer ».
- **FR-028**: Tout Pokémon ou page inexistant DOIT afficher une page « introuvable » soignée.
- **FR-029**: L'affichage initial des données persistantes (favoris, sacoche) NE DOIT produire
  aucune incohérence ni erreur visible.

**Interface, langue et documentation**

- **FR-030**: L'interface DOIT être en français.
- **FR-031**: Le design DOIT suivre les quatre principes du cours (hiérarchie, espace, couleur
  porteuse d'information, cohérence) et une direction artistique validée par l'utilisateur.
- **FR-032**: Chaque choix frontend DOIT être documenté par chapitre du cours (constitution,
  principe III).

**Périmètre bonus** (story 8 ; réalisé seulement après les stories 1 à 7, sans jamais enfreindre
une exigence ci-dessus)

- **FR-033**: Les noms des Pokémon DOIVENT s'afficher en français (ex. « Bulbizarre ») partout ;
  la recherche DOIT alors porter sur le nom français uniquement (le nom anglais ne donne pas de
  résultat).
- **FR-034**: La sacoche DOIT afficher les types couverts par l'équipe et permettre un ajout rapide
  depuis la grille, en respectant FR-016.
- **FR-035**: La fiche d'un Pokémon DOIT proposer un bouton « Comparer » qui ouvre le
  comparateur avec ce Pokémon et un champ de recherche pour choisir le second. Le comparateur
  DOIT afficher côte à côte leurs 6 statistiques en mettant en évidence la meilleure valeur de
  chaque ligne. Les deux Pokémon DOIVENT être inscrits dans l'adresse : un lien partagé ou un
  retour « Précédent » restitue la même comparaison ; un nom inconnu ou manquant dans l'adresse
  DOIT être signalé sans planter (FR-011).
- **FR-036**: La grille DOIT pouvoir être triée (au minimum par numéro et par nom) ; le tri DOIT
  être inscrit dans l'adresse comme les autres paramètres (FR-010).
- **FR-037**: Pagination classique (le bonus « défilement infini » a été écarté le 2026-11-23).
  La grille DOIT utiliser exclusivement une pagination : liens précédent / suivant, « Page X sur
  Y » (cours), 24 Pokémon par page, page inscrite dans l'adresse (FR-001, FR-010). Ajout au
  cours : liens vers les numéros de page, page courante indiquée.
- **FR-038**: Un quiz DOIT montrer la silhouette d'un Pokémon tiré au sort et accepter une
  réponse en saisie libre (nom français) ; la comparaison DOIT ignorer accents, majuscules et
  espaces en début/fin (« salameche » = « Salamèche »). Le quiz révèle ensuite le Pokémon et
  indique si la réponse est juste ; une réponse vide n'est pas acceptée.
- **FR-039**: Un combat simulé DOIT opposer **la sacoche du visiteur à une sacoche adverse**
  (conforme au cours : « entre deux sacoches »). Les membres s'affrontent en duels 1 contre 1
  dans l'ordre de la sacoche ; chaque duel désigne un vainqueur de façon déterministe (même duel
  = même résultat) à partir des statistiques de base pondérées par l'avantage de type
  (multiplicateurs de la table des types : ×0, ×0,5, ×1, ×2, cumulés sur deux types). La sacoche
  qui gagne le plus de duels l'emporte ; à égalité, match nul. Le détail de chaque duel (scores,
  multiplicateurs) DOIT être affiché. Le combat exige au moins 1 membre dans la sacoche du
  visiteur ; la sacoche adverse a le même nombre de membres.
- **FR-040**: Les membres de la sacoche DOIVENT pouvoir être réordonnés par glisser-déposer, avec
  une alternative au clavier ; l'ordre DOIT persister.

### Key Entities

- **Pokémon** : numéro (1–1 025), nom, illustration, types (1 ou 2), taille, poids, statistiques
  de base (6 valeurs), lien vers son espèce et sa chaîne d'évolution.
- **Type** : nom (18 types), couleur associée ; sert de filtre.
- **Chaîne d'évolution** : arbre de Pokémon (une étape peut avoir plusieurs évolutions).
- **Favori** : référence à un Pokémon ; ensemble sans doublon, propre au navigateur.
- **Membre de sacoche** : sous-ensemble des informations d'un Pokémon (numéro, nom,
  illustration, types) + surnom facultatif ; la sacoche en compte 0 à 6, sans doublon.
- **État de navigation** : recherche, type, page — porté par l'adresse.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les 8 critères de la grille d'évaluation du cours sont tous remplis (20/20 visés),
  vérifiés point par point avant la remise.
- **SC-002**: Un visiteur trouve la fiche d'un Pokémon dont il connaît le nom en moins de
  10 secondes depuis l'accueil.
- **SC-003**: Le premier contenu utile (squelettes ou cartes) apparaît en moins de 1 seconde ; les
  fiches des 151 premiers Pokémon s'ouvrent sans attente perceptible.
- **SC-004**: Le score d'audit qualité du navigateur (performance, accessibilité, bonnes
  pratiques, référencement) dépasse 90 dans chaque catégorie sur la version en ligne (adresse
  publique), et pas seulement en local.
- **SC-005**: 100 % des parcours des stories 1 à 6 sont réalisables au clavier seul.
- **SC-006**: Aucun défilement horizontal ni texte tronqué illisible à 375 px de large.
- **SC-007**: Zéro erreur affichée dans la console au chargement des pages, y compris avec
  favoris et sacoche remplis.
- **SC-008**: Pour 100 % des choix frontend, une justification liée à un chapitre du cours existe
  dans la documentation.

## Assumptions

- Les données proviennent de la PokéAPI publique, gratuite et sans authentification ; elle peut
  limiter le nombre de requêtes, d'où la mise en cache imposée par le cours.
- L'interface est en français. Tant que le bonus FR-033 n'est pas livré, les noms s'affichent
  tels que fournis par la source (en anglais) ; ensuite affichage et recherche passent
  entièrement au nom français.
- Ordre de réalisation : stories 1 à 7 (barème, 20/20) avant toute story 8 (bonus).
- Pas de compte utilisateur : favoris et sacoche sont propres à un navigateur.
- 24 Pokémon par page et 151 fiches préparées à l'avance, comme dans le cours.
- La direction artistique (palette, typographie, mise en page, micro-interactions) sera arrêtée
  avec l'utilisateur en phase C (tâche T012, avant tout travail visuel), à l'aide des skills impeccable et taste-skill et
  de références type Dribbble (constitution, principes IV et V).
- La pile technique, l'architecture et l'hébergement sont fixés par le cours et la constitution ;
  ils ne figurent pas dans cette spécification.
