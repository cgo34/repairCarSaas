<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-4"
    >
      <!-- ===================================================== -->
      <!-- HEADER -->
      <!-- ===================================================== -->

      <div
        class="d-flex align-center gap-3 mb-6"
      >
        <v-chip
          v-if="saved"
          color="success"
          variant="tonal"
          prepend-icon="mdi-check"
        >
          Enregistré
        </v-chip>
      </div>

      <!-- ===================================================== -->
      <!-- FORM -->
      <!-- ===================================================== -->

      <v-form
        ref="formRef"
        @submit.prevent="onSave"
      >
        <v-row>
          <!-- ===================================================== -->
          <!-- IDENTITE LEGALE -->
          <!-- ===================================================== -->

          <v-col
            cols="12"
            md="6"
          >
            <div class="section-header mb-3">
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-office-building
              </v-icon>
              <span class="text-subtitle-1 font-weight-semibold">Identité légale</span>
            </div>
            <v-card class="pa-4">
              <v-row dense>
                <v-col
                  cols="12"
                  md="7"
                >
                  <v-text-field
                    v-model="
                      profile.company_name
                    "
                    label="Nom de l'entreprise *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="5"
                >
                  <v-select
                    v-model="
                      profile.legal_form
                    "
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
                    v-model="
                      profile.siren
                    "
                    label="SIREN *"
                    :rules="[
                      required,
                      sirenRule,
                    ]"
                    variant="outlined"
                    density="comfortable"
                    placeholder="123456789"
                    counter="9"
                    maxlength="9"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="
                      profile.siret
                    "
                    label="SIRET *"
                    :rules="[
                      required,
                      siretRule,
                    ]"
                    variant="outlined"
                    density="comfortable"
                    placeholder="12345678900012"
                    counter="14"
                    maxlength="14"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="
                      profile.tva_number
                    "
                    label="N° TVA intracommunautaire"
                    variant="outlined"
                    density="comfortable"
                    placeholder="FR12345678901"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="
                      profile.capital
                    "
                    label="Capital social"
                    variant="outlined"
                    density="comfortable"
                    placeholder="10 000 €"
                    hint="Requis pour SARL/SAS"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- ===================================================== -->
          <!-- COORDONNEES -->
          <!-- ===================================================== -->

          <v-col
            cols="12"
            md="6"
          >
            <div class="section-header mb-3 mt-2">
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-map-marker
              </v-icon>
              <span class="text-subtitle-1 font-weight-semibold">Coordonnées</span>
            </div>
            <v-card class="pa-4">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="
                      profile.address
                    "
                    label="Adresse *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    v-model="
                      profile.zip_code
                    "
                    label="Code postal *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="5">
                  <v-text-field
                    v-model="
                      profile.city
                    "
                    label="Ville *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="3">
                  <v-text-field
                    v-model="
                      profile.country
                    "
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
                    v-model="
                      profile.phone
                    "
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
                    v-model="
                      profile.email
                    "
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
                    v-model="
                      profile.website
                    "
                    label="Site web"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-web"
                    placeholder="https://..."
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- ===================================================== -->
          <!-- BANQUE -->
          <!-- ===================================================== -->

          <v-col cols="12">
            <div
              class="section-header mb-3 mt-2"
            >
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-bank
              </v-icon>

              <span
                class="text-subtitle-1 font-weight-semibold"
              >
                Coordonnées bancaires
              </span>
            </div>

            <v-card
              class="pa-4"
            >
              <v-row dense>
                <v-col
                  cols="12"
                  md="8"
                >
                  <v-text-field
                    v-model="
                      profile.iban
                    "
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
                    v-model="
                      profile.bic
                    "
                    label="BIC / SWIFT"
                    variant="outlined"
                    density="comfortable"
                    placeholder="BNPAFRPP"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- ===================================================== -->
          <!-- PAIEMENT -->
          <!-- ===================================================== -->

          <v-col cols="12">
            <div
              class="section-header mb-3 mt-2"
            >
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-clock-outline
              </v-icon>

              <span
                class="text-subtitle-1 font-weight-semibold"
              >
                Conditions de paiement
              </span>
            </div>

            <v-card
              class="pa-4"
            >
              <v-row dense>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="
                      profile.payment_delay
                    "
                    label="Délai de paiement *"
                    :items="
                      paymentDelays
                    "
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
                    v-model="
                      profile.late_payment_penalty
                    "
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
                    v-model="
                      profile.recovery_fee
                    "
                    label="Indemnité forfaitaire de recouvrement"
                    variant="outlined"
                    density="comfortable"
                    placeholder="40 €"
                    hint="Obligatoire entre professionnels"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- ===================================================== -->
          <!-- ACTIONS -->
          <!-- ===================================================== -->

          <v-col
            cols="12"
            class="d-flex justify-end gap-3 mt-2"
          >
            <v-btn
              variant="text"
              color="error"
              :disabled="loading"
              @click="onReset"
            >
              Réinitialiser
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              :loading="loading"
              min-width="160"
            >
              Enregistrer
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </MainLayout>

  <!-- ===================================================== -->
  <!-- SNACKBAR -->
  <!-- ===================================================== -->

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
  onMounted,
  reactive,
  ref,
} from 'vue';

