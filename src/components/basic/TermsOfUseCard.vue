<script setup lang="ts">
import CardComponent from '@/components/atoms/CardComponent.vue'
import SectionHeader from '@/components/atoms/SectionHeader.vue'
</script>

<template>
  <CardComponent>
    <SectionHeader title="Terms of Use" />
    <div>
      <p>
        This app is made only for showing and demonstrating ideas. It is not meant to be used for real-world situations or business purposes. By using this app, you agree to the following rules:
      </p>

      <p><strong>1. Purpose of the App</strong></p>
      <p>
        This app is only for demonstration and learning. It should not be used for real tasks or to handle sensitive information.
      </p>

      <p><strong>2. Data Storage</strong></p>
      <p>
        The data entered into this app is stored, but only for demonstration. The security of the data is not guaranteed. Do not enter personal or sensitive information. You can delete your account in the "Settings" section, which will also delete all data linked to it.
      </p>

      <p><strong>3. Disclaimer</strong></p>
      <p>
        The developer is not responsible for any damage caused by using this app. The app is provided "as is," without any promises about how it works.
      </p>

      <p><strong>4. No Commercial Use</strong></p>
      <p>
        You are not allowed to use this app for business purposes. You cannot sell or share it without permission from the developer.
      </p>

      <p><strong>5. Changes to the Terms of Use</strong></p>
      <p>
        The developer may change these terms at any time. Users will be told if changes are made.
      </p>

      <p><strong>By using this app, you agree to these terms.</strong></p>
    </div>
    <button type="button" class="btn btn-link" @click="$router.go(-1)">Back</button>
  </CardComponent>
</template>

<style scoped>
div {
  line-height: 1.6;
}
</style>