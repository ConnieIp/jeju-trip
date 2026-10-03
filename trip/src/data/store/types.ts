import type { Spot } from '../types'

export interface RemoteSpot {
  slug: string
  source: 'user' | 'builtin'
  deleted: boolean
  data: Spot | null
  created_by: string | null
  updated_at: string
}

export interface SpotStore {
  listRemote(): Promise<RemoteSpot[]>
  create(spot: Spot, userId: string): Promise<void>
  update(slug: string, patch: Spot, userId: string): Promise<void>
  tombstone(slug: string, userId: string): Promise<void>
}
