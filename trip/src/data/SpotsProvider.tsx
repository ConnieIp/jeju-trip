import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabaseStore } from './store/supabase'
import type { Spot } from './types'
import { useAuth } from '../auth/AuthContext'

interface SpotsContextValue {
  spots: Spot[]
  loading: boolean
  addSpot: (spot: Spot) => Promise<void>
  updateSpot: (slug: string, patch: Spot) => Promise<void>
  removeSpot: (slug: string) => Promise<void>
  getSpot: (slug: string) => Spot | undefined
}

const SpotsContext = createContext<SpotsContextValue>({
  spots: [],
  loading: true,
  addSpot: async () => {},
  updateSpot: async () => {},
  removeSpot: async () => {},
  getSpot: () => undefined,
})

export function useSpots() {
  return useContext(SpotsContext)
}

export function SpotsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)

  const refreshFromRemote = useCallback(async () => {
    const rows = await supabaseStore.listRemote()
    setSpots(rows.filter((r) => r.data).map((r) => r.data as Spot))
  }, [])

  useEffect(() => {
    const envUrl = import.meta.env.VITE_SUPABASE_URL
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!envUrl || !envKey) {
      console.warn('Supabase env vars not set — spots will be empty')
      setLoading(false)
      return
    }

    refreshFromRemote()
      .catch((err) => console.warn('Failed to load spots:', err))
      .finally(() => setLoading(false))
  }, [refreshFromRemote])

  const addSpot = useCallback(
    async (spot: Spot) => {
      if (!user) throw new Error('Must be signed in')
      await supabaseStore.create(spot, user.id)
      await refreshFromRemote()
    },
    [user, refreshFromRemote],
  )

  const updateSpot = useCallback(
    async (slug: string, patch: Spot) => {
      if (!user) throw new Error('Must be signed in')
      await supabaseStore.update(slug, patch, user.id)
      await refreshFromRemote()
    },
    [user, refreshFromRemote],
  )

  const removeSpot = useCallback(
    async (slug: string) => {
      if (!user) throw new Error('Must be signed in')
      await supabaseStore.tombstone(slug, user.id)
      await refreshFromRemote()
    },
    [user, refreshFromRemote],
  )

  const getSpot = useCallback(
    (slug: string) => spots.find((s) => s.slug === slug),
    [spots],
  )

  return (
    <SpotsContext.Provider value={{ spots, loading, addSpot, updateSpot, removeSpot, getSpot }}>
      {children}
    </SpotsContext.Provider>
  )
}
