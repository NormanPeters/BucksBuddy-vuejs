<!-- src/components/InputField.vue -->
<template>
  <div class="mb-3">
    <label :for="id" class="form-label mx-1">{{ label }}</label>
    <input
      :type="type"
      class="form-control"
      :id="id"
      :value="modelValue"
      @input="updateValue"
      required
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  modelValue: String,
});

const emits = defineEmits(['update:modelValue']);

function updateValue(event: Event) {
  emits('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<style scoped>
.form-control {
  background-color: var(--bs-body-bg);
  border-radius: 50px;
}
</style>