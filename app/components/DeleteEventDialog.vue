<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline" class="text-red-500 border-red-500 hover:bg-red-50 gap-2">
        <Trash2 class="w-4 h-4" />
        ลบกิจกรรมนี้
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>ยืนยันการลบกิจกรรม</AlertDialogTitle>
        <AlertDialogDescription>
          คุณต้องการลบกิจกรรมนี้ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
        <AlertDialogAction class="bg-red-500 hover:bg-red-600" @click="emit('confirm')">
          ลบกิจกรรม
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
