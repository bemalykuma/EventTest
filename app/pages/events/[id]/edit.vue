<script setup lang="ts">
import type { InferSelectModel } from 'drizzle-orm'
import type { events as eventsTable } from '~/server/db/schema'
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Event = InferSelectModel<typeof eventsTable>
type EventDate = { date: string }

const route = useRoute()
const router = useRouter()

const { data: event } = await useAsyncData<Event>(
  `event-${route.params.id}`,
  () => $fetch(`/api/events/${route.params.id}`),
  { getCachedData: () => null }
)

const form = reactive({
  name: event.value?.name ?? '',
  description: event.value?.description ?? '',
  location: event.value?.location ?? '',
  dates: (event.value?.dates as EventDate[] | null)?.map(d => {
    const date = new Date(d.date)
    const offset = date.getTimezoneOffset() * 60000
    return {
      date: new Date(date.getTime() - offset).toISOString().slice(0, 16)
    }
  }) ?? [{ date: '' }],
  maxParticipants: event.value?.maxParticipants ?? null,
  registeredCount: event.value?.registeredCount ?? 0,
  imageUrl: event.value?.imageUrl ?? '',
})

const submitted = ref(false)

const maxParticipants = computed({
  get: () => form.maxParticipants ?? '',
  set: (val) => {
    form.maxParticipants = val === '' ? null : Number(val)
  }
})

const previewUrl = computed(() => form.imageUrl)

const nameError = computed(() => {
  return form.name.trim() === '' ? 'กรุณากรอกชื่อกิจกรรม' : null
})

const locationError = computed(() => {
  return form.location.trim() === '' ? 'กรุณากรอกสถานที่' : null
})

const participantError = computed(() => {
  const count = form.registeredCount
  const max = form.maxParticipants

  if (count < 0) return 'จำนวนผู้เข้าร่วมต้องไม่น้อยกว่า 0'
  if (max !== null && count > max) return `จำนวนผู้เข้าร่วม (${count}) ต้องไม่เกิน Max (${max})`
  return null
})


const hasError = computed(() =>
  !!nameError.value || !!locationError.value || !!participantError.value
)

function addDate() {
  form.dates.push({ date: '' })
}

function removeDate(index: number) {
  form.dates.splice(index, 1)
}

async function onSave() {
  submitted.value = true  

  if (hasError.value) return  

  await $fetch(`/api/events/${route.params.id}`, {
    method: 'PATCH',
    body: {
      ...form,
      imageUrl: form.imageUrl.trim() === '' ? null : form.imageUrl ,
      dates: form.dates.map(d => ({ date: new Date(d.date).toISOString() })),
    },
  })
  await clearNuxtData(`event-${route.params.id}`)
  router.push(`/events/${route.params.id}`)
}

async function onDelete() {

  await $fetch(`/api/events/${route.params.id}`, { method: 'DELETE' })
  await clearNuxtData(`event-${route.params.id}`)
  router.push('/')
}
</script>

<template>
  <div class="w-full mx-auto px-20 py-8">
    <div class="border-2 border-black rounded-[20px] p-8 w-full">
      <h1 class="text-2xl font-bold text-center mb-6">แก้ไขกิจกรรม</h1>

      <div class="flex gap-6">
  
        <div class="flex flex-col items-center gap-2 shrink-0 w-50 h-70 border-2 border-gray-900 rounded-[13px]">
          <img
            :src="previewUrl || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'"
            class="w-full h-full object-cover rounded-[12px] border" />
        </div>

        <div class="flex flex-col flex-1 gap-4">

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Name</label>
            <Input
              v-model="form.name"
              placeholder="ชื่อกิจกรรม"
            
              :class="{ 'border-red-500 focus-visible:ring-red-500': submitted && nameError }"
            />
            <p v-if="submitted && nameError" class="text-xs text-red-500">{{ nameError }}</p>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Description</label>
            <Textarea v-model="form.description" placeholder="รายละเอียด" class="min-h-28" />
          </div>


          <div class="flex gap-4">
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-sm text-gray-500">Location</label>
              <Input
                v-model="form.location"
                placeholder="สถานที่"
                :class="{ 'border-red-500 focus-visible:ring-red-500': submitted && locationError }"
              />
              <p v-if="submitted && locationError" class="text-xs text-red-500">{{ locationError }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-500">Date & Time</label>
            <div v-for="(d, i) in form.dates" :key="i" class="flex items-center gap-2">
              <Input v-model="form.dates[i].date" type="datetime-local" class="flex-1" />
              <button v-if="form.dates.length > 1" @click="removeDate(i)"
                class="text-red-400 hover:text-red-600 text-lg leading-none">✕</button>
            </div>
            <button @click="addDate" class="text-sm text-blue-600 hover:underline text-left">
              + เพิ่มวัน
            </button>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-sm text-gray-500">Image Link</label>
              <Input v-model="form.imageUrl" placeholder="https://..." />
            </div>
            <div class="flex flex-col gap-1 w-32">
              <label class="text-sm text-gray-500">Max</label>
              <Input v-model="maxParticipants" type="number" placeholder="ไม่จำกัด" :min="0" />
            </div>
            <div class="flex flex-col gap-1 w-32">
              <label class="text-sm text-gray-500">Participants</label>
              <Input
                v-model.number="form.registeredCount"
                type="number"
                :min="0"
                :max="form.maxParticipants ?? undefined"
                :class="{ 'border-red-500 focus-visible:ring-red-500': participantError }"
              />
            </div>
          </div>
          <p v-if="participantError" class="text-sm text-red-500 mt-1 justify-end flex">
            {{ participantError }}
          </p>

        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center mt-8">
        <DeleteEventDialog @confirm="onDelete" />

        <div class="flex gap-3">
          <Button variant="outline" @click="router.push(`/events/${route.params.id}`)">ยกเลิก</Button>
          <Button @click="onSave" :disabled="submitted && hasError">บันทึก</Button>
        </div>
      </div>
    </div>
  </div>
</template>
