'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { useTaskStore } from '@/lib/stores/task-store'
import { useTeamStore } from '@/lib/stores/team-store'
import { useNotificationStore } from '@/lib/stores/notification-store'
import { CreateTaskModal } from '@/components/modals/create-task-modal'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const projects = useProjectStore(state => state.projects)
  const deleteProject = useProjectStore(state => state.deleteProject)
  const tasks = useTaskStore(state => state.tasks)
  const getProjectMembers = useTeamStore(state => state.getProjectMembers)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  const projectId = parseInt(params.id)
  const project = projects.find(p => p.id === projectId)
  const projectTasks = tasks.filter(t => t.projectId === projectId)
  const members = getProjectMembers(projectId)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!user) {
        router.push('/auth/login')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleDeleteProject = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project?.name}" ? Cette action est irréversible.`)) {
      deleteProject(projectId)
      router.push('/projects')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  const tasksByStatus = {
    todo: projectTasks.filter(t => t.status === 'todo').length,
    'in-progress': projectTasks.filter(t => t.status === 'in-progress').length,
    review: projectTasks.filter(t => t.status === 'review').length,
    done: projectTasks.filter(t => t.status === 'done').length
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Projet introuvable</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Ce projet n'existe pas ou a été supprimé</p>
          <Button onClick={() => router.push('/projects')}>Retour aux projets</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push('/dashboard')}>
                Project Manager AI
              </h1>
              <nav className="hidden md:flex space-x-6">
                <button onClick={() => router.push('/dashboard')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 bg-transparent border-0 cursor-pointer">
                  Dashboard
                </button>
                <button onClick={() => router.push('/projects')} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium bg-transparent border-0 cursor-pointer">
                  Projets
                </button>
                <button onClick={() => router.push('/tasks')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 bg-transparent border-0 cursor-pointer">
                  Tâches
                </button>
                <button onClick={() => router.push('/team')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 bg-transparent border-0 cursor-pointer">
                  Équipe
                </button>
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
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <button onClick={() => router.push('/projects')} className="hover:text-blue-600 bg-transparent border-0 cursor-pointer">
              Projets
            </button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{project.name}</span>
          </div>

          {/* Project Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                    project.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {project.status === 'completed' ? '✅ Terminé' :
                     project.status === 'active' ? '⏳ En cours' : '📋 Planifié'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">{project.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date de début</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      📅 {project.startDate ? new Date(project.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date non définie'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date de fin</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      📅 {project.endDate ? new Date(project.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date non définie'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Membres</p>
                    <p className="text-gray-900 dark:text-white font-medium">👥 {members.length} membres</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progression globale</span>
                    <span className="font-bold text-gray-900 dark:text-white text-xl">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="ml-6 flex gap-3">
                <Button onClick={() => setIsCreateTaskModalOpen(true)}>
                  + Nouvelle tâche
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeleteProject}
                  className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  🗑️ Supprimer
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">À faire</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasksByStatus.todo}</p>
                </div>
                <div className="text-4xl">📋</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En cours</p>
                  <p className="text-3xl font-bold text-blue-600">{tasksByStatus['in-progress']}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En révision</p>
                  <p className="text-3xl font-bold text-yellow-600">{tasksByStatus.review}</p>
                </div>
                <div className="text-4xl">👀</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Terminées</p>
                  <p className="text-3xl font-bold text-green-600">{tasksByStatus.done}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Équipe du projet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <span className="text-3xl">{member.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button onClick={() => router.push(`/tasks?project=${projectId}`)} className="flex-1">
              📋 Voir toutes les tâches
            </Button>
            <Button variant="outline" onClick={() => router.push('/projects')} className="flex-1">
              ← Retour aux projets
            </Button>
          </div>
        </main>
      </div>

      <CreateTaskModal 
        isOpen={isCreateTaskModalOpen} 
        onClose={() => setIsCreateTaskModalOpen(false)}
        defaultProjectId={projectId}
      />
    </>
  )
}
