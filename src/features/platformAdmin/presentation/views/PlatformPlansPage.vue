<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0"
    >
      <div class="d-flex flex-wrap align-start justify-space-between ga-3 mb-4">
        <div>
          <div class="text-h5 font-weight-bold">
            {{ t('platformAdmin.plans.title') }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ t('platformAdmin.plans.subtitle') }}
          </div>
        </div>
        <v-btn
          v-if="tab === 'compare' && !editMode"
          color="primary"
          prepend-icon="mdi-pencil-outline"
          :disabled="isLoading"
          @click="startEdit"
        >
          {{ t('platformAdmin.plans.edit') }}
        </v-btn>
      </div>

      <v-tabs
        v-model="tab"
        color="primary"
        class="mb-4"
      >
        <v-tab value="compare">
          {{ t('platformAdmin.plans.tabs.compare') }}
        </v-tab>
        <v-tab value="log">
          {{ t('platformAdmin.plans.tabs.log') }}
        </v-tab>
      </v-tabs>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <v-progress-linear
        v-if="isLoading"
        indeterminate
        class="mb-4"
      />

      <v-window
        v-model="tab"
        :touch="false"
      >
        <v-window-item value="compare">
          <v-alert
            :type="editMode ? 'warning' : 'info'"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ editMode ? t('platformAdmin.plans.editBanner') : t('platformAdmin.plans.readOnlyInfo') }}
          </v-alert>

          <v-card
            v-if="plans.length"
            variant="flat"
            class="bg-surface border"
          >
            <v-table class="plans-table">
              <thead>
                <tr>
                  <th class="feature-col" />
                  <th
                    v-for="plan in plans"
                    :key="plan.id"
                  >
                    <div class="d-flex align-center ga-2">
                      <span class="text-subtitle-1 font-weight-bold">{{ plan.code }}</span>
                      <v-chip
                        size="x-small"
                        variant="tonal"
                        :color="plan.code === 'PREMIUM' ? 'warning' : 'default'"
                      >
                        {{ t('platformAdmin.plans.organizations', { n: plan.orgsCount }) }}
                      </v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis font-weight-regular">
                      {{ (plan.priceCents / 100).toFixed(2) }} € {{ t('platformAdmin.plans.perMonth') }}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="group in groups"
                  :key="group.id"
                >
                  <tr class="group-row">
                    <td :colspan="plans.length + 1">
                      {{ group.label }}
                    </td>
                  </tr>
                  <tr
                    v-for="row in group.rows"
                    :key="row.key"
                  >
                    <td class="feature-col">
                      <div class="font-weight-medium">
                        {{ row.name }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ row.description }}
                      </div>
                    </td>
                    <td
                      v-for="plan in plans"
                      :key="plan.id"
                      :class="{ 'changed-cell': featureOf(plan, row.key) && isChanged(plan.id, featureOf(plan, row.key)!) }"
                    >
                      <template v-if="featureOf(plan, row.key)">
                        <div class="d-flex align-center ga-2">
                          <!-- boolean -->
                          <template v-if="row.type === 'boolean'">
                            <v-switch
                              v-if="editMode"
                              :model-value="valueOf(plan.id, featureOf(plan, row.key)!) === true"
                              color="primary"
                              density="compact"
                              hide-details
                              @update:model-value="setDraft(plan.id, row.key, Boolean($event))"
                            />
                            <v-icon
                              v-else
                              :icon="valueOf(plan.id, featureOf(plan, row.key)!) === true ? 'mdi-check-circle' : 'mdi-close-circle-outline'"
                              :color="valueOf(plan.id, featureOf(plan, row.key)!) === true ? 'success' : undefined"
                              size="22"
                            />
                          </template>

                          <!-- limit -->
                          <template v-else>
                            <template v-if="editMode">
                              <v-text-field
                                v-if="valueOf(plan.id, featureOf(plan, row.key)!) !== null"
                                :model-value="valueOf(plan.id, featureOf(plan, row.key)!)"
                                type="number"
                                min="0"
                                density="compact"
                                variant="outlined"
                                hide-details
                                class="limit-input"
                                @update:model-value="onLimitInput(plan, row.key, $event)"
                              />
                              <v-chip
                                size="small"
                                :variant="valueOf(plan.id, featureOf(plan, row.key)!) === null ? 'flat' : 'outlined'"
                                :color="valueOf(plan.id, featureOf(plan, row.key)!) === null ? 'primary' : undefined"
                                @click="toggleUnlimited(plan, row.key)"
                              >
                                ∞ {{ t('platformAdmin.plans.unlimited') }}
                              </v-chip>
                            </template>
                            <span
                              v-else
                              class="font-weight-medium"
                            >
                              {{ valueOf(plan.id, featureOf(plan, row.key)!) === null ? '∞' : valueOf(plan.id, featureOf(plan, row.key)!) }}
                            </span>
                          </template>

                          <v-chip
                            v-if="isChanged(plan.id, featureOf(plan, row.key)!)"
                            size="x-small"
                            color="warning"
                            variant="tonal"
                          >
                            {{ t('platformAdmin.plans.modified') }}
                          </v-chip>
                        </div>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </v-table>
          </v-card>

          <v-card
            v-if="editMode"
            class="pending-bar d-flex align-center justify-space-between pa-3 mt-4"
            color="grey-darken-4"
            elevation="8"
          >
            <span class="font-weight-medium ml-2">
              {{ t('platformAdmin.plans.pending', { n: changes.length }) }}
            </span>
            <div class="d-flex ga-2">
              <v-btn
                variant="text"
                @click="cancelEdit"
              >
                {{ t('platformAdmin.plans.cancel') }}
              </v-btn>
              <v-btn
                variant="outlined"
                :disabled="changes.length === 0"
                :loading="isPreviewing && previewOnly"
                @click="onReview(true)"
              >
                {{ t('platformAdmin.plans.review') }}
              </v-btn>
              <v-btn
                color="warning"
                :disabled="changes.length === 0"
                :loading="isPreviewing && !previewOnly"
                @click="onReview(false)"
              >
                {{ t('platformAdmin.plans.save') }}
              </v-btn>
            </div>
          </v-card>
        </v-window-item>

        <v-window-item value="log">
          <v-card
            variant="flat"
            class="bg-surface border"
          >
            <v-table v-if="changeLog.length">
              <thead>
                <tr>
                  <th>{{ t('platformAdmin.plans.log.when') }}</th>
                  <th>{{ t('platformAdmin.plans.log.by') }}</th>
                  <th>{{ t('platformAdmin.plans.log.plan') }}</th>
                  <th>{{ t('platformAdmin.plans.log.change') }}</th>
                  <th>{{ t('platformAdmin.plans.log.impact') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="entry in changeLog"
                  :key="entry.id"
                >
                  <td>{{ new Date(entry.changedAt).toLocaleString() }}</td>
                  <td>{{ entry.changedBy ?? '—' }}</td>
                  <td>{{ entry.planCode }}</td>
                  <td>
                    <span class="font-weight-medium">{{ entry.featureName }}</span> :
                    {{ formatValue(entry.oldValue) }} → {{ formatValue(entry.newValue) }}
                  </td>
                  <td>{{ entry.orgsAffected }} / {{ entry.orgsOnPlan }}</td>
                </tr>
              </tbody>
            </v-table>
            <div
              v-else
              class="pa-6 text-center text-medium-emphasis"
            >
              {{ t('platformAdmin.plans.log.empty') }}
            </div>
          </v-card>
        </v-window-item>
      </v-window>

      <v-dialog
        v-model="confirmOpen"
        max-width="620"
        persistent
      >
        <v-card>
          <v-card-title class="pt-5 px-6">
            {{ previewOnly ? t('platformAdmin.plans.confirm.previewTitle') : t('platformAdmin.plans.confirm.title') }}
          </v-card-title>
          <v-card-text class="px-6">
            <div
              v-for="impact in impacts"
              :key="`${impact.planId}:${impact.featureKey}`"
              class="mb-4"
            >
              <div>
                <span class="font-weight-bold">{{ impact.planCode }}</span> ·
                <span class="font-weight-medium">{{ impact.featureName }}</span> :
                {{ formatValue(impact.oldValue) }} → {{ formatValue(impact.newValue) }}
              </div>
              <v-alert
                v-if="impact.orgsAffected > 0"
                type="warning"
                variant="tonal"
                density="compact"
                class="mt-2"
              >
                {{
                  impact.type === 'boolean'
                    ? t('platformAdmin.plans.confirm.lostFeature', { n: impact.orgsAffected })
                    : t('platformAdmin.plans.confirm.affected', { n: impact.orgsAffected, total: impact.orgsOnPlan })
                }}
              </v-alert>
              <div
                v-else
                class="text-caption text-medium-emphasis mt-1"
              >
                {{ t('platformAdmin.plans.confirm.noImpact', { total: impact.orgsOnPlan }) }}
              </div>
            </div>

            <div v-if="needsTyping && !previewOnly">
              <div class="text-body-2 mb-2">
                {{ t('platformAdmin.plans.confirm.typeToConfirm', { word: confirmWord }) }}
              </div>
              <v-text-field
                v-model="typedWord"
                density="compact"
                variant="outlined"
                hide-details
                autofocus
              />
            </div>
          </v-card-text>
          <v-card-actions class="px-6 pb-5">
            <v-spacer />
            <v-btn
              variant="text"
              :disabled="isSaving"
              @click="confirmOpen = false"
            >
              {{ previewOnly ? t('platformAdmin.plans.confirm.close') : t('platformAdmin.plans.confirm.cancel') }}
            </v-btn>
            <v-btn
              v-if="!previewOnly"
              color="warning"
              variant="flat"
              :loading="isSaving"
              :disabled="needsTyping && typedWord.trim().toUpperCase() !== confirmWord"
              @click="onConfirm"
            >
              {{ t('platformAdmin.plans.confirm.apply') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="savedSnackbar"
        color="success"
        timeout="3000"
      >
        {{ t('platformAdmin.plans.saved') }}
      </v-snackbar>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { usePlatformPlans } from '@/features/platformAdmin/composition/usePlatformPlans';
import type { PlanFeatureDto, PlanFeatureValue, PlatformPlanDto } from '@/features/platformAdmin/application/dtos/PlatformPlanDto';

const { t } = useI18n();
const {
  plans, isLoading, error, editMode, changes, impacts, isPreviewing, isSaving, changeLog,
  load, loadChangeLog, startEdit, cancelEdit, valueOf, isChanged, setDraft, previewChanges, applyChanges,
} = usePlatformPlans();

const tab = ref<'compare' | 'log'>('compare');
const confirmOpen = ref(false);
const previewOnly = ref(false);
const typedWord = ref('');
const savedSnackbar = ref(false);

const confirmWord = computed(() => t('platformAdmin.plans.confirm.word'));
const needsTyping = computed(() => impacts.value.some(i => i.isRisky));

const featureOf = (plan: PlatformPlanDto, key: string): PlanFeatureDto | undefined =>
  plan.features.find(f => f.key === key);

const groups = computed(() => {
  const reference = plans.value[0]?.features ?? [];
  const toRow = (f: PlanFeatureDto) => ({ key: f.key, name: f.name, description: f.description, type: f.type });
  return [
    { id: 'limits', label: t('platformAdmin.plans.groups.limits'), rows: reference.filter(f => f.type === 'limit').map(toRow) },
    { id: 'features', label: t('platformAdmin.plans.groups.features'), rows: reference.filter(f => f.type === 'boolean').map(toRow) },
  ].filter(g => g.rows.length > 0);
});

const formatValue = (value: PlanFeatureValue): string => {
  if (value === null) return '∞';
  if (typeof value === 'boolean') return value ? t('platformAdmin.plans.confirm.on') : t('platformAdmin.plans.confirm.off');
  return String(value);
};

const onLimitInput = (plan: PlatformPlanDto, key: string, raw: unknown): void => {
  const n = Number(raw);
  if (raw === '' || raw === null || !Number.isInteger(n) || n < 0) return;
  setDraft(plan.id, key, n);
};

const toggleUnlimited = (plan: PlatformPlanDto, key: string): void => {
  const feature = featureOf(plan, key);
  if (!feature) return;
  const current = valueOf(plan.id, feature);
  const fallback = typeof feature.value === 'number' && feature.value > 0 ? feature.value : 1;
  setDraft(plan.id, key, current === null ? fallback : null);
};

const onReview = async (onlyPreview: boolean): Promise<void> => {
  previewOnly.value = onlyPreview;
  typedWord.value = '';
  if (await previewChanges()) confirmOpen.value = true;
};

const onConfirm = async (): Promise<void> => {
  if (await applyChanges()) {
    confirmOpen.value = false;
    savedSnackbar.value = true;
  }
};

watch(tab, value => {
  if (value === 'log') loadChangeLog();
});

onMounted(load);
</script>

<style scoped>
.feature-col {
  width: 42%;
}
.group-row td {
  background: rgba(var(--v-theme-on-surface), 0.04);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.changed-cell {
  background: rgba(var(--v-theme-warning), 0.1);
}
.limit-input {
  max-width: 100px;
}
.pending-bar {
  position: sticky;
  bottom: 16px;
  z-index: 5;
}
</style>
