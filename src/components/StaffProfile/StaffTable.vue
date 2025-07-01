<template>
  <div>
    <SkillsModal
      v-if="selectedStaff"
      :visible="showSkillsModal"
      :staff="selectedStaff"
      @update:visible="showSkillsModal = $event"
      @close="showSkillsModal = false"
    />
    <AvailabilityModal
      v-if="selectedStaff"
      :visible="showAvailabilityModal"
      :staff="selectedStaff"
      @update:visible="showAvailabilityModal = $event"
      @close="showAvailabilityModal = false"
    />

    <DataTable
      :value="staffList"
      :loading="loading"
      dataKey="id"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      responsiveLayout="scroll"
    >
      <Column field="name" header="Name" />
      <Column field="email" header="Email" />
      <Column header="Location">
        <template #body="{ data }">
          {{ data.locations.map((loc: any) => loc.name).join(', ') }}
        </template>
      </Column>
      <Column header="Clinic Type">
        <template #body="{ data }">
          {{ data.clinicTypes.map((ct: any) => ct.name).join(', ') }}
        </template>
      </Column>
      <!-- <Column header="Languages">
        <template #body="{ data }">
          {{ data.languages.map((ct: any) => ct.name).join(', ') }}
        </template>
      </Column> -->
      <Column header="User Role">
        <template #body="{ data }">
          {{ userRoleMap[data.userRole] || data.userRole }}
        </template>
      </Column>
      <Column field="status" header="Status">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <ToggleSwitch
              :modelValue="data.status === true"
              @update:modelValue="(val: boolean) => onToggleStatus(val, data)"
            />
          </div>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-user-edit" severity="info" @click="editSkills(data)" />
          </div>
        </template>
      </Column>
      <!-- <Column header="Availibility">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-calendar" severity="warning" @click="editAvailability(data)" />
          </div>
        </template>
      </Column> -->
    </DataTable>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff.ts'
import { storeToRefs } from 'pinia'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import SkillsModal from './SkillsModal.vue'
import AvailabilityModal from './AvailabilityModal.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useLookupStore } from '@/stores/lookup.ts'
import { rolesOptions } from '@/constants/options'

import type { Staff } from '@/types/staff'

import ToggleSwitch from 'primevue/toggleswitch'
const store = useStaffStore()
const lookupStore = useLookupStore()

const { staffList, loading } = storeToRefs(store)

const showSkillsModal = ref(false)
const showAvailabilityModal = ref(false)

// const selectedStaff = ref(null)
const selectedStaff = ref<Staff | null>(null)
const toast = useToast()
onMounted(() => {
  store.loadStaffList()
  lookupStore.fetchLookups()
})

const userRoleMap = rolesOptions.reduce<Record<string, string>>((acc, role) => {
  acc[role.value] = role.label
  return acc
}, {})

function editSkills(staff: Staff) {
  selectedStaff.value = staff
  showSkillsModal.value = true
}

function editAvailability(staff: Staff) {
  selectedStaff.value = staff
  showAvailabilityModal.value = true
}
function onToggleStatus(newValue: boolean, staff: Staff) {
  const updatedStatus = newValue ? true : false
  const updated = { ...staff, status: updatedStatus }
  store.updateStaff(updated)
  toast.add({
    severity: 'success',
    summary: 'Staff Updated',
    detail: `${staff.name}'s Status updated`,
    life: 3000,
  })
}
</script>
