
// @domain/useCases/quotes/IGenerateQuotePdfUseCase.ts

import { OrganizationProfileDto } from "@/features/organizations/application/dtos/OrganizationProfileDto";
import { LineItemDto } from "@/features/lineItems/application/dtos/LineItemDto";
import { QuoteDto } from "@/features/quotes/application/dtos/QuoteDto";

export interface IGenerateQuotePdfUseCase {
  execute(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
}

import { IPdfGenerator } from "@/shared/application/ports/IPdfGenerator";

export class GenerateQuotePdfUseCase implements IGenerateQuotePdfUseCase {
  constructor(
    private pdfGenerator: IPdfGenerator
  ) {}

  async execute(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string> {
    return await this.pdfGenerator.generate(quote, lines, company);
  }
}
