import { supabase } from './supabaseClient'

export function photoUrl(path: string): string {
  if (!path) return ''
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  return data.publicUrl
}
