import { QuoteDto } from "@/@infrastructure/dtos/QuoteDto";
import { QuoteViewModel } from "../types/models/QuoteViewModel";
import { LineItemMapper } from "./LineItemMapper";

export class QuoteMapper {
  static viewToDto(view: QuoteViewModel): QuoteDto {
    return {
      id: view.id ?? undefined,
      quoteNumber: view.quoteNumber,
      status: view.status,

      userId: view.userId,

      startDate: view.startDate,
      endDate: view.endDate,

      technician: view.technician,
      technicianId: view.technicianId,
      garage: view.garage,
      garageId: view.garageId,

      carBrand: view.carBrand ?? '',
      carId: view.carImmatriculation ?? '',
      carDate: view.carDateEntryCirculation ?? '',

      isForfait: view.isForfait,
      isDisplayUnitPrice: view.isDisplayUnitPrice,
      isComputeCommissionWithoutDentRemoval: view.isComputeCommissionWithoutDentRemoval,
      forfaitAmount: view.forfaitAmount ?? undefined,
      country: view.country ?? undefined,
      currency: view.currency,

      lineItems: view.lineItems?.map((line) => LineItemMapper.viewToDto(line)) ?? [],

      isSent: view.isSent,
      sentAt: view.sentAt ? view.sentAt.toISOString() : null
    };
  }

  static dtoToView(dto: QuoteDto): QuoteViewModel {
    return {
      id: dto.id ?? undefined,
      quoteNumber: dto.quoteNumber,
      status: dto.status,

      userId: dto.userId,

      startDate: dto.startDate,
      endDate: dto.startDate,
      
      technician: dto.technician,
      technicianId: dto.technicianId,
      garage: dto.garage,
      garageId: dto.garageId,

      carBrand: dto.carBrand,
      carImmatriculation: dto.carId,
      carDateEntryCirculation: dto.carDate,

      isForfait: dto.isForfait,
      isDisplayUnitPrice: false,
      isComputeCommissionWithoutDentRemoval: false,
      forfaitAmount: dto.forfaitAmount ?? undefined,
      country: (typeof dto.country === 'string') ? dto.country : dto.country?.code ?? '',
      currency: dto.currency,

      isSent: dto.isSent,
      sentAt: dto.sentAt ? new Date(dto.sentAt) : undefined,
    };
  }
}