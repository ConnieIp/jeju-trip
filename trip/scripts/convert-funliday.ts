import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FUNLIDAY_PATH = path.resolve(__dirname, '../../reference/funliday-trip.md')
const OUTPUT_PATH = path.resolve(__dirname, '../../docs/schedule/schedule.md')

interface Stop {
  time: string
  place: string
  stayTime: string
}

interface DaySchedule {
  day: number
  date: string
  route: string
  stops: Stop[]
}

function parseFunliday(content: string): DaySchedule[] {
  const days: DaySchedule[] = []
  const dayBlocks = content.split('## Day ')

  for (let i = 1; i < dayBlocks.length; i++) {
    const block = dayBlocks[i]
    const lines = block.split('\n')

    const dayMatch = lines[0].match(/(\d+) — (\d{4}\/\d{2}\/\d{2})/)
    if (!dayMatch) continue

    const day: DaySchedule = {
      day: parseInt(dayMatch[1]),
      date: dayMatch[2].replace(/\//g, '/'),
      route: '',
      stops: [],
    }

    let inItinerary = false
    for (const line of lines) {
      if (line.startsWith('**Route:**')) {
        day.route = line.replace('**Route:**', '').trim()
      } else if (line === '### Itinerary') {
        inItinerary = true
      } else if (inItinerary && line.startsWith('|') && line.includes(':')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c && !c.match(/^-+$/))
        if (cells.length >= 3 && cells[0] !== 'Time') {
          day.stops.push({
            time: cells[0],
            place: cells[1],
            stayTime: cells[2],
          })
        }
      } else if (inItinerary && line.startsWith('###')) {
        inItinerary = false
      }
    }

    days.push(day)
  }

  return days
}

function convertToScheduleMd(days: DaySchedule[]): string {
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
  
  let output = '# 濟州島行程表\n\n'
  output += '## Overview\n\n'
  output += '6天5夜自駕順時針環島 (10/25 - 10/30)\n\n'

  for (const day of days) {
    const dateParts = day.date.split('/')
    const dateStr = `${dateParts[1]}/${dateParts[2]}`
    const dateObj = new Date(`${day.date}T00:00:00`)
    const weekday = weekdays[dateObj.getDay()]

    output += `## Day ${day.day} (${dateStr} ${weekday})：第${day.day}天\n\n`
    output += `**路線：${day.route}**\n\n`

    for (const stop of day.stops) {
      const stayMinutes = parseStayTime(stop.stayTime)
      const endTime = calculateEndTime(stop.time, stayMinutes)
      
      output += `${stop.time} ${stop.place}\n`
    }

    output += '\n'
  }

  return output
}

function parseStayTime(stayStr: string): number {
  let minutes = 0
  const hourMatch = stayStr.match(/(\d+)hr/)
  const minMatch = stayStr.match(/(\d+)min/)
  
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60
  if (minMatch) minutes += parseInt(minMatch[1])
  
  return minutes
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, mins] = startTime.split(':').map(Number)
  const totalMins = hours * 60 + mins + durationMinutes
  const endHours = Math.floor(totalMins / 60) % 24
  const endMins = totalMins % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
}

async function main() {
  console.log('Converting Funliday schedule to schedule.md...')
  
  const content = await fs.readFile(FUNLIDAY_PATH, 'utf-8')
  const days = parseFunliday(content)
  
  console.log(`Parsed ${days.length} days from Funliday`)
  
  const output = convertToScheduleMd(days)
  await fs.writeFile(OUTPUT_PATH, output)
  
  console.log(`Written to ${OUTPUT_PATH}`)
  console.log('\nNext steps:')
  console.log('1. Review and edit docs/schedule/schedule.md if needed')
  console.log('2. Run: npm run build:data')
  console.log('3. Run: npm run seed:schedule')
}

main().catch(console.error)
