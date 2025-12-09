'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useTaskStore, Task } from '@/lib/stores/task-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { useNotificationStore } from '@/lib/stores/notification-store'
import { CreateTaskModal } from '@/components/modals/create-task-modal'
import { TaskDetailModal } from '@/components/modals/task-detail-modal'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core'

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectParam = searchParams.get('project')
  
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const tasks = useTaskStore(state => state.tasks)
  const updateTask = useTaskStore(state => state.updateTask)
  const fetchTasks = useTaskStore(state => state.fetchTasks)
  const projects = useProjectStore(state => state.projects)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    projectParam ? parseInt(projectParam) : null
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!user) {
        router.push('/auth/login')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-4xl mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDetailModalOpen(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === Number(event.active.id))
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = Number(active.id)
    const newStatus = over.id as Task['status']
    const task = tasks.find(t => t.id === taskId)

    if (task && task.status !== newStatus) {
      updateTask(taskId, { status: newStatus })
    }
  }

  const filteredTasks = selectedProjectId 
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : tasks

  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    done: filteredTasks.filter(t => t.status === 'done')
  }

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === parseInt(projectId))?.name || 'Projet inconnu'
  }

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) 
    : null

  const statusConfig = {
    todo: { label: 'À faire', color: 'gray', emoji: '📋' },
    'in-progress': { label: 'En cours', color: 'blue', emoji: '⏳' },
    review: { label: 'En révision', color: 'yellow', emoji: '👀' },
    done: { label: 'Terminé', color: 'green', emoji: '✅' }
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
              <button onClick={() => router.push('/projects')} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 bg-transparent border-0 cursor-pointer">
                Projets
              </button>
              <button onClick={() => router.push('/tasks')} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium bg-transparent border-0 cursor-pointer">
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
        {!selectedProjectId ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sélectionnez un projet</h2>
              <p className="text-gray-600 dark:text-gray-400">Choisissez un projet pour voir et gérer ses tâches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600">
                      {project.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status === 'active' ? 'Actif' :
                       project.status === 'completed' ? 'Terminé' : 'Brouillon'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 dark:text-gray-400">
                        📋 {tasks.filter(t => t.projectId === project.id).length} tâches
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        👥 {project.membersCount}
                      </span>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProjectId(null)}
                  className="flex items-center gap-2"
                >
                  ← Retour
                </Button>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedProject?.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {selectedProject?.description}
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>+ Nouvelle tâche</Button>
            </div>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
              const config = statusConfig[status as keyof typeof statusConfig]
              return (
                <DroppableColumn key={status} id={status}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>{config.emoji}</span>
                        {config.label}
                      </h3>
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-2 py-1 rounded-full">
                        {statusTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {statusTasks.map((task) => (
                        <DraggableTask key={task.id} task={task} onClick={() => handleTaskClick(task)}>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{task.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                          
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className={`px-2 py-1 rounded ${
                              task.priority === 'urgent' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                              task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {task.priority === 'urgent' ? '⚠️ Urgente' :
                               task.priority === 'high' ? '🔴 Haute' :
                               task.priority === 'medium' ? '🟡 Moyenne' : '🟢 Basse'}
                            </span>
                          </div>

                          {task.assignedTo && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <span className="text-base">{task.assignedTo.avatar || '👤'}</span>
                              <span className="truncate">{task.assignedTo.name}</span>
                            </div>
                          )}
                        </DraggableTask>
                      ))}

                      {statusTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                          Aucune tâche
                        </div>
                      )}
                    </div>
                  </div>
                </DroppableColumn>
              )
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-2xl opacity-80 cursor-grabbing">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{activeTask.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{activeTask.description}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

            {filteredTasks.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Aucune tâche</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Créez votre première tâche pour ce projet</p>
                <Button onClick={() => setIsCreateModalOpen(true)}>Créer une tâche</Button>
              </div>
            )}
          </>
        )}
      </main>

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        defaultProjectId={selectedProjectId || undefined}
      />
      
      <TaskDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedTask(null)
        }} 
        task={selectedTask}
      />
      </div>
    </>
  )
}

// Composant pour les colonnes droppables
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })
  
  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  )
}

// Composant pour les tâches draggables
function DraggableTask({ task, children, onClick }: { task: Task; children: React.ReactNode; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  )
}



