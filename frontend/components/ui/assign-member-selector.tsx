'use client'

import { useState, useEffect, useRef } from 'react'
import { useTeamStore, TeamMember } from '@/lib/stores/team-store'

interface AssignMemberSelectorProps {
  value?: { id: number; name: string; avatar?: string }
  onChange: (member: { id: number; name: string; avatar?: string } | undefined) => void
  projectId?: number
  placeholder?: string
}

export function AssignMemberSelector({ value, onChange, projectId, placeholder = "Assigner à..." }: AssignMemberSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const members = useTeamStore(state => state.members)
  const fetchMembers = useTeamStore(state => state.fetchMembers)

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [isOpen])

  const availableMembers = members

  const handleSelect = (member: TeamMember | null) => {
    if (member) {
      onChange({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        avatar: member.avatar
      })
    } else {
      onChange(undefined)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 transition"
      >
        <span className="flex items-center gap-2">
          {value ? (
            <>
              <span className="text-2xl">{value.avatar || '👤'}</span>
              <span>{value.name}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed z-[101] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: '320px'
            }}
          >
            {value && (
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-700 z-10"
              >
                <span className="text-xl">❌</span>
                <span className="font-medium">Non assigné</span>
              </button>
            )}
            {availableMembers.length === 0 ? (
              <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                Aucun membre disponible
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {availableMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelect(member)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-3 ${
                      value?.id === member.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{member.avatar || '👤'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.role}
                      </div>
                    </div>
                    {value?.id === member.id && (
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
