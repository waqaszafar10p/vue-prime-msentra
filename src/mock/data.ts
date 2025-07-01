// src/mock/staff.ts
import type { Staff } from '@/types/staff'

import { mockLocations, mockClinicTypes, mockLanguages } from './lookups' // adjust your import paths

export const mockStaff: Staff[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Staff Member ${i + 1}`,
  firstName: `Staff`,
  lastName: `Member ${i + 1}`,
  email: `staff${i + 1}@example.com`,
  phone: '123444444',
  locationIds: [1, 3],
  locations:
    i % 2 === 0
      ? [mockLocations[0], mockLocations[2]] // Lahore, Islamabad
      : [mockLocations[1]], // Karachi
  clinicTypeIds: [2],
  clinicTypes:
    i % 3 === 0
      ? [mockClinicTypes[0], mockClinicTypes[1]] // Cardiology, Pediatrics
      : [mockClinicTypes[2]], // Dermatology
  languageIds: [2, 3],
  languages: i % 4 === 0 ? [mockLanguages[0], mockLanguages[1]] : [mockLanguages[2]],

  userRole: i % 2 === 0 ? 'doctor' : 'nurse',
  status: i % 2 === 0,
  availability: [],
  employmentType: i % 2 === 0 ? 'employed' : 'locum',
  specialism: i % 2 === 0 ? 'ophthalmology' : 'gastroenterology',
}))
