<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { StatusFilter } from '~/composables/useEventFilter'

const model = defineModel<StatusFilter>({ default: 'all' })
</script>

<template>
  <Select v-model="model">
    <SelectTrigger class="w-full sm:w-45 rounded-full border-black border-2">
      <SelectValue placeholder="Select a status" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Status</SelectLabel>
        <SelectItem value="all">All Events</SelectItem>
        <SelectItem value="upcoming">Upcoming</SelectItem>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="past">Past</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>