import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IUseOrganizationProfileState } from '@/features/organizations/presentation/types/IUseOrganizationProfile';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IInvoicesUseCase } from '@/features/invoices/application/useCases/GetInvoicesUseCase';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IQuotesUseCase } from '@/features/quotes/application/useCases/GetQuotesUseCase';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { InvoiceMapper } from '@/features/invoices/presentation/mappers/InvoiceMapper';
import { QuoteMapper } from '@/features/quotes/presentation/mappers/QuoteMapper';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
import { computed, ref } from 'vue';
import { i18n } from '@/app/i18n';

export interface UseAdminDashboardStateDependencies {
  authState: IAuthState;
  subscriptionState: ISubscriptionState;
  garageUseCase: IGarageUseCase;
  memberUseCase: IOrganizationMemberUseCase;
  quotesUseCase: IQuotesUseCase;
  invoicesUseCase: IInvoicesUseCase;
  garageAccessRepo: ITechnicianGarageAccessRepository;
  profileState: IUseOrganizationProfileState;
}

export function createUseAdminDashboardState(deps: UseAdminDashboardStateDependencies) {
  const { authState, subscriptionState, profileState, garageUseCase, memberUseCase, quotesUseCase, invoicesUseCase, garageAccessRepo } = deps;


  const totalUsers = ref<number>(0);
  const totalGarages = ref<number>(0);
  const _quotes = ref<QuoteViewModel[]>([]);
  const _invoices = ref<InvoiceViewModel[]>([]);
  const loading = ref<boolean>(true);
  const error = ref<unknown>(null);

  const fmt = (n: number) => n > 0 ? n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €' : '';
  const sumHt = (list: { totalHt?: number }[]) => list.reduce((acc, q) => acc + (q.totalHt ?? 0), 0);

  // -- quotes KPIs
  const totalQuotes = computed(() => _quotes.value.length);
  const totalQuotesHt = computed(() => fmt(sumHt(_quotes.value)));

  const OPEN_QUOTE_CODES = ['draft', 'pending'];
  const quotesProcessing = computed(() => _quotes.value.filter(q => OPEN_QUOTE_CODES.includes(q.status?.code ?? '')).length);
  const quotesProcessingHt = computed(() => fmt(sumHt(_quotes.value.filter(q => OPEN_QUOTE_CODES.includes(q.status?.code ?? '')))));

  const quotesFinalized = computed(() => _quotes.value.filter(q => q.status?.code === 'finalized').length);
  const quotesFinalizedHt = computed(() => fmt(sumHt(_quotes.value.filter(q => q.status?.code === 'finalized'))));

  const quotesAccepted = computed(() => _quotes.value.filter(q => q.status?.code === 'accepted').length);
  const quotesAcceptedHt = computed(() => fmt(sumHt(_quotes.value.filter(q => q.status?.code === 'accepted'))));

  const recentQuotes = computed(() =>
    [..._quotes.value]
      .sort((a, b) => new Date(b.createdAt ?? b.startDate).getTime() - new Date(a.createdAt ?? a.startDate).getTime())
      .slice(0, 5)
  );

  // -- invoices KPIs
  const totalInvoices = computed(() => _invoices.value.length);
  const totalInvoicesHt = computed(() => fmt(sumHt(_invoices.value)));

  const invoicesPending = computed(() => _invoices.value.filter(i => i.status === 'pending').length);
  const invoicesPendingHt = computed(() => fmt(sumHt(_invoices.value.filter(i => i.status === 'pending'))));

  const invoicesValidated = computed(() => _invoices.value.filter(i => ['validated', 'accepted', 'signed'].includes(i.status)).length);
  const invoicesValidatedHt = computed(() => fmt(sumHt(_invoices.value.filter(i => ['validated', 'accepted', 'signed'].includes(i.status)))));

  const invoicesSent = computed(() => _invoices.value.filter(i => i.isSent).length);
  const invoicesSentHt = computed(() => fmt(sumHt(_invoices.value.filter(i => i.isSent))));

  const recentInvoices = computed(() =>
    [..._invoices.value]
      .sort((a, b) => new Date(b.createdAt ?? b.startDate).getTime() - new Date(a.createdAt ?? a.startDate).getTime())
      .slice(0, 5)
  );

  // -- hero amounts (numeric, HT)
  const PAID_STATUSES = ['validated', 'accepted', 'signed'];
  const paidAmount = computed(() => sumHt(_invoices.value.filter(i => PAID_STATUSES.includes(i.status))));
  const unpaidInvoices = computed(() => _invoices.value.filter(i => i.status === 'pending'));
  const unpaidAmount = computed(() => sumHt(unpaidInvoices.value));
  const unpaidCount = computed(() => unpaidInvoices.value.length);
  const unpaidSentCount = computed(() => unpaidInvoices.value.filter(i => i.isSent).length);
  const unpaidUnsentCount = computed(() => unpaidCount.value - unpaidSentCount.value);

  // an accepted quote already invoiced must not be counted twice
  const invoicedQuoteIds = computed(() => new Set(_invoices.value.map(i => i.quote_id).filter(Boolean)));
  const openQuotes = computed(() =>
    _quotes.value.filter(q =>
      [...OPEN_QUOTE_CODES, 'accepted'].includes(q.status?.code ?? '') && !invoicedQuoteIds.value.has(q.id)
    )
  );
  const openQuotesAmount = computed(() => sumHt(openQuotes.value));
  const openQuotesProcessingCount = computed(() => openQuotes.value.filter(q => OPEN_QUOTE_CODES.includes(q.status?.code ?? '')).length);
  const openQuotesAcceptedCount = computed(() => openQuotes.value.filter(q => q.status?.code === 'accepted').length);

  // -- organization card
  const organizationName = computed(() => authState.userContext.value?.organization.name ?? '');
  const firstName = computed(() => authState.userContext.value?.firstName ?? '');
  const subscription = computed(() => subscriptionState.subscription.value);
  const planName = computed(() => subscription.value?.subscriptionPlan?.name ?? 'Free');
  const isFreePlan = computed(() => (subscription.value?.subscriptionPlan?.code ?? 'FREE') === 'FREE');
  const seatsLimit = computed(() => subscription.value?.seatsLimit ?? 0);
  const seatsUsed = computed(() => totalUsers.value);
  const seatLimitReached = computed(() => seatsLimit.value > 0 && seatsUsed.value >= seatsLimit.value);
  const missingProfileFields = computed(() => {
    const p = profileState.profile.value;
    const missing: string[] = [];
    if (!p.iban || !p.bic) missing.push('IBAN / BIC');
    if (!p.tva_number) missing.push(i18n.global.t('dashboard.missing.vatNumber') as string);
    return missing;
  });

  const companySummary = computed(() => {
    const p = profileState.profile.value;
    return {
      siren: p.siren,
      siret: p.siret,
      tva: p.tva_number,
      iban: p.iban,
      address: [p.address, [p.zip_code, p.city].filter(Boolean).join(' ')].filter(Boolean).join(', '),
      paymentDelay: p.payment_delay ? i18n.global.t('dashboard.paymentDays', { days: p.payment_delay }) as string : '',
    };
  });
  const fetchDashboardStats = async () => {
    loading.value = true;
    try {
      if (!authState.userContext.value) throw new Error('User not found');

      const ctx = authState.userContext.value;
      const isTechnician = ctx.membership.role === 'technician';

      if (!isTechnician) {
        void Promise.allSettled([
          subscriptionState.loadForOrganization(ctx.organization.id),
          profileState.getProfile(),
        ]);
      }

      const [garagesResult, usersResult, quotesResult, invoicesResult] = await Promise.allSettled([
        isTechnician
          ? garageAccessRepo.getGaragesByTechnicianId(ctx.id)
          : garageUseCase.getGaragesByOrganizationId(ctx.organization.id),
        isTechnician
          ? Promise.resolve([])
          : memberUseCase.getMembersByOrganizationId(ctx.organization.id),
        quotesUseCase.execute(ctx.organization.id, ctx.membership.id, ctx.membership.role),
        invoicesUseCase.execute(ctx.organization.id, ctx.membership.id, ctx.membership.role),
      ]);

      if (garagesResult.status === 'fulfilled') totalGarages.value = garagesResult.value.length;
      // The platform super_admin only borrows a membership: it does not use a seat
      if (usersResult.status === 'fulfilled') {
        totalUsers.value = usersResult.value.filter((m) => {
          const user = m.users as { platformRole?: string; platform_role?: string } | undefined;
          return (user?.platformRole ?? user?.platform_role) !== 'super_admin';
        }).length;
      }
      if (quotesResult.status === 'fulfilled') _quotes.value = quotesResult.value.map(QuoteMapper.dtoToView);
      if (invoicesResult.status === 'fulfilled') _invoices.value = invoicesResult.value.map(InvoiceMapper.dtoToView);

    } catch (e) {
      error.value = e;
      console.error('Error fetching dashboard stats:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    totalUsers: computed(() => totalUsers.value),
    totalGarages: computed(() => totalGarages.value),
    totalQuotes,
    totalQuotesHt,
    quotesProcessing,
    quotesProcessingHt,
    quotesFinalized,
    quotesFinalizedHt,
    quotesAccepted,
    quotesAcceptedHt,
    recentQuotes,
    totalInvoices,
    totalInvoicesHt,
    invoicesPending,
    invoicesPendingHt,
    invoicesValidated,
    invoicesValidatedHt,
    invoicesSent,
    invoicesSentHt,
    recentInvoices,
    paidAmount,
    unpaidAmount,
    unpaidCount,
    unpaidSentCount,
    unpaidUnsentCount,
    openQuotesAmount,
    openQuotesProcessingCount,
    openQuotesAcceptedCount,
    organizationName,
    firstName,
    planName,
    isFreePlan,
    seatsLimit,
    seatsUsed,
    seatLimitReached,
    missingProfileFields,
    companySummary,
    loading,
    error,
    fetchDashboardStats,
  };
}
