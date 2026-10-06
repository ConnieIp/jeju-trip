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

async function revertTongkeunJangEo() {
  const slug = 'tongkeun-jang-eo'

  const originalData = {
    name: '통큰장어',
    slug: 'tongkeun-jang-eo',
    type: 'Restaurant - 鰻魚',
    links: [
      {
        url: 'https://www.instagram.com/jeju_tongkeun/',
        label: 'Instagram'
      },
      {
        url: 'https://autoreserve.com/en/restaurants/nENdcXQxxL6VL5yT1to9',
        label: '預訂'
      }
    ],
    photos: [],
    region: 'north',
    category: 'restaurant',
    features: [],
    addressEn: '50 Cheonggyul-ro 3-gil, Jeju-si, Jeju-do',
    addressKo: '제주특별자치도 제주시 청귤로3길 50'
  }

  console.log('Reverting to original record...')
  const { data: reverted, error: updateError } = await supabase
    .from('spots')
    .upsert(
      {
        slug: slug,
        source: 'builtin',
        data: originalData,
        created_by: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )
    .select()
    .single()

  if (updateError) {
    console.error('Revert failed:', updateError)
    process.exit(1)
  }

  console.log('Revert successful!')
  console.log('Reverted record:', JSON.stringify(reverted, null, 2))
}

revertTongkeunJangEo().catch(console.error)
