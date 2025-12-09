'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useTeamStore } from '@/lib/stores/team-store'
import { useNotificationStore } from '@/lib/stores/notification-store'
import { InviteMemberModal } from '@/components/modals/invite-member-modal'

export default function TeamPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const members = useTeamStore(state => state.members)
  const fetchMembers = useTeamStore(state => state.fetchMembers)
  const addMember = useTeamStore(state => state.addMember)
  const addNotification = useNotificationStore(state => state.addNotification)
  const unreadCount = useNotificationStore(state => state.unreadCount)

  useEffect(() => {
    fetchMembers()
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!user) {
        router.push('/auth/login')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router, fetchMembers])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleInviteMember = (memberData: { firstName: string; lastName: string; email: string; role: string }) => {
    const newMember = addMember(memberData)
    
    // Ajouter une notification
    addNotification({
      type: 'info',
      title: 'Membre invité',
      message: `${newMember.firstName} ${newMember.lastName} a été invité à rejoindre l'équipe`
    })
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

  return (
    <>
      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />
      
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Équipe</h2>
            <Button onClick={() => setIsInviteModalOpen(true)}>+ Inviter un membre</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm font-medium">
                    {member.role}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/team/${member.id}`)}
                    >
                      Profil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Statistiques de l'équipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{members.length}</div>
                <p className="text-gray-600 dark:text-gray-400">Membres totaux</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                <p className="text-gray-600 dark:text-gray-400">Projets actifs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
                <p className="text-gray-600 dark:text-gray-400">Taux de complétion</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
