import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { join } from 'path'

config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateJejuYukuro() {
  const slug = 'jeju-yukuro'

  console.log('Fetching current record...')
  const { data: current, error: fetchError } = await supabase
    .from('spots')
    .select('*')
    .eq('slug', slug)
    .single()

  if (fetchError) {
    console.error('Fetch failed:', fetchError)
    process.exit(1)
  }

  console.log('Current record:', JSON.stringify(current, null, 2))

  const updatedData = {
    ...current.data,
    name: '제주육로',
    nameZh: 'Jeju Yukuro',
    nameKo: '제주육로',
    type: '濟州黑豬肉燒肉',
    hours: ['16:00～01:00'],
    phone: '010-9334-4244',
    features: [
      '戶外座位',
      '私人宴會廳',
      '素食選擇',
      '高級氛圍',
      '可預約',
      '免費自帶酒水（Corkage Free）'
    ],
    notes: [
      '公休日：每週二',
      '週五（韓文日）營業時間可能變動',
      '適合聚餐、公司宴會、晚餐聚會'
    ]
  }

  console.log('\nUpdating record...')
  const { data: updated, error: updateError } = await supabase
    .from('spots')
    .upsert(
      {
        slug: slug,
        source: current?.source || 'builtin',
        data: updatedData,
        created_by: current?.created_by || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )
    .select()
    .single()

  if (updateError) {
    console.error('Update failed:', updateError)
    process.exit(1)
  }

  console.log('Update successful!')
  console.log('Updated record:', JSON.stringify(updated, null, 2))
}

updateJejuYukuro().catch(console.error)
