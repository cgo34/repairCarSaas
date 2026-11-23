<template>
  <GenericDialog
    ref="genericDialogRef"
    title="Ajouter un élément"
    persistent
    :max-width="600"
  >
    <template #default>
      <v-form ref="form">
        <v-container>
          <!-- Ligne 1 : nom + adresse -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="garage.name"
                label="Name"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="garage.address"
                label="address"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <!-- Ligne 2 : adresse -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="garage.zip_code"
                label="Zipcode"
                outlined
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="garage.city"
                label="City"
                outlined
                dense
              />
            </v-col>
          </v-row>

          
          <!-- Ligne 3 : email + tel -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="garage.email"
                label="Email"
                outlined
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="garage.phone"
                label="Phone"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <!-- Ligne 4 : % commission -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="garage.percentageCommission"
                label="Pourcentage commission"
                type="number"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </template>

    <template #actions>
      <v-btn @click="onCancelBtnClick()">
        Annuler
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isValidGarage"
        @click="onValidateBtnClick()"
      >
        Valider
      </v-btn>
    </template>
  </GenericDialog>
</template>

<script setup lang="ts">
import { useGarageDialogDependencies } from '@/features/garages/composition/useGarageDialogDependencies';
import GenericDialog from '@/shared/presentation/ui/components/GenericDialog.vue';
import type { GenericDialogExposed } from '@/shared/presentation/ui/components/components';
import { computed, reactive, ref } from 'vue';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { GarageDialogEmits } from './GarageDialog';


  const { authState } = useGarageDialogDependencies();

//#region -> DEFINES
const emit = defineEmits<GarageDialogEmits>()
//#endregion

//#region -> REFS
const genericDialogRef = ref<GenericDialogExposed>()
const form = ref()
//#endregion

//#region -> DATA
const garage = reactive<GarageViewModel>({
  name: '',
  code: '',
  address: '',
  zip_code: '',
  city: '',
  email: '',
  phone: '',
  percentageCommission: undefined,
  organization_id: authState.userContext.value?.organization.id ?? ''
})
//#endregion

//#region -> METHODS
const isValidGarage = computed(() => {
  // if (!garage.name)
  //   throw new Error('Name is required')

  // if (!garage.address)
  //   throw new Error('Address is required')

  // if (!garage.zipCode)
  //   throw new Error('Zipcode is required')

  // if (!garage.city)
  //   throw new Error('City is required')

  // if (!garage.email)
  //   throw new Error('Email is required')

  // if (!garage.phone)
  //   throw new Error('Phone is required')

  // if (!garage.percentageCommission)
  //   throw new Error('Commission is required')

  if (
    !garage.name
    || !garage.address
    || !garage.zip_code
    || !garage.city
    || !garage.email
    || !garage.phone
    || !garage.percentageCommission
  ) {
    return false
  }

  return true
})

const onCancelBtnClick = (): void => {
  close()
}

const onValidateBtnClick = (): void => {
  if (!isValidGarage.value)
    return

  close()
  emit('validated', garage) 
}

const open = (): void => {
  resetForm()
  genericDialogRef.value?.open()
}

const close = (): void => {
  genericDialogRef.value?.close()
}

const resetForm = () => {
  garage.name = '',
  garage.code = '',
  garage.address = '',
  garage.zip_code = '',
  garage.city = '',
  garage.email = '',
  garage.phone = '',
  garage.percentageCommission = undefined,
  garage.organization_id = authState.userContext.value?.organization.id ?? ''
}
//#endregion

//#region -> EXPOSE
defineExpose({
  open,
  close,
})
//#endregion
</script>
