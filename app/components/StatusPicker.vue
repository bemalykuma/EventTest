<script setup lang="ts">
import { ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const selected = ref('all')
</script>

<template>
  <Select v-model="selected">
    <SelectTrigger class="w-[180px] rounded-full border-black border-2">
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