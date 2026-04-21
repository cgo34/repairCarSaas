import { QuoteDto } from "@/@application/dtos/QuoteDto";

export interface IGetQuoteUseCase {
  execute(quoteId: string): Promise<QuoteDto | null>;
}