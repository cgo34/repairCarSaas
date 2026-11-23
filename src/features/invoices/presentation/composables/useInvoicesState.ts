import { IAuthState } from "@/features/auth/presentation/state/IAuthState";
import { IInvoicesUseCase } from '@/features/invoices/application/useCases/GetInvoicesUseCase';
import { IDeleteInvoiceUseCase } from '@/features/invoices/application/useCases/DeleteInvoiceUseCase';
import { IMarkInvoiceAsPaidUseCase } from '@/features/invoices/application/useCases/MarkInvoiceAsPaidUseCase';
import { InvoiceMapper } from "@/features/invoices/presentation/mappers/InvoiceMapper";
import { InvoiceViewModel } from "@/features/invoices/presentation/models/InvoiceViewModel";
import { computed, ref } from "vue";

export interface UseInvoicesStateDependencies {
  authState: IAuthState;
  getInvoicesUseCase: IInvoicesUseCase;
  deleteInvoiceUseCase: IDeleteInvoiceUseCase;
  markInvoiceAsPaidUseCase: IMarkInvoiceAsPaidUseCase;
}

export function createUseInvoicesState(deps: UseInvoicesStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, getInvoicesUseCase, deleteInvoiceUseCase, markInvoiceAsPaidUseCase } = deps;
  // #endregion

  // #region -> REFS
  const _invoices = ref<InvoiceViewModel[]>([]);
  // #endregion

  // #region -> METHODS
  const init = async () => {
    try {
      if (authState.isAuthenticated && authState.userContext.value) {
        const invoicesDto = await getInvoicesUseCase.execute(
          authState.userContext.value?.organization.id,
          authState.userContext.value.membership.id,
          authState.userContext.value?.membership.role
        );
        _invoices.value = invoicesDto.map(invoice => InvoiceMapper.dtoToView(invoice));
      }
    } catch (e) {
      console.error('[Invoices] Erreur lors du chargement des factures:', e);
    }
  }

  const deleteInvoice = async (invoiceId: string) => {
    await deleteInvoiceUseCase.execute(invoiceId);
    _invoices.value = _invoices.value.filter(invoice => invoice.id !== invoiceId);
  }
  const markAsPaid = async (invoiceId: string) => {
    const status = await markInvoiceAsPaidUseCase.execute(invoiceId);
    const idx = _invoices.value.findIndex(invoice => invoice.id === invoiceId);
    if (idx !== -1) {
      _invoices.value[idx] = {
        ..._invoices.value[idx],
        status_id: status.id,
        status: status as unknown as InvoiceViewModel['status'],
      };
    }
  }
  // #endregion

  return {
    init,

    invoices: computed(() => _invoices.value),
    deleteInvoice,
    markAsPaid
  }
}