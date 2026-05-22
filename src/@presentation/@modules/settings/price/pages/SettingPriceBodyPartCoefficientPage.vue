<template>
  <MainLayout>
    <v-container fluid>
      <v-card>
        <v-alert
          class="mb-2"
          type="info"
          icon="$info"
          variant="tonal"
          text="L'indice de difficulté 1 est une bosse sur un pavillon. Vous pouvez décider qu'une bosse sur un autre élément de carrosserie est X fois plus difficile à réparer."
        />
        <v-form>
          <v-container>
            <v-row>
              <v-col
                cols="6"
                md="6"
              >
                <div v-for="(elm, idex) in settings.slice(0,7)">
                  <span>
                    {{ elm.bodyParts.name }}
                  </span>
                  <v-text-field
                    v-model="elm.coefficient"
                    label="Difficulty coefficient"
                    required
                  />
                </div>
              </v-col>

              <v-col
                cols="6"
                md="6"
              >
                <div v-for="(elm, idex) in settings.slice(7, -1)">
                  <span>
                    {{ elm.bodyParts.name }}
                  </span>
                  <v-text-field
                    v-model="elm.coefficient"
                    label="Difficulty coefficient"
                    required
                  />
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
            @click="onSaveSettingBodyPartCoefficientBtnClick"
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
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { onMounted } from 'vue';

// Injection du state depuis Inversify
const useSettingPriceBodyPartCoefficientState = container.get<IUseSettingPriceBodyPartCoefficientState>(
  SYMBOLS.States.Setting.Price.BodyPartCoefficientState
);

const {
  settings,
  init,
  saveSettingBodyPartCoefficient,
} = useSettingPriceBodyPartCoefficientState;

const onSaveSettingBodyPartCoefficientBtnClick = () => {
  saveSettingBodyPartCoefficient()
}

onMounted(async () => {
  await init();
});
</script>
