import { OrganizationProfileDto } from "@/@application/dtos/organizations/OrganizationProfileDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { QuoteDto } from "@/@application/dtos/QuoteDto";
import { IPdfGenerator } from "@/@domain/services/IPdfGenerator";
import { IGenerateQuotePdfUseCase } from "@/@domain/useCases/quotes/IGenerateQuotePdfUseCase";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class GenerateQuotePdfUseCase implements IGenerateQuotePdfUseCase {
  constructor(
    @inject(SYMBOLS.Services.PdfGeneratorService)
    private pdfGenerator: IPdfGenerator
  ) {}

  async execute(quote: QuoteDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string> {
    return await this.pdfGenerator.generate(quote, lines, company);
  }
}
