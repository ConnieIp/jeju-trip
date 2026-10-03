export type Category = 'attraction' | 'restaurant' | 'cafe' | 'bakery' | 'souvenir' | 'accommodation';
export type Region = 'east' | 'north' | 'west' | 'south' | 'central';

export interface BaseSpot {
  slug: string;
  name: string;
  nameZh?: string;
  nameKo?: string;
  category: Category;
  region: Region;
  type?: string;
  address?: string;
  addressKo?: string;
  addressEn?: string;
  phone?: string;
  website?: string;
  websiteLabel?: string;
  features: string[];
  notes?: string[];
  links?: { label: string; url: string }[];
  photos: string[];
  status?: 'open' | 'closed';
  backupFor?: number[];
}

export interface Attraction extends BaseSpot {
  category: 'attraction';
  hours?: string[];
  admission?: string;
  transport?: string;
  hikingInfo?: HikingInfo;
  bestTime?: string;
  recommendedTime?: string;
  isUNESCO?: boolean;
}

export interface HoursEntry {
  season: string;
  time: string;
}

export interface HikingInfo {
  duration: string;
  distance: string;
  difficulty: string;
  routes?: string[];
}

export interface Restaurant extends BaseSpot {
  category: 'restaurant';
  hours?: string;
}

export interface Cafe extends BaseSpot {
  category: 'cafe';
  hours?: string;
  bestTime?: string;
}

export interface Bakery extends BaseSpot {
  category: 'bakery';
}

export interface Souvenir extends BaseSpot {
  category: 'souvenir';
}

export interface Accommodation {
  slug: string;
  name: string;
  nights: string;
  dates: string;
  region: string;
  type: string;
  address?: string;
  bookingUrl?: string;
  bookingPlatform?: string;
  photos: string[];
}

export type Spot = Attraction | Restaurant | Cafe | Bakery | Souvenir;

export type TransportMode = 'drive' | 'walk' | 'bus' | 'ferry' | 'taxi' | 'bike';

export interface ScheduleStop {
  time: string;
  endTime?: string;
  duration?: string;
  type: Category | 'transport' | 'checkin' | 'activity';
  transportMode?: TransportMode;
  title: string;
  slug?: string;
  description?: string;
  note?: string;
}

export interface FlightInfo {
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  weekday: string;
  title: string;
  route: string;
  stops: ScheduleStop[];
  driveTime?: string;
  distance?: string;
  accommodation?: {
    name: string;
    slug: string;
    night: string;
    addressKo?: string;
    addressEn?: string;
    bookingUrl?: string;
  };
  flight?: FlightInfo;
}

export interface TripSchedule {
  overview: string;
  days: DaySchedule[];
}
