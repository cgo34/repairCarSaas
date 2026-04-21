import { CountryDto } from "./CountryDto";
import { GarageDto } from "./GarageDto";
import { LineItemDto } from "./LineItemDto";
import { UserDto } from "./UserDto";
import { DocumentStatusDto } from "./DocumentStatusDto";

export interface QuoteDto {
  id?: string;
  quoteNumber: string;

  status_id: string;
  status?: DocumentStatusDto;
  
  userId: string; // 🔹 Ajout pour suivre le créateur du devis
  user?: UserDto; // 🔹 Ajout pour le nom du créateur du devis
  
  startDate: string; // 🔹 ISO String (format pour le stockage en BDD et transmission API)
  endDate: string; // 🔹 ISO String (idem)

  carImmatriculation: string;
  carBrand: string;
  carDate: string;
  vehicleId?: string;
  
  technicianId?: string;
  technician?: UserDto; // 🔹 Ajout pour le nom du technicien
  garageId?: string;
  garage?: GarageDto; // 🔹 Ajout pour le nom du garage

  isForfait: boolean;
  isDisplayUnitPrice: boolean;
  isComputeCommissionWithoutDentRemoval: boolean;
  forfaitAmount?: number;
  country?: CountryDto;
  currency: string;

  lineItems?: LineItemDto[];
  
  isSent: boolean;
  sentAt: string | null; // 🔹 Peut être null

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
