import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const accommodationData: Record<string, { addressKo?: string; addressEn?: string; bookingUrl: string; slug: string; checkInTime?: string; checkOutTime?: string }> = {
  '舊左邑 Stay_stressless': {
    slug: 'stay-stressless',
    addressKo: '제주 제주시 조천읍 신촌북3길 30-7',
    addressEn: '2283 Sinchon-ri, Jocheon-eup, Jeju-si, Jeju-do, South Korea',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    bookingUrl: 'https://www.airbnb.com.hk/rooms/1389539647954836162?unique_share_id=f0f2c729-d9a2-4768-9cae-455fbbaf69b6&viralityEntryPoint=1&s=7&source_impression_id=p3_1790864245_P37sXuQYAX5crwO0',
  },
  '西歸浦舒適酒店 (Hygge Hotel)': {
    slug: 'hygge-hotel',
    addressKo: '제주 특별자치도 서귀포시 대정읍 상모리 87-19',
    addressEn: '87-19 Sangmori, Daejeong-eup, Jeju, South Korea, 63512',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    bookingUrl: 'https://www.agoda.com/zh-hk/whigge-hotel/hotel/jeju-kr.html?countryId=212&finalPriceView=1&isShowMobileAppPrice=false&cid=-999&numberOfBedrooms=&familyMode=false&adults=2&children=0&rooms=1&maxRooms=0&checkIn=2026-10-27&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=1&showReviewSubmissionEntry=false&currencyCode=HKD&isFreeOccSearch=false&los=1&searchrequestid=5c98c99f-87de-4ec5-8b3b-25f4c6a2140b&ds=IoTiX8IACdm3%2FLWk',
  },
  'RegentMarine The Blue Hotel': {
    slug: 'regentmarine-the-blue',
    addressKo: '제주 특별자치도 제주시 서부두2길 20',
    addressEn: '20, Seobudu 2-gil, Jeju, South Korea, 63276',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    bookingUrl: 'https://www.agoda.com/zh-hk/hotel-regentmarine-the-blue/hotel/jeju-island-kr.html?site_id=1932640&tag=48bee912-eb9f-401d-90cd-544564e848a5&gad_source=1&gad_campaignid=22020094937&gbraid=0AAAAA9_WXQo43c8ZdFvUImOkqT6oAaE33&gclid=CjwKCAjwifjVBhBKEiwAYx4K9GelEl0_wP6HDSgUa5S78rwp_z57VTXqIMqwnu0N_CcXTqpAaGvNhhoCxWgQAvD_BwE&ds=fZLD6YVoxXJPP6EG',
  },
}

async function main() {
  const { data: row, error } = await supabase
    .from('schedule')
    .select('data')
    .eq('id', 'default')
    .single()

  if (error) {
    console.error('Failed to fetch schedule:', error)
    process.exit(1)
  }

  const schedule = row.data
  let updated = 0

  for (const day of schedule.days) {
    if (day.accommodation) {
      const info = accommodationData[day.accommodation.name]
      if (info) {
        if (info.addressKo) day.accommodation.addressKo = info.addressKo
        if (info.addressEn) day.accommodation.addressEn = info.addressEn
        if (info.checkInTime) day.accommodation.checkInTime = info.checkInTime
        if (info.checkOutTime) day.accommodation.checkOutTime = info.checkOutTime
        if (info.bookingUrl) day.accommodation.bookingUrl = info.bookingUrl
        if (!day.accommodation.slug) day.accommodation.slug = info.slug
        updated++
        console.log(`Updated Day ${day.day}: ${day.accommodation.name}`)
      }
    }
  }

  const { error: updateError } = await supabase
    .from('schedule')
    .update({ data: schedule })
    .eq('id', 'default')

  if (updateError) {
    console.error('Failed to save:', updateError)
    process.exit(1)
  }

  console.log(`Done. Updated ${updated} accommodation(s).`)
}

main()
