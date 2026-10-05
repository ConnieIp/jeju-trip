import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOCS_DIR = path.resolve(__dirname, '../../docs')
const OUTPUT_DIR = path.resolve(__dirname, '../src/data/generated')

interface ParsedSpot {
  slug: string
  name: string
  nameZh?: string
  nameKo?: string
  category: string
  region: string
  type?: string
  address?: string
  addressKo?: string
  addressEn?: string
  phone?: string
  website?: string
  websiteLabel?: string
  features: string[]
  notes?: string[]
  links?: { label: string; url: string }[]
  photos: string[]
  hours?: any
  admission?: string
  transport?: string
  hikingInfo?: any
  bestTime?: string
  recommendedTime?: string
  isUNESCO?: boolean
  status?: 'open' | 'closed'
}

const REGION_MAP: Record<string, string> = {
  '東部': 'east',
  '北部': 'north',
  '西北部': 'west',
  '西南部': 'west',
  '西部': 'west',
  '中部': 'central',
  '南部': 'south',
}

const CATEGORY_MAP: Record<string, string> = {
  '景點': 'attraction',
  '自然景點': 'attraction',
  '景點 / 體驗': 'attraction',
  '景點/體驗': 'attraction',
  'Cafe': 'cafe',
  'Café': 'cafe',
  'Café / 點心': 'cafe',
  'Restaurant': 'restaurant',
  '餐廳': 'restaurant',
  'Bakery': 'bakery',
  '麵包': 'bakery',
  'Souvenir': 'souvenir',
  '購物': 'souvenir',
}

function parseRegion(regionStr: string): string {
  for (const [key, value] of Object.entries(REGION_MAP)) {
    if (regionStr.includes(key)) return value
  }
  return 'east'
}

function parseCategory(typeStr: string): string {
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (typeStr.includes(key)) return value
  }
  return 'attraction'
}

function parseMarkdown(content: string, slug: string, category: string): ParsedSpot {
  const lines = content.split('\n')
  const spot: ParsedSpot = {
    slug,
    name: '',
    category,
    region: 'east',
    features: [],
    photos: [],
  }

  let currentSection = ''
  let inBasicInfo = false
  let inFeatures = false
  let inNotes = false
  let inLinks = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      const title = line.replace('# ', '')
      if (title.includes('[UNESCO]')) {
        spot.isUNESCO = true
      }
      const cleanTitle = title.replace(' [UNESCO]', '')
      spot.name = cleanTitle
      if (cleanTitle.includes('(') && cleanTitle.includes(')')) {
        const match = cleanTitle.match(/^(.+?)\s*\((.+?)\)/)
        if (match) {
          spot.nameZh = match[1].trim()
          const parenContent = match[2]
          if (/[\u3131-\u3163\uac00-\ud7a3]/.test(parenContent)) {
            spot.nameKo = parenContent
          }
        }
      }
    } else if (line.startsWith('## ')) {
      const section = line.replace('## ', '')
      currentSection = section
      inBasicInfo = section === '基本資訊'
      inFeatures = section === '特色'
      inNotes = section === '備註'
      inLinks = section === '參考連結'
    } else if (line.startsWith('- ') && inBasicInfo) {
      const content = line.replace('- ', '')
      const colonIndex = content.indexOf('：')
      if (colonIndex > 0) {
        const key = content.substring(0, colonIndex).trim()
        const value = content.substring(colonIndex + 1).trim()

        switch (key) {
          case '地區':
            spot.region = parseRegion(value)
            break
          case '類型':
            spot.type = value
            spot.category = parseCategory(value)
            break
          case '地址':
            spot.address = value
            break
          case '韓文地址':
            spot.addressKo = value
            break
          case '英文地址':
            spot.addressEn = value
            break
          case '電話':
            spot.phone = value
            break
          case '網站':
            const linkMatch = value.match(/\[(.+?)\]\((.+?)\)/)
            if (linkMatch) {
              spot.websiteLabel = linkMatch[1]
              spot.website = linkMatch[2]
            } else {
              spot.website = value
            }
            break
          case '建議遊覽時間':
            spot.recommendedTime = value
            break
        }
      }
    } else if (line.startsWith('- ') && inFeatures) {
      const feature = line.replace('- ', '').trim()
      if (feature.startsWith('建議遊覽時間：')) {
        spot.bestTime = feature.replace('建議遊覽時間：', '')
      } else {
        spot.features.push(feature)
      }
    } else if (line.startsWith('- ') && inNotes) {
      spot.notes = spot.notes || []
      spot.notes.push(line.replace('- ', '').trim())
    } else if (line.startsWith('- ') && inLinks) {
      const linkContent = line.replace('- ', '').trim()
      const linkMatch = linkContent.match(/(.+?):\s*(.+)/)
      if (linkMatch) {
        spot.links = spot.links || []
        spot.links.push({
          label: linkMatch[1].trim(),
          url: linkMatch[2].trim(),
        })
      }
    } else if (currentSection === '開放時間' && line.trim()) {
      if (!spot.hours) spot.hours = []
      if (Array.isArray(spot.hours)) {
        spot.hours.push(line.replace('- ', '').trim())
      }
    } else if (currentSection === '門票費用' && line.startsWith('- ')) {
      spot.admission = spot.admission || ''
      spot.admission += line.replace('- ', '').trim() + '\n'
    }
  }

  if (spot.admission) {
    spot.admission = spot.admission.trim()
  }

  if (content.includes('已結業') || content.includes('已关闭')) {
    spot.status = 'closed'
  }

  return spot
}

