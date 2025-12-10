'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/lib/stores/task-store'
import { useProjectStore } from '@/lib/stores/project-store'
import { useNotificationStore } from '@/lib/stores/notification-store'
import { AssignMemberSelector } from '@/components/ui/assign-member-selector'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  defaultProjectId?: number
}

export function CreateTaskModal({ isOpen, onClose, defaultProjectId }: CreateTaskModalProps) {
  const addTask = useTaskStore(state => state.addTask)
  const projects = useProjectStore(state => state.projects)
  const addNotification = useNotificationStore(state => state.addNotification)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: defaultProjectId ? String(defaultProjectId) : '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    status: 'todo' as 'todo' | 'in-progress' | 'review' | 'done',
    dueDate: '',
    assignedTo: undefined as { id: number; name: string; avatar?: string } | undefined
  })

  useEffect(() => {
    if (defaultProjectId) {
      setFormData(prev => ({
        ...prev,
        projectId: String(defaultProjectId)
      }))
    }
  }, [defaultProjectId])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.projectId) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const newTask = addTask({
      title: formData.title,
      description: formData.description,
      projectId: parseInt(formData.projectId),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || undefined,
      assignedTo: formData.assignedTo,
      position: 0
    })

    const project = projects.find(p => p.id === parseInt(formData.projectId))
    addNotification({
      type: 'task',
      title: 'Nouvelle tâche créée',
      message: `La tâche "${formData.title}" a été créée dans le projet "${project?.name || 'Inconnu'}"`,
      taskId: newTask.id,
      projectId: parseInt(formData.projectId)
    })

    setFormData({
      title: '',
      description: '',
      projectId: defaultProjectId ? String(defaultProjectId) : '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      assignedTo: undefined
    })
    
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Créer une nouvelle tâche</h2>
        </div>

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
              placeholder="Ex: Développer la page d'accueil"
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
              placeholder="Décrivez la tâche..."
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
                disabled={!!defaultProjectId}
              >
                <option value="">Sélectionner un projet</option>
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
              Créer la tâche
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
