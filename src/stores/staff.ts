import { defineStore } from 'pinia'
import type { Staff } from '@/types/staff'
import { staffService } from '@/services/staffService'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staffList: [] as Staff[],
    selectedStaff: null as Staff | null,
    loading: false
  }),
  actions: {
    async loadStaffList() {
      this.loading = true
      try {
        const result = await staffService.getAllStaff()
        this.staffList = result
      } catch (e) {
        console.error('Failed to load staff:', e)
      } finally {
        this.loading = false
      }
    },
    selectStaff(staff: Staff) {
      this.selectedStaff = JSON.parse(JSON.stringify(staff))
    },
    updateStaff(updated: Staff) {
      const index = this.staffList.findIndex(s => s.id === updated.id)
      if (index !== -1) {
        this.staffList[index] = { ...updated }
      }
    }
  }
})
