<script setup lang="ts">
import CardComponent from '@/components/atoms/CardComponent.vue'
import SectionHeader from '@/components/atoms/SectionHeader.vue'
</script>

<template>
  <CardComponent>
    <SectionHeader title="Impressum" />
    <div>
      <p><strong>Norman Peters</strong></p>
      <p>Carl-Spindler-Str. 7</p>
      <p>12555 Berlin</p>

      <p><strong>Kontakt</strong></p>
      <p>E-Mail: <a href="mailto:peters.norman@proton.me">peters.norman@proton.me</a></p>
    </div>
    <button type="button" class="btn btn-link" @click="$router.go(-1)">Back</button>
  </CardComponent>
</template>

<style scoped>
div {
  line-height: 1.6;
}
a {
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>