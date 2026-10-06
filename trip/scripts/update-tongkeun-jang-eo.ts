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

async function updateTongkeunJangEo() {
  const slug = 'tongkeun-jang-eo'

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
    name: '통큰장어',
    nameZh: '大份量烤鰻魚',
    nameKo: '통큰장어',
    type: '烤鰻魚專門店',
    hours: ['10:00～24:00'],
    features: [
      '韓國高性價比烤鰻魚連鎖/專門店品牌',
      '在濟州島、江原道春川等地都有分店',
      '主打平價、大份量的豐川淡水鰻魚（풍천민물장어）與盲鰻（꼼장어）',
      '部分門市也提供豬五花等肉類選擇',
      '以實惠的價格提供新鮮現宰的炭火烤鰻魚',
      '深受當地居民與遊客喜愛',
      '店面空間寬敞，適合家庭聚餐或團體聚會'
    ],
    notes: [
      '濟州通큰장어（總店）位於濟州市梨洞二洞',
      '營業時間通常為 10:00 至 24:00'
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

updateTongkeunJangEo().catch(console.error)
