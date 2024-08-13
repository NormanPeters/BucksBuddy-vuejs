<!--JourneyCard-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/services/api'
import type { Expenditure, Journey } from '@/types'
import Freecurrencyapi from '@everapi/freecurrencyapi-js'
import eventBus from '@/services/eventBus'

const expendituresList = ref<Expenditure[]>([])
const currencyapi = new Freecurrencyapi(import.meta.env.VITE_API_KEY)
const journeys = ref<Journey[]>([])
const selectedJourneyId = ref<number | null>(Number(localStorage.getItem('selectedJourney')))
const uuid = localStorage.getItem('UUID') || 'default-uuid'
const homeCurrency = ref<string>('')
const vacCurrency = ref<string>('')
const budget = ref<number>(0)
const exchangeRate = ref<number | null>(null)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

// Funktion zum Abrufen der Ausgaben für eine bestimmte Reise
const fetchExpenditures = async (journeyId: number) => {
  try {
    const response = await api.getAllExpenditures(journeyId)
    expendituresList.value = response.data
  } catch (error) {
    console.error('Error fetching expenditures:', error)
  }
}

// Funktion zum Bestätigen und Löschen einer Reise
const confirmAndDeleteJourney = async (journeyId: number | null) => {
  if (journeyId === null) return

  const confirmDelete = confirm('Are you sure you want to delete this journey?')
  if (!confirmDelete) return

  try {
    await api.deleteJourney(journeyId)
    alert('Journey deleted successfully')
    await fetchJourneys()
    selectedJourneyId.value = null
    localStorage.removeItem('selectedJourney')
    eventBus.emit('journeyIdChanged', null)
  } catch (error) {
    console.error('Error deleting journey:', error)
  }
}

// Watcher: Reagiert auf Änderungen bei der ausgewählten Reise und lädt die entsprechenden Daten neu
watch(selectedJourneyId, async (newVal) => {
  if (newVal !== null) {
    localStorage.setItem('selectedJourney', newVal.toString())
    console.log('selectedJourneyIdnewVal:', newVal)
    console.log('selectedJourneyId:', localStorage.getItem('selectedJourney'))
    expendituresList.value = []
    await fetchJourneyDetails(newVal)
    await fetchExpenditures(newVal)
    eventBus.emit('journeyIdChanged', newVal)
  } else {
    localStorage.removeItem('selectedJourney')
    eventBus.emit('journeyIdChanged', null)
  }
})

// Funktion zum Abrufen der Details einer bestimmten Reise
const fetchJourneyDetails = async (journeyId: number) => {
  try {
    const journeyResponse = await api.getJourneyById(journeyId)
    const journey = journeyResponse.data
    homeCurrency.value = await api.getHomeCurrency(journeyId).then(response => response.data)
    vacCurrency.value = await api.getVacCurrency(journeyId).then(response => response.data)
    budget.value = await api.getBudget(journeyId).then(response => response.data)
    startDate.value = new Date(journey.startDate)
    endDate.value = new Date(journey.endDate)
    exchangeRate.value = await currencyapi.latest({
      base_currency: homeCurrency.value,
      currencies: vacCurrency.value
    }).then((response: any) => response.data[vacCurrency.value])
    eventBus.emit('exchangeRateUpdated', exchangeRate.value)
  } catch (error) {
    console.error('Error fetching journey details:', error)
  }
}

// Funktion zum Abrufen aller Reisen des Benutzers
const fetchJourneys = async () => {
  try {
    if (!uuid) {
      console.error('UUID is missing')
      return
    }
    const response = await api.getAllJourneys(uuid)
    if (response.data && Array.isArray(response.data)) {
      journeys.value = response.data
    } else {
      console.error('Unexpected API response:', response)
    }
  } catch (error) {
    console.error('Error fetching journeys:', error)
  }
}

// Berechnet die Gesamtausgaben für die aktuelle Reise
const totalExpenditures = computed(() => {
  return expendituresList.value.reduce((sum, expenditure) => sum + expenditure.amount, 0)
})

// Funktion zum Abrufen des Währungsnamens anhand des Währungscodes
const getCurrencyName = (code: string) => {
  return code
}

// Funktion zum Formatieren des Wechselkurses auf zwei Nachkommastellen
const formatExchangeRate = (rate: number | null) => {
  return rate !== null ? rate.toFixed(2) : 'N/A'
}

// Berechnet die Gesamtausgaben in der Heimatwährung basierend auf dem Wechselkurs
const totalExpensesInHomeCurrency = computed(() => {
  if (typeof exchangeRate.value === 'number' && typeof totalExpenditures.value === 'number') {
    return parseFloat((totalExpenditures.value / exchangeRate.value).toFixed(2))
  } else {
    return 0
  }
})

// Berechnet das Budget in der Urlaubswährung basierend auf dem Wechselkurs
const budgetInVacationCurrency = computed(() => {
  if (typeof exchangeRate.value === 'number' && typeof budget.value === 'number') {
    return parseFloat((budget.value * exchangeRate.value).toFixed(2))
  } else {
    return 0
  }
})

// Berechnet das verbleibende Budget in der Urlaubswährung
const budgetLeftInVacationCurrency = computed(() => {
  if (typeof exchangeRate.value === 'number' && typeof totalExpenditures.value === 'number') {
    const budgetInVacCurr = parseFloat((budget.value * exchangeRate.value).toFixed(2))
    return parseFloat((budgetInVacCurr - totalExpenditures.value).toFixed(2))
  } else {
    return 0
  }
})

