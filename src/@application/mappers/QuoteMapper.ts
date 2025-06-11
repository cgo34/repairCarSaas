import { Quote } from '@/@domain/entities/Quote';
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export class QuoteMapper {

  static quoteToInvoice(quoteDto: QuoteDto): InvoiceDto {
      return {
        quoteNumber: quoteDto.quoteNumber,

        statusId: quoteDto.status_id,
        status: quoteDto.status,

        startDate: quoteDto.startDate,
        endDate: quoteDto.endDate,
        carBrand: quoteDto.carBrand,
        carId: quoteDto.carId,
        carDate: quoteDto.carDate,

        technicianId: quoteDto.technicianId,
        technician: quoteDto.technician, // Ajouté si nécessaire
        garageId: quoteDto.garageId ?? undefined,
        garage: quoteDto.garage, // Aj
        userId: quoteDto.userId, // Ajouté si nécessaire
        user: quoteDto.user, // Ajouté si nécessaire
        
        country: quoteDto.country,
        currency: quoteDto.currency,
        
        isForfait: quoteDto.isForfait,
        forfaitAmount: quoteDto.forfaitAmount ?? undefined,
        // isDisplayUnitPrice: quoteDto.isDisplayUnitPrice,
        // isComputeCommissionWithoutDentRemoval: quoteDto.isComputeCommissionWithoutDentRemoval,
        
        // garage info for first level subscription users
        garageName: quoteDto.garageName,
        garageAddress: quoteDto.garageAddress,
        garageZipCode: quoteDto.garageZipCode,
        garageCity: quoteDto.garageCity,
        garagePhone: quoteDto.garagePhone,
        garageEmail: quoteDto.garageEmail,
        garagePercentageCommission: quoteDto.garagePercentageCommission,

        isSent: false,
        sentAt: null,
      };
    }

  /**
   * Convertit un `QuoteDto` en `Quote` (Entité Domain Model)
   */
  static dtoToDomain(dto: QuoteDto): Quote {
    return new Quote(
      dto.id ?? '',
      dto.quoteNumber,
      dto.isForfait,
      dto.forfaitAmount ?? null,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.status_id,
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
   * Convertit un `Quote` (Entité Domain Model) en `QuoteDto`
   */
  static domainToDto(quote: Quote): QuoteDto {
    return {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      isForfait: quote.isForfait,
      forfaitAmount: quote.forfaitAmount ?? undefined,
      startDate: quote.startDate.toISOString(),
      endDate: quote.endDate.toISOString(),
      status_id: quote.status_id,
      country: quote.country,
      currency: quote.currency,
      isSent: quote.isSent,
      sentAt: quote.sentAt ? quote.sentAt.toISOString() : null,
      carBrand: quote.carBrand,
      carId: quote.carId,
      carDate: quote.carDate,
      technicianId: quote.technicianId,
      garageId: quote.garageId,
      userId: quote.userId // 🔹 Inclus l'ID du créateur du devis
    };
  }
}
