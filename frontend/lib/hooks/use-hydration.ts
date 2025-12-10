import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onHydrate(() => {
      setHydrated(false)
    })

    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    setHydrated(useAuthStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}
