<script setup lang="ts">
import { ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel
} from '@/components/ui/select'

const sortBy = ref('date_desc') // ค่าเริ่มต้น = วันที่ใหม่ก่อน
</script>

<template>
  <Select v-model="sortBy">
    <SelectTrigger class="w-[180px] rounded-full border-black border-2">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup >
        <SelectLabel>Date</SelectLabel>
        <SelectItem value="date_desc">Newest first</SelectItem>
        <SelectItem value="date_asc">Oldest first</SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Popularity</SelectLabel>
        <SelectItem value="registered_asc">Least popular</SelectItem>
        <SelectItem value="registered_desc">Most popular</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>