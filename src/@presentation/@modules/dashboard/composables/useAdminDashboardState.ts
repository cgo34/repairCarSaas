import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { ISubscriptionState } from '@/@application/states/interfaces/ISubscriptionState';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { IInvoicesUseCase } from '@/@domain/useCases/invoices/IInvoicesUseCase';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { IQuotesUseCase } from '@/@domain/useCases/quotes/IQuotesUseCase';
import { ITechnicianGarageAccessRepository } from '@/@domain/repositories/ITechnicianGarageAccessRepository';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { computed, ref } from 'vue';

export function useAdminDashboardState() {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const subscriptionState = container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState);

  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const memberUseCase = container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase);
  const quotesUseCase = container.get<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase);
  const invoicesUseCase = container.get<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.GetInvoicesUseCase);
  const garageAccessRepo = container.get<ITechnicianGarageAccessRepository>(SYMBOLS.Repositories.TechnicianGarageAccessRepository);

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

  const quotesProcessing = computed(() => _quotes.value.filter(q => q.status?.code === 'processing').length);
  const quotesProcessingHt = computed(() => fmt(sumHt(_quotes.value.filter(q => q.status?.code === 'processing'))));

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

  const fetchDashboardStats = async () => {
    loading.value = true;
    try {
      if (!authState.userContext.value) throw new Error('User not found');

      const ctx = authState.userContext.value;
      const isTechnician = ctx.membership.role === 'technician';

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
      if (usersResult.status === 'fulfilled') totalUsers.value = usersResult.value.length;
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
    loading,
    error,
    fetchDashboardStats,
  };
}
