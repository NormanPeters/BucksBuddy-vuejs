<!--SignUpCard-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import {useRouter} from 'vue-router';
import api from '@/services/api';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo_invert.png';
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore();

const logoSrc = computed(() => {
  return themeStore.theme === 'light' ? logoLight : logoDark;
});

interface SignupData {
  username: string;
  password: string;
  confirmPassword: string;
}

const signupData = ref<SignupData>({
  username: '',
  password: '',
  confirmPassword: ''
});

const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const router = useRouter();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async () => {
  successMessage.value = null;
  errorMessage.value = null;

  if (!emailPattern.test(signupData.value.username)) {
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
    const response = await api.createUser(newUser);
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
  <div class="card shadow m-3 p-3">
    <div class="card-body">
      <div class="d-flex justify-content-center align-items-center">
        <img :src="logoSrc" alt="Logo" style="width: auto; height: 70px;">
      </div>
      <form @submit.prevent="signup">
        <div class="mb-3">
          <label for="username" class="form-label">Email</label>
          <input type="userName" class="form-control" id="username" v-model="signupData.username" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="signupData.password" required>
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input type="password" class="form-control" id="confirmPassword" v-model="signupData.confirmPassword"
                 required>
        </div>
        <div class="text-center mb-3">
          <button type="submit" class="btn btn-primary custom-width-btn">Sign up</button>
        </div>
      </form>
      <hr>
      <div class="text-center">
        <a href="#/login" class="text-decoration-none">Already have an account? Log in</a>
      </div>
      <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
.custom-width-btn {
  width: 100%;
}
</style>
