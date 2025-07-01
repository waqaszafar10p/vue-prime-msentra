// src/stores/lookup.ts
import { mockClinicTypes, mockLanguages, mockLocations } from '@/mock/lookups'
import { defineStore } from 'pinia'

interface LookupItem {
  id: number
  name: string
}

export const useLookupStore = defineStore('lookup', {
  state: () => ({
    locations: [] as LookupItem[],
    clinicTypes: [] as LookupItem[],
    languages: [] as LookupItem[],
    loading: false,
  }),

  actions: {
    async fetchLookups() {
      if (this.locations.length && this.clinicTypes.length) return

      this.loading = true
      try {
        // Simulated API response (replace with real API calls)
        const [locationsData, clinicTypesData, mockLanguagesData] = await Promise.all([
          Promise.resolve([...mockLocations]),
          Promise.resolve([...mockClinicTypes]),
          Promise.resolve([...mockLanguages]),
        ])

        this.locations = locationsData
        this.clinicTypes = clinicTypesData
        this.languages = mockLanguagesData
      } catch (error) {
        console.error('Failed to fetch lookup data:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
