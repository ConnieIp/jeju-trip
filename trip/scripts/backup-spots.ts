import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupFile = `../db_backup/spots_${timestamp}.json`

  console.log('Backing up spots table...')
  const { data, error } = await supabase
    .from('spots')
    .select('*')

  if (error) {
    console.error('Backup failed:', error)
    process.exit(1)
  }

  const fs = await import('fs')
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2))
  console.log(`Backup created: ${backupFile}`)
  console.log(`Total records: ${data.length}`)
}

backup().catch(console.error)
