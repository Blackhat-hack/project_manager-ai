# Architecture - Project Manager AI

## 🏗️ Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │  Mobile App  │  │   Desktop    │          │
│  │  (Next.js)   │  │   (React     │  │     PWA      │          │
│  │              │  │    Native)   │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Nginx Reverse Proxy (Port 80)             │    │
│  │  - Load Balancing                                       │    │
│  │  - SSL Termination                                      │    │
│  │  - Rate Limiting                                        │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
┌───────────────────┐  ┌────────────┐  ┌─────────────────┐
│   FRONTEND        │  │  BACKEND   │  │  AI SERVICES    │
│   (Next.js 14)    │  │ (Symfony 7)│  │   (FastAPI)     │
│   Port 3000       │  │  Port 9000 │  │   Port 8000     │
│                   │  │            │  │                 │
│ - SSR/SSG         │  │ - API REST │  │ - ML Models     │
│ - React Server    │  │ - GraphQL  │  │ - NLP           │
│   Components      │  │ - WebSocket│  │ - Predictions   │
│ - TanStack Query  │  │ - JWT Auth │  │ - Generation    │
│ - Zustand         │  │ - RBAC     │  │                 │
└───────────────────┘  └────────────┘  └─────────────────┘
         │                    │                 │
         └────────────────────┼─────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      MESSAGE LAYER                               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   RabbitMQ   │  │   Mercure    │  │ WebSocket    │         │
│  │  (Messages)  │  │   (SSE)      │  │ (Real-time)  │         │
│  │  Port 5672   │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       CACHE LAYER                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Redis (Port 6379)                    │    │
│  │  - Session Storage                                       │    │
│  │  - Cache API                                            │    │
│  │  - Rate Limiting                                        │    │
│  │  - Queue Management                                     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │ Elasticsearch│  │  File Storage│         │
│  │  Port 5432   │  │  Port 9200   │  │    (S3)      │         │
│  │              │  │              │  │              │         │
│  │ - Users      │  │ - Full-text  │  │ - Uploads    │         │
│  │ - Projects   │  │   Search     │  │ - Documents  │         │
│  │ - Tasks      │  │ - Logs       │  │ - Images     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Données

### 1. Authentication Flow
```
User → Frontend → Backend (JWT) → Database
                    ↓
                 Redis (Session Cache)
```

### 2. API Request Flow
```
Browser → Nginx → Backend API → Cache Check (Redis)
                                      ↓
                                  Database (PostgreSQL)
                                      ↓
                                  Response (JSON)
```

### 3. Real-time Updates Flow
```
User Action → Backend → RabbitMQ → Message Handler
                           ↓
                        Mercure → WebSocket → All Connected Clients
```

### 4. AI Processing Flow
```
User Request → Backend → RabbitMQ → AI Service Worker
                                          ↓
                                    ML Model Processing
                                          ↓
                                    Redis Cache Result
                                          ↓
                                    Notify User (WebSocket)
```

---

## 🗂️ Structure des Données

### Database Schema

```sql
┌─────────────────┐
│      users      │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password        │
│ first_name      │
│ last_name       │
│ roles (JSON)    │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N (owner)
        ▼
┌─────────────────┐
│    projects     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ status          │
│ owner_id (FK)   │
│ start_date      │
│ end_date        │
│ created_at      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│      tasks      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ description     │
│ status          │
│ priority        │
│ project_id (FK) │
│ assigned_to(FK) │
│ due_date        │
│ position        │
│ created_at      │
└─────────────────┘
```

---

## 🔐 Sécurité

### Layers de Sécurité

1. **Frontend**
   - XSS Protection (React auto-escape)
   - CSRF Tokens
   - Content Security Policy
   - Input Validation (Zod)

2. **Backend**
   - JWT Authentication
   - Role-Based Access Control (RBAC)
   - SQL Injection Protection (Doctrine ORM)
   - Rate Limiting (Redis)
   - CORS Configuration

