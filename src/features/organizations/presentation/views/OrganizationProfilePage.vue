<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <div class="d-flex align-center flex-wrap ga-3 mb-4">
        <div>
          <h1 class="text-h5 font-weight-bold">
            Paramètres de l'organisation
          </h1>
          <div class="text-body-2 text-medium-emphasis">
            Informations légales, coordonnées et conditions affichées sur vos documents.
          </div>
        </div>

        <v-spacer />

        <v-chip
          v-if="saved"
          color="success"
          variant="tonal"
          prepend-icon="mdi-check"
        >
          Enregistré
        </v-chip>

        <v-btn
          variant="text"
          :disabled="loading || !hasChanges"
          @click="onReset"
        >
          Annuler
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save-outline"
          :loading="loading"
          :disabled="!hasChanges"
          @click="onSave"
        >
          Enregistrer
        </v-btn>
      </div>

      <v-form
        ref="formRef"
        @submit.prevent="onSave"
      >
        <v-card
          variant="flat"
          class="bg-surface border"
        >
          <v-tabs
            v-model="tab"
            color="primary"
          >
            <v-tab
              v-for="item in tabs"
              :key="item.value"
              :value="item.value"
              :prepend-icon="item.icon"
            >
              {{ item.label }}
              <v-icon
                v-if="isTabDirty(item.value)"
                size="8"
                color="warning"
                class="ml-2"
                icon="mdi-circle"
              />
              <v-icon
                v-if="tabErrors[item.value]"
                size="14"
                color="error"
                class="ml-2"
                icon="mdi-alert-circle"
              />
            </v-tab>
          </v-tabs>

          <v-divider />

          <v-window
            v-model="tab"
            class="pa-5"
          >
            <v-window-item
              value="legal"
              eager
            >
              <v-row>
                <v-col
                  cols="12"
                  md="8"
                >
                  <v-text-field
                    v-model="profile.company_name"
                    label="Nom de l'entreprise *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="profile.legal_form"
                    label="Forme juridique *"
                    :items="legalForms"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.siren"
                    label="N° d'identification (SIREN, IDE...)"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.siret"
                    label="N° établissement (SIRET, UID...)"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.tva_number"
                    label="N° TVA intracommunautaire"
                    variant="outlined"
                    density="comfortable"
                    placeholder="FR12345678901"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.capital"
                    label="Capital social"
                    variant="outlined"
                    density="comfortable"
                    placeholder="10 000 €"
                    hint="Requis pour SARL/SAS"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item
              value="contact"
              eager
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="profile.address"
                    label="Adresse *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                >
                  <v-text-field
                    v-model="profile.zip_code"
                    label="Code postal *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    v-model="profile.city"
                    label="Ville *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.country"
                    label="Pays"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.phone"
                    label="Téléphone"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-phone"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.email"
                    label="Email"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-email"
                    :rules="[emailRule]"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.website"
                    label="Site web"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-web"
                    placeholder="https://..."
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item
              value="bank"
              eager
            >
              <v-row>
                <v-col
                  cols="12"
                  md="8"
                >
                  <v-text-field
                    v-model="profile.iban"
                    label="IBAN"
                    variant="outlined"
                    density="comfortable"
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    hint="Affiché en pied de facture"
                    persistent-hint
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.bic"
                    label="BIC / SWIFT"
                    variant="outlined"
                    density="comfortable"
                    placeholder="BNPAFRPP"
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item
              value="payment"
              eager
            >
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="profile.payment_delay"
                    label="Délai de paiement *"
                    :items="paymentDelays"
                    item-title="label"
                    item-value="value"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.late_payment_penalty"
                    label="Pénalités de retard"
                    variant="outlined"
                    density="comfortable"
                    placeholder="3 fois le taux légal"
                    hint="Mention légale obligatoire"
                    persistent-hint
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="profile.recovery_fee"
                    label="Indemnité forfaitaire de recouvrement"
                    variant="outlined"
                    density="comfortable"
                    placeholder="40 €"
                    hint="Obligatoire entre professionnels"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-form>
    </v-container>
  </MainLayout>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="4000"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';

