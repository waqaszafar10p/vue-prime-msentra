<template>
  <div class="calendar-page">
    <!-- Filters & View Controls -->
    <div class="calendar-controls">    
      <div class="nav-buttons clinic-schedule-nav-buttons">
        <Button @click="goToToday" label="Today" class="schedule-button today-button">
          <template #icon>
            <TodayIcon class="button-icon" />
          </template>
        </Button>

        <Button @click="prev" class="schedule-button prev-button" v-if="!showListView">
          <template #icon>
            <PrevIcon class="button-icon" />
          </template>
        </Button>

        <Button @click="next" class="schedule-button next-button" v-if="!showListView">
          <template #icon>
            <NextIcon class="button-icon" />
          </template>
        </Button>

        <Button @click="toggleDatePicker" class="schedule-button go-to-date-button" title="Go to Date">
          {{ formattedSelectedDate }}
          <ArrowDownCalendarViewIcon class="ml-2" style="width: 0.8rem; height: 0.8rem;" />
        </Button>
        <!-- Small Calendar Popup -->
        <OverlayPanel ref="datePickerRef">
          <Calendar v-model="datePickerModel" @date-select="onDateSelect" :inline="true" :selectionMode="showListView ? 'range' : 'single'" />
        </OverlayPanel>
      </div>
      
      <div class="view-toggle-buttons">
        <Dropdown
          v-model="selectedLocation"
          :options="locations"
          placeholder="Location"
          class="schedule-dropdowns w-full md:w-10rem"
          @change="applyFilters"
        />
        <Dropdown
          v-model="selectedClinic"
          :options="clinics"
          placeholder="Clinic"
          class="schedule-dropdowns w-full md:w-10rem"
          @change="applyFilters"
        />
        <Dropdown
          v-model="selectedDoctor"
          :options="doctors"
          placeholder="Doctor"
          class="schedule-dropdowns w-full md:w-10rem"
          @change="applyFilters"
        />
        
        <Dropdown
          v-if="!showListView"
          v-model="selectedView"
          :options="viewOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select View"
          class="schedule-dropdowns w-full md:w-10rem"
        />
        
        <Button :class="['schedule-button', 'schedule-toggle-button', 'toggle-button-calendar', { active: !showListView }]"
          @click="switchToCalendar"
          title="Calendar View"
        >
          <template #icon>
            <CalendarViewIcon class="button-icon" />
          </template>
        </Button>
        <Button :class="['schedule-button', 'schedule-toggle-button', 'toggle-button-list', { active: showListView }]"
          @click="showListView = true"
          title="List View"
        >
          <template #icon>
            <ListViewIcon class="button-icon" />
          </template>
        </Button>
      </div>
    </div>

    <!-- Event List View -->
    <!--<div v-if="showListView" class="event-list">
      <p v-if="hasFilters" class="filter-info">
        <strong>Filters applied:</strong>
        <span v-if="selectedLocation">Location: {{ selectedLocation }}</span>
        <span v-if="selectedClinic">Clinic: {{ selectedClinic }}</span>
        <span v-if="selectedDoctor">Doctor: {{ selectedDoctor }}</span>
      </p>

      <ul>
        <template v-if="filteredEvents.length">
          <li v-for="event in filteredEvents" :key="event.id || event.title" class="event-item">
            <strong>{{ event.title }}</strong> —
            {{ formatDate(event.start) }} to {{ formatDate(event.end) }} <br />
            <small>{{ event.location }} | {{ event.clinic }} | {{ event.doctor }}</small>
          </li>
        </template>
        <li v-else class="empty">No events found</li>
      </ul>
    </div>-->
    <div v-if="showListView" class="event-list">
      <div
        v-for="(eventsOnDate, dateStr) in groupedEvents"
        :key="dateStr"
        class="event-date-group"
      >
        <div class="date-label">{{ formatDateLabel(dateStr) }}</div>
        <div class="event-boxes">
          <div
            v-for="(event, idx) in eventsOnDate"
            :key="event.id"
            :class="['event-box', event.class]"
          >
            <div class="event-time">{{ formatTimeRange(event.start, event.end) }}</div>
            <div class="event-info">
              <div>{{ event.doctor }}</div>
              <div>{{ event.clinic }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Cal Calendar -->
    <vue-cal
      v-else
      ref="calendar"  
      :view="selectedView"        
      :selected-date="selectedDate"
      :events="filteredEvents"
      @event-click="handleEventClick"
      style="height: 600px;"
      :time="true"
      :time-step="15"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { useScheduleStore } from '../../stores/scheduleslist'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import OverlayPanel from 'primevue/overlaypanel'
import TodayIcon from '../../components/icons/today.vue'
import PrevIcon from '../../components/icons/arrowBack.vue'
import NextIcon from '../../components/icons/arrowForward.vue'
import ListViewIcon from '../../components/icons/ListView.vue'
import CalendarViewIcon from '../../components/icons/CalendarView.vue'
import ArrowDownCalendarViewIcon from '../../components/icons/arrowDownCalendar.vue'

const calendar = ref(null)
const showListView = ref(false)
const selectedView = ref('day')
const selectedDate = ref(new Date())
const selectedLocation = ref('')
const selectedClinic = ref('')
const selectedDoctor = ref('')
const showTodayOnly = ref(false)
const datePickerRef = ref()
const goToDate = ref(null)
const selectedDateRange = ref(null)

const datePickerModel = computed({
  get() {
    return showListView.value ? selectedDateRange.value : goToDate.value
  },
  set(val) {
    if (showListView.value) {
      selectedDateRange.value = val
    } else {
      goToDate.value = val
    }
  }
})

function toggleDatePicker(event) {
  datePickerRef.value.toggle(event)
}

function onDateSelect() {
  datePickerRef.value.hide()
  if (!showListView.value) {
    selectedDate.value = goToDate.value
    nextTick(() => {
      calendar.value?.switchView(selectedView.value)
      calendar.value?.goToDate?.(goToDate.value)
    })
  }
}

const today = new Date().toISOString().slice(0, 10)
const formattedSelectedDate = computed(() => {
  const options = { year: 'numeric', month: 'long' }
  const formatted = selectedDate.value.toLocaleDateString(undefined, options)
  return formatted.replace(' ', ', ')
})

const groupedEvents = computed(() => {
  const map = {}
  for (const ev of filteredEvents.value) {
    const dateKey = ev.start.slice(0, 10)
    if (!map[dateKey]) map[dateKey] = []
    map[dateKey].push(ev)
  }
  return map
})

function formatDateLabel(dateStr) {
  const date = new Date(dateStr)

  const day = date.getDate().toString().padStart(2, '0') // 19
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase() // APR
  const weekday = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase() // FRI

  return `${day} ${month}, ${weekday}`
}

function formatTimeRange(start, end) {
  const options = { hour: '2-digit', minute: '2-digit', hour12: false }
  const startTime = new Date(start).toLocaleTimeString([], options)
  const endTime = new Date(end).toLocaleTimeString([], options)
  return `${startTime} to ${endTime}`
}

const scheduleStore = useScheduleStore();

onMounted(async () => {
  await scheduleStore.loadScheduleList()
})
const viewOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
]

