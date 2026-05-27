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
          class="page-wrapper px-6"
        >
          <!-- PAGE HEADER -->
          <BaseBreadcrumb
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
        <v-container
          fluid
          class="pt-0"
        >
          <FooterPanel />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

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
</script>