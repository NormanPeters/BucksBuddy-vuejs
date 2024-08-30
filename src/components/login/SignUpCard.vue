<!-- src/components/SignUpCard.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo_invert.png';
import { useThemeStore } from '@/stores/themeStore';
import type { SignupData } from '@/types';

import CardComponent from '@/atoms/CardComponent.vue';
import InputField from '@/atoms/InputField.vue';
import BaseButton from '@/atoms/BaseButton.vue';

const themeStore = useThemeStore();

const logoSrc = computed(() => {
  return themeStore.theme === 'light' ? logoLight : logoDark;
});

const signupData = ref<SignupData>({
  username: '',
  password: '',
  confirmPassword: ''
});

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const router = useRouter();
const usernamePattern = /^[a-zA-Z0-9._-]{3,20}$/;

const signup = async () => {
  successMessage.value = null;
  errorMessage.value = null;

  if (!usernamePattern.test(signupData.value.username)) {
    errorMessage.value = 'Invalid username format';
    return;
  }

  if (signupData.value.password !== signupData.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  const newUser = {
    username: signupData.value.username,
    password: signupData.value.password
  };

  try {
    await api.createUser(newUser);
    successMessage.value = 'User created successfully';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = 'Invalid input: ' + JSON.stringify(error.response.data);
    } else if (error.response && error.response.status === 409) {
      errorMessage.value = 'Username is already registered';
    } else {
      errorMessage.value = 'An error occurred';
    }
  }
};
</script>

<template>
  <CardComponent>
    <div class="text-center my-5">
      <img :src="logoSrc" alt="Logo" class="img-fluid" style="height: 70px;">
    </div>
    <form @submit.prevent="signup">
      <InputField id="username" label="Username" v-model="signupData.username" />
      <InputField id="password" label="Password" type="password" v-model="signupData.password" />
      <InputField id="confirmPassword" label="Confirm Password" type="password" v-model="signupData.confirmPassword" />
      <div class="text-center mb-3">
        <BaseButton>Sign up</BaseButton>
      </div>
    </form>
    <hr>
    <div class="text-center mt-3">
      <a href="#/login" class="text-decoration-none">Already have an account? Log in</a>
    </div>
    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </CardComponent>
</template>

<style scoped>
</style>
