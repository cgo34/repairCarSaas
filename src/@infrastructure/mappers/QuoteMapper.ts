import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { GarageMapper } from './GarageMapper';
import { UserMapper } from './UserMapper';
import { DocumentStatusMapper } from './DocumentStatusMapper';
import { QuoteDetailMapper } from './QuoteDetailMapper';

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
      status_id: api.status_id,
      status: api.status ? DocumentStatusMapper.apiToDto(api.status) : undefined, // Ajouté si nécessaire
      country: api.country,
      currency: api.currency,
      isSent: api.is_sent,
      sentAt: api.sent_at,
      carBrand: api.car_brand,
      carImmatriculation: api.car_immatriculation,
      carDate: api.car_date.toString(),
      vehicleId: api.vehicle_id,
      technicianId: api.technician_id,
      technician: api.technician ? UserMapper.apiToDto(api.technician) : undefined, // Ajouté si nécessaire
      garageId: api.garage_id ?? undefined,
      garage: api.garage ? GarageMapper.apiToDto(api.garage) : undefined, // Aj
      userId: api.user_id, // Ajouté si nécessaire
      user: api.user ? UserMapper.apiToDto(api.user) : undefined, // Ajouté si nécessaire
      createdAt: api.created_at,
      
      // garage info for first level subscription users
      garageName: api.garage_name,
      garageAddress: api.garage_address,
      garageZipCode: api.garage_zip_code,
      garageCity: api.garage_city,
      garagePhone: api.garage_phone,
      garageEmail: api.garage_email,
      garagePercentageCommission: api.garage_percentage_commission,
      totalHt: api.is_forfait
        ? (api.forfait_amount ?? 0)
        : (api.quote_details ?? []).reduce((sum, d) => sum + (d.price ?? 0) + (d.dent_removal_price ?? 0), 0) || api.total_ht || 0,

      lineItems: api.quote_details ? api.quote_details.map(QuoteDetailMapper.apiToDto) : undefined, // Ajouté si nécessaire
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
      status_id: dto.status_id,
      // status: dto.status,
      country: (typeof dto.country === 'string') ? dto.country : dto.country?.code ?? '',
      currency: dto.currency,
      is_sent: dto.isSent,
      sent_at: dto.sentAt,
      car_brand: dto.carBrand,
      car_immatriculation: dto.carImmatriculation,
      car_date: Number(dto.carDate),
      vehicle_id: dto.vehicleId,
      technician_id: dto.technician?.id ?? '',
      garage_id: dto.garage?.id ?? null,
      user_id: dto.userId,
      created_at: dto.createdAt,
      
      // garage info for first level subscription users
      garage_name: dto.garageName,
      garage_address: dto.garageAddress,
      garage_zip_code: dto.garageZipCode,
      garage_city: dto.garageCity,
      garage_phone: dto.garagePhone,
      garage_email: dto.garageEmail,
      garage_percentage_commission: dto.garagePercentageCommission,
      total_ht: dto.totalHt,
    };
  }
}
