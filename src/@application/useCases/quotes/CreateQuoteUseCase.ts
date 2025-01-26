import { QuoteService } from '@/@application/services/QuoteService';
import { Quote } from '@/@domain/entities/Quote';

export class CreateQuoteUseCase {
  private quoteService: QuoteService;

  constructor(quoteService: QuoteService) {
    this.quoteService = quoteService;
  }

  async execute(quote: Quote) {
    return await this.quoteService.createQuote(quote);
  }
}
