<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <div class="mb-4">
        <div class="text-h5 font-weight-bold">
          {{ t('platformAdmin.users.title') }}
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{ t('platformAdmin.users.subtitle') }}
        </div>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ t('platformAdmin.users.loadError') }} : {{ error }}
      </v-alert>

      <v-row
        dense
        class="mb-4"
      >
        <v-col
          v-for="stat in statCards"
          :key="stat.label"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            variant="flat"
            class="bg-surface border pa-4 d-flex align-center ga-3"
          >
            <v-avatar
              rounded="lg"
              size="40"
              :color="stat.color"
              variant="tonal"
            >
              <v-icon size="20">
                {{ stat.icon }}
              </v-icon>
            </v-avatar>
            <div>
              <div
                class="stat-value"
                :class="`text-${stat.color}`"
              >
                {{ stat.value }}
              </div>
              <div class="stat-sub">
                {{ stat.label }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card
        variant="flat"
        class="bg-surface border"
      >
        <div class="pa-4 d-flex flex-wrap ga-3">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :placeholder="t('platformAdmin.users.searchPlaceholder')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="max-width: 300px;"
          />
          <v-select
            v-model="statusFilter"
            :items="statusFilterOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px;"
          />
        </div>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="isLoading"
          :sort-by="[{ key: 'fullName', order: 'asc' }]"
          :items-per-page-text="t('common.table.itemsPerPage')"
          :no-data-text="t('platformAdmin.users.empty')"
          hover
        >
          <template #item.fullName="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <v-avatar
                rounded="lg"
                size="36"
                color="primary"
                variant="tonal"
              >
                <v-icon size="20">
                  mdi-account-outline
                </v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">
                  {{ item.fullName || '—' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.email }}
                </div>
              </div>
            </div>
          </template>

          <template #item.isBlocked="{ item }">
            <v-chip
              :color="item.isBlocked ? 'error' : 'success'"
              size="small"
              variant="tonal"
            >
              {{ item.isBlocked ? t('platformAdmin.users.blocked') : t('platformAdmin.users.active') }}
            </v-chip>
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { usePlatformUsers } from '@/features/platformAdmin/composition/usePlatformUsers';

const { t, locale } = useI18n();
const { users, isLoading, error, load } = usePlatformUsers();

const search = ref<string | null>('');
const statusFilter = ref<string>('all');

const headers = computed(() => [
  { title: t('platformAdmin.users.user'), align: 'start', key: 'fullName' },
  { title: t('platformAdmin.users.organization'), key: 'organizationName' },
  { title: t('platformAdmin.users.role'), key: 'role' },
  { title: t('platformAdmin.users.status'), key: 'isBlocked' },
  { title: t('platformAdmin.users.createdAt'), key: 'createdAt' },
] as const);

const statusFilterOptions = computed(() => [
  { title: t('platformAdmin.users.allStatuses'), value: 'all' },
  { title: t('platformAdmin.users.active'), value: 'active' },
  { title: t('platformAdmin.users.blocked'), value: 'blocked' },
]);

const filteredUsers = computed(() => {
  const term = (search.value ?? '').trim().toLowerCase();
  return users.value.filter(u => {
    if (statusFilter.value === 'active' && u.isBlocked) return false;
    if (statusFilter.value === 'blocked' && !u.isBlocked) return false;
    return !term || `${u.fullName ?? ''} ${u.email} ${u.organizationName}`.toLowerCase().includes(term);
  });
});

const statCards = computed(() => {
  const list = users.value;
  const blocked = list.filter(u => u.isBlocked).length;
  return [
    { label: t('platformAdmin.dashboard.stats.users'), value: list.length, icon: 'mdi-account-group-outline', color: 'primary' },
    { label: t('platformAdmin.users.active'), value: list.length - blocked, icon: 'mdi-check-circle-outline', color: 'success' },
    { label: t('platformAdmin.dashboard.stats.blockedUsers'), value: blocked, icon: 'mdi-account-lock-outline', color: 'error' },
  ];
});

const formatDate = (value: string | null): string =>
  value ? new Date(value).toLocaleDateString(locale.value) : '—';

onMounted(load);
</script>
