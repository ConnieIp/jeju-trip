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

async function updateGihoHoejip() {
  const slug = 'giho-hoejip'

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
    name: '기회횟집',
    nameZh: 'Giho Hoejip',
    nameKo: '기회횟집',
    type: '生魚片專門店',
    hours: ['16:00～00:00'],
    phone: '010-5883-5210',
    features: [
      '以高等魚回（고등어회，鯖魚生魚片）聞名',
      '適合酒聚、獨食、晚餐',
      '份量十足',
      '環境整潔',
      '支援自帶酒水（Corkage）',
      '可預約'
    ],
    notes: [
      'Last order 12 minutes before closing',
      '人氣菜單：綜合生魚片+紅蝦生魚片、鯖魚生魚片+帶魚生魚片等'
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

updateGihoHoejip().catch(console.error)
