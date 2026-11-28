import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';

export interface IUpdateQuoteUseCase {
  execute(quoteDto: QuoteDto): Promise<QuoteDto>;
}

const DECIDED_STATUS_CODES = ['accepted', 'signed', 'validated', 'invoiced', 'refused', 'cancelled', 'cancel'];

export class UpdateQuoteUseCase implements IUpdateQuoteUseCase {
  constructor(
    private quoteRepository: IQuoteRepository,
    private getDocumentStatusUseCase: IGetDocumentStatusUseCase,
  ) {}

  async execute(quote: QuoteDto): Promise<QuoteDto> {
    // A sent quote that is still open goes back to draft once modified; sentAt is kept.
    const isDecided = DECIDED_STATUS_CODES.includes(quote.status?.code ?? '');
    if (quote.isSent && !isDecided) {
      const draft = await this.getDocumentStatusUseCase.getByCode('draft');
      if (draft?.id) {
        quote = { ...quote, isSent: false, status_id: draft.id, status: draft };
      }
    }
    return await this.quoteRepository.update(quote);
  }
}