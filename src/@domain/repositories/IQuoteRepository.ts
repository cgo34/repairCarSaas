import { Quote } from '@/@domain/entities/Quote';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { QuoteLineItemDto } from '@/@infrastructure/dtos/QuoteLineItemDto';
import { QuoteStatusDto } from '@/@infrastructure/dtos/QuoteStatusDto';

export interface IQuoteRepository {
  generateQuoteNumber(): Promise<string>;
  getAll(): Promise<QuoteDto[]>;
  getAllByUserId(userId: string): Promise<QuoteDto[]>;
  getById(id: string): Promise<QuoteDto | null>;
  getDetails(quoteId: string): Promise<LineItemDto[]>;
  create(quote: QuoteDto): Promise<QuoteDto>;
  update(quote: Quote): Promise<void>;
  delete(id: string): Promise<void>;
  // addLineItem(quoteId: string, lineItem: QuoteLineItemDto): Promise<void>;
  // updateLineItem(quoteId: string, lineItem: QuoteLineItemDto): Promise<void>;
  updateStatus(quoteId: string, status: QuoteStatusDto): Promise<void>;
}
