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

async function updatePigalhoeok() {
  const slug = 'pigalhoeok'

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
    name: '피갈회옥',
    nameZh: 'Pigalhoeok',
    nameKo: '피갈회옥',
    type: '海鮮餐廳',
    hours: ['12:00～22:00'],
    phone: '+82 10-3404-1568',
    features: [
      '濟州島城山的人氣海鮮餐廳',
      '高CP值的在地美食名店',
      '一桌就能同時品嚐鮮美海味與濟州黑豬的雙重美味',
      '每日現流直送的活魚生魚片',
      '最受歡迎：2~3人份的海鮮套餐',
      '已開放 Catchtable 線上訂位'
    ],
    notes: [
      '公休日：週三（偶有更動，建議以官方公告為主）',
      '最後點餐時間 21:00',
      '推薦加點炸物與辣魚湯'
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

updatePigalhoeok().catch(console.error)
