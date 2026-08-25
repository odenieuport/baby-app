export type ID = string

export interface Profile {
  name: string
  birthDate: string // ISO date
  sex: 'fille' | 'garcon' | 'autre'
}

export interface Nap {
  id: ID
  start: string // ISO datetime
  end: string | null // ISO datetime, null while running
  note?: string
}

export type FeedingType = 'maternel' | 'artificiel' | 'mixte' | 'diversification'

export interface Feeding {
  id: ID
  datetime: string
  type: FeedingType
  quantityMl?: number
  durationMin?: number
  side?: 'gauche' | 'droite' | 'les-deux'
  note?: string
}

export interface MedicalVisit {
  id: ID
  date: string
  reason: string
  doctor?: string
  notes?: string
  nextAppointment?: string | null
}

export type MilestoneCategory = 'physique' | 'psychomoteur' | 'cognitif' | 'langage' | 'social'

export interface Milestone {
  id: ID
  date: string
  category: MilestoneCategory
  title: string
  description?: string
}

export type TemperatureMethod = 'rectale' | 'auriculaire' | 'frontale' | 'axillaire' | 'buccale'

export interface Temperature {
  id: ID
  datetime: string
  valueC: number
  method: TemperatureMethod
  note?: string
}

export type StoolType =
  | 'meconium'
  | 'transition'
  | 'normale'
  | 'molle'
  | 'liquide'
  | 'dure'
  | 'mucus'
  | 'sang'

export interface Stool {
  id: ID
  datetime: string
  type: StoolType
  color?: string
  note?: string
}

export interface GrowthMeasurement {
  id: ID
  date: string
  weightKg?: number
  heightCm?: number
  headCircumferenceCm?: number
  note?: string
}

export interface AppData {
  profile: Profile | null
  naps: Nap[]
  feedings: Feeding[]
  visits: MedicalVisit[]
  milestones: Milestone[]
  temperatures: Temperature[]
  stools: Stool[]
  growth: GrowthMeasurement[]
}

export const emptyData: AppData = {
  profile: null,
  naps: [],
  feedings: [],
  visits: [],
  milestones: [],
  temperatures: [],
  stools: [],
  growth: [],
}
