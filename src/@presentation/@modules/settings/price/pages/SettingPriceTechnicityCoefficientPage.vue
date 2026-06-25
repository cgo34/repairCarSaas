<template>
  <MainLayout>
    <v-container fluid class="pa-0">
      <v-card>
        <v-alert
          class="mb-2"
          type="info"
          icon="$info"
          variant="tonal"
          text="L'indice de difficulté 1 est un DSP sur de la tôle. L'aluminium est ici majoré d'un multiplicateur et le travail de DAP est, lui, minoré Le diammètre 2 est le diamètre de référence, le diamètre 1 permet de minorer le prix de référence, quelle que soit la méthode de chiffrage."
        />
        <v-form>
          <v-container>
            <v-row>
              <v-col
                cols="6"
                md="6"
              >
                <v-text-field
                  v-model="settings.dapCoefficient"
                  label="DAP coefficient"
                  required
                />
              </v-col>

              <v-col
                cols="6"
                md="6"
              >
                <v-text-field
                  v-model="settings.dspCoefficient"
                  label="DSP coefficient"
                  required
                />
              </v-col>
              <v-col
                cols="6"
                md="6"
              >
                <v-text-field
                  v-model="settings.diameter25Coefficient"
                  label="Diameter 25 coefficient"
                  required
                />
              </v-col>

              <v-col
                cols="6"
                md="6"
              >
                <v-text-field
                  v-model="settings.diameter35Coefficient"
                  label="Diameter 35 coefficient"
                  required
                />
              </v-col>
              <v-col
                cols="6"
                md="6"
              >
                <v-text-field
                  v-model="settings.aluminiumCoefficient"
                  label="Aluminium coefficient"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="mb-2"
            color="primary"
            variant="flat"
            @click="onSaveSettingPriceTechnicityCoefficientBtnClick"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseSettingPriceTechnicityCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceTechnicityCoefficientState';
import { onMounted } from 'vue';

// Injection du state depuis Inversify
const useSettingPriceTechnicityCoefficientState = container.get<IUseSettingPriceTechnicityCoefficientState>(
  SYMBOLS.States.Setting.Price.TechnicityCoefficientState
);

const {
  settings,
  init,
  saveSettingTechnicityCoefficient
} = useSettingPriceTechnicityCoefficientState;

const onSaveSettingPriceTechnicityCoefficientBtnClick = () => {
  saveSettingTechnicityCoefficient()
}

onMounted(async () => {
  await init();
});
</script>
