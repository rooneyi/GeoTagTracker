# GEO Tag Tracker — Backend API

API REST Laravel pour la collecte de photos géolocalisées (techniciens) et la supervision (administrateurs).

- **Base URL** : `/api/v1`
- **Auth** : Laravel Sanctum (Bearer token)
- **Login** : numéro de téléphone + mot de passe
- **Contrat détaillé** : [docs/back_implementation.md](docs/back_implementation.md)

---

## Prérequis

| Outil | Version |
|-------|---------|
| PHP | 8.3+ (extensions : `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`) |
| Composer | 2.x |
| MySQL ou MariaDB | 8+ |
| Node.js + npm | 20+ (optionnel, pour les assets Vite) |

---

## Installation (nouveau clone)

### 1. Cloner et entrer dans le projet

```bash
git clone <url-du-repo> GEO_TAG_TRACKER
cd GEO_TAG_TRACKER/backend
```

### 2. Dépendances PHP

```bash
composer install
```

### 3. Variables d’environnement

```bash
cp .env.example .env
php artisan key:generate
```

Éditez `.env` au minimum :

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=geotag_tracker
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

Créez la base MySQL avant de migrer :

```sql
CREATE DATABASE geotag_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Base de données

```bash
php artisan migrate
php artisan db:seed
```

Le seed crée un **admin** et un **technicien** de test (voir ci-dessous).

### 5. Stockage des photos

```bash
php artisan storage:link
```

Les images sont enregistrées sur le disque `public` (`storage/app/public/submissions/...`).

---

## Lancer le serveur

### Développement (recommandé)

Le fichier `php.ini` du projet augmente les limites d’upload (photos jusqu’à ~10 Mo). **Utilisez-le toujours** avec `artisan serve` :

```bash
php -c php.ini artisan serve --host=0.0.0.0 --port=8000
```

- API locale : `http://127.0.0.1:8000/api/v1`
- Depuis un téléphone sur le même réseau : `http://<IP-LAN-du-PC>:8000/api/v1`  
  (ex. `http://192.168.11.130:8000/api/v1`)

### Stack complète (serveur + queue + logs + Vite)

```bash
composer run dev
```

### Sans `php.ini` (déconseillé pour les uploads)

Les photos de plus de **2 Mo** échoueront avec une erreur 422 (*The image failed to upload*) si PHP utilise ses valeurs par défaut.

---

## Comptes de test

| Rôle | Téléphone | Mot de passe | Routes API |
|------|-----------|--------------|------------|
| Admin | `+22890000001` | `password` | `/api/v1/admin/*` |
| Technicien | `+22890000002` | `password` | `/api/v1/mobile/*` |

Relancer uniquement l’admin :

```bash
php artisan db:seed --class=AdminSeeder
```

---

## Tester l’API

### Connexion

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+22890000001","password":"password","device_name":"cli"}'
```

Réponse : `data.token` (à utiliser en `Authorization: Bearer <token>`).

### Profil connecté

```bash
curl http://127.0.0.1:8000/api/v1/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token>"
```

### Statistiques admin

```bash
curl http://127.0.0.1:8000/api/v1/admin/dashboard/stats \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token_admin>"
```

Toutes les routes, champs et codes d’erreur : **[docs/back_implementation.md](docs/back_implementation.md)**.

---

## Rôles et routes principales

| Préfixe | Rôle | Exemples |
|---------|------|----------|
| `/api/v1/auth/*` | public / authentifié | `POST login`, `GET me`, `POST logout` |
| `/api/v1/mobile/*` | `technician` | `POST submissions` (multipart + photo) |
| `/api/v1/admin/*` | `admin` | techniciens, soumissions, dashboard |

---

## Intégration mobile / web

1. **URL de base** : pointer le client vers `http://<IP>:8000/api/v1` (pas `localhost` depuis un appareil physique).
2. **Login** : envoyer `phone` et `password` en JSON (pas `email`).
3. **Soumission photo** : `POST /api/v1/mobile/submissions` en `multipart/form-data`  
   Champs : `image`, `latitude`, `longitude`, `captured_at`, `device_platform`, etc.  
   Détail : [docs/back_implementation.md §4.3](docs/back_implementation.md).
4. **Header** : `Authorization: Bearer <token>` sur les routes protégées.

---

## Commandes utiles

```bash
# Réinitialiser la BDD + seeds
php artisan migrate:fresh --seed

# Formater le code (Pint)
./vendor/bin/pint

# Tests
composer test

# Vider les caches
php artisan config:clear && php artisan cache:clear
```

---

## Dépannage

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| `422` — *The image failed to upload* | Limite PHP &lt; taille photo (~3 Mo+) | Lancer avec `php -c php.ini artisan serve` |
| `422` — identifiants invalides | Mauvais téléphone/mot de passe | Utiliser les comptes seed ou recréer via admin |
| `403` — compte inactif | `is_active = false` | Réactiver via `PATCH .../technicians/{id}/status` |
| Mobile ne joint pas l’API | Mauvaise IP / firewall | `0.0.0.0` sur `serve`, même Wi‑Fi, IP LAN du PC |
| Photos non visibles | Lien storage absent | `php artisan storage:link` |

Logs : `storage/logs/laravel.log`

---

## Documentation projet

- [back_implementation.md](docs/back_implementation.md) — guide d’intégration API
- [specification_technique.md](docs/specification_technique.md) — architecture
- [specification_fonctionnelle.md](docs/specification_fonctionnelle.md) — règles métier
- [cahier_de_charge.md](docs/cahier_de_charge.md) — contexte produit

---

## Licence

MIT (framework Laravel). Voir le dépôt pour la licence du projet métier.
