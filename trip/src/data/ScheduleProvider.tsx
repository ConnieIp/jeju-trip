import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { TripSchedule } from './types'

interface ScheduleContextValue {
  schedule: TripSchedule | null
  loading: boolean
}

const ScheduleContext = createContext<ScheduleContextValue>({
  schedule: null,
  loading: true,
})

export function useSchedule() {
  return useContext(ScheduleContext)
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<TripSchedule | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSchedule = useCallback(async () => {
    const { data, error } = await supabase
      .from('schedule')
      .select('data')
      .eq('id', 'default')
      .single()
    if (error) throw error
    setSchedule(data.data as TripSchedule)
  }, [])

  useEffect(() => {
    const envUrl = import.meta.env.VITE_SUPABASE_URL
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!envUrl || !envKey) {
      console.warn('Supabase env vars not set — schedule will be empty')
      setLoading(false)
      return
    }

    fetchSchedule()
      .catch((err) => console.warn('Failed to load schedule:', err))
      .finally(() => setLoading(false))
  }, [fetchSchedule])

  return (
    <ScheduleContext.Provider value={{ schedule, loading }}>
      {children}
    </ScheduleContext.Provider>
  )
}
