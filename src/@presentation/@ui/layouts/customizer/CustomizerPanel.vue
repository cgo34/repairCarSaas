<script setup lang="ts">
import { computed, ref } from 'vue';

import { useCustomizerState } from '@/@presentation/composables/useCustomizerState';

const customizer = useCustomizerState();

/**
 * ============================================================
 * FONT OPTIONS
 * ============================================================
 */

const fontFamily = ref([
  'Roboto',
  'Poppins',
  'Inter',
]);

/**
 * ============================================================
 * DRAWER MODEL
 * ============================================================
 */

const drawer = computed({
  get: () => customizer.customizerDrawer.value,

  set: (value: boolean) =>
    customizer.setCustomizerDrawer(value),
});
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    temporary
    elevation="10"
    location="right"
    width="350"
  >
    <perfect-scrollbar style="height: 100%">
      <div>
        <v-row class="ma-0">
          <!-- ===================================================== -->
          <!-- HEADER -->
          <!-- ===================================================== -->

          <v-col
            cols="12"
            class="pa-0"
          >
            <div class="pa-5 d-flex justify-space-between align-center">
              <h5 class="text-h6 font-weight-bold">
                Theme customizer
              </h5>

              <div>
                <v-btn
                  color="error"
                  variant="outlined"
                  size="small"
                  class="mr-2"
                  @click="customizer.resetCustomizer"
                >
                  Reset
                </v-btn>

                <v-btn
                  variant="text"
                  color="lightText"
                  icon="$close"
                  density="compact"
                  @click.stop="drawer = false"
                />
              </div>
            </div>

            <v-divider />
          </v-col>

          <!-- ===================================================== -->
          <!-- CONTENT -->
          <!-- ===================================================== -->

          <v-col
            cols="12"
            class="pa-0"
          >
            <!-- ===================================================== -->
            <!-- FONT -->
            <!-- ===================================================== -->

            <v-card-item class="py-5">
              <v-card-title class="text-body-large mb-4">
                Font Style
              </v-card-title>

              <v-card-text class="pa-0">
                <v-radio-group
                  v-model="customizer.fontTheme.value"
                  hide-details
                  class="custom-font"
                >
                  <v-radio
                    v-for="font in fontFamily"
                    :key="font"
                    :label="font"
                    :value="font"
                    color="primary"
                    class="mb-5"
                  />
                </v-radio-group>
              </v-card-text>
            </v-card-item>

            <v-divider />

            <!-- ===================================================== -->
            <!-- INPUT BG -->
            <!-- ===================================================== -->

            <div class="d-flex justify-space-between align-center pa-5">
              <h5 class="text-body-1 font-weight-medium">
                Input Background
              </h5>

              <div>
                <v-radio-group
                  v-model="customizer.inputBg.value"
                  class="custom-radio input-radio ma-n2"
                  hide-details
                >
                  <v-radio
                    :value="true"
                    color="primary"
                    class="ma-2 input-bg"
                  />

                  <v-radio
                    :value="false"
                    color="primary"
                    class="ma-2"
                  />
                </v-radio-group>
              </div>
            </div>

            <v-divider />

            <!-- ===================================================== -->
            <!-- THEME -->
            <!-- ===================================================== -->

            <div class="pa-5">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-body-1 font-weight-medium">
                    Theme mode
                  </div>

                  <div class="text-caption text-medium-emphasis">
                    {{ customizer.themeLabel.value }}
                  </div>
                </div>

                <v-switch
                  :model-value="customizer.isDarkTheme.value"
                  color="primary"
                  hide-details
                  inset
                  @update:model-value="customizer.toggleTheme"
                />
              </div>
            </div>

            <v-divider />

            <!-- ===================================================== -->
            <!-- MINI SIDEBAR -->
            <!-- ===================================================== -->

            <div class="pa-5">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-body-1 font-weight-medium">
                    Mini sidebar
                  </div>

                  <div class="text-caption text-medium-emphasis">
                    Compact navigation mode
                  </div>
                </div>

                <v-switch
                  v-model="customizer.miniSidebar.value"
                  color="primary"
                  hide-details
                  inset
                />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style lang="scss">
.custom-radio {
  .v-selection-control-group {
    flex-direction: row;

    .v-selection-control {
      width: 48px;
      height: 48px;

      align-items: center;
      justify-content: center;

      flex: unset;

      border: 2px solid rgba(var(--v-theme-borderLight), 0.36);

      border-radius: 4px;

      &.v-selection-control--dirty {
        border: 2px solid rgba(var(--v-theme-primary), 1);
      }

      .v-selection-control__wrapper {
        .v-selection-control__input {
          opacity: 0;
        }

        img {
          position: absolute;
        }
      }

      .v-label {
        width: unset;
        height: unset;
      }
    }
  }
}

.input-bg {
  background-color: rgb(var(--v-theme-gray100)) !important;
}

.input-radio {
  .v-selection-control-group {
    .v-selection-control {
      height: 30px;
    }
  }
}

.custom-font {
  .v-selection-control-group {
    .v-selection-control {
      position: relative;

      border: 2px solid rgba(var(--v-theme-borderLight), 0.36);

      outline: 6px solid rgba(var(--v-theme-borderLight), 0.1);

      border-radius: 4px;

      margin: 6px;

      padding: 12px 16px;

      &.v-selection-control--dirty {
        border: 1px solid rgba(var(--v-theme-primary), 1);

        outline: 6px solid rgba(var(--v-theme-primary), 0.1);
      }

      .v-selection-control__wrapper {
        position: absolute;

        inset: 0;

        width: 100%;
        height: 100%;

        .v-selection-control__input {
          position: absolute;

          inset: 0;

          opacity: 0;

          width: 100%;
          height: 100%;

          cursor: pointer;

          margin: 0;
        }
      }
    }
  }
}
</style>