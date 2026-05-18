<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

</script>
<template>
    <h1 class="text-center text-[28px] mb-5">All Event</h1>
    <Card class="flex flex-row p-0 pl-3 justify-between rounded-full border-black border-2 h-15 items-center">
    <div class="flex flex-row gap-3 items-center">
        <DateRangePicker/>
        <StatusPicker/>
        <SortPicker/>
    </div>
    <div class="flex flex-row gap-3 items-center">
        <SearchInput class="w-100 rounded-full border-black border-2"/>
    </div>
    <NuxtLink to="/events/add" class="h-full">
        <Button class="rounded-full rounded-bl-none rounded-tl-none h-full">+ Add Event</Button>
    </NuxtLink>
    </Card>

</template>