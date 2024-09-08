<!--JourneyCard-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/services/api'
import type { Expenditure, Journey } from '@/types'
import FreeCurrencyAPI from '@everapi/freecurrencyapi-js'
import eventBus from '@/services/eventBus'
import CardComponent from '@/components/atoms/CardComponent.vue'
import SecondaryButton from '@/components/atoms/SecondaryButton.vue'

const expendituresList = ref<Expenditure[]>([])
const currencyAPI = new FreeCurrencyAPI(import.meta.env.VITE_API_KEY)
const journeys = ref<Journey[]>([])
const selectedJourneyId = ref<number | null>(Number(localStorage.getItem('selectedJourney')))
const uuid = localStorage.getItem('UUID') || 'default-uuid'
const homeCurrency = ref<string>('')
const vacCurrency = ref<string>('')
const budget = ref<number>(0)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const exchangeRate = ref<number>(0)
const journeyToDelete = ref<number | null>(null)

// Funktion zum Abrufen der Ausgaben für eine bestimmte Reise
const fetchExpenditures = async (journeyId: number) => {
  try {
    const response = await api.getAllExpenditures(journeyId)
    expendituresList.value = response.data
  } catch (error) {
    console.error('Error fetching expenditures:', error)
  }
}

// Funktion zum Abrufen der Details einer bestimmten Reise
const fetchJourneyDetails = async (journeyId: number) => {
  try {
    const journeyResponse = await api.getJourneyById(journeyId)
    const journey = journeyResponse.data
    homeCurrency.value = await api.getHomeCurrency(journeyId).then((response) => response.data)
    vacCurrency.value = await api.getVacCurrency(journeyId).then((response) => response.data)
    budget.value = await api.getBudget(journeyId).then((response) => response.data)
    startDate.value = new Date(journey.startDate)
    endDate.value = new Date(journey.endDate)
    exchangeRate.value = await currencyAPI
      .latest({
        base_currency: homeCurrency.value,
        currencies: vacCurrency.value
      })
      .then((response: any) => response.data[vacCurrency.value])
    eventBus.emit('vacCurrencyUpdated', vacCurrency.value)
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


// Delete journey section
const deleteJourney = async () => {
  journeyToDelete.value = selectedJourneyId.value
  if (journeyToDelete.value === null) return

  try {
    await api.deleteJourney(journeyToDelete.value);
    await fetchJourneys();
    selectedJourneyId.value = null;
    localStorage.removeItem('selectedJourney');
    eventBus.emit('journeyIdChanged', null);
    journeyToDelete.value = null;
  } catch (error) {
    console.error('Error deleting journey:', error);
  }
};

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
  return rate !== null ? rate : 'N/A'
}

// Berechnet die Gesamtausgaben in der Heimatwährung basierend auf dem Wechselkurs
const totalExpensesInHomeCurrency = computed(() => {
  return parseFloat((totalExpenditures.value / exchangeRate.value).toFixed(2))
})

// Berechnet das Budget in der Urlaubswährung basierend auf dem Wechselkurs
const budgetInVacationCurrency = computed(() => {
  return parseFloat((budget.value * exchangeRate.value).toFixed(2))
})

// Berechnet das verbleibende Budget in der Urlaubswährung
const budgetLeftInVacationCurrency = computed(() => {
  if (exchangeRate.value) {
    const budgetInVacCurr = parseFloat((budget.value * exchangeRate.value).toFixed(2))
    return parseFloat((budgetInVacCurr - totalExpenditures.value).toFixed(2))
  } else {
    return 0
  }
})

// Berechnet das verbleibende Budget in der Heimatwährung
const budgetLeftInHomeCurrency = computed(() => {
  return parseFloat((budget.value - totalExpensesInHomeCurrency.value).toFixed(2))
})

// Berechnet die Reisedauer in Tagen basierend auf Start- und Enddatum
const travelDurationInDays = computed(() => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value).getTime()
    const end = new Date(endDate.value).getTime()
    const diff = end - start
    return diff > 0 ? diff / (1000 * 3600 * 24) + 1 : 0
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
const formatDate = (dateString: Date | null): string => {
  if (!dateString) {
    return ''
  }
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

// Wird beim Mounten der Komponente ausgeführt: Lädt Reisen und setzt die ausgewählte Reise
onMounted(async () => {
  await fetchJourneys()
  const storedJourneyId = Number(localStorage.getItem('selectedJourney'))
  if (storedJourneyId && journeys.value.some((j) => j.id === storedJourneyId)) {
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
  <CardComponent>
    <div class="row d-flex justify-content-center align-items-center mb-3">
      <div class="col-6 d-flex align-items-center">
        <h4 class="mb-0">Journey</h4>
      </div>
      <div class="col-5">
        <select class="form-select" v-model="selectedJourneyId">
          <option v-for="journey in journeys" :key="journey.id" :value="journey.id">
            {{ journey.name }}
          </option>
        </select>
      </div>
      <div class="col-1 d-flex justify-content-end">
        <!-- Button to trigger the delete modal -->
        <button
          class="btn bi bi-trash fs-6"
          data-bs-toggle="modal"
          data-bs-target="#deleteJourneyModal"
        ></button>
      </div>

      <!-- Modal for journey deletion -->
      <div
        class="modal fade"
        id="deleteJourneyModal"
        tabindex="-1"
        aria-labelledby="deleteJourneyModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteJourneyModalLabel">Delete Journey</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this journey? This action cannot be undone.
            </div>
            <div class="modal-footer d-flex justify-content-start">
              <div>
                <SecondaryButton
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal">
                  Cancel
                </SecondaryButton>
              </div>
              <div>
                <SecondaryButton
                  type="button"
                  class="btn btn-danger"
                  @click="deleteJourney"
                  data-bs-dismiss="modal"
                >
                  Delete Journey
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
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
          <th scope="row"><i class="bi bi-wallet me-2"></i> Budget</th>
          <td class="text-end">{{ budgetInVacationCurrency.toFixed(2) }}</td>
          <td class="text-end">{{ budget.toFixed(2) }}</td>
        </tr>
        <tr>
          <th scope="row"><i class="bi bi-wallet2 me-2"></i> Available</th>
          <td class="text-end">{{ budgetLeftInVacationCurrency.toFixed(2) }}</td>
          <td class="text-end">{{ budgetLeftInHomeCurrency.toFixed(2) }}</td>
        </tr>
        <tr>
          <th scope="row"><i class="bi bi-cash-stack me-2"></i> Total Expenses</th>
          <td class="text-end">{{ totalExpenditures.toFixed(2) }}</td>
          <td class="text-end">{{ totalExpensesInHomeCurrency.toFixed(2) }}</td>
        </tr>
        <tr>
          <th scope="row"><i class="bi bi-calendar3 me-2"></i> Average Per Day</th>
          <td class="text-end">{{ averageExpenditurePerDayInVacationCurrency }}</td>
          <td class="text-end">{{ averageExpenditurePerDayInHomeCurrency }}</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <table class="table table-hover">
      <tbody>
        <tr>
          <th scope="row"><i class="bi bi-calendar me-2"></i> Period</th>
          <td colspan="2" class="text-end">
            {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
          </td>
        </tr>
        <tr>
          <th scope="row"><i class="bi bi-clock me-2"></i> Travel Duration</th>
          <td colspan="2" class="text-end">{{ travelDurationInDays }}</td>
        </tr>
        <tr>
          <th scope="row"><i class="bi bi-currency-exchange me-2"></i> Exchange Rate</th>
          <td colspan="2" class="text-end">{{ formatExchangeRate(exchangeRate) }}</td>
        </tr>
      </tbody>
    </table>
  </CardComponent>
</template>

<style scoped>
table.table-hover td,
table.table-hover th {
  border: none !important;
}

.bi {
  color: var(--bs-primary);
}

.form-select {
  border-radius: 50px;
  font-size: 12px;
}
</style>
