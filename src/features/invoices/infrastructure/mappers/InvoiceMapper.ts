import { InvoiceApiModel } from '@/features/invoices/infrastructure/api/InvoiceApiModel';

import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

import { GarageMapper } from '@/features/garages/infrastructure/mappers/GarageMapper';

import { OrganizationMemberMapper } from '@/features/organizations/infrastructure/mappers/OrganizationMemberMapper';

import { DocumentStatusMapper } from '@/features/documentStatuses/infrastructure/mappers/DocumentStatusMapper';

import { LineItemMapper } from '@/features/lineItems/infrastructure/mappers/LineItemMapper';

export class InvoiceMapper {

  /**
   * ============================================================
   * API -> DTO
   * ============================================================
   */

  static apiToDto(
    api: InvoiceApiModel
  ): InvoiceDto {

    return {

      /**
       * ============================================================
       * IDS
       * ============================================================
       */

      id: api.id,

      quote_id:
        api.quote_id,

      organization_id:
        api.organization_id,

      created_by_member_id:
        api.created_by_member_id,

      assigned_member_id:
        api.assigned_member_id,

      /**
       * ============================================================
       * MEMBERS
       * ============================================================
       */

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

      invoiceNumber:
        api.invoice_number,

      quoteNumber:
        api.quote_number,

      status_id:
        api.status_id,

      status:
        api.status
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
       * GARAGE
       * ============================================================
       */

      garageId:
        api.garage_id ?? undefined,

      garage:
        api.garage
          ? GarageMapper.apiToDto(
              api.garage
            )
          : undefined,

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
       * PRICING
       * ============================================================
       */

      isForfait:
        api.is_forfait,

      forfaitAmount:
        api.forfait_amount ?? undefined,

      isDisplayUnitPrice:
        api.is_display_unit_price,

      isComputeCommissionWithoutDentRemoval:
        api.is_compute_commission_without_dent_removal,

      totalHt:
        api.total_ht,

      totalTtc:
        api.total_ttc,

      totalCommission:
        api.total_commission,

      /**
       * ============================================================
       * COMMISSION
       * ============================================================
       */

      commissionRate:
        api.commission_rate ?? null,

      commissionPaid:
        api.commission_paid,

      /**
       * ============================================================
       * COUNTRY / CURRENCY
       * ============================================================
       */

      country:
        api.country,

      currency:
        api.currency,

      /**
       * ============================================================
       * ITEMS
       * ============================================================
       */

      lineItems:
        api.invoice_details
          ?.map(
            LineItemMapper.apiToDto
          ) ?? [],

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
    };
  }

  /**
   * ============================================================
   * DTO -> API
   * ============================================================
   */

  static dtoToApi(
    dto: InvoiceDto
  ): InvoiceApiModel {

    return {

      /**
       * ============================================================
       * IDS
       * ============================================================
       */

      id: dto.id,

      quote_id:
        dto.quote_id,

      organization_id:
        dto.organization_id,

      created_by_member_id:
        dto.created_by_member_id,

      assigned_member_id:
        dto.assigned_member_id ?? null,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      invoice_number:
        dto.invoiceNumber,

      quote_number:
        dto.quoteNumber,

      status_id:
        dto.status_id,

      /**
       * ============================================================
       * DATES
       * ============================================================
       */

      start_date:
        dto.startDate,

      end_date:
        dto.endDate,

      created_at:
        dto.createdAt,

      /**
       * ============================================================
       * GARAGE
       * ============================================================
       */

      garage_id:
        dto.garage?.id ?? dto.garageId ?? null,

      /**
       * ============================================================
       * VEHICLE
       * ============================================================
       */

      car_brand:
        dto.carBrand,

      car_immatriculation:
        dto.carImmatriculation,

      car_year:
        dto.carYear
          ? Number(dto.carYear)
          : null,

      /**
       * ============================================================
       * PRICING
       * ============================================================
       */

      is_forfait:
        dto.isForfait,

      forfait_amount:
        dto.forfaitAmount ?? null,

      is_display_unit_price:
        dto.isDisplayUnitPrice,

      is_compute_commission_without_dent_removal:
        dto.isComputeCommissionWithoutDentRemoval,

      total_ht:
        dto.totalHt,

      total_ttc:
        dto.totalTtc,

      total_commission:
        dto.totalCommission,

      /**
       * ============================================================
       * COMMISSION
       * ============================================================
       */

      commission_rate:
        dto.commissionRate ?? null,

      commission_paid:
        dto.commissionPaid ?? false,

      /**
       * ============================================================
       * COUNTRY / CURRENCY
       * ============================================================
       */

      country:
        typeof dto.country ===
        'string'
          ? dto.country
          : dto.country?.code ??
            '',

      currency:
        dto.currency,

      /**
       * ============================================================
       * EMAIL
       * ============================================================
       */

      is_sent:
        dto.isSent,

      sent_at:
        dto.sentAt,

      /**
       * ============================================================
       * SNAPSHOT GARAGE
       * ============================================================
       */

      garage_name:
        dto.garageName,

      garage_address:
        dto.garageAddress,

      garage_zip_code:
        dto.garageZipCode,

      garage_city:
        dto.garageCity,

      garage_phone:
        dto.garagePhone,

      garage_email:
        dto.garageEmail,

      garage_percentage_commission:
        dto.garagePercentageCommission,
    };
  }
}