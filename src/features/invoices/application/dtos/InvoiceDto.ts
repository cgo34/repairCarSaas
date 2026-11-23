import { CountryDto } from '@/features/countries/application/dtos/CountryDto';
import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';
import { GarageDto } from '@/features/garages/application/dtos/GarageDto';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { OrganizationMemberDto } from '@/features/organizations/application/dtos/OrganizationMemberDto';

export interface InvoiceDto {
  id?: string;
  quote_id?: string | null;

  organization_id: string;
  created_by_member_id: string;
  assigned_member_id?: string | null;
  createdByMember?: OrganizationMemberDto;
  assignedMember?: OrganizationMemberDto;

  invoiceNumber: string;
  quoteNumber?: string;
  status_id: string;
  status?: DocumentStatusDto;

  startDate: string;
  endDate: string;
  createdAt?: string;

  carImmatriculation?: string;
  carBrand?: string;
  carYear?: string;

  garageId?: string | null;
  garage?: GarageDto;

  isForfait: boolean;
  forfaitAmount?: number | null;
  isDisplayUnitPrice: boolean;
  isComputeCommissionWithoutDentRemoval: boolean;
  totalHt?: number;
  totalTtc?: number;
  totalCommission?: number;

  commissionRate?: number | null;
  commissionPaid?: boolean;

  country?: CountryDto | string;
  currency: string;

  lineItems?: LineItemDto[];

  isSent: boolean;
  sentAt?: string | null;

  // garage info for first level subscription users
  garageName?: string;
  garageAddress?: string;
  garageZipCode?: string;
  garageCity?: string;
  garagePhone?: string;
  garageEmail?: string;
  garagePercentageCommission?: number | null;
}
