// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IDownloadService } from '@/@domain/services/IDownloadService';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { IGenerateInvoicePdfUseCase } from '@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase';
import { ISendInvoiceUseCase } from '@/@domain/useCases/invoices/ISendInvoiceUseCase';
import { IViewInvoiceUseCase } from '@/@domain/useCases/invoices/IViewInvoiceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { InvoiceMapper } from '@/@presentation/mappers/InvoiceMapper';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { computed, ref } from 'vue';

export function useViewInvoiceState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const viewInvoiceUseCase = container.get<IViewInvoiceUseCase>(SYMBOLS.UseCases.Invoice.ViewInvoiceUseCase);
  const generatePdfUseCase = container.get<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase);
  const companySettingsUseCase = container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings);
  const downloadService = container.get<IDownloadService>(SYMBOLS.Services.DownloadService);
  const sendInvoiceUseCase = container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase);
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const _invoice = ref<InvoiceViewModel | undefined>(undefined);
  const _pdfUrl = ref<string>('');
  // #endregion

  // #region -> INIT
  const init = async (invoiceId: string) => {
    loading.value = true;
    try {
      const userId = authState.userContext?.value?.user_id;

      const [{ invoice, lines }, company] = await Promise.all([
        viewInvoiceUseCase.execute(invoiceId),
        userId ? companySettingsUseCase.getByUserId(userId) : Promise.resolve(null),
      ]);

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
    if (!_invoice.value) return;
    loading.value = true;
    try {
      await sendInvoiceUseCase.execute(_invoice.value.id);
    } catch (e) {
      error.value = e as Error;
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
