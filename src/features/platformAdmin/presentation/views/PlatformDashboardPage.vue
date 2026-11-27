<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  BuildingCommunityIcon,
  UsersIcon,
  UserOffIcon,
  UserPlusIcon,
  TrendingUpIcon,
  CrownIcon,
  CurrencyEuroIcon,
  FileTextIcon,
  FileInvoiceIcon,
} from 'vue-tabler-icons';
import MainLayout from '@/app/layouts/MainLayout.vue';
import DashboardStatCard from '@/features/dashboard/presentation/components/DashboardStatCard.vue';
import { usePlatformDashboard } from '@/features/platformAdmin/composition/usePlatformDashboard';
import { useProfileSwitcher } from '@/features/profileSwitcher/composition/useProfileSwitcher';
import type { DemoProfileDto } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

const { t, n } = useI18n();
const state = usePlatformDashboard();
const { stats, isLoading, error } = state;
const switcher = useProfileSwitcher();

const hideDemo = ref(false);
const visibleRecentOrganizations = computed(() =>
  (stats.value?.recentOrganizations ?? []).filter(o => !(hideDemo.value && o.isDemo)).slice(0, 5));

const mrr = computed(() =>
  stats.value ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(stats.value.mrrCents / 100) : '',
);

const demoOrganizations = computed(() => {
  const map = new Map<string, { id: string; name: string; plan: string | null; profiles: DemoProfileDto[] }>();
  for (const p of switcher.profiles.value) {
    const entry = map.get(p.organizationId) ?? { id: p.organizationId, name: p.organizationName, plan: p.planCode, profiles: [] };
    entry.profiles.push(p);
    map.set(p.organizationId, entry);
  }
  return [...map.values()];
});

const freePercent = computed(() => {
  const total = stats.value?.organizationsTotal ?? 0;
  return total ? Math.round(((stats.value?.freeOrganizations ?? 0) / total) * 100) : 0;
});

const maxSignups = computed(() => Math.max(1, ...(stats.value?.signups6m.map((s) => s.count) ?? [])));

const alerts = computed(() => {
  if (!stats.value) return [];
  const list: { key: string; color: string; text: string }[] = [];
  if (stats.value.blockedUsers) {
    list.push({ key: 'blocked', color: 'error', text: t('platformAdmin.dashboard.alerts.blockedUsers', stats.value.blockedUsers) });
  }
  if (stats.value.nearQuotaOrganizations) {
    list.push({ key: 'quota', color: 'warning', text: t('platformAdmin.dashboard.alerts.nearQuota', stats.value.nearQuotaOrganizations) });
  }
  if (stats.value.expiringSubscriptions) {
    list.push({ key: 'expiring', color: 'warning', text: t('platformAdmin.dashboard.alerts.expiring', stats.value.expiringSubscriptions) });
  }
  return list;
});

onMounted(() => {
  state.load();
  switcher.load();
});

async function enter(profile: DemoProfileDto) {
  if (await switcher.switchTo(profile.profileId)) {
    // Full reload so every module-scoped state restarts on the new organization
    window.location.assign('/');
  }
}
</script>

