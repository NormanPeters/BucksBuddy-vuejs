<!-- src/components/SignUpCard.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import type { SignupData } from '@/types'

import CardComponent from '@/components/atoms/CardComponent.vue'
import InputField from '@/components/atoms/InputField.vue'
import BaseButton from '@/components/atoms/PrimaryButton.vue'

const signupData = ref<SignupData>({
  username: '',
  password: '',
  confirmPassword: ''
})

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const router = useRouter()
const usernamePattern = /^[a-zA-Z0-9._-]{3,20}$/

const signup = async () => {
  successMessage.value = null
  errorMessage.value = null

  if (!usernamePattern.test(signupData.value.username)) {
    errorMessage.value = 'Invalid username format'
    return
  }

  if (signupData.value.password !== signupData.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  const newUser = {
    username: signupData.value.username,
    password: signupData.value.password
  }

  try {
    await api.createUser(newUser)
    successMessage.value = 'User created successfully'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = 'Invalid input: ' + JSON.stringify(error.response.data)
    } else if (error.response && error.response.status === 409) {
      errorMessage.value = 'Username is already registered'
    } else {
      errorMessage.value = 'An error occurred'
    }
  }
}
</script>

<template>
  <CardComponent class="border-0" style="background-color: var(--bs-body-bg)">
    <!-- Icon und Überschrift -->
    <i
      class="bi bi-currency-exchange d-flex justify-content-center align-items-center fs-1 mb-3"
    ></i>
    <h1 class="text-center mb-5">BUCKS BUDDY</h1>

    <!-- Formular für die Registrierung -->
    <form @submit.prevent="signup">
      <InputField class="mb-3" id="username" label="Username" v-model="signupData.username" />
      <InputField
        class="mb-3"
        id="password"
        label="Password"
        type="password"
        v-model="signupData.password"
      />
      <InputField
        class="mb-3"
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        v-model="signupData.confirmPassword"
      />
      <BaseButton type="submit" class="d-none">Submit</BaseButton>
    </form>

    <!-- Buttons für Anmeldung und Registrierung -->
    <div class="row mt-5">
      <div class="col-6">
        <BaseButton @click.prevent="signup">Sign in</BaseButton>
      </div>
      <div class="col-6">
        <BaseButton @click="$router.push('/login')" class="btn-secondary">Log in</BaseButton>
      </div>
    </div>

    <!-- Erfolg- und Fehlermeldungen -->
    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </CardComponent>
</template>

<style scoped></style>
