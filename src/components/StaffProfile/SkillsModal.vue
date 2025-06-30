<template>
  <Dialog
    header="Edit Staff Skills"
    v-model:visible="internalVisible"
    modal
    class="w-full max-w-[900px]"
    :style="{ maxWidth: '600px' }"
    @hide="closeDialog"
  >
    <div class="formgrid grid">
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="name">Name</label>
          <InputText v-model="localStaff.name" id="name" disabled />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="email">Email</label>
          <InputText v-model="localStaff.email" id="email" disabled />
        </div>
      </div>
    </div>
    <div class="p-fluid">
      <div class="field">
        <label for="userRole">User Role</label>
        <Dropdown
          v-model="localStaff.userRole"
          :options="rolesOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select User Type"
        />
      </div>

      <div class="field">
        <label for="location">Location</label>
        <MultiSelect
          v-model="localStaff.location"
          :options="locationOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Location"
          display="chip"
          filter
        />
      </div>

      <div class="field">
        <label for="clinicType">Clinic Type</label>
        <MultiSelect
          v-model="localStaff.clinicType"
          :options="clinicTypeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Clinic Type"
          display="chip"
          filter
        />
      </div>
      <div>
        <label for="employmentType">Employment Type</label>
        <Dropdown
          v-model="localStaff.employmentType"
          :options="employmentTypeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Employment Type"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
      <Button label="Save" icon="pi pi-check" @click="saveSkills" />
    </template>
  </Dialog>
  <Toast />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useStaffStore } from '@/stores/staff'
import type { Staff } from '@/types/staff'
import Toast from 'primevue/toast'
import { computed, onMounted } from 'vue'
import { useLookupStore } from '@/stores/lookup'
import { employmentTypeOptions, rolesOptions } from '@/constants/options'

const lookupStore = useLookupStore()

onMounted(() => {
  lookupStore.fetchLookups()
})

const locationOptions = computed(() =>
  lookupStore.locations.map((loc) => ({ label: loc.name, value: loc.id })),
)

const clinicTypeOptions = computed(() =>
  lookupStore.clinicTypes.map((ct) => ({ label: ct.name, value: ct.id })),
)

const props = defineProps<{
  visible: boolean
  staff: Staff
}>()

const emit = defineEmits(['update:visible', 'close'])

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

const localStaff = ref<Staff>({ ...props.staff })
watch(
  () => props.staff,
  (val) => {
    localStaff.value = { ...val }
  },
)

function saveSkills() {
  store.updateStaff(localStaff.value)

  toast.add({
    severity: 'success',
    summary: 'Staff Updated',
    detail: `${localStaff.value.name}'s skills updated`,
    life: 3000,
  })

  closeDialog()
}
</script>
