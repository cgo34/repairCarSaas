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
        <v-container
          v-if="!mobile"
          fluid
          class="pa-0"
        >
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
          <v-btn
            value="dashboard"
            to="/dashboard"
          >
            <v-icon>mdi-view-dashboard-outline</v-icon>
            <span>{{ $t('common.nav.home') }}</span>
          </v-btn>
          <v-btn
            value="quotes"
            to="/quotes"
          >
            <v-icon>mdi-file-document-outline</v-icon>
            <span>{{ $t('common.nav.quotes') }}</span>
          </v-btn>
          <v-btn
            value="new-quote"
            to="/quotes/new"
            class="fab-btn"
            :disabled="newQuoteDisabled"
          >
            <v-icon size="28">
              mdi-plus
            </v-icon>
          </v-btn>
          <v-btn
            value="invoices"
            to="/invoices"
          >
            <v-icon>mdi-receipt-outline</v-icon>
            <span>{{ $t('common.nav.invoices') }}</span>
          </v-btn>
          <v-btn
            value="weather"
            to="/weather"
          >
            <v-badge
              v-if="hailActiveCount > 0"
              :content="hailActiveCount"
              color="error"
              floating
            >
              <v-icon>mdi-weather-hail</v-icon>
            </v-badge>
            <v-icon v-else>
              mdi-weather-hail
            </v-icon>
            <span>{{ $t('common.nav.weather') }}</span>
          </v-btn>
        </v-bottom-navigation>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useFeatureAccess } from '@/features/featureAccess/composition/useFeatureAccess';
import { usePlanUsage } from '@/features/featureAccess/composition/usePlanUsage';
import { hailActiveCount } from '@/features/weather/presentation/composables/useHailMonitoringState';


import { useCustomizerState } from '@/app/layouts/useCustomizerState';

import BaseBreadcrumb from '@/shared/presentation/ui/components/BaseBreadcrumb.vue';

import VerticalHeaderVue from '@/app/layouts/vertical-header/VerticalHeader.vue';
import VerticalSidebarVue from '@/app/layouts/vertical-sidebar/VerticalSidebar.vue';

import FooterPanel from '@/app/layouts/footer/FooterPanel.vue';
import Customizer from '@/app/layouts/customizer/CustomizerPanel.vue';

const route = useRoute();

const pageTitle = computed(() => {
  return route.meta.title || '';
});

const pageSubtitle = computed(() => {
  return route.meta.subtitle || '';
});

const {
  miniSidebar,
  fontTheme,
  inputBg
} = useCustomizerState();

const { mobile } = useDisplay();
const activeBottomNav = ref(route.name);

const { isLimitReached } = useFeatureAccess();
const { quotesUsed, invoicesUsed, load: loadPlanUsage } = usePlanUsage();
const newQuoteDisabled = computed(() =>
  isLimitReached('max_quotes_per_month', quotesUsed.value)
  || isLimitReached('max_invoices_per_month', invoicesUsed.value));

// Les compteurs changent après chaque création : on les relit à chaque navigation
watch(() => route.fullPath, () => { void loadPlanUsage(); }, { immediate: true });
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
  box-shadow: 0 4px 12px rgb(var(--v-theme-primary), 0.4);
}
</style>