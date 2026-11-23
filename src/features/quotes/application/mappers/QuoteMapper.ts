import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export class QuoteMapper {

  /**
   * ============================================================
   * QUOTE DTO -> INVOICE DTO
   * ============================================================
   */

  static quoteToInvoice(
    quoteDto: QuoteDto,
    invoiceNumber: string
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

      invoiceNumber,

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

      garagePercentageCommission:
        quoteDto.garagePercentageCommission,

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
    };
  }
}
