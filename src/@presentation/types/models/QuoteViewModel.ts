import { CountryViewModel } from "./CountryViewModel";
import { GarageViewModel } from "./GarageViewModel";
import { LineItemViewModel } from "./LineItemViewModel";
import { QuoteStatusViewType } from "./QuoteStatusViewType";
import { UserViewModel } from "./UserViewModel";

/*


      id: quote.id,
      quoteNumber: quote.quoteNumber,
      isForfait: quote.isForfait,
      forfaitAmount: quote.forfaitAmount,
      startDate: quote.startDate.toISOString(),
      endDate: quote.endDate.toISOString(),
      status: quote.status,
      country: quote.country,
      currency: quote.currency,
      isSent: quote.isSent,
      sentAt: quote.sentAt ? quote.sentAt.toISOString() : null,
      carBrand: quote.carBrand,
      carId: quote.carId,
      carDate: quote.carDate,
      technicianId: quote.technicianId,
      garageId: quote.garageId,
      userId: quote.userId // 🔹 Inclus l'ID du créateur du devis

      */

export interface QuoteViewModel {
  id?: string;
  quoteNumber: string;
  status: QuoteStatusViewType;

  userId: string;

  startDate: string;
  endDate: string;

  technician?: UserViewModel;
  technicianId?: string;
  garage?: GarageViewModel;
  garageId?: string;

  carImmatriculation?: string;
  carBrand?: string;
  carDateEntryCirculation?: string;

  isForfait: boolean;
  isDisplayUnitPrice: boolean;
  isComputeCommissionWithoutDentRemoval: boolean;
  forfaitAmount?: number;
  country?: CountryViewModel;
  currency: string;

  lineItems?: LineItemViewModel[];

  isSent: boolean;
  sentAt?: Date;

  createdAt?: string
}