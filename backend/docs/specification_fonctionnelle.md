# Spécification fonctionnelle

## 1. Objet du document

Le présent document décrit les spécifications fonctionnelles de la solution de géolocalisation et de preuve terrain destinée au suivi des techniciens d'une entreprise de télécommunication.

Il précise le fonctionnement attendu de l'application mobile utilisée par les techniciens ainsi que du dashboard web utilisé par les administrateurs. Il sert de référence pour la conception, le développement, les tests et la validation de la solution.

## 2. Rappel du besoin

L'entreprise souhaite disposer d'un système fiable permettant de vérifier la présence effective des techniciens sur les sites d'intervention.

La solution doit permettre :

- au technicien de prendre une photo depuis une application mobile ;
- d'associer automatiquement à cette photo des données de géolocalisation ;
- d'envoyer la photo et les métadonnées vers un serveur central ;
- à l'administrateur de consulter, contrôler et exploiter ces informations depuis un dashboard web ;
- à l'administrateur de gérer les comptes techniciens.

## 3. Périmètre fonctionnel

La solution est composée de deux modules principaux :

- une application mobile pour les techniciens ;
- une application web pour les administrateurs.

Le périmètre fonctionnel couvre :

- l'authentification des utilisateurs ;
- la capture d'image depuis le mobile ;
- la collecte de la position GPS ;
- la transmission des données au serveur ;
- la consultation des soumissions par l'administrateur ;
- la gestion des techniciens ;
- l'historisation des actions et des preuves envoyées.

## 4. Profils utilisateurs

### 4.1 Technicien

Le technicien est un utilisateur terrain. Il utilise exclusivement l'application mobile pour :

- se connecter ;
- prendre une photo sur site ;
- envoyer une preuve géolocalisée ;
- consulter éventuellement son historique d'envois.

### 4.2 Administrateur

L'administrateur est un utilisateur de supervision. Il utilise le dashboard web pour :

- se connecter ;
- consulter les preuves envoyées ;
- rechercher et filtrer les soumissions ;
- visualiser les détails d'une soumission ;
- gérer les comptes techniciens ;
- suivre l'activité globale.

## 5. Vue d'ensemble du fonctionnement

Le scénario global attendu est le suivant :

1. Le technicien ouvre l'application mobile.
2. Il saisit ses identifiants pour se connecter.
3. L'application vérifie ses droits d'accès.
4. Le technicien accède à la caméra.
5. Il prend une photo sur le lieu d'intervention.
6. L'application récupère automatiquement la géolocalisation.
7. L'application associe la photo aux métadonnées requises.
8. Les données sont envoyées au serveur.
9. Le serveur enregistre la soumission.
10. L'administrateur consulte la soumission depuis le dashboard web.

## 6. Fonctionnalités détaillées

## 6.1 Authentification

### Description

Le système doit permettre aux utilisateurs autorisés de se connecter à l'application correspondant à leur profil.

### Règles fonctionnelles

- Le technicien se connecte à l'application mobile avec un identifiant et un mot de passe.
- L'administrateur se connecte au dashboard web avec un identifiant et un mot de passe.
- Un utilisateur inactif ou désactivé ne peut pas se connecter.
- En cas d'identifiants invalides, un message d'erreur explicite doit être affiché.
- Une session utilisateur doit être maintenue après connexion réussie.
- L'utilisateur doit pouvoir se déconnecter.

### Entrées

- identifiant ;
- mot de passe.

### Sorties

- accès à l'interface correspondant au profil ;
- message d'erreur en cas d'échec.

## 6.2 Capture de photo par le technicien

### Description

Le technicien doit pouvoir capturer une photo directement depuis l'application mobile afin de produire une preuve de présence sur site.

### Règles fonctionnelles

- La photo doit être prise depuis la caméra intégrée à l'application.
- Le système ne doit pas autoriser l'import d'une image depuis la galerie dans la version initiale, sauf décision contraire du projet.
- Après capture, l'utilisateur peut visualiser un aperçu avant validation.
- Le technicien peut reprendre la photo si le rendu ne convient pas.
- La soumission finale ne peut être envoyée qu'après validation explicite du technicien.

