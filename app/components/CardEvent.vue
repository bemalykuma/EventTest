<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MapPin, Users, Infinity as InfinityIcon } from 'lucide-vue-next'

type EventDate = { date: string }

const props = defineProps<{
  event: {
    id: string
    name: string
    dates: EventDate[]
    location: string
    registeredCount: number | null
    maxParticipants: number | null
    imageUrl: string | null
  }
}>()

const formattedDate = computed(() => {
  const dates = props.event.dates
  if (!dates?.length) return ''

  const fmt = (d: string) => new Date(d).toLocaleString('en-US', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric',
    month: 'short',
  })

  if (dates.length === 1) {
    return new Date(dates[0].date).toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const first = fmt(dates[0].date)
  const last = fmt(dates[dates.length - 1].date)
  return `${first} - ${last}`
})

</script>

<template>
  <div class="bg-white rounded-[20px] border-2 border-black w-52 h-110 p-3 flex flex-col">
    <div>
      <div class="w-full h-64 bg-gray-200 rounded-[10px] overflow-hidden ">
        <img class="w-full h-full rounded-[10px] object-cover"
          :src="props.event.imageUrl ?? 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'"
          :alt="props.event.name" />
      </div>

      <p class="text-xs text-red-500 mt-2 font-medium">{{ formattedDate }}</p>

      <h1 class="font-bold mt-1 text-[14px] leading-snug line-clamp-2 h-10">
        {{ props.event.name }}
      </h1>
    </div>
    <div class="flex-1 flex flex-col justify-end">
      <div class="flex items-center gap-1 mt-3 text-gray-500 text-xs ">
        <MapPin class="w-4 h-4" />
        <span class="line-clamp-1">{{ props.event.location }}</span>
      </div>
      <div class="flex items-center gap-1 mt-1 text-xs flex-row"
        :class="props.event.registeredCount === props.event.maxParticipants ? 'text-red-500' : 'text-green-500'">
        <Users class="w-4 h-4" />
        <span>{{ props.event.registeredCount ?? 0 }} /
        </span>
        <InfinityIcon v-if="props.event.maxParticipants === null" class="w-4 h-4" />
        <span v-else>{{ props.event.maxParticipants }}</span>
      </div>

      <div class="flex gap-1 mt-2">
        <NuxtLink :to="`/events/${props.event.id}`" class="flex-1 ">
          <Button class=" rounded-[10px] w-full cursor-pointer hover:border-2 hover:border-black hover:bg-transparent hover:text-black ">ดูรายละเอียด</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>