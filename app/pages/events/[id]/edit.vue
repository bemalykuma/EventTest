<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '~/server/db/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'

useHead({
  title: 'Manage Event - GetEvent'
})

type Event = InferSelectModel<typeof eventsTable>

const route = useRoute()
const router = useRouter()

const { data: event } = await useAsyncData<Event>(
  `event-${route.params.id}`,
  () => $fetch(`/api/events/${String(route.params.id)}`)
)

// แปลง date (Date | string) → format สำหรับ datetime-local input
function toLocalDatetimeString(value: Date | string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const form = reactive({
  name:             event.value?.name ?? '',
  description:      event.value?.description ?? '',
  location:         event.value?.location ?? '',
  date:             toLocalDatetimeString(event.value?.date),  // string เดียว
  maxParticipants:  event.value?.maxParticipants ?? null,
  registeredCount:  event.value?.registeredCount ?? 0,
  imageUrl:         event.value?.imageUrl ?? '',
})

const submitted = ref(false)

const maxParticipants = computed({
  get: () => form.maxParticipants ?? '',
  set: (val) => {
    form.maxParticipants = val === '' ? null : Number(val)
  }
})

const previewUrl = computed(() => form.imageUrl)

const nameError = computed(() =>
  form.name.trim() === '' ? 'กรุณากรอกชื่อกิจกรรม' : null
)

const locationError = computed(() =>
  form.location.trim() === '' ? 'กรุณากรอกสถานที่' : null
)

const dateError = computed(() =>
  form.date.trim() === '' ? 'กรุณาเลือกวันและเวลา' : null
)

const participantError = computed(() => {
  const count = form.registeredCount
  const max = form.maxParticipants
  if (count < 0) return 'จำนวนผู้เข้าร่วมต้องไม่น้อยกว่า 0'
  if (max !== null && count > max) return `จำนวนผู้เข้าร่วม (${count}) ต้องไม่เกิน Max (${max})`
  return null
})

const hasError = computed(() =>
  !!nameError.value ||
  !!locationError.value ||
  !!dateError.value ||
  !!participantError.value
)

async function onSave() {
  submitted.value = true
  if (hasError.value) return

  await $fetch(`/api/events/${route.params.id}`, {
    method: 'PATCH',
    body: {
      ...form,
      imageUrl: form.imageUrl.trim() === '' ? null : form.imageUrl,
      date: new Date(form.date).toISOString(),
    },
  })
      toast.success('แก้ไขกิจกรรมสำเร็จ', {
      duration: 2000,
    })
  await clearNuxtData(`event-${route.params.id}`)
  router.push(`/events/${route.params.id}`)
}

async function onDelete() {
  await $fetch(`/api/events/${route.params.id}`, { method: 'DELETE' })
  await clearNuxtData(`event-${route.params.id}`)
    toast.success('ลบกิจกรรมสำเร็จ', {
        duration: 2000,
      })
  router.push('/')
}
</script>

<template>
  <div class="w-full mx-auto px-4 md:px-8 xl:px-20 py-6 md:py-8">
    <div class="border-2 border-black rounded-[20px] p-4 md:p-6 xl:p-8 w-full">
      <h1 class="text-2xl font-bold text-center mb-6">
        Manage Event
      </h1>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Preview -->
        <div class="flex flex-col items-center gap-2 shrink-0 w-full lg:w-56">
          <div class="w-full max-w-[260px] aspect-[3/4] border-2 border-gray-900 rounded-[13px] overflow-hidden">
            <img
              :src="previewUrl || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Form -->
        <div class="flex flex-col flex-1 gap-4 min-w-0">
          <!-- Name -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Name</label>
            <Input v-model="form.name" placeholder="ชื่อกิจกรรม" :class="{
              'border-red-500 focus-visible:ring-red-500': submitted && nameError
            }" />
            <p v-if="submitted && nameError" class="text-xs text-red-500">{{ nameError }}</p>
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Description</label>
            <Textarea v-model="form.description" placeholder="รายละเอียด" class="min-h-28" />
          </div>

          <!-- Location -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Location</label>
            <Input v-model="form.location" placeholder="สถานที่" :class="{
              'border-red-500 focus-visible:ring-red-500': submitted && locationError
            }" />
            <p v-if="submitted && locationError" class="text-xs text-red-500">{{ locationError }}</p>
          </div>

          <!-- Date -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Date & Time</label>
            <Input v-model="form.date" type="datetime-local" :class="{
              'border-red-500 focus-visible:ring-red-500': submitted && dateError
            }" />
            <p v-if="submitted && dateError" class="text-xs text-red-500">{{ dateError }}</p>
          </div>

          <!-- Image / Max / Participants -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm text-gray-500">Image Link</label>
              <Input v-model="form.imageUrl" placeholder="https://..." />
            </div>

            <div class="flex gap-4">
              <div class="flex flex-col gap-1 flex-1">
                <label class="text-sm text-gray-500">Max</label>
                <Input v-model="maxParticipants" type="number" placeholder="ไม่จำกัด" :min="0" />
              </div>

              <div class="flex flex-col gap-1 flex-1">
                <label class="text-sm text-gray-500">Participants</label>
                <Input
                  v-model.number="form.registeredCount"
                  type="number"
                  :min="0"
                  :max="form.maxParticipants ?? undefined"
                  :class="{
                    'border-red-500 focus-visible:ring-red-500': participantError
                  }"
                />
              </div>
            </div>
          </div>

          <p v-if="participantError" class="text-sm text-red-500">{{ participantError }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-8">
        <DeleteEventDialog @confirm="onDelete" />

        <div class="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" class="w-full sm:w-auto" @click="router.push(`/events/${route.params.id}`)">
            ยกเลิก
          </Button>
          <Button class="w-full sm:w-auto" @click="onSave" :disabled="submitted && hasError">
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>