import { CountryViewModel } from "./CountryViewModel";
import { DocumentStatusViewModel } from "./DocumentStatusViewModel";
import { GarageViewModel } from "./GarageViewModel";
import { LineItemViewModel } from "./LineItemViewModel";
import { UserViewModel } from "./UserViewModel";

export type QuoteViewModel = {
  id?: string;
  quoteNumber: string;
  status_id: string;
  status: DocumentStatusViewModel;

  userId: string;
  user?: UserViewModel;

  startDate: string;
  endDate: string;

  technicianId?: string;
  technician?: UserViewModel;
  garage?: GarageViewModel;
  garageId?: string;

  carImmatriculation?: string;
  carBrand?: string;
  carDateEntryCirculation?: string;
  vehicleId?: string;

  isForfait: boolean;
  isDisplayUnitPrice: boolean;
  isComputeCommissionWithoutDentRemoval: boolean;
  forfaitAmount?: number;
  country?: CountryViewModel;
  currency: string;

  lineItems?: LineItemViewModel[];

  isSent: boolean;
  sentAt?: Date;

  createdAt?: string;

  // garage info for first level subscription users
  garageName?: string;
  garageAddress?: string;
  garageZipCode?: string;
  garageCity?: string;
  garagePhone?: string;
  garageEmail?: string;
  garagePercentageCommission?: number;
  totalHt?: number;
}