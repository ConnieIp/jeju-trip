import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const backup = JSON.parse(
  readFileSync(resolve(__dirname, '../../db_backup/schedule_2026-10-10_15-31-12.json'), 'utf8')
)
const row = backup.rows.find((r) => r.id === 'default')
const days = [...row.data.days].sort((a, b) => a.day - b.day)
if (!days || days.length !== 6) {
  console.error('unexpected days:', days && days.length)
  process.exit(1)
}

const values = days
  .map((d) => {
    const json = JSON.stringify(d)
    if (json.includes('$json$')) throw new Error('day ' + d.day + ' JSON contains dollar-quote tag')
    return `  (${d.day}, $json$${json}$json$::jsonb)`
  })
  .join(',\n')

const sql = `-- Create schedule_day table: one record per day schedule
-- Split from the schedule table's single jsonb blob (plan-16).
-- Idempotent: safe to re-run.

create table if not exists public.schedule_day (
  day int primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.schedule_day enable row level security;

drop policy if exists "Public read schedule_day" on public.schedule_day;
create policy "Public read schedule_day"
  on public.schedule_day for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert schedule_day" on public.schedule_day;
create policy "Public insert schedule_day"
  on public.schedule_day for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public update schedule_day" on public.schedule_day;
create policy "Public update schedule_day"
  on public.schedule_day for update
  to anon, authenticated
  using (true)
  with check (true);

-- Seed the 6 day records from the existing schedule blob
-- (source backup: db_backup/schedule_2026-10-10_15-31-12.json)
insert into public.schedule_day (day, data) values
${values}
on conflict (day) do update
  set data = excluded.data,
      updated_at = now();
`

const out = resolve(__dirname, '..', 'migrations', 'create-schedule-day-table.sql')
writeFileSync(out, sql)
console.log('written:', out)
console.log('days:', days.map((d) => `${d.day}:${d.date}`).join(' '))
