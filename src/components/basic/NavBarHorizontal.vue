<!-- NavBarHorizontal.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import CustomButton from '@/components/atoms/NavBarLinkHorizontal.vue'

const router = useRouter()
const logout = () => {
  localStorage.removeItem('UUID')
  localStorage.removeItem('selectedJourney')
  router.push('/login')
}
</script>

<template>
  <div class="navbar-container">
    <nav
      class="navbar-horizontal d-flex justify-content-between align-items-center position-absolute-top p-1 bg-body"
    >
      <CustomButton to="/main">
        <template #icon>
          <i class="bi bi-house"></i>
        </template>
      </CustomButton>
      <CustomButton to="/newjourney">
        <template #icon>
          <i class="bi bi-airplane"></i>
        </template>
      </CustomButton>
      <CustomButton to="/settings">
        <template #icon>
          <i class="bi bi-gear"></i>
        </template>
      </CustomButton>
      <CustomButton @click="logout" to="/login">
        <template #icon>
          <i class="bi bi-box-arrow-right"></i>
        </template>
      </CustomButton>
    </nav>
  </div>
</template>

<style scoped>
.navbar-horizontal {
  flex: 1;
  text-align: center;
}

.navbar-container {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
