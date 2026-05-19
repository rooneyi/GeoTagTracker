# GEO Tag Tracker

Plateforme de preuve terrain : les techniciens envoient des photos géolocalisées depuis le mobile ; les administrateurs les consultent via une API (et une future interface web).

Ce dépôt contient le **backend API** (Laravel). L’application mobile Android et le dashboard web se connectent à cette API.

## Structure du dépôt

```
GEO_TAG_TRACKER/
└── backend/          # API REST Laravel (voir backend/README.md)
    ├── app/
    ├── docs/         # Spécifications et contrat API
    └── ...
```

## Démarrage rapide

Toutes les commandes ci-dessous se lancent depuis le dossier `backend/` :

```bash
git clone <url-du-repo> GEO_TAG_TRACKER
cd GEO_TAG_TRACKER/backend
```

Puis suivez le guide détaillé : **[backend/README.md](backend/README.md)**.

## Documentation

| Document | Description |
|----------|-------------|
| [backend/README.md](backend/README.md) | Installation, configuration, lancement |
| [backend/docs/back_implementation.md](backend/docs/back_implementation.md) | Contrat API v1 (routes, payloads, erreurs) |
| [backend/docs/cahier_de_charge.md](backend/docs/cahier_de_charge.md) | Cahier des charges |
| [backend/docs/specification_technique.md](backend/docs/specification_technique.md) | Architecture technique |

## Comptes de démonstration (après seed)

| Rôle | Téléphone | Mot de passe |
|------|-----------|--------------|
| Admin | `+22890000001` | `password` |
| Technicien | `+22890000002` | `password` |

Authentification : **téléphone + mot de passe** (pas d’email pour la connexion).
