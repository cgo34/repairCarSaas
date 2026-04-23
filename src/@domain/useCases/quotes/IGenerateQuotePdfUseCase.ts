// @domain/useCases/quotes/IGenerateQuotePdfUseCase.ts

import { CompanySettingsDto } from "@/@application/dtos/CompanySettingsDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { QuoteDto } from "@/@application/dtos/QuoteDto";

export interface IGenerateQuotePdfUseCase {
  execute(quote: QuoteDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string>;
}
