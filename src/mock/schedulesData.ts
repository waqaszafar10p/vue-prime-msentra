import type { SchedulingList } from '@/types/schedules'

export const mockSchedulingList : SchedulingList[] = Array.from({ length: 30 }, (_, i) => {
  const weekNumber = Math.floor(i / 7);         // 4 full weeks
  const dayInWeek = i % 7;                      // 0 to 6 (days in week)
  const baseDate = new Date();                  // 🔄 Dynamic start from today

  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + weekNumber * 7 + dayInWeek);

  const startHour = 9 + (i % 4) * 2;            // 9:00, 11:00, 13:00, 15:00
  const endHour = startHour + 1;

  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const start = `${dateStr} ${pad(startHour)}:00`;
  const end = `${dateStr} ${pad(endHour)}:00`;
  const locations = ['Main Branch', 'East Wing', 'Downtown Clinic', 'North Center']
  const clinics = ['Cardiology', 'Orthopedics', 'Dermatology', 'Neurology']
  const doctors = ['Dr. Smith', 'Dr. Khan', 'Dr. Patel', 'Dr. Lee']
  const classes = ['event-red', 'event-green', 'event-blue', 'event-orange']


  return {
    id: i + 1,
    title: `Appointment ${i + 1}`,
    start,
    end,
    location: locations[i % locations.length],
    clinic: clinics[i % clinics.length],
    doctor: doctors[i % doctors.length],
    class: classes[i % classes.length]
  };
});


