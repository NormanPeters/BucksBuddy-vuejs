<!-- CreateNewJourneyCard.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import type { Journey } from '@/types'
import { currencyOptions } from '@/constants/currencyOptions'
import InputField from '@/components/atoms/InputField.vue'
import SelectField from '@/components/atoms/SelectField.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import CardComponent from '@/components/atoms/CardComponent.vue'

const router = useRouter()
const uuid = localStorage.getItem('UUID')

const name = ref('')
const homeCurr = ref('')
const vacCurr = ref('')
const budget = ref<string>('0');
const startDate = ref('')
const endDate = ref('')

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const addJourney = async () => {
  successMessage.value = null
  errorMessage.value = null

  const newJourney: Omit<Journey, 'id'> = {
    name: name.value,
    homeCurr: homeCurr.value,
    vacCurr: vacCurr.value,
    budget: parseFloat(budget.value),
    startDate: new Date(startDate.value),
    endDate: new Date(endDate.value),
    travelDuration: travelDuration.value
  }

  if (!uuid) {
    throw new Error('UUID is null')
  }
  await api.createJourney(uuid, newJourney)
  successMessage.value = 'New journey created successfully!'
  setTimeout(() => {
    router.push('/main')
  }, 1000)
}

const travelDuration = computed(() => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    if (start < end) {
      const difference = end.getTime() - start.getTime()
      return `${Math.ceil(difference / (1000 * 3600 * 24)) + 1} day(s)`
    } else {
      return ''
    }
  }
  return ''
})

const dateError = computed(() => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    return start >= end ? 'Start date must be before the end date.' : ''
  }
  return ''
})
</script>

<template>
  <CardComponent>
    <h3 class="text-center mb-3 text-xl font-bold">Create New Journey</h3>

    <form @submit.prevent="addJourney">
      <InputField id="name" label="Name" type="text" v-model="name" required />

      <SelectField
        id="homeCurrency"
        label="Home Currency"
        :options="currencyOptions"
        v-model="homeCurr"
        placeholder="Please select one"
      />

      <SelectField
        id="vacationCurrency"
        label="Vacation Currency"
        :options="currencyOptions"
        v-model="vacCurr"
        placeholder="Please select one"
      />

      <InputField id="budget" label="Budget" type="number" v-model.number="budget" />

      <div class="flex space-x-4">
        <InputField
          id="startDate"
          label="Start Date"
          type="date"
          v-model="startDate"
          required
          class="flex-1"
        />
        <InputField
          id="endDate"
          label="End Date"
          type="date"
          v-model="endDate"
          required
          class="flex-1"
        />
      </div>
      <div v-if="dateError" class="text-red-500 mt-2">{{ dateError }}</div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700">Travel Duration</label>
        <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" :value="travelDuration" disabled />
      </div>

      <BaseButton class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Journey</BaseButton>
    </form>

    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3" role="alert">{{ successMessage }}</div>
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3" role="alert">{{ errorMessage }}</div>
  </CardComponent>
</template>

