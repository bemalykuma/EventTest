<script setup lang="ts">
import { ref, computed } from 'vue'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'

import { Button } from '@/components/ui/button'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// model ส่งออกเป็น { start: Date | null, end: Date | null }
const model = defineModel<{ start: Date | null; end: Date | null }>({
  default: () => ({ start: null, end: null }),
})

const df = new DateFormatter('en-US', { dateStyle: 'short' })

// internal reka-ui value
const value = ref<DateRange>({ start: undefined, end: undefined })

// sync จาก reka-ui → model
watch(value, (v) => {
  model.value = {
    start: v.start ? v.start.toDate(getLocalTimeZone()) : null,
    end: v.end ? v.end.toDate(getLocalTimeZone()) : null,
  }
})

const displayText = computed(() => {
  if (value.value?.start && value.value?.end) {
    return `${df.format(value.value.start.toDate(getLocalTimeZone()))} - ${df.format(value.value.end.toDate(getLocalTimeZone()))}`
  }
  return 'Select date range'
})

function clearDate() {
  value.value = { start: undefined, end: undefined }
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        class="w-full sm:w-50 justify-between text-left font-normal rounded-full border-black border-2"
      >
        <p>{{ displayText }}</p>
        <CalendarIcon class="mr-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
        v-model="value as DateRange"
        locale="en-US"
        :number-of-months="1"
      />
      <div class="p-1 border-t flex justify-end">
        <Button variant="ghost" size="sm" @click="clearDate">
          Clear
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>