import { computed, ref } from 'vue';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';

export interface UseSubscriptionSeatsDependencies {
  authState: IAuthState;
  subscriptionState: ISubscriptionState;
  memberUseCase: IOrganizationMemberUseCase;
  garageUseCase: IGarageUseCase;
}

export function createUseSubscriptionSeats(deps: UseSubscriptionSeatsDependencies) {
  const { authState, subscriptionState, memberUseCase, garageUseCase } = deps;
  const seatsUsed = ref(0);
  const garagesUsed = ref(0);

  const seatsLimit = computed(() => subscriptionState.subscription.value?.seatsLimit ?? 0);
  // 0 = illimité
  const garagesLimit = computed(() => {
    const value = subscriptionState.subscription.value?.features?.max_garages;
    return typeof value === 'number' ? value : 0;
  });
  const seatsPercent = computed(() =>
    seatsLimit.value > 0 ? Math.min(100, (seatsUsed.value / seatsLimit.value) * 100) : 0,
  );
  const seatLimitReached = computed(() => seatsLimit.value > 0 && seatsUsed.value >= seatsLimit.value);
  const isFreePlan = computed(() => (subscriptionState.subscription.value?.subscriptionPlan?.code ?? 'FREE') === 'FREE');

  const load = async () => {
    const orgId = authState.userContext.value?.organization.id;
    if (!orgId) return;
    const [, members, garages] = await Promise.allSettled([
      subscriptionState.loadForOrganization(orgId),
      memberUseCase.getMembersByOrganizationId(orgId),
      garageUseCase.getGaragesByOrganizationId(orgId),
    ]);
    if (members.status === 'fulfilled') seatsUsed.value = members.value.length;
    if (garages.status === 'fulfilled') garagesUsed.value = garages.value.length;
  };

  return { seatsUsed, seatsLimit, seatsPercent, seatLimitReached, garagesUsed, garagesLimit, isFreePlan, load };
}
