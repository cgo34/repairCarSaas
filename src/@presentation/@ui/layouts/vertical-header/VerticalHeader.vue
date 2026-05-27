<template>
  <v-app-bar
    flat
    color="rgb(var(--v-theme-containerBg))"
    height="70"
    scroll-threshold="70"
    scroll-behavior="hide"
    class="px-6"
    style="--v-toolbar-background: transparent;"
  >
    <!-- LEFT -->
    <div class="d-flex align-center">
      <!-- DESKTOP -->
      <v-btn
        class="hidden-md-and-down text-primary"
        color="lightprimary"
        icon
        rounded="sm"
        variant="flat"
        size="small"
        @click.stop="setMiniSidebar(!miniSidebar)"
      >
        <Menu2Icon
          size="20"
          stroke-width="1.5"
        />
      </v-btn>

      <!-- MOBILE -->
      <v-btn
        class="hidden-lg-and-up text-primary"
        color="lightprimary"
        icon
        rounded="sm"
        variant="flat"
        size="small"
        @click.stop="toggleSidebarDrawer"
      >
        <Menu2Icon
          size="20"
          stroke-width="1.5"
        />
      </v-btn>
    </div>

    <v-spacer />

    <!-- RIGHT -->
    <div class="d-flex align-center ga-3">
      <!-- HELP -->
      <v-btn
        class="text-primary"
        color="lightprimary"
        rounded="lg"
        variant="tonal"
      >
        Besoin d'aide ?
      </v-btn>

      <!-- THEME -->
      <v-btn
        icon
        class="text-primary"
        color="lightprimary"
        rounded="sm"
        size="small"
        variant="flat"
        :title="isDarkTheme ? 'Passer en mode clair' : 'Passer en mode sombre'"
        @click="toggleTheme"
      >
        <MoonIcon
          v-if="!isDarkTheme"
          size="20"
          stroke-width="1.5"
        />

        <SunIcon
          v-else
          size="20"
          stroke-width="1.5"
        />
      </v-btn>

      <!-- NOTIFICATIONS -->
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            icon
            class="text-primary"
            color="lightprimary"
            rounded="sm"
            size="small"
            variant="flat"
            v-bind="props"
          >
            <BellIcon
              stroke-width="1.5"
              size="22"
            />
          </v-btn>
        </template>

        <v-sheet
          rounded="xl"
          width="330"
          elevation="12"
        >
          <NotificationDD />
        </v-sheet>
      </v-menu>

      <!-- PROFILE -->
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            variant="text"
            rounded="pill"
            height="54"
            v-bind="props"
          >
            <v-avatar
              size="36"
              class="mr-3"
            >
              <img
                src="@/assets/images/profile/user-round.svg"
                alt="User"
              >
            </v-avatar>

            <div class="text-left">
              <div class="font-weight-semibold">
                Thomas Martin
              </div>

              <div class="text-caption text-medium-emphasis">
                Garage du Centre
              </div>
            </div>
          </v-btn>
        </template>

        <v-sheet
          rounded="xl"
          width="330"
          elevation="12"
        >
          <ProfileDD />
        </v-sheet>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import {
  BellIcon,
  Menu2Icon,
  MoonIcon,
  SunIcon
} from 'vue-tabler-icons';

import {
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue';

import { useCustomizerState } from '@/@presentation/composables/useCustomizerState';

import NotificationDD from './NotificationDD.vue';
import ProfileDD from './ProfileDD.vue';

const {
  miniSidebar,
  toggleSidebarDrawer,
  setMiniSidebar,
  toggleTheme,
  isDarkTheme
} = useCustomizerState();

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 8;
};

onMounted(() => {
  handleScroll();

  window.addEventListener(
    'scroll',
    handleScroll,
    { passive: true }
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    'scroll',
    handleScroll
  );
});
</script>