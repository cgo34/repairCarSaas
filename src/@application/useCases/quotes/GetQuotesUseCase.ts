import { QuoteService } from '@/@application/services/QuoteService';

export class GetQuotesUseCase {
  private quoteService: QuoteService;

  constructor(quoteService: QuoteService) {
    this.quoteService = quoteService;
  }

  async execute() {
    return await this.quoteService.getAllQuotes();
  }
}
