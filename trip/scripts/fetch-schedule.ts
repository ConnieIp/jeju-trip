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

async function main() {
  console.log('Fetching current schedule from Supabase...\n')

  const { data, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('id', 'default')
    .single()

  if (error) {
    console.error('Error fetching schedule:', error)
    process.exit(1)
  }

  if (!data) {
    console.log('No schedule found in Supabase')
    return
  }

  console.log('Current schedule in Supabase:')
  console.log('ID:', data.id)
  console.log('Updated at:', data.updated_at)
  console.log('\nSchedule data:')
  console.log(JSON.stringify(data.data, null, 2))

  console.log('\n\n--- Checking for audit logs ---')
  
  // Try to query audit logs if available
  const { data: auditLogs, error: auditError } = await supabase
    .from('audit_log_events')
    .select('*')
    .eq('table_name', 'schedule')
    .order('created_at', { ascending: false })
    .limit(10)

  if (auditError) {
    console.log('Audit logs not accessible or not available:', auditError.message)
    console.log('\nNote: Audit logs require Supabase Pro plan or higher')
  } else if (auditLogs && auditLogs.length > 0) {
    console.log('\nRecent audit log entries for schedule table:')
    auditLogs.forEach((log, idx) => {
      console.log(`\n[${idx + 1}] ${log.created_at}`)
      console.log('Action:', log.action)
      console.log('Record:', JSON.stringify(log.record, null, 2))
    })
  } else {
    console.log('No audit logs found for schedule table')
  }
}

main().catch(console.error)
