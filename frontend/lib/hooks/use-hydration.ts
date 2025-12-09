import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Attendre que Zustand termine l'hydratation depuis localStorage
    const unsubHydrate = useAuthStore.persist.onHydrate(() => {
      setHydrated(false)
    })

    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    // Au cas où l'hydratation est déjà terminée
    setHydrated(useAuthStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}
