<!-- src/components/InputField.vue -->
<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :type="type"
      class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