const locations = computed(() => {
  const all = events.value.map(e => e.location)
  const unique = [...new Set(all)].sort()
  return ['Locations', ...unique]
})

const clinics = computed(() => {
  const all = events.value.map(e => e.clinic)
  const unique = [...new Set(all)].sort()
  return ['Clinics', ...unique]
})

const doctors = computed(() => {
  const all = events.value.map(e => e.doctor)
  const unique = [...new Set(all)].sort()
  return ['Doctors', ...unique]
})

const events = computed(() => scheduleStore.scheduleList)

const filteredEvents = computed(() =>
  events.value.filter(ev => {
    const matchesLocation =
      !selectedLocation.value ||
      selectedLocation.value === 'Locations' ||
      ev.location === selectedLocation.value

    const matchesClinic =
      !selectedClinic.value ||
      selectedClinic.value === 'Clinics' ||
      ev.clinic === selectedClinic.value

    const matchesDoctor =
      !selectedDoctor.value ||
      selectedDoctor.value === 'Doctors' ||
      ev.doctor === selectedDoctor.value

    const matchesFilters = matchesLocation && matchesClinic && matchesDoctor

    const matchesToday =
      showTodayOnly.value && ev.start.startsWith(today)

    const matchesRange =
      showListView.value && selectedDateRange.value?.length === 2
        ? new Date(ev.start) >= selectedDateRange.value[0] &&
          new Date(ev.start) <= selectedDateRange.value[1]
        : true

    return matchesFilters && (!showTodayOnly.value || matchesToday) && matchesRange
  })
)


