import { Quote } from '@/@domain/entities/Quote';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export class QuoteMapper {
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
   * Convertit un `Quote` (Entité Domain Model) en `QuoteDto`
   */
  static domainToDto(quote: Quote): QuoteDto {
    console.log('QuoteMapper.domainToDto', quote);
    
    return {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      isForfait: quote.isForfait,
      forfaitAmount: quote.forfaitAmount ?? undefined,
      startDate: quote.startDate.toISOString(),
      endDate: quote.endDate.toISOString(),
      status: quote.status,
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
