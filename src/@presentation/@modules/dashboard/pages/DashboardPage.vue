<template>
  <MainLayout>
    <v-container>
      <v-row>
        <!-- Total Utilisateurs -->
        <v-col
          cols="12"
          sm="6"
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
          sm="6"
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
import { useAdminDashboardState } from '@/@presentation/@modules/dashboard/composables/useAdminDashboardState';
import DashboardStatCard from '@/@presentation/@ui/components/DashboardStatCard.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { onMounted } from 'vue';

// Icons
// import { BuildingStoreIcon, UserIcon } from 'lucide-vue-next';

// Récupération des statistiques du dashboard
const { totalUsers, totalGarages, fetchDashboardStats, loading } = useAdminDashboardState();

// Chargement des données au montage du composant
onMounted(async () => {
  await fetchDashboardStats();
});
</script>
