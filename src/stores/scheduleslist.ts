import { defineStore } from 'pinia'
import type { SchedulingList } from '@/types/schedules'
import { scheduleListService } from '@/services/scheduleListService'

export const useScheduleStore = defineStore('schedules', {
  state: () => ({
    scheduleList: [] as SchedulingList[],
    selectedSchedule: null as SchedulingList | null,
    loading: false
  }),
  actions: {
    async loadScheduleList() {
      this.loading = true
      try {
        const result = await scheduleListService.getAllSchedules()
        this.scheduleList = result
      } catch (e) {
        console.error('Failed to load schedule list:', e)
      } finally {
        this.loading = false
      }
    },
    selectStaff(staff: SchedulingList) {
      this.selectedSchedule = JSON.parse(JSON.stringify(staff))
    },
    updateStaff(updated: SchedulingList) {
      const index = this.scheduleList.findIndex(s => s.id === updated.id)
      if (index !== -1) {
        this.scheduleList[index] = { ...updated }
      }
    }
  }
})
