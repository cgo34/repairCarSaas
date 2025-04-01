import { CountryDto } from "@/@application/dtos/CountryDto";
import { GarageDto } from "./GarageDto";
import { UserDto } from "./UserDto";

export interface QuoteDto {
  id?: string;
  quoteNumber: string;
  status: 'pending' | 'cancel' | 'draft' | 'validated' | 'accepted' | 'signed' | 'sent' | 'draft';
  
  userId: string; // 🔹 Ajout pour suivre le créateur du devis
  
  startDate: string; // 🔹 ISO String (format pour le stockage en BDD et transmission API)
  endDate: string; // 🔹 ISO String (idem)

  carId: string;
  carBrand: string;
  carDate: string;
  
  technicianId?: string;
  technician?: UserDto; // 🔹 Ajout pour le nom du technicien
  garageId?: string;
  garage?: GarageDto; // 🔹 Ajout pour le nom du garage

  isForfait: boolean;
  isDisplayUnitPrice: boolean;
  isComputeCommissionWithoutDentRemoval: boolean;
  forfaitAmount?: number;
  country?: CountryDto | string;
  currency: string;
  
  isSent: boolean;
  sentAt: string | null; // 🔹 Peut être null
}
