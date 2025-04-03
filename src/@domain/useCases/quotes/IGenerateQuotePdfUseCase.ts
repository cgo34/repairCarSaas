// @domain/useCases/quotes/IGenerateQuotePdfUseCase.ts

import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";
import { QuoteDto } from "@/@infrastructure/dtos/QuoteDto";

export interface IGenerateQuotePdfUseCase {
  execute(quote: QuoteDto, lines: LineItemDto[]): Promise<string>; // PDF blob
}
