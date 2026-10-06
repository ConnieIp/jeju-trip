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

async function updateVadada() {
  const slug = 'vadada'

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
    name: '바다다',
    nameZh: 'Vadada',
    nameKo: '바다다',
    type: '設計師咖啡廳',
    hours: ['11:00～18:00'],
    phone: '+82 64-738-2881',
    features: [
      '濟州海岸上的設計師綠洲',
      '度假村風格裝潢',
      '茂密綠植與現代燈飾',
      '舒適日光床',
      '中心泳池與壯觀海景',
      '多個觀景平台',
      '清新時尚的氛圍'
    ],
    notes: [
      '週五（韓文日）營業時間可能變動',
      '環境圍繞著中心泳池和壯觀海景而建',
      '適合沉浸在奢華度假氛圍中，同時欣賞大海的原始壯麗景色'
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

updateVadada().catch(console.error)