function resolvePhotos(slug: string, category: string): string[] {
  const photoDir = path.join(DOCS_DIR, 'photos', category)
  const photos: string[] = []

  const slugVariants = [
    slug,
    slug.replace(/-/g, ''),
    slug.replace('camellia-', 'dongbaek-'),
    slug.replace('hye-ri', 'hyairi'),
    slug.replace('hallim-cactus-village', 'hallyeop-cactus'),
  ]

  for (const variant of slugVariants) {
    for (let i = 1; i <= 3; i++) {
      const photoName = `${variant}-${i}.jpg`
      const photoPath = path.join(photoDir, photoName)
      if (fs.access(photoPath).then(() => true).catch(() => false)) {
        photos.push(`/photos/${category}/${photoName}`)
      }
    }
    if (photos.length > 0) break
  }

  return photos
}

async function checkPhotoExists(photoPath: string): Promise<boolean> {
  try {
    await fs.access(photoPath)
    return true
  } catch {
    return false
  }
}

async function resolvePhotosAsync(slug: string, category: string): Promise<string[]> {
  const photoDir = path.join(DOCS_DIR, 'photos', category)
  const photos: string[] = []

  const slugVariants = [
    slug,
    slug.replace(/-/g, ''),
    slug.replace('camellia-', 'dongbaek-'),
    slug.replace('hye-ri', 'hyairi'),
    slug.replace('hallim-cactus-village', 'hallyeop-cactus'),
    slug.replace('seongeup', 'seopjikoji'),
    slug.replace('sangumbul', 'sangumburi'),
  ]

  for (const variant of slugVariants) {
    for (let i = 1; i <= 3; i++) {
      const photoName = `${variant}-${i}.jpg`
      const photoPath = path.join(photoDir, photoName)
      if (await checkPhotoExists(photoPath)) {
        photos.push(`/photos/${category}/${photoName}`)
      }
    }
    if (photos.length > 0) break
  }

  return photos
}

async function processCategory(category: string, regions: string[]): Promise<ParsedSpot[]> {
  const spots: ParsedSpot[] = []

  for (const region of regions) {
    const dir = path.join(DOCS_DIR, category, region)
    try {
      const files = await fs.readdir(dir)
      const mdFiles = files.filter(f => f.endsWith('.md'))

      for (const file of mdFiles) {
        const slug = file.replace('.md', '')
        const content = await fs.readFile(path.join(dir, file), 'utf-8')
        const spot = parseMarkdown(content, slug, category)
        spot.photos = await resolvePhotosAsync(slug, category)
        spots.push(spot)
      }
    } catch (err) {
      console.warn(`Warning: Could not read ${dir}:`, err)
    }
  }

  return spots
}

