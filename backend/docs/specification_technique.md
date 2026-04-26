# Spécification technique

## 1. Objet du document

Le présent document décrit l'architecture technique de la solution de géolocalisation et de preuve terrain destinée au suivi des techniciens d'une entreprise de télécommunication.

Il précise les technologies retenues, l'organisation des composants, les flux de données, les exigences d'intégration, les choix de sécurité, les structures de données principales ainsi que les principes de déploiement.

## 2. Contexte technique

La solution à mettre en place repose sur trois briques principales :

- un backend API développé avec Laravel ;
- une application web d'administration développée avec React ;
- une application mobile technicien prévue en React Native, avec une variante ou alternative native Android en Kotlin selon les besoins du projet.

L'objectif technique est de disposer d'un système centralisé, sécurisé, évolutif et maintenable, capable de recevoir des preuves terrain sous forme de photos géolocalisées, de les stocker, de les exposer au dashboard web et de garantir une bonne traçabilité des opérations.

## 3. Périmètre technique

Le périmètre couvre :

- la mise en place d'une API REST sécurisée ;
- la gestion des utilisateurs et des rôles ;
- la réception et le stockage des photos envoyées par les techniciens ;
- l'enregistrement des coordonnées GPS et métadonnées associées ;
- la consultation des données depuis une interface web ;
- l'authentification et l'autorisation ;
- la journalisation minimale des actions ;
- la préparation du déploiement des applications.

Le périmètre n'inclut pas dans la première version :

- la reconnaissance d'image ;
- la détection automatique de fraude par intelligence artificielle ;
- le mode offline complet avec synchronisation avancée ;
- l'intégration à des systèmes tiers métiers ;
- la gestion avancée des missions ou tickets.

## 4. Stack technologique retenue

### 4.1 Backend

- Framework : Laravel
- Langage : PHP
- Type d'API : REST JSON
- Authentification API : Laravel Sanctum ou JWT selon l'orientation finale du projet
- Stockage fichiers : disque local public, serveur de fichiers ou stockage objet compatible S3
- Base de données : MySQL ou PostgreSQL
- Tâches asynchrones : queues Laravel

### 4.2 Application web administrateur

- Framework : React
- Routage : React Router
- Appels API : Axios ou Fetch
- Gestion d'état : Context API, Redux Toolkit ou équivalent léger selon la complexité finale
- UI : bibliothèque de composants au choix de l'équipe
- Cartographie : Leaflet, Google Maps ou équivalent

### 4.3 Application mobile technicien

Deux approches sont envisagées :

- React Native pour une base multiplateforme ;
- Kotlin pour une application Android native.

Dans la pratique, deux options techniques sont possibles :

1. React Native comme application mobile principale, avec Kotlin utilisé uniquement pour les modules natifs Android si nécessaire.
2. React Native et Kotlin comme deux clients mobiles distincts consommant la même API backend.

Pour éviter une duplication importante des coûts de développement et de maintenance, la recommandation technique pour une première version est de privilégier React Native comme application principale, et de réserver Kotlin à des besoins Android spécifiques ou à une éventuelle version native future.

## 5. Architecture générale

### 5.1 Vue d'ensemble

L'architecture cible suit un modèle client-serveur :

- l'application mobile envoie les preuves terrain au backend ;
- le backend centralise l'authentification, les traitements, la persistance des données et l'accès aux fichiers ;
- l'application web consomme les API du backend pour l'administration et le suivi.

### 5.2 Composants

- Mobile App : capture photo, récupération GPS, envoi des preuves, historique utilisateur.
- Web Admin App : dashboard, consultation des soumissions, gestion des techniciens, statistiques.
- API Backend Laravel : authentification, règles métier, accès aux données, stockage, sécurité.
- Base de données : utilisateurs, rôles, soumissions, journaux.
- Stockage fichiers : images prises par les techniciens.

### 5.3 Flux principal

