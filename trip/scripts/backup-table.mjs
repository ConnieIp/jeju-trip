import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8')
const url = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim()
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim()
const sb = createClient(url, key)

const table = process.argv[2] || 'schedule'

const { data, error } = await sb.from(table).select('*')
if (error) {
  console.error('ERR', JSON.stringify(error))
  process.exit(1)
}
console.log(`${table} rows:`, data.length)
if (table === 'schedule') {
  console.log('ids:', data.map((r) => r.id), '| updated_at:', data.map((r) => r.updated_at))
}
const ts = new Date().toISOString().slice(0, 19).replace('T', '_').replaceAll(':', '-')
const out = resolve(__dirname, '..', '..', 'db_backup', `${table}_${ts}.json`)
writeFileSync(
  out,
  JSON.stringify({ table, backedUpAt: new Date().toISOString(), rows: data }, null, 2)
)
console.log('backup written:', out)

if (process.argv[3] === '--probe') {
  for (const t of ['schedule_day', 'scheduleDay', 'scheduleday']) {
    const r = await sb.from(t).select('*').limit(1)
    console.log('probe', t, r.error ? `missing (${r.error.message.slice(0, 60)})` : 'EXISTS')
  }
  const rpc = await sb.rpc('exec_sql', { sql: 'select 1' })
  console.log('exec_sql rpc:', rpc.error ? 'not available' : 'available')
}
