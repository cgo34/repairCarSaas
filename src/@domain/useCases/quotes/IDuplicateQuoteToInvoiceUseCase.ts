import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export interface IDuplicateQuoteToInvoiceUseCase {
  execute(quoteDto: QuoteDto, quoteLines: LineItemDto[]): Promise<InvoiceDto>;
}
