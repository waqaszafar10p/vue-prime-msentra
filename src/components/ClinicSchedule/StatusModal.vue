<template>
  <Dialog
    header="Update Staff Status"
    v-model:visible="internalVisible"
    modal
    :closable="true"
    class="w-[400px]"
    @hide="closeDialog"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="status">Status</label>
        <Dropdown
          v-model="localStatus"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Status"
          inputId="status"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
      <Button label="Save" icon="pi pi-check" @click="saveStatus" />
    </template>
  </Dialog>
  <Toast />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import type { Staff } from '@/types/staff'
import { useStaffStore } from '@/stores/staff'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  visible: boolean
  staff: Staff
}>()
const toast = useToast()
const emit = defineEmits(['update:visible', 'close'])

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'On Leave', value: 'On Leave' }
]

const localStatus = ref(props.staff.status)
const internalVisible = ref(props.visible)

watch(() => props.visible, (val) => {
  internalVisible.value = val
})

watch(() => props.staff, (val) => {
  localStatus.value = val.status
})

function closeDialog() {
  emit('update:visible', false)
  emit('close')
}

const store = useStaffStore()

function saveStatus() {
  const updated = { ...props.staff, status: localStatus.value }
  store.updateStaff(updated)
  toast.add({
    severity: 'success',
    summary: 'Status Updated',
    detail: `Status for ${props.staff.name} set to ${localStatus.value}`,
    life: 3000
  })
  closeDialog()
}
</script>
