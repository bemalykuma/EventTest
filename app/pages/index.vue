<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '~/server/db/schema'

type Event = InferSelectModel<typeof eventsTable>

const { data: events, status } = await useAsyncData<Event[]>(
  'events',
  () => $fetch('/api/events')
)
</script>

<template>
    <EventFilter/>
   
  <div v-if="status === 'pending'" class="flex justify-center mt-10">
    กำลังโหลด...
  </div>

  <div v-else class="flex flex-wrap gap-5 mt-5">
    <CardEvent
      v-for="event in events"
      :key="event.id"
      :event="event"
    />
  </div>
</template>