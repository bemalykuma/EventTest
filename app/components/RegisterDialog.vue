<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// FetchError ที่ $fetch โยนออกมา — type มาจาก ofetch (bundled ใน Nuxt)
import type { FetchError } from 'ofetch'

const props = defineProps<{ eventId: string }>()
const emit = defineEmits<{ registered: [] }>()

const open = ref(false)
const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function onConfirm(): Promise<void> {
  loading.value = true
  errorMsg.value = null

  try {
    await $fetch(`/api/events/${props.eventId}/register`, { method: 'POST' })
    open.value = false
    emit('registered')
  } catch (err) {
    // $fetch โยน FetchError — data.message มาจาก createError ฝั่ง server
    const fetchErr = err as FetchError<{ message?: string }>
    errorMsg.value = fetchErr.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button class="rounded-[10px] w-full sm:w-55 text-base md:text-lg py-5 md:p-6">
        เข้าร่วมกิจกรรม
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>ยืนยันการเข้าร่วม</DialogTitle>
        <DialogDescription>
          คุณต้องการเข้าร่วมกิจกรรมนี้ใช่หรือไม่?
        </DialogDescription>
      </DialogHeader>

      <p v-if="errorMsg" class="text-sm text-red-500 mt-1">{{ errorMsg }}</p>

      <DialogFooter class="gap-2">
        <Button variant="outline" @click="open = false" :disabled="loading">ยกเลิก</Button>
        <Button @click="onConfirm" :disabled="loading">
          {{ loading ? 'กำลังบันทึก...' : 'ยืนยัน' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>