<script setup lang="ts">
import { ref } from 'vue'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import type { DateRange } from 'reka-ui'

import { Button } from '@/components/ui/button'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const df = new DateFormatter('en-US', { dateStyle: 'short' })

const value = ref<DateRange>({
  start: undefined,
  end: undefined,
})

const displayText = computed(() => {
  if (value.value?.start && value.value?.end) {
    return `${df.format(value.value.start.toDate(getLocalTimeZone()))} - ${df.format(value.value.end.toDate(getLocalTimeZone()))}`
  }
  return 'Select data range'
})

function clearDate() {
  value.value = { start: undefined, end: undefined }
//   emit('change', { start: null, end: null })
}

</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" class="w-50 justify-between text-left font-normal rounded-full border-black border-2">
          <p>{{ displayText }}</p>
          <CalendarIcon class="mr-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
       <RangeCalendar
        v-model="value as any"
        locale="en-US"
        :number-of-months="1"
      />
      <!-- ปุ่ม Clear ข้างใน Popover -->
      <div class="p-1 border-t flex justify-end">
        <Button variant="ghost" size="sm" @click="clearDate">
          Clear
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>