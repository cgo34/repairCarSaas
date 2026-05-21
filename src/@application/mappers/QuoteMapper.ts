import { Quote } from '@/@domain/entities/Quote';

import { InvoiceDto } from '@/@application/dtos/InvoiceDto';

import { QuoteDto } from '@/@application/dtos/QuoteDto';

export class QuoteMapper {

  /**
   * ============================================================
   * QUOTE DTO -> INVOICE DTO
   * ============================================================
   */

  static quoteToInvoice(
    quoteDto: QuoteDto
  ): InvoiceDto {

    return {

      /**
       * ============================================================
       * ORGANIZATION
       * ============================================================
       */

      organization_id:
        quoteDto.organization_id,

      created_by_member_id:
        quoteDto.created_by_member_id,

      assigned_member_id:
        quoteDto.assigned_member_id ?? null,

      createdByMember:
        quoteDto.createdByMember,

      assignedMember:
        quoteDto.assignedMember,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      quote_id:
        quoteDto.id,

      quoteNumber:
        quoteDto.quoteNumber,

      status_id:
        quoteDto.status_id,

      status:
        quoteDto.status,

      /**
       * ============================================================
       * DATES
       * ============================================================
       */

      startDate:
        quoteDto.startDate,

      endDate:
        quoteDto.endDate,

      createdAt:
        quoteDto.createdAt,

      /**
       * ============================================================
       * GARAGE
       * ============================================================
       */

      garageId:
        quoteDto.garageId,

      garage:
        quoteDto.garage,

      /**
       * ============================================================
       * VEHICLE
       * ============================================================
       */

      carBrand:
        quoteDto.carBrand,

      carImmatriculation:
        quoteDto.carImmatriculation,

      carYear:
        quoteDto.carYear,

      /**
       * ============================================================
       * PRICING
       * ============================================================
       */

      isForfait:
        quoteDto.isForfait,

      forfaitAmount:
        quoteDto.forfaitAmount,

      isDisplayUnitPrice:
        quoteDto.isDisplayUnitPrice,

      isComputeCommissionWithoutDentRemoval:
        quoteDto.isComputeCommissionWithoutDentRemoval,

      totalHt:
        quoteDto.totalHt,

      /**
       * ============================================================
       * COMMISSION
       * ============================================================
       */

      commissionRate:
        quoteDto.commissionRate ?? null,

      commissionPaid:
        quoteDto.commissionPaid ?? false,

      /**
       * ============================================================
       * COUNTRY / CURRENCY
       * ============================================================
       */

      country:
        quoteDto.country,

      currency:
        quoteDto.currency,

      /**
       * ============================================================
       * ITEMS
       * ============================================================
       */

      lineItems:
        quoteDto.lineItems,

      /**
       * ============================================================
       * EMAIL
       * ============================================================
       */

      isSent: false,

      sentAt: null,

      /**
       * ============================================================
       * SNAPSHOT GARAGE
       * ============================================================
       */

      garageName:
        quoteDto.garageName,

      garageAddress:
        quoteDto.garageAddress,

      garageZipCode:
        quoteDto.garageZipCode,

      garageCity:
        quoteDto.garageCity,

      garagePhone:
        quoteDto.garagePhone,

      garageEmail:
        quoteDto.garageEmail,

      garagePercentageCommission:
        quoteDto.garagePercentageCommission,
    };
  }

  /**
   * ============================================================
   * DTO -> DOMAIN
   * ============================================================
   */

  static dtoToDomain(
    dto: QuoteDto
  ): Quote {

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

      dto.sentAt
        ? new Date(dto.sentAt)
        : null,

      dto.carBrand,

      dto.carImmatriculation,

      dto.carYear,

      dto.assigned_member_id ?? null,

      dto.garageId ?? null,

      dto.created_by_member_id
    );
  }

  /**
   * ============================================================
   * DOMAIN -> DTO
   * ============================================================
   */

  static domainToDto(
    quote: Quote
  ): QuoteDto {

    return {

      id: quote.id,

      quoteNumber:
        quote.quoteNumber,

      organization_id: '',

      created_by_member_id:
        quote.created_by_member_id,

      assigned_member_id:
        quote.assigned_member_id,

      isForfait:
        quote.isForfait,

      forfaitAmount:
        quote.forfaitAmount ?? undefined,

      startDate:
        quote.startDate.toISOString(),

      endDate:
        quote.endDate.toISOString(),

      status_id:
        quote.status_id,

      country:
        quote.country,

      currency:
        quote.currency,

      isSent:
        quote.isSent,

      sentAt:
        quote.sentAt
          ? quote.sentAt.toISOString()
          : null,

      carBrand:
        quote.carBrand,

      carImmatriculation:
        quote.carImmatriculation,

      carYear:
        quote.carYear,

      garageId:
        quote.garageId ?? undefined,
    };
  }
}