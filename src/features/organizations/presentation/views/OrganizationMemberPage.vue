<template>
  <MainLayout>
    <!-- Superposition si l'utilisateur est en plan 'free' -->
    <SubscriptionOverlay v-if="isFreePlan" />
    <v-container
      fluid
      class="pa-0"
    >
      <!-- ACTIONS BAR -->
      <div class="d-flex align-center mb-4">
        <div>
          <div class="text-h5 font-weight-bold">
            {{ t('organizations.members.title') }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ t('organizations.members.subtitle') }}
          </div>
        </div>
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="600px"
        >
          <template #activator="{ props }">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :disabled="seatLimitReached"
              v-bind="props"
            >
              {{ t('organizations.members.add') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="selectedMemberForm.first_name"
                      :label="t('organizations.members.form.firstName')"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="selectedMemberForm.last_name"
                      :label="t('organizations.members.form.lastName')"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="selectedMemberForm.email"
                      :label="t('organizations.members.form.email')"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="selectedMemberForm.role"
                      :items="roleOptions"
                      item-title="label"
                      item-value="value"
                      :label="t('organizations.members.form.role')"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model.number="selectedMemberForm.percentage_commission"
                      :label="t('organizations.members.form.commission')"
                      type="number"
                      min="0"
                      max="100"
                      suffix="%"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="onCloseEditDialogBtnClick"
              >
                {{ t('common.cancel') }}
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="onSaveEditDialogBtnClick"
              >
                {{ t('common.save') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <v-alert
        v-if="seatLimitReached"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ t('organizations.members.seatLimit', { used: members.length, limit: seatsLimit }) }}
        <template #append>
          <v-btn
            size="small"
            variant="text"
            to="/subscription"
          >
            {{ t('organizations.members.manageSubscription') }}
          </v-btn>
        </template>
      </v-alert>
      <!-- STATS -->
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
            :placeholder="t('organizations.members.searchPlaceholder')"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="max-width: 300px;"
          />
          <v-select
            v-model="roleFilter"
            :items="roleFilterOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px;"
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
          :items="filteredMembers"
          :sort-by="[{ key: 'users.first_name', order: 'asc' }]"
          :row-props="{ style: 'cursor: pointer;' }"
          :items-per-page-text="t('common.table.itemsPerPage')"
          :no-data-text="t('organizations.members.empty')"
          hover
          @click:row="onRowClick"
        >
          <!-- #REGION -> MEMBER -->
          <template #item.users.first_name="{ item }">
            <div class="d-flex align-center ga-3 py-2">
              <v-avatar
                size="36"
                :color="item.users?.isBlocked ? 'error' : 'primary'"
                variant="tonal"
              >
                <span class="text-caption font-weight-bold">{{ initials(item) }}</span>
              </v-avatar>
              <span class="font-weight-medium">{{ memberName(item) }}</span>
            </div>
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> ROLE CHIP -->
          <template #item.role="{ item }">
            <v-chip
              :color="roleColor(item.role)"
              size="small"
              variant="tonal"
            >
              {{ roleLabel(item.role) }}
            </v-chip>
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> COMMISSION -->
          <template #item.percentage_commission="{ item }">
            {{ item.percentage_commission ? `${item.percentage_commission} %` : '—' }}
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> STATUS -->
          <template #item.status="{ item }">
            <v-chip
              :color="memberStatus(item).color"
              size="small"
              variant="tonal"
            >
              {{ memberStatus(item).label }}
            </v-chip>
          </template>
          <!-- #ENDREGION -->

          <!-- #REGION -> ITEM ACTIONS -->
          <template #item.actions="{ item }">
            <div
              class="d-flex justify-end"
              @click.stop
            >
              <v-menu location="bottom end">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    :aria-label="t('organizations.members.actions.label')"
                    v-bind="props"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list
                  density="compact"
                  min-width="210"
                >
                  <v-list-item
                    prepend-icon="mdi-pencil-outline"
                    :title="t('organizations.members.actions.edit')"
                    @click="onEditBtnClick(item)"
                  />
                  <v-list-item
                    prepend-icon="mdi-office-building-plus-outline"
                    :title="t('organizations.members.actions.assignGarages')"
                    @click="onAssignGaragesBtnClick(item)"
                  />
                  <v-divider class="my-1" />
                  <v-list-item
                    :prepend-icon="item.users?.isBlocked ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
                    :title="item.users?.isBlocked ? t('organizations.members.actions.unblock') : t('organizations.members.actions.block')"
                    :base-color="item.users?.isBlocked ? 'success' : 'warning'"
                    @click="onToggleBlockBtnClick(item)"
                  />
                  <v-list-item
                    prepend-icon="mdi-delete-outline"
                    :title="t('organizations.members.actions.delete')"
                    base-color="error"
                    @click="onDeleteBtnClick(item)"
                  />
                </v-list>
              </v-menu>
            </div>
          </template>
          <!-- #ENDREGION -->
        </v-data-table>
      </v-card>

      <AssignGarageDialog
        v-model="assignDialog"
        :technician-name="assignTarget ? memberName(assignTarget) : ''"
        :all-garages="garages"
        :assigned-garages="assignedGarages"
        @assign-garages="onAssignGarages"
      />

      <ConfirmDialog
        ref="confirmDialogRef"
        :title="confirmState.title"
        :message="confirmState.message"
        :confirm-label="confirmState.confirmLabel"
        :cancel-label="t('common.cancel')"
        type="warning"
        @confirm="onConfirmAction"
        @cancel="pendingAction = null"
      />

      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        location="bottom right"
      >
        {{ snackbar.message }}
      </v-snackbar>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useOrganizationMemberPageDependencies } from '@/features/organizations/composition/useOrganizationMemberPageDependencies';
import SubscriptionOverlay from '@/features/subscription/presentation/components/SubscriptionOverlay.vue';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import router from '@/app/router/index';
import ConfirmDialog from '@/shared/presentation/ui/components/ConfirmDialog.vue';
import type { ConfirmDialogExposed } from '@/shared/presentation/ui/components/ConfirmDialog';
import AssignGarageDialog from '@/features/technicians/presentation/components/AssignGarageDialog.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { setSelectedMemberId } from '@/features/technicians/presentation/utils/memberSelection';

// Injection du state depuis Inversify
  const { useOrganizationMember, authState, subscriptionState } = useOrganizationMemberPageDependencies();
const { isFreePlan } = authState
const { t, te } = useI18n();


const {
  members,
  garages,
  selectedMemberForm,

  init,

  selectMember,

  addMember,
  updateMember,
  archiveMember,

  resetSelectedMemberForm,
  setMemberBlocked,
  toggleGarageAccess,
} = useOrganizationMember;

const dialog = ref<boolean>(false);

const seatsLimit = computed(() => subscriptionState.subscription.value?.seatsLimit ?? 0);
const seatLimitReached = computed(() => seatsLimit.value > 0 && members.value.length >= seatsLimit.value);

const search = ref<string | null>('');
const roleFilter = ref<string>('all');
const statusFilter = ref<string>('all');

const roleLabels = computed<Record<string, string>>(() => ({
  technician: t('organizations.members.roles.technician'),
  manager: t('organizations.members.roles.manager'),
  admin: t('organizations.members.roles.admin'),
}));

const statusFilterOptions = computed(() => [
  { title: t('organizations.members.filters.allStatuses'), value: 'all' },
  { title: t('organizations.members.status.active'), value: 'active' },
  { title: t('organizations.members.status.pending'), value: 'pending' },
  { title: t('organizations.members.status.blocked'), value: 'blocked' },
  { title: t('organizations.members.status.archived'), value: 'archived' },
]);

const memberName = (m: OrganizationMemberViewModel) =>
  `${m.users?.first_name ?? ''} ${m.users?.last_name ?? ''}`.trim() || m.users?.email || '—';

const initials = (m: OrganizationMemberViewModel) =>
  `${m.users?.first_name?.[0] ?? ''}${m.users?.last_name?.[0] ?? ''}`.toUpperCase() || '?';

const memberStatus = (m: OrganizationMemberViewModel) => {
  if (m.users?.isBlocked) return { key: 'blocked', label: t('organizations.members.status.blocked'), color: 'error' };
  return { key: m.status, label: te(`organizations.members.status.${m.status}`) ? t(`organizations.members.status.${m.status}`) : m.status, color: getStatusColor(m.status) };
};

const filteredMembers = computed(() => {
  const term = (search.value ?? '').trim().toLowerCase();
  return members.value.filter(m => {
    if (roleFilter.value !== 'all' && m.role !== roleFilter.value) return false;
    if (statusFilter.value !== 'all' && memberStatus(m).key !== statusFilter.value) return false;
    if (!term) return true;
    return `${memberName(m)} ${m.users?.email ?? ''}`.toLowerCase().includes(term);
  });
});

const statCards = computed(() => {
  const list = members.value;
  const blocked = list.filter(m => m.users?.isBlocked).length;
  const active = list.filter(m => !m.users?.isBlocked && m.status === 'active').length;
  const avg = list.length
    ? list.reduce((sum, m) => sum + (m.percentage_commission || 0), 0) / list.length
    : 0;
  return [
    { label: t('organizations.members.stats.members'), value: list.length, icon: 'mdi-account-group-outline', color: 'primary' },
    { label: t('organizations.members.stats.active'), value: active, icon: 'mdi-check-circle-outline', color: 'success' },
    { label: t('organizations.members.stats.blocked'), value: blocked, icon: 'mdi-lock-outline', color: 'error' },
    { label: t('organizations.members.stats.avgCommission'), value: `${Math.round(avg * 10) / 10} %`, icon: 'mdi-percent-outline', color: 'warning' },
  ];
});

const headers = computed(() => [
  { title: t('organizations.members.table.member'), align: 'start', key: 'users.first_name' },
  { title: t('organizations.members.form.email'), key: 'users.email' },
  { title: t('organizations.members.form.role'), key: 'role', sortable: false },
  { title: t('organizations.members.table.commission'), key: 'percentage_commission', align: 'end', sortable: false },
  { title: t('organizations.members.table.status'), key: 'status', sortable: false },
  { title: '', sortable: false, key: 'actions', align: 'end', width: 56 },
] as const);

const roleOptions = computed(() => [
  { label: t('organizations.members.roles.technician'), value: 'technician' },
]);

const roleLabel = (role?: string) => (role && roleLabels.value[role]) || role || '—';

const roleFilterOptions = computed(() => [
  { title: t('organizations.members.filters.allRoles'), value: 'all' },
  ...[...new Set(members.value.map(m => m.role))].map(role => ({ title: roleLabel(role), value: role })),
]);


const roleColor = (role?: string) => {
  switch (role) {
    case 'admin': return 'red';
    case 'garage': return 'blue';
    case 'technician': return 'green';
    case 'independant_technician': return 'orange';
    default: return 'grey';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'pending': return 'orange';
    case 'active': return 'green';
    case 'archived': return 'grey';
    case 'blocked': return 'red';
    default: return 'grey';
  }
};

const formTitle = computed(() =>
  selectedMemberForm.value?.id
    ? t('organizations.members.dialog.edit')
    : t('organizations.members.dialog.new')
);

const onRowClick = (_event: Event, { item }: { item: OrganizationMemberViewModel }) => {
  setSelectedMemberId(item.user_id);
  router.push('/organization/members/detail');
};

const confirmDialogRef = ref<ConfirmDialogExposed>();
const confirmState = reactive({ title: '', message: '', confirmLabel: t('common.confirm') });
const pendingAction = ref<(() => void | Promise<void>) | null>(null);
const snackbar = reactive({ show: false, message: '', color: 'success' });

const showSnack = (message: string, color = 'success') => {
  Object.assign(snackbar, { show: true, message, color });
};

const askConfirmation = (title: string, message: string, confirmLabel: string, action: () => void | Promise<void>) => {
  Object.assign(confirmState, { title, message, confirmLabel });
  pendingAction.value = action;
  confirmDialogRef.value?.open();
};

const onConfirmAction = async () => {
  const action = pendingAction.value;
  pendingAction.value = null;
  try {
    await action?.();
  } catch {
    showSnack(t('organizations.members.messages.error'), 'error');
  }
};

const onToggleBlockBtnClick = (item: OrganizationMemberViewModel) => {
  const blocked = !!item.users?.isBlocked;
  const name = memberName(item);
  askConfirmation(
    blocked ? t('organizations.members.block.unblockTitle') : t('organizations.members.block.blockTitle'),
    blocked
      ? t('organizations.members.block.unblockMessage', { name })
      : t('organizations.members.block.blockMessage', { name }),
    blocked ? t('organizations.members.actions.unblock') : t('organizations.members.actions.block'),
    () => setMemberBlocked(item.user_id, !blocked),
  );
};

const assignDialog = ref(false);
const assignTarget = ref<OrganizationMemberViewModel | null>(null);
const assignedGarages = ref<typeof garages.value>([]);

const onAssignGaragesBtnClick = async (item: OrganizationMemberViewModel) => {
  assignTarget.value = item;
  try {
    await useOrganizationMember.loadAssignedGarages(item.user_id);
    const ids = useOrganizationMember.assignedGarageIds.value;
    assignedGarages.value = garages.value.filter(g => g.id && ids.includes(g.id));
    assignDialog.value = true;
  } catch {
    showSnack(t('organizations.members.messages.loadGaragesError'), 'error');
  }
};

const onAssignGarages = async (garageIds: string[]) => {
  if (!assignTarget.value) return;
  try {
    for (const id of garageIds) {
      await toggleGarageAccess(assignTarget.value.user_id, id, true);
    }
    showSnack(t('organizations.members.messages.garagesAssigned'));
  } catch {
    showSnack(t('organizations.members.messages.assignError'), 'error');
  }
};

const onEditBtnClick = (item: OrganizationMemberViewModel) => {
  selectMember(item);
  dialog.value = true;
};

const onCloseEditDialogBtnClick = () => {
  resetSelectedMemberForm();
  dialog.value = false;
};

const onSaveEditDialogBtnClick = async () => {
  if (selectedMemberForm.value?.id) await updateMember(selectedMemberForm.value);
  else if (seatLimitReached.value) showSnack(t('organizations.members.messages.seatLimit'), 'warning');
  else await addMember(selectedMemberForm.value);
  dialog.value = false;
};

const onDeleteBtnClick = (item: OrganizationMemberViewModel) => {
  if (!item.id) return;
  askConfirmation(
    t('organizations.members.delete.title'),
    t('organizations.members.delete.message', { name: memberName(item) }),
    t('common.delete'),
    () => archiveMember(item.id),
  );
};

onMounted(async () => {
  const orgId = authState.userContext.value?.organization.id;
  if (orgId) subscriptionState.loadForOrganization(orgId);
  await init();
});
</script>
