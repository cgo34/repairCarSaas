// @domain/useCases/quotes/IGenerateQuotePdfUseCase.ts

import { OrganizationProfileDto } from "@/@application/dtos/organizations/OrganizationProfileDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { QuoteDto } from "@/@application/dtos/QuoteDto";

export interface IGenerateQuotePdfUseCase {
  execute(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
}
