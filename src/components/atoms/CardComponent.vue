<!-- src/components/CardComponent.vue -->
<template>
  <div class="card shadow m-3 p-3">
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