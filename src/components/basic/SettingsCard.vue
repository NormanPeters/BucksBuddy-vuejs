<script setup lang="ts">
import { reactive, ref } from 'vue'
import api from '@/services/api'
import type { UserData } from '@/types'
import CardComponent from '@/components/atoms/CardComponent.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import InputField from '@/components/atoms/InputField.vue'
import { useThemeStore } from '@/stores/themeStore'

const userData = reactive<UserData>({
  username: localStorage.getItem('username') || '',
  newPassword: '',
  confirmPassword: ''
})

// Password change section
const showChangePassword = ref(false)
const passwordErrorMessage = ref<string | null>(null)
const passwordSuccessMessage = ref<string | null>(null)
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

function toggleChangePassword() {
  showChangePassword.value = !showChangePassword.value
}

const submitNewPassword = async () => {
  const uuid = localStorage.getItem('UUID')
  passwordErrorMessage.value = null
  passwordSuccessMessage.value = null

  if (uuid) {
    if (!passwordPattern.test(userData.newPassword)) {
      passwordErrorMessage.value =
        'Invalid password format. Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number.'
      return
    }

    if (userData.newPassword !== userData.confirmPassword) {
      passwordErrorMessage.value = 'Passwords do not match'
      return
    }

    try {
      const payload = { newPassword: userData.newPassword }
      await api.changePassword(uuid, payload)
      passwordSuccessMessage.value = 'Password changed successfully, please log in again!'
      setTimeout(() => {
        location.href = '/#/login'
      }, 2000)
    } catch (error: any) {
      passwordErrorMessage.value = 'Error changing password. Please try again.'
    }
  } else {
    passwordErrorMessage.value = 'UUID not found in localStorage'
  }
}

// Delete user section
const deleteErrorMessage = ref<string | null>(null)
const deleteSuccessMessage = ref<string | null>(null)

const deleteUser = async () => {
  const uuid = localStorage.getItem('UUID')
  deleteErrorMessage.value = null
  deleteSuccessMessage.value = null

  if (uuid) {
    try {
      await api.deleteUser(uuid)
      deleteSuccessMessage.value = 'User deleted successfully'
      localStorage.clear()
      setTimeout(() => {
        location.href = '/#/login'
      }, 2000)
    } catch (error) {
      deleteErrorMessage.value = 'Error deleting user. Please try again.'
    }
  } else {
    deleteErrorMessage.value = 'UUID not found in localStorage'
  }
}

function confirmDeleteUser() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    deleteUser()
  }
}

const themeStore = useThemeStore()
const toggleTheme = () => {
  themeStore.applyTheme(themeStore.theme === 'light' ? 'dark' : 'light')
}
</script>

<template>
  <CardComponent>
    <!-- Username -->
    <h3 class="text-center mb-4">Settings</h3>
    <div class="mb-3">
      <label for="userName" class="form-label">Username</label>
      <input type="text" class="form-control" id="userName" v-model="userData.username" disabled />
    </div>
    <!-- Change Password -->
    <div>
      <BaseButton class="btn-secondary" @click="toggleChangePassword">
        {{ showChangePassword ? 'Hide' : 'Change Password' }}
      </BaseButton>
      <div class="mt-3" v-if="showChangePassword">
        <form @submit.prevent="submitNewPassword">
          <InputField
            id="newPassword"
            label="New Password"
            type="password"
            v-model="userData.newPassword"
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            v-model="userData.confirmPassword"
          />
          <div class="text-center mb-3">
            <BaseButton type="submit" class="btn-primary custom-width-btn"
              >Change Password
            </BaseButton>
          </div>
        </form>
        <div v-if="passwordErrorMessage" class="alert alert-danger mt-3">
          {{ passwordErrorMessage }}
        </div>
        <div v-if="passwordSuccessMessage" class="alert alert-success mt-3">
          {{ passwordSuccessMessage }}
        </div>
      </div>
    </div>

    <hr />

    <!-- Delete User -->
    <div class="text-center text-danger">
      <h5>Danger Zone</h5>
      <p>Deleting your account is permanent and cannot be undone.</p>
    </div>
    <div class="text-center mb-3">
      <BaseButton @click="confirmDeleteUser" class="btn-danger"> Delete User</BaseButton>
    </div>
    <div v-if="deleteErrorMessage" class="alert alert-danger mt-3">{{ deleteErrorMessage }}</div>
    <div v-if="deleteSuccessMessage" class="alert alert-success mt-3">
      {{ deleteSuccessMessage }}
    </div>

    <!-- Theme toggle -->
    <ul>
      <li class="nav-item">
        <i
          :class="[
            themeStore.theme === 'light'
              ? 'bi bi-sun fs-3 text-dark'
              : 'bi bi-moon-stars fs-3 text-white'
          ]"
        ></i>
        <i
          :class="[
            themeStore.theme === 'light'
              ? 'bi bi-toggle-off fs-3 mx-2 text-dark'
              : 'bi bi-toggle-on fs-3 mx-2 text-white'
          ]"
          @click="toggleTheme"
        ></i>
      </li>
    </ul>
  </CardComponent>
</template>