<template>
  <MainLayout>
    <div class="mb-4">
      <h2 class="text-h3">
        {{ t('platformAdmin.dashboard.title') }}
      </h2>
      <p class="text-medium-emphasis">
        {{ t('platformAdmin.dashboard.subtitle') }}
      </p>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      :text="`${t('platformAdmin.dashboard.loadError')}: ${error}`"
    />

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      class="mb-4"
    />

    <template v-if="stats">
      <v-row>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.organizations')"
            :value="stats.organizationsTotal"
            :icon="BuildingCommunityIcon"
            color="primary"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.premiumOrganizations')"
            :value="stats.premiumOrganizations"
            :icon="CrownIcon"
            color="warning"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.newOrganizations')"
            :value="stats.newOrganizations30d"
            :icon="TrendingUpIcon"
            color="success"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.users')"
            :value="stats.usersTotal"
            :icon="UsersIcon"
            color="secondary"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.newUsers')"
            :value="stats.newUsers30d"
            :icon="UserPlusIcon"
            color="success"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.blockedUsers')"
            :value="stats.blockedUsers"
            :icon="UserOffIcon"
            color="error"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.mrr')"
            :value="mrr"
            :icon="CurrencyEuroIcon"
            color="primary"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.quotes')"
            :value="stats.quotesTotal"
            :icon="FileTextIcon"
            color="success"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          lg="4"
        >
          <DashboardStatCard
            :title="t('platformAdmin.dashboard.stats.invoices')"
            :value="stats.invoicesTotal"
            :icon="FileInvoiceIcon"
            color="warning"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-card
            elevation="0"
            class="h-100"
          >
            <div class="d-flex align-center justify-space-between pa-4 pb-2">
              <v-card-title class="pa-0">
                {{ t('platformAdmin.dashboard.recent.title') }}
              </v-card-title>
              <v-switch
                v-model="hideDemo"
                :label="t('platformAdmin.organizations.hideDemo')"
                color="primary"
                density="compact"
                hide-details
              />
            </div>
            <v-table
              v-if="visibleRecentOrganizations.length"
              class="px-4 pb-2"
            >
              <thead>
                <tr>
                  <th>{{ t('platformAdmin.dashboard.recent.name') }}</th>
                  <th>{{ t('platformAdmin.dashboard.recent.plan') }}</th>
                  <th class="text-center">
                    {{ t('platformAdmin.organizations.demo') }}
                  </th>
                  <th>
                    {{ t('platformAdmin.dashboard.recent.members') }}
                  </th>
                  <th>
                    {{ t('platformAdmin.dashboard.recent.garages') }}
                  </th>
                  <th>{{ t('platformAdmin.dashboard.recent.created') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="org in visibleRecentOrganizations"
                  :key="org.id"
                >
                  <td>{{ org.name }}</td>
                  <td>
                    <v-chip
                      v-if="org.plan"
                      size="small"
                      label
                      :color="org.plan === 'PREMIUM' ? 'warning' : 'default'"
                    >
                      {{ org.plan }}
                    </v-chip>
                  </td>
                  <td class="text-center">
                    <v-avatar
                      :color="org.isDemo ? 'success' : 'error'"
                      size="28"
                      variant="tonal"
                      :aria-label="t('platformAdmin.organizations.demo')"
                    >
                      <v-icon
                        :icon="org.isDemo ? 'mdi-check' : 'mdi-close'"
                        size="18"
                      />
                    </v-avatar>
                  </td>
                  <td>
                    {{ n(org.membersCount) }}
                  </td>
                  <td>
                    {{ n(org.garagesCount) }}
                  </td>
                  <td>{{ org.createdAt ? new Date(org.createdAt).toLocaleDateString() : '' }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-card-text
              v-else
              class="text-medium-emphasis"
            >
              {{ t('platformAdmin.dashboard.recent.empty') }}
            </v-card-text>
            <div class="d-flex justify-end px-4 pb-3">
              <v-btn
                variant="text"
                color="primary"
                size="small"
                to="/platform/organizations"
              >
                {{ t('platformAdmin.dashboard.recent.viewAll') }}
              </v-btn>
            </div>
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="h-100"
          >
            <v-card-title class="pa-4 pb-2">
              {{ t('platformAdmin.dashboard.demo.title') }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-sheet
                v-for="org in demoOrganizations"
                :key="org.id"
                border
                rounded="lg"
                class="pa-4 mb-3"
              >
                <div class="d-flex align-center justify-space-between mb-3">
                  <strong>{{ org.name }}</strong>
                  <v-chip
                    v-if="org.plan"
                    size="small"
                    label
                    :color="org.plan === 'PREMIUM' ? 'warning' : 'default'"
                  >
                    {{ t(`profileSwitcher.plan.${org.plan}`, org.plan) }}
                  </v-chip>
                </div>
                <div class="d-flex flex-wrap ga-3">
                  <v-btn
                    v-for="profile in org.profiles"
                    :key="profile.profileId"
                    size="small"
                    variant="flat"
                    color="primary"
                    :disabled="switcher.isLoading.value"
                    @click="enter(profile)"
                  >
                    {{ t(`profileSwitcher.roles.${profile.role}`) }}
                  </v-btn>
                </div>
              </v-sheet>
              <span
                v-if="!demoOrganizations.length && !switcher.isLoading.value"
                class="text-medium-emphasis"
              >
                {{ t('platformAdmin.dashboard.demo.empty') }}
              </span>
              <p
                v-else
                class="text-caption text-medium-emphasis mt-2"
              >
                {{ t('platformAdmin.dashboard.demo.hint') }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="h-100"
          >
            <v-card-title class="pa-4 pb-2">
              {{ t('platformAdmin.dashboard.plans.title') }}
            </v-card-title>
            <v-card-text class="pa-4">
              <v-progress-linear
                :model-value="100 - freePercent"
                color="warning"
                bg-color="primary"
                height="10"
                rounded
                class="mb-3"
              />
              <div class="d-flex justify-space-between text-body-2">
                <span>{{ t('platformAdmin.dashboard.plans.free') }} · {{ stats.freeOrganizations }} ({{ freePercent }} %)</span>
                <span>{{ t('platformAdmin.dashboard.plans.premium') }} · {{ stats.premiumOrganizations }} ({{ 100 - freePercent }} %)</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="h-100"
          >
            <v-card-title class="pa-4 pb-2">
              {{ t('platformAdmin.dashboard.signups.title') }}
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                class="d-flex align-end ga-2"
                style="height: 90px"
              >
                <div
                  v-for="(s, i) in stats.signups6m"
                  :key="s.month"
                  class="flex-grow-1 rounded-t"
                  :class="i === stats.signups6m.length - 1 ? 'bg-primary' : 'bg-lightprimary'"
                  :style="{ height: `${Math.max(4, (s.count / maxSignups) * 100)}%` }"
                  :title="`${s.month} : ${s.count}`"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="h-100"
          >
            <v-card-title class="pa-4 pb-2">
              {{ t('platformAdmin.dashboard.alerts.title') }}
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                v-for="a in alerts"
                :key="a.key"
                class="d-flex align-center ga-3 py-2"
              >
                <span
                  class="rounded-circle flex-shrink-0"
                  :class="`bg-${a.color}`"
                  style="width: 10px; height: 10px"
                />
                <span class="text-body-2">{{ a.text }}</span>
              </div>
              <span
                v-if="!alerts.length"
                class="text-medium-emphasis"
              >
                {{ t('platformAdmin.dashboard.alerts.none') }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </MainLayout>
</template>
