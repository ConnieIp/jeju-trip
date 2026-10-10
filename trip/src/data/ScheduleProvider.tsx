import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { DaySchedule, TripSchedule } from './types'

interface ScheduleContextValue {
  schedule: TripSchedule | null
  loading: boolean
  updateSchedule: (updater: (prev: TripSchedule) => TripSchedule) => Promise<void>
}

const ScheduleContext = createContext<ScheduleContextValue>({
  schedule: null,
  loading: true,
  updateSchedule: async () => {},
})

export function useSchedule() {
  return useContext(ScheduleContext)
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<TripSchedule | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSchedule = useCallback(async () => {
    const [metaResult, daysResult] = await Promise.all([
      supabase.from('schedule').select('data').eq('id', 'default').single(),
      supabase.from('schedule_day').select('day,data').order('day'),
    ])
    if (metaResult.error) throw metaResult.error
    if (daysResult.error) throw daysResult.error
    const overview =
      (metaResult.data?.data as { overview?: string } | null)?.overview ?? ''
    const days = (daysResult.data ?? [])
      .map(row => row.data as DaySchedule)
      .sort((a, b) => a.day - b.day)
    setSchedule({ overview, days })
  }, [])

  const updateSchedule = useCallback(async (updater: (prev: TripSchedule) => TripSchedule) => {
    setSchedule(prev => {
      if (!prev) return prev
      const next = updater(prev)
      const changedDays = next.days.filter(d => {
        const before = prev.days.find(p => p.day === d.day)
        return !before || JSON.stringify(before) !== JSON.stringify(d)
      })
      if (changedDays.length > 0) {
        supabase
          .from('schedule_day')
          .upsert(
            changedDays.map(d => ({ day: d.day, data: d })),
            { onConflict: 'day' }
          )
          .then(({ error }) => {
            if (error) console.warn('Failed to save schedule days:', error)
          })
      }
      if (next.overview !== prev.overview) {
        supabase
          .from('schedule')
          .update({ data: { overview: next.overview } })
          .eq('id', 'default')
          .then(({ error }) => {
            if (error) console.warn('Failed to save schedule overview:', error)
          })
      }
      return next
    })
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
    <ScheduleContext.Provider value={{ schedule, loading, updateSchedule }}>
      {children}
    </ScheduleContext.Provider>
  )
}
