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
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- LOGO (mobile) -->
    <div
      v-if="mobile"
      class="px-4 py-3"
    >
      <Logo />
    </div>

    <!-- NAVIGATION -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <!-- TOGGLE + LOGO -->
        <v-list-item
          v-if="!mobile"
          rounded
          class="mb-3 sidebar-toggle"
          @click="setMiniSidebar(!miniSidebar)"
        >
          <template #prepend>
            <Menu2Icon
              size="20"
              stroke-width="1.5"
              class="mr-3"
            />
          </template>
          <v-list-item-title v-if="!miniSidebar || isHovered">
            <Logo />
          </v-list-item-title>
        </v-list-item>

        <!-- MENU UTILISATEUR (sous le logo) -->
        <SidebarUserMenu :compact="miniSidebar && !isHovered && !mobile" />
        <v-divider class="my-3" />

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
    </perfect-scrollbar>

    <!-- VERSION (épinglée en bas) -->
    <template #append>
      <div class="pb-3 text-center">
        <v-chip
          color="inputBorder"
          size="small"
        >
          v1.0.0
        </v-chip>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Menu2Icon
} from 'vue-tabler-icons';
import { useDisplay } from 'vuetify'

import { IAuthState } from '@/features/auth/presentation/state/IAuthState';

import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

import { useCustomizerState } from '@/app/layouts/useCustomizerState';
import { filterMenuByRole } from '@/app/layouts/menu/filterMenuByRole';
import { hailActiveCount } from '@/features/weather/presentation/composables/useHailMonitoringState';

import { menu } from '@/app/layouts/vertical-sidebar/menu/adminMenu';
import { superAdminMenu } from '@/app/layouts/vertical-sidebar/menu/superAdminMenu';

import NavCollapse from '@/app/layouts/vertical-sidebar/NavCollapse/NavCollapse.vue';
import NavGroup from '@/app/layouts/vertical-sidebar/NavGroup/NavGroup.vue';
import NavItem from '@/app/layouts/vertical-sidebar/NavItem/NavItem.vue';
import SidebarUserMenu from '@/app/layouts/vertical-sidebar/SidebarUserMenu.vue';


import Logo from '@/app/layouts/logo/LogoMain.vue';

const authState = container.get<IAuthState>(
  SYMBOLS.States.AuthState
);

const { userContext } = authState;

const { mobile } = useDisplay()

const isHovered = ref(false);

const {
  sidebarDrawer,
  miniSidebar,
  setMiniSidebar
} = useCustomizerState();

const sidebarMenu = computed(() => {
  if (
    userContext.value?.platformRole === 'super_admin' &&
    userContext.value.isGlobalContext
  ) {
    return superAdminMenu;
  }

  const role = userContext.value?.membership?.role ?? '';
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

  /* La zone de menu prend la hauteur restante (le bloc utilisateur est en bas)
     au lieu d'une hauteur fixe, et la scrollbar est masquée. */
  :deep(.scrollnavbar) {
    height: auto;
    flex: 1 1 auto;
    min-height: 0;
  }

  :deep(.ps__rail-y),
  :deep(.ps__rail-x) {
    display: none !important;
  }

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