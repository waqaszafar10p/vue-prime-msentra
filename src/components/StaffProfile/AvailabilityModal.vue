<template>
  <Dialog
    header="Edit Staff Availability"
    v-model:visible="internalVisible"
    modal
    class="w-full max-w-[900px]"
    :style="{ maxWidth: '600px' }"
    @hide="closeDialog"
  >
    <div class="p-fluid space-y-6">
      <div
        v-for="(range, index) in availability"
        :key="index"
        class="border rounded-lg bg-gray-50 px-4 py-6 relative"
      >
        <!-- ❌ Remove Button Top Right -->
        <div class="absolute top-2 right-2">
          <Button
            icon="pi pi-times"
            severity="danger"
            text
            rounded
            aria-label="Remove"
            @click="removeRange(index)"
          />
        </div>

        <!-- Row 1: Location + Clinic Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="font-semibold block mb-1">Location</label>
            <Dropdown
              v-model="range.location"
              :options="locationOptions"
              placeholder="Select Location"
              filter
              class="w-full"
            />
          </div>

          <div>
            <label class="font-semibold block mb-1">Clinic Type</label>
            <Dropdown
              v-model="range.clinicType"
              :options="clinicTypeOptions"
              placeholder="Select Clinic Type"
              filter
              class="w-full"
            />
          </div>
        </div>

        <!-- Row 2: Date Range + Days -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="font-semibold block mb-1">Date Range</label>
            <Calendar
              v-model="range.dateRange"
              selectionMode="range"
              showIcon
              dateFormat="yy-mm-dd"
              placeholder="Select Date Range"
              :minDate="new Date()"
              class="w-full"
            />
          </div>

          <div>
            <label class="font-semibold block mb-1">Days</label>
            <MultiSelect
              v-model="range.days"
              :options="daysOptions"
              placeholder="Select Days"
              display="chip"
              class="w-full"
            />
          </div>
        </div>

        <!-- Row 3: Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="font-semibold block mb-1">Start Time</label>
            <Calendar
              v-model="range.startTime"
              timeOnly
              hourFormat="24"
              showIcon
              placeholder="Start Time"
              class="w-full"
            />
          </div>

          <div>
            <label class="font-semibold block mb-1">End Time</label>
            <Calendar
              v-model="range.endTime"
              timeOnly
              hourFormat="24"
              showIcon
              placeholder="End Time"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="text-center mt-2">
        <Button icon="pi pi-plus" label="Add Availability" @click="addRange" outlined />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
      <Button label="Save" icon="pi pi-check" @click="saveAvailability" />
    </template>
  </Dialog>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Staff, AvailabilityRange } from '@/types/staff'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import { useToast } from 'primevue/usetoast'
import { useStaffStore } from '@/stores/staff'

const props = defineProps<{
  visible: boolean
  staff: Staff
}>()

const emit = defineEmits(['update:visible', 'close'])
const validationErrors = ref<string[]>([])

const internalVisible = ref(props.visible)
watch(
  () => props.visible,
  (val) => (internalVisible.value = val),
)

function closeDialog() {
  emit('update:visible', false)
  emit('close')
}

const toast = useToast()
const store = useStaffStore()

const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const locationOptions = ref<string[]>([])
const clinicTypeOptions = ref<string[]>([])

const availability = ref<AvailabilityRange[]>([])

watch(
  () => props.staff,
  (val) => {
    if (val) {
      availability.value = val.availability.map((a) => ({ ...a }))
      locationOptions.value = val.location
      clinicTypeOptions.value = val.clinicType
    }
  },
  { immediate: true },
)

function addRange() {
  availability.value.push({
    location: locationOptions.value[0] || '',
    clinicType: clinicTypeOptions.value[0] || '',
    dateRange: null,
    startTime: null,
    endTime: null,
    days: [],
  })
}

function removeRange(index: number) {
  availability.value.splice(index, 1)
}

function saveAvailability() {
  validationErrors.value = []

  for (const [i, range] of availability.value.entries()) {
    if (
      !range.location ||
      !range.clinicType ||
      !range.dateRange ||
      !range.startTime ||
      !range.endTime ||
      range.days.length === 0
    ) {
      validationErrors.value.push(`Range ${i + 1} has incomplete fields.`)
    }

    if (range.startTime && range.endTime && range.startTime >= range.endTime) {
      validationErrors.value.push(`Range ${i + 1}: Start time must be before end time.`)
    }
  }

  if (validationErrors.value.length) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: validationErrors.value.join(' '),
      life: 4000,
    })
    return
  }

  const updated = { ...props.staff, availability: availability.value }
  store.updateStaff(updated)

  toast.add({
    severity: 'success',
    summary: 'Availability Updated',
    detail: `${props.staff.name}'s availability updated.`,
    life: 3000,
  })

  closeDialog()
}
</script>
