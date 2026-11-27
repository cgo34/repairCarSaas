import { ref } from 'vue'
import type { IAuthState } from '@/features/auth/presentation/state/IAuthState'
import type { ICountQuotesThisMonthUseCase } from '@/features/quotes/application/useCases/CountQuotesThisMonthUseCase'
import type { ICountInvoicesThisMonthUseCase } from '@/features/invoices/application/useCases/CountInvoicesThisMonthUseCase'
import type { ICountConversionsThisMonthUseCase } from '@/features/invoices/application/useCases/CountConversionsThisMonthUseCase'

export interface UsePlanUsageDependencies {
  authState: IAuthState
  countQuotesThisMonth: ICountQuotesThisMonthUseCase
  countInvoicesThisMonth: ICountInvoicesThisMonthUseCase
  countConversionsThisMonth: ICountConversionsThisMonthUseCase
}

// Monthly consumption of the quotas, to compare with the limits from useFeatureAccess
export function createUsePlanUsage(deps: UsePlanUsageDependencies) {
  const { authState, countQuotesThisMonth, countInvoicesThisMonth, countConversionsThisMonth } = deps

  const quotesUsed = ref(0)
  const invoicesUsed = ref(0)
  const conversionsUsed = ref(0)

  const load = async (): Promise<void> => {
    const orgId = authState.userContext.value?.organization.id
    if (!orgId) return
    const [quotes, invoices, conversions] = await Promise.allSettled([
      countQuotesThisMonth.execute(orgId),
      countInvoicesThisMonth.execute(orgId),
      countConversionsThisMonth.execute(orgId),
    ])
    if (quotes.status === 'fulfilled') quotesUsed.value = quotes.value
    if (invoices.status === 'fulfilled') invoicesUsed.value = invoices.value
    if (conversions.status === 'fulfilled') conversionsUsed.value = conversions.value
  }

  return { quotesUsed, invoicesUsed, conversionsUsed, load }
}
