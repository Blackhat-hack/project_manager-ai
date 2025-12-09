# Backend - Symfony API

API Backend pour Project Manager AI

## 🚀 Technologies

- **Symfony 7** - Framework PHP
- **API Platform** - REST API
- **PostgreSQL** - Base de données
- **Redis** - Cache
- **RabbitMQ** - Message queue
- **JWT** - Authentication
- **Doctrine ORM** - ORM

## 📦 Installation

```bash
composer install
```

## 🔧 Configuration

1. Copier `.env` vers `.env.local` et adapter les variables
2. Générer les clés JWT:

```bash
php bin/console lexik:jwt:generate-keypair
```

3. Créer la base de données:

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

## 🏃 Développement

```bash
symfony server:start
```

Ou avec PHP built-in:

```bash
php -S localhost:8000 -t public
```

## 📁 Structure

```
backend/
├── bin/                    # Scripts console
├── config/                 # Configuration
│   ├── packages/          # Configuration des bundles
│   └── routes/            # Routes
├── public/                # Point d'entrée web
├── src/
│   ├── Controller/        # Contrôleurs
│   ├── Entity/            # Entités Doctrine
│   ├── Repository/        # Repositories
│   ├── Service/           # Services métier
│   ├── EventSubscriber/   # Event subscribers
│   └── Messenger/         # Message handlers
├── migrations/            # Migrations base de données
└── tests/                 # Tests
```

## 🔑 API Endpoints

- `POST /api/login` - Authentification
- `POST /api/register` - Inscription
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `GET /api/tasks` - Liste des tâches
- `POST /api/tasks` - Créer une tâche
- `GET /api/users` - Liste des utilisateurs

Documentation API disponible sur `/api/docs`

## 🧪 Tests

```bash
php bin/phpunit
```

## 🎯 Fonctionnalités

- ✅ Authentication JWT
- ✅ API RESTful avec API Platform
- ✅ Gestion des utilisateurs et rôles
- ✅ CRUD Projets et Tâches
- ✅ WebSocket avec Mercure
- ✅ File d'attente avec Messenger
- ✅ Cache Redis
- ✅ Validation des données
