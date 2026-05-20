import { CountryApiModelOrString } from './CountryApiModel';

import { DocumentStatusApiModel } from './DocumentStatusApiModel';

import { GarageApiModel } from './GarageApiModel';

import { QuoteDetailApiModel } from './QuoteDetailApiModel';

import { OrganizationMemberApiModel } from './organizations/OrganizationMemberApiModel';

export interface QuoteApiModel {
  id?: string;

  /**
   * ============================================================
   * ORGANIZATION
   * ============================================================
   */

  organization_id: string;

  created_by_member_id: string;

  assigned_member_id: string | null;

  created_by_member?: OrganizationMemberApiModel;

  assigned_member?: OrganizationMemberApiModel;

  /**
   * ============================================================
   * DOCUMENT
   * ============================================================
   */

  quote_number: string;

  status_id: string;

  status?: DocumentStatusApiModel;

  /**
   * ============================================================
   * DATES
   * ============================================================
   */

  start_date: string;

  end_date: string;

  created_at?: string;

  /**
   * ============================================================
   * VEHICLE
   * ============================================================
   */

  car_brand: string;

  car_immatriculation: string;

  car_year: number;

  /**
   * ============================================================
   * GARAGE
   * ============================================================
   */

  garage_id?: string | null;

  garage?: GarageApiModel;

  /**
   * ============================================================
   * PRICING
   * ============================================================
   */

  is_forfait: boolean;

  forfait_amount?: number | null;

  is_display_unit_price: boolean;

  is_compute_commission_without_dent_removal: boolean;

  total_ht?: number;

  /**
   * ============================================================
   * COMMISSION
   * ============================================================
   */

  commission_rate?: number | null;

  commission_paid?: boolean;

  /**
   * ============================================================
   * COUNTRY / CURRENCY
   * ============================================================
   */

  country?: CountryApiModelOrString | string;

  currency: string;

  /**
   * ============================================================
   * ITEMS
   * ============================================================
   */

  quote_details?: QuoteDetailApiModel[];

  /**
   * ============================================================
   * EMAIL
   * ============================================================
   */

  is_sent: boolean;

  sent_at: string | null;

  /**
   * ============================================================
   * SNAPSHOT GARAGE
   * ============================================================
   */

  garage_name?: string;

  garage_address?: string;

  garage_zip_code?: string;

  garage_city?: string;

  garage_phone?: string;

  garage_email?: string;

  garage_percentage_commission?: number;
}