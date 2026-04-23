import { CompanySettingsDto } from "@/@application/dtos/CompanySettingsDto";
import { LineItemDto } from "@/@application/dtos/LineItemDto";
import { InvoiceDto } from "@/@application/dtos/InvoiceDto";
import { IPdfGenerator } from "@/@domain/services/IPdfGenerator";
import { IGenerateInvoicePdfUseCase } from "@/@domain/useCases/invoices/IGenerateInvoicePdfUseCase";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class GenerateInvoicePdfUseCase implements IGenerateInvoicePdfUseCase {
  constructor(
    @inject(SYMBOLS.Services.PdfGeneratorService)
    private pdfGenerator: IPdfGenerator
  ) {}

  async execute(invoice: InvoiceDto, lines: LineItemDto[], company: CompanySettingsDto | null): Promise<string> {
    return await this.pdfGenerator.generateInvoice(invoice, lines, company);
  }
}
