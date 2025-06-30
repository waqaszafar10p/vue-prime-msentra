import type { Staff } from '@/types/staff'
import { mockStaff } from '@/mock/data'
import api from '@/plugins/axios'

export const staffService = {
  async getAllStaff(): Promise<Staff[]> {
    try {
      const response = await api.get<Staff[]>('/staff')
      return response.data
    } catch {
      // API failed, fallback to mock
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockStaff]), 500)
      })
    }
  },
}
