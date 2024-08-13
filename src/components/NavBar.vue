<!--NavBar.vue -->
<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import logoLight from '@/assets/logo.png'
import logoDark from '@/assets/logo_invert.png'

const themeStore = useThemeStore()

const toggleTheme = () => {
  themeStore.applyTheme(themeStore.theme === 'light' ? 'dark' : 'light')
}

const logoSrc = computed(() => {
  return themeStore.theme === 'light' ? logoLight : logoDark
})

const router = useRouter()
const logout = () => {
  localStorage.removeItem('UUID')
  localStorage.removeItem('selectedJourney')
  router.push('/login')
}
</script>

<template>
  <nav class="navbar shadow rounded-3 m-3 navbar-expand">
    <div class="container row-cols-2">
      <!-- Logo -->
      <div class="col-2 d-flex align-items-center">
        <RouterLink to="/main">
          <img
            :src="logoSrc"
            alt="Logo"
            class="d-none d-md-inline"
            style="width: auto; height: 70px;">
        </RouterLink>
      </div>
      <div class="col-10 d-flex justify-content-end">
        <ul class="navbar-nav ms-auto">
          <!-- Theme toggle -->
          <li class="nav-item d-flex align-items-center">
            <i
              :class="[themeStore.theme === 'light' ? 'bi bi-sun fs-3 text-dark' : 'bi bi-moon-stars fs-3 text-white']"></i>
            <i
              :class="[themeStore.theme === 'light' ? 'bi bi-toggle-off fs-3 mx-2 text-dark' : 'bi bi-toggle-on fs-3 mx-2 text-white']"
              @click="toggleTheme"></i>
          </li>

          <!-- Dropdown Menu -->
          <li class="nav-item dropdown">
            <div class="dropstart">
            <button
              class="btn bi bi-list m-2 fs-3"
              data-bs-toggle="dropdown"
              aria-expanded="false">
            </button>
            <ul class="dropdown-menu">
              <li class="dropdown-item">
                <RouterLink
                  to="/main"
                  :class="[
          'bi bi-card-list fs-6 icon-link-hover text-decoration-none',
          themeStore.theme === 'light' ? 'text-dark' : 'text-white'
        ]">
                  Main
                </RouterLink>
              </li>
              <li class="dropdown-item">
                <RouterLink
                  to="/user"
                  :class="[
          'bi bi-gear fs-6 icon-link-hover text-decoration-none',
          themeStore.theme === 'light' ? 'text-dark' : 'text-white'
        ]"
                >
                  Settings
                </RouterLink>
              </li>
              <li class="dropdown-item">
                <a
                  @click="logout"
                  :class="[
          'bi bi-box-arrow-right fs-6 icon-link-hover text-decoration-none',
          themeStore.theme === 'light' ? 'text-dark' : 'text-white'
        ]"

                  style="cursor: pointer;">
                  Logout
                </a>
              </li>
            </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
