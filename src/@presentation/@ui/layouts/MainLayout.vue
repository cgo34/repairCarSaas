<template>
  <v-locale-provider>
    <!-- Add theme="PurpleTheme" to manage theme switch witch themeMode setting var -->
    <v-app
      :class="[fontTheme, miniSidebar ? 'mini-sidebar' : '', inputBg ? 'inputWithbg' : '']"
    >
      <VerticalSidebarVue />
      <VerticalHeaderVue />


      <v-main style="padding-top: 45px !important;">
        <v-container
          fluid
          class="page-wrapper"
        >
          <div>
            <BaseBreadcrumb
              :title="pageTitle"
              :breadcrumbs="breadcrumbs"
            />
            <RouterView>
              <slot />
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
        <v-container
          fluid
          class="pt-0"
        >
          <div>
            <FooterPanel />
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
import BaseBreadcrumb from '@/shared/BaseBreadcrumb.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import FooterPanel from './footer/FooterPanel.vue';

type Breadcrumb = {
  title: string;
  href: string;
};

const route = useRoute();

const pageTitle = computed(() => {
  const breadcrumbs = route.meta.breadcrumb as Breadcrumb[] || [];
  return breadcrumbs[breadcrumbs.length - 1]?.title || 'Default Page Title';
});

const breadcrumbs = computed(() => {
  return route.meta.breadcrumb || [];
});

const {
  sidebarDrawer,
  miniSidebar,
  fontTheme,
  inputBg
} = useCustomizerState();
</script>
  
  