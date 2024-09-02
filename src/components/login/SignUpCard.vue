<!-- src/components/SignUpCard.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import logoLight from '@/assets/logo.png';

import type { SignupData } from '@/types';

import CardComponent from '@/components/atoms/CardComponent.vue';
import InputField from '@/components/atoms/InputField.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

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
      <img :src="logoLight" alt="Logo" class="mx-auto h-18">
    </div>
    <form @submit.prevent="signup">
      <InputField id="username" label="Username" v-model="signupData.username" />
      <InputField id="password" label="Password" type="password" v-model="signupData.password" />
      <InputField id="confirmPassword" label="Confirm Password" type="password" v-model="signupData.confirmPassword" />
      <div class="text-center mb-3">
        <BaseButton>Sign up</BaseButton>
      </div>
    </form>
    <hr class="border-gray-300 my-4">
    <div class="text-center mt-3">
      <a href="#/login" class="text-blue-500 hover:text-blue-700">Already have an account? Log in</a>
    </div>
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3" role="alert">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3" role="alert">
      {{ errorMessage }}
    </div>
  </CardComponent>
</template>

