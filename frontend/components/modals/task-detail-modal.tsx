'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTaskStore, Task } from '@/lib/stores/task-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { AssignMemberSelector } from '@/components/ui/assign-member-selector'

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const updateTask = useTaskStore(state => state.updateTask)
  const deleteTask = useTaskStore(state => state.deleteTask)
  const projects = useProjectStore(state => state.projects)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    status: 'todo' as 'todo' | 'in-progress' | 'review' | 'done',
    dueDate: '',
    assignedTo: undefined as { id: number; name: string; avatar?: string } | undefined
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        projectId: String(task.projectId),
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo
      })
      setIsEditing(false)
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    updateTask(task.id, {
      title: formData.title,
      description: formData.description,
      projectId: parseInt(formData.projectId),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      assignedTo: formData.assignedTo
    })

    setIsEditing(false)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(task.id)
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getProjectName = (projectId: number) => {
    return projects.find(p => p.id === projectId)?.name || 'Projet inconnu'
  }

  const priorityConfig = {
    low: { label: 'Basse', emoji: '🟢', color: 'bg-gray-100 text-gray-700' },
    medium: { label: 'Moyenne', emoji: '🟡', color: 'bg-yellow-100 text-yellow-700' },
    high: { label: 'Haute', emoji: '🔴', color: 'bg-red-100 text-red-700' },
    urgent: { label: 'Urgente', emoji: '⚠️', color: 'bg-orange-100 text-orange-700' }
  }

  const statusConfig = {
    todo: { label: 'À faire', emoji: '📋', color: 'bg-gray-100 text-gray-700' },
    'in-progress': { label: 'En cours', emoji: '⏳', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'En révision', emoji: '👀', color: 'bg-yellow-100 text-yellow-700' },
    done: { label: 'Terminé', emoji: '✅', color: 'bg-green-100 text-green-700' }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Modifier la tâche' : 'Détails de la tâche'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Projet <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priorité
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">🟢 Basse</option>
                  <option value="medium">🟡 Moyenne</option>
                  <option value="high">🔴 Haute</option>
                  <option value="urgent">⚠️ Urgente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="todo">📋 À faire</option>
                  <option value="in-progress">⏳ En cours</option>
                  <option value="review">👀 En révision</option>
                  <option value="done">✅ Terminé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigner à
              </label>
              <AssignMemberSelector
                value={formData.assignedTo}
                onChange={(member) => setFormData(prev => ({ ...prev, assignedTo: member }))}
                projectId={formData.projectId ? parseInt(formData.projectId) : undefined}
                placeholder="Sélectionner un membre..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Enregistrer
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {task.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Projet</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  📁 {getProjectName(task.projectId)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Priorité</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[task.priority].color}`}>
                  {priorityConfig[task.priority].emoji} {priorityConfig[task.priority].label}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[task.status].color}`}>
                  {statusConfig[task.status].emoji} {statusConfig[task.status].label}
                </span>
              </div>

              {task.dueDate && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date d'échéance</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    📅 {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>

            {task.assignedTo && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigné à</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl">{task.assignedTo.avatar || '👤'}</span>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {task.assignedTo.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={() => setIsEditing(true)} className="flex-1">
                Modifier
              </Button>
              <Button variant="outline" onClick={handleDelete} className="flex-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
