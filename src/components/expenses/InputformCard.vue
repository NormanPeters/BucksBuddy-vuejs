<script setup lang="ts">
import { defineEmits, computed, ref } from 'vue'
import api from '@/services/api'
import { type Expenditure } from '@/types'
import eventBus from '@/services/eventBus'

import CardComponent from '@/components/atoms/CardComponent.vue'
import InputField from '@/components/atoms/InputField.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const emit = defineEmits(['refreshExpenditures'])
const journeyId = ref<number | null>(Number(localStorage.getItem('selectedJourney')))
const exchangeRate = ref<number | null>(null)
const vacCurrency = ref<string>('')
const title = ref('')
const amount = ref<number | null>(null)
const date = ref<string>('')

const addExpenditure = async () => {
  if (title.value && amount.value !== null && amount.value > 0 && date.value) {
    const newExpenditure: Omit<Expenditure, 'id'> = {
      name: title.value,
      amount: amount.value,
      date: new Date(date.value),
      journeyId: journeyId.value!,
      isEditing: false
    }
    try {
      await api.createExpenditure(journeyId.value!, newExpenditure)
      title.value = ''
      amount.value = null
      date.value = todayDate.value
      emit('refreshExpenditures')
      eventBus.emit('expenditureAdded', null)
    } catch (error) {
      console.error('Failed to add expenditure:', error)
    }
  }
}

const todayDate = computed(() => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${year}-${month}-${day}`
})
date.value = todayDate.value;

const setupEventListeners = () => {
  eventBus.on('journeyIdChanged', (newJourneyId: number | null) => {
    journeyId.value = newJourneyId;
  });

  eventBus.on('vacCurrencyUpdated', (vacCurrencyName: string) => {
    vacCurrency.value = vacCurrencyName;
  });

  eventBus.on('exchangeRateUpdated', (rate: number | null) => {
    exchangeRate.value = rate;
  });
}
setupEventListeners();
</script>

<template>
  <CardComponent>
    <div class="mb-2">
      <span class="font-bold text-lg">New Expense</span>
    </div>
    <div class="mb-4">
      <InputField
        id="titleInput"
        label="Title"
        type="text"
        v-model="title"
        @keyup.enter="addExpenditure"
      />
    </div>
    <div class="flex space-x-4 mb-4">
      <div class="flex-1">
        <label for="amountInput" class="block text-sm font-medium text-gray-700">Amount</label>
        <div class="mt-1 flex rounded-md shadow-sm">
          <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            {{ vacCurrency }}
          </span>
          <input
            id="amountInput"
            type="number"
            class="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
            v-model.number="amount"
            @keyup.enter="addExpenditure"
          />
        </div>
      </div>
      <div class="flex-1">
        <InputField
          id="dateInput"
          label="Date"
          type="date"
          v-model="date"
          @keyup.enter="addExpenditure"
        />
      </div>
    </div>
    <div class="flex justify-end">
      <BaseButton @click="addExpenditure">Submit</BaseButton>
    </div>
  </CardComponent>
</template>

