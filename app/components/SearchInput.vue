<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

const model = defineModel<string>({ default: '' })
</script>

<template>
  <InputGroup>
    <InputGroupInput
      v-model="model"
      placeholder="Search for Event's Name..."
    />
    <InputGroupAddon align="inline-end">
      <InputGroupButton>
        <Search class="text-black" />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>