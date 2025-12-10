import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
  id: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  projectId: number
  assignedTo?: {
    id: number
    name: string
    avatar?: string
  }
  dueDate?: string
  position: number
}

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  
  fetchTasks: (projectId: number) => Promise<void>
  addTask: (task: Omit<Task, 'id'>) => Task
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  moveTask: (id: number, newStatus: 'todo' | 'in-progress' | 'review' | 'done', newPosition: number) => void
}

const mockTasksData: Task[] = [
  {
    id: 1,
    title: 'Conception de l\'interface utilisateur',
    description: 'Créer les maquettes Figma',
    status: 'done',
    priority: 'high',
    projectId: 1,
    assignedTo: { id: 1, name: 'Alice Martin' },
    position: 0
  },
  {
    id: 2,
    title: 'Développement du backend API',
    description: 'Créer les endpoints REST',
    status: 'in-progress',
    priority: 'high',
    projectId: 1,
    assignedTo: { id: 2, name: 'Bob Durant' },
    position: 0
  },
  {
    id: 3,
    title: 'Tests unitaires',
    description: 'Écrire les tests pour les composants',
    status: 'todo',
    priority: 'medium',
    projectId: 1,
    position: 0
  }
]

export const useTaskStore = create<TaskState>()(persist(
  (set, get) => ({
  tasks: mockTasksData,
  isLoading: false,
  error: null,

  fetchTasks: async (projectId: number) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const currentTasks = get().tasks
      
      if (currentTasks.length === 0) {
        const mockTasks: Task[] = [
          {
            id: 1,
            title: 'Conception de l\'interface utilisateur',
            description: 'Créer les maquettes Figma',
            status: 'done',
            priority: 'high',
            projectId,
            assignedTo: { id: 1, name: 'Alice Martin' },
            position: 0
          },
          {
            id: 2,
            title: 'Développement du backend API',
            description: 'Créer les endpoints REST',
            status: 'in-progress',
            priority: 'high',
            projectId,
            assignedTo: { id: 2, name: 'Bob Durant' },
            position: 0
          },
          {
            id: 3,
            title: 'Tests unitaires',
            description: 'Écrire les tests pour les composants',
            status: 'todo',
            priority: 'medium',
            projectId,
            position: 0
          }
        ]
        
        set({ tasks: mockTasks, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ error: 'Erreur lors du chargement des tâches', isLoading: false })
    }
  },

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Math.floor(Math.random() * 10000)
    }
    set(state => ({
      tasks: [...state.tasks, newTask]
    }))
    return newTask
  },

  updateTask: (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }))
  },

  deleteTask: (id) => {
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }))
  },

  moveTask: (id, newStatus, newPosition) => {
    set(state => ({
      tasks: state.tasks.map(t => 
        t.id === id ? { ...t, status: newStatus, position: newPosition } : t
      )
    }))
  }
}),
  {
    name: 'task-storage',
  }
))
