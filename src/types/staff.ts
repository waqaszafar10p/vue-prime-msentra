export type Status = 'Active' | 'Inactive' | 'On Leave'

export interface Availability {
  location: string
  clinicType: string
  dateRange: [Date, Date]
  startTime: string
  endTime: string
  days: string[] // ['M', 'T', 'W', ...]
}

export interface Staff {
  id: number
  name: string
  email: string
  clinicType: number[] // or number for single select
  location: number[] // or number
  userRole: string
  status: boolean
  availability: AvailabilityRange[]
  employmentType: string // e.g. 'full_time', 'part_time', etc.
}
export interface AvailabilityRange {
  location: string
  clinicType: string
  dateRange: [Date, Date] | null
  startTime: Date | null
  endTime: Date | null
  days: string[]
}
