import { differenceInCalendarDays, differenceInMinutes, format, formatDistanceToNowStrict } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDate(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy', { locale: fr })
}

export function formatDateShort(iso: string): string {
  return format(new Date(iso), 'd MMM', { locale: fr })
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm')
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d MMM 'à' HH:mm", { locale: fr })
}

export function formatRelative(iso: string): string {
  const seconds = Math.abs(differenceInMinutes(new Date(), new Date(iso)) * 60)
  if (seconds < 60) return "à l'instant"
  return formatDistanceToNowStrict(new Date(iso), { locale: fr, addSuffix: true })
}

export function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function nowLocal(): string {
  return toDatetimeLocal(new Date().toISOString())
}

export function formatDurationMin(min: number): string {
  if (min < 60) return `${Math.round(min)} min`
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return m === 0 ? `${h} h` : `${h} h ${m}`
}

export function minutesBetween(startIso: string, endIso: string): number {
  return differenceInMinutes(new Date(endIso), new Date(startIso))
}

export function formatAge(birthDateIso: string, atIso?: string): string {
  const birth = new Date(birthDateIso)
  const at = atIso ? new Date(atIso) : new Date()
  const days = differenceInCalendarDays(at, birth)
  if (days < 0) return 'à naître'
  if (days < 14) return `${days} jour${days > 1 ? 's' : ''}`
  if (days < 60) {
    const weeks = Math.floor(days / 7)
    return `${weeks} semaine${weeks > 1 ? 's' : ''}`
  }
  const months = Math.floor(days / 30.44)
  if (months < 24) {
    const remDays = Math.floor(days - months * 30.44)
    const weeks = Math.floor(remDays / 7)
    return weeks > 0 ? `${months} mois ${weeks} sem.` : `${months} mois`
  }
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  return remMonths > 0 ? `${years} an${years > 1 ? 's' : ''} ${remMonths} mois` : `${years} an${years > 1 ? 's' : ''}`
}

export function cx(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ')
}

export function sortByDateDesc<T>(items: T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => new Date(key(b)).getTime() - new Date(key(a)).getTime())
}

export function sortByDateAsc<T>(items: T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => new Date(key(a)).getTime() - new Date(key(b)).getTime())
}

export function startOfDayIso(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function dateKey(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function dayBuckets(days: number): string[] {
  const out: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push(dateKey(d.toISOString()))
  }
  return out
}

export function isSameDay(a: string, b: string): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}