### Entrées

- commande de lancement caméra ;
- action de prise de photo ;
- validation ou reprise.

### Sorties

- image capturée prête à être envoyée ;
- message d'erreur si la caméra est indisponible.

## 6.3 Récupération de la géolocalisation

### Description

Au moment de la capture ou juste avant l'envoi, l'application doit récupérer automatiquement la position géographique du technicien.

### Règles fonctionnelles

- L'application demande l'autorisation d'accéder à la localisation si elle n'est pas encore accordée.
- La récupération de la position doit être automatique.
- La latitude et la longitude sont obligatoires pour valider la soumission.
- Si la position ne peut pas être obtenue, la soumission ne doit pas être envoyée.
- Un message doit informer le technicien en cas d'échec de récupération GPS.
- Si disponible, la précision GPS doit être enregistrée avec la soumission.

### Données collectées

- latitude ;
- longitude ;
- précision GPS ;
- date et heure de récupération.

## 6.4 Envoi d'une preuve terrain

### Description

Une preuve terrain correspond à l'envoi d'une photo accompagnée des informations nécessaires au contrôle de présence.

### Données minimales associées à une preuve

- identifiant unique de la soumission ;
- identifiant du technicien ;
- nom du technicien ;
- photo ;
- latitude ;
- longitude ;
- date et heure de prise ou d'envoi ;
- statut de la soumission ;
- date et heure de réception par le serveur.

### Règles fonctionnelles

- Une soumission ne peut être envoyée que si l'utilisateur est authentifié.
- Une soumission ne peut être envoyée que si la photo est présente.
- Une soumission ne peut être envoyée que si la géolocalisation est disponible.
- Après envoi réussi, le système doit afficher une confirmation au technicien.
- En cas d'échec d'envoi, le système doit afficher un message d'erreur.
- Chaque soumission doit être enregistrée dans l'historique.

### Statuts possibles

- en attente d'envoi ;
- envoyée ;
- reçue ;
- consultée ;
- rejetée si une règle métier future l'exige.

## 6.5 Historique des soumissions côté technicien

### Description

L'application mobile peut proposer un écran d'historique permettant au technicien de consulter ses envois précédents.

### Informations affichées

- miniature ou référence de la photo ;
- date et heure ;
- statut de l'envoi ;
- localisation simplifiée si nécessaire.

### Règles fonctionnelles

- Le technicien ne peut consulter que ses propres soumissions.
- Les soumissions doivent être présentées de la plus récente à la plus ancienne.

## 6.6 Consultation des soumissions côté administrateur

### Description

Le dashboard web doit permettre à l'administrateur de visualiser l'ensemble des preuves envoyées par les techniciens.

### Informations de la liste

- identifiant de la soumission ;
- nom du technicien ;
- date et heure ;
- statut ;
- aperçu de l'image ;
- position ou zone de localisation.

### Règles fonctionnelles

- Les soumissions doivent être affichées dans une liste paginée ou filtrable.
- L'administrateur doit pouvoir ouvrir le détail d'une soumission.
- Les données affichées doivent être à jour.

## 6.7 Détail d'une soumission

### Description

L'administrateur doit pouvoir consulter le détail complet d'une preuve terrain.

### Informations affichées

- photo en taille lisible ;
- nom et identifiant du technicien ;
- date et heure de la capture ;
- date et heure de réception ;
- latitude et longitude ;
- précision GPS si disponible ;
- position sur carte ;
- statut de la soumission.

### Actions possibles

- marquer comme consultée ;
- ajouter un commentaire dans une version ultérieure ;
- exporter ou partager dans une version ultérieure si besoin.

## 6.8 Recherche et filtres

### Description

Le dashboard doit proposer des outils de recherche afin de faciliter le contrôle opérationnel.

### Critères de recherche possibles

- par technicien ;
- par date ;
- par période ;
- par statut ;
- par zone géographique si disponible.

### Règles fonctionnelles

