<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { StatusFilter, SortOption } from '~/composables/useEventFilter'

// รับค่าจาก index.vue ผ่าน v-model
const search = defineModel<string>('search', { default: '' })
const status = defineModel<StatusFilter>('status', { default: 'all' })
const sortBy = defineModel<SortOption>('sortBy', { default: 'date_desc' })
const dateRange = defineModel<{ start: Date | null; end: Date | null }>('dateRange', {
  default: () => ({ start: null, end: null }),
})
</script>

<template>
  <h1 class="text-center text-[28px] mb-5 font-bold">All Event</h1>
  <Card class="flex flex-row p-0 pl-3 justify-between rounded-full border-black border-2 h-15 items-center">
    <div class="flex flex-row gap-3 items-center">
      <DateRangePicker v-model="dateRange" />
      <StatusPicker v-model="status" />
      <SortPicker v-model="sortBy" />
    </div>
    <div class="flex flex-row gap-3 items-center">
      <SearchInput v-model="search" class="w-100 rounded-full border-black border-2" />
    </div>
    <NuxtLink to="/events/add" class="h-full">
      <Button class="rounded-full rounded-bl-none rounded-tl-none h-full">+ Add Event</Button>
    </NuxtLink>
  </Card>
</template>