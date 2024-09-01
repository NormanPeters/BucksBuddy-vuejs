<!-- src/components/atoms/EditableInputField.vue -->
<template>
  <input
    :type="type"
    v-model="inputValue"
    class="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    @keyup.enter="onEnter"
  />
</template>


<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
});

const emits = defineEmits(['update:modelValue', 'enter']);

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const onEnter = () => {
  emits('enter');
};
</script>
