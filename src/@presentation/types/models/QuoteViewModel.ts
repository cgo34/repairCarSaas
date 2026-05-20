import { CountryViewModel } from './CountryViewModel';

import { DocumentStatusViewModel } from './DocumentStatusViewModel';

import { GarageViewModel } from './GarageViewModel';

import { LineItemViewModel } from './LineItemViewModel';

import { OrganizationMemberViewModel } from './organizations/OrganizationMemberViewmodel';

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

  country?: CountryViewModel;

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