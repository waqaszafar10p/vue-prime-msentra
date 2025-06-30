<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth.store'
import { msalInstance } from './services/msal.service'

const authStore = useAuthStore()

const msalReady = ref(false)

// Ensure MSAL is initialized before app fully renders
onMounted(async () => {
  const accounts = msalInstance.getAllAccounts()
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0])
  }
  await authStore.checkAuth()
  msalReady.value = true
})

</script>

<template>
  <Suspense>
    <template #default>
      <RouterView v-if="msalReady" />
    </template>
    <template #fallback>
      <div class="loading-screen">Loading...</div>
    </template>
  </Suspense>
</template>

<style scoped>
.loading-screen {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #555;
}
</style>
