import { ref } from 'vue'
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '../../server/db/schema'

type Event = InferSelectModel<typeof eventsTable>
type EventDate = { date: string }

export type StatusFilter = 'all' | 'upcoming' | 'today' | 'past'
export type SortOption = 'date_desc' | 'date_asc' | 'registered_desc' | 'registered_asc'

// jsonb column จาก Drizzle type เป็น unknown → parse ให้ปลอดภัย ไม่ต้อง cast
function parseDates(raw: unknown): EventDate[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((d): d is EventDate => typeof d === 'object' && d !== null && 'date' in d)
}

// ดึงวันที่แรกของ event (ใช้สำหรับ sort และ filter)
function getFirstDate(event: Event): Date {
  const dates = parseDates(event.dates)
  if (!dates.length) return new Date(0)
  return new Date(dates[0]?.date ?? 0)
}

// ดึงวันที่สุดท้ายของ event (ใช้เช็ค past)
function getLastDate(event: Event): Date {
  const dates = parseDates(event.dates)
  if (!dates.length) return new Date(0)
  return new Date(dates[dates.length - 1]?.date ?? 0)
}

// เช็ค status ของ event เทียบกับวันปัจจุบัน
function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function getEventStatus(event: Event): 'upcoming' | 'today' | 'past' {
  const today = toDateOnly(new Date()) // เช่น 2026-05-18 00:00:00

  const firstDate = toDateOnly(getFirstDate(event))
  const lastDate = toDateOnly(getLastDate(event))

  if (firstDate > today) return 'upcoming'
  if (lastDate < today) return 'past'
  return 'today'
}


export function useEventFilter() {
  const search = ref('')
  const status = ref<StatusFilter>('all')
  const sortBy = ref<SortOption>('date_desc')
  const dateRange = ref<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })

  function applyFilters(events: Event[]): Event[] {
    let result = [...events]

    // 1. Filter by search (ชื่อเท่านั้น)
    const q = search.value.trim().toLowerCase()
    if (q) {
      result = result.filter(e => e.name.toLowerCase().includes(q))
    }

    // 2. Filter by status
    if (status.value !== 'all') {
      result = result.filter(e => getEventStatus(e) === status.value)
    }

    // 3. Filter by date range
    if (dateRange.value.start && dateRange.value.end) {
      const rangeStart = new Date(dateRange.value.start)
      rangeStart.setHours(0, 0, 0, 0)
      const rangeEnd = new Date(dateRange.value.end)
      rangeEnd.setHours(23, 59, 59, 999)

      result = result.filter(e => {
        const dates = parseDates(e.dates)
        return dates.some(d => {
          const dt = new Date(d.date)
          return dt >= rangeStart && dt <= rangeEnd
        })
      })
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'date_asc':
          return getFirstDate(a).getTime() - getFirstDate(b).getTime()
        case 'date_desc':
          return getFirstDate(b).getTime() - getFirstDate(a).getTime()
        case 'registered_desc':
          return (b.registeredCount ?? 0) - (a.registeredCount ?? 0)
        case 'registered_asc':
          return (a.registeredCount ?? 0) - (b.registeredCount ?? 0)
        default:
          return 0
      }
    })

    return result
  }

  return {
    search,
    status,
    sortBy,
    dateRange,
    applyFilters,
  }
}