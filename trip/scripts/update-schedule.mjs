import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf8')

const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/)
const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)

if (!urlMatch || !keyMatch) {
  console.error('Could not find Supabase credentials in .env.local')
  process.exit(1)
}

const supabaseUrl = urlMatch[1].trim()
const supabaseKey = keyMatch[1].trim()

const supabase = createClient(supabaseUrl, supabaseKey)

const schedule = JSON.parse(
  readFileSync(resolve(__dirname, '../src/data/generated/schedule.json'), 'utf8')
)

async function main() {
  if (!schedule.days?.length) {
    console.error('No days found in generated/schedule.json')
    process.exit(1)
  }

  const rows = schedule.days.map(d => ({ day: d.day, data: d }))
  const { error: daysError } = await supabase
    .from('schedule_day')
    .upsert(rows, { onConflict: 'day' })

  if (daysError) {
    console.error('Error upserting schedule_day:', JSON.stringify(daysError))
    process.exit(1)
  }
  console.log('Upserted', rows.length, 'day rows into schedule_day')

  const { error: overviewError } = await supabase
    .from('schedule')
    .update({ data: { overview: schedule.overview ?? '' } })
    .eq('id', 'default')
    .select()

  if (overviewError) {
    console.error('Error updating schedule overview:', JSON.stringify(overviewError))
    process.exit(1)
  }
  console.log('Schedule overview updated in Supabase')
}

main()
