<!-- src/atoms/CenteredContainer.vue -->
<template>
  <div class="d-flex justify-content-center align-items-center" :style="{ minHeight: minHeight }">
    <div class="col-xxl-4 col-xl-5 col-lg-6 col-md-8 col-sm-10 col-12">
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
