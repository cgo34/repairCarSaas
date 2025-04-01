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
        <v-container
          fluid
          class="page-wrapper"
        >
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
  miniSidebar,
  fontTheme,
  inputBg
} = useCustomizerState();
</script>
  
  