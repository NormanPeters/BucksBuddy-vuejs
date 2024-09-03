<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SettingsCard from '@/components/basic/SettingsCard.vue'
import NavBarVertical from '@/components/basic/NavBarVertical.vue'
import NavBarHorizontal from '@/components/basic/NavBarHorizontal.vue'

const isMobile = ref(window.innerWidth < 768)
const isDesktop = ref(window.innerWidth >= 769)

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
    <div class="main-content row flex-grow-1 justify-content-center align-items-center">
      <SettingsCard style="max-width: 50%" />
    </div>
  </div>

  <!-- Mobile -->
  <div v-if="isMobile" class="app-container d-flex flex-column">
    <NavBarHorizontal v-if="isMobile" class="navbar" />
    <div class="main-content-mobile flex-grow-1 justify-content-center align-items-center">
      <SettingsCard style="max-width: 100%" />
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
  padding: 20px;
}

.d-flex {
  display: flex;
}
</style>
