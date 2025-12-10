'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { useTaskStore } from '@/lib/stores/task-store'
import { useNotificationStore } from '@/lib/stores/notification-store'
import { CreateProjectModal } from '@/components/modals/create-project-modal'

export default function ProjectsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const projects = useProjectStore(state => state.projects)
  const fetchProjects = useProjectStore(state => state.fetchProjects)
  const tasks = useTaskStore(state => state.tasks)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!user) {
        router.push('/auth/login')
      } else {
        fetchProjects()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router, fetchProjects])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push('/dashboard')}>
              Project Manager AI
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                Dashboard
              </a>
              <a href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">
                Projets
              </a>
              <a href="/tasks" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                Tâches
              </a>
              <a href="/team" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                Équipe
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{unreadCount}</span>
              )}
            </Button>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tous les projets</h2>
          <Button onClick={() => setIsCreateModalOpen(true)}>+ Nouveau projet</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-500 transition cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  project.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {project.status === 'completed' ? 'Terminé' :
                   project.status === 'active' ? 'En cours' : 'Planifié'}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progression</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span> {tasks.filter(t => t.projectId === project.id).length} tâches</span>
                <span> {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR') : 'Date non définie'}</span>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aucun projet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Créez votre premier projet pour commencer</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Créer un projet</Button>
          </div>
        )}
      </main>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
