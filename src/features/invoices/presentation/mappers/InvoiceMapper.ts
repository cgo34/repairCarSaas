import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';

import { InvoiceStatusViewType } from '@/features/invoices/presentation/models/InvoiceStatusViewType';

import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';

import { LineItemMapper } from '@/features/lineItems/presentation/mappers/LineItemMapper';
import { OrganizationMemberMapper } from '@/features/organizations/presentation/mappers/OrganizationMemberMapper';
import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';

const _dbCodeToViewStatus = (
  status: DocumentStatusDto | undefined
): InvoiceStatusViewType => {

  const code =
    status?.code;

  return ({
    processing: 'pending',
    finalized: 'validated',
    accepted: 'accepted',
    refused: 'cancel',
    cancelled: 'cancel',
  } as Record<
    string,
    InvoiceStatusViewType
  >)[code ?? ''] ?? 'pending';
};

export class InvoiceMapper {

  /**
   * ============================================================
   * VIEW -> DTO
   * ============================================================
   */

  static viewToDto(
    view: InvoiceViewModel
  ): InvoiceDto {

    return {

      /**
       * ============================================================
       * IDS
       * ============================================================
       */

      id:
        view.id ?? undefined,

      organization_id:
        view.organization_id,

      quote_id:
        view.quote_id,

      created_by_member_id:
        view.created_by_member_id,

      assigned_member_id:
        view.assigned_member_id,

      /**
       * ============================================================
       * MEMBERS
       * ============================================================
       */

      createdByMember:
        view.createdByMember
          ? OrganizationMemberMapper.viewToDto(
              view.createdByMember
            )
          : undefined,

      assignedMember:
        view.assignedMember
          ? OrganizationMemberMapper.viewToDto(
              view.assignedMember
            )
          : undefined,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      invoiceNumber:
        view.invoiceNumber,

      quoteNumber:
        view.quoteNumber,

      status_id:
        view.status_id,

      /**
       * ============================================================
       * DATES
       * ============================================================
       */

      startDate:
        view.startDate,

      endDate:
        view.endDate,

      createdAt:
        view.createdAt,

      /**
       * ============================================================
       * GARAGE
       * ============================================================
       */

      garage:
        view.garage,

      garageId:
        view.garageId,

      /**
       * ============================================================
       * VEHICLE
       * ============================================================
       */

      carBrand:
        view.carBrand ?? '',

      carImmatriculation:
        view.carImmatriculation ?? '',

      carYear:
        view.carYear ?? '',

      /**
       * ============================================================
       * PRICING
       * ============================================================
       */

      isForfait:
        view.isForfait,

      isDisplayUnitPrice:
        view.isDisplayUnitPrice,

      isComputeCommissionWithoutDentRemoval:
        view.isComputeCommissionWithoutDentRemoval,

      forfaitAmount:
        view.forfaitAmount ?? undefined,

      totalHt:
        view.totalHt,

      totalTtc:
        view.totalTtc,

      totalCommission:
        view.totalCommission,

      /**
       * ============================================================
       * COMMISSION
       * ============================================================
       */

      commissionRate:
        view.commissionRate,

      commissionPaid:
        view.commissionPaid,

      /**
       * ============================================================
       * COUNTRY / CURRENCY
       * ============================================================
       */

      country:
        view.country ?? undefined,

      currency:
        view.currency,

      /**
       * ============================================================
       * ITEMS
       * ============================================================
       */

      lineItems:
        view.lineItems?.map(
          LineItemMapper.viewToDto
        ) ?? [],

      /**
       * ============================================================
       * EMAIL
       * ============================================================
       */

      isSent:
        view.isSent,

      sentAt:
        view.sentAt
          ? view.sentAt.toISOString()
          : null,

      /**
       * ============================================================
       * SNAPSHOT GARAGE
       * ============================================================
       */

      garageName:
        view.garageName,

      garageAddress:
        view.garageAddress,

      garageZipCode:
        view.garageZipCode,

      garageCity:
        view.garageCity,

      garagePhone:
        view.garagePhone,

      garageEmail:
        view.garageEmail,

      garagePercentageCommission:
        view.garagePercentageCommission,
    };
  }

  /**
   * ============================================================
   * DTO -> VIEW
   * ============================================================
   */

  static dtoToView(
    dto: InvoiceDto
  ): InvoiceViewModel {

    return {

      /**
       * ============================================================
       * IDS
       * ============================================================
       */

      id:
        dto.id ?? undefined,

      organization_id:
        dto.organization_id,

      quote_id:
        dto.quote_id,

      created_by_member_id:
        dto.created_by_member_id,

      assigned_member_id:
        dto.assigned_member_id,

      /**
       * ============================================================
       * MEMBERS
       * ============================================================
       */

      createdByMember:
        dto.createdByMember
          ? OrganizationMemberMapper.dtoToView(
              dto.createdByMember
            )
          : undefined,

      assignedMember:
        dto.assignedMember
          ? OrganizationMemberMapper.dtoToView(
              dto.assignedMember
            )
          : undefined,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      invoiceNumber:
        dto.invoiceNumber,

      quoteNumber:
        dto.quoteNumber,

      status:
        _dbCodeToViewStatus(
          dto.status
        ),

      status_id:
        dto.status_id,

      /**
       * ============================================================
       * DATES
       * ============================================================
       */

      startDate:
        dto.startDate,

      endDate:
        dto.endDate,

      createdAt:
        dto.createdAt,

      /**
       * ============================================================
       * GARAGE
       * ============================================================
       */

      garage:
        dto.garage,

      garageId:
        dto.garageId,

      /**
       * ============================================================
       * VEHICLE
       * ============================================================
       */

      carBrand:
        dto.carBrand,

      carImmatriculation:
        dto.carImmatriculation,

      carYear:
        dto.carYear,

      /**
       * ============================================================
       * PRICING
       * ============================================================
       */

      isForfait:
        dto.isForfait,

      isDisplayUnitPrice:
        dto.isDisplayUnitPrice,

      isComputeCommissionWithoutDentRemoval:
        dto.isComputeCommissionWithoutDentRemoval,

      forfaitAmount:
        dto.forfaitAmount ?? undefined,

      totalHt:
        dto.totalHt,

      totalTtc:
        dto.totalTtc,

      totalCommission:
        dto.totalCommission,

      /**
       * ============================================================
       * COMMISSION
       * ============================================================
       */

      commissionRate:
        dto.commissionRate,

      commissionPaid:
        dto.commissionPaid,

      /**
       * ============================================================
       * COUNTRY / CURRENCY
       * ============================================================
       */

      country:
        typeof dto.country === 'string'
          ? dto.country
          : dto.country?.code ?? '',

      currency:
        dto.currency,

      /**
       * ============================================================
       * ITEMS
       * ============================================================
       */

      lineItems:
        dto.lineItems?.map(
          LineItemMapper.dtoToView
        ) ?? [],

      /**
       * ============================================================
       * EMAIL
       * ============================================================
       */

      isSent:
        dto.isSent,

      sentAt:
        dto.sentAt
          ? new Date(dto.sentAt)
          : undefined,

      /**
       * ============================================================
       * SNAPSHOT GARAGE
       * ============================================================
       */

      garageName:
        dto.garageName,

      garageAddress:
        dto.garageAddress,

      garageZipCode:
        dto.garageZipCode,

      garageCity:
        dto.garageCity,

      garagePhone:
        dto.garagePhone,

      garageEmail:
        dto.garageEmail,

      garagePercentageCommission:
        dto.garagePercentageCommission,
    };
  }
}