<!-- src/components/CardComponent.vue -->
<template>
  <div class="card shadow mb-3 p-1">
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card {
  border: none;
}
</style>