- Les filtres doivent pouvoir être combinés.
- Les résultats doivent s'actualiser sans rechargement complexe pour l'utilisateur.
- Un bouton de réinitialisation doit permettre de supprimer les filtres actifs.

## 6.9 Gestion des techniciens

### Description

L'administrateur doit pouvoir gérer le cycle de vie des comptes techniciens.

### Actions disponibles

- créer un technicien ;
- modifier les informations d'un technicien ;
- activer un compte ;
- désactiver un compte ;
- consulter la liste des techniciens ;
- consulter l'historique d'activité d'un technicien.

### Données d'un technicien

- identifiant interne ;
- nom ;
- prénom ;
- matricule ou code employé si applicable ;
- numéro de téléphone si applicable ;
- email si applicable ;
- statut du compte ;
- date de création.

### Règles fonctionnelles

- Seul l'administrateur a accès à cette fonctionnalité.
- Un technicien désactivé ne peut plus se connecter.
- Les modifications doivent être enregistrées avec traçabilité minimale.

## 6.10 Tableau de bord et statistiques

### Description

Le dashboard doit présenter une vue synthétique de l'activité.

### Indicateurs minimaux

- nombre total de soumissions ;
- nombre de soumissions du jour ;
- nombre de soumissions par technicien ;
- répartition des soumissions sur une période donnée.

### Objectif

Permettre à l'administrateur d'avoir une vue rapide de l'activité terrain et d'identifier les techniciens actifs ou inactifs.

## 7. Règles de gestion

- Une preuve terrain est liée à un seul technicien.
- Une preuve terrain est créée à partir d'une photo unique.
- Une preuve sans coordonnées GPS ne doit pas être validée.
- Une preuve sans utilisateur authentifié ne doit pas être enregistrée.
- Chaque preuve doit posséder un identifiant unique.
- Les données d'une preuve doivent être conservées dans l'historique.
- L'administrateur peut consulter toutes les preuves.
- Le technicien ne peut consulter que ses propres données.
- Le compte technicien doit être créé au préalable par l'administrateur.

## 8. Spécification des écrans

## 8.1 Application mobile

### Écran de connexion

Fonctions attendues :

- saisie de l'identifiant ;
- saisie du mot de passe ;
- bouton de connexion ;
- message d'erreur en cas d'échec.

### Écran d'accueil technicien

Fonctions attendues :

- accès rapide à la caméra ;
- accès à l'historique ;
- affichage du nom du technicien connecté ;
- bouton de déconnexion.

### Écran caméra

Fonctions attendues :

- aperçu caméra ;
- bouton de capture ;
- possibilité de reprendre la photo ;
- bouton de validation.

### Écran de confirmation d'envoi

Fonctions attendues :

- affichage du statut d'envoi ;
- message de succès ou d'échec ;
- possibilité de revenir à l'accueil.

### Écran historique

Fonctions attendues :

- liste des soumissions ;
- date et heure ;
- statut ;
- accès au détail simplifié si nécessaire.

## 8.2 Dashboard web administrateur

### Écran de connexion admin

Fonctions attendues :

- saisie des identifiants ;
- bouton de connexion ;
- message d'erreur en cas d'échec.

### Tableau de bord principal

Fonctions attendues :

- affichage des indicateurs clés ;
- accès aux soumissions récentes ;
- accès au menu de gestion.

### Écran liste des soumissions

Fonctions attendues :

- tableau des soumissions ;
- recherche ;
- filtres ;
- accès au détail.

### Écran détail d'une soumission

Fonctions attendues :

- photo ;
- informations du technicien ;
- coordonnées GPS ;
- carte ;
- statut.

### Écran gestion des techniciens

Fonctions attendues :

- liste des techniciens ;
- formulaire d'ajout ;
- formulaire de modification ;
- activation ou désactivation du compte.

## 9. Cas d'utilisation

## 9.1 Cas d'utilisation UC01

### Titre

Connexion du technicien

### Acteur principal

Technicien

### Précondition

Le technicien possède un compte actif.

