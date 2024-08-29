<!-- src/components/BaseButton.vue -->
<template>
  <button type="submit" class="btn btn-primary custom-width-btn">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped>
.custom-width-btn {
  width: 100%;
}
</style>