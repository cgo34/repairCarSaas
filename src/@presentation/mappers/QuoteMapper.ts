import { GarageDto } from "@/@infrastructure/dtos/GarageDto";
import { QuoteDto } from "@/@infrastructure/dtos/QuoteDto";
import { GarageViewModel } from "../types/models/GarageViewModel";
import { QuoteStatusViewType } from "../types/models/QuoteStatusViewType";
import { QuoteViewModel } from "../types/models/QuoteViewModel";
import { GarageMapper } from "./GarageMapper";
import { LineItemMapper } from "./LineItemMapper";

const _dbCodeToViewStatus = (status: any): QuoteStatusViewType => {
  const code = typeof status === 'string' ? status : status?.code;
  return ({
    processing: 'pending',
    finalized: 'validated',
    accepted: 'accepted',
    refused: 'cancel',
    cancelled: 'cancel',
  } as Record<string, QuoteStatusViewType>)[code ?? ''] ?? 'pending';
};

export class QuoteMapper {
  static viewToDto(view: QuoteViewModel): QuoteDto {
    const garage: GarageDto = view.garage ? GarageMapper.viewToDto(view.garage) : {
      id: view.garageId,
      name: view.garageName ?? '',
      address: view.garageAddress ?? '',
      zipCode: view.garageZipCode ?? '',
      city: view.garageCity ?? '',
      phone: view.garagePhone ?? '',
      email: view.garageEmail ?? '',
      percentageCommission: view.garagePercentageCommission ?? 0,
      userId: view.userId,
      code: view.garageName?.toLocaleLowerCase() ?? ''
    };

    return {
      id: view.id ?? undefined,
      quoteNumber: view.quoteNumber,
      status_id: view.status_id,
      status: view.status,

      userId: view.userId,

      startDate: view.startDate,
      endDate: view.endDate,

      technician: view.technician,
      technicianId: view.technicianId,
      garage: garage,
      garageId: view.garageId,

      carBrand: view.carBrand ?? '',
      carImmatriculation: view.carImmatriculation ?? '',
      carDate: view.carDateEntryCirculation ?? '',
      vehicleId: view.vehicleId,

      isForfait: view.isForfait,
      isDisplayUnitPrice: view.isDisplayUnitPrice,
      isComputeCommissionWithoutDentRemoval: view.isComputeCommissionWithoutDentRemoval,
      forfaitAmount: view.forfaitAmount ?? undefined,
      country: view.country ?? undefined,
      currency: view.currency,

      lineItems: view.lineItems?.map((line) => LineItemMapper.viewToDto(line)) ?? [],

      isSent: view.isSent,
      sentAt: view.sentAt ? view.sentAt.toISOString() : null,

      createdAt: view.createdAt,
      
      // garage info for first level subscription users
      garageName: view.garageName,
      garageAddress: view.garageAddress,
      garageZipCode: view.garageZipCode,
      garageCity: view.garageCity,
      garagePhone: view.garagePhone,
      garageEmail: view.garageEmail,
      garagePercentageCommission: view.garagePercentageCommission,
      totalHt: view.totalHt,
    };
  }

  static dtoToView(dto: QuoteDto): QuoteViewModel {

    const garage: GarageViewModel = dto.garage ? GarageMapper.dtoToView(dto.garage) : {
      id: dto.garageId,
      name: dto.garageName ?? '',
      address: dto.garageAddress ?? '',
      zipCode: dto.garageZipCode ?? '',
      city: dto.garageCity ?? '',
      phone: dto.garagePhone ?? '',
      email: dto.garageEmail ?? '',
      percentageCommission: dto.garagePercentageCommission ?? 0,
      userId: dto.userId,
      code: dto.garageName?.toLocaleLowerCase() ?? ''
    };

    return {
      id: dto.id ?? undefined,
      quoteNumber: dto.quoteNumber,
      status_id: dto.status_id,
      status: _dbCodeToViewStatus(dto.status),

      userId: dto.userId,

      startDate: dto.startDate,
      endDate: dto.startDate,
      
      technician: dto.technician,
      technicianId: dto.technicianId,
      garage: garage,
      garageId: dto.garageId,

      carBrand: dto.carBrand,
      carImmatriculation: dto.carImmatriculation,
      carDateEntryCirculation: dto.carDate,
      vehicleId: dto.vehicleId,

      isForfait: dto.isForfait,
      isDisplayUnitPrice: false,
      isComputeCommissionWithoutDentRemoval: false,
      forfaitAmount: dto.forfaitAmount ?? undefined,
      country: (typeof dto.country === 'string') ? dto.country : dto.country?.code ?? '',
      currency: dto.currency,

      isSent: dto.isSent,
      sentAt: dto.sentAt ? new Date(dto.sentAt) : undefined,

      createdAt: dto.createdAt,
      
      // garage info for first level subscription users
      garageName: dto.garageName,
      garageAddress: dto.garageAddress,
      garageZipCode: dto.garageZipCode,
      garageCity: dto.garageCity,
      garagePhone: dto.garagePhone,
      garageEmail: dto.garageEmail,
      garagePercentageCommission: dto.garagePercentageCommission,
      totalHt: dto.totalHt,
    };
  }
}