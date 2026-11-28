// region -> IMPORTS
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IDownloadService } from '@/shared/application/ports/IDownloadService';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { IGenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { IViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { QuoteMapper } from '@/features/quotes/presentation/mappers/QuoteMapper';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
import { computed, ref } from 'vue';

export interface UseViewQuoteStateDependencies {
  authState: IAuthState;
  viewQuoteUseCase: IViewQuoteUseCase;
  generatePdfUseCase: IGenerateQuotePdfUseCase;
  organizationProfileUseCase: IOrganizationProfileUseCase;
  downloadService: IDownloadService;
  sendQuoteUseCase: ISendQuoteUseCase;
}

export function createUseViewQuoteState(deps: UseViewQuoteStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, viewQuoteUseCase, generatePdfUseCase, organizationProfileUseCase, downloadService, sendQuoteUseCase } = deps;
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const _quote = ref<QuoteViewModel | undefined>(undefined);
  const _pdfUrl = ref<string>('');
  const _lines = ref<{ price?: number; dentRemovalPrice?: number }[]>([]);
  const _company = ref<import('@/features/organizations/application/dtos/OrganizationProfileDto').OrganizationProfileDto | null>(null);
  // #endregion

  // #region -> INIT
  const init = async (quoteId: string) => {
    loading.value = true;
    try {
      const organizationId = authState.userContext?.value?.organization?.id;

      const [{ quote, lines }, company] = await Promise.all([
        viewQuoteUseCase.execute(quoteId),
        organizationId ? organizationProfileUseCase.getProfile(organizationId) : Promise.resolve(null),
      ]);
      _company.value = company;

      if (!quote || !lines) {
        throw new Error('Quote or quote details not found');
      }

      _lines.value = lines;
      _quote.value = QuoteMapper.dtoToView(quote);
      _pdfUrl.value = await generatePdfUseCase.execute(QuoteMapper.viewToDto(_quote.value), lines, company);
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  // #region -> COMPUTED
  const filename = computed(() => {
    return `quote-${_quote.value?.quoteNumber || 'document'}.pdf`;
  });

  const subtotal = computed(() =>
    _quote.value?.isForfait
      ? (_quote.value.forfaitAmount ?? 0)
      : _lines.value.reduce((sum, l) => sum + (l.price ?? 0), 0)
  );
  const totalDegarnissage = computed(() =>
    _quote.value?.isForfait ? 0 : _lines.value.reduce((sum, l) => sum + (l.dentRemovalPrice ?? 0), 0)
  );
  const taxRate = computed(() => {
    const country = _quote.value?.country;
    return typeof country === 'object' && country ? (country.taxRate ?? 0) : 0;
  });
  const totalTax = computed(() => (subtotal.value + totalDegarnissage.value) * (taxRate.value / 100));
  const total = computed(() => subtotal.value + totalDegarnissage.value + totalTax.value);
  // #endregion

  // #region -> METHODS
  const downloadPdf = () => {
    if (!_quote.value)
      throw new Error('Quote is not available');

    if (!_pdfUrl.value)
      throw new Error('PDF URL is not available');

    const filename = `quote-${_quote.value?.quoteNumber || 'document'}.pdf`;
    downloadService.download(_pdfUrl.value, filename);
  };

  const sendQuote = async () => {
    if (!_quote.value?.id) return;
    loading.value = true;
    try {
      await sendQuoteUseCase.execute(_quote.value.id, _company.value);
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
    sendQuote,
    filename,
    subtotal,
    totalDegarnissage,
    taxRate,
    totalTax,
    total,

    quote: computed(() => _quote.value),
    pdfUrl: computed(() => _pdfUrl.value),
  };
}
