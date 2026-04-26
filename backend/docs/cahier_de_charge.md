# Cahier des charges

## 1. Intitulé du projet

Conception et développement d'une solution de géolocalisation et de preuve terrain pour le suivi des techniciens d'une entreprise de télécommunication.

## 2. Contexte

L'entreprise souhaite améliorer le contrôle et le suivi des techniciens intervenant sur le terrain. Le problème principal constaté est que certains techniciens déclarent être présents sur un site alors qu'ils n'y sont pas réellement.

Une première approche avait été mise en place, consistant à demander au technicien d'envoyer une photo du site comme preuve de présence. Cette solution s'est révélée insuffisante, car une photo seule ne garantit ni l'authenticité de la présence sur le lieu, ni la fiabilité des informations transmises.

Dans ce contexte, l'entreprise souhaite mettre en place une solution numérique plus fiable permettant :

- de capturer une photo directement depuis une application mobile dédiée ;
- d'associer automatiquement à cette photo les données de géolocalisation du technicien ;
- de transmettre en temps réel ces informations à un administrateur chargé du suivi ;
- de centraliser l'ensemble des preuves terrain dans un tableau de bord web.

## 3. Problématique

Comment garantir qu'un technicien est effectivement présent sur un site d'intervention au moment où il déclare y être, tout en facilitant le travail de contrôle de l'administrateur ?

## 4. Objectif général

Mettre en place une solution composée d'une application mobile pour les techniciens et d'un tableau de bord web pour les administrateurs, afin de collecter, transmettre, visualiser et gérer des preuves de présence terrain basées sur une photo géolocalisée.

## 5. Objectifs spécifiques

- Permettre aux techniciens de se connecter de manière sécurisée à une application mobile.
- Permettre la prise de photo directement depuis l'application mobile.
- Récupérer automatiquement les coordonnées GPS au moment de la prise de photo.
- Associer à chaque photo des métadonnées utiles au suivi.
- Transmettre les photos et les données de localisation à une plateforme centrale.
- Permettre à l'administrateur de consulter les preuves transmises.
- Permettre à l'administrateur de gérer les comptes techniciens.
- Fournir un historique des activités terrain.

## 6. Périmètre du projet

Le projet couvre :

- une application mobile destinée aux techniciens ;
- une application web destinée aux administrateurs ;
- un système d'authentification ;
- un service de stockage des photos et des données associées ;
- un module de consultation, de suivi et de gestion.

Le projet ne couvre pas, dans sa première version :

- la planification avancée des interventions ;
- la messagerie instantanée entre admin et techniciens ;
- l'intégration avec des systèmes externes de type ERP ou CRM ;
- la reconnaissance automatique du contenu des images.

## 7. Parties prenantes

### 7.1 Administrateur

L'administrateur est la personne chargée du suivi des techniciens. Il consulte les preuves envoyées, analyse les données de localisation et gère les comptes utilisateurs.

### 7.2 Technicien

Le technicien est l'utilisateur terrain. Il se connecte à l'application mobile, prend une photo sur le site d'intervention et transmet automatiquement les informations requises.

### 7.3 Entreprise

L'entreprise est le bénéficiaire final de la solution. Elle recherche un meilleur contrôle opérationnel, une réduction des fraudes de présence et une meilleure traçabilité des interventions.

## 8. Description générale de la solution

La solution reposera sur deux interfaces complémentaires :

### 8.1 Application mobile technicien

Le technicien ouvre l'application sur son téléphone, s'authentifie avec ses identifiants, accède à la caméra, prend une photo puis l'application récupère automatiquement sa position géographique. La photo ainsi que les données associées sont envoyées au serveur pour être consultées par l'administrateur.

### 8.2 Dashboard web administrateur

L'administrateur se connecte à une interface web centralisée lui permettant de visualiser les images reçues, les coordonnées GPS associées, les informations du technicien concerné, ainsi que l'historique des transmissions. Il peut également gérer les comptes techniciens.

## 9. Besoins fonctionnels

### 9.1 Fonctionnalités côté technicien

- Se connecter à l'application avec un identifiant et un mot de passe.
- Accéder à la caméra du téléphone.
- Prendre une photo directement depuis l'application.
- Autoriser et récupérer la position GPS du téléphone.
- Associer automatiquement à la photo :
  - la latitude ;
  - la longitude ;
  - la date et l'heure de prise ;
  - l'identité du technicien ;
  - un identifiant unique de la soumission.
- Envoyer la photo et les données associées vers le serveur.
- Recevoir un message de confirmation après envoi.
- Consulter, si nécessaire, l'historique personnel de ses envois.

### 9.2 Fonctionnalités côté administrateur

- Se connecter au dashboard web de manière sécurisée.
- Consulter la liste des photos envoyées par les techniciens.
- Visualiser les détails d'une soumission :
  - photo ;
  - nom du technicien ;
  - date et heure ;
  - latitude et longitude ;
  - localisation sur carte ;
  - statut de la soumission.
