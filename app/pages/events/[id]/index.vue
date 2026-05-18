<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '~/server/db/schema'
import { CalendarDays, MapPin, Users, Pencil, Menu, Infinity as InfinityIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

type Event = InferSelectModel<typeof eventsTable>

const menuOpen = ref(false)
const router = useRouter()
const route = useRoute()

const { data: event, status, error } = await useAsyncData<Event>(
  `event-${route.params.id}`,
  () => $fetch(`/api/events/${route.params.id}`),
  { getCachedData: () => undefined }
)

type EventDate = { date: string }


const formattedDates = computed(() => {
  if (!event.value?.dates) return []
  return (event.value.dates as EventDate[]).map(d =>
    new Date(d.date).toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  )
})

const remaining = computed(() => {
  if (!event.value) return 0
  if (event.value.maxParticipants === null) return Infinity  // ไม่จำกัด
  return event.value.maxParticipants - (event.value.registeredCount ?? 0)
})
</script>

<template>
  <div v-if="status === 'pending'">กำลังโหลด...</div>
  <div v-else-if="error">เกิดข้อผิดพลาด</div>
  <div v-if="event" class="w-full mx-auto px-20 py-8">
    <div class="text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:underline">หน้าหลัก</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-black font-medium">{{ event.name }}</span>
    </div>

    <div class="border-2 border-black rounded-[20px] p-5 flex gap-5 w-full">
      <img
        :src="event.imageUrl ?? 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'"
        :alt="event.name" class="w-60 h-82 object-cover rounded-[12px] shrink-0" />

      <div class="flex flex-col flex-1 gap-2 pl-3">
        <div id="burger-menu" class="relative flex justify-end ">
          <button @click="menuOpen = !menuOpen" class="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <Menu class="w-5 h-5" />
          </button>
          <div v-if="menuOpen" class="absolute top-10 right-0 bg-white border rounded-[10px] shadow-md z-10 w-36 py-1">
            <button class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
              @click="router.push(`/events/${event?.id}/edit`)">
              <Pencil class="w-5 h-5" />
              <p>แก้ไข</p>
            </button>
          </div>
        </div>

        <h1 class="text-3xl font-bold leading-snug">{{ event.name }}</h1>

        <div class="flex flex-col gap-1 text-gray-600 text-md mt-3">
          <div v-for="(d, i) in formattedDates" :key="i" class="flex items-center gap-2">
            <CalendarDays class="w-5 h-5 shrink-0" />
            <span>{{ d }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 text-gray-600 text-md mt-2">
          <MapPin class="w-5 h-5" />
          <span>{{ event.location }}</span>
        </div>

        <div class="flex flex-col items-end justify-end gap-4 mt-auto pt-4">
          <div class="flex items-center gap-2 text-md">
            <Users class="w-4 h-4 text-black" />
            <span class="text-black font-medium flex items-center gap-1">
              จำนวนผู้เข้าร่วม {{ event.registeredCount ?? 0 }} /
              <InfinityIcon v-if="event.maxParticipants === null" class="w-4 h-4" />
              <span v-else>{{ event.maxParticipants }}</span>
            </span>
          </div>
          <div>
            <div :style="remaining <= 0 ? 'cursor: no-drop' : ''">
              <Button class="rounded-[10px] w-55 text-lg p-6 cursor-pointer" :disabled="remaining <= 0">
                {{ remaining > 0 ? 'เข้าร่วมกิจกรรม' : 'ผู้เข้าร่วมเต็มแล้ว' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="event.description" class="mt-6 border rounded-[12px] p-5 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
      {{ event.description }}
    </div>
  </div>
</template>