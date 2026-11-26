<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { useProfileSwitcher } from '@/features/profileSwitcher/composition/useProfileSwitcher';
import type { DemoProfileDto } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

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

async function backToGlobal() {
  if (await state.clear()) {
    window.location.assign('/admin/profiles');
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
            <v-card-title>{{ t(`profileSwitcher.roles.${profile.role}`) }}</v-card-title>
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
      </v-row>
    </v-container>
  </MainLayout>
</template>
