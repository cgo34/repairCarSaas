import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { GarageMapper } from './GarageMapper';
import { UserMapper } from './UserMapper';

export class QuoteMapper {
  /**
   * Convertit un `QuoteApiModel` (BDD) en `QuoteDto` (Application)
   */
  static apiToDto(api: QuoteApiModel): QuoteDto {
    console.log('api', api);
    
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
      technician: api.technician ? UserMapper.apiToDto(api.technician) : undefined, // Ajouté si nécessaire
      garageId: api.garage_id,
      garage: api.garage ? GarageMapper.apiToDto(api.garage) : undefined, // Aj
      userId: api.user_id, // Ajouté si nécessaire
      user: api.user ? UserMapper.apiToDto(api.user) : undefined, // Ajouté si nécessaire
      createdAt: api.created_at
    };
  }

  /**
   * Convertit un `QuoteDto` (Application) en `QuoteApiModel` (BDD)
   */
  static dtoToApi(dto: QuoteDto): QuoteApiModel {
    console.log('update quote dtoToApi', dto);
    
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
      user_id: dto.userId,
      created_at: dto.createdAt
    };
  }
}
