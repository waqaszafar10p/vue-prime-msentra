import type { SchedulingList } from '@/types/schedules'
import { mockSchedulingList } from '@/mock/schedulesData'
import api from '@/plugins/axios'

export const scheduleListService = {
  async getAllSchedules(): Promise<SchedulingList[]> {
    try {
      const response = await api.get<SchedulingList[]>('/scheduling-list')
      return response.data
    } catch {
      // API failed, fallback to mock
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockSchedulingList]), 500)
      })
    }
  },
}
