<template>
  <v-navigation-drawer
    v-model="sidebarDrawer"
    left
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    :rail="miniSidebar && !mobile"
    class="leftSidebar modern-sidebar"
    expand-on-hover
  >
    <!-- LOGO -->
    <div class="px-5 py-3">
      <Logo />
    </div>

    <!-- NAVIGATION -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <template
          v-for="(item, i) in sidebarMenu"
          :key="i"
        >
          <!-- GROUP -->
          <NavGroup
            v-if="item.header"
            :key="item.title"
            :item="item"
          />

          <!-- DIVIDER -->
          <v-divider
            v-else-if="item.divider"
            class="my-3"
          />

          <!-- COLLAPSE -->
          <NavCollapse
            v-else-if="item.children"
            class="leftPadding"
            :item="item"
            :level="0"
          />

          <!-- ITEM -->
          <NavItem
            v-else
            :item="item"
            class="leftPadding"
          />
        </template>
      </v-list>

      <!-- UPGRADE (masqué) -->
      <!-- <div
        v-if="userContext?.subscription?.plan === 'free'"
        class="pa-4"
      >
        <UpgradePlanCard />
      </div> -->

      <!-- VERSION -->
      <div class="pa-4 text-center">
        <v-chip
          color="inputBorder"
          size="small"
        >
          v1.0.0
        </v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Menu2Icon,
} from 'vue-tabler-icons';
import { useDisplay } from 'vuetify'

import { IAuthState } from '@/@application/states/interfaces/IAuthState';

import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { useCustomizerState } from '@/@presentation/composables/useCustomizerState';
import { filterMenuByRole } from '@/@presentation/helpers/menu/filterMenuByRole';
import { hailActiveCount } from '@/@presentation/@modules/weather/composables/useHailMonitoringState';

import { menu } from './menu/adminMenu';

import NavCollapse from './NavCollapse/NavCollapse.vue';
import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';

import UpgradePlanCard from './extrabox/UpgradePlanCard.vue';

import Logo from '../logo/LogoMain.vue';

const authState = container.get<IAuthState>(
  SYMBOLS.States.AuthState
);

const { userContext } = authState;

const { mobile } = useDisplay()

const {
  setMiniSidebar,
  toggleSidebarDrawer,
  sidebarDrawer,
  miniSidebar
} = useCustomizerState();

const sidebarMenu = computed(() => {
  const role = userContext.value?.membership.role ?? '';
  const filtered = filterMenuByRole(menu, role);

  // Injecter le badge dynamique sur l'entrée Météo grêle
  return filtered.map(item => {
    if (item.to === '/weather') {
      return {
        ...item,
        chip: hailActiveCount.value > 0 ? String(hailActiveCount.value) : undefined,
        chipColor: 'error',
        chipVariant: 'flat',
      };
    }
    return item;
  });
});
</script>

<style scoped lang="scss">
.modern-sidebar {
  border-right: none !important;
  background: rgb(var(--v-theme-navBg)) !important;

  :deep(.v-list) {
    color: rgba(255, 255, 255, 0.75) !important;
  }

  :deep(.v-list-item--active),
  :deep(.v-list-item--active .v-list-item-title) {
    color: #ffffff !important;
  }

  :deep(.v-list-item:hover) {
    color: #ffffff !important;
  }

  :deep(.smallCap) {
    color: rgba(255, 255, 255, 0.4) !important;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}
</style>