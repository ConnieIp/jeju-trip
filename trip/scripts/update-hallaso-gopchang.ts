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

async function updateHallasoGopchang() {
  const slug = 'hallaso-gopchang'

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
    name: '한라소곱창',
    nameZh: 'Hallaso Gopchang',
    nameKo: '한라소곱창',
    type: '烤內臟專門店',
    hours: ['17:00～00:00'],
    phone: '0507-1328-9720',
    features: [
      '提供韓牛小腸燒烤和黑豬五花',
      '適合解酒、獨食',
      '清涼爽口',
      '全年無休',
      '支援外送'
    ],
    notes: [
      '人氣菜單：韓牛小腸燒烤（25,000韓元/250g）、黑豬五花（30,000韓元/300g）'
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

updateHallasoGopchang().catch(console.error)
