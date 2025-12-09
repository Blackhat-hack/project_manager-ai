import { create } from 'zustand'

export interface TeamMember {
  id: number
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: string
  projectIds: number[]
}

interface TeamState {
  members: TeamMember[]
  isLoading: boolean
  error: string | null
  
  fetchMembers: (projectId?: number) => Promise<void>
  addMember: (member: Omit<TeamMember, 'id' | 'projectIds'>) => TeamMember
  getProjectMembers: (projectId: number) => TeamMember[]
  getMemberById: (id: number) => TeamMember | undefined
}

// Mock team members data
const mockMembers: TeamMember[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice.martin@example.com',
    avatar: '👩‍💼',
    role: 'Chef de projet',
    projectIds: [1, 2]
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Durant',
    email: 'bob.durant@example.com',
    avatar: '👨‍💻',
    role: 'Développeur Backend',
    projectIds: [1]
  },
  {
    id: 3,
    firstName: 'Claire',
    lastName: 'Dubois',
    email: 'claire.dubois@example.com',
    avatar: '👩‍🎨',
    role: 'Designer UI/UX',
    projectIds: [1, 3]
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Lefebvre',
    email: 'david.lefebvre@example.com',
    avatar: '👨‍💼',
    role: 'Développeur Frontend',
    projectIds: [2, 3]
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Bernard',
    email: 'emma.bernard@example.com',
    avatar: '👩‍🔬',
    role: 'QA Engineer',
    projectIds: [1, 2, 3]
  }
]

export const useTeamStore = create<TeamState>((set, get) => ({
  members: mockMembers,
  isLoading: false,
  error: null,

  fetchMembers: async (projectId?: number) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      // Always store all members in the store
      set({ members: mockMembers, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors du chargement des membres', isLoading: false })
    }
  },

  addMember: (member) => {
    // Générer un avatar aléatoire
    const avatars = ['👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍💻', '🧑‍💼']
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
    
    const newMember: TeamMember = {
      ...member,
      id: Math.floor(Math.random() * 10000),
      avatar: randomAvatar,
      projectIds: []
    }
    
    // Ajouter au mockMembers pour qu'il persiste
    mockMembers.push(newMember)
    
    set(state => ({
      members: [...state.members, newMember]
    }))
    
    return newMember
  },

  getProjectMembers: (projectId: number) => {
    // Filter from mockMembers, not from store members
    return mockMembers.filter(m => m.projectIds.includes(projectId))
  },

  getMemberById: (id: number) => {
    return mockMembers.find(m => m.id === id)
  }
}))
