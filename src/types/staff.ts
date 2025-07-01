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
  firstName: string
  lastName: string
  email: string
  phone: string
  locationIds: number[] // for v-model
  locations: LookupItem[] // from API
  clinicTypeIds: number[] // for v-model
  clinicTypes: LookupItem[] // from API
  languageIds: number[] // for v-model
  languages: LookupItem[] // from API
  userRole: string
  status: boolean
  availability: AvailabilityRange[]
  employmentType: string
  specialism: string
  miscellaneous:string
}
export interface AvailabilityRange {
  location: string
  clinicType: string
  dateRange: [Date, Date] | null
  startTime: Date | null
  endTime: Date | null
  days: string[]
}

export interface LookupItem {
  id: number
  name: string
}
