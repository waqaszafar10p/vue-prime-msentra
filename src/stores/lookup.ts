// src/stores/lookup.ts
import { defineStore } from 'pinia'

interface LookupItem {
  id: number
  name: string
}

export const useLookupStore = defineStore('lookup', {
  state: () => ({
    locations: [] as LookupItem[],
    clinicTypes: [] as LookupItem[],
    loading: false,
  }),

  actions: {
    async fetchLookups() {
      if (this.locations.length && this.clinicTypes.length) return

      this.loading = true
      try {
        // Simulated API response (replace with real API calls)
        const [locationsData, clinicTypesData] = await Promise.all([
          Promise.resolve([
            { id: 1, name: 'Lahore' },
            { id: 2, name: 'Karachi' },
            { id: 3, name: 'Islamabad' },
          ]),
          Promise.resolve([
            { id: 1, name: 'General' },
            { id: 2, name: 'Dental' },
            { id: 3, name: 'Cardiology' },
          ]),
        ])

        this.locations = locationsData
        this.clinicTypes = clinicTypesData
      } catch (error) {
        console.error('Failed to fetch lookup data:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
