<script setup lang="ts">
import { reactive, ref } from 'vue'
import api from '@/services/api'
import type { UserData } from '@/types'
import CardComponent from '@/components/atoms/CardComponent.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import InputField from '@/components/atoms/InputField.vue'

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
</script>

<template>
  <CardComponent>
    <!-- Username -->
    <h3 class="text-center mb-4 text-xl font-bold">Settings</h3>
    <div class="mb-3">
      <label for="userName" class="block text-sm font-medium text-gray-700">Username</label>
      <input
        type="text"
        class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        id="userName"
        v-model="userData.username"
        disabled
      />
    </div>
    <!-- Change Password -->
    <div>
      <BaseButton class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" @click="toggleChangePassword">
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
            <BaseButton type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Change Password</BaseButton>
          </div>
        </form>
        <div v-if="passwordErrorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3" role="alert">
          {{ passwordErrorMessage }}
        </div>
        <div v-if="passwordSuccessMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3" role="alert">
          {{ passwordSuccessMessage }}
        </div>
      </div>
    </div>

    <hr class="border-gray-300 my-4" />

    <!-- Delete User -->
    <div class="text-center text-red-600">
      <h5 class="font-bold">Danger Zone</h5>
      <p>Deleting your account is permanent and cannot be undone.</p>
    </div>
    <div class="text-center mb-3">
      <BaseButton @click="confirmDeleteUser" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> Delete User </BaseButton>
    </div>
    <div v-if="deleteErrorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3" role="alert">
      {{ deleteErrorMessage }}
    </div>
    <div v-if="deleteSuccessMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3" role="alert">
      {{ deleteSuccessMessage }}
    </div>
  </CardComponent>
</template>

