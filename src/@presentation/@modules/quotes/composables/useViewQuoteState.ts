// region -> IMPORTS
import { IDownloadService } from '@/@domain/services/IDownloadService';
import { IGenerateQuotePdfUseCase } from '@/@domain/useCases/quotes/IGenerateQuotePdfUseCase';
import { IViewQuoteUseCase } from '@/@domain/useCases/quotes/IViewQuoteUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { QuoteMapper } from '@/@presentation/mappers/QuoteMapper';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { computed, ref } from 'vue';

export function useViewQuoteState() {
  // #region -> DEPENDENCIES
  const viewQuoteUseCase = container.get<IViewQuoteUseCase>(SYMBOLS.UseCases.Quote.ViewQuoteUseCase);
  const generatePdfUseCase = container.get<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase);
  const downloadService = container.get<IDownloadService>(SYMBOLS.Services.DownloadService);
  const sendQuoteUseCase = container.get<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase);

  // #endregion

  // #region -> REFS
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const _quote = ref<QuoteViewModel | undefined>(undefined);
  const _pdfUrl = ref<string>('');
  // #endregion

  // #region -> INIT
  const init = async (quoteId: string) => {
    console.log('init preview for quoteId', quoteId);
    
    loading.value = true;
    try {
      const { quote, lines } = await viewQuoteUseCase.execute(quoteId);

      if (!quote || !lines) {
        throw new Error('Quote or quote details not found');
      }
      
      _quote.value = QuoteMapper.dtoToView(quote);
      console.log('_quote', _quote.value);
      
      _pdfUrl.value = await generatePdfUseCase.execute(QuoteMapper.viewToDto(_quote.value), lines);
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
      await sendQuoteUseCase.execute(_quote.value.id);
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

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