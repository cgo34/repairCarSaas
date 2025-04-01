import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';

export class QuoteMapper {
  /**
   * Convertit un `QuoteApiModel` (BDD) en `QuoteDto` (Application)
   */
  static apiToDto(api: QuoteApiModel): QuoteDto {
    return {
      id: api.id,
      quoteNumber: api.quote_number,
      isForfait: api.is_forfait,
      forfaitAmount: api.forfait_amount ?? undefined,
      isDisplayUnitPrice: api.is_display_unit_price,
      isComputeCommissionWithoutDentRemoval: api.is_compute_commission_without_dent_removal,
      startDate: api.start_date,
      endDate: api.end_date,
      status: api.status,
      country: api.country,
      currency: api.currency,
      isSent: api.is_sent,
      sentAt: api.sent_at,
      carBrand: api.car_brand,
      carId: api.car_id,
      carDate: api.car_date.toString(),
      technicianId: api.technician_id,
      garageId: api.garage_id,
      userId: api.user_id // Ajouté si nécessaire
    };
  }

  /**
   * Convertit un `QuoteDto` (Application) en `QuoteApiModel` (BDD)
   */
  static dtoToApi(dto: QuoteDto): QuoteApiModel {
    return {
      id: dto.id,
      quote_number: dto.quoteNumber,
      is_forfait: dto.isForfait,
      forfait_amount: dto.forfaitAmount ?? null,
      is_display_unit_price: dto.isDisplayUnitPrice,
      is_compute_commission_without_dent_removal: dto.isComputeCommissionWithoutDentRemoval,
      start_date: dto.startDate,
      end_date: dto.endDate,
      status: dto.status,
      country: (typeof dto.country === 'string') ? dto.country : dto.country?.code ?? '',
      currency: dto.currency,
      is_sent: dto.isSent,
      sent_at: dto.sentAt,
      car_brand: dto.carBrand,
      car_id: dto.carId,
      car_date: Number(dto.carDate),
      technician_id: dto.technician?.id ?? '',
      garage_id: dto.garage?.id ?? '',
      user_id: dto.userId
    };
  }
}
