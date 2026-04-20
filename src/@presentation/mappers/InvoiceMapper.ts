import { InvoiceDto } from "@/@infrastructure/dtos/InvoiceDto";
import { InvoiceViewModel } from "../types/models/InvoiceViewModel";
import { LineItemMapper } from "./LineItemMapper";

export class InvoiceMapper {
  static viewToDto(view: InvoiceViewModel): InvoiceDto {
    return {
      id: view.id ?? undefined,
      invoiceNumber: view.invoiceNumber,
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
      carImmatriculation: view.carImmatriculation ?? '',
      carDate: view.carDateEntryCirculation ?? '',
      vehicleId: view.vehicleId,

      isForfait: view.isForfait,
      // isDisplayUnitPrice: view.isDisplayUnitPrice,
      // isComputeCommissionWithoutDentRemoval: view.isComputeCommissionWithoutDentRemoval,
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

  static dtoToView(dto: InvoiceDto): InvoiceViewModel {
    return {
      id: dto.id ?? undefined,
      invoiceNumber: dto.invoiceNumber,
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