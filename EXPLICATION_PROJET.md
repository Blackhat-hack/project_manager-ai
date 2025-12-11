# 📚 Explication du Projet Project Manager AI

**Date de la conversation : 10-11 Décembre 2025**

---

## 🎯 Vue d'ensemble du projet

**Project Manager AI** est une application web complète de gestion de projets et de tâches.

### Architecture :
```
Frontend (Next.js)  ←→  Backend (Symfony)  ←→  PostgreSQL + Redis
   Port 3000              Port 8000              Docker containers
```

### Technologies :
- **Frontend** : Next.js 14, TypeScript, React, Tailwind CSS, Zustand
- **Backend** : Symfony 7, PHP 8.3, API Platform, Doctrine ORM
- **Base de données** : PostgreSQL 15, Redis 7
- **Gestion d'état** : Zustand avec persistance localStorage

---

## 📂 Structure du projet

```
project-manager-ai/
├── frontend/          # Application Next.js (interface utilisateur)
│   ├── app/          # Pages de l'application
│   ├── components/   # Composants réutilisables
│   └── lib/          # Stores Zustand, utilitaires
│
├── backend/          # API Symfony
│   ├── src/
│   │   ├── Entity/      # Modèles de données (User, Project, Task)
│   │   ├── Repository/  # Requêtes personnalisées
│   │   └── Controller/  # Logique métier
│   ├── config/       # Configuration
│   └── public/       # Point d'entrée (index.php)
│
└── docker-compose.yml  # PostgreSQL + Redis
```

---

## 🔄 Comment fonctionne une API REST ?

### Analogie du restaurant :
```
CLIENT (Frontend)  →  SERVEUR (API)  →  CUISINE (Base de données)
      |                   |                    |
   "Je veux          Il transmet         Elle prépare
    une pizza"       la commande         la pizza
      ↑                   ↓                    ↓
      └────────────  Pizza livrée  ────────────┘
```

### Dans votre application :

**Exemple : Créer un projet**

1. **Frontend envoie** :
   ```http
   POST http://localhost:8000/api/projects
   Body: { "name": "Site Web", "description": "..." }
   ```

2. **Backend traite** :
   - Reçoit la requête
   - Crée l'objet Project
   - Sauvegarde dans PostgreSQL

3. **Backend répond** :
   ```json
   { "id": 1, "name": "Site Web", "status": "active" }
   ```

4. **Frontend affiche** le nouveau projet à l'écran

---

## 🔐 Exemple : Connexion utilisateur (Login)

### Fichier : `frontend/app/auth/login/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()  // Empêche le rechargement de la page
  
  // Appel de la fonction login
  await login(formData.email, formData.password)
  
  // Redirection vers le dashboard
  router.push('/dashboard')
}
```

### Fichier : `frontend/lib/stores/auth-store.ts`

```typescript
login: async (email: string, password: string) => {
  // 1. Simuler une attente (1 seconde)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 2. Récupérer les utilisateurs du localStorage
  const usersJson = localStorage.getItem('registered-users')
  const users = JSON.parse(usersJson)
  
  // 3. Chercher l'utilisateur avec cet email/password
  const foundUser = users.find(
    u => u.email === email && u.password === password
  )
  
  // 4. Si pas trouvé → ERREUR
  if (!foundUser) {
    throw new Error('Email ou mot de passe incorrect')
  }
  
  // 5. Si trouvé → Créer la session
  set({
    user: foundUser,
    token: 'mock-jwt-token-' + Date.now(),
    isAuthenticated: true
  })
}
```

### ⚠️ IMPORTANT : Actuellement pas d'API réelle !

Le code actuel utilise **localStorage** (stockage dans le navigateur), pas le backend Symfony !

**Code actuel (localStorage)** :
```typescript
const usersJson = localStorage.getItem('registered-users')  // ❌ Navigateur
```

**Ce que ça devrait être (API)** :
```typescript
const response = await fetch('http://localhost:8000/api/login', {  // ✅ Backend
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

---

## 🗄️ Backend Symfony - Les Entités

### 1. User.php (Utilisateur)

```php
#[ORM\Entity]
#[ORM\Table(name: 'users')]
class User {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    private ?int $id = null;
    
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;
    
    #[ORM\Column]
    private ?string $password = null;
    
    #[ORM\Column(length: 255)]
    private ?string $firstName = null;
    
    #[ORM\Column(length: 255)]
    private ?string $lastName = null;
}
```

**Équivalent SQL** :
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(180) UNIQUE,
    password VARCHAR(255),
    firstName VARCHAR(255),
    lastName VARCHAR(255)
);
```

### 2. Project.php (Projet)

```php
#[ORM\Entity]
#[ORM\Table(name: 'projects')]
class Project {
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;
    private string $status = 'draft';
    
    // Relations
    #[ORM\ManyToOne]  // UN projet a UN propriétaire
    private ?User $owner = null;
    
    #[ORM\ManyToMany]  // UN projet a PLUSIEURS membres
    private Collection $members;
    
    #[ORM\OneToMany]  // UN projet a PLUSIEURS tâches
    private Collection $tasks;
}
```

### 3. Task.php (Tâche)

```php
#[ORM\Entity]
#[ORM\Table(name: 'tasks')]
class Task {
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;
    private string $status = 'todo';
    private string $priority = 'medium';
    
    #[ORM\ManyToOne]  // Une tâche appartient à UN projet
    private ?Project $project = null;
    
    #[ORM\ManyToOne]  // Une tâche est assignée à UN utilisateur
    private ?User $assignedTo = null;
}
```

---

## 🚀 API Platform - Routes automatiques

### Annotation magique :
```php
#[ApiResource(
    operations: [
        new GetCollection(),  // GET  /api/users
        new Post(),          // POST /api/users
        new Get(),           // GET  /api/users/1
        new Put(),           // PUT  /api/users/1
        new Delete(),        // DELETE /api/users/1
    ]
)]
```

### Routes créées automatiquement :

| Méthode | URL | Action |
|---------|-----|--------|
| GET | `/api/projects` | Liste tous les projets |
| POST | `/api/projects` | Créer un projet |
| GET | `/api/projects/1` | Détails du projet #1 |
| PUT | `/api/projects/1` | Modifier le projet #1 |
| DELETE | `/api/projects/1` | Supprimer le projet #1 |

---

## 🔗 Relations entre les tables

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│  users   │         │   projects   │         │  tasks   │
├──────────┤         ├──────────────┤         ├──────────┤
│ id       │◄────────┤ owner_id     │         │ id       │
│ email    │         │ name         │         │ title    │
│ password │         │ description  │◄────────┤ project_id│
│ firstName│         │ status       │         │ status   │
│ lastName │         └──────────────┘         │ assigned_to│
└──────────┘                                  └──────────┘
```

---

## 📝 Configuration Backend (.env)

```dotenv
# Connexion à PostgreSQL
DATABASE_URL="postgresql://project_user:project_password@localhost:5432/project_manager"

# Explication :
# - project_user : nom d'utilisateur
# - project_password : mot de passe
# - localhost:5432 : adresse du serveur PostgreSQL
# - project_manager : nom de la base de données
```

---

## 🔄 Flux complet d'une requête

```
1. Utilisateur clique sur "Créer un projet"
                    ↓
2. Frontend (Next.js) envoie POST /api/projects
                    ↓
3. Backend (Symfony) reçoit la requête
                    ↓
4. API Platform trouve la route
                    ↓
5. Doctrine crée l'objet Project
                    ↓
6. PostgreSQL sauvegarde les données
                    ↓
7. Backend répond avec le projet créé (JSON)
                    ↓
8. Frontend affiche le nouveau projet
```

---

## ✅ Ce qui fonctionne actuellement

- ✅ Frontend complet avec toutes les pages
- ✅ Gestion des projets, tâches, équipe
- ✅ Système de notifications
- ✅ Drag & drop des tâches
- ✅ Persistance avec Zustand (localStorage)
- ✅ Backend Symfony configuré
- ✅ PostgreSQL et Redis en Docker
- ✅ Entités définies (User, Project, Task)

## ⚠️ Ce qui reste à faire

- ❌ Connecter le frontend au backend API
- ❌ Remplacer localStorage par de vraies requêtes HTTP
- ❌ Implémenter l'authentification JWT
- ❌ Créer les migrations de base de données
- ❌ Tester les routes API

---

## 💡 Questions importantes pour comprendre

1. **Qu'est-ce qu'une API ?**
   → C'est un serveur qui répond aux demandes du frontend

2. **Où sont stockées les données actuellement ?**
   → Dans le localStorage du navigateur (pas dans PostgreSQL)

3. **Que fait `#[ApiResource]` ?**
   → Crée automatiquement les routes API (GET, POST, PUT, DELETE)

4. **Que fait Doctrine ORM ?**
   → Convertit les objets PHP en requêtes SQL et vice-versa

5. **Comment créer un projet via l'API ?**
   → POST http://localhost:8000/api/projects avec JSON

---

## 🎓 Prochaines étapes à apprendre

1. Comment connecter le frontend à l'API backend
2. Comment utiliser `fetch()` pour faire des requêtes HTTP
3. Comment gérer l'authentification JWT
4. Comment créer les migrations de base de données
5. Comment tester les routes API avec Postman

---

## 📞 Commandes utiles

```bash
# Démarrer PostgreSQL et Redis
docker-compose up -d

# Démarrer le backend Symfony
cd backend/public
php -S localhost:8000

# Démarrer le frontend Next.js
cd frontend
npm run dev

# Accéder à l'application
http://localhost:3000
```

---

**📌 Note importante** : Cette explication couvre les concepts de base. Demain, nous pourrons approfondir n'importe quel sujet ou connecter le frontend au backend !
