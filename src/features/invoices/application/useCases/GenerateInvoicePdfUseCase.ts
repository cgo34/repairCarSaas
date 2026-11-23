
// @domain/useCases/invoices/IGenerateInvoicePdfUseCase.ts

import { OrganizationProfileDto } from "@/features/organizations/application/dtos/OrganizationProfileDto";
import { LineItemDto } from "@/features/lineItems/application/dtos/LineItemDto";
import { InvoiceDto } from "@/features/invoices/application/dtos/InvoiceDto";

export interface IGenerateInvoicePdfUseCase {
  execute(invoice: InvoiceDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string>;
}

import { IPdfGenerator } from "@/shared/application/ports/IPdfGenerator";

export class GenerateInvoicePdfUseCase implements IGenerateInvoicePdfUseCase {
  constructor(
    private pdfGenerator: IPdfGenerator
  ) {}

  async execute(invoice: InvoiceDto, lines: LineItemDto[], company: OrganizationProfileDto | null): Promise<string> {
    return await this.pdfGenerator.generateInvoice(invoice, lines, company);
  }
}
