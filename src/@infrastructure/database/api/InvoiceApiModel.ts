import { CountryApiModelOrString } from './CountryApiModel';

import { DocumentStatusApiModel } from './DocumentStatusApiModel';

import { GarageApiModel } from './GarageApiModel';

import { InvoiceDetailApiModel } from './InvoiceDetailApiModel';

import { OrganizationMemberApiModel } from './OrganizationMemberApiModel';

export interface InvoiceApiModel {

  /**
   * ============================================================
   * IDS
   * ============================================================
   */

  id?: string;

  organization_id: string;

  quote_id?: string | null;

  created_by_member_id: string;

  assigned_member_id?: string | null;

  /**
   * ============================================================
   * RELATIONS
   * ============================================================
   */

  created_by_member?: OrganizationMemberApiModel;

  assigned_member?: OrganizationMemberApiModel;

  garage?: GarageApiModel;

  status?: DocumentStatusApiModel;

  invoice_details?: InvoiceDetailApiModel[];

  /**
   * ============================================================
   * DOCUMENT
   * ============================================================
   */

  invoice_number: string;

  quote_number?: string;

  status_id: string;

  /**
   * ============================================================
   * PRICING
   * ============================================================
   */

  is_forfait: boolean;

  forfait_amount?: number | null;

  is_display_unit_price: boolean;

  is_compute_commission_without_dent_removal: boolean;

  total_ht: number;

  total_ttc: number;

  total_commission: number;

  /**
   * ============================================================
   * COMMISSION
   * ============================================================
   */

  commission_rate?: number | null;

  commission_paid: boolean;

  /**
   * ============================================================
   * DATES
   * ============================================================
   */

  start_date: string;

  end_date: string;

  created_at?: string;

  updated_at?: string;

  archived_at?: string | null;

  /**
   * ============================================================
   * COUNTRY / CURRENCY
   * ============================================================
   */

  country?: CountryApiModelOrString | string;

  currency: string;

  /**
   * ============================================================
   * EMAIL
   * ============================================================
   */

  is_sent: boolean;

  sent_at?: string | null;

  /**
   * ============================================================
   * VEHICLE
   * ============================================================
   */

  car_brand?: string;

  car_immatriculation?: string;

  car_year?: number | null;

  /**
   * ============================================================
   * GARAGE
   * ============================================================
   */

  garage_id?: string | null;

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

  garage_percentage_commission?: number | null;
}