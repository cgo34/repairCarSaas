<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { BuildingIcon, LogoutIcon, SettingsIcon, UserIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { user } = authState;
const router = useRouter();

const roleFr = (role?: string) => ({
  admin: 'Administrateur',
  technician: 'Technicien',
  garage: 'Garage',
  independant_technician: 'Technicien indépendant',
  user: 'Utilisateur',
} as Record<string, string>)[role ?? ''] ?? role ?? '';

const initials = (name?: string) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
};
</script>

<template>
  <div class="profile-dd pa-4">

    <!-- Avatar + infos utilisateur -->
    <div class="d-flex align-center gap-3 mb-4">
      <v-avatar color="primary" size="44">
        <span class="text-body-1 font-weight-bold text-white">{{ initials(user?.fullName) }}</span>
      </v-avatar>
      <div class="min-w-0">
        <div class="text-subtitle-1 font-weight-semibold text-truncate">{{ user?.fullName }}</div>
        <v-chip size="x-small" color="primary" variant="tonal" class="mt-1">
          {{ roleFr(user?.role) }}
        </v-chip>
      </div>
    </div>

    <v-divider class="mb-3" />

    <!-- Actions -->
    <v-list density="compact" class="pa-0">
      <v-list-item
        rounded="lg"
        color="primary"
        :to="'/profile'"
      >
        <template #prepend>
          <UserIcon size="18" class="mr-3 text-medium-emphasis" />
        </template>
        <v-list-item-title class="text-body-2">Mon profil</v-list-item-title>
      </v-list-item>

      <v-list-item
        rounded="lg"
        color="primary"
        :to="'/account-settings'"
      >
        <template #prepend>
          <SettingsIcon size="18" class="mr-3 text-medium-emphasis" />
        </template>
        <v-list-item-title class="text-body-2">Paramètres entreprise</v-list-item-title>
      </v-list-item>

      <v-list-item
        rounded="lg"
        color="primary"
        :to="'/garages'"
      >
        <template #prepend>
          <BuildingIcon size="18" class="mr-3 text-medium-emphasis" />
        </template>
        <v-list-item-title class="text-body-2">Mes garages</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item
        rounded="lg"
        color="error"
        class="text-error"
        :to="'/logout'"
      >
        <template #prepend>
          <LogoutIcon size="18" class="mr-3" />
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">Déconnexion</v-list-item-title>
      </v-list-item>
    </v-list>

  </div>
</template>

<style scoped>
.profile-dd {
  min-width: 240px;
}
.min-w-0 {
  min-width: 0;
}
</style>
