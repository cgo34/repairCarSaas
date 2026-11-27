<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <div class="mb-4">
        <div class="text-h5 font-weight-bold">
          {{ t('platformAdmin.organizations.title') }}
        </div>
        <div class="text-body-2 text-medium-emphasis">
          {{ t('platformAdmin.organizations.subtitle') }}
        </div>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ t('platformAdmin.organizations.loadError') }} : {{ error }}
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
          md="3"
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
            :placeholder="t('platformAdmin.organizations.searchPlaceholder')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="max-width: 300px;"
          />
          <v-select
            v-model="planFilter"
            :items="planFilterOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px;"
          />
          <v-switch
            v-model="hideDemo"
            class="ml-auto"
            :label="t('platformAdmin.organizations.hideDemo')"
            color="primary"
            density="compact"
            hide-details
          />
        </div>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items="filteredOrganizations"
          :loading="isLoading"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          :items-per-page-text="t('common.table.itemsPerPage')"
          :no-data-text="t('platformAdmin.organizations.empty')"
          hover
        >
          <template #item.name="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <v-avatar
                rounded="lg"
                size="36"
                color="primary"
                variant="tonal"
              >
                <v-icon size="20">
                  mdi-domain
                </v-icon>
              </v-avatar>
              <div class="font-weight-medium">
                {{ item.name }}
              </div>
            </div>
          </template>

          <template #item.planCode="{ item }">
            <v-chip
              :color="item.planCode === 'PREMIUM' ? 'primary' : 'grey'"
              size="small"
              variant="tonal"
            >
              {{ item.planCode === 'PREMIUM' ? t('platformAdmin.dashboard.plans.premium') : t('platformAdmin.dashboard.plans.free') }}
            </v-chip>
          </template>

          <template #item.isDemo="{ item }">
            <v-chip
              :color="item.isDemo ? 'success' : 'error'"
              :prepend-icon="item.isDemo ? 'mdi-check' : 'mdi-close'"
              size="small"
              variant="tonal"
              :aria-label="t('platformAdmin.organizations.demo')"
            />
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
import { usePlatformOrganizations } from '@/features/platformAdmin/composition/usePlatformOrganizations';

const { t, locale } = useI18n();
const { organizations, isLoading, error, load } = usePlatformOrganizations();

const search = ref<string | null>('');
const planFilter = ref<string>('all');
const hideDemo = ref(false);

const headers = computed(() => [
  { title: t('platformAdmin.dashboard.recent.name'), align: 'start', key: 'name' },
  { title: t('platformAdmin.dashboard.recent.plan'), key: 'planCode' },
  { title: t('platformAdmin.organizations.demo'), key: 'isDemo', align: 'center' },
  { title: t('platformAdmin.dashboard.recent.members'), key: 'membersCount', align: 'start' },
  { title: t('platformAdmin.dashboard.recent.garages'), key: 'garagesCount', align: 'start' },
  { title: t('platformAdmin.dashboard.stats.quotes'), key: 'quotesCount', align: 'start' },
  { title: t('platformAdmin.dashboard.stats.invoices'), key: 'invoicesCount', align: 'start' },
  { title: t('platformAdmin.dashboard.recent.created'), key: 'createdAt' },
] as const);

const planFilterOptions = computed(() => [
  { title: t('platformAdmin.organizations.allPlans'), value: 'all' },
  { title: t('platformAdmin.dashboard.plans.free'), value: 'FREE' },
  { title: t('platformAdmin.dashboard.plans.premium'), value: 'PREMIUM' },
]);

const filteredOrganizations = computed(() => {
  const term = (search.value ?? '').trim().toLowerCase();
  return organizations.value.filter(o => {
    if (hideDemo.value && o.isDemo) return false;
    if (planFilter.value !== 'all' && o.planCode !== planFilter.value) return false;
    return !term || o.name.toLowerCase().includes(term);
  });
});

const statCards = computed(() => {
  const list = organizations.value.filter(o => !o.isDemo);
  const premium = list.filter(o => o.planCode === 'PREMIUM').length;
  return [
    { label: t('platformAdmin.dashboard.stats.organizations'), value: list.length, icon: 'mdi-domain', color: 'primary' },
    { label: t('platformAdmin.dashboard.stats.premiumOrganizations'), value: premium, icon: 'mdi-crown-outline', color: 'warning' },
    { label: t('platformAdmin.dashboard.stats.freeOrganizations'), value: list.length - premium, icon: 'mdi-account-outline', color: 'grey' },
    { label: t('platformAdmin.dashboard.recent.members'), value: list.reduce((s, o) => s + o.membersCount, 0), icon: 'mdi-account-group-outline', color: 'success' },
  ];
});

const formatDate = (value: string | null): string =>
  value ? new Date(value).toLocaleDateString(locale.value) : '—';

onMounted(load);
</script>
