import { Invoice } from '@/@domain/entities/Invoice';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

export class InvoiceMapper {
  /**
   * Convertit un `InvoiceDto` en `Invoice` (Entité Domain Model)
   */
  static dtoToDomain(dto: InvoiceDto): Invoice {
    return new Invoice(
      dto.id ?? '',
      dto.invoiceNumber,
      dto.quoteNumber,
      dto.isForfait,
      dto.forfaitAmount ?? null,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.status,
      dto.country ?? '',
      dto.currency,
      dto.isSent,
      dto.sentAt ? new Date(dto.sentAt) : null,
      dto.carBrand,
      dto.carId,
      dto.carDate,
      dto.technicianId,
      dto.garageId,
      dto.userId // 🔹 Ajout du créateur du devis
    );
  }

  /**
   * Convertit un `Invoice` (Entité Domain Model) en `InvoiceDto`
   */
  static domainToDto(invoice: Invoice): InvoiceDto {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      quoteNumber: invoice.quoteNumber,
      isForfait: invoice.isForfait,
      forfaitAmount: invoice.forfaitAmount ?? undefined,
      startDate: invoice.startDate.toISOString(),
      endDate: invoice.endDate.toISOString(),
      status: invoice.status,
      country: invoice.country,
      currency: invoice.currency,
      isSent: invoice.isSent,
      sentAt: invoice.sentAt ? invoice.sentAt.toISOString() : null,
      carBrand: invoice.carBrand,
      carId: invoice.carId,
      carDate: invoice.carDate,
      technicianId: invoice.technicianId,
      garageId: invoice.garageId,
      userId: invoice.userId // 🔹 Inclus l'ID du créateur du devis
    };
  }
}