### Scénario nominal

1. Le technicien ouvre l'application.
2. Il saisit ses identifiants.
3. Il valide la connexion.
4. Le système vérifie les informations.
5. Le système ouvre l'écran d'accueil.

### Postcondition

Le technicien est connecté.

## 9.2 Cas d'utilisation UC02

### Titre

Envoi d'une preuve terrain

### Acteur principal

Technicien

### Préconditions

- le technicien est connecté ;
- la caméra est accessible ;
- la localisation est activée.

### Scénario nominal

1. Le technicien ouvre la caméra.
2. Il prend une photo.
3. Il valide la photo.
4. Le système récupère la position GPS.
5. Le système prépare la soumission.
6. Le technicien lance l'envoi.
7. Le serveur enregistre les données.
8. Le système affiche une confirmation.

### Scénarios alternatifs

- Si la localisation est refusée, l'application affiche un message et bloque l'envoi.
- Si l'envoi échoue, l'application informe l'utilisateur.
- Si la caméra est inaccessible, l'application signale l'erreur.

### Postcondition

La preuve est enregistrée ou l'utilisateur est informé de l'échec.

## 9.3 Cas d'utilisation UC03

### Titre

Consultation des preuves par l'administrateur

### Acteur principal

Administrateur

### Précondition

L'administrateur est connecté.

### Scénario nominal

1. L'administrateur ouvre le dashboard.
2. Il accède à la liste des soumissions.
3. Il filtre les résultats si nécessaire.
4. Il ouvre une soumission.
5. Le système affiche le détail complet.

### Postcondition

L'administrateur a consulté une preuve terrain.

## 9.4 Cas d'utilisation UC04

### Titre

Gestion d'un compte technicien

### Acteur principal

Administrateur

### Scénario nominal

1. L'administrateur ouvre l'écran de gestion des techniciens.
2. Il ajoute ou modifie un compte.
3. Il valide l'opération.
4. Le système enregistre les changements.

### Postcondition

Le compte technicien est créé, mis à jour ou désactivé.

## 10. Gestion des erreurs et messages utilisateurs

Le système doit prévoir des messages clairs dans les cas suivants :

- identifiants incorrects ;
- absence de connexion internet ;
- refus d'accès à la caméra ;
- refus d'accès à la localisation ;
- échec d'envoi de la preuve ;
- erreur serveur ;
- compte utilisateur désactivé.

Les messages doivent être compréhensibles, concis et orientés action.

## 11. Exigences de traçabilité fonctionnelle

Le système doit conserver au minimum les traces suivantes :

- date de création d'une soumission ;
- identité du technicien ayant envoyé la preuve ;
- date de consultation par l'administrateur si cette fonctionnalité est activée ;
- opérations de création, modification et désactivation des comptes techniciens.

## 12. Critères de validation fonctionnelle

La solution sera considérée conforme sur le plan fonctionnel si :

- un technicien peut se connecter avec un compte valide ;
- un technicien peut prendre une photo depuis l'application ;
- la photo ne peut pas être envoyée sans géolocalisation ;
- une preuve complète est bien enregistrée côté serveur ;
- l'administrateur peut consulter la liste des preuves ;
- l'administrateur peut afficher le détail d'une preuve ;
- l'administrateur peut créer et gérer un compte technicien ;
- les historiques sont correctement conservés.

## 13. Hypothèses et limites de la première version

- La solution repose sur la disponibilité du GPS du terminal mobile.
- La solution repose sur une connexion internet pour l'envoi immédiat.
- Le mode hors ligne n'est pas inclus dans la première version, sauf décision contraire.
- L'analyse automatique de la véracité visuelle de la photo n'est pas prévue dans la première version.
- La comparaison automatique entre position attendue et position réelle est envisagée pour une évolution future.

## 14. Conclusion

Cette spécification fonctionnelle formalise le comportement attendu de la solution de suivi terrain. Elle constitue une base de référence pour le développement de l'application mobile technicien et du dashboard web administrateur, ainsi que pour la préparation des scénarios de test et de validation.
