<script setup lang="ts">
import { defineEmits, computed, ref } from 'vue'
import api from '@/services/api'
import { type Expenditure } from '@/types'
import eventBus from '@/services/eventBus'

import CardComponent from '@/components/atoms/CardComponent.vue'
import BaseButton from '@/components/atoms/PrimaryButton.vue'
import SectionHeader from '@/components/atoms/SectionHeader.vue'

const emit = defineEmits(['refreshExpenditures'])
const journeyId = ref<number | null>(Number(localStorage.getItem('selectedJourney')))
const exchangeRate = ref<number | null>(null)
const vacCurrency = ref<string>('')
const title = ref('')
const amount = ref<number | null>(null)
const date = ref<string>('')
const errorMessage = ref<string | null>(null)

const addExpenditure = async () => {
  if (!journeyId.value) {
    errorMessage.value = 'Please create a journey first.';
    return;
  }

  if (!title.value || amount.value === null || amount.value <= 0 || !date.value) {
    errorMessage.value = 'Please fill in all fields correctly.';
    return;
  }

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
    errorMessage.value = null; // Clear error if everything goes well
  } catch (error) {
    console.error('Failed to add expenditure:', error)
    errorMessage.value = 'Failed to add expenditure. Please try again.';
  }
}

const todayDate = computed(() => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${year}-${month}-${day}`
})
date.value = todayDate.value

const setupEventListeners = () => {
  eventBus.on('journeyIdChanged', (newJourneyId: number | null) => {
    journeyId.value = newJourneyId
  })

  eventBus.on('vacCurrencyUpdated', (vacCurrencyName: string) => {
    vacCurrency.value = vacCurrencyName
  })

  eventBus.on('exchangeRateUpdated', (rate: number | null) => {
    exchangeRate.value = rate
  })
}
setupEventListeners()
</script>

<template>
  <CardComponent>
    <SectionHeader title="New Expense" />

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <div class="row mb-3 mt-4">
      <div class="col-3 d-flex justify-content-center align-items-center">
        <span class="fw-bold">Title</span>
      </div>
      <div class="col-9">
        <input
          id="titleInput"
          type="text"
          class="form-control"
          v-model="title"
          @keyup.enter="addExpenditure"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-3 d-flex justify-content-center align-items-center">
        <span class="fw-bold">Amount</span>
      </div>
      <div class="col-9">
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
    </div>
    <div class="row mb-3">
      <div class="col-3 d-flex justify-content-center align-items-center">
        <span class="fw-bold">Date</span>
      </div>
      <div class="col-9">
        <div class="input-group">
          <input
            id="dateInput"
            type="date"
            class="form-control"
            v-model="date"
            @keyup.enter="addExpenditure"
          />
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-end">
      <div class="col-9">
        <BaseButton class="custom-btn" @click="addExpenditure">+ Add Expense</BaseButton>
      </div>
    </div>

  </CardComponent>
</template>

<style scoped>
.form-control {
  border-radius: 50px;
  font-size: 12px;
}

.input-group-text {
  border-radius: 50px;
  font-size: 12px;
}

.custom-btn {
  font-size: 12px;
  padding: 7px;
}
</style>