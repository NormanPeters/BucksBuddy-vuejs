<!--History-->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { type Expenditure } from '@/types'
import eventBus from '@/services/eventBus'

const expendituresList = ref<Expenditure[]>([])
const sortedExpenditures = ref<Expenditure[]>([])
const journeyId = ref<number | null>(Number(localStorage.getItem('selectedJourney')))
const vacCurrency = ref<string>('')
const homeCurrency = ref<string>('')
const exchangeRate = ref<number | null>(null)
const selectedExpenditureId = ref<number | null>(null) // Track the selected expenditure

const sortCriteria = ref<string>('name')
const sortOrder = ref<string>('asc')

const fetchExpenditures = async (journeyId: number) => {
  if (!journeyId.valueOf()) {
    console.error('Cannot fetch expenditures: journeyId is null')
    return
  }

  try {
    const response = await api.getAllExpenditures(journeyId.valueOf())
    expendituresList.value = response.data.map((expenditure: Expenditure) => ({
      ...expenditure,
      isEditing: false
    }))
    sortExpenditures()
    const homeCurrencyResponse = await api.getHomeCurrency(journeyId.valueOf())
    homeCurrency.value = homeCurrencyResponse.data
    const vacCurrencyResponse = await api.getVacCurrency(journeyId.valueOf())
    vacCurrency.value = vacCurrencyResponse.data
  } catch (error) {
    console.error('Error fetching expenditures:', error)
  }
}

const clearExpenditures = () => {
  expendituresList.value = []
  sortedExpenditures.value = []
  vacCurrency.value = ''
  homeCurrency.value = ''
}

const deleteExpenditure = async (id: number) => {
  try {
    if (journeyId.value === null) {
      console.error('Cannot delete expenditure: journeyId is null')
      return
    }
    await api.deleteExpenditure(journeyId.value, id)
    await fetchExpenditures(journeyId.value)
    eventBus.emit('expenditureDeleted', journeyId.value)
  } catch (error) {
    console.error(error)
  }
}

const editExpenditure = (id: number) => {
  const index = expendituresList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    expendituresList.value[index].isEditing = true
    selectedExpenditureId.value = id // Set the selected expenditure
  }
}

const saveExpenditure = async (id: number, updatedExpenditure: Expenditure) => {
  try {
    if (journeyId.value === null) {
      console.error('Cannot save expenditure: journeyId is null')
      return
    }
    await api.updateExpenditure(journeyId.value, id, updatedExpenditure)
    await fetchExpenditures(journeyId.value)
    eventBus.emit('expenditureUpdated', journeyId.value)
    selectedExpenditureId.value = null // Clear the selected expenditure after saving
  } catch (error) {
    console.error(error)
  }
}

const amountInHomeCurrency = (amount: number): number => {
  return exchangeRate.value !== null ? (amount / exchangeRate.value) : NaN
}

const sortExpenditures = () => {
  sortedExpenditures.value = [...expendituresList.value].sort((a, b) => {
    let comparison;
    if (sortCriteria.value === 'amount') {
      comparison = a.amount - b.amount
    } else if (sortCriteria.value === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortCriteria.value === 'homeCurrency') {
      comparison = amountInHomeCurrency(a.amount) - amountInHomeCurrency(b.amount)
    } else {
      comparison = a.name.localeCompare(b.name)
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })
}

const toggleSort = (criteria: string) => {
  if (sortCriteria.value === criteria) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCriteria.value = criteria
    sortOrder.value = 'asc'
  }
  sortExpenditures()
}

watch([expendituresList, sortCriteria, sortOrder], sortExpenditures)

onMounted(() => {
  eventBus.on('journeyIdChanged', (newJourneyId: number | null) => {
    if (newJourneyId !== null) {
      journeyId.value = newJourneyId
      clearExpenditures()
      fetchExpenditures(journeyId.value)
    } else {
      clearExpenditures()
    }
  })

  eventBus.on('exchangeRateUpdated', (rate: number) => {
    exchangeRate.value = rate
  })

  eventBus.on('vacCurrencyUpdated', (vacCurrencyName: string) => {
    vacCurrency.value = vacCurrencyName
  })

  eventBus.on('homeCurrencyUpdated', (homeCurrencyName: string) => {
    homeCurrency.value = homeCurrencyName
  })

  eventBus.on('expenditureAdded', () => {
    if (journeyId.value !== null) {
      fetchExpenditures(journeyId.value)
    }
  })

  if (journeyId.value !== null) {
    fetchExpenditures(journeyId.value)
  }
})


defineExpose({
  fetchExpenditures
})

const formatDate = (dateString: Date): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${day}.${month}.${year}`
}

const formatAmount = (amount: number): string => {
  return amount.toFixed(2)
}
</script>


<template>
  <div class="card shadow p-1">
    <div class="card-body">
      <table class="table table-hover align-text-bottom">
        <thead>
        <tr class="row fw-bold">
          <th class="col-3" @click="toggleSort('name')" style="cursor: pointer;">Title</th>
          <th class="col-3 text-end" @click="toggleSort('amount')" style="cursor: pointer;">{{ vacCurrency }}</th>
          <th class="col-3 text-end" @click="toggleSort('homeCurrency')" style="cursor: pointer;">{{ homeCurrency }}</th>
          <th class="col-3 text-end" @click="toggleSort('date')" style="cursor: pointer;">Datum</th>
        </tr>
        </thead>
        <tbody>
        <tr class="row" v-for="item in sortedExpenditures" :key="item.id" @click="editExpenditure(item.id)" style="cursor: pointer;">
          <td class="col-3 align-middle" v-if="!item.isEditing">
            {{ item.name }}
          </td>
          <td class="col-3 align-middle" v-else>
            <input v-model="item.name" class="form-control" />
          </td>

          <td class="col-3 text-end align-middle" v-if="!item.isEditing">
            {{ formatAmount(item.amount) }}
          </td>
          <td class="col-2 align-middle" v-else>
            <input v-model="item.amount" type="number" class="form-control" />
          </td>

          <td class="col-3 text-end align-middle" v-if="!item.isEditing">
            {{ formatAmount(amountInHomeCurrency(item.amount)) }}
          </td>
          <td class="col-2 align-middle" v-else>
            <input :value="amountInHomeCurrency(item.amount).toFixed(2)" type="number" class="form-control" disabled />
          </td>

          <td class="col-3 text-end align-middle" v-if="!item.isEditing">
            {{ formatDate(item.date) }}
          </td>
          <td class="col-3 align-middle" v-else>
            <input v-model="item.date" type="date" class="form-control" />
          </td>

          <td class="col-2 text-center align-middle" v-if="item.isEditing">
            <div class="d-flex justify-content-center align-items-center">
              <div
                class="bi bi-save fs-5 ps-3"
                title="save"
                style="cursor: pointer;"
                @click.stop="saveExpenditure(item.id, item)">
              </div>
              <div
                class="bi bi-trash fs-5 ps-3 ms-2"
                title="delete"
                style="cursor: pointer;"
                @click.stop="deleteExpenditure(item.id)">
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
table.table-hover td,
table.table-hover th {
  border: none !important;
}
</style>
