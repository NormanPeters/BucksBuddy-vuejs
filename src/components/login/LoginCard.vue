<!-- src/components/LoginCard.vue -->
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useThemeStore } from '@/stores/themeStore'
import logoLight from '@/assets/logo.png'
import logoDark from '@/assets/logo_invert.png'

import CardComponent from '@/components/atoms/CardComponent.vue'
import InputField from '@/components/atoms/InputField.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const themeStore = useThemeStore()

const logoSrc = computed(() => {
  return themeStore.theme === 'light' ? logoLight : logoDark
})

const router = useRouter()
const loginData = reactive({
  username: '',
  password: ''
})

const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const login = async () => {
  errorMessage.value = null
  successMessage.value = null

  try {
    const response = await api.login(loginData.username, loginData.password)
    localStorage.setItem('UUID', response.data)
    localStorage.setItem('username', loginData.username)
    successMessage.value = 'Login successful!'
    setTimeout(async () => {
      await router.push('/main')
    }, 1000)
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Incorrect username or password.'
    } else {
      errorMessage.value = 'Login failed. Please check your credentials and try again.'
    }
  }
}
</script>

<template>
  <CardComponent class="border-0" style="background-color: var(--bs-body-bg)">
    <i class="bi bi-currency-exchange d-flex justify-content-center align-items-center fs-1 mb-3"></i>
    <h1 class="text-center mb-5">BUCKS BUDDY</h1>
    <form @submit.prevent="login">
      <InputField class="mb-3" id="username" label="Username" v-model="loginData.username" />
      <InputField class="mb-3" id="password" label="Password" type="password" v-model="loginData.password" />
      <BaseButton type="submit" class="d-none">Submit</BaseButton>
    </form>
    <div class="row mt-5">
      <div class="col-6">
        <BaseButton @click.prevent="login">Log in</BaseButton>
      </div>
      <div class="col-6">
        <BaseButton @click="$router.push('/signup')">Sign up</BaseButton>
      </div>
    </div>
    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </CardComponent>
</template>

<style scoped>

</style>