function parseSchedule(content: string, allSpots: ParsedSpot[]): any {
  const days: any[] = []
  const dayBlocks = content.split('## Day ')

  const ACCOMMODATION_KEYWORDS = [
    'stay stressless',
    'hygge hotel',
    'hotel regentmarine',
    'regentmarine',
    '舊左邑',
  ]

  function isAccommodationStop(title: string): boolean {
    const lower = title.toLowerCase()
    return ACCOMMODATION_KEYWORDS.some(keyword => lower.includes(keyword))
  }

  function findSpotCategory(title: string): { category: string; slug: string } | null {
    const lower = title.toLowerCase()
    
    if (lower.includes('airport') || lower.includes('機場') || lower.includes('入境') || lower.includes('取車')) {
      return null
    }
    
    for (const spot of allSpots) {
      const spotNameLower = spot.name.toLowerCase()
      
      if (lower.includes(spotNameLower) || spotNameLower.includes(lower)) {
        return { category: spot.category, slug: spot.slug }
      }
      
      if (spot.nameZh) {
        const nameZhLower = spot.nameZh.toLowerCase()
        if (lower.includes(nameZhLower) || nameZhLower.includes(lower)) {
          return { category: spot.category, slug: spot.slug }
        }
      }
      
      if (spot.nameKo) {
        const nameKoLower = spot.nameKo.toLowerCase()
        if (lower.includes(nameKoLower) || nameKoLower.includes(lower)) {
          return { category: spot.category, slug: spot.slug }
        }
      }
      
      const nameParts = spot.name.split(/\s+/).filter(p => p.length > 3)
      for (const part of nameParts) {
        const partLower = part.toLowerCase()
        if (lower.includes(partLower) && !partLower.includes('jeju') && !partLower.includes('제주')) {
          return { category: spot.category, slug: spot.slug }
        }
      }
    }
    return null
  }

  for (let i = 1; i < dayBlocks.length; i++) {
    const block = dayBlocks[i]
    const lines = block.split('\n')

    const headerMatch = lines[0].match(/(\d+)\s+\((.+?)\s+(.+?)\)：(.+)/)
    if (!headerMatch) continue

    const day: any = {
      day: parseInt(headerMatch[1]),
      date: headerMatch[2],
      weekday: headerMatch[3],
      title: headerMatch[4],
      route: '',
      stops: [],
    }

    let currentStop: any = null

    for (const line of lines.slice(1)) {
      if (line.startsWith('**路線：')) {
        const rawRoute = line.replace('**路線：', '').replace('**', '').trim()
        const routeStops = rawRoute.split('➔').map(s => s.trim())
        const filteredStops = routeStops.filter(stop => !isAccommodationStop(stop))
        day.route = filteredStops.join(' ➔ ')
      } else if (line.startsWith('Flight:')) {
        // Format 1: Flight: UO640 HKG Terminal 2 15:25 -> CJU 19:10
        const flightMatch1 = line.match(/Flight:\s*(\w+)\s*(\w+)\s*(Terminal\s*\d+)?\s*(\d{2}:\d{2})\s*->\s*(\w+)\s*(\d{2}:\d{2})/)
        // Format 2: Flight: UO641 CJU 20:00 -> HKG Terminal 2 22:30
        const flightMatch2 = line.match(/Flight:\s*(\w+)\s*(\w+)\s*(\d{2}:\d{2})\s*->\s*(\w+)\s*(Terminal\s*\d+)?\s*(\d{2}:\d{2})/)
        
        if (flightMatch1) {
          day.flight = {
            flightNumber: flightMatch1[1],
            departure: flightMatch1[2],
            departureTerminal: flightMatch1[3] || undefined,
            departureTime: flightMatch1[4],
            arrival: flightMatch1[5],
            arrivalTime: flightMatch1[6],
          }
        } else if (flightMatch2) {
          day.flight = {
            flightNumber: flightMatch2[1],
            departure: flightMatch2[2],
            departureTime: flightMatch2[3],
            arrival: flightMatch2[4],
            arrivalTerminal: flightMatch2[5] || undefined,
            arrivalTime: flightMatch2[6],
          }
        }
      } else if (line.match(/^-?\s*\d{2}:\d{2}/)) {
        const timeRangeMatch = line.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\s+(.+)/)
        const singleTimeMatch = line.match(/(\d{2}:\d{2})\s+(.+)/)

        if (timeRangeMatch) {
          currentStop = {
            time: timeRangeMatch[1],
            endTime: timeRangeMatch[2],
            type: 'activity',
            title: '',
            description: '',
          }

          const rest = timeRangeMatch[3]
          const categoryMatch = rest.match(/【(.+?)】(.+)/)
          if (categoryMatch) {
            const categoryStr = categoryMatch[1]
            const title = categoryMatch[2].trim()

            if (categoryStr.includes('景點')) {
              currentStop.type = 'attraction'
            } else if (categoryStr.includes('Café') || categoryStr.includes('Cafe')) {
              currentStop.type = 'cafe'
            } else if (categoryStr.includes('午餐')) {
              currentStop.type = 'restaurant'
            } else if (categoryStr.includes('晚餐')) {
              currentStop.type = 'restaurant'
            } else if (categoryStr.includes('購物')) {
              currentStop.type = 'souvenir'
            } else if (categoryStr.includes('體驗')) {
              currentStop.type = 'attraction'
            } else if (categoryStr.includes('交通')) {
              currentStop.type = 'transport'
            }

            currentStop.title = title
          } else {
            currentStop.title = rest
            const spotMatch = findSpotCategory(rest)
            if (spotMatch) {
              currentStop.type = spotMatch.category
              currentStop.slug = spotMatch.slug
            }
          }

          if (!isAccommodationStop(currentStop.title)) {
            day.stops.push(currentStop)
          }
        } else if (singleTimeMatch) {
          currentStop = {
            time: singleTimeMatch[1],
            type: 'activity',
            title: '',
            description: '',
          }

          const rest = singleTimeMatch[2]
          const categoryMatch = rest.match(/【(.+?)】(.+)/)
          if (categoryMatch) {
            const categoryStr = categoryMatch[1]
            const title = categoryMatch[2].trim()

            if (categoryStr.includes('景點')) {
              currentStop.type = 'attraction'
            } else if (categoryStr.includes('Café') || categoryStr.includes('Cafe')) {
              currentStop.type = 'cafe'
            } else if (categoryStr.includes('午餐')) {
              currentStop.type = 'restaurant'
            } else if (categoryStr.includes('晚餐')) {
              currentStop.type = 'restaurant'
            } else if (categoryStr.includes('購物')) {
              currentStop.type = 'souvenir'
            }

            currentStop.title = title
          } else {
            currentStop.title = rest
            const spotMatch = findSpotCategory(rest)
            if (spotMatch) {
              currentStop.type = spotMatch.category
              currentStop.slug = spotMatch.slug
            }
          }

          if (!isAccommodationStop(currentStop.title)) {
            day.stops.push(currentStop)
          }
        }
      } else if (line.startsWith('🏨 入住：')) {
        const accMatch = line.match(/🏨 入住：(.+)/)
        if (accMatch) {
          const name = accMatch[1].trim()
          const nightMatch = name.match(/第(\d+)晚/)
          day.accommodation = {
            name: name.replace(/（第\d+晚）/, '').trim(),
            slug: '',
            night: nightMatch ? `night-${nightMatch[1]}` : `night-${day.day}`,
          }
        }
      } else if (day.accommodation && line.startsWith('- 地址：')) {
        day.accommodation.addressKo = line.replace('- 地址：', '').trim()
      } else if (day.accommodation && line.startsWith('- 英文地址：')) {
        day.accommodation.addressEn = line.replace('- 英文地址：', '').trim()
      } else if (day.accommodation && line.startsWith('- 入住：')) {
        const timeMatch = line.match(/入住：(\d{2}:\d{2})\s*\/\s*退房：(\d{2}:\d{2})/)
        if (timeMatch) {
          day.accommodation.checkInTime = timeMatch[1]
          day.accommodation.checkOutTime = timeMatch[2]
        }
      }
    }

    const transportStops = day.stops.filter((s: any) => s.type === 'transport' && s.time && s.endTime)
    let totalDriveMinutes = 0
    for (const stop of transportStops) {
      const [startH, startM] = stop.time.split(':').map(Number)
      const [endH, endM] = stop.endTime.split(':').map(Number)
      const duration = (endH * 60 + endM) - (startH * 60 + startM)
      if (duration > 0) totalDriveMinutes += duration
    }

    if (totalDriveMinutes > 0) {
      const hours = Math.floor(totalDriveMinutes / 60)
      const mins = totalDriveMinutes % 60
      day.driveTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    }

    days.push(day)
  }

  return {
    overview: '6天5夜自駕順時針環島 (10/25 - 10/30)',
    days,
  }
}

