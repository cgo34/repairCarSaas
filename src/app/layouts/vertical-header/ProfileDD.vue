<script setup lang="ts">
import { LanguageIcon, LogoutIcon, MoonIcon, UserIcon } from 'vue-tabler-icons';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/app/i18n/useLocale';
import { useCustomizerState } from '@/app/layouts/useCustomizerState';

const { toggleTheme, isDarkTheme } = useCustomizerState();
const { t } = useI18n();
const { locale, setLocale } = useLocale();

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

<style scoped>
.language-select {
  width: 140px;
}

.profile-dd {
  min-width: 260px;
}
</style>
