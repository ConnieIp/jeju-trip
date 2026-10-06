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

async function updateManwolSutbulGui() {
  const slug = 'manwol-sutbul-gui'

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
    name: '만월숯불구이 애월본점',
    nameZh: 'Manwol Sutbul Gui Aewol',
    nameKo: '만월숯불구이 애월본점',
    type: '炭火烤肉',
    hours: ['11:00～23:00'],
    phone: '0507-1411-6021',
    features: [
      '涯月黑豬肉專門店',
      '海景/夜景優美',
      '海洋景觀餐廳',
      '自助吧',
      '免費停車',
      '適合家庭聚餐'
    ],
    notes: [
      '評分：3.6（2則評價）',
      '適合家庭聚餐、午餐、晚餐'
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

updateManwolSutbulGui().catch(console.error)
