<!--NavBar.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logoLight from '@/assets/logo.png';

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
  <nav class="bg-white shadow-md rounded-lg p-4 ms-4">
    <div class="flex justify-between items-center">
      <!-- Logo -->
      <RouterLink to="/main">
        <img
          :src="logoLight"
          alt="Logo"
          class="hidden md:block"
          style="width: auto; height: 70px;">
      </RouterLink>

      <ul class="flex items-center space-x-4">
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