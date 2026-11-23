import { CountryViewModel } from "@/features/countries/presentation/models/CountryViewModel";
import { GarageViewModel } from "@/features/garages/presentation/models/GarageViewModel";
import { InvoiceStatusViewType } from "./InvoiceStatusViewType";
import { LineItemViewModel } from "@/features/lineItems/presentation/models/LineItemViewModel";
import { OrganizationMemberViewModel } from "@/features/organizations/presentation/models/OrganizationMemberViewmodel";

export interface InvoiceViewModel {
  id?: string;
  quote_id?: string | null;

  organization_id: string;
  created_by_member_id: string;
  assigned_member_id?: string | null;
  createdByMember?: OrganizationMemberViewModel;
  assignedMember?: OrganizationMemberViewModel;

  invoiceNumber: string;
  quoteNumber?: string;
  status: InvoiceStatusViewType;
  status_id: string;

  startDate: string;
  endDate: string;
  createdAt?: string;

  garage?: GarageViewModel;
  garageId?: string | null;

  carImmatriculation?: string;
  carBrand?: string;
  carYear?: string;

  isForfait: boolean;
  isDisplayUnitPrice: boolean;
  isComputeCommissionWithoutDentRemoval: boolean;
  forfaitAmount?: number;
  totalHt?: number;
  totalTtc?: number;
  totalCommission?: number;

  commissionRate?: number | null;
  commissionPaid?: boolean;

  country?: CountryViewModel | string;
  currency: string;

  lineItems?: LineItemViewModel[];

  isSent: boolean;
  sentAt?: Date;

  // garage info for first level subscription users
  garageName?: string;
  garageAddress?: string;
  garageZipCode?: string;
  garageCity?: string;
  garagePhone?: string;
  garageEmail?: string;
  garagePercentageCommission?: number | null;
}
