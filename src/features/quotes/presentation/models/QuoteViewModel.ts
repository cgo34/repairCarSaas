import { CountryViewModelOrString } from '@/features/countries/presentation/models/CountryViewModel';

import { DocumentStatusViewModel } from '@/features/documentStatuses/presentation/models/DocumentStatusViewModel';

import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';

import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';

import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';

export type QuoteViewModel = {
  id?: string;

  /**
   * ============================================================
   * ORGANIZATION
   * ============================================================
   */

  organization_id: string;

  created_by_member_id: string;

  assigned_member_id?: string | null;

  createdByMember?: OrganizationMemberViewModel;

  assignedMember?: OrganizationMemberViewModel;

  /**
   * ============================================================
   * DOCUMENT
   * ============================================================
   */

  quoteNumber: string;

  status_id: string;

  status?: DocumentStatusViewModel;

  /**
   * ============================================================
   * DATES
   * ============================================================
   */

  startDate: string;

  endDate: string;

  createdAt?: string;

  /**
   * ============================================================
   * GARAGE
   * ============================================================
   */

  garage?: GarageViewModel;

  garageId?: string;

  /**
   * ============================================================
   * VEHICLE
   * ============================================================
   */

  carImmatriculation?: string;

  carBrand?: string;

  carYear?: string;

  /**
   * ============================================================
   * PRICING
   * ============================================================
   */

  isForfait: boolean;

  isDisplayUnitPrice: boolean;

  isComputeCommissionWithoutDentRemoval: boolean;

  forfaitAmount?: number;

  totalHt?: number;

  /**
   * ============================================================
   * COMMISSION
   * ============================================================
   */

  commissionRate?: number | null;

  commissionPaid?: boolean;

  /**
   * ============================================================
   * COUNTRY / CURRENCY
   * ============================================================
   */

  country?: CountryViewModelOrString;

  currency: string;

  /**
   * ============================================================
   * ITEMS
   * ============================================================
   */

  lineItems?: LineItemViewModel[];

  /**
   * ============================================================
   * EMAIL
   * ============================================================
   */

  isSent: boolean;

  sentAt?: Date;

  convertToInvoice?: boolean;

  /**
   * ============================================================
   * SNAPSHOT GARAGE
   * ============================================================
   */

  garageName?: string;

  garageAddress?: string;

  garageZipCode?: string;

  garageCity?: string;

  garagePhone?: string;

  garageEmail?: string;

  garagePercentageCommission?: number;
};