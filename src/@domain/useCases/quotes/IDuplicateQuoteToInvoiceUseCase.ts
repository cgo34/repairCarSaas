import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { LineItemDto } from '@/@application/dtos/LineItemDto';
import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IDuplicateQuoteToInvoiceUseCase {
  execute(quoteDto: QuoteDto, quoteLines: LineItemDto[]): Promise<InvoiceDto>;
}
