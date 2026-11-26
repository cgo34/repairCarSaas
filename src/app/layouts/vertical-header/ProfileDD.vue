<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { CheckIcon, ChevronRightIcon, LanguageIcon, LogoutIcon, MoonIcon, UserIcon, UsersIcon } from 'vue-tabler-icons';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/app/i18n/useLocale';
import { useCustomizerState } from '@/app/layouts/useCustomizerState';
import { useAuthState } from '@/features/auth/composition/useAuthState';
import { useProfileSwitcher } from '@/features/profileSwitcher/composition/useProfileSwitcher';
import type { DemoProfileDto } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

const { toggleTheme, isDarkTheme } = useCustomizerState();
const { userContext } = useAuthState();
const isSuperAdmin = computed(() => userContext.value?.platformRole === 'super_admin');
const { t } = useI18n();
const { locale, setLocale } = useLocale();
const switcher = useProfileSwitcher();

const organizations = computed(() => {
  const map = new Map<string, { id: string; name: string; profiles: DemoProfileDto[] }>();
  for (const p of switcher.profiles.value) {
    const entry = map.get(p.organizationId) ?? { id: p.organizationId, name: p.organizationName, profiles: [] };
    entry.profiles.push(p);
    map.set(p.organizationId, entry);
  }
  return [...map.values()];
});

function isCurrent(profile: DemoProfileDto): boolean {
  const ctx = userContext.value;
  return !!ctx && !ctx.isGlobalContext
    && ctx.organization.id === profile.organizationId
    && ctx.membership.role === profile.role;
}

const currentProfileLabel = computed(() => {
  const ctx = userContext.value;
  if (!ctx) return '';
  if (ctx.isGlobalContext) return t('profileSwitcher.actions.backToGlobal');
  return `${ctx.organization.name} · ${t(`profileSwitcher.roles.${ctx.membership.role}`)}`;
});

onMounted(() => {
  if (isSuperAdmin.value) switcher.load();
});

async function enter(profile: DemoProfileDto) {
  if (isCurrent(profile)) return;
  // Full reload so every module-scoped state restarts on the new organization
  if (await switcher.switchTo(profile.profileId)) window.location.assign('/');
}

async function goGlobal() {
  if (await switcher.clear()) window.location.assign('/admin/profiles');
}

// Native names, so a user can always find their language.
const languages = [
  { title: 'Français', value: 'fr' },
  { title: 'English', value: 'en' },
] as const;
</script>

<template>
  <div class="profile-dd pa-2">
    <v-list
      density="comfortable"
      class="pa-0 bg-transparent"
    >
      <v-list-item
        rounded="md"
        :to="'/profile'"
      >
        <template #prepend>
          <UserIcon
            size="18"
            class="mr-3 text-medium-emphasis"
          />
        </template>
        <v-list-item-title class="text-body-2">
          {{ t('common.menu.account') }}
        </v-list-item-title>
      </v-list-item>

      <v-menu
        v-if="isSuperAdmin"
        open-on-hover
        location="end top"
        :close-on-content-click="false"
        offset="8"
      >
        <template #activator="{ props: menuProps }">
          <v-list-item
            v-bind="menuProps"
            rounded="md"
          >
            <template #prepend>
              <UsersIcon
                size="18"
                class="mr-3 text-medium-emphasis"
              />
            </template>
            <v-list-item-title class="text-body-2">
              {{ t('common.menu.demoProfiles') }}
            </v-list-item-title>
            <v-list-item-subtitle
              v-if="currentProfileLabel"
              class="text-caption"
            >
              {{ currentProfileLabel }}
            </v-list-item-subtitle>
            <template #append>
              <ChevronRightIcon
                size="16"
                class="text-medium-emphasis"
              />
            </template>
          </v-list-item>
        </template>

        <v-sheet
          width="260"
          elevation="12"
          class="sidebar-user-menu pa-2"
        >
          <v-progress-linear
            v-if="switcher.isLoading.value"
            indeterminate
            class="mb-1"
          />
          <v-list
            density="comfortable"
            class="pa-0 bg-transparent"
          >
            <v-list-item
              rounded="md"
              :active="!!userContext?.isGlobalContext"
              :disabled="switcher.isLoading.value"
              @click="goGlobal"
            >
              <v-list-item-title class="text-body-2">
                {{ t('profileSwitcher.actions.backToGlobal') }}
              </v-list-item-title>
            </v-list-item>

            <template
              v-for="org in organizations"
              :key="org.id"
            >
              <v-divider class="my-1" />
              <v-list-subheader class="text-caption font-weight-bold text-uppercase org-subheader">
                {{ org.name }}
              </v-list-subheader>
              <v-list-item
                v-for="profile in org.profiles"
                :key="profile.profileId"
                rounded="md"
                :active="isCurrent(profile)"
                :disabled="switcher.isLoading.value"
                @click="enter(profile)"
              >
                <v-list-item-title class="text-body-2">
                  {{ t(`profileSwitcher.roles.${profile.role}`) }}
                </v-list-item-title>
                <template #append>
                  <CheckIcon
                    v-if="isCurrent(profile)"
                    size="16"
                  />
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-sheet>
      </v-menu>

      <!-- Thème clair / sombre -->
      <v-list-item
        rounded="md"
        @click="toggleTheme"
      >
        <template #prepend>
          <MoonIcon
            size="18"
            class="mr-3 text-medium-emphasis"
          />
        </template>
        <v-list-item-title class="text-body-2">
          {{ t('common.menu.darkTheme') }}
        </v-list-item-title>
        <template #append>
          <v-switch
            :model-value="isDarkTheme"
            color="primary"
            density="compact"
            hide-details
            inset
            readonly
            class="ml-4"
          />
        </template>
      </v-list-item>

      <!-- Langue -->
      <v-list-item rounded="md">
        <template #prepend>
          <LanguageIcon
            size="18"
            class="mr-3 text-medium-emphasis"
          />
        </template>
        <v-list-item-title class="text-body-2">
          {{ t('common.menu.language') }}
        </v-list-item-title>
        <template #append>
          <v-select
            :model-value="locale"
            :items="languages"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details
            class="ml-4 language-select"
            @update:model-value="setLocale"
          />
        </template>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item
        rounded="md"
        color="error"
        class="text-error"
        :to="'/logout'"
      >
        <template #prepend>
          <LogoutIcon
            size="18"
            class="mr-3"
          />
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ t('common.menu.logout') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<style>
.org-subheader.v-list-subheader {
  color: rgba(255, 255, 255, 0.85) !important;
  opacity: 1;
}
</style>

<style scoped>
.language-select {
  width: 140px;
}

.profile-dd {
  min-width: 260px;
}
</style>
