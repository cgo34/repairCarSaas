import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { ISubscriptionState } from '@/features/subscription/presentation/state/ISubscriptionState';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { ICountQuotesThisMonthUseCase } from '@/features/quotes/application/useCases/CountQuotesThisMonthUseCase';
import { ICountInvoicesThisMonthUseCase } from '@/features/invoices/application/useCases/CountInvoicesThisMonthUseCase';
import { ICountConversionsThisMonthUseCase } from '@/features/invoices/application/useCases/CountConversionsThisMonthUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseSubscriptionSeats } from '@/features/subscription/presentation/composables/useSubscriptionSeats';

export function useSubscriptionSeats() {
  return createUseSubscriptionSeats({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    subscriptionState: container.get<ISubscriptionState>(SYMBOLS.States.SubscriptionState),
    memberUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    countQuotesThisMonth: container.get<ICountQuotesThisMonthUseCase>(SYMBOLS.UseCases.Quote.CountQuotesThisMonthUseCase),
    countInvoicesThisMonth: container.get<ICountInvoicesThisMonthUseCase>(SYMBOLS.UseCases.Invoice.CountInvoicesThisMonthUseCase),
        countConversionsThisMonth: container.get<ICountConversionsThisMonthUseCase>(SYMBOLS.UseCases.Invoice.CountConversionsThisMonthUseCase),  });
}
