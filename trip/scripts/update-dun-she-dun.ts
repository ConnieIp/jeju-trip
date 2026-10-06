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

async function updateDunSheDun() {
  const slug = 'dun-she-dun'

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
    name: '둔셰둔 本店',
    nameZh: '豚舍豚',
    nameKo: '둔셰둔',
    type: '濟州黑豬肉專門店',
    hours: ['12:00～22:00'],
    phone: '+82-64-746-8989',
    features: [
      '2006年開業的濟州黑豬肉專賣店',
      '人氣極高，常需要排隊候位',
      '招牌餐點為烤濟州黑豬肉',
      '另有辛奇鍋',
      '店員代烤，可輕鬆用餐',
      '用煤炭取代木炭，使烤肉散發獨特香氣'
    ],
    notes: [
      '公休日：週二',
      '有停車設施'
    ],
    links: [
      {
        label: 'Visit Korea',
        url: 'https://big5chinese.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=53553'
      }
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

updateDunSheDun().catch(console.error)
