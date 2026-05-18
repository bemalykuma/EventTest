<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '~/server/db/schema'
import { useEventFilter } from '~/composables/useEventFilter'

type Event = InferSelectModel<typeof eventsTable>

const { data: events, status: fetchStatus } = await useAsyncData<Event[]>(
  'events',
  () => $fetch('/api/events')
)

const { search, status, sortBy, dateRange, applyFilters } = useEventFilter()

const filteredEvents = computed(() => {
  if (!events.value) return []
  return applyFilters(events.value)
})
</script>

<template>
  <EventFilter
    v-model:search="search"
    v-model:status="status"
    v-model:sort-by="sortBy"
    v-model:date-range="dateRange"
  />

  <div v-if="fetchStatus === 'pending'" class="flex justify-center mt-10">
    กำลังโหลด...
  </div>

  <div v-else-if="filteredEvents.length === 0" class="flex justify-center mt-10 text-gray-500">
    ไม่พบกิจกรรม
  </div>

  <div v-else class="flex flex-wrap gap-5 mt-5">
    <CardEvent
      v-for="event in filteredEvents"
      :key="event.id"
      :event="event"
    />
  </div>
</template>