import MainLayout from '@/app/layouts/MainLayout.vue';

import { OrganizationProfileViewModel } from '@/features/organizations/presentation/models/OrganizationProfileViewModel';
import { useOrganizationProfilePageDependencies } from '@/features/organizations/composition/useOrganizationProfilePageDependencies';

const { useOrganizationProfileState } = useOrganizationProfilePageDependencies();

const {
  profile,
  loading,
  init,
  updateProfile,
} = useOrganizationProfileState;

type TabKey = 'legal' | 'contact' | 'bank' | 'payment';

const tabs: { value: TabKey; label: string; icon: string }[] = [
  { value: 'legal', label: 'Identité légale', icon: 'mdi-office-building' },
  { value: 'contact', label: 'Coordonnées', icon: 'mdi-map-marker' },
  { value: 'bank', label: 'Coordonnées bancaires', icon: 'mdi-bank' },
  { value: 'payment', label: 'Conditions de paiement', icon: 'mdi-clock-outline' },
];

const tabFields: Record<TabKey, (keyof OrganizationProfileViewModel)[]> = {
  legal: ['company_name', 'legal_form', 'siren', 'siret', 'tva_number', 'capital'],
  contact: ['address', 'zip_code', 'city', 'country', 'phone', 'email', 'website'],
  bank: ['iban', 'bic'],
  payment: ['payment_delay', 'late_payment_penalty', 'recovery_fee'],
};

const requiredFields: Partial<Record<TabKey, (keyof OrganizationProfileViewModel)[]>> = {
  legal: ['company_name', 'legal_form'],
  contact: ['address', 'zip_code', 'city'],
  payment: ['payment_delay'],
};

const formRef = ref();

const tab = ref<TabKey>('legal');

const saved = ref(false);

const snapshot = ref<Partial<OrganizationProfileViewModel>>({});

const tabErrors = reactive<Record<TabKey, boolean>>({
  legal: false,
  contact: false,
  bank: false,
  payment: false,
});

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
});

const legalForms = [
  'EI',
  'EIRL',
  'EURL',
  'SARL',
  'SAS',
  'SASU',
  'SA',
  'SNC',
  'Auto-entrepreneur',
];

const paymentDelays = [
  { label: 'Comptant (0 jour)', value: 0 },
  { label: '15 jours', value: 15 },
  { label: '30 jours', value: 30 },
  { label: '45 jours', value: 45 },
  { label: '60 jours', value: 60 },
];

const required = (v: unknown) =>
  (v !== '' && v !== null && v !== undefined) || 'Champ obligatoire';

const emailRule = (v: string) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalide';

const takeSnapshot = () => {
  snapshot.value = { ...profile.value };
};

const isTabDirty = (key: TabKey) =>
  tabFields[key].some((field) => profile.value[field] !== snapshot.value[field]);

const hasChanges = computed(() => tabs.some((item) => isTabDirty(item.value)));

const refreshTabErrors = () => {
  tabs.forEach(({ value }) => {
    const fields = requiredFields[value] ?? [];

    tabErrors[value] =
      fields.some((field) => required(profile.value[field]) !== true) ||
      (value === 'contact' && emailRule(profile.value.email) !== true);
  });
};

const showSnack = (message: string, color = 'success') => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

const onSave = async () => {
  const { valid } = await formRef.value?.validate();

  refreshTabErrors();

  if (!valid) {
    const firstInvalid = tabs.find((item) => tabErrors[item.value]);

    if (firstInvalid) tab.value = firstInvalid.value;

    return;
  }

  try {
    await updateProfile();

    takeSnapshot();

    saved.value = true;

    setTimeout(() => {
      saved.value = false;
    }, 3000);

    showSnack('Paramètres enregistrés avec succès.');
  } catch {
    showSnack("Une erreur est survenue lors de l'enregistrement.", 'error');
  }
};

const onReset = () => {
  Object.assign(profile.value, snapshot.value);

  formRef.value?.resetValidation();

  tabs.forEach(({ value }) => {
    tabErrors[value] = false;
  });
};

onMounted(async () => {
  await init();

  takeSnapshot();
});
</script>
