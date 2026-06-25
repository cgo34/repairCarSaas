<template>
  <v-locale-provider>
    <v-app
      :class="[
        fontTheme,
        miniSidebar ? 'mini-sidebar' : '',
        inputBg ? 'inputWithbg' : ''
      ]"
    >
      <!-- SIDEBAR -->
      <VerticalSidebarVue />

      <!-- HEADER -->
      <VerticalHeaderVue />

      <!-- CUSTOMIZER -->
      <Customizer />

      <!-- MAIN -->
      <v-main>
        <v-container
          fluid
          class="page-wrapper"
        >
          <!-- PAGE HEADER -->
          <BaseBreadcrumb
            v-if="!mobile"
            :title="pageTitle"
            :subtitle="pageSubtitle"
            :breadcrumbs="breadcrumbs"
          />

          <!-- PAGE CONTENT -->
          <RouterView>
            <slot />
          </RouterView>

          <!-- SETTINGS -->
          <!-- <v-btn
            class="customizer-btn"
            size="large"
            icon
            variant="flat"
            color="primary"
            @click.stop="setCustomizerDrawer(!customizerDrawer)"
          >
            <SettingsIcon class="icon" />
          </v-btn> -->
        </v-container>

        <!-- FOOTER -->
        <v-container v-if="!mobile" fluid class="pa-0">
          <FooterPanel />
        </v-container>

        <!-- BOTTOM NAV MOBILE -->
        <v-bottom-navigation
          v-if="mobile"
          v-model="activeBottomNav"
          class="mobile-bottom-nav"
          color="primary"
          elevation="4"
          grow
        >
          <v-btn value="dashboard" to="/dashboard">
            <v-icon>mdi-view-dashboard-outline</v-icon>
            <span>Accueil</span>
          </v-btn>
          <v-btn value="quotes" to="/quotes">
            <v-icon>mdi-file-document-outline</v-icon>
            <span>Devis</span>
          </v-btn>
          <v-btn value="new-quote" to="/quotes/add" class="fab-btn">
            <v-icon size="28">mdi-plus</v-icon>
          </v-btn>
          <v-btn value="invoices" to="/invoices">
            <v-icon>mdi-receipt-outline</v-icon>
            <span>Factures</span>
          </v-btn>
          <v-btn value="weather" to="/weather">
            <v-badge
              v-if="hailActiveCount > 0"
              :content="hailActiveCount"
              color="error"
              floating
            >
              <v-icon>mdi-weather-hail</v-icon>
            </v-badge>
            <v-icon v-else>mdi-weather-hail</v-icon>
            <span>Météo</span>
          </v-btn>
        </v-bottom-navigation>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { hailActiveCount } from '@/@presentation/@modules/weather/composables/useHailMonitoringState';

import { SettingsIcon } from 'vue-tabler-icons';

import { useCustomizerState } from '@/@presentation/composables/useCustomizerState';

import BaseBreadcrumb from '@/shared/BaseBreadcrumb.vue';

import VerticalHeaderVue from '@ui/layouts/vertical-header/VerticalHeader.vue';
import VerticalSidebarVue from '@ui/layouts/vertical-sidebar/VerticalSidebar.vue';

import FooterPanel from './footer/FooterPanel.vue';
import Customizer from './customizer/CustomizerPanel.vue';

type Breadcrumb = {
  title: string;
  href: string;
};

const route = useRoute();

const pageTitle = computed(() => {
  return route.meta.title || '';
});

const pageSubtitle = computed(() => {
  return route.meta.subtitle || '';
});

const breadcrumbs = computed(() => {
  return route.meta.breadcrumb || [];
});

const {
  miniSidebar,
  fontTheme,
  inputBg,
  customizerDrawer,
  setCustomizerDrawer
} = useCustomizerState();

const { mobile } = useDisplay();
const activeBottomNav = ref(route.name);
</script>

<style>
.mobile-bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
.mobile-bottom-nav .fab-btn .v-btn__content {
  background: rgb(var(--v-theme-primary));
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 4px;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.4);
}
</style>