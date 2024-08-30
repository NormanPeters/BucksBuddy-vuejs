<!-- src/atoms/CenteredContainer.vue -->
<template>
  <div class="d-flex justify-content-center" :style="{ minHeight: minHeight }">
    <div class="col-xl-4 col-lg-5 col-md-7 col-sm-10">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  minHeight: {
    type: String,
    default: '100vh',
  },
});
</script>

<style scoped>
</style>
