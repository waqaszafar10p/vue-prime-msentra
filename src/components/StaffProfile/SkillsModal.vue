<template>
  <Dialog
    header="Edit Staff Skills"
    v-model:visible="internalVisible"
    modal
    class="w-full max-w-[900px]"
    :style="{ maxWidth: '700px' }"
    @hide="closeDialog"
  >
    <div class="formgrid grid">
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="firstName">First Name</label>
          <InputText
            v-model="localStaff.firstName"
            id="firstName"
            disabled
            class="w-full md:w-80"
          />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="lastName">Last Name</label>
          <InputText v-model="localStaff.lastName" id="lastName" disabled class="w-full md:w-80" />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="phoneNumber">Phone Number</label>
          <InputText v-model="localStaff.phone" id="phoneNumber" disabled class="w-full md:w-80" />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="email">Email</label>
          <InputText v-model="localStaff.email" id="email" disabled class="w-full md:w-80" />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="Specialism">Specialism</label>
          <Select
            v-model="localStaff.specialism"
            :options="specialismOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Employment Type"
            class="w-full md:w-80"
          />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="clinicType">Languages</label>
          <MultiSelect
            v-model="localStaff.languageIds"
            :options="languagesOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Language"
            display="chip"
            filter
            :maxSelectedLabels="5"
            class="w-full md:w-80"
            :class="{ 'p-invalid': !!formErrors.languageIds }"
          />
          <small v-if="formErrors.languageIds" class="p-error">{{ formErrors.languageIds }}</small>
        </div>
      </div>

      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="location">Location</label>
          <MultiSelect
            v-model="localStaff.locationIds"
            :options="locationOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Location"
            filter
            display="chip"
            :maxSelectedLabels="2"
            class="w-full md:w-80"
          />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="userRole">User Role</label>
          <Select
            v-model="localStaff.userRole"
            :options="rolesOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select User Type"
            class="w-full md:w-80"
          />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="clinicType">Clinic Type</label>
          <MultiSelect
            v-model="localStaff.clinicTypeIds"
            :options="clinicTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Clinic Type"
            display="chip"
            filter
            :maxSelectedLabels="2"
            class="w-full md:w-80"
          />
        </div>
      </div>

      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="employmentType">Employment Type</label>
          <Select
            v-model="localStaff.employmentType"
            :options="employmentTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Employment Type"
            class="w-full md:w-80"
          />
        </div>
      </div>
      <div class="field col-12 md:col-12">
        <div class="field col">
          <label for="miscellaneous">Miscellaneous</label>
          <Textarea v-model="localStaff.miscellaneous" rows="5" cols="50" class="w-full md:w-80" />
        </div>
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
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useStaffStore } from '@/stores/staff'
import type { Staff } from '@/types/staff'
import Toast from 'primevue/toast'
import { computed, onMounted } from 'vue'
import { useLookupStore } from '@/stores/lookup'
import { employmentTypeOptions, rolesOptions, specialismOptions } from '@/constants/options'
import Textarea from 'primevue/textarea'
const lookupStore = useLookupStore()
const formErrors = ref<Record<string, string>>({})
onMounted(() => {
  lookupStore.fetchLookups()
})

const locationOptions = computed(() =>
  lookupStore.locations.map((loc) => ({ label: loc.name, value: loc.id })),
)

const clinicTypeOptions = computed(() =>
  lookupStore.clinicTypes.map((ct) => ({ label: ct.name, value: ct.id })),
)

const languagesOptions = computed(() =>
  lookupStore.languages.map((ct) => ({ label: ct.name, value: ct.id })),
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

const localStaff = ref<Staff>({
  ...props.staff,
  locationIds: props.staff.locations.map((loc) => loc.id),
  clinicTypeIds: props.staff.clinicTypes.map((ct) => ct.id),
  languageIds: props.staff.languages.map((ct) => ct.id),
})
watch(
  () => props.staff,
  (val) => {
    localStaff.value = {
      ...val,
      locationIds: val.locations.map((l) => l.id),
      clinicTypeIds: val.clinicTypes.map((c) => c.id),
      languageIds: val.languages.map((ct) => ct.id),
    }
  },
  { immediate: true },
)

function saveSkills() {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Failed',
      detail: 'Please fill in all required fields.',
      life: 3000,
    })
    return
  }
  // map selected ids back to objects for saving
  const locations = lookupStore.locations.filter((loc) =>
    localStaff.value.locationIds.includes(loc.id),
  )
  const clinicTypes = lookupStore.clinicTypes.filter((ct) =>
    localStaff.value.clinicTypeIds.includes(ct.id),
  )
  const languages = lookupStore.languages.filter((ct) =>
    localStaff.value.languageIds.includes(ct.id),
  )
  store.updateStaff({
    ...localStaff.value,
    locations,
    clinicTypes,
    languages,
  })

  toast.add({
    severity: 'success',
    summary: 'Staff Updated',
    detail: `${localStaff.value.name}'s skills updated`,
    life: 3000,
  })

  closeDialog()
}
function validateForm(): boolean {
  formErrors.value = {}

  if (!localStaff.value.specialism) {
    formErrors.value.specialism = 'Specialism is required'
  }

  if (!localStaff.value.languageIds?.length) {
    formErrors.value.languageIds = 'At least one language is required'
  }

  if (!localStaff.value.locationIds?.length) {
    formErrors.value.locationIds = 'At least one location is required'
  }

  if (!localStaff.value.userRole) {
    formErrors.value.userRole = 'User Role is required'
  }

  if (!localStaff.value.clinicTypeIds?.length) {
    formErrors.value.clinicTypeIds = 'At least one clinic type is required'
  }

  if (!localStaff.value.employmentType) {
    formErrors.value.employmentType = 'Employment Type is required'
  }

  return Object.keys(formErrors.value).length === 0
}
</script>
