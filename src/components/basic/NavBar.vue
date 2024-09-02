<!--NavBar.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import type { UserData } from '@/types'
import CustomButton from '@/components/atoms/NavBarLink.vue'

const isActive = (path) => (router.currentRoute.value.path === path ? 'active' : '')

const router = useRouter()
const logout = () => {
  localStorage.removeItem('UUID')
  localStorage.removeItem('selectedJourney')
  router.push('/login')
}

const userData = reactive<UserData>({
  username: localStorage.getItem('username') || ''
})
</script>

<template>
  <nav class="navbar d-flex flex-column justify-content-between p-3">
    <div class="mt-3">
      <!-- Icon -->
      <i
        class="bi bi-currency-exchange d-flex justify-content-center align-items-center fs-2 mb-3"></i>

      <!-- Logo -->
      <h2 class="text-center mb-5">BUCKS BUDDY</h2>

      <!-- User -->
      <span class="d-flex mb-5 fs-6 text-center justify-content-center align-items-center fw-bold"
            id="userName"
              >{{userData.username}}</span>

      <!-- Navigation Links -->
      <ul class="nav flex-column">
        <li class="nav-item mb-3">
          <CustomButton to="/main">
            <template #icon>
              <i class="bi bi-house"></i>
            </template>
            Home
          </CustomButton>
        </li>
        <li class="nav-item mb-3">
          <CustomButton to="/newjourney">
            <template #icon>
              <i class="bi bi-airplane"></i>
            </template>
            New Journey
          </CustomButton>
        </li>
        <li class="nav-item mb-3">
          <CustomButton to="/settings">
            <template #icon>
              <i class="bi bi-gear"></i>
            </template>
            Settings
          </CustomButton>
        </li>
        <li class="nav-item mb-3">
          <CustomButton @click="logout">
            <template #icon>
              <i class="bi bi-box-arrow-right"></i>
            </template>
            Logout
          </CustomButton>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 18%;
  background-color: var(--bs-secondary-bg);
  height: 100vh;
}

.nav-link {
  color: var(--bs-link-color);
  text-decoration: none;
}

.nav-link.active {
  color: var(--bs-primary);
  font-weight: bold;
}
</style>
