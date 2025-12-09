import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: number
  name: string
  description: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  progress: number
  startDate?: string
  endDate?: string
  tasksCount: number
  membersCount: number
  owner: {
    id: number
    name: string
  }
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  
  fetchProjects: () => Promise<void>
  addProject: (project: Omit<Project, 'id'>) => Project
  updateProject: (id: number, updates: Partial<Project>) => void
  deleteProject: (id: number) => void
  setCurrentProject: (project: Project | null) => void
}

// Mock data
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Site Web E-commerce',
    description: 'Développement d\'une plateforme e-commerce complète',
    status: 'active',
    progress: 75,
    tasksCount: 12,
    membersCount: 5,
    owner: { id: 1, name: 'John Doe' }
  },
  {
    id: 2,
    name: 'Application Mobile',
    description: 'Application mobile pour la gestion de tâches',
    status: 'active',
    progress: 45,
    tasksCount: 8,
    membersCount: 3,
    owner: { id: 1, name: 'John Doe' }
  },
  {
    id: 3,
    name: 'Refonte Dashboard',
    description: 'Modernisation de l\'interface du dashboard',
    status: 'active',
    progress: 90,
    tasksCount: 3,
    membersCount: 4,
    owner: { id: 1, name: 'John Doe' }
  }
]

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: mockProjects,
      currentProject: null,
      isLoading: false,
      error: null,

      fetchProjects: async () => {
        set({ isLoading: true, error: null })
        try {
          // TODO: Remplacer par un vrai appel API
          await new Promise(resolve => setTimeout(resolve, 500))
          // Ne pas écraser les projets existants, seulement initialiser si vide
          const currentProjects = get().projects
          if (currentProjects.length === 0) {
            set({ projects: mockProjects, isLoading: false })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          set({ error: 'Erreur lors du chargement des projets', isLoading: false })
        }
      },

  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: Math.floor(Math.random() * 10000),
      tasksCount: 0,
      membersCount: 0,
      owner: { id: 1, name: 'Current User' }
    }
    set(state => ({
      projects: [...state.projects, newProject]
    }))
    return newProject
  },

  updateProject: (id, updates) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    }))
  },

  deleteProject: (id) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id)
    }))
  },

  setCurrentProject: (project) => {
    set({ currentProject: project })
  }
}),
    {
      name: 'project-storage',
    }
  )
)