import { container } from '@/@infrastructure/ioc/inversify.config';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';

import { IUseOrganizationProfileState } from '@/@presentation/types/composables/IUseOrganizationProfile';

/**
 * ============================================================
 * STATE
 * ============================================================
 */

const useOrganizationProfileState =
  container.get<IUseOrganizationProfileState>(
    SYMBOLS.States
      .OrganizationProfileState
  );

const {
  profile,

  loading,

  init,

  updateProfile,

  resetProfile,
} = useOrganizationProfileState;

/**
 * ============================================================
 * UI
 * ============================================================
 */

const formRef = ref();

const saved = ref(false);

const snackbar = reactive({
  show: false,

  message: '',

  color: 'success',
});

/**
 * ============================================================
 * STATIC DATA
 * ============================================================
 */

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
  {
    label: 'Comptant (0 jour)',
    value: 0,
  },

  {
    label: '15 jours',
    value: 15,
  },

  {
    label: '30 jours',
    value: 30,
  },

  {
    label: '45 jours',
    value: 45,
  },

  {
    label: '60 jours',
    value: 60,
  },
];

/**
 * ============================================================
 * VALIDATION
 * ============================================================
 */

const required = (
  v: unknown
) =>
  (v !== '' &&
    v !== null &&
    v !== undefined) ||
  'Champ obligatoire';

const sirenRule = (
  v: string
) =>
  /^\d{9}$/.test(v) ||
  'Le SIREN doit contenir 9 chiffres';

const siretRule = (
  v: string
) =>
  /^\d{14}$/.test(v) ||
  'Le SIRET doit contenir 14 chiffres';

const emailRule = (
  v: string
) =>
  !v ||
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    v
  ) ||
  'Email invalide';

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

const showSnack = (
  message: string,
  color = 'success'
) => {
  snackbar.message = message;

  snackbar.color = color;

  snackbar.show = true;
};

/**
 * ============================================================
 * HANDLERS
 * ============================================================
 */

const onSave = async () => {
  const { valid } =
    await formRef.value?.validate();

  if (!valid) return;

  try {
    await updateProfile();

    saved.value = true;

    setTimeout(() => {
      saved.value = false;
    }, 3000);

    showSnack(
      'Paramètres enregistrés avec succès.'
    );
  } catch {
    showSnack(
      "Une erreur est survenue lors de l'enregistrement.",
      'error'
    );
  }
};

const onReset = () => {
  resetProfile();

  formRef.value?.resetValidation();
};

/**
 * ============================================================
 * LIFECYCLE
 * ============================================================
 */

onMounted(async () => {
  await init();
});
</script>

<style scoped>
.section-header {
  display: flex;

  align-items: center;
}
</style>