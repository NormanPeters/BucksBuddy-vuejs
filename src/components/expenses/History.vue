<!--History-->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api';
import { type Expenditure } from '@/types';
import eventBus from '@/services/eventBus';

const expendituresList = ref<Expenditure[]>([]);
const sortedExpenditures = ref<Expenditure[]>([]);
const journeyId = ref<number | null>(Number(localStorage.getItem('selectedJourney')));
const vacCurrency = ref<string>('');
const homeCurrency = ref<string>('');
const exchangeRate = ref<number | null>(null);
const selectedExpenditureId = ref<number | null>(null); // Track the selected expenditure

const sortCriteria = ref<string>('name');
const sortOrder = ref<string>('asc');

const fetchExpenditures = async () => {
  if (journeyId.value === null) {
    console.error('Cannot fetch expenditures: journeyId is null');
    return;
  }

  try {
    const response = await api.getAllExpenditures(journeyId.value);
    expendituresList.value = response.data.map((expenditure: Expenditure) => ({
      ...expenditure,
      isEditing: false,
    }));
    sortExpenditures();
    const homeCurrencyResponse = await api.getHomeCurrency(journeyId.value);
    homeCurrency.value = homeCurrencyResponse.data;
    const vacCurrencyResponse = await api.getVacCurrency(journeyId.value);
    vacCurrency.value = vacCurrencyResponse.data;
  } catch (error) {
    console.error('Error fetching expenditures:', error);
  }
};

const clearExpenditures = () => {
  expendituresList.value = [];
  sortedExpenditures.value = [];
  vacCurrency.value = '';
  homeCurrency.value = '';
};

const deleteExpenditure = async (id: number) => {
  try {
    if (journeyId.value === null) {
      console.error('Cannot delete expenditure: journeyId is null');
      return;
    }
    await api.deleteExpenditure(journeyId.value, id);
    await fetchExpenditures();
    eventBus.emit('expenditureDeleted', journeyId.value);
  } catch (error) {
    console.error(error);
  }
};

const editExpenditure = (id: number) => {
  const index = expendituresList.value.findIndex(item => item.id === id);
  if (index !== -1) {
    expendituresList.value[index].isEditing = true;
    selectedExpenditureId.value = id; // Set the selected expenditure
  }
};

const saveExpenditure = async (id: number, updatedExpenditure: Expenditure) => {
  try {
    if (journeyId.value === null) {
      console.error('Cannot save expenditure: journeyId is null');
      return;
    }
    await api.updateExpenditure(journeyId.value, id, updatedExpenditure);
    await fetchExpenditures();
    eventBus.emit('expenditureUpdated', journeyId.value);
    selectedExpenditureId.value = null; // Clear the selected expenditure after saving
  } catch (error) {
    console.error(error);
  }
};

const amountInHomeCurrency = (amount: number): number => {
  return exchangeRate.value !== null ? (amount / exchangeRate.value) : NaN;
};

const sortExpenditures = () => {
  sortedExpenditures.value = [...expendituresList.value].sort((a, b) => {
    let comparison = 0;
    if (sortCriteria.value === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortCriteria.value === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortCriteria.value === 'homeCurrency') {
      comparison = amountInHomeCurrency(a.amount) - amountInHomeCurrency(b.amount);
    } else {
      comparison = a.name.localeCompare(b.name);
    }

    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
};

const toggleSort = (criteria: string) => {
  if (sortCriteria.value === criteria) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortCriteria.value = criteria;
    sortOrder.value = 'asc';
  }
  sortExpenditures();
};

const selectExpenditure = (id: number) => {
  selectedExpenditureId.value = selectedExpenditureId.value === id ? null : id;
};

watch([expendituresList, sortCriteria, sortOrder], sortExpenditures);

onMounted(() => {
  eventBus.on('journeyIdChanged', (newJourneyId: number | null) => {
    if (newJourneyId !== null) {
      journeyId.value = newJourneyId;
      clearExpenditures();
      fetchExpenditures();
    } else {
      clearExpenditures();
    }
  });

  eventBus.on('exchangeRateUpdated', (rate: number) => {
    exchangeRate.value = rate;
  });

  eventBus.on('vacCurrencyUpdated', (vacCurrencyName: string) => {
    vacCurrency.value = vacCurrencyName;
  });

  eventBus.on('homeCurrencyUpdated', (homeCurrencyName: string) => {
    homeCurrency.value = homeCurrencyName;
  });

  if (journeyId.value !== null) {
    fetchExpenditures();
  }
});

defineExpose({
  fetchExpenditures
});

const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};
</script>

<template>
  <div class="card shadow mb-3">
    <div class="card-body">
      <h3 class="card-title">Expenses History</h3>

      <div class="titlebox d-flex ps-2 pt-2 fw-bold">
        <div class="col-3" @click="toggleSort('name')" style="cursor: pointer;">Name</div>
        <div class="col-3 text-end" @click="toggleSort('amount')" style="cursor: pointer;">{{ vacCurrency }}</div>
        <div class="col-3 text-end" @click="toggleSort('homeCurrency')" style="cursor: pointer;">{{ homeCurrency }}</div>
        <div class="col-3 text-end" @click="toggleSort('date')" style="cursor: pointer;">Datum</div>
      </div>
      <hr>
      <div class="historycard p-2 mb-2" v-for="item in sortedExpenditures" :key="item.id">
        <div class="historycard-body d-flex align-items-center" @click="selectExpenditure(item.id)">
          <div class="col-3 fw-bold" v-if="!item.isEditing">
            {{ item.name }}
          </div>
          <div class="col-3" v-else>
            <input v-model="item.name" class="form-control"/>
          </div>

          <div class="col-3 text-end" v-if="!item.isEditing">
            {{ formatAmount(item.amount) }}
          </div>
          <div class="col-3" v-else>
            <input v-model="item.amount" type="number" class="form-control ms-2"/>
          </div>

          <div class="col-3 text-end" v-if="!item.isEditing">
            {{ amountInHomeCurrency(item.amount).toFixed(2) }}
          </div>

          <div class="col-3 text-end" v-if="!item.isEditing">
            {{ formatDate(item.date) }}
          </div>
          <div class="col-3 text-end" v-else>
            <input v-model="item.date" type="date" class="form-control ms-3"/>
          </div>
        </div>
        <div v-if="selectedExpenditureId === item.id" class="d-flex m-2">
          <button
            class="btn btn-primary me-2"
            title="edit"
            @click="editExpenditure(item.id)">
            Bearbeiten
          </button>
          <button
            class="btn btn-success me-2"
            title="save"
            @click="saveExpenditure(item.id, item)">
            Speichern
          </button>
          <button
            class="btn btn-danger"
            title="delete"
            @click="deleteExpenditure(item.id)">
            Löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
