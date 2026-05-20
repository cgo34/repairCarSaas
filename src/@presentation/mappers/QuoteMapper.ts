import { GarageDto } from "@/@application/dtos/GarageDto";
import { QuoteDto } from "@/@application/dtos/QuoteDto";
import { GarageViewModel } from "../types/models/GarageViewModel";
import { QuoteViewModel } from "../types/models/QuoteViewModel";
import { GarageMapper } from "./GarageMapper";
import { LineItemMapper } from "./LineItemMapper";
import { UserMapper } from "./UserMapper";
import { CountryMapper } from "./CountryMapper";

export class QuoteMapper {
  static viewToDto(view: QuoteViewModel): QuoteDto {

    const garage: GarageDto =
      view.garage
        ? GarageMapper.viewToDto(
            view.garage
          )
        : {
            id: view.garageId,

            organization_id:
              view.organization_id,

            name:
              view.garageName ?? '',

            address:
              view.garageAddress ?? '',

            zip_code:
              view.garageZipCode ?? '',

            city:
              view.garageCity ?? '',

            phone:
              view.garagePhone ?? '',

            email:
              view.garageEmail ?? '',

            percentage_commission:
              view.garagePercentageCommission ??
              0,

            code:
              view.garageName
                ?.toLowerCase() ?? '',
          };

    return {
      id: view.id,

      /**
       * ============================================================
       * ORGANIZATION
       * ============================================================
       */

      organization_id:
        view.organization_id,

      created_by_member_id:
        view.created_by_member_id,

      assigned_member_id:
        view.assigned_member_id ??
        null,

      createdByMember:
        view.createdByMember,

      assignedMember:
        view.assignedMember,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      quoteNumber:
        view.quoteNumber,

      status_id:
        view.status_id,

      status:
        view.status,

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

      garage,

      garageId:
        view.garage?.id ??
        view.garageId,

      /**
       * ============================================================
       * VEHICLE
       * ============================================================
       */

      carBrand:
        view.carBrand ?? '',

      carImmatriculation:
        view.carImmatriculation ??
        '',

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
        view.forfaitAmount,

      totalHt:
        view.totalHt,

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
        view.country
          ? CountryMapper.viewToDto(
              view.country
            )
          : undefined,

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
        view.garage?.name ??
        view.garageName,

      garageAddress:
        view.garage?.address ??
        view.garageAddress,

      garageZipCode:
        view.garage?.zip_code ??
        view.garageZipCode,

      garageCity:
        view.garage?.city ??
        view.garageCity,

      garagePhone:
        view.garage?.phone ??
        view.garagePhone,

      garageEmail:
        view.garage?.email ??
        view.garageEmail,

      garagePercentageCommission:
        view.garage
          ?.percentage_commission ??
        view.garagePercentageCommission,
    };
  }

  static dtoToView(
    dto: QuoteDto
  ): QuoteViewModel {

    const garage: GarageViewModel =
      dto.garage
        ? GarageMapper.dtoToView(
            dto.garage
          )
        : {
            id: dto.garageId,

            organization_id:
              dto.organization_id,

            name:
              dto.garageName ?? '',

            address:
              dto.garageAddress ?? '',

            zip_code:
              dto.garageZipCode ?? '',

            city:
              dto.garageCity ?? '',

            phone:
              dto.garagePhone ?? '',

            email:
              dto.garageEmail ?? '',

            percentage_commission:
              dto.garagePercentageCommission ??
              0,

            code:
              dto.garageName
                ?.toLowerCase() ?? '',
          };

    return {
      id: dto.id,

      /**
       * ============================================================
       * ORGANIZATION
       * ============================================================
       */

      organization_id:
        dto.organization_id,

      created_by_member_id:
        dto.created_by_member_id,

      assigned_member_id:
        dto.assigned_member_id,

      createdByMember:
        dto.createdByMember,

      assignedMember:
        dto.assignedMember,

      /**
       * ============================================================
       * DOCUMENT
       * ============================================================
       */

      quoteNumber:
        dto.quoteNumber,

      status_id:
        dto.status_id,

      status:
        dto.status,

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

      garage,

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
        dto.forfaitAmount,

      totalHt:
        dto.totalHt,

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
        dto.country
          ? CountryMapper.dtoToView(
              dto.country
            )
          : undefined,

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
        ),

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