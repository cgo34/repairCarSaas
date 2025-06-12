<template>
  <MainLayout>
    <v-container>
      <v-row>
        <!-- Total Utilisateurs -->
        <v-col
          cols="12"
          sm="4"
        >
          <DashboardStatCard
            title="Abonnement"
            :value="loading ? '...' : subscription.subscriptionPlan.name"
            icon="UserIcon"
            color="primary"
          />
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <DashboardStatCard
            title="Total Utilisateurs"
            :value="loading ? '...' : totalUsers"
            icon="UserIcon"
            color="primary"
          />
        </v-col>

        <!-- Total Garages -->
        <v-col
          cols="12"
          sm="4"
        >
          <DashboardStatCard
            title="Total Garages"
            :value="loading ? '...' : totalGarages"
            icon="BuildingStoreIcon"
            color="warning"
          />
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { useAdminDashboardState } from '@/@presentation/@modules/dashboard/composables/useAdminDashboardState';
import DashboardStatCard from '@/@presentation/@ui/components/DashboardStatCard.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { onMounted } from 'vue';


const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { user, subscription } = authState

// Récupération des statistiques du dashboard
const { totalUsers, totalGarages, fetchDashboardStats, loading } = useAdminDashboardState();

// Chargement des données au montage du composant
onMounted(async () => {
  console.log('user auth', user.value, subscription.value)
  await fetchDashboardStats();
});
</script>
