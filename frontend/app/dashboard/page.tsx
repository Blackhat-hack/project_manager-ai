'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { useTaskStore } from '@/lib/stores/task-store'
import { useNotificationStore } from '@/lib/stores/notification-store'
import { CreateProjectModal } from '@/components/modals/create-project-modal'
import { NotificationPanel } from '@/components/notifications/notification-panel'
import { useHydration } from '@/lib/hooks/use-hydration'

export default function DashboardPage() {
  const router = useRouter()
  const hydrated = useHydration()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const logout = useAuthStore(state => state.logout)
  const projects = useProjectStore(state => state.projects)
  const fetchProjects = useProjectStore(state => state.fetchProjects)
  const tasks = useTaskStore(state => state.tasks)
  const notifications = useNotificationStore(state => state.notifications)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (hydrated && isAuthenticated) {
      fetchProjects()
    }
  }, [hydrated, isAuthenticated, router, fetchProjects])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const activeProjects = projects.filter(p => p.status === 'active')
  const completedTasks = tasks.filter(t => t.status === 'done')

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
              <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">
                Dashboard
              </a>
              <a href="/projects" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative" 
              onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
            >
              <svg 
                className="w-5 h-5 text-gray-700 dark:text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer" onClick={() => router.push('/projects')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Projets actifs</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeProjects.length}</h3>
              </div>
              <div className="text-4xl"></div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Sur {projects.length} total</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tâches terminées</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{completedTasks.length}</h3>
              </div>
              <div className="text-4xl"></div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Sur {tasks.length} total</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tâches en cours</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{tasks.filter(t => t.status === 'in-progress').length}</h3>
              </div>
              <div className="text-4xl"></div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">En progression</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer" onClick={() => setIsNotificationPanelOpen(true)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notifications</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{unreadCount}</h3>
              </div>
              <div className="text-4xl"></div>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Non lues</p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projets récents</h2>
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                + Nouveau projet
              </Button>
            </div>
            
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Aucun projet pour le moment</p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Créer votre premier projet
                  </Button>
                </div>
              ) : (
                projects.slice(0, 5).map((project) => (
                  <div 
                    key={project.id} 
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-blue-500 transition cursor-pointer"
                    onClick={() => handleProjectClick(String(project.id))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                      <span className="text-sm text-gray-500">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span> {tasks.filter(t => t.projectId === project.id).length} tâches</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        project.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'active' ? 'En cours' : 'Planifié'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6"> Notifications</h2>
            
            <div className="space-y-4">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${
                    notification.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                    'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                  }`}
                  onClick={() => setIsNotificationPanelOpen(true)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Aucune notification
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <NotificationPanel 
        isOpen={isNotificationPanelOpen} 
        onClose={() => setIsNotificationPanelOpen(false)} 
      />
    </div>
  )
}
