<script setup lang="ts">
import { LogoutIcon, MoonIcon, UserIcon } from 'vue-tabler-icons';
import { useCustomizerState } from '@/app/layouts/useCustomizerState';

const { toggleTheme, isDarkTheme } = useCustomizerState();
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
          Mon compte
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
          Thème sombre
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
          Déconnexion
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.profile-dd {
  min-width: 260px;
}
</style>
