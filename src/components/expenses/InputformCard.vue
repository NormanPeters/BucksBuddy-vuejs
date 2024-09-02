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
      <h4>New Expense</h4>
    </div>
    <div class="row mb-2">
      <div class="col">
        <InputField
          id="titleInput"
          label="Title"
          type="text"
          v-model="title"
          @keyup.enter="addExpenditure"
        />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col">
        <label for="amountInput" class="form-label">Amount</label>
        <div class="input-group">
          <span class="input-group-text">{{ vacCurrency }}</span>
          <input
            id="amountInput"
            type="number"
            class="form-control"
            v-model.number="amount"
            @keyup.enter="addExpenditure"
          />
        </div>
      </div>
      <div class="col">
        <InputField
          id="dateInput"
          label="Date"
          type="date"
          v-model="date"
          @keyup.enter="addExpenditure"
        />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col">
        <BaseButton @click="addExpenditure">Submit</BaseButton>
      </div>
    </div>
  </CardComponent>
</template>
