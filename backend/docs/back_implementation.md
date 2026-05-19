# Backend Implementation Guide (API v1)

Ce document sert de contrat d'integration pour les equipes frontend (web admin et mobile).

## 1. Base URL et conventions

- Base API: `/api/v1`
- Authentification: `Bearer <token>` (Sanctum)
- Format: JSON
- Upload photo: `multipart/form-data`
- Pagination: Laravel (`data`, `links`, `meta`)

Header standard pour routes protegees:

```http
Authorization: Bearer <token>
Accept: application/json
```

## 2. Roles et acces

- `admin`: acces aux routes `/admin/*`
- `technician`: acces aux routes `/mobile/*`

Protection appliquee par middleware de role.

## 3. Authentification

### 3.1 Login

- Methode: `POST`
- URL: `/api/v1/auth/login`
- Body JSON:

```json
{
  "phone": "+22890000001",
  "password": "password",
  "device_name": "web-admin"
}
```

Validation:

- `phone`: required, string, max 30
- `password`: required, string
- `device_name`: nullable, string, max 100

Reponse 200:

```json
{
  "data": {
    "token": "<plain_text_token>",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": null,
      "phone": "+22890000001",
      "role": "admin",
      "is_active": true,
      "last_login_at": "2026-04-26T10:00:00.000000Z",
      "created_at": "...",
      "updated_at": "..."
    }
  }
}
```

Erreurs:

- 422: identifiants invalides
- 403: compte inactif

### 3.2 Me

- Methode: `GET`
- URL: `/api/v1/auth/me`
- Auth: requise

Reponse 200:

```json
{
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": null,
    "role": "admin",
    "is_active": true,
    "last_login_at": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### 3.3 Logout

- Methode: `POST`
- URL: `/api/v1/auth/logout`
- Auth: requise

Reponse 200:

```json
{
  "message": "Deconnexion reussie."
}
```

## 4. Mobile - Submissions (technician)

Prefixe: `/api/v1/mobile`

### 4.1 Lister mes soumissions

- Methode: `GET`
- URL: `/api/v1/mobile/submissions`
- Query: `per_page` (optionnel, 1..100)

Reponse 200: collection paginee de `SubmissionResource`

### 4.2 Detail d'une soumission

- Methode: `GET`
- URL: `/api/v1/mobile/submissions/{id}`
- Regle: un technicien ne peut consulter que ses propres soumissions

Erreurs:

- 403: acces refuse

### 4.3 Creer une soumission

- Methode: `POST`
- URL: `/api/v1/mobile/submissions`
- Content-Type: `multipart/form-data`

Champs:

- `image` (required): image jpeg/jpg/png, max 10 Mo
- `latitude` (required): numeric, between -90 et 90
- `longitude` (required): numeric, between -180 et 180
- `gps_accuracy` (nullable): numeric, min 0
- `captured_at` (required): date
- `device_platform` (required): string, max 40
- `device_model` (nullable): string, max 255
- `app_version` (nullable): string, max 40
- `address_label` (nullable): string, max 255

Reponse 201:

```json
{
  "data": {
    "id": 15,
    "user_id": 2,
    "status": "submitted",
    "photo_path": "submissions/2026/04/26/xxxx.jpg",
    "photo_url": "/storage/submissions/2026/04/26/xxxx.jpg",
    "photo_name": "xxxx.jpg",
    "captured_at": "...",
    "received_at": "...",
    "viewed_at": null,
    "position": {
      "latitude": 6.1725,
      "longitude": 1.2314,
      "gps_accuracy": 5.2
    },
    "address_label": "Lome",
    "device": {
      "platform": "android",
      "model": "Samsung A34",
      "app_version": "1.0.0"
    },
    "user": null,
    "created_at": "...",
    "updated_at": "..."
  },
  "message": "Soumission enregistree avec succes."
}
```

## 5. Admin - Technicians

Prefixe: `/api/v1/admin`

### 5.1 Lister techniciens

- `GET /api/v1/admin/technicians`
- Query: `is_active` (bool optionnel), `per_page` (1..100)

### 5.2 Creer technicien

- `POST /api/v1/admin/technicians`
- Body JSON:

```json
{
  "name": "Tech 1",
  "phone": "+22890000003",
  "email": null,
  "password": "password123",
  "is_active": true
}
```

Validation:

- `name`: required, string, max 255
- `phone`: required, string, max 30, unique
- `email`: nullable, email, unique
- `password`: required, string, min 8
- `is_active`: nullable, boolean

Important:

- Cette route cree uniquement des utilisateurs avec role `technician`.

### 5.3 Mettre a jour technicien

- `PUT /api/v1/admin/technicians/{id}`
- Champs: `name`, `phone`, `email` (optionnel), `password` (optionnel), `is_active`
- Erreur 422 si l'utilisateur cible n'est pas un technicien.

### 5.4 Activer/Desactiver technicien

- `PATCH /api/v1/admin/technicians/{id}/status`
- Body JSON:

```json
{
  "is_active": false
}
```

## 6. Admin - Submissions

### 6.1 Lister soumissions

- `GET /api/v1/admin/submissions`
- Filtres query:
  - `status` (string)
  - `user_id` (id user)
  - `from` (date)
  - `to` (date)
  - `per_page` (1..100)

### 6.2 Detail soumission

- `GET /api/v1/admin/submissions/{id}`

### 6.3 Marquer comme vue

- `PATCH /api/v1/admin/submissions/{id}/mark-viewed`

Reponse 200:

```json
{
  "message": "Soumission marquee comme vue.",
  "submission": {
    "id": 15,
    "status": "viewed",
    "...": "..."
  }
}
```

## 7. Admin - Dashboard

### 7.1 Stats

- `GET /api/v1/admin/dashboard/stats`

Reponse 200:

```json
{
  "data": {
    "total_submissions": 120,
    "today_submissions": 7,
    "active_technicians": 10,
    "submitted_count": 30,
    "viewed_count": 90
  }
}
```

## 8. Codes d'erreur a gerer cote frontend

- `401 Unauthorized`: token absent/invalide
- `403 Forbidden`: role non autorise ou compte inactif
- `404 Not Found`: ressource inexistante
- `422 Unprocessable Entity`: erreur de validation
- `500`: erreur serveur

Format classique de validation Laravel (422):

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

## 9. Workflow recommande pour le frontend

1. Login -> stocker `token`.
2. Appeler `GET /auth/me` pour connaitre le role.
3. Router selon role:
   - admin -> pages administration
   - technician -> parcours mobile (submissions)
4. Envoyer `Authorization: Bearer <token>` a chaque appel protege.
5. Sur `401`, forcer logout local et redirection login.
6. Sur `422`, afficher les erreurs champ par champ.

## 10. Limites actuelles a connaitre

- Creation utilisateur exposee actuellement uniquement pour les techniciens.
- Les tests API metier ne sont pas encore ecrits (dossiers de tests nettoyes des fichiers d'exemple).
