<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from '@/components/ui/select'
import type { SortOption } from '~/composables/useEventFilter'

const model = defineModel<SortOption>({ default: 'date_desc' })
</script>

<template>
  <Select v-model="model">
    <SelectTrigger class="w-45 rounded-full border-black border-2">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Date</SelectLabel>
        <SelectItem value="date_desc">Newest first</SelectItem>
        <SelectItem value="date_asc">Oldest first</SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Popularity</SelectLabel>
        <SelectItem value="registered_desc">Most popular</SelectItem>
        <SelectItem value="registered_asc">Least popular</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>