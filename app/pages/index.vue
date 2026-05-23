<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '~/server/db/schema'
import { useEventFilter, ITEMS_PER_PAGE } from '~/composables/useEventFilter'
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

type Event = InferSelectModel<typeof eventsTable>

const { data: events, status: fetchStatus } = await useAsyncData<Event[]>(
  'events',
  () => $fetch('/api/events')
)

const { search, status, sortBy, dateRange, applyFilters } = useEventFilter()

const currentPage = ref(1)

const filteredEvents = computed(() => {
  if (!events.value) return []
  return applyFilters(events.value)
})

const totalPages = computed(() =>
  Math.ceil(filteredEvents.value.length / ITEMS_PER_PAGE)
)

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredEvents.value.slice(start, start + ITEMS_PER_PAGE)
})

watch([search, status, sortBy, dateRange], () => {
  currentPage.value = 1
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

  <div
    v-else-if="filteredEvents.length === 0"
    class="flex justify-center mt-10 text-gray-500"
  >
    Not Found
  </div>

  <template v-else>
    <!-- Cards -->
    <div
      class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-5 justify-items-center lg:grid-cols-6"
    >
      <CardEvent
        v-for="event in paginatedEvents"
        :key="event.id"
        :event="event"
      />
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        :disabled="currentPage === 1"
        class="p-2.5 rounded-full border disabled:opacity-40 hover:bg-gray-100 h-9 w-9 items-center justify-center flex"
        @click="currentPage--"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        :class="[
          'px-3 py-1 rounded-full border',
          page === currentPage
            ? 'bg-black text-white border-black'
            : 'hover:bg-gray-100'
        ]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>

      <button
        :disabled="currentPage === totalPages"
        class="p-2.5 rounded-full border disabled:opacity-40 hover:bg-gray-100 h-9 w-9 items-center justify-center flex"
        @click="currentPage++"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <!-- Page info -->
    <p class="text-center text-sm text-gray-400 mt-2">
      Page {{ currentPage }} / {{ totalPages }}
      ({{ filteredEvents.length }} Events)
    </p>
  </template>
</template>