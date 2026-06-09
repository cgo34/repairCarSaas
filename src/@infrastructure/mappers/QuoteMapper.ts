import { QuoteApiModel } from '@/@infrastructure/database/api/QuoteApiModel';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { GarageMapper } from './GarageMapper';
import { DocumentStatusMapper } from './DocumentStatusMapper';
import { QuoteDetailMapper } from './QuoteDetailMapper';
import { CountryMapper } from '@/@infrastructure/mappers/CountryMapper';
import { OrganizationMemberMapper } from './OrganizationMemberMapper';

export class QuoteMapper {
  /**
   * Convertit un QuoteApiModel (BDD)
   * en QuoteDto (Application)
   */
  static apiToDto(
    api: QuoteApiModel
  ): QuoteDto {
    return {
      /**
       * ============================================================
       * IDS
       * ============================================================
       */

      id: api.id,

      organization_id:
        api.organization_id,

      created_by_member_id:
        api.created_by_member_id,

      assigned_member_id:
        api.assigned_member_id,

      createdByMember:
        api.created_by_member
          ? OrganizationMemberMapper.apiToDto(
              api.created_by_member
            )
          : undefined,

      assignedMember:
        api.assigned_member
          ? OrganizationMemberMapper.apiToDto(
              api.assigned_member
            )
          : undefined,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      quoteNumber:
        api.quote_number,

      status_id:
        api.status_id,

      status: api.status
        ? DocumentStatusMapper.apiToDto(
            api.status
          )
        : undefined,

      /**
       * ============================================================
       * DATES
       * ============================================================
       */

      startDate:
        api.start_date,

      endDate:
        api.end_date,

      createdAt:
        api.created_at,

      /**
       * ============================================================
       * VEHICLE
       * ============================================================
       */

      carBrand:
        api.car_brand,

      carImmatriculation:
        api.car_immatriculation,

      carYear:
        api.car_year?.toString(),

      /**
       * ============================================================
       * GARAGE
       * ============================================================
       */

      garageId:
        api.garage_id ?? undefined,

      garage: api.garage
        ? GarageMapper.apiToDto(
            api.garage
          )
        : undefined,

      /**
       * ============================================================
       * PRICING
       * ============================================================
       */

      isForfait:
        api.is_forfait,

      forfaitAmount:
        api.forfait_amount ??
        undefined,

      isDisplayUnitPrice:
        api.is_display_unit_price,

      isComputeCommissionWithoutDentRemoval:
        api.is_compute_commission_without_dent_removal,

      totalHt:
        api.is_forfait
          ? (
              api.forfait_amount ?? 0
            )
          : (
              api.quote_details ?? []
            ).reduce(
              (sum, d) =>
                sum +
                (d.price ?? 0) +
                (
                  d.dent_removal_price ??
                  0
                ),
              0
            ) ||
            api.total_ht ||
            0,

      /**
       * ============================================================
       * COMMISSION
       * ============================================================
       */

      commissionRate:
        api.commission_rate ??
        null,

      commissionPaid:
        api.commission_paid ??
        false,

      /**
       * ============================================================
       * COUNTRY / CURRENCY
       * ============================================================
       */

      country: api.country
        ? CountryMapper.apiToDto(
            api.country
          )
        : undefined,

      currency:
        api.currency,

      /**
       * ============================================================
       * EMAIL
       * ============================================================
       */

      isSent:
        api.is_sent,

      sentAt:
        api.sent_at,

      /**
       * ============================================================
       * SNAPSHOT GARAGE
       * ============================================================
       */

      garageName:
        api.garage_name,

      garageAddress:
        api.garage_address,

      garageZipCode:
        api.garage_zip_code,

      garageCity:
        api.garage_city,

      garagePhone:
        api.garage_phone,

      garageEmail:
        api.garage_email,

      garagePercentageCommission:
        api.garage_percentage_commission,

      /**
       * ============================================================
       * LINE ITEMS
       * ============================================================
       */

      lineItems:
        api.quote_details
          ? api.quote_details.map(
              QuoteDetailMapper.apiToDto
            )
          : undefined,
    };
  }

  /**
   * Convertit un `QuoteDto` (Application) en `QuoteApiModel` (BDD)
   */
  static dtoToApi(dto: QuoteDto): QuoteApiModel {
    return {
      id: dto.id,
      quote_number: dto.quoteNumber,

      organization_id: dto.organization_id,
      created_by_member_id: dto.created_by_member_id,
      assigned_member_id: dto.assigned_member_id,
      garage_id: dto.garage?.id ?? null,
      status_id: dto.status_id,

      is_forfait: dto.isForfait ?? false,
      forfait_amount: dto.forfaitAmount ?? null,

      start_date: dto.startDate,
      end_date: dto.endDate,
      // status: dto.status,

      country: dto.country ? CountryMapper.dtoToApi(dto.country) : undefined,
      currency: dto.currency,

      car_brand: dto.carBrand,
      car_immatriculation: dto.carImmatriculation,
      car_year: Number(dto.carYear),
      // vehicle_id: dto.vehicleId,

      total_ht: dto.totalHt,

      commission_rate: dto.commissionRate ?? null,
      commission_paid: dto.commissionPaid ?? false,
      
      is_display_unit_price: dto.isDisplayUnitPrice ?? true,
      is_compute_commission_without_dent_removal: dto.isComputeCommissionWithoutDentRemoval ?? true,
      
      
      // garage info for first level subscription users
      garage_name: dto.garageName,
      garage_address: dto.garageAddress,
      garage_zip_code: dto.garageZipCode,
      garage_city: dto.garageCity,
      garage_phone: dto.garagePhone,
      garage_email: dto.garageEmail,
      garage_percentage_commission: dto.garagePercentageCommission,

      is_sent: dto.isSent,
      sent_at: dto.sentAt,

      created_at: dto.createdAt,
      // archived_at: undefined, // Ajouté pour éviter d'envoyer une valeur non définie à l'API  
    };
  }
}
