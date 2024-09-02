<!-- src/components/CardComponent.vue -->
<template>
  <div class="card p-1">
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card {
  border-radius: 10px;
  background-color: var(--bs-secondary-bg);
  height: 100%;
}
</style>