<script setup lang="ts">
import SettingsCard from '@/components/basic/SettingsCard.vue'
import NavBar from '@/components/basic/NavBar.vue'
</script>

<template>
  <div class="app-container d-flex">
    <NavBar class="navbar" />
    <div class="row flex-grow-1 justify-content-center align-items-center">
      <SettingsCard style="max-width: 50%"/>
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

.d-flex {
  display: flex;
}

</style>