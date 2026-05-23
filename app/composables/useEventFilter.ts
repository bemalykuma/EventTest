import { ref } from 'vue'
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '../../server/db/schema'

type Event = InferSelectModel<typeof eventsTable>

export type StatusFilter = 'all' | 'upcoming' | 'today' | 'past'
export type SortOption = 'date_desc' | 'date_asc' | 'registered_desc' | 'registered_asc'
export const ITEMS_PER_PAGE = 6

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function getEventStatus(event: Event): 'upcoming' | 'today' | 'past' {
  const today = toDateOnly(new Date())
  const eventDate = toDateOnly(new Date(event.date))

  if (eventDate > today) return 'upcoming'
  if (eventDate < today) return 'past'
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

    // 1. Filter by search
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
        const dt = new Date(e.date)
        return dt >= rangeStart && dt <= rangeEnd
      })
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
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