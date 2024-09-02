<template>
  <div class="mb-3">
    <h4 class="section-title">{{ title }}</h4> <!-- Konsistente Klasse für den Titel -->
  </div>
  <hr class="section-divider" /> <!-- Konsistente Klasse für den Divider -->
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
}>();
</script>

<style scoped>
.section-title {
  margin-bottom: 0; /* Entfernt zusätzliche Margins unter dem Titel */
  font-weight: bold; /* Optional: macht den Text fett */
}

.section-divider {
  margin-top: 1rem; /* Setzt den Abstand vor dem Divider */
  margin-bottom: 1rem; /* Setzt den Abstand nach dem Divider */
}
</style>
