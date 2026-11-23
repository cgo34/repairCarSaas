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

      <!-- BREADCRUMB -->
      <v-breadcrumbs
        :items="breadcrumbItems"
        class="pa-0 ml-4 text-body-2 hidden-sm-and-down"
      />
    </div>

    <v-spacer />

    <!-- RIGHT -->
    <div class="d-flex align-center ga-3">
      <!-- HELP (masqué) -->
      <!-- <v-btn
        class="text-primary hidden-sm-and-down"
        rounded="lg"
        variant="tonal"
      >
        Besoin d'aide ?
      </v-btn> -->

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

      <!-- NOTIFICATIONS (masqué) -->
      <!-- <v-menu :close-on-content-click="false">
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
      </v-menu> -->

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
                {{ userContext?.organization.name }}
              </div>

              <div class="text-caption text-medium-emphasis">
                {{ userContext?.firstName }} {{ userContext?.lastName }}
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
  Menu2Icon,
  MoonIcon,
  SunIcon
} from 'vue-tabler-icons';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue';
import { useRoute } from 'vue-router';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';

import { useCustomizerState } from '@/app/layouts/useCustomizerState';

import ProfileDD from './ProfileDD.vue';

import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

const authState = container.get<IAuthState>(
  SYMBOLS.States.AuthState
);

const { userContext } = authState;

const {
  toggleSidebarDrawer,
  toggleTheme,
  isDarkTheme
} = useCustomizerState();

const isScrolled = ref(false);

const route = useRoute();

const HOME_PATH = '/dashboard';

const breadcrumbItems = computed(() => {
  const crumbs = (route.meta.breadcrumb ?? []).filter(
    (crumb) => crumb.href !== HOME_PATH
  );

  const items = [{ title: 'Accueil', href: HOME_PATH, disabled: false }, ...crumbs];

  return items.map((crumb, index) => {
    const isLast = index === items.length - 1;
    const isLink = !isLast && !crumb.disabled && crumb.href && crumb.href !== '#';

    return {
      title: crumb.title,
      to: isLink ? crumb.href : undefined,
      disabled: !isLink
    };
  });
});

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