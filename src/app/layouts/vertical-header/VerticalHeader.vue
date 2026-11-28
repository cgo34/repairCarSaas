<template>
  <v-app-bar
    flat
    color="rgb(var(--v-theme-containerBg))"
    height="60"
    scroll-threshold="60"
    scroll-behavior="hide"
    class="px-6"
    style="

--v-toolbar-background: transparent;"
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

      <!-- TITRE ACCUEIL (remplace le fil d'Ariane sur le dashboard) -->
      <div
        v-if="isDashboard"
        class="ml-4 hidden-sm-and-down"
      >
        <div class="text-h6 font-weight-bold">
          Bonjour{{ userContext?.firstName ? ` ${userContext.firstName}` : '' }} 👋
        </div>
        <div class="text-caption text-medium-emphasis">
          Voici l'activité de votre organisation.
        </div>
      </div>

      <!-- BREADCRUMB -->
      <v-breadcrumbs
        v-else
        :items="breadcrumbItems"
        class="app-breadcrumb pa-0 ml-4 text-body-2 hidden-sm-and-down"
      >
        <template #divider>
          <ChevronRightIcon
            size="16"
            class="text-medium-emphasis"
          />
        </template>
      </v-breadcrumbs>
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
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { Menu2Icon, ChevronRightIcon } from 'vue-tabler-icons';
import { useI18n } from 'vue-i18n';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue';
import { useRoute } from 'vue-router';

import { useCustomizerState } from '@/app/layouts/useCustomizerState';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

const { userContext } = container.get<IAuthState>(SYMBOLS.States.AuthState);

const { toggleSidebarDrawer } = useCustomizerState();

const isScrolled = ref(false);

const route = useRoute();

const HOME_PATH = '/dashboard';
const isDashboard = computed(() => route.path === HOME_PATH);

const { t, te } = useI18n();

// Le titre d'un breadcrumb est une clé i18n ; un texte brut reste affiché tel quel
const translate = (title: string) => (te(title) ? t(title) : title);

const breadcrumbItems = computed(() => {
  const crumbs = (route.meta.breadcrumb ?? []).filter(
    (crumb) => crumb.href !== HOME_PATH
  );

  const items = [{ title: 'common.home', href: HOME_PATH, disabled: false }, ...crumbs];

  return items.map((crumb, index) => {
    const isLast = index === items.length - 1;
    const isLink = !isLast && !crumb.disabled && crumb.href && crumb.href !== '#';

    return {
      title: translate(crumb.title),
      to: isLink ? crumb.href : undefined,
      disabled: !isLink,
      // Dernier élément (page courante) en gras
      class: isLast ? 'breadcrumb-current' : ''
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
<style scoped>
.app-breadcrumb :deep(.v-breadcrumbs-item--disabled) {
  opacity: 1;
}

.app-breadcrumb :deep(.breadcrumb-current) {
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

.app-breadcrumb :deep(.v-breadcrumbs-item:not(.breadcrumb-current)) {
  color: rgb(var(--v-theme-on-surface), 0.7);
}

.app-breadcrumb :deep(.v-breadcrumbs-divider) {
  padding: 0 6px;
}
</style>
