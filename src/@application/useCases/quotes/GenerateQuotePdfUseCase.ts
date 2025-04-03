import { IPdfGenerator } from "@/@domain/services/IPdfGenerator";
import { IGenerateQuotePdfUseCase } from "@/@domain/useCases/quotes/IGenerateQuotePdfUseCase";
import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";
import { QuoteDto } from "@/@infrastructure/dtos/QuoteDto";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class GenerateQuotePdfUseCase implements IGenerateQuotePdfUseCase {
  constructor(
    @inject(SYMBOLS.Services.PdfGeneratorService)
    private pdfGenerator: IPdfGenerator
  ) {}

  async execute(quote: QuoteDto, lines: LineItemDto[]): Promise<string> {
    console.log("GenerateQuotePdfUseCase:", quote.id);
    
    return await this.pdfGenerator.generate(quote, lines)
  }
}
