import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import { msalInstance } from './services/msal.service'
import { useAuthStore } from './stores/auth.store'
import { LOGIN_SCOPES } from './constants/auth'

async function bootstrap() {
  await msalInstance.initialize() // Ensure MSAL is ready

  const app = createApp(App)

  // ✅ Create and register Pinia before using any stores
  const pinia = createPinia()
  app.use(pinia)
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  app.use(ToastService) // ✅ inject Toast service

  // ✅ Now it's safe to call useAuthStore
  const store = useAuthStore()

  try {
    const response = await msalInstance.handleRedirectPromise()

    if (response) {
      console.log('Login successful:', response.account)
      msalInstance.setActiveAccount(response.account)
      store.setAuth(response.account, response.idToken)
      const redirectPath = localStorage.getItem('redirectPath') || '/dashboard'
      localStorage.removeItem('redirectPath')
      window.location.replace(redirectPath)
      return
    } else {
      const account = msalInstance.getAllAccounts()[0]
      if (account) {
        msalInstance.setActiveAccount(account)
        store.setAuth(account, '') // Optional: pass access token
      } else {
        // 👇 Save where user was going
        const currentPath = window.location.pathname + window.location.search
        localStorage.setItem('redirectPath', currentPath)
        // 🚨 Not logged in, redirect to login
        console.log('🔄 Redirecting to login...')
        msalInstance.loginRedirect({
          scopes: LOGIN_SCOPES,
        })
        return
      }
    }
  } catch (error) {
    console.error('MSAL redirect error:', error)
  }

  app.mount('#app')
}

bootstrap()
