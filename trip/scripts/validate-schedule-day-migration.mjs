import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(resolve(__dirname, '..', 'migrations', 'create-schedule-day-table.sql'), 'utf8')
const backup = JSON.parse(
  readFileSync(resolve(__dirname, '../../db_backup/schedule_2026-10-10_15-31-12.json'), 'utf8')
)
const expected = backup.rows[0].data.days

const parts = sql.split('$json$')
const count = (parts.length - 1) / 2
console.log('json literal segments:', count)

let ok = count === expected.length
for (let i = 1; i < parts.length; i += 2) {
  const parsed = JSON.parse(parts[i])
  const exp = expected.find((d) => d.day === parsed.day)
  if (JSON.stringify(parsed) !== JSON.stringify(exp)) {
    ok = false
    console.log('MISMATCH day', parsed.day)
  }
}
console.log('round-trip:', ok ? `all ${count} days match backup exactly` : 'FAILED')

// ensure the tag never appears inside a literal
const insideTag = parts.filter((_, i) => i % 2 === 1)
console.log('tag collision:', insideTag.some((p) => p.includes('$json$')) ? 'FOUND' : 'none')
