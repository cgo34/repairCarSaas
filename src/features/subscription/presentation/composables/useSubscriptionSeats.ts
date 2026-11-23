import { computed, ref } from 'vue';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';

export interface UseSubscriptionSeatsDependencies {
  authState: IAuthState;
  subscriptionState: ISubscriptionState;
  memberUseCase: IOrganizationMemberUseCase;
}

export function createUseSubscriptionSeats(deps: UseSubscriptionSeatsDependencies) {
  const { authState, subscriptionState, memberUseCase } = deps;
  const seatsUsed = ref(0);

  const seatsLimit = computed(() => {
    const sub = subscriptionState.subscription.value;
    return sub?.maxSeats ?? ((sub?.includedSeats ?? 0) + (sub?.extraSeats ?? 0));
  });
  const seatsPercent = computed(() =>
    seatsLimit.value > 0 ? Math.min(100, (seatsUsed.value / seatsLimit.value) * 100) : 0,
  );
  const seatLimitReached = computed(() => seatsLimit.value > 0 && seatsUsed.value >= seatsLimit.value);
  const isFreePlan = computed(() => (subscriptionState.subscription.value?.subscriptionPlan?.code ?? 'FREE') === 'FREE');

  const load = async () => {
    const orgId = authState.userContext.value?.organization.id;
    if (!orgId) return;
    const [, members] = await Promise.allSettled([
      subscriptionState.loadForOrganization(orgId),
      memberUseCase.getMembersByOrganizationId(orgId),
    ]);
    if (members.status === 'fulfilled') seatsUsed.value = members.value.length;
  };

  return { seatsUsed, seatsLimit, seatsPercent, seatLimitReached, isFreePlan, load };
}