const hasFilters = computed(() => 
  Boolean(selectedLocation.value || selectedClinic.value || selectedDoctor.value)
)

const calendarActions = {
  prev: () => calendar.value?.previous(),
  next: () => calendar.value?.next(),
  goToToday: () => {
  selectedDate.value = new Date()
  if (showListView.value) {
    showTodayOnly.value = true
  } else {
    if (calendar.value && typeof calendar.value.goToToday === 'function') {
      calendar.value.goToToday()
    } else {
      console.warn('Calendar is not ready yet')
    }
    showTodayOnly.value = false
  }
}
}

function switchToCalendar() {
  showListView.value = false
  showTodayOnly.value = false
  selectedView.value = 'month'
}

function handleEventClick(event) {
  alert(`Event clicked: ${event.title}`)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function applyFilters() {}

watch(selectedView, () => {
  calendar.value?.switchView(selectedView.value)
})

onMounted(() => {
  calendar.value?.switchView(selectedView.value)
})

const { prev, next, goToToday } = calendarActions
</script>


<style>
/* Base layout */
.calendar-page {
  padding: 1rem;
  background: #fff;
}

.calendar-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: space-between;
}

/* Button styles */
.button-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.schedule-button {
  background: #fff;
  color: #000;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  cursor: pointer;
}

.schedule-button.prev-button,
.schedule-button.next-button {
  border: none;
}

.schedule-toggle-button {
  background: #D9D9D9;
}

.schedule-toggle-button.active {
  background: rgba(172, 207, 255, 0.5);
  border: 1px solid #A8B7C7;
}

.toggle-button-calendar {
  border-radius: 20px 0 0 20px;
  padding-left: 7px;
}

.toggle-button-list {
  border-radius: 0 20px 20px 0;
}

/* Dropdown styles */
.schedule-dropdowns {
  width: 10rem;
  margin: 0 10px;
}

.schedule-dropdowns .p-inputtext {
  padding: 0.3rem 0.75rem;
}

.schedule-dropdowns .p-dropdown-label.p-inputtext {
  color: #64748b;
}

.p-dropdown-panel .p-dropdown-items .p-dropdown-item,
.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
  color: #64748b;
}

.go-to-date-button {
  margin-left: 0.5rem;
  border: none;
}
.p-overlaypanel .p-overlaypanel-content {
    padding: 0;
}
/* Event list styles */
.event-list {
  margin-top: 1rem;
}

.filter-info {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}

.filter-info span {
  margin-right: 1rem;
}

.event-item {
  padding: 0.75rem;
  background: #f0f0f0;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.empty {
  padding: 1rem;
  font-style: italic;
  color: #999;
}

/* Vue Calendar customizations */
.vuecal__title-bar {
  background: none;
}
.vuecal__event {
    border-radius: 6px;
    border-left: 3px solid #331B8E;
    box-shadow: none;
}
.vuecal__arrow--prev,
.vuecal__arrow--next {
  display: none;
}

.vuecal--week-view {
  border-radius: 6px;
}

/* Event colors */
.vuecal__event.event-red, .event-box.event-red {
  background-color: #33B679;
  color: #fff;
}

.vuecal__event.event-green, .event-box.event-green {
  background-color: #C2E9D7;
  color: #000;
}
.vuecal__event.event-orange, .event-box.event-orange {
  background-color: #E67C73;
  color: #fff;
}
.vuecal__event.event-blue, .event-box.event-blue {
  background-color: #331B8E;
  color: #fff;
}
.event-date-group {
  background: #accfff1a;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  display: flex;
  padding: 1rem;
  align-items: flex-start;
}

.date-label {
  min-width: 100px;
  font-weight: 400;
  color: #000;
  font-size: 18px;
  margin-right: 1rem;
}

.event-boxes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-box {
  display: flex;
  padding: 0.75rem;
  border-radius: 12px;
}

.event-box.odd-bg {
  background-color: #f0f0f0;
}

.event-box.even-bg {
  background-color: #ffffff;
}

.event-time {
  font-weight: 600;
  width: 150px;
}

.event-info {
    text-align: left;
    margin-left: 100px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calendar-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-toggle-buttons {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .schedule-dropdowns {
    width: 100%;
    margin: 0.25rem 0;
  }
}
</style>