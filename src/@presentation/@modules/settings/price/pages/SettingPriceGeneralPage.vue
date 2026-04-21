<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-card>
          <v-alert
            class="mb-2"
            type="info"
            icon="$info"
            variant="tonal"
            text="Le montant du taux horaire est appliqué aux calculs des éléments"
          />
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="6"
                  md="6"
                >
                  <v-text-field
                    v-model="settings.hourlyRate"
                    label="Hourly rate"
                    required
                  />
                </v-col>

                <v-col
                  cols="6"
                  md="6"
                >
                  <v-text-field
                    v-model="settings.unitTime"
                    label="Unit time"
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
              @click="onSaveSettingPriceGeneralBtnClick"
            >
              Enregistrer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseSettingPriceGeneralState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceGeneralState';
import { onMounted } from 'vue';

// Injection du state depuis Inversify
const useSettingPriceGeneralState = container.get<IUseSettingPriceGeneralState>(
  SYMBOLS.States.Setting.Price.GeneralState
);

const {
  settings,
  init,
  saveSettingPriceGeneral
} = useSettingPriceGeneralState;

const onSaveSettingPriceGeneralBtnClick = async () => {
  saveSettingPriceGeneral()
}

onMounted(async () => {
  await init();
});
</script>
