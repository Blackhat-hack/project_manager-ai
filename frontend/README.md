# Frontend - Next.js

Application frontend pour Project Manager AI

## 🚀 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **TanStack Query** - Gestion de l'état serveur
- **Zustand** - Gestion de l'état global
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas

## 📦 Installation

```bash
npm install
```

## 🏃 Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
npm run build
npm start
```

## 📁 Structure

```
frontend/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── (dashboard)/       # Routes du dashboard
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Composants UI réutilisables
│   ├── features/          # Composants métier
│   ├── layout/            # Composants de layout
│   └── providers/         # Providers React
├── lib/
│   ├── api/               # Client API
│   ├── hooks/             # Hooks personnalisés
│   └── utils/             # Utilitaires
└── types/                 # Types TypeScript
```

## 🎨 Fonctionnalités

- ✅ Dashboard interactif
- ✅ Tableaux Kanban drag & drop
- ✅ Mode sombre/clair
- ✅ Responsive design
- ✅ PWA support
- ✅ Notifications temps réel
- ✅ Internationalisation

## 🔧 Configuration

Variables d'environnement dans `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:80/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```
