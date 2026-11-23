// region -> IMPORTS
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IDownloadService } from '@/shared/application/ports/IDownloadService';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { IGenerateInvoicePdfUseCase } from '@/features/invoices/application/useCases/GenerateInvoicePdfUseCase';
import { ISendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { IViewInvoiceUseCase } from '@/features/invoices/application/useCases/ViewInvoiceUseCase';
import { InvoiceMapper } from '@/features/invoices/presentation/mappers/InvoiceMapper';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';
import { computed, ref } from 'vue';

export interface UseViewInvoiceStateDependencies {
  authState: IAuthState;
  viewInvoiceUseCase: IViewInvoiceUseCase;
  generatePdfUseCase: IGenerateInvoicePdfUseCase;
  organizationProfileUseCase: IOrganizationProfileUseCase;
  downloadService: IDownloadService;
  sendInvoiceUseCase: ISendInvoiceUseCase;
}

export function createUseViewInvoiceState(deps: UseViewInvoiceStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, viewInvoiceUseCase, generatePdfUseCase, organizationProfileUseCase, downloadService, sendInvoiceUseCase } = deps;
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const _invoice = ref<InvoiceViewModel | undefined>(undefined);
  const _pdfUrl = ref<string>('');
  const _company = ref<import('@/features/organizations/application/dtos/OrganizationProfileDto').OrganizationProfileDto | null>(null);
  // #endregion

  // #region -> INIT
  const init = async (invoiceId: string) => {
    loading.value = true;
    try {
      const organizationId = authState.userContext?.value?.organization?.id;

      const [{ invoice, lines }, company] = await Promise.all([
        viewInvoiceUseCase.execute(invoiceId),
        organizationId ? organizationProfileUseCase.getProfile(organizationId) : Promise.resolve(null),
      ]);
      _company.value = company;

      if (!invoice || !lines) {
        throw new Error('Invoice or invoice details not found');
      }

      _invoice.value = InvoiceMapper.dtoToView(invoice);
      _pdfUrl.value = await generatePdfUseCase.execute(invoice, lines, company);
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  // #region -> COMPUTED
  const filename = computed(() => {
    return `invoice-${_invoice.value?.invoiceNumber || 'document'}.pdf`;
  });
  // #endregion

  // #region -> METHODS
  const downloadPdf = () => {
    if (!_invoice.value)
      throw new Error('Invoice is not available');

    if (!_pdfUrl.value)
      throw new Error('PDF URL is not available');

    const filename = `invoice-${_invoice.value?.invoiceNumber || 'document'}.pdf`;
    downloadService.download(_pdfUrl.value, filename);
  };

  const sendInvoice = async () => {
    const invoiceId = _invoice.value?.id;
    if (!invoiceId) return;
    loading.value = true;
    try {
      await sendInvoiceUseCase.execute(invoiceId, _company.value);
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  return {
    loading,
    error,

    init,
    downloadPdf,
    sendInvoice,
    filename,

    invoice: computed(() => _invoice.value),
    pdfUrl: computed(() => _pdfUrl.value),
  };
}
