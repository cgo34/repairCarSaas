import { QuoteDto } from "@/@infrastructure/dtos/QuoteDto";

export interface IGetQuoteUseCase {
  execute(userId: string): Promise<QuoteDto | null>;
}