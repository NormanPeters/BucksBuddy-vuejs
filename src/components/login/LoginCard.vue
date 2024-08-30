<!-- src/components/LoginCard.vue -->
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useThemeStore } from '@/stores/themeStore';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo_invert.png';

import CardComponent from '@/components/atoms/CardComponent.vue';
import InputField from '@/components/atoms/InputField.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

const themeStore = useThemeStore();

const logoSrc = computed(() => {
  return themeStore.theme === 'light' ? logoLight : logoDark;
});

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
      <img :src="logoSrc" alt="Logo" class="img-fluid" style="height: 70px;">
    </div>
    <form @submit.prevent="login">
      <InputField id="username" label="Username" v-model="loginData.username" />
      <InputField id="password" label="Password" type="password" v-model="loginData.password" />
      <div class="text-center mb-3">
        <BaseButton>Log in</BaseButton>
      </div>
    </form>
    <hr>
    <div class="text-center mt-3">
      <BaseButton @click="$router.push('/signup')" class="btn-secondary">Sign up</BaseButton>
    </div>
    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </CardComponent>
</template>