import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type {
  AppData,
  Feeding,
  GrowthMeasurement,
  MedicalVisit,
  Milestone,
  Nap,
  Profile,
  Stool,
  Temperature,
} from '../types'

interface Store extends AppData {
  setProfile: (p: Profile) => void

  addNap: (n: Omit<Nap, 'id'>) => string
  updateNap: (id: string, patch: Partial<Nap>) => void
  deleteNap: (id: string) => void

  addFeeding: (f: Omit<Feeding, 'id'>) => string
  updateFeeding: (id: string, patch: Partial<Feeding>) => void
  deleteFeeding: (id: string) => void

  addVisit: (v: Omit<MedicalVisit, 'id'>) => string
  updateVisit: (id: string, patch: Partial<MedicalVisit>) => void
  deleteVisit: (id: string) => void

  addMilestone: (m: Omit<Milestone, 'id'>) => string
  updateMilestone: (id: string, patch: Partial<Milestone>) => void
  deleteMilestone: (id: string) => void

  addTemperature: (t: Omit<Temperature, 'id'>) => string
  updateTemperature: (id: string, patch: Partial<Temperature>) => void
  deleteTemperature: (id: string) => void

  addStool: (s: Omit<Stool, 'id'>) => string
  updateStool: (id: string, patch: Partial<Stool>) => void
  deleteStool: (id: string) => void

  addGrowth: (g: Omit<GrowthMeasurement, 'id'>) => string
  updateGrowth: (id: string, patch: Partial<GrowthMeasurement>) => void
  deleteGrowth: (id: string) => void

  resetAll: () => void
}

function makeCrud<T extends { id: string }>(
  key: keyof AppData,
) {
  return {
    add: (set: any, item: Omit<T, 'id'>) => {
      const id = uuid()
      set((s: any) => ({ [key]: [...(s[key] as T[]), { ...item, id }] }))
      return id
    },
    update: (set: any, id: string, patch: Partial<T>) => {
      set((s: any) => ({
        [key]: (s[key] as T[]).map((it) => (it.id === id ? { ...it, ...patch } : it)),
      }))
    },
    remove: (set: any, id: string) => {
      set((s: any) => ({ [key]: (s[key] as T[]).filter((it) => it.id !== id) }))
    },
  }
}

const napCrud = makeCrud<Nap>('naps')
const feedingCrud = makeCrud<Feeding>('feedings')
const visitCrud = makeCrud<MedicalVisit>('visits')
const milestoneCrud = makeCrud<Milestone>('milestones')
const temperatureCrud = makeCrud<Temperature>('temperatures')
const stoolCrud = makeCrud<Stool>('stools')
const growthCrud = makeCrud<GrowthMeasurement>('growth')

export const useStore = create<Store>()(
  persist(
    (set) => ({
      profile: null,
      naps: [],
      feedings: [],
      visits: [],
      milestones: [],
      temperatures: [],
      stools: [],
      growth: [],

      setProfile: (p) => set({ profile: p }),

      addNap: (n) => napCrud.add(set, n),
      updateNap: (id, patch) => napCrud.update(set, id, patch),
      deleteNap: (id) => napCrud.remove(set, id),

      addFeeding: (f) => feedingCrud.add(set, f),
      updateFeeding: (id, patch) => feedingCrud.update(set, id, patch),
      deleteFeeding: (id) => feedingCrud.remove(set, id),

      addVisit: (v) => visitCrud.add(set, v),
      updateVisit: (id, patch) => visitCrud.update(set, id, patch),
      deleteVisit: (id) => visitCrud.remove(set, id),

      addMilestone: (m) => milestoneCrud.add(set, m),
      updateMilestone: (id, patch) => milestoneCrud.update(set, id, patch),
      deleteMilestone: (id) => milestoneCrud.remove(set, id),

      addTemperature: (t) => temperatureCrud.add(set, t),
      updateTemperature: (id, patch) => temperatureCrud.update(set, id, patch),
      deleteTemperature: (id) => temperatureCrud.remove(set, id),

      addStool: (s) => stoolCrud.add(set, s),
      updateStool: (id, patch) => stoolCrud.update(set, id, patch),
      deleteStool: (id) => stoolCrud.remove(set, id),

      addGrowth: (g) => growthCrud.add(set, g),
      updateGrowth: (id, patch) => growthCrud.update(set, id, patch),
      deleteGrowth: (id) => growthCrud.remove(set, id),

      resetAll: () =>
        set({
          profile: null,
          naps: [],
          feedings: [],
          visits: [],
          milestones: [],
          temperatures: [],
          stools: [],
          growth: [],
        }),
    }),
    { name: 'baby-app-data' },
  ),
)
