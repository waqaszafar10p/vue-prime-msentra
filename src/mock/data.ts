// src/mock/staff.ts
import type { Staff } from '@/types/staff'

export const mockStaff: Staff[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `Staff Member ${i + 1}`,
  email: `staff${i + 1}@example.com`,
  location: i % 2 === 0 ? [1, 3] : [2], // Lahore + Islamabad or Karachi
  clinicType: i % 3 === 0 ? [1, 2] : [3], // Cardiology + Pediatrics or Dermatology
  userRole: i % 2 === 0 ? 'doctor' : 'nurse',
  status: i % 2 === 0, // true = Active, false = Inactive
  availability: [],
  employmentType: i % 2 === 0 ? 'employed' : 'locum',

}))
