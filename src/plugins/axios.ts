// src/plugins/axios.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(async (config) => {
  const auth = useAuthStore()

  try {
    const token = await auth.acquireToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (err) {
    console.warn('Token acquisition failed', err)
  }

  return config
})

export default api
