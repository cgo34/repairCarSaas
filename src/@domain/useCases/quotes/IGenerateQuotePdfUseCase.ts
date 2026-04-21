// @domain/useCases/quotes/IGenerateQuotePdfUseCase.ts

import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { QuoteDto } from "@/@application/dtos/QuoteDto";

export interface IGenerateQuotePdfUseCase {
  execute(quote: QuoteDto, lines: LineItemDto[]): Promise<string>; // PDF blob
}
