<!-- src/components/SelectField.vue -->
<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <select :id="id" class="form-select" :value="modelValue" @input="updateValue">
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  id: String,
  label: String,
  options: Array,
  modelValue: String,
  placeholder: String,
});

const emits = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  emits('update:modelValue', (event.target as HTMLSelectElement).value);
};
</script>