3. **Infrastructure**
   - HTTPS/SSL
   - Nginx Security Headers
   - Docker Container Isolation
   - Environment Variables Secrets

### Authentication Flow

```
1. User Login → POST /api/login
2. Backend validates credentials
3. Generate JWT Token (Lexik JWT)
4. Return token to client
5. Client stores in httpOnly cookie or localStorage
6. Subsequent requests include: Authorization: Bearer {token}
7. Backend validates token on each request
8. Token expires after configured TTL
```

---

## 📊 Scalabilité

### Horizontal Scaling

```
                    Load Balancer (Nginx)
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Backend 1          Backend 2          Backend 3
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                   Shared Resources
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   PostgreSQL          Redis              RabbitMQ
   (Master-Slave)   (Cluster)            (Cluster)
```

### Caching Strategy

1. **Browser Cache**
   - Static assets (images, CSS, JS)
   - Cache-Control headers

2. **CDN Cache**
   - Frontend static files
   - Public assets

3. **Application Cache (Redis)**
   - API responses
   - Session data
   - Rate limiting counters

4. **Database Query Cache**
   - Doctrine Query Cache
   - Result Cache

---

## 🔄 CI/CD Pipeline

```
Developer Push → GitHub
                   ↓
         GitHub Actions Workflow
                   ↓
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
  Lint          Tests          Build
(ESLint)     (PHPUnit)      (Docker)
                   ↓
              All Checks Pass?
                   ↓ Yes
         Deploy to Staging
                   ↓
         Run E2E Tests
                   ↓
              Tests Pass?
                   ↓ Yes
         Deploy to Production
                   ↓
         Health Check & Monitor
```

---

## 📈 Monitoring & Logging

### Stack de Monitoring

```
Application Metrics → Prometheus → Grafana → Alerts (Email/Slack)
                                      ↓
                                 Dashboards

Application Logs → Fluentd → Elasticsearch → Kibana
                                 ↓
                           Log Analysis
```

### Métriques Clés

1. **Performance**
   - Response time (p50, p95, p99)
   - Throughput (requests/sec)
   - Error rate

2. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

3. **Business**
   - Active users
   - Projects created
   - Tasks completed
   - AI requests

---

## 🎨 Frontend Architecture

### Component Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx (dashboard)
│   ├── projects/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   └── tasks/
│       └── page.tsx
└── api/
    └── [...routes]/
        └── route.ts
```

### State Management

```
┌──────────────────────────────────────┐
│         Global State (Zustand)        │
│  - User Session                       │
│  - Theme Preferences                  │
│  - UI State (modals, notifications)   │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│    Server State (TanStack Query)     │
│  - API Data Cache                     │
│  - Automatic Refetch                  │
│  - Optimistic Updates                 │
└──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│      Local State (useState)           │
│  - Form State                         │
│  - Temporary UI State                 │
└──────────────────────────────────────┘
```

---

## 🤖 AI Services Architecture

### ML Pipeline

```
Input Data → Preprocessing → Model Inference → Post-processing → Response
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                         Cache Hit?    Model Cache
                              │
                              ▼ No
                        Load Model → Predict
```

### Models

1. **Task Generation**
   - Model: GPT-3.5/GPT-4
   - Input: Project description
   - Output: List of tasks

2. **Sentiment Analysis**
   - Model: RoBERTa/VADER
   - Input: Comment text
   - Output: Sentiment score

3. **Timeline Prediction**
   - Model: Random Forest
   - Input: Project data, tasks
   - Output: Estimated completion

---

Cette architecture est conçue pour être :
- **Scalable** : Peut gérer une croissance importante
- **Maintenable** : Code organisé et modulaire
- **Performante** : Caching multi-niveaux
- **Sécurisée** : Plusieurs couches de sécurité
- **Résiliente** : Gestion d'erreurs et fallbacks