// Berechnet das verbleibende Budget in der Heimatwährung
const budgetLeftInHomeCurrency = computed(() => {
  if (typeof budget.value === 'number' && typeof totalExpensesInHomeCurrency.value === 'number') {
    return parseFloat((budget.value - totalExpensesInHomeCurrency.value).toFixed(2))
  } else {
    return 0
  }
})

// Berechnet die Reisedauer in Tagen basierend auf Start- und Enddatum
const travelDurationInDays = computed(() => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value).getTime()
    const end = new Date(endDate.value).getTime()
    const diff = end - start
    return diff > 0 ? diff / (1000 * 3600 * 24) : 0
  }
  return 0
})

// Berechnet die durchschnittlichen Ausgaben pro Tag in der Urlaubswährung
const averageExpenditurePerDayInVacationCurrency = computed(() => {
  const days = travelDurationInDays.value
  return days > 0 ? (totalExpenditures.value / days).toFixed(2) : 'N/A'
})

// Berechnet die durchschnittlichen Ausgaben pro Tag in der Heimatwährung
const averageExpenditurePerDayInHomeCurrency = computed(() => {
  const days = travelDurationInDays.value
  const totalExpenditureInHomeCurrency = totalExpensesInHomeCurrency.value
  return days > 0 ? (totalExpenditureInHomeCurrency / days).toFixed(2) : 'N/A'
})

// Funktion zum Formatieren eines Datums als String im Format 'DD.MM.YY'
const formatDate = (dateString: Date): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${day}.${month}.${year}`
}

// Watcher: Setzt die erste Reise als ausgewählte Reise, wenn keine ausgewählt ist
watch(journeys, (newJourneys) => {
  if (newJourneys.length > 0 && !selectedJourneyId.value) {
    selectedJourneyId.value = newJourneys[0].id
  }
})

// Wird beim Mounten der Komponente ausgeführt: Lädt Reisen und setzt die ausgewählte Reise
onMounted(async () => {
  await fetchJourneys()
  const storedJourneyId = Number(localStorage.getItem('selectedJourney'))
  if (storedJourneyId && journeys.value.some(j => j.id === storedJourneyId)) {
    selectedJourneyId.value = storedJourneyId
    await fetchJourneyDetails(storedJourneyId)
    await fetchExpenditures(storedJourneyId)
  } else {
    localStorage.removeItem('selectedJourney')
    if (journeys.value.length > 0) {
      selectedJourneyId.value = journeys.value[0].id
      await fetchJourneyDetails(journeys.value[0].id)
      await fetchExpenditures(journeys.value[0].id)
    } else {
      selectedJourneyId.value = null
    }
    eventBus.emit('journeyIdChanged', null)
  }

  // EventListener für das Hinzufügen, Löschen und Aktualisieren von Ausgaben
  eventBus.on('expenditureAdded', async () => {
    if (selectedJourneyId.value !== null) {
      await fetchJourneyDetails(selectedJourneyId.value)
      await fetchExpenditures(selectedJourneyId.value)
    }
  })

  eventBus.on('expenditureDeleted', async () => {
    if (selectedJourneyId.value !== null) {
      await fetchJourneyDetails(selectedJourneyId.value)
      await fetchExpenditures(selectedJourneyId.value)
    }
  })

  eventBus.on('expenditureUpdated', async () => {
    if (selectedJourneyId.value !== null) {
      await fetchJourneyDetails(selectedJourneyId.value)
      await fetchExpenditures(selectedJourneyId.value)
    }
  })
})

</script>

<template>
  <div class="card shadow mb-3">
    <div class="card-body">
      <div class="d-flex mb-3">
        <select class="form-select me-2" v-model="selectedJourneyId">
          <option v-if="journeys.length === 0" disabled value="">Please Create A Journey</option>
          <option v-for="journey in journeys" :key="journey.id" :value="journey.id">{{ journey.name }}</option>
        </select>
        <button class="btn bi bi-plus-lg fs-5" @click="$router.push('/newjourney')"></button>
        <button class="btn bi bi-trash fs-5" @click="confirmAndDeleteJourney(selectedJourneyId)"></button>
      </div>
      <table class="table table-hover">
        <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col" class="text-end">{{ getCurrencyName(vacCurrency) }}</th>
          <th scope="col" class="text-end">{{ getCurrencyName(homeCurrency) }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Budget</th>
          <td class="text-end">{{ budgetInVacationCurrency }}</td>
          <td class="text-end">{{ budget }}</td>
        </tr>
        <tr>
          <th scope="row">Available</th>
          <td class="text-end">{{ budgetLeftInVacationCurrency }}</td>
          <td class="text-end">{{ budgetLeftInHomeCurrency }}</td>
        </tr>
        <tr>
          <th scope="row">Total Expenses</th>
          <td class="text-end">{{ totalExpenditures }}</td>
          <td class="text-end">{{ totalExpensesInHomeCurrency }}</td>
        </tr>
        <tr>
          <th scope="row">Average Per Day</th>
          <td class="text-end">{{ averageExpenditurePerDayInVacationCurrency }}</td>
          <td class="text-end">{{ averageExpenditurePerDayInHomeCurrency }}</td>
        </tr>
        </tbody>
      </table>
      <hr>
      <table class="table table-hover">
        <tbody>
        <tr>
          <th scope="row">Period</th>
          <td colspan="2" class="text-end">{{ formatDate(startDate) }} - {{ formatDate(endDate) }}</td>
        </tr>
        <tr>
          <th scope="row">Travel Duration</th>
          <td colspan="2" class="text-end">{{ (travelDurationInDays) + 1 }}</td>
        </tr>
        <tr>
          <th scope="row">Exchange Rate</th>
          <td colspan="2" class="text-end">{{ formatExchangeRate(exchangeRate) }}</td>
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
