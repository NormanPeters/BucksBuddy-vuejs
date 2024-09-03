<template>
  <RouterLink :to="to" class="btn custom-button d-flex align-items-center" :class="{ active: isActive }">
    <span class="icon">
      <slot name="icon"></slot> <!-- Slot für das Icon -->
    </span>
    <span class="button-text ms-3">
      <slot></slot> <!-- Slot für den Text -->
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const isActive = computed(() => route.path === props.to);
</script>

<style scoped>
.custom-button {
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: transparent;
  color: var(--bs-body-color);
  font-size: 14px;
  font-family: "Rubik", sans-serif;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.custom-button:hover,
.custom-button:focus {
  background-color: var(--bs-tertiary-bg) !important; /* Sicherstellen, dass Hover-Effekt angewendet wird */
  color: var(--bs-primary) !important;
}

.custom-button.active {
  background-color: var(--bs-tertiary-bg) !important; /* Hintergrundfarbe für aktiven Zustand */
  color: var(--bs-primary) !important; /* Textfarbe für aktiven Zustand */
}

.icon {
  font-size: 27px;
  color: inherit; /* Gleiche Farbe wie der Text */
}
</style>