async function parseAccommodation(): Promise<Map<string, { bookingUrl?: string }>> {
  const content = await fs.readFile(path.join(DOCS_DIR, 'accommodation.md'), 'utf-8')
  const bookings = new Map<string, { bookingUrl?: string }>()
  
  const sections = content.split('## ')
  for (const section of sections) {
    if (!section.trim() || section.startsWith('Jeju Trip')) continue
    
    const bookingMatch = section.match(/\*\*預訂\*\*：\[.+?\]\((.+?)\)/)
    if (bookingMatch) {
      const bookingUrl = bookingMatch[1]
      
      const nightRangeMatch = section.match(/Night\s+(\d+)\s*&\s*(\d+)/)
      const singleNightMatch = section.match(/Night\s+(\d+)/)
      
      if (nightRangeMatch) {
        const startNight = parseInt(nightRangeMatch[1])
        const endNight = parseInt(nightRangeMatch[2])
        for (let i = startNight; i <= endNight; i++) {
          bookings.set(`night-${i}`, { bookingUrl })
        }
      } else if (singleNightMatch) {
        const nightNum = singleNightMatch[1]
        bookings.set(`night-${nightNum}`, { bookingUrl })
      }
    }
  }
  
  return bookings
}

async function main() {
  console.log('Building data...')

  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const attractions = await processCategory('attraction', ['east', 'north', 'west', 'south', 'central'])
  const restaurants = await processCategory('restaurant', ['east', 'north', 'west', 'south', 'central'])
  const cafes = await processCategory('cafe', ['east', 'north', 'west', 'south', 'central'])
  const bakeries = await processCategory('bakery', ['east', 'north', 'west', 'south', 'central'])
  const souvenirs = await processCategory('souvenir', ['east', 'north', 'west', 'south', 'central'])

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'attractions.json'),
    JSON.stringify(attractions, null, 2)
  )
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'restaurants.json'),
    JSON.stringify(restaurants, null, 2)
  )
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'cafes.json'),
    JSON.stringify(cafes, null, 2)
  )
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'bakeries.json'),
    JSON.stringify(bakeries, null, 2)
  )
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'souvenirs.json'),
    JSON.stringify(souvenirs, null, 2)
  )

  const scheduleContent = await fs.readFile(path.join(DOCS_DIR, 'schedule/schedule.md'), 'utf-8')
  const allSpots = [...attractions, ...restaurants, ...cafes, ...bakeries, ...souvenirs]
  const schedule = parseSchedule(scheduleContent, allSpots)
  
  const accommodationBookings = await parseAccommodation()
  for (const day of schedule.days) {
    if (day.accommodation && day.accommodation.night) {
      const booking = accommodationBookings.get(day.accommodation.night)
      if (booking?.bookingUrl) {
        day.accommodation.bookingUrl = booking.bookingUrl
      }
    }
  }
  
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'schedule.json'),
    JSON.stringify(schedule, null, 2)
  )

  console.log(`Generated ${attractions.length} attractions`)
  console.log(`Generated ${restaurants.length} restaurants`)
  console.log(`Generated ${cafes.length} cafes`)
  console.log(`Generated ${bakeries.length} bakeries`)
  console.log(`Generated ${souvenirs.length} souvenirs`)
  console.log(`Generated schedule with ${schedule.days.length} days`)
  console.log('Done!')
}

main().catch(console.error)
