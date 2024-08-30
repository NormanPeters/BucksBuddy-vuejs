<template>
  <input
    :type="type"
    v-model="inputValue"
    class="form-control"
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