1. Le technicien s'authentifie via l'application mobile.
2. L'application mobile obtient un jeton d'accès.
3. Le technicien prend une photo depuis la caméra.
4. L'application récupère les coordonnées GPS.
5. L'application envoie au backend la photo et les métadonnées.
6. Le backend valide les données, stocke l'image, enregistre la soumission et retourne une réponse.
7. Le dashboard web interroge l'API pour afficher les soumissions.
8. L'administrateur consulte, filtre et gère les données.

## 6. Architecture logique

### 6.1 Architecture backend Laravel

Le backend Laravel sera structuré en couches claires :

- couche présentation : contrôleurs API ;
- couche métier : services applicatifs ;
- couche accès données : modèles Eloquent, repositories si nécessaire ;
- couche sécurité : authentification, policies, middleware ;
- couche infrastructure : stockage fichiers, logs, queues, notifications éventuelles.

### 6.2 Modules backend

- module d'authentification ;
- module de gestion des utilisateurs ;
- module de gestion des techniciens ;
- module de gestion des soumissions terrain ;
- module de gestion des fichiers et images ;
- module de statistiques ;
- module de journalisation.

### 6.3 Architecture frontend React

L'application web React pourra être organisée par domaines fonctionnels :

- `auth`
- `dashboard`
- `submissions`
- `technicians`
- `statistics`
- `shared`

Chaque domaine pourra contenir :

- pages ;
- composants ;
- services API ;
- hooks ;
- types ou interfaces ;
- tests.

### 6.4 Architecture mobile React Native

L'application mobile React Native pourra être structurée par modules :

- `auth`
- `camera`
- `location`
- `submission`
- `history`
- `profile`
- `shared`

Les responsabilités principales seront :

- gestion des permissions ;
- capture photo ;
- récupération des coordonnées ;
- compression ou optimisation de l'image avant envoi ;
- envoi multipart vers l'API ;
- affichage de l'état d'envoi.

### 6.5 Architecture mobile Kotlin

Si une application Kotlin native est développée, elle devra suivre une architecture Android moderne :

- présentation : Jetpack Compose ou XML selon le choix du projet ;
- logique : ViewModel ;
- données : Repository ;
- réseau : Retrofit ou Ktor ;
- injection de dépendances : Hilt ;
- persistance locale minimale : Room si nécessaire.

## 7. Exigences techniques fonctionnelles par composant

### 7.1 Backend Laravel

Le backend doit :

- exposer des endpoints REST sécurisés ;
- gérer l'authentification des administrateurs et techniciens ;
- valider toutes les données entrantes ;
- gérer l'upload des images ;
- stocker les métadonnées de localisation ;
- fournir des endpoints de consultation filtrable ;
- tracer les opérations sensibles ;
- gérer les accès selon les rôles.

### 7.2 Application web React

L'application web doit :

- permettre la connexion sécurisée des administrateurs ;
- afficher les soumissions sous forme de liste, détail et vue filtrée ;
- afficher les positions sur carte ;
- permettre la gestion CRUD logique des techniciens ;
- afficher des indicateurs synthétiques ;
- consommer les API du backend avec gestion propre des erreurs et sessions.

### 7.3 Application mobile

L'application mobile doit :

- permettre la connexion du technicien ;
- demander et vérifier les permissions caméra et localisation ;
- capturer la photo depuis l'application ;
- récupérer latitude, longitude, précision et horodatage ;
- envoyer les données avec la photo vers l'API ;
- informer l'utilisateur en cas de succès ou d'erreur ;
- limiter les actions non conformes, comme l'absence de GPS ou l'échec de capture.

## 8. API backend

### 8.1 Style d'API

Le backend exposera une API REST versionnée, par exemple :

- `/api/v1/auth/...`
- `/api/v1/admin/...`
- `/api/v1/mobile/...`

Le format d'échange sera JSON, sauf pour l'envoi de fichiers qui utilisera `multipart/form-data`.

### 8.2 Endpoints principaux

#### Authentification

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

#### Soumissions mobile

- `POST /api/v1/mobile/submissions`
- `GET /api/v1/mobile/submissions`
- `GET /api/v1/mobile/submissions/{id}`

#### Administration

