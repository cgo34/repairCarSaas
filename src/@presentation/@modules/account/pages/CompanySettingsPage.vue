<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
      style="max-width: 860px;"
    >
      <!-- Header -->
      <div class="d-flex align-center gap-3 mb-6">
        <div>
          <h1 class="text-h5 font-weight-bold mb-1">
            Paramètres de l'entreprise
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Ces informations apparaissent sur vos devis et factures.
          </p>
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
      </div>

      <v-form
        ref="formRef"
        @submit.prevent="onSave"
      >
        <v-row>
          <!-- ─── Logo ──────────────────────────────────────────── -->
          <v-col cols="12">
            <div class="section-header mb-3">
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-image
              </v-icon>
              <span class="text-subtitle-1 font-weight-semibold">Logo de l'entreprise</span>
            </div>
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.logoUrl"
                    label="URL du logo"
                    variant="outlined"
                    density="comfortable"
                    placeholder="https://example.com/logo.png"
                    hint="URL publique d'une image (PNG, JPG). Apparaîtra sur vos devis et factures."
                    persistent-hint
                    prepend-inner-icon="mdi-link"
                  />
                </v-col>
                <v-col
                  v-if="form.logoUrl"
                  cols="12"
                  class="mt-2"
                >
                  <div class="text-caption text-medium-emphasis mb-1">Aperçu :</div>
                  <img
                    :src="form.logoUrl"
                    alt="Logo entreprise"
                    style="max-height: 80px; max-width: 280px; object-fit: contain; border: 1px solid #eee; border-radius: 4px; padding: 8px;"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- ─── Identité légale ─────────────────────────────── -->
          <v-col cols="12">
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
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-row dense>
                <v-col
                  cols="12"
                  md="7"
                >
                  <v-text-field
                    v-model="form.companyName"
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
                    v-model="form.legalForm"
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
                    v-model="form.siren"
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
                    v-model="form.siret"
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
                    v-model="form.tvaNumber"
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
                    v-model="form.capital"
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

          <!-- ─── Coordonnées ────────────────────────────────── -->
          <v-col cols="12">
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
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.address"
                    label="Adresse *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="form.zipCode"
                    label="Code postal *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    v-model="form.city"
                    label="Ville *"
                    :rules="[required]"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.country"
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
                    v-model="form.phone"
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
                    v-model="form.email"
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
                    v-model="form.website"
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

          <!-- ─── Coordonnées bancaires ──────────────────────── -->
          <v-col cols="12">
            <div class="section-header mb-3 mt-2">
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-bank
              </v-icon>
              <span class="text-subtitle-1 font-weight-semibold">Coordonnées bancaires</span>
            </div>
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-row dense>
                <v-col
                  cols="12"
                  md="8"
                >
                  <v-text-field
                    v-model="form.iban"
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
                    v-model="form.bic"
                    label="BIC / SWIFT"
                    variant="outlined"
                    density="comfortable"
                    placeholder="BNPAFRPP"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- ─── Conditions de paiement ─────────────────────── -->
          <v-col cols="12">
            <div class="section-header mb-3 mt-2">
              <v-icon
                size="18"
                color="primary"
                class="mr-2"
              >
                mdi-clock-outline
              </v-icon>
              <span class="text-subtitle-1 font-weight-semibold">Conditions de paiement</span>
            </div>
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <v-row dense>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="form.paymentDelay"
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
                    v-model="form.latePaymentPenalty"
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
                    v-model="form.recoveryFee"
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

          <!-- ─── Actions ───────────────────────────────────── -->
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
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseCompanySettingsState } from '@/@presentation/types/composables/IUseCompanySettingsState';
import { CompanySettingsViewModel } from '@/@presentation/types/models/CompanySettingsViewModel';
import { onMounted, reactive, ref } from 'vue';

// #region -> DEPENDENCIES
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const companySettingsState = container.get<IUseCompanySettingsState>(
  SYMBOLS.States.CompanySettingsState
);
const { settings, loading, init, save } = companySettingsState;
// #endregion

// #region -> REFS
const formRef = ref();
const saved = ref(false);
const snackbar = reactive({ show: false, message: '', color: 'success' });

const emptyForm = (): CompanySettingsViewModel => ({
  userId: authState.userContext?.value?.id ?? '',
  companyName: '',
  legalForm: '',
  siren: '',
  siret: '',
  tvaNumber: '',
  capital: '',
  address: '',
  zipCode: '',
  city: '',
  country: 'France',
  phone: '',
  email: '',
  website: '',
  iban: '',
  bic: '',
  paymentDelay: 30,
  latePaymentPenalty: '',
  recoveryFee: '',
});

const form = reactive<CompanySettingsViewModel>(emptyForm());
// #endregion

// #region -> STATIC DATA
const legalForms = ['EI', 'EIRL', 'EURL', 'SARL', 'SAS', 'SASU', 'SA', 'SNC', 'Auto-entrepreneur'];

const paymentDelays = [
  { label: 'Comptant (0 jour)', value: 0 },
  { label: '15 jours', value: 15 },
  { label: '30 jours', value: 30 },
  { label: '45 jours', value: 45 },
  { label: '60 jours', value: 60 },
];
// #endregion

// #region -> VALIDATION RULES
const required = (v: unknown) =>
  (v !== '' && v !== null && v !== undefined) || 'Champ obligatoire';
const emailRule = (v: string) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalide';
// #endregion

// #region -> HELPERS
const showSnack = (message: string, color = 'success') => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

const applySettings = (s: CompanySettingsViewModel) => {
  Object.assign(form, s);
};
// #endregion

// #region -> HANDLERS
const onSave = async () => {
  const result = await formRef.value?.validate();
  if (!result?.valid) {
    showSnack('Veuillez corriger les erreurs dans le formulaire.', 'error');
    return;
  }

  try {
    const result = await save({ ...form });
    applySettings(result);
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 3000);
    showSnack('Paramètres enregistrés avec succès.');
  } catch {
    showSnack("Une erreur est survenue lors de l'enregistrement.", 'error');
  }
};

const onReset = () => {
  if (settings.value) {
    applySettings(settings.value);
  } else {
    Object.assign(form, emptyForm());
  }
  formRef.value?.resetValidation();
};
// #endregion

onMounted(async () => {
  const userId = authState.userContext?.value?.id;
  if (!userId) return;
  await init(userId);
  if (settings.value) {
    applySettings(settings.value);
  }
});
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
}
</style>
