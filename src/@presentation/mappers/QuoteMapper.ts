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
      user: view.user ? UserMapper.viewToDto(view.user) : undefined,

      startDate: view.startDate,
      endDate: view.endDate,

      technician: view.technician ? UserMapper.viewToDto(view.technician) : undefined,
      technicianId: view.technician?.id ?? view.technicianId,
      garage: garage,
      garageId: view.garage?.id ?? view.garageId,

      carBrand: view.carBrand ?? '',
      carImmatriculation: view.carImmatriculation ?? '',
      carDate: view.carDateEntryCirculation ?? '',
      vehicleId: view.vehicleId,

      isForfait: view.isForfait ?? false,
      isDisplayUnitPrice: view.isDisplayUnitPrice ?? true,
      isComputeCommissionWithoutDentRemoval: view.isComputeCommissionWithoutDentRemoval ?? true,
      forfaitAmount: view.forfaitAmount ?? undefined,
      country: view.country ? CountryMapper.viewToDto(view.country) : undefined,
      currency: view.currency,

      lineItems: view.lineItems?.map((line) => LineItemMapper.viewToDto(line)) ?? [],

      isSent: view.isSent,
      sentAt: view.sentAt ? view.sentAt.toISOString() : null,

      createdAt: view.createdAt,
      
      // garage info for first level subscription users - prioriser les valeurs de l'objet garage
      garageName: view.garage?.name ?? view.garageName,
      garageAddress: view.garage?.address ?? view.garageAddress,
      garageZipCode: view.garage?.zipCode ?? view.garageZipCode,
      garageCity: view.garage?.city ?? view.garageCity,
      garagePhone: view.garage?.phone ?? view.garagePhone,
      garageEmail: view.garage?.email ?? view.garageEmail,
      garagePercentageCommission: view.garage?.percentageCommission ?? view.garagePercentageCommission,
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
      status: dto.status,
      
      country: dto.country ? CountryMapper.dtoToView(dto.country) : undefined,

      userId: dto.userId,
      user: dto.user ? UserMapper.dtoToView(dto.user) : undefined,

      startDate: dto.startDate,
      endDate: dto.endDate,
      
      technician: dto.technician ? UserMapper.dtoToView(dto.technician) : undefined,
      technicianId: dto.technicianId,
      garage: garage,
      garageId: dto.garageId,

      carBrand: dto.carBrand,
      carImmatriculation: dto.carImmatriculation,
      carDateEntryCirculation: dto.carDate,
      vehicleId: dto.vehicleId,

      isForfait: dto.isForfait,
      isDisplayUnitPrice: dto.isDisplayUnitPrice,
      isComputeCommissionWithoutDentRemoval: dto.isComputeCommissionWithoutDentRemoval,
      forfaitAmount: dto.forfaitAmount ?? undefined,
      country: dto.country ? CountryMapper.dtoToView(dto.country) : undefined,
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