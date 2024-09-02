<!--NavBar.vue -->
<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import logoLight from '@/assets/logo.png'
import logoDark from '@/assets/logo_invert.png'

const isActive = (path) => router.currentRoute.value.path === path ? 'active' : '';

// const themeStore = useThemeStore()
// const toggleTheme = () => {
//   themeStore.applyTheme(themeStore.theme === 'light' ? 'dark' : 'light')
// }
//
// const logoSrc = computed(() => {
//   return themeStore.theme === 'light' ? logoLight : logoDark
// })

const router = useRouter()
const logout = () => {
  localStorage.removeItem('UUID')
  localStorage.removeItem('selectedJourney')
  router.push('/login')
}
</script>

<template>
  <nav class="navbar d-flex flex-column justify-content-between p-3">
    <div>
      <!-- Logo -->
      <h1 class="text-center mb-4">BUCKS BUDDY</h1>
      <!-- Navigation Links -->
      <ul class="nav flex-column">
        <li class="nav-item mb-3">
          <RouterLink
            to="/main"
            class="nav-link"
            :class="['bi bi-house fs-5', isActive('/main')]">
            <span class="ms-2">Home</span>
          </RouterLink>
        </li>
        <li class="nav-item mb-3">
          <RouterLink
            to="/new-journey"
            class="nav-link"
            :class="['bi bi-airplane fs-5', isActive('/new-journey')]">
            <span class="ms-2">New Journey</span>
          </RouterLink>
        </li>
        <li class="nav-item mb-3">
          <RouterLink
            to="/settings"
            class="nav-link"
            :class="['bi bi-gear fs-5', isActive('/settings')]">
            <span class="ms-2">Settings</span>
          </RouterLink>
        </li>
      </ul>
    </div>
    <div>
      <li class="nav-item">
        <a
          @click="logout"
          class="nav-link bi bi-box-arrow-right fs-5"
          style="cursor: pointer">
          <span class="ms-2">Logout</span>
        </a>
      </li>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 250px;
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