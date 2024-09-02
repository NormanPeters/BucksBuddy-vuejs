<!--src/views/MainView.vue-->
<script setup lang="ts">
import { ref } from 'vue'
import TotalExpenditures from '@/components/expenses/JourneyCard.vue'
import History from '@/components/expenses/HistoryCard.vue'
import InputForm from '@/components/expenses/InputformCard.vue'
import NavBar from '@/components/basic/NavBar.vue'

const historyComponent = ref()

const handleRefreshExpenditures = () => {
  if (historyComponent.value) {
    historyComponent.value.fetchExpenditures()
  }
}
</script>

<template>
  <div class="app-container d-flex">
    <NavBar class="navbar" />
    <div class="row flex-grow-1">
      <div class="col-lg-6 col-md-9 col-sm-12 d-flex flex-column">
        <!-- Card 1 -->
        <total-expenditures class="flex-fill mb-3" />
        <!-- Card 2 -->
        <input-form @refreshExpenditures="handleRefreshExpenditures" class="flex-fill" />
      </div>
      <div class="col-lg-6 col-md-9 col-sm-12">
        <history ref="historyComponent" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  background-color: var(--bs-secondary-bg);
}

.row {
  padding: 30px;
  margin: 20px;
  overflow-y: auto;
  background-color: var(--bs-body-bg);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}

.flex-fill {
  flex: 1; /* Jede Karte nimmt gleichmäßig den verfügbaren Platz ein */
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}
</style>