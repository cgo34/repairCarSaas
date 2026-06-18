import { IAuthState } from "@/@application/states/interfaces/IAuthState";
import { IInvoicesUseCase } from "@/@domain/useCases/invoices/IInvoicesUseCase";
import { container } from "@/@infrastructure/ioc/inversify.config";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { InvoiceMapper } from "@/@presentation/mappers/InvoiceMapper";
import { InvoiceViewModel } from "@/@presentation/types/models/InvoiceViewModel";
import { computed, ref } from "vue";

export function useInvoicesState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const getInvoicesUseCase = container.get<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.GetInvoicesUseCase);
  const deleteInvoiceUseCase = container.get<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase);
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
    deleteInvoiceUseCase.execute(invoiceId);
    _invoices.value = _invoices.value.filter(invoice => invoice.id !== invoiceId);
  }
  // #endregion

  return {
    init,

    invoices: computed(() => _invoices.value),
    deleteInvoice
  }
}