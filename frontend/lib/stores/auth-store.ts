import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        })
      },

      login: async (email: string, password: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Récupérer les utilisateurs stockés
          const usersJson = localStorage.getItem('registered-users')
          const users = usersJson ? JSON.parse(usersJson) : []
          
          // Trouver l'utilisateur avec cet email
          const foundUser = users.find((u: any) => u.email === email && u.password === password)
          
          if (!foundUser) {
            throw new Error('Email ou mot de passe incorrect')
          }

          const mockUser: User = {
            id: foundUser.id,
            email: foundUser.email,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            roles: ['ROLE_USER']
          }

          set({
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now(),
            isAuthenticated: true
          })
        } catch (error) {
          throw error
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Récupérer les utilisateurs existants
          const usersJson = localStorage.getItem('registered-users')
          const users = usersJson ? JSON.parse(usersJson) : []
          
          // Vérifier si l'email existe déjà
          if (users.some((u: any) => u.email === email)) {
            throw new Error('Cet email est déjà utilisé')
          }
          
          const newUser = {
            id: Math.floor(Math.random() * 1000).toString(),
            email,
            password,
            firstName,
            lastName
          }
          
          // Ajouter le nouvel utilisateur
          users.push(newUser)
          localStorage.setItem('registered-users', JSON.stringify(users))

          const mockUser: User = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            roles: ['ROLE_USER']
          }

          set({
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now(),
            isAuthenticated: true
          })
        } catch (error) {
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
