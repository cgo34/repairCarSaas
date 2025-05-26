<template>
  <MainLayout><v-container fluid>
      <v-row>
        <v-card>
          <v-alert
            class="mb-2"
            type="info"
            icon="$info"
            variant="tonal"
            text="Le nombre de bosses est traduit en Unités de temps (UT) paramétrables 1UT = 6 minutes"
          ></v-alert>
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="6"
                  md="6"
                >
                  <div v-for="(line, idex) in settings.slice(0,13)">
                    <span
                      v-if="line.impactCountMin === line.impactCountMax"
                    >
                      {{ line.impactCountMin }} impacts
                    </span>
                    <span v-else>
                      {{ line.impactCountMin }} - {{ line.impactCountMax }} impacts
                    </span>
                    <v-text-field
                      v-model="line.unitTime"
                      label="Unit time"
                      required
                    ></v-text-field>
                  </div>
                </v-col>

                <v-col
                  cols="6"
                  md="6"
                >
                  <div v-for="(line, idex) in settings.slice(13, -1)">
                    <span
                      v-if="line.impactCountMin === line.impactCountMax"
                    >
                      {{ line.impactCountMin }} impacts
                    </span>
                    <span v-else>
                      {{ line.impactCountMin }} - {{ line.impactCountMax }} impacts
                    </span>
                    <v-text-field
                      v-model="line.unitTime"
                      label="Unit time"
                      required
                    ></v-text-field>
                  </div>
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
              @click="onSaveSettingUnitTimeBtnClick"
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
import { IUseSettingPriceImpactCountToUtState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceImpactCountToUtState';
import { onMounted } from 'vue';

// Injection du state depuis Inversify
const useSettingPriceImpactCountToUtState = container.get<IUseSettingPriceImpactCountToUtState>(
  SYMBOLS.States.Setting.Price.ImpactCountToUtState
);

const {
  settings,
  init,
  saveSettingUnitTime
} = useSettingPriceImpactCountToUtState;


const onSaveSettingUnitTimeBtnClick = () => {
  saveSettingUnitTime()
}

onMounted(async () => {
  await init();
});
</script>
