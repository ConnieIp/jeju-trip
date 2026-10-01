import type { Spot, Attraction, Restaurant, Cafe, Bakery, Souvenir } from './types'
import attractionsData from './generated/attractions.json'
import restaurantsData from './generated/restaurants.json'
import cafesData from './generated/cafes.json'
import bakeriesData from './generated/bakeries.json'
import souvenirsData from './generated/souvenirs.json'

export const attractions: Attraction[] = attractionsData as Attraction[]
export const restaurants: Restaurant[] = restaurantsData as Restaurant[]
export const cafes: Cafe[] = cafesData as Cafe[]
export const bakeries: Bakery[] = bakeriesData as Bakery[]
export const souvenirs: Souvenir[] = souvenirsData as Souvenir[]

export const allSpots: Spot[] = [
  ...attractions,
  ...restaurants,
  ...cafes,
  ...bakeries,
  ...souvenirs,
]

export function getSpotBySlug(slug: string): Spot | undefined {
  return allSpots.find(spot => spot.slug === slug)
}

export function getSpotsByCategory(category: string): Spot[] {
  return allSpots.filter(spot => spot.category === category)
}

export function getSpotsByRegion(region: string): Spot[] {
  return allSpots.filter(spot => spot.region === region)
}
