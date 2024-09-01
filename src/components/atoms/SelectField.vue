<!-- src/components/SelectField.vue -->
<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <select :id="id" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" :value="modelValue" @input="updateValue">
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>


<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  id: string;
  label: string;
  options: { value: string; text: string }[];
  modelValue: string;
  placeholder: string;
}>();

const emits = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
  emits('update:modelValue', (event.target as HTMLSelectElement).value);
};
</script>
