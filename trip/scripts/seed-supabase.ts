import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const dataDir = resolve(__dirname, '../src/data/generated')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars. Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const files = [
  'attractions.json',
  'restaurants.json',
  'cafes.json',
  'bakeries.json',
  'souvenirs.json',
]

async function seedSpots() {
  const spots: Record<string, unknown>[] = []

  for (const file of files) {
    const path = resolve(dataDir, file)
    const data = JSON.parse(readFileSync(path, 'utf-8'))
    for (const spot of data as Record<string, unknown>[]) {
      spots.push({
        slug: spot.slug as string,
        source: 'builtin',
        deleted: false,
        data: spot,
      })
    }
  }

  console.log(`Seeding ${spots.length} spots...`)

  const { error } = await supabase
    .from('spots')
    .upsert(spots, { onConflict: 'slug' })

  if (error) {
    console.error('Spot seed failed:', error)
    process.exit(1)
  }

  console.log('Spots done.')
}

async function seedSchedule() {
  const schedulePath = resolve(dataDir, 'schedule.json')
  const scheduleData = JSON.parse(readFileSync(schedulePath, 'utf-8'))

  console.log('Seeding schedule...')

  const { error: scheduleError } = await supabase
    .from('schedule')
    .upsert({ id: 'default', data: scheduleData }, { onConflict: 'id' })

  if (scheduleError) {
    console.error('Schedule seed failed:', scheduleError)
    process.exit(1)
  }

  console.log('Schedule done.')
}

const mode = process.argv[2] || 'all'

async function main() {
  if (mode === 'spots') {
    await seedSpots()
  } else if (mode === 'schedule') {
    await seedSchedule()
  } else {
    await seedSpots()
    await seedSchedule()
  }
  console.log('All done.')
}

main()
