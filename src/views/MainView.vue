<!--src/views/MainView.vue-->
<script setup lang="ts">
import {ref} from 'vue';
import TotalExpenditures from "@/components/expenses/JourneyCard.vue";
import History from "@/components/expenses/HistoryCard.vue";
import InputForm from "@/components/expenses/InputformCard.vue";

const historyComponent = ref();

const handleRefreshExpenditures = () => {
  if (historyComponent.value) {
    historyComponent.value.fetchExpenditures();
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <TotalExpenditures />
        <InputForm @refreshExpenditures="handleRefreshExpenditures" />
      </div>
      <div>
        <History ref="historyComponent" />
      </div>
    </div>
  </div>
</template>


