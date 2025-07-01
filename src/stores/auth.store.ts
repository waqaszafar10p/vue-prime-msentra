import { defineStore } from 'pinia'
import { msalInstance } from '../services/msal.service'
import type { AccountInfo } from '@azure/msal-browser'
import { LOGIN_SCOPES } from '../constants/auth'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AccountInfo | null,
    isLoading: true,
  }),
  actions: {
    setAuth(user: AccountInfo, token: string) {
      this.user = user
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      localStorage.removeItem('redirectPath')
      localStorage.removeItem('token')
    },
    checkAuth() {
      const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0]
      if (account) {
        msalInstance.setActiveAccount(account)
        this.user = account
    
      } else {
        this.user = null

      }
      this.isLoading = false
    },
    async acquireToken(): Promise<string> {
      if (!this.user) throw new Error('No active account')
      const request = {
        scopes: LOGIN_SCOPES,
        account: this.user as AccountInfo,
      }
      try {
        const response = await msalInstance.acquireTokenSilent(request)
        return response.accessToken
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          await msalInstance.acquireTokenRedirect({ scopes: LOGIN_SCOPES })
          // Technically unreachable, but needed to satisfy TS
          return Promise.reject('Redirecting for interaction')
        } else {
          console.error('Token acquisition failed:', error)
          throw error
        }
      }
    },
  },
})
