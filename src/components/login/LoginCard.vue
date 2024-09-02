<!-- src/components/LoginCard.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import logoLight from '@/assets/logo.png';

import CardComponent from '@/components/atoms/CardComponent.vue';
import InputField from '@/components/atoms/InputField.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';



const router = useRouter();
const loginData = reactive({
  username: '',
  password: ''
});

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const login = async () => {
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await api.login(loginData.username, loginData.password);
    localStorage.setItem('UUID', response.data);
    localStorage.setItem('username', loginData.username);
    successMessage.value = 'Login successful!';
    setTimeout(async () => {
      await router.push('/main');
    }, 1000);
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Incorrect username or password.';
    } else {
      errorMessage.value = 'Login failed. Please check your credentials and try again.';
    }
  }
};
</script>

<template>
  <CardComponent>
    <div class="text-center my-5">
      <img :src="logoLight" alt="Logo" class="mx-auto h-18">
    </div>
    <form @submit.prevent="login">
      <InputField id="username" label="Username" v-model="loginData.username" />
      <InputField id="password" label="Password" type="password" v-model="loginData.password" />
      <div class="text-center mb-3">
        <BaseButton>Log in</BaseButton>
      </div>
    </form>
    <hr class="border-gray-300 my-4">
    <div class="text-center mt-3">
      <BaseButton @click="$router.push('/signup')" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Sign up</BaseButton>
    </div>
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3" role="alert">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3" role="alert">
      {{ errorMessage }}
    </div>
  </CardComponent>
</template>
