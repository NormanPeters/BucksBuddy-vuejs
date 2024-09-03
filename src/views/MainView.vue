<!-- MainView.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TotalExpenditures from '@/components/expenses/JourneyCard.vue'
import History from '@/components/expenses/HistoryCard.vue'
import InputForm from '@/components/expenses/InputformCard.vue'
import NavBarVertical from '@/components/basic/NavBarVertical.vue'
import NavBarHorizontal from '@/components/basic/NavBarHorizontal.vue'

const historyComponent = ref()
const isMobile = ref(window.innerWidth < 768)
const isDesktop = ref(window.innerWidth >= 769)

const handleRefreshExpenditures = () => {
  if (historyComponent.value) {
    historyComponent.value.fetchExpenditures()
  }
}

const updateBreakpoint = () => {
  isMobile.value = window.innerWidth < 768
  isDesktop.value = window.innerWidth >= 769
}

onMounted(() => {
  window.addEventListener('resize', updateBreakpoint)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBreakpoint)
})
</script>

<template>
  <!-- Desktop -->
  <div v-if="isDesktop" class="app-container d-flex flex-column flex-md-row">
    <NavBarVertical class="navbar" />
    <div class="main-content row flex-grow-1">
      <div class="row">
        <div class="col-xl-6 col-lg-12 col-md-12 d-flex flex-column">
          <!-- Card 1 -->
          <total-expenditures class="flex-fill mb-3" />
          <!-- Card 2 -->
          <input-form @refreshExpenditures="handleRefreshExpenditures" class="flex-fill" />
        </div>
        <div class="col-xl-6 col-lg-12 col-md-12">
          <history ref="historyComponent" />
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile -->
  <div v-if="isMobile" class="app-container d-flex flex-column flex-md-row">
    <NavBarHorizontal v-if="isMobile" class="navbar" />
    <div class="main-content-mobile flex-grow-1">
      <div class="row">
        <div class="col-12 d-flex flex-column">
          <!-- Card 1 -->
          <total-expenditures class="flex-fill mb-3" />
          <!-- Card 2 -->
          <input-form @refreshExpenditures="handleRefreshExpenditures" class="flex-fill" />
        </div>
        <div class="col-12">
          <history ref="historyComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  background-color: var(--bs-secondary-bg);
}

.main-content {
  padding: 30px;
  margin: 20px;
  overflow-y: auto;
  background-color: var(--bs-body-bg);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
}

.main-content-mobile {
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}
</style>
