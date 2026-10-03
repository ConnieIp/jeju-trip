import { useState, useEffect } from 'react'

export interface DailyWeather {
  day: string
  weather: string
  icon: number
  summary: string
  temperatureMin: number
  temperatureMax: number
  precipitation: number
  precipitationType: string
  windSpeed: number
  windDirection: string
}

export interface WeatherData {
  [date: string]: DailyWeather
}

const API_KEY = 'jkmax4r1ifh5eo12w33jp9stt1wxh2f26p4nfqe4'
const JEJU_LAT = 33.4996
const JEJU_LON = 126.5312

export function useWeather(dates: string[]) {
  const [weather, setWeather] = useState<WeatherData>({})
  const [todayWeather, setTodayWeather] = useState<DailyWeather | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = `https://www.meteosource.com/api/v1/free/point?lat=${JEJU_LAT}&lon=${JEJU_LON}&key=${API_KEY}&sections=daily`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`)
        }

        const data = await response.json()

        if (!data.daily?.data) {
          throw new Error('Invalid weather data format')
        }

        const weatherMap: WeatherData = {}
        let today: DailyWeather | null = null

        for (const day of data.daily.data) {
          const weatherData: DailyWeather = {
            day: day.day,
            weather: day.weather,
            icon: day.icon,
            summary: day.summary,
            temperatureMin: day.all_day.temperature_min,
            temperatureMax: day.all_day.temperature_max,
            precipitation: day.all_day.precipitation.total,
            precipitationType: day.all_day.precipitation.type,
            windSpeed: day.all_day.wind.speed,
            windDirection: day.all_day.wind.dir,
          }

          weatherMap[day.day] = weatherData

          if (day.day === data.daily.data[0].day) {
            today = weatherData
          }
        }

        setWeather(weatherMap)
        setTodayWeather(today)
      } catch (err) {
        console.error('Failed to fetch weather:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch weather')
      } finally {
        setLoading(false)
      }
    }

    if (dates.length > 0) {
      fetchWeather()
    }
  }, [dates.join(',')])

  return { weather, todayWeather, loading, error }
}
