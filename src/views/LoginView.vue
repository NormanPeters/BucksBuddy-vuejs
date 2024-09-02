<!--src/views/LoginView.vue-->
<script setup lang="ts">
import LoginCard from '@/components/login/LoginCard.vue'
import CenteredContainer from '@/views/viewAtoms/CenteredContainer.vue'
</script>

<template>
  <CenteredContainer class="align-items-center">
    <LoginCard />
  </CenteredContainer>
</template>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>