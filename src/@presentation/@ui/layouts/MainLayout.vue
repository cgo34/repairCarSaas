<template>
  <v-locale-provider>
    <!-- Add theme="PurpleTheme" to manage theme switch witch themeMode setting var -->
    <v-app
      :class="[fontTheme, miniSidebar ? 'mini-sidebar' : '', inputBg ? 'inputWithbg' : '']"
    >
      
      <VerticalSidebarVue />
      <VerticalHeaderVue />

      <!-- <v-navigation-drawer
        v-model="sidebarDrawer"
        :mini-variant="miniSidebar"
        app
      ></v-navigation-drawer> -->

      <v-main>
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView>
              <slot></slot>
            </RouterView>
            <v-btn
              class="customizer-btn"
              size="large"
              icon
              variant="flat"
              color="secondary"
              @click.stop=""
            >
              <SettingsIcon class="icon" />
            </v-btn>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import { useCustomizerState } from '@/@presentation/composables/useCustomizerState';
import VerticalHeaderVue from '@ui/layouts/vertical-header/VerticalHeader.vue';
import VerticalSidebarVue from '@ui/layouts/vertical-sidebar/VerticalSidebar.vue';

const {
  sidebarDrawer,
  customizerDrawer,
  miniSidebar,
  fontTheme,
  inputBg,
  toggleSidebarDrawer,
  setMiniSidebar
} = useCustomizerState();
</script>
  
  