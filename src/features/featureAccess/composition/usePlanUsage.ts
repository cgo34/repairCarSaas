import { container } from '@/app/di/container'
import { SYMBOLS } from '@/app/di/tokens'
import type { IAuthState } from '@/features/auth/presentation/state/IAuthState'
import type { ICountQuotesThisMonthUseCase } from '@/features/quotes/application/useCases/CountQuotesThisMonthUseCase'
import type { ICountInvoicesThisMonthUseCase } from '@/features/invoices/application/useCases/CountInvoicesThisMonthUseCase'
import type { ICountConversionsThisMonthUseCase } from '@/features/invoices/application/useCases/CountConversionsThisMonthUseCase'
import { createUsePlanUsage } from '@/features/featureAccess/presentation/composables/usePlanUsage'

export function usePlanUsage() {
  return createUsePlanUsage({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    countQuotesThisMonth: container.get<ICountQuotesThisMonthUseCase>(SYMBOLS.UseCases.Quote.CountQuotesThisMonthUseCase),
    countInvoicesThisMonth: container.get<ICountInvoicesThisMonthUseCase>(SYMBOLS.UseCases.Invoice.CountInvoicesThisMonthUseCase),
    countConversionsThisMonth: container.get<ICountConversionsThisMonthUseCase>(SYMBOLS.UseCases.Invoice.CountConversionsThisMonthUseCase),
  })
}
