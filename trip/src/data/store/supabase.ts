import { supabase } from '../../lib/supabaseClient'
import type { SpotStore, RemoteSpot } from './types'
import type { Spot } from '../types'

export const supabaseStore: SpotStore = {
  async listRemote(): Promise<RemoteSpot[]> {
    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .neq('deleted', true)
    if (error) throw error
    return data as RemoteSpot[]
  },

  async create(spot: Spot, userId: string): Promise<void> {
    const { error } = await supabase
      .from('spots')
      .insert({
        slug: spot.slug,
        source: 'user',
        data: spot as unknown as Record<string, unknown>,
        created_by: userId,
      })
    if (error) throw error
  },

  async update(slug: string, patch: Spot, userId: string): Promise<void> {
    const source = slug.startsWith('user-') ? 'user' : 'builtin'
    const { error } = await supabase
      .from('spots')
      .upsert(
        {
          slug,
          source,
          data: patch as unknown as Record<string, unknown>,
          created_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      )
    if (error) throw error
  },

  async tombstone(slug: string, userId: string): Promise<void> {
    const source = slug.startsWith('user-') ? 'user' : 'builtin'
    const { error } = await supabase
      .from('spots')
      .upsert(
        {
          slug,
          source,
          deleted: true,
          data: null,
          created_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      )
    if (error) throw error
  },
}
