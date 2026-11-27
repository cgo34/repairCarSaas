import { computed, ref } from 'vue';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { ICountQuotesThisMonthUseCase } from '@/features/quotes/application/useCases/CountQuotesThisMonthUseCase';
import { ICountInvoicesThisMonthUseCase } from '@/features/invoices/application/useCases/CountInvoicesThisMonthUseCase';
import { ICountConversionsThisMonthUseCase } from '@/features/invoices/application/useCases/CountConversionsThisMonthUseCase';

export interface UseSubscriptionSeatsDependencies {
  authState: IAuthState;
  subscriptionState: ISubscriptionState;
  memberUseCase: IOrganizationMemberUseCase;
  garageUseCase: IGarageUseCase;
  countQuotesThisMonth: ICountQuotesThisMonthUseCase;
  countInvoicesThisMonth: ICountInvoicesThisMonthUseCase;
  countConversionsThisMonth: ICountConversionsThisMonthUseCase;
}

export function createUseSubscriptionSeats(deps: UseSubscriptionSeatsDependencies) {
  const { authState, subscriptionState, memberUseCase, garageUseCase, countQuotesThisMonth, countInvoicesThisMonth, countConversionsThisMonth } = deps;
  const seatsUsed = ref(0);
  const garagesUsed = ref(0);
  const quotesUsed = ref(0);
  const invoicesUsed = ref(0);
  const conversionsUsed = ref(0);

  const numericFeature = (key: string) => {
    const value = subscriptionState.subscription.value?.features?.[key];
    return typeof value === 'number' ? value : 0;
  };
  const quotesLimit = computed(() => numericFeature('max_quotes_per_month'));
  const invoicesLimit = computed(() => numericFeature('max_invoices_per_month'));
  const conversionsLimit = computed(() => numericFeature('max_conversions_per_month'));
  const features = computed(() => subscriptionState.subscription.value?.features ?? {});

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
    const [, members, garages, quotes, invoices, conversions] = await Promise.allSettled([
      subscriptionState.loadForOrganization(orgId),
      memberUseCase.getMembersByOrganizationId(orgId),
      garageUseCase.getGaragesByOrganizationId(orgId),
      countQuotesThisMonth.execute(orgId),
      countInvoicesThisMonth.execute(orgId),
      countConversionsThisMonth.execute(orgId),
    ]);
    if (conversions.status === 'fulfilled') conversionsUsed.value = conversions.value;
    if (quotes.status === 'fulfilled') quotesUsed.value = quotes.value;
    if (invoices.status === 'fulfilled') invoicesUsed.value = invoices.value;
    if (members.status === 'fulfilled') seatsUsed.value = members.value.length;
    if (garages.status === 'fulfilled') garagesUsed.value = garages.value.length;
  };

  return {
    seatsUsed, seatsLimit, seatsPercent, seatLimitReached,
    garagesUsed, garagesLimit,
    quotesUsed, quotesLimit, invoicesUsed, invoicesLimit,
        conversionsUsed, conversionsLimit,
    features, isFreePlan, load,
  };
}