- `GET /api/v1/admin/submissions`
- `GET /api/v1/admin/submissions/{id}`
- `PATCH /api/v1/admin/submissions/{id}/mark-viewed`
- `GET /api/v1/admin/technicians`
- `POST /api/v1/admin/technicians`
- `PUT /api/v1/admin/technicians/{id}`
- `PATCH /api/v1/admin/technicians/{id}/status`
- `GET /api/v1/admin/dashboard/stats`

### 8.3 Format d'une requête d'envoi de preuve

Contenu minimal attendu :

- image ;
- latitude ;
- longitude ;
- gps_accuracy ;
- captured_at ;
- device_platform ;
- device_model si jugé utile ;
- app_version.

### 8.4 Format d'une réponse de soumission

La réponse pourra contenir :

- identifiant de la soumission ;
- URL ou chemin d'accès de l'image ;
- statut ;
- dates d'enregistrement ;
- résumé de la position ;
- message de confirmation.

## 9. Modélisation des données

### 9.1 Entités principales

- `users`
- `roles`
- `technicians`
- `submissions`
- `submission_status_history`
- `audit_logs`

Selon la stratégie retenue, la table `technicians` peut être fusionnée avec `users` si le modèle utilisateur est unifié avec un champ de rôle.

### 9.2 Table `users`

Champs recommandés :

- `id`
- `name`
- `email`
- `phone`
- `password`
- `role`
- `is_active`
- `last_login_at`
- `created_at`
- `updated_at`

### 9.3 Table `submissions`

Champs recommandés :

- `id`
- `user_id`
- `photo_path`
- `photo_name`
- `latitude`
- `longitude`
- `gps_accuracy`
- `captured_at`
- `received_at`
- `status`
- `address_label`
- `device_platform`
- `device_model`
- `app_version`
- `created_at`
- `updated_at`

### 9.4 Table `audit_logs`

Champs recommandés :

- `id`
- `user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`

## 10. Stockage des images

Les images envoyées par les techniciens devront être stockées de manière organisée et sécurisée.

Principes recommandés :

- stockage hors du code source ;
- nommage unique des fichiers ;
- arborescence par date ou par utilisateur ;
- limitation de taille des fichiers ;
- vérification du type MIME ;
- génération d'URL sécurisées ou contrôlées.

Exemple d'organisation :

- `storage/app/submissions/YYYY/MM/DD/...`

Si un stockage objet est retenu, il sera préférable de stocker uniquement le chemin ou la clé du fichier dans la base de données.

## 11. Sécurité

### 11.1 Authentification

Le système devra supporter :

- authentification par email ou identifiant + mot de passe ;
- génération de jeton sécurisé ;
- expiration ou révocation des sessions ;
- déconnexion côté mobile et web.

### 11.2 Autorisation

Le contrôle d'accès devra être basé sur les rôles :

- `admin`
- `technician`

Les routes devront être protégées par middleware et éventuellement policies Laravel.

### 11.3 Sécurité des données

- utilisation obligatoire de HTTPS ;
- hashage des mots de passe avec les mécanismes standard de Laravel ;
- validation serveur stricte des données ;
- limitation de fréquence sur les endpoints sensibles ;
- contrôle du type et de la taille des images ;
- protection contre les accès non autorisés aux photos.

### 11.4 Traçabilité

Les événements suivants devront être journalisés :

- connexion ;
- déconnexion ;
- création de compte technicien ;
- modification d'un compte ;
- activation ou désactivation ;
- création d'une soumission ;
- consultation ou changement de statut si mis en œuvre.

## 12. Validation et règles métier techniques

### 12.1 Validation de soumission

Une soumission est considérée techniquement valide si :

- l'utilisateur est authentifié ;
- l'image est présente ;
- les coordonnées GPS sont présentes ;
- les coordonnées sont dans un format valide ;
- le fichier image respecte le format autorisé ;
- le compte utilisateur est actif.

### 12.2 Formats autorisés

- images : JPEG, JPG, PNG si nécessaire ;
- taille image maximale : à définir, par exemple 5 Mo ou 10 Mo ;
- précision GPS : numérique ;
- latitude : nombre décimal compris entre -90 et 90 ;
- longitude : nombre décimal compris entre -180 et 180.

