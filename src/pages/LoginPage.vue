<template>
  <div v-if="store.isLoading">
    <!-- Optional: PrimeVue Progress Spinner -->
    <p>Checking login status...</p>
  </div>
    <div v-else class="grid h-screen">
      <div class="col-12 p-12 flex flex-column justify-content-center">
        <h2 class="text-center mb-2">Welcome Back</h2>
        <p class="text-center mb-4">Sign in to your account to continue</p>
        <Button label="Sign in with Microsoft" class="w-full mb-3" @click="loginWithMS" severity="info" />
        <div class="text-center text-sm text-gray-500 mt-4">
          <p>By logging in you agree to our terms.</p>
          <p>Need help? Contact support.</p>
          <p>All rights reserved © 2025</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted} from 'vue'
  import { msalInstance } from '../services/msal.service'
  import { useAuthStore } from '../stores/auth.store'
  import { LOGIN_SCOPES } from '../constants/auth'
  import { useRouter } from 'vue-router';
  import Button from 'primevue/button'


  const router = useRouter();

  const store = useAuthStore()

  onMounted(() => {
    // Check if user is already logged in
    store.checkAuth();
    if(store.user)
      router.replace('/dashboard');
  });
  
  
  const loginWithMS = async () => {
    try {
    await msalInstance.loginRedirect({
      scopes: LOGIN_SCOPES,
    });
    //console.log('Login Success:', loginResponse);
  } catch (err) {
    console.error('Login Failed:', err);
  }
    ///const account = await loginWithMicrosoft()
    // Optionally call backend with account info to exchange for app token
  }
  </script>
  