import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { msalInstance } from './msal.service';

export const logout = () => {
  const store = useAuthStore()
  store.logout() // clear Pinia store before redirect
  msalInstance.logoutRedirect();
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const loginWithEmail = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}