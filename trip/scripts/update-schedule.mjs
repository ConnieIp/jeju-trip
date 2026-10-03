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
  const { data, error } = await supabase
    .from('schedule')
    .update({ data: schedule })
    .eq('id', 'default')
    .select()

  if (error) {
    console.error('Error:', JSON.stringify(error))
    process.exit(1)
  }

  console.log('Schedule updated successfully in Supabase')
  if (data) {
    console.log('Updated row count:', data.length)
  }
}

main()
