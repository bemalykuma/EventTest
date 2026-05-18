<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const goTo = (page: number) => {
  if (page < 1 || page > props.totalPages) return
  emit('update:currentPage', page)
}

const visiblePages = computed(() => {
  const pages: (number | '...')[] = []
  const total = props.totalPages
  const cur = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  pages.push(1)

  if (cur > 4) pages.push('...')

  const start = Math.max(2, cur - 1)
  const end = Math.min(total - 1, cur + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (cur < total - 3) pages.push('...')

  pages.push(total)

  return pages
})
</script>

<template>
  <div class="flex items-center justify-between mt-6 select-none">
    <!-- ข้อมูลจำนวน -->
    <p v-if="totalItems !== undefined && pageSize !== undefined" class="text-sm text-gray-500">
      แสดง {{ Math.min((currentPage - 1) * pageSize + 1, totalItems) }}–{{ Math.min(currentPage * pageSize, totalItems) }}
      จาก {{ totalItems }} รายการ
    </p>
    <div v-else />

    <!-- ปุ่ม Pagination -->
    <div class="flex items-center gap-1">
      <!-- ปุ่ม Previous -->
      <button
        @click="goTo(currentPage - 1)"
        :disabled="currentPage === 1"
        class="flex items-center justify-center w-9 h-9 rounded-[8px] border border-gray-300 text-gray-600
               hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- หมายเลขหน้า -->
      <template v-for="(page, i) in visiblePages" :key="i">
        <span
          v-if="page === '...'"
          class="flex items-center justify-center w-9 h-9 text-gray-400 text-sm"
        >
          ...
        </span>
        <button
          v-else
          @click="goTo(page)"
          :class="[
            'flex items-center justify-center w-9 h-9 rounded-[8px] border text-sm font-medium transition',
            page === currentPage
              ? 'bg-black text-white border-black'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
      </template>

      <!-- ปุ่ม Next -->
      <button
        @click="goTo(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="flex items-center justify-center w-9 h-9 rounded-[8px] border border-gray-300 text-gray-600
               hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
