<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { useProfileSwitcher } from '@/features/profileSwitcher/composition/useProfileSwitcher';
import type { DemoProfileDto, DemoProfileRole } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

const { t } = useI18n();
const state = useProfileSwitcher();

const organizations = computed(() => {
  const map = new Map<string, { id: string; name: string; plan: string | null; profiles: DemoProfileDto[] }>();
  for (const p of state.profiles.value) {
    const entry = map.get(p.organizationId) ?? { id: p.organizationId, name: p.organizationName, plan: p.planCode, profiles: [] };
    entry.profiles.push(p);
    map.set(p.organizationId, entry);
  }
  return [...map.values()];
});

onMounted(() => state.load());

const ALL_ROLES: DemoProfileRole[] = ['admin', 'manager', 'technician'];
type OrgEntry = { id: string; profiles: DemoProfileDto[] };
const drafts = reactive<Record<string, { role: DemoProfileRole | null; label: string }>>({});

const draft = (orgId: string) => (drafts[orgId] ??= { role: null, label: '' });
const missingRoles = (org: OrgEntry) => ALL_ROLES.filter(r => !org.profiles.some(p => p.role === r));

async function addProfile(orgId: string) {
  const d = draft(orgId);
  if (!d.role) return;
  if (await state.createProfile(orgId, d.role, d.label)) {
    drafts[orgId] = { role: null, label: '' };
  }
}

async function backToGlobal() {
  if (await state.clear()) {
    window.location.assign('/');
  }
}

async function enter(profile: DemoProfileDto) {
  if (await state.switchTo(profile.profileId)) {
    // Full reload so every module-scoped state restarts on the new organization
    window.location.assign('/');
  }
}
</script>

<template>
  <MainLayout>
    <v-container>
      <h2 class="mb-1">
        {{ t('profileSwitcher.title') }}
      </h2>
      <p class="text-medium-emphasis mb-4">
        {{ t('profileSwitcher.subtitle') }}
      </p>
      <v-btn
        variant="tonal"
        class="mb-6"
        :disabled="state.isLoading.value"
        @click="backToGlobal"
      >
        {{ t('profileSwitcher.actions.backToGlobal') }}
      </v-btn>

      <v-alert
        v-if="state.error.value"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ t('profileSwitcher.switchError') }}: {{ state.error.value }}
      </v-alert>

      <v-progress-linear
        v-if="state.isLoading.value"
        indeterminate
        class="mb-4"
      />

      <v-alert
        v-if="!state.isLoading.value && !organizations.length && !state.error.value"
        type="info"
        variant="tonal"
      >
        {{ t('profileSwitcher.empty') }}
      </v-alert>

      <v-row
        v-for="org in organizations"
        :key="org.id"
        class="mb-4"
      >
        <v-col cols="12">
          <div class="d-flex align-center mb-2">
            <h3 class="mr-3">
              {{ org.name }}
            </h3>
            <v-chip
              v-if="org.plan"
              size="small"
              :color="org.plan === 'PREMIUM' ? 'warning' : 'default'"
            >
              {{ t(`profileSwitcher.plan.${org.plan}`, org.plan) }}
            </v-chip>
          </div>
        </v-col>
        <v-col
          v-for="profile in org.profiles"
          :key="profile.profileId"
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="bg-surface"
          >
            <v-card-title class="d-flex align-center">
              <span>{{ profile.label }}</span>
              <v-spacer />
              <v-btn
                icon="mdi-delete-outline"
                size="small"
                variant="text"
                :title="t('profileSwitcher.actions.delete')"
                :disabled="state.isLoading.value || org.profiles.length <= 1"
                @click="state.deleteProfile(profile.profileId)"
              />
            </v-card-title>
            <v-card-subtitle>{{ t(`profileSwitcher.roles.${profile.role}`) }}</v-card-subtitle>
            <v-card-actions>
              <v-btn
                color="primary"
                variant="flat"
                :disabled="state.isLoading.value"
                @click="enter(profile)"
              >
                {{ t('profileSwitcher.actions.enter') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          v-if="missingRoles(org).length"
          cols="12"
          md="4"
        >
          <v-card
            elevation="0"
            class="bg-surface"
          >
            <v-card-text class="d-flex flex-column ga-2">
              <v-select
                v-model="draft(org.id).role"
                :items="missingRoles(org).map(r => ({ value: r, title: t(`profileSwitcher.roles.${r}`) }))"
                :label="t('profileSwitcher.add.role')"
                density="compact"
                hide-details
              />
              <v-text-field
                v-model="draft(org.id).label"
                :label="t('profileSwitcher.add.label')"
                density="compact"
                hide-details
              />
              <v-btn
                variant="tonal"
                prepend-icon="mdi-plus"
                :disabled="state.isLoading.value"
                @click="addProfile(org.id)"
              >
                {{ t('profileSwitcher.add.submit') }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>
