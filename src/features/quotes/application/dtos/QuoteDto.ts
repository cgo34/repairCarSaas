import { CountryDto } from '@/features/countries/application/dtos/CountryDto';

import { GarageDto } from '@/features/garages/application/dtos/GarageDto';

import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';

import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';

import { OrganizationMemberDto } from '@/features/organizations/application/dtos/OrganizationMemberDto';

export interface QuoteDto {
  id?: string;

  /**
   * ============================================================
   * ORGANIZATION
   * ============================================================
   */

  organization_id: string;

  created_by_member_id: string;

  assigned_member_id: string | null;

  createdByMember?: OrganizationMemberDto;

  assignedMember?: OrganizationMemberDto;

  /**
   * ============================================================
   * DOCUMENT
   * ============================================================
   */

  quoteNumber: string;

  status_id: string;

  status?: DocumentStatusDto;

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
   * VEHICLE
   * ============================================================
   */

  carImmatriculation: string;

  carBrand: string;

  carYear: string;

  /**
   * ============================================================
   * GARAGE
   * ============================================================
   */

  garageId?: string | null;

  garage?: GarageDto;

  /**
   * ============================================================
   * PRICING
   * ============================================================
   */

  isForfait: boolean;

  forfaitAmount?: number | null;

  isDisplayUnitPrice: boolean;

  isComputeCommissionWithoutDentRemoval: boolean;

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

  country?: CountryDto | string;

  currency: string;

  /**
   * ============================================================
   * ITEMS
   * ============================================================
   */

  lineItems?: LineItemDto[];

  /**
   * ============================================================
   * EMAIL
   * ============================================================
   */

  isSent: boolean;

  sentAt: string | null;

  convertToInvoice?: boolean;

  acceptedAt?: string | null;

  convertedAt?: string | null;

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
}