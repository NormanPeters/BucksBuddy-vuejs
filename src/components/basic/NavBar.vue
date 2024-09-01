<!--NavBar.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useThemeStore } from '@/stores/themeStore';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo_invert.png';

const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.applyTheme(themeStore.theme === 'light' ? 'dark' : 'light');
};

const logoSrc = computed(() => {
  return themeStore.theme === 'light' ? logoLight : logoDark;
});

const router = useRouter();
const logout = () => {
  localStorage.removeItem('UUID');
  localStorage.removeItem('selectedJourney');
  router.push('/login');
};

const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
    <div class="flex justify-between items-center">
      <!-- Logo -->
      <RouterLink to="/main">
        <img
          :src="logoSrc"
          alt="Logo"
          class="hidden md:block"
          style="width: auto; height: 70px;">
      </RouterLink>

      <ul class="flex items-center space-x-4">
        <!-- Theme toggle -->
        <li class="flex items-center">
          <i
            :class="[themeStore.theme === 'light' ? 'bi bi-sun text-2xl text-gray-900' : 'bi bi-moon-stars text-2xl text-gray-300']"></i>
          <i
            :class="[themeStore.theme === 'light' ? 'bi bi-toggle-off text-2xl mx-2 text-gray-900' : 'bi bi-toggle-on text-2xl mx-2 text-gray-300']"
            @click="toggleTheme"></i>
        </li>

        <!-- Dropdown Menu -->
        <li class="relative">
          <button
            class="bi bi-list text-2xl text-gray-700 dark:text-gray-300"
            @click="toggleDropdown"
            aria-expanded="false">
          </button>
          <ul class="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2" v-if="isDropdownOpen">
            <li>
              <RouterLink
                to="/main"
                class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <i class="bi bi-card-list"></i>
                <span class="ml-2 text-gray-700 dark:text-gray-200">Main</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/settings"
                class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <i class="bi bi-gear"></i>
                <span class="ml-2 text-gray-700 dark:text-gray-200">Settings</span>
              </RouterLink>
            </li>
            <li>
              <a
                @click="logout"
                class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                <i class="bi bi-box-arrow-right"></i>
                <span class="ml-2 text-gray-700 dark:text-gray-200">Logout</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>