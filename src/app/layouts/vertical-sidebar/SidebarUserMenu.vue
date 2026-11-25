<script setup lang="ts">
import { SelectorIcon } from 'vue-tabler-icons';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import ProfileDD from '@/app/layouts/vertical-header/ProfileDD.vue';

// compact: sidebar réduite, seul l'avatar est affiché
defineProps<{ compact?: boolean }>();

const { userContext } = container.get<IAuthState>(SYMBOLS.States.AuthState);
</script>

<template>
  <v-menu
    :close-on-content-click="false"
    location="end top"
    offset="12"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        variant="text"
        rounded="lg"
        block
        :height="54"
        class="sidebar-user justify-start px-2 mb-1"
        style="background: rgba(255, 255, 255, 0.06);"
      >
        <v-avatar
          size="36"
          :class="compact ? '' : 'mr-3'"
        >
          <img
            src="@/assets/images/profile/user-round.svg"
            alt="User"
          >
        </v-avatar>

        <template v-if="!compact">
          <div class="text-left min-w-0 flex-grow-1">
            <div class="font-weight-semibold text-truncate text-body-2">
              {{ userContext?.organization.name }}
            </div>
            <div class="text-caption text-truncate sidebar-user__sub">
              {{ userContext?.firstName }} {{ userContext?.lastName }}
            </div>
          </div>
          <SelectorIcon
            size="16"
            class="ml-2 flex-shrink-0"
          />
        </template>
      </v-btn>
    </template>

    <v-sheet
      width="280"
      elevation="12"
      class="sidebar-user-menu"
    >
      <ProfileDD />
    </v-sheet>
  </v-menu>
</template>

<!-- Non scoped : le contenu du menu est téléporté hors du composant -->
<style lang="scss">
.sidebar-user-menu.v-sheet {
  background: rgb(var(--v-theme-navBg)) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px !important;

  .v-list,
  .v-list-item {
    background: transparent !important;
    color: inherit;
  }
  .v-list-item {
    border-radius: 6px !important;
  }
  .v-list-item:not(.text-error):hover {
    color: #ffffff;
  }
  .text-medium-emphasis {
    color: rgba(255, 255, 255, 0.6) !important;
  }
}
</style>

<style scoped>
.sidebar-user {
  color: #ffffff;
  text-transform: none;
  letter-spacing: normal;
}
.sidebar-user__sub {
  color: rgba(255, 255, 255, 0.6);
}
.min-w-0 {
  min-width: 0;
}
</style>
