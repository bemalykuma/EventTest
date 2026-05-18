<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

useHead({
  title: 'Add Event - GetEvent'
})

type EventDate = { date: string }

const router = useRouter()

const form = reactive({
  name: '',
  description: '',
  location: '',
  dates: [{ date: '' }] as EventDate[],
  maxParticipants: null as number | null,
  registeredCount: 0,
  imageUrl: '',
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

// ✅ ตรวจแต่ละ date — คืนเป็น array ของ error ตาม index
const dateErrors = computed(() =>
  form.dates.map(d => d.date.trim() === '' ? 'กรุณาเลือกวันและเวลา' : null)
)

const participantError = computed(() => {
  const count = form.registeredCount
  const max = form.maxParticipants
  if (count < 0) return 'จำนวนผู้เข้าร่วมต้องไม่น้อยกว่า 0'
  if (max !== null && count > max) return `จำนวนผู้เข้าร่วม (${count}) ต้องไม่เกิน Max (${max})`
  return null
})

// ✅ รวม dateErrors ด้วย
const hasError = computed(() =>
  !!nameError.value ||
  !!locationError.value ||
  !!participantError.value ||
  dateErrors.value.some(e => e !== null)
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

  const created = await $fetch('/api/events', {
    method: 'POST',
    body: {
      ...form,
      imageUrl: form.imageUrl.trim() === '' ? null : form.imageUrl,
      dates: form.dates.map(d => ({ date: new Date(d.date).toISOString() })),
    },
  })

     await navigateTo(`/events/${(created as any).id}`)
}
</script>

<template>
  <div class="w-full mx-auto px-20 py-8">
    <div class="border-2 border-black rounded-[20px] p-8 w-full">
      <h1 class="text-2xl font-bold text-center mb-6">Add Event</h1>

      <div class="flex gap-6">
        <div class="flex flex-col items-center gap-2 shrink-0 w-50 h-70 border-2 border-gray-900 rounded-[13px]">
          <img
            :src="previewUrl || 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'"
            class="w-full h-full object-cover rounded-[12px] border"
          />
        </div>

        <div class="flex flex-col flex-1 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Name</label>
            <Input
              v-model="form.name"
              placeholder="Event Name"
              :class="{ 'border-red-500 focus-visible:ring-red-500': submitted && nameError }"
            />
            <p v-if="submitted && nameError" class="text-xs text-red-500">{{ nameError }}</p>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Description</label>
            <Textarea v-model="form.description" placeholder="Description" class="min-h-28" />
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-sm text-gray-500">Location</label>
              <Input
                v-model="form.location"
                placeholder="Location"
                :class="{ 'border-red-500 focus-visible:ring-red-500': submitted && locationError }"
              />
              <p v-if="submitted && locationError" class="text-xs text-red-500">{{ locationError }}</p>
            </div>
          </div>

          <!-- ✅ Dates with validation -->
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-500">Date & Time</label>
            <div v-for="(d, i) in form.dates" :key="i" class="flex items-center gap-2">
              <div class="flex flex-col gap-1 flex-1">
                <Input
                  v-model="form.dates[i].date"
                  type="datetime-local"
                  :class="{ 'border-red-500 focus-visible:ring-red-500': submitted && dateErrors[i] }"
                />
                <p v-if="submitted && dateErrors[i]" class="text-xs text-red-500">{{ dateErrors[i] }}</p>
              </div>
              <button
                v-if="form.dates.length > 1"
                @click="removeDate(i)"
                class="text-red-400 hover:text-red-600 text-lg leading-none mb-auto mt-1"
              >✕</button>
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

      <div class="flex justify-end items-center mt-8">
        <div class="flex gap-3">
          <Button variant="outline" @click="router.push('/')">ยกเลิก</Button>
          <Button @click="onSave" :disabled="submitted && hasError">บันทึก</Button>
        </div>
      </div>
    </div>
  </div>
</template>
