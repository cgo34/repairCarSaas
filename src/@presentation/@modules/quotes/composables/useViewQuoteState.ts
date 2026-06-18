// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IDownloadService } from '@/@domain/services/IDownloadService';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { IViewQuoteUseCase } from '@/@domain/useCases/quotes/IViewQuoteUseCase';
import { ISendQuoteUseCase } from '@/@domain/useCases/quotes/ISendQuoteUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { computed, ref } from 'vue';

export function useViewQuoteState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const viewQuoteUseCase = container.get<IViewQuoteUseCase>(SYMBOLS.UseCases.Quote.ViewQuoteUseCase);
  const generatePdfUseCase = container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase);
  const companySettingsUseCase = container.get<ICompanySettingsUseCase>(SYMBOLS.UseCases.CompanySettings);
  const downloadService = container.get<IDownloadService>(SYMBOLS.Services.DownloadService);
  const sendQuoteUseCase = container.get<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase);
  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const _quote = ref<QuoteViewModel | undefined>(undefined);
  const _pdfUrl = ref<string>('');
  const _company = ref<import('@/@application/dtos/CompanySettingsDto').CompanySettingsDto | null>(null);
  // #endregion

  // #region -> INIT
  const init = async (quoteId: string) => {
    loading.value = true;
    try {
      const userId = authState.userContext?.value?.organization?.ownerUserId
        ?? authState.userContext?.value?.id;

      const [{ quote, lines }, company] = await Promise.all([
        viewQuoteUseCase.execute(quoteId),
        userId ? companySettingsUseCase.getByUserId(userId) : Promise.resolve(null),
      ]);
      _company.value = company;

      if (!quote || !lines) {
        throw new Error('Quote or quote details not found');
      }

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
    if (!_quote.value) return;
    loading.value = true;
    try {
      await sendQuoteUseCase.execute(_quote.value.id, _company.value);
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
    sendQuote,
    filename,

    quote: computed(() => _quote.value),
    pdfUrl: computed(() => _pdfUrl.value),
  };
}
