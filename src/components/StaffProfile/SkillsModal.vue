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
          <label for="firstName">First Name</label>
          <InputText v-model="localStaff.firstName" id="firstName" disabled />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="lastName">Last Name</label>
          <InputText v-model="localStaff.lastName" id="lastName" disabled />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="phone">Phone</label>
          <InputText v-model="localStaff.phone" id="phone" disabled />
        </div>
      </div>
      <div class="field col-12 md:col-6">
        <div class="field col">
          <label for="email">Email</label>
          <InputText v-model="localStaff.email" id="email" disabled />
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <div class="field col">
          <label for="Specialism">Specialism</label>
          <Dropdown
            v-model="localStaff.specialism"
            :options="specialismOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Employment Type"
          />
        </div>
      </div>
      <div class="field col-12 md:col-2"></div>
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
          />
        </div>
      </div>

      <div class="field col-12 md:col-4">
        <div class="field col">
          <label for="location">Location</label>
          <MultiSelect
            v-model="localStaff.locationIds"
            :options="locationOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Location"
            filter
          />
        </div>
      </div>
      <div class="field col-12 md:col-2"></div>
      <div class="field col-12 md:col-4">
        <div class="field col">
          <label for="userRole">User Role</label>
          <Dropdown
            v-model="localStaff.userRole"
            :options="rolesOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select User Type"
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
          />
        </div>
      </div>

      <div class="field col-12 md:col-4">
        <div class="field col">
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
      <div class="field col-12 md:col-8">
        <div class="field col">
          <label for="miscellaneous">Miscellaneous</label>
          <Textarea v-model="localStaff.miscellaneous" rows="5" cols="50" />
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
import Dropdown from 'primevue/dropdown'
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
</script>
