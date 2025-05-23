import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IQuoteRepository {
  generateQuoteNumber(userId: string): Promise<string>;
  
  getAll(): Promise<QuoteDto[]>;
  getAllByUserId(userId: string): Promise<QuoteDto[]>;
  getById(id: string): Promise<QuoteDto | null>;
  // getDetails(quoteId: string): Promise<LineItemDto[]>;
  create(quote: QuoteDto): Promise<QuoteDto>;
  update(quote: QuoteDto): Promise<QuoteDto>;
  delete(id: string): Promise<void>;
  // addLineItem(quoteId: string, lineItem: QuoteLineItemDto): Promise<void>;
  // updateLineItem(quoteId: string, lineItem: QuoteLineItemDto): Promise<void>;
  updateStatus(quoteId: string, statusId: string): Promise<void>;
}
