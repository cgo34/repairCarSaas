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
  const _lines = ref<{ price?: number; dentRemovalPrice?: number }[]>([]);
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

      _lines.value = lines;
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

  // Montants du panneau récapitulatif (même règle de calcul que la vue devis)
  const subtotal = computed(() =>
    _invoice.value?.isForfait
      ? (_invoice.value.forfaitAmount ?? 0)
      : _lines.value.reduce((sum, l) => sum + (l.price ?? 0), 0)
  );
  const totalDegarnissage = computed(() =>
    _invoice.value?.isForfait ? 0 : _lines.value.reduce((sum, l) => sum + (l.dentRemovalPrice ?? 0), 0)
  );
  const taxRate = computed(() => {
    const country = _invoice.value?.country;
    return typeof country === 'object' && country ? (country.taxRate ?? 0) : 0;
  });
  const totalTax = computed(() => (subtotal.value + totalDegarnissage.value) * (taxRate.value / 100));
  const total = computed(() => subtotal.value + totalDegarnissage.value + totalTax.value);
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
    subtotal,
    totalDegarnissage,
    taxRate,
    totalTax,
    total,

    invoice: computed(() => _invoice.value),
    pdfUrl: computed(() => _pdfUrl.value),
  };
}
