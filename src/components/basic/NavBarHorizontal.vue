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
  <nav class="navbar-horizontal d-flex justify-content-between align-items-center p-1 bg-body">
      <div class="col-3 p-1">
        <CustomButton to="/main">
          <template #icon>
            <i class="bi bi-house"></i>
          </template>
        </CustomButton>
      </div>
      <div class="col-3 p-1">
        <CustomButton to="/newjourney">
          <template #icon>
            <i class="bi bi-airplane"></i>
          </template>
        </CustomButton>
      </div>
      <div class="col-3 p-1">
        <CustomButton to="/settings">
          <template #icon>
            <i class="bi bi-gear"></i>
          </template>
        </CustomButton>
      </div>
      <div class="col-3 p-1">
        <CustomButton @click="logout" to="/login">
          <template #icon>
            <i class="bi bi-box-arrow-right"></i>
          </template>
        </CustomButton>
      </div>
  </nav>
</template>