## 13. Performance et scalabilité

### 13.1 Objectifs

- temps de réponse API acceptable pour les opérations courantes ;
- upload fiable des images dans des conditions réseau raisonnables ;
- pagination des listes administrateur ;
- optimisation des requêtes sur les filtres fréquents.

### 13.2 Mesures recommandées

- indexation des colonnes de recherche ;
- mise en cache des statistiques si besoin ;
- usage de files d'attente pour certains traitements secondaires ;
- compression d'image côté mobile avant envoi si nécessaire ;
- limitation du poids des réponses API.

## 14. Compatibilité et contraintes plateformes

### 14.1 Web

- navigateurs modernes : Chrome, Edge, Firefox ;
- interface responsive pour desktop et tablette.

### 14.2 Mobile

- Android en priorité ;
- iOS selon la stratégie réelle du projet si React Native est retenu comme client principal ;
- support des permissions caméra et localisation ;
- comportement robuste en cas de connectivité instable.

### 14.3 Backend

- hébergement sur serveur compatible PHP et Laravel ;
- base de données relationnelle supportée ;
- espace disque suffisant pour les photos.

## 15. Déploiement

### 15.1 Environnements

Les environnements recommandés sont :

- développement ;
- test ou staging ;
- production.

### 15.2 Déploiement backend

Le backend devra prévoir :

- fichier `.env` par environnement ;
- configuration base de données ;
- configuration stockage fichiers ;
- configuration CORS ;
- configuration files d'attente ;
- supervision des logs.

### 15.3 Déploiement web

L'application React sera buildée pour la production puis servie :

- soit par un serveur web classique ;
- soit via un hébergement statique avec proxy API ;
- soit intégrée au domaine principal du backend.

### 15.4 Déploiement mobile

- React Native : génération d'APK ou AAB Android, et éventuellement build iOS ;
- Kotlin : build Android natif ;
- configuration des URLs d'API selon l'environnement ;
- signature des builds de production.

## 16. Tests techniques

### 16.1 Backend

- tests unitaires des services métier ;
- tests fonctionnels API ;
- tests de validation des uploads ;
- tests d'autorisation ;
- tests des filtres et pagination.

### 16.2 Frontend web

- tests unitaires des composants critiques ;
- tests d'intégration des écrans principaux ;
- tests de navigation ;
- tests de consommation API simulée.

### 16.3 Mobile

- tests unitaires sur la logique critique ;
- tests des permissions ;
- tests d'envoi de soumission ;
- tests de gestion d'erreur réseau ;
- tests sur terminaux réels si possible.

## 17. Observabilité et maintenance

Le système devra faciliter la maintenance grâce à :

- des logs applicatifs lisibles ;
- une structuration claire du code ;
- des messages d'erreur exploitables ;
- des conventions de nommage homogènes ;
- une documentation minimale d'installation et d'exploitation.

## 18. Risques techniques identifiés

- imprécision GPS sur certains terminaux ou environnements ;
- échec d'upload en faible connectivité ;
- augmentation rapide du volume de stockage des photos ;
- divergence technique si deux applications mobiles distinctes sont maintenues en parallèle ;
- complexité de maintenance accrue si les choix d'architecture ne sont pas harmonisés.

## 19. Recommandations techniques

- centraliser toute la logique métier dans le backend Laravel ;
- exposer une API unique consommée par le web et le mobile ;
- commencer avec un modèle de rôles simple `admin` et `technician` ;
- normaliser les formats de date, heure et coordonnées ;
- privilégier React Native comme socle mobile initial pour réduire les coûts ;
- utiliser Kotlin en complément natif Android si des besoins spécifiques apparaissent ;
- prévoir dès le départ des journaux d'audit et une stratégie claire de stockage des images.

## 20. Conclusion

Cette spécification technique définit les fondations de la solution à développer. Elle fournit une base claire pour organiser le backend Laravel, le dashboard React et la ou les applications mobiles. Elle permet également d'anticiper les besoins de sécurité, de performance, de stockage et de maintenabilité indispensables à un projet de suivi terrain fiable.
