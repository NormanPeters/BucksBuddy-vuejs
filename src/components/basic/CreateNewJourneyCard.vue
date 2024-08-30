<!-- CreateNewJourneyCard.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Journey } from '@/types'
import { useRouter } from 'vue-router'
import InputField from '@/components/atoms/InputField.vue'
import SelectField from '@/components/atoms/SelectField.vue'
import { currencyOptions } from '@/constants/currencyOptions'
import BaseButton from '@/components/atoms/BaseButton.vue'
import CardComponent from '@/components/atoms/CardComponent.vue'

const router = useRouter()
const uuid = localStorage.getItem('UUID')

const name = ref('')
const homeCurr = ref('')
const vacCurr = ref('')
const budget = ref(0)
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
    budget: budget.value,
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
      <h3 class="text-center mb-3">Create New Journey</h3>

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

        <div class="row">
          <InputField
            id="startDate"
            label="Start Date"
            type="date"
            v-model="startDate"
            required
            class="col-6"
          />
          <InputField
            id="endDate"
            label="End Date"
            type="date"
            v-model="endDate"
            required
            class="col-6"
          />
          <div v-if="dateError" class="text-danger">{{ dateError }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Travel Duration</label>
          <input type="text" class="form-control" :value="travelDuration" disabled />
        </div>

        <BaseButton>Create Journey</BaseButton>
      </form>

      <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </CardComponent>
</template>