- Rechercher et filtrer les envois par technicien, date, zone ou statut.
- Visualiser l'historique des activités par technicien.
- Gérer les comptes techniciens :
  - création ;
  - modification ;
  - activation ou désactivation ;
  - suppression logique si nécessaire.
- Consulter des statistiques de base :
  - nombre d'envois ;
  - nombre d'envois par technicien ;
  - répartition par période.

## 10. Données à collecter

Pour chaque preuve terrain, le système devra au minimum enregistrer les informations suivantes :

- identifiant de la soumission ;
- identifiant du technicien ;
- nom et prénom du technicien ;
- photo prise sur le terrain ;
- date et heure exactes de la capture ;
- latitude ;
- longitude ;
- précision GPS si disponible ;
- adresse approximative obtenue à partir des coordonnées, si cette fonctionnalité est activée ;
- statut de traitement de la soumission ;
- date et heure de réception sur le serveur.

## 11. Règles de gestion

- Une photo doit être prise uniquement depuis l'application mobile.
- Une soumission n'est valide que si la photo et les coordonnées GPS sont présentes.
- Les données de date et d'heure doivent être générées automatiquement par le système.
- Chaque soumission doit être liée à un technicien authentifié.
- L'administrateur est le seul profil habilité à gérer les comptes techniciens.
- Les données transmises doivent être historisées et consultables ultérieurement.

## 12. Exigences non fonctionnelles

### 12.1 Sécurité

- Authentification sécurisée des utilisateurs.
- Chiffrement des échanges entre application mobile, application web et serveur.
- Protection des accès selon les rôles.
- Stockage sécurisé des photos et des données de localisation.
- Journalisation des connexions et des actions sensibles.

### 12.2 Performance

- L'envoi d'une soumission doit être rapide dans des conditions réseau normales.
- Le dashboard doit permettre une consultation fluide des données.
- Le système doit pouvoir gérer plusieurs utilisateurs connectés simultanément.

### 12.3 Disponibilité

- Le système doit être accessible durant les heures d'exploitation de l'entreprise.
- Les données envoyées ne doivent pas être perdues en cas de coupure temporaire du réseau.

### 12.4 Ergonomie

- L'application mobile doit être simple, intuitive et rapide à utiliser sur le terrain.
- Le dashboard web doit offrir une lecture claire des informations et des filtres efficaces.

### 12.5 Traçabilité

- Chaque action importante doit pouvoir être tracée.
- L'historique des soumissions doit être conservé.

## 13. Contraintes techniques

- L'application technicien devra être compatible avec les smartphones modernes.
- Le dashboard administrateur devra être accessible depuis un navigateur web moderne.
- Le système devra utiliser la caméra et la géolocalisation du téléphone avec consentement utilisateur.
- Le serveur devra permettre le stockage des images, des coordonnées GPS et des informations utilisateurs.
- La solution devra prévoir une architecture suffisamment évolutive pour accueillir de futures fonctionnalités.

## 14. Architecture fonctionnelle simplifiée

Le fonctionnement attendu est le suivant :

1. Le technicien ouvre l'application mobile.
2. Il se connecte avec ses identifiants.
3. Il accède à la caméra depuis l'application.
4. Il prend une photo sur le site d'intervention.
5. L'application récupère automatiquement la position GPS et les métadonnées associées.
6. Les données sont envoyées au serveur central.
7. L'administrateur consulte les informations depuis le dashboard web.
8. L'administrateur analyse la cohérence entre l'image, l'utilisateur, l'heure et la position géographique.

## 15. Livrables attendus

- Un cahier des charges validé.
- Une application mobile pour les techniciens.
- Une application web de type dashboard pour les administrateurs.
- Une base de données pour le stockage des utilisateurs et des soumissions.
- Une documentation technique et fonctionnelle minimale.
- Un guide d'utilisation pour les administrateurs et les techniciens.

## 16. Critères de réussite

Le projet sera considéré comme réussi si :

- un technicien peut se connecter et envoyer une photo géolocalisée sans difficulté ;
- l'administrateur peut consulter rapidement les preuves reçues ;
- les données de localisation sont correctement associées à chaque photo ;
- l'entreprise dispose d'un meilleur moyen de contrôle de présence sur site ;
- la solution améliore la traçabilité et réduit les déclarations non fiables.

## 17. Perspectives d'évolution

Dans une version ultérieure, la solution pourra intégrer :

- la comparaison entre position réelle et position attendue d'un site ;
- des alertes automatiques en cas d'écart de localisation ;
- la gestion des missions ou tickets d'intervention ;
- la consultation cartographique avancée ;
- des rapports d'activité exportables ;
- un mode hors ligne avec synchronisation différée.

## 18. Conclusion

Ce projet vise à répondre à un besoin concret de contrôle terrain dans le secteur des télécommunications. En combinant une preuve visuelle et une preuve géographique dans une solution centralisée, l'entreprise pourra renforcer la fiabilité du suivi des techniciens, améliorer la supervision opérationnelle et disposer d'un historique exploitable des interventions effectuées sur le terrain.
