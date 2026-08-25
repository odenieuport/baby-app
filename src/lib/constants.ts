import type { FeedingType, MilestoneCategory, StoolType, TemperatureMethod } from '../types'

export const feedingTypeLabels: Record<FeedingType, string> = {
  maternel: 'Allaitement',
  artificiel: 'Biberon (lait artificiel)',
  mixte: 'Mixte',
  diversification: 'Diversification',
}

export const milestoneCategoryLabels: Record<MilestoneCategory, string> = {
  physique: 'Physique',
  psychomoteur: 'Psychomoteur',
  cognitif: 'Cognitif',
  langage: 'Langage',
  social: 'Social / émotionnel',
}

export const milestoneCategoryColors: Record<MilestoneCategory, string> = {
  physique: '#e8767a',
  psychomoteur: '#f2a154',
  cognitif: '#4fb3bf',
  langage: '#7c6ef2',
  social: '#d17fc9',
}

export const temperatureMethodLabels: Record<TemperatureMethod, string> = {
  rectale: 'Rectale',
  auriculaire: 'Auriculaire',
  frontale: 'Frontale',
  axillaire: 'Axillaire (aisselle)',
  buccale: 'Buccale',
}

export const stoolTypeLabels: Record<StoolType, string> = {
  meconium: 'Méconium',
  transition: 'Transition',
  normale: 'Normale',
  molle: 'Molle',
  liquide: 'Liquide',
  dure: 'Dure',
  mucus: 'Avec mucus',
  sang: 'Avec sang',
}

export const stoolTypeColors: Record<StoolType, string> = {
  meconium: '#3f3226',
  transition: '#7a5c3a',
  normale: '#c99a4a',
  molle: '#d9b56a',
  liquide: '#e0c98a',
  dure: '#8a6a3a',
  mucus: '#9ecbd6',
  sang: '#d9534f',
}

export const feverThresholdC = 38
