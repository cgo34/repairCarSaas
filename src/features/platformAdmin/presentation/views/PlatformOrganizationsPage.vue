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
            <v-avatar
              :color="item.isDemo ? 'success' : 'error'"
              size="28"
              variant="tonal"
              :aria-label="t('platformAdmin.organizations.demo')"
            >
              <v-icon
                :icon="item.isDemo ? 'mdi-check' : 'mdi-close'"
                size="18"
              />
            </v-avatar>
          </template>

          <template #item.membersCount="{ item }">
            <span :class="usageClass(item, 'members')">{{ usageText(item, 'members') }}</span>
          </template>

          <template #item.garagesCount="{ item }">
            <span :class="usageClass(item, 'garages')">{{ usageText(item, 'garages') }}</span>
          </template>

          <template #item.quotesCount="{ item }">
            <span :class="usageClass(item, 'quotes')">{{ usageText(item, 'quotes') }}</span>
            <span
              v-if="item.planCode === 'FREE'"
              class="text-caption text-medium-emphasis ml-1"
            >({{ t('platformAdmin.organizations.totalShort', { n: item.quotesCount }) }})</span>
          </template>

          <template #item.invoicesCount="{ item }">
            <span :class="usageClass(item, 'invoices')">{{ usageText(item, 'invoices') }}</span>
            <span
              v-if="item.planCode === 'FREE'"
              class="text-caption text-medium-emphasis ml-1"
            >({{ t('platformAdmin.organizations.totalShort', { n: item.invoicesCount }) }})</span>
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template #item.actions="{ item }">
            <v-menu>
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  :aria-label="t('platformAdmin.organizations.actions')"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-crown-outline"
                  :title="t('platformAdmin.organizations.grantPremium.menu')"
                  @click="openGrantDialog(item)"
                />
                <v-list-item
                  prepend-icon="mdi-gift-outline"
                  :title="t('platformAdmin.organizations.grantFeature.menu')"
                  @click="openFeatureDialog(item)"
                />
                <v-list-item
                  :prepend-icon="item.isDemo ? 'mdi-flask-off-outline' : 'mdi-flask-outline'"
                  :title="t(item.isDemo ? 'platformAdmin.organizations.demoToggle.unmark' : 'platformAdmin.organizations.demoToggle.mark')"
                  @click="toggleDemo(item)"
                />
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog
        v-model="grantDialog"
        max-width="420"
      >
        <v-card>
          <v-card-title>{{ t('platformAdmin.organizations.grantPremium.title') }}</v-card-title>
          <v-card-text>
            <p class="mb-2">
              {{ t('platformAdmin.organizations.grantPremium.description', { name: grantTarget?.name ?? '' }) }}
            </p>
            <v-radio-group
              v-model="grantDuration"
              hide-details
            >
              <v-radio
                v-for="duration in PREMIUM_GRANT_DURATIONS"
                :key="duration"
                :label="t(`platformAdmin.organizations.grantPremium.durations.${duration}`)"
                :value="duration"
              />
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              :disabled="isGranting"
              @click="grantDialog = false"
            >
              {{ t('platformAdmin.organizations.grantPremium.cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :loading="isGranting"
              @click="confirmGrant"
            >
              {{ t('platformAdmin.organizations.grantPremium.confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="featureDialog"
        max-width="420"
      >
        <v-card>
          <v-card-title>{{ t('platformAdmin.organizations.grantFeature.title') }}</v-card-title>
          <v-card-text>
            <p class="mb-4">
              {{ t('platformAdmin.organizations.grantFeature.description', { name: featureTarget?.name ?? '' }) }}
            </p>
            <v-select
              v-model="featureKey"
              :items="featureItems"
              :label="t('platformAdmin.organizations.grantFeature.feature')"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-4"
            />
            <div class="text-subtitle-2">
              {{ t('platformAdmin.organizations.grantFeature.duration') }}
            </div>
            <v-radio-group
              v-model="featureDuration"
              hide-details
            >
              <v-radio
                v-for="duration in FEATURE_GRANT_DURATIONS"
                :key="duration"
                :label="t(`platformAdmin.organizations.grantFeature.durations.${duration}`)"
                :value="duration"
              />
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              variant="text"
              :disabled="isGrantingFeature"
              @click="featureDialog = false"
            >
              {{ t('platformAdmin.organizations.grantFeature.cancel') }}
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              :loading="isGrantingFeature"
              @click="confirmFeatureGrant"
            >
              {{ t('platformAdmin.organizations.grantFeature.confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="snackbar"
        color="success"
        :timeout="3000"
      >
        {{ snackbarText }}
      </v-snackbar>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { usePlatformOrganizations } from '@/features/platformAdmin/composition/usePlatformOrganizations';
import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';
import { FEATURE_GRANT_DURATIONS, GRANTABLE_FEATURES, type FeatureGrantDuration, type GrantableFeature } from '@/features/platformAdmin/application/dtos/FeatureGrant';
import { PREMIUM_GRANT_DURATIONS, type PremiumGrantDuration } from '@/features/platformAdmin/application/dtos/PremiumGrantDuration';

const { t, locale } = useI18n();
const { organizations, isLoading, error, load, grantPremium, grantFeature, setDemo } = usePlatformOrganizations();

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
  { title: t('platformAdmin.organizations.actions'), key: 'actions', sortable: false, align: 'end' },
] as const);

type UsageKey = 'members' | 'garages' | 'quotes' | 'invoices';

// Free plan: show usage against the plan limit. Quotes/invoices limits are monthly, so the current month is used.
function usageValues(org: PlatformOrganizationDto, key: UsageKey): { count: number; limit: number | null } {
  switch (key) {
    case 'members': return { count: org.membersCount, limit: org.membersLimit };
    case 'garages': return { count: org.garagesCount, limit: org.garagesLimit };
    case 'quotes': return { count: org.quotesMonthCount, limit: org.quotesLimit };
    case 'invoices': return { count: org.invoicesMonthCount, limit: org.invoicesLimit };
  }
}

const totalCount = (org: PlatformOrganizationDto, key: UsageKey): number =>
  ({ members: org.membersCount, garages: org.garagesCount, quotes: org.quotesCount, invoices: org.invoicesCount })[key];

function usageText(org: PlatformOrganizationDto, key: UsageKey): string {
  if (org.planCode !== 'FREE') return String(totalCount(org, key));
  const { count, limit } = usageValues(org, key);
  return limit === null ? String(totalCount(org, key)) : `${count}/${limit}`;
}

function usageClass(org: PlatformOrganizationDto, key: UsageKey): string {
  if (org.planCode !== 'FREE') return '';
  const { count, limit } = usageValues(org, key);
  return limit !== null && count >= limit ? 'text-error font-weight-medium' : '';
}

const grantDialog = ref(false);
const grantTarget = ref<PlatformOrganizationDto | null>(null);
const grantDuration = ref<PremiumGrantDuration>('month');
const isGranting = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');

function openGrantDialog(org: PlatformOrganizationDto): void {
  grantTarget.value = org;
  grantDuration.value = 'month';
  grantDialog.value = true;
}

async function confirmGrant(): Promise<void> {
  if (!grantTarget.value) return;
  isGranting.value = true;
  const name = grantTarget.value.name;
  const ok = await grantPremium(grantTarget.value.id, grantDuration.value);
  isGranting.value = false;
  grantDialog.value = false;
  if (ok) {
    snackbarText.value = t('platformAdmin.organizations.grantPremium.success', { name });
    snackbar.value = true;
  }
}

const featureDialog = ref(false);
const isTogglingDemo = ref(false);

async function toggleDemo(org: PlatformOrganizationDto): Promise<void> {
  if (isTogglingDemo.value) return;
  isTogglingDemo.value = true;
  const next = !org.isDemo;
  const ok = await setDemo(org.id, next);
  isTogglingDemo.value = false;
  if (ok) {
    snackbarText.value = t(next ? 'platformAdmin.organizations.demoToggle.markedSuccess' : 'platformAdmin.organizations.demoToggle.unmarkedSuccess', { name: org.name });
    snackbar.value = true;
  }
}
const featureTarget = ref<PlatformOrganizationDto | null>(null);
const featureKey = ref<GrantableFeature>(GRANTABLE_FEATURES[0]);
const featureDuration = ref<FeatureGrantDuration>('month');
const isGrantingFeature = ref(false);

const featureItems = computed(() =>
  GRANTABLE_FEATURES.map(key => ({ title: t(`platformAdmin.organizations.grantFeature.features.${key}`), value: key })),
);

function openFeatureDialog(org: PlatformOrganizationDto): void {
  featureTarget.value = org;
  featureKey.value = GRANTABLE_FEATURES[0];
  featureDuration.value = 'month';
  featureDialog.value = true;
}

async function confirmFeatureGrant(): Promise<void> {
  if (!featureTarget.value) return;
  isGrantingFeature.value = true;
  const name = featureTarget.value.name;
  const ok = await grantFeature(featureTarget.value.id, featureKey.value, featureDuration.value);
  isGrantingFeature.value = false;
  featureDialog.value = false;
  if (ok) {
    snackbarText.value = t('platformAdmin.organizations.grantFeature.success', { name });
    snackbar.value = true;
  }
}

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
