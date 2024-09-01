<template>
  <div class="flex justify-center items-center" :style="{ minHeight: minHeight }">
    <div class="w-full max-w-xl md:max-w-lg lg:max-w-md xl:max-w-sm">
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
