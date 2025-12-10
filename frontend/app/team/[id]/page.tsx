'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useTeamStore } from '@/lib/stores/team-store'
import { useTaskStore } from '@/lib/stores/task-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { useNotificationStore } from '@/lib/stores/notification-store'

export default function TeamMemberDetailPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = parseInt(params.id as string)
  
  const [isLoading, setIsLoading] = useState(true)
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const getMemberById = useTeamStore(state => state.getMemberById)
  const tasks = useTaskStore(state => state.tasks)
  const projects = useProjectStore(state => state.projects)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  const member = getMemberById(memberId)

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

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Membre non trouvé</p>
          <Button onClick={() => router.push('/team')}>Retour à l'équipe</Button>
        </div>
      </div>
    )
  }

  const memberTasks = tasks.filter(task => task.assignedTo?.id === memberId)
  const completedTasks = memberTasks.filter(task => task.status === 'done')
  const inProgressTasks = memberTasks.filter(task => task.status === 'in-progress')
  const todoTasks = memberTasks.filter(task => task.status === 'todo')

  const memberProjects = projects.filter(project => member.projectIds.includes(project.id))

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
              <a href="/projects" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                Projets
              </a>
              <a href="/tasks" className="text-gray-500 dark:text-gray-400 hover:text-blue-600">
                Tâches
              </a>
              <a href="/team" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">
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
        <Button 
          variant="outline" 
          onClick={() => router.push('/team')}
          className="mb-6"
        >
          ← Retour à l'équipe
        </Button>

        {/* Member Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-5xl flex-shrink-0">
              {member.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {member.firstName} {member.lastName}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{member.email}</p>
              <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {member.role}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{memberTasks.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Tâches totales</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Terminées</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">🔄</div>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">En cours</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-2xl font-bold text-gray-600">{todoTasks.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">À faire</div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Projets assignés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberProjects.length > 0 ? (
              memberProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      project.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {project.status === 'completed' ? 'Terminé' :
                       project.status === 'active' ? 'En cours' : 'Planifié'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                Aucun projet assigné
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tâches assignées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberTasks.length > 0 ? (
              memberTasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId)
                return (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer"
                    onClick={() => router.push('/tasks')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}>
                        {task.priority === 'high' ? 'Haute' :
                         task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{project?.name || 'Projet inconnu'}</span>
                      <span className={`px-2 py-1 rounded font-medium ${
                        task.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {task.status === 'done' ? 'Terminée' :
                         task.status === 'in-progress' ? 'En cours' : 'À faire'}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                Aucune tâche assignée
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
