<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { StatusFilter, SortOption } from '~/composables/useEventFilter'

const search = defineModel<string>('search', { default: '' })
const status = defineModel<StatusFilter>('status', { default: 'all' })
const sortBy = defineModel<SortOption>('sortBy', { default: 'date_desc' })
const dateRange = defineModel<{ start: Date | null; end: Date | null }>('dateRange', {
  default: () => ({ start: null, end: null }),
})
</script>

<template>
  <h1 class="text-center text-[28px] mb-5 font-bold mt-5">
    All Event
  </h1>

  <Card class="rounded-3xl lg:rounded-full border-black border-2 p-4 lg:px-4 lg:py-2">
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-3 lg:items-center md:justify-between">
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center w-full lg:w-auto">
        <DateRangePicker v-model="dateRange" class="w-full sm:w-auto" />

        <StatusPicker v-model="status" class="w-full sm:w-auto" />

        <SortPicker v-model="sortBy" class="w-full sm:w-auto" />
      </div>

      <!-- Search + Button -->
      <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <SearchInput v-model="search" class="w-full lg:w-[250px] xl:w-[400px] rounded-full border-black border-2" />
      </div>
      <div>
        <NuxtLink to="/events/add" class="w-full sm:w-auto">
          <Button class="w-full rounded-full whitespace-nowrap">
            + Add Event
          </Button>
        </NuxtLink>
      </div>
    </div>
  </Card>
</template>