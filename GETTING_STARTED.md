# 🚀 Guide de Démarrage - Project Manager AI

Ce guide vous aidera à démarrer le projet étape par étape.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker Desktop** (Windows/Mac) ou Docker Engine (Linux)
- **Docker Compose** v2.0+
- **Node.js** 20+ et npm
- **PHP** 8.3+
- **Composer** 2+
- **Python** 3.11+
- **Git**

## 📁 Structure du Projet

```
project-manager-ai/
├── frontend/          # Application Next.js 14
├── backend/           # API Symfony 7
├── ai-services/       # Services IA Python
├── docker/            # Configuration Docker
└── docker-compose.yml # Orchestration des services
```

---

## 🐳 Étape 1 : Démarrage avec Docker (Recommandé)

### 1.1 Cloner et configurer

```powershell
# Aller dans le dossier du projet
cd C:\project-manager-ai

# Copier les fichiers d'environnement
Copy-Item frontend\.env.example frontend\.env.local
Copy-Item ai-services\.env.example ai-services\.env
```

### 1.2 Démarrer tous les services

```powershell
# Lancer tous les conteneurs
docker-compose up -d

# Vérifier que tous les services sont lancés
docker-compose ps
```

Les services seront disponibles sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:80/api
- **AI Services** : http://localhost:8000
- **RabbitMQ Management** : http://localhost:15672 (user: project_user, pass: project_password)
- **PostgreSQL** : localhost:5432
- **Redis** : localhost:6379

### 1.3 Initialiser la base de données

```powershell
# Accéder au conteneur PHP
docker-compose exec php bash

# Installer les dépendances Composer
composer install

# Créer la base de données
php bin/console doctrine:database:create --if-not-exists

# Générer les clés JWT
php bin/console lexik:jwt:generate-keypair

# Exécuter les migrations
php bin/console doctrine:migrations:migrate -n

# (Optionnel) Charger des données de test
php bin/console doctrine:fixtures:load -n

# Quitter le conteneur
exit
```

---

## 💻 Étape 2 : Démarrage en Local (Sans Docker)

### 2.1 Configuration de la Base de Données

```powershell
# Installer PostgreSQL localement ou utiliser un service cloud
# Créer la base de données
createdb project_manager
```

### 2.2 Backend Symfony

```powershell
cd backend

# Installer les dépendances
composer install

# Configurer .env.local
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/project_manager"

# Générer les clés JWT
php bin/console lexik:jwt:generate-keypair

# Créer la base et exécuter les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Démarrer le serveur Symfony
php -S localhost:8000 -t public
# ou avec Symfony CLI
symfony server:start
```

### 2.3 Frontend Next.js

```powershell
cd frontend

# Installer les dépendances
npm install

# Configurer .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Démarrer le serveur de développement
npm run dev
```

### 2.4 Services IA Python

```powershell
cd ai-services

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur FastAPI
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🔧 Étape 3 : Configuration Avancée

### 3.1 Variables d'Environnement

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:80/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

#### Backend (.env.local)
```env
APP_ENV=dev
APP_SECRET=your_secret_key
DATABASE_URL=postgresql://user:pass@localhost:5432/project_manager
JWT_PASSPHRASE=your_jwt_passphrase
REDIS_URL=redis://localhost:6379
MESSENGER_TRANSPORT_DSN=amqp://user:pass@localhost:5672/%2f/messages
```

#### AI Services (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/project_manager
REDIS_URL=redis://localhost:6379
BACKEND_API_URL=http://localhost:8000/api
```

### 3.2 Installation des Dépendances Système

#### Windows (PowerShell - Administrateur)
```powershell
# Installer Chocolatey si nécessaire
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Installer les outils
choco install nodejs-lts php composer python git docker-desktop -y
```

---

## 🧪 Étape 4 : Vérification de l'Installation

### 4.1 Tester le Backend

```powershell
# Tester l'API
curl http://localhost:80/api
# ou
Invoke-WebRequest http://localhost:80/api

# Voir la documentation API
# Ouvrir dans le navigateur: http://localhost:80/api/docs
```

### 4.2 Tester le Frontend

```powershell
# Ouvrir dans le navigateur
Start-Process "http://localhost:3000"
```

### 4.3 Tester les Services IA

```powershell
# Tester l'API IA
curl http://localhost:8000/health
# ou
Invoke-WebRequest http://localhost:8000/health

# Voir la documentation API IA
# Ouvrir dans le navigateur: http://localhost:8000/docs
```

---

## 📚 Étape 5 : Premiers Pas

### 5.1 Créer un Utilisateur

```powershell
# Via l'API
curl -X POST http://localhost:80/api/users `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com","password":"password","firstName":"Admin","lastName":"User"}'
```

### 5.2 Se Connecter

```powershell
# Obtenir un token JWT
curl -X POST http://localhost:80/api/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin@example.com","password":"password"}'
```

### 5.3 Créer un Projet

```powershell
# Avec le token JWT
curl -X POST http://localhost:80/api/projects `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_JWT_TOKEN" `
  -d '{"name":"Mon Premier Projet","description":"Description du projet"}'
```

---

## 🐛 Dépannage

### Problème : Les ports sont déjà utilisés

```powershell
# Vérifier les ports utilisés
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Arrêter les processus ou modifier les ports dans docker-compose.yml
```

### Problème : Docker ne démarre pas

```powershell
# Vérifier le statut de Docker
docker info

# Redémarrer Docker Desktop
Restart-Service docker
```

### Problème : Erreur de connexion à la base de données

```powershell
# Vérifier que PostgreSQL est lancé
docker-compose ps postgres

# Vérifier les logs
docker-compose logs postgres

# Recréer le conteneur
docker-compose down
docker-compose up -d postgres
```

### Problème : Erreur JWT

```powershell
# Regénérer les clés JWT
cd backend
php bin/console lexik:jwt:generate-keypair --overwrite
```

---

## 📖 Documentation Complète

- **Frontend** : voir [frontend/README.md](frontend/README.md)
- **Backend** : voir [backend/README.md](backend/README.md)
- **AI Services** : voir [ai-services/README.md](ai-services/README.md)

---

## 🎯 Prochaines Étapes

1. **Authentification** : Implémenter le système d'inscription/connexion
2. **Dashboard** : Créer l'interface du dashboard
3. **Kanban Board** : Implémenter le tableau Kanban drag & drop
4. **WebSockets** : Ajouter les notifications en temps réel
5. **IA Features** : Intégrer les fonctionnalités IA avancées
6. **Tests** : Écrire les tests unitaires et E2E
7. **Déploiement** : Configurer le CI/CD

---

## 💡 Conseils

- Utilisez Docker pour un démarrage rapide
- Consultez les logs en cas d'erreur : `docker-compose logs -f`
- Gardez les dépendances à jour
- Utilisez les outils de développement du navigateur
- Testez régulièrement avec différents rôles d'utilisateur

---

## 🆘 Besoin d'Aide ?

- Consultez la documentation officielle de chaque technologie
- Vérifiez les issues GitHub du projet
- Rejoignez la communauté de développeurs

**Bon développement ! 🚀**
