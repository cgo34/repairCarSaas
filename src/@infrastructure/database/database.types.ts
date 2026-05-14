export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      body_materials: {
        Row: {
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      body_parts: {
        Row: {
          code: string | null
          color: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          color?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          color?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          bic: string | null
          capital: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          email: string | null
          iban: string | null
          id: string
          late_payment_penalty: string | null
          legal_form: string | null
          payment_delay: number | null
          phone: string | null
          recovery_fee: string | null
          siren: string | null
          siret: string | null
          tva_number: string | null
          updated_at: string | null
          user_id: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          bic?: string | null
          capital?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          late_payment_penalty?: string | null
          legal_form?: string | null
          payment_delay?: number | null
          phone?: string | null
          recovery_fee?: string | null
          siren?: string | null
          siret?: string | null
          tva_number?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          bic?: string | null
          capital?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          late_payment_penalty?: string | null
          legal_form?: string | null
          payment_delay?: number | null
          phone?: string | null
          recovery_fee?: string | null
          siren?: string | null
          siret?: string | null
          tva_number?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      default_setting_price_body_part_coefficient: {
        Row: {
          body_part_id: string
          created_at: string
          difficulty_coefficient: number
          id: string
          updated_at: string
        }
        Insert: {
          body_part_id: string
          created_at?: string
          difficulty_coefficient: number
          id?: string
          updated_at?: string
        }
        Update: {
          body_part_id?: string
          created_at?: string
          difficulty_coefficient?: number
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_default_setting_body_part"
            columns: ["body_part_id"]
            isOneToOne: true
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      default_setting_price_diameter_coefficient: {
        Row: {
          coefficient: number
          created_at: string
          diameter: number
          id: string
          updated_at: string
        }
        Insert: {
          coefficient: number
          created_at?: string
          diameter: number
          id?: string
          updated_at?: string
        }
        Update: {
          coefficient?: number
          created_at?: string
          diameter?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      default_setting_price_general: {
        Row: {
          created_at: string
          hourly_rate: number
          id: string
          unit_time: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hourly_rate: number
          id?: string
          unit_time: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hourly_rate?: number
          id?: string
          unit_time?: number
          updated_at?: string
        }
        Relationships: []
      }
      default_setting_price_impact_count_to_ut: {
        Row: {
          created_at: string
          id: string
          impact_count_max: number
          impact_count_min: number
          unit_time: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          impact_count_max: number
          impact_count_min: number
          unit_time: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          impact_count_max?: number
          impact_count_min?: number
          unit_time?: number
          updated_at?: string
        }
        Relationships: []
      }
      default_setting_price_technicity_coefficient: {
        Row: {
          aluminium_coefficient: number
          created_at: string
          dap_coefficient: number
          dsp_coefficient: number
          id: string
          updated_at: string
        }
        Insert: {
          aluminium_coefficient: number
          created_at?: string
          dap_coefficient: number
          dsp_coefficient: number
          id?: string
          updated_at?: string
        }
        Update: {
          aluminium_coefficient?: number
          created_at?: string
          dap_coefficient?: number
          dsp_coefficient?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_statuses: {
        Row: {
          code: string
          id: string
          label: string
        }
        Insert: {
          code: string
          id?: string
          label: string
        }
        Update: {
          code?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      garage_members: {
        Row: {
          created_at: string | null
          garage_id: string
          id: string
          organization_member_id: string
          percentage_commission: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          garage_id: string
          id?: string
          organization_member_id: string
          percentage_commission?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          garage_id?: string
          id?: string
          organization_member_id?: string
          percentage_commission?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garage_technicians_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garage_technicians_member_id_fkey"
            columns: ["organization_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
        ]
      }
      garages: {
        Row: {
          address: string | null
          archived_at: string | null
          city: string | null
          code: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          organization_id: string | null
          phone: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          city?: string | null
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          city?: string | null
          code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          organization_id?: string | null
          phone?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_details: {
        Row: {
          body_material_id: string | null
          body_part_id: string | null
          dent_removal_price: number | null
          id: string
          impact_count_25: number | null
          impact_count_35: number | null
          invoice_id: string | null
          price: number | null
          repair_type_id: string | null
        }
        Insert: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          invoice_id?: string | null
          price?: number | null
          repair_type_id?: string | null
        }
        Update: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          invoice_id?: string | null
          price?: number | null
          repair_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_details_body_material_id_fkey"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_body_part_id_fkey"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_details_repair_type_id_fkey"
            columns: ["repair_type_id"]
            isOneToOne: false
            referencedRelation: "repair_types"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          archived_at: string | null
          assigned_member_id: string | null
          car_brand: string | null
          car_immatriculation: string | null
          car_year: number | null
          commission_paid: boolean
          commission_rate: number | null
          country: string | null
          created_at: string
          created_by_member_id: string
          currency: string | null
          end_date: string | null
          forfait_amount: number | null
          garage_address: string | null
          garage_city: string | null
          garage_email: string | null
          garage_id: string | null
          garage_name: string | null
          garage_percentage_commission: number | null
          garage_phone: string | null
          garage_zip_code: string | null
          id: string
          invoice_number: string | null
          is_compute_commission_without_dent_removal: boolean
          is_display_unit_price: boolean
          is_forfait: boolean
          is_sent: boolean
          organization_id: string
          quote_id: string | null
          quote_number: string | null
          sent_at: string | null
          start_date: string | null
          status_id: string | null
          total_commission: number
          total_ht: number
          total_ttc: number
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          assigned_member_id?: string | null
          car_brand?: string | null
          car_immatriculation?: string | null
          car_year?: number | null
          commission_paid?: boolean
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          created_by_member_id: string
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          invoice_number?: string | null
          is_compute_commission_without_dent_removal?: boolean
          is_display_unit_price?: boolean
          is_forfait?: boolean
          is_sent?: boolean
          organization_id: string
          quote_id?: string | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status_id?: string | null
          total_commission?: number
          total_ht?: number
          total_ttc?: number
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          assigned_member_id?: string | null
          car_brand?: string | null
          car_immatriculation?: string | null
          car_year?: number | null
          commission_paid?: boolean
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          created_by_member_id?: string
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          invoice_number?: string | null
          is_compute_commission_without_dent_removal?: boolean
          is_display_unit_price?: boolean
          is_forfait?: boolean
          is_sent?: boolean
          organization_id?: string
          quote_id?: string | null
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status_id?: string | null
          total_commission?: number
          total_ht?: number
          total_ttc?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_assigned_member_id_fkey"
            columns: ["assigned_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_member_id_fkey"
            columns: ["created_by_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "document_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          percentage_commission: number | null
          role: string
          status: Database["public"]["Enums"]["organization_member_status"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          percentage_commission?: number | null
          role: string
          status?: Database["public"]["Enums"]["organization_member_status"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          percentage_commission?: number | null
          role?: string
          status?: Database["public"]["Enums"]["organization_member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_profiles: {
        Row: {
          address: string
          archived_at: string | null
          bic: string | null
          capital: string | null
          city: string
          company_name: string
          country: string
          created_at: string
          email: string | null
          iban: string | null
          id: string
          late_payment_penalty: string | null
          legal_form: string
          organization_id: string
          payment_delay: number
          phone: string | null
          recovery_fee: string | null
          siren: string | null
          siret: string | null
          tva_number: string | null
          updated_at: string | null
          website: string | null
          zip_code: string
        }
        Insert: {
          address?: string
          archived_at?: string | null
          bic?: string | null
          capital?: string | null
          city?: string
          company_name?: string
          country?: string
          created_at?: string
          email?: string | null
          iban?: string | null
          id?: string
          late_payment_penalty?: string | null
          legal_form?: string
          organization_id: string
          payment_delay?: number
          phone?: string | null
          recovery_fee?: string | null
          siren?: string | null
          siret?: string | null
          tva_number?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string
        }
        Update: {
          address?: string
          archived_at?: string | null
          bic?: string | null
          capital?: string | null
          city?: string
          company_name?: string
          country?: string
          created_at?: string
          email?: string | null
          iban?: string | null
          id?: string
          late_payment_penalty?: string | null
          legal_form?: string
          organization_id?: string
          payment_delay?: number
          phone?: string | null
          recovery_fee?: string | null
          siren?: string | null
          siret?: string | null
          tva_number?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          bic: string | null
          city: string | null
          collection_fee: string | null
          country_code: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          iban: string | null
          id: string
          late_penalty: string | null
          legal_form: string | null
          legal_name: string | null
          name: string
          owner_user_id: string
          payment_delay_days: number | null
          phone: string | null
          postal_code: string | null
          share_capital: string | null
          siren: string | null
          siret: string | null
          updated_at: string | null
          vat_number: string | null
          vat_rate: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bic?: string | null
          city?: string | null
          collection_fee?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          late_penalty?: string | null
          legal_form?: string | null
          legal_name?: string | null
          name: string
          owner_user_id: string
          payment_delay_days?: number | null
          phone?: string | null
          postal_code?: string | null
          share_capital?: string | null
          siren?: string | null
          siret?: string | null
          updated_at?: string | null
          vat_number?: string | null
          vat_rate?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bic?: string | null
          city?: string | null
          collection_fee?: string | null
          country_code?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          iban?: string | null
          id?: string
          late_penalty?: string | null
          legal_form?: string | null
          legal_name?: string | null
          name?: string
          owner_user_id?: string
          payment_delay_days?: number | null
          phone?: string | null
          postal_code?: string | null
          share_capital?: string | null
          siren?: string | null
          siret?: string | null
          updated_at?: string | null
          vat_number?: string | null
          vat_rate?: number | null
          website?: string | null
        }
        Relationships: []
      }
      quote_details: {
        Row: {
          body_material_id: string | null
          body_part_id: string | null
          dent_removal_price: number | null
          id: string
          impact_count_25: number | null
          impact_count_35: number | null
          price: number | null
          quote_id: string | null
          repair_type_id: string | null
        }
        Insert: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          price?: number | null
          quote_id?: string | null
          repair_type_id?: string | null
        }
        Update: {
          body_material_id?: string | null
          body_part_id?: string | null
          dent_removal_price?: number | null
          id?: string
          impact_count_25?: number | null
          impact_count_35?: number | null
          price?: number | null
          quote_id?: string | null
          repair_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_details_body_material_id_fkey"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_details_body_part_id_fkey"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_details_repair_type_id_fkey"
            columns: ["repair_type_id"]
            isOneToOne: false
            referencedRelation: "repair_types"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          archived_at: string | null
          assigned_member_id: string | null
          car_brand: string | null
          car_immatriculation: string | null
          car_year: number | null
          commission_paid: boolean
          commission_rate: number | null
          country: string | null
          created_at: string
          created_by_member_id: string
          currency: string | null
          end_date: string | null
          forfait_amount: number | null
          garage_address: string | null
          garage_city: string | null
          garage_email: string | null
          garage_id: string | null
          garage_name: string | null
          garage_percentage_commission: number | null
          garage_phone: string | null
          garage_zip_code: string | null
          id: string
          is_compute_commission_without_dent_removal: boolean | null
          is_display_unit_price: boolean | null
          is_forfait: boolean | null
          is_sent: boolean | null
          organization_id: string
          quote_number: string | null
          sent_at: string | null
          start_date: string | null
          status_id: string | null
          total_ht: number | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          assigned_member_id?: string | null
          car_brand?: string | null
          car_immatriculation?: string | null
          car_year?: number | null
          commission_paid?: boolean
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          created_by_member_id: string
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          is_compute_commission_without_dent_removal?: boolean | null
          is_display_unit_price?: boolean | null
          is_forfait?: boolean | null
          is_sent?: boolean | null
          organization_id: string
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status_id?: string | null
          total_ht?: number | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          assigned_member_id?: string | null
          car_brand?: string | null
          car_immatriculation?: string | null
          car_year?: number | null
          commission_paid?: boolean
          commission_rate?: number | null
          country?: string | null
          created_at?: string
          created_by_member_id?: string
          currency?: string | null
          end_date?: string | null
          forfait_amount?: number | null
          garage_address?: string | null
          garage_city?: string | null
          garage_email?: string | null
          garage_id?: string | null
          garage_name?: string | null
          garage_percentage_commission?: number | null
          garage_phone?: string | null
          garage_zip_code?: string | null
          id?: string
          is_compute_commission_without_dent_removal?: boolean | null
          is_display_unit_price?: boolean | null
          is_forfait?: boolean | null
          is_sent?: boolean | null
          organization_id?: string
          quote_number?: string | null
          sent_at?: string | null
          start_date?: string | null
          status_id?: string | null
          total_ht?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_assigned_member_id_fkey"
            columns: ["assigned_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_member_id_fkey"
            columns: ["created_by_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "document_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_types: {
        Row: {
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      setting_price_body_material_coefficient: {
        Row: {
          body_material_id: string
          material_coefficient: number | null
          user_id: string
        }
        Insert: {
          body_material_id: string
          material_coefficient?: number | null
          user_id: string
        }
        Update: {
          body_material_id?: string
          material_coefficient?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_body_material_coefficient_body_material_id_fkey"
            columns: ["body_material_id"]
            isOneToOne: false
            referencedRelation: "body_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setting_price_body_material_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_body_part_coefficient: {
        Row: {
          body_part_id: string
          difficulty_coefficient: number | null
          user_id: string
        }
        Insert: {
          body_part_id: string
          difficulty_coefficient?: number | null
          user_id: string
        }
        Update: {
          body_part_id?: string
          difficulty_coefficient?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_body_part"
            columns: ["body_part_id"]
            isOneToOne: false
            referencedRelation: "body_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setting_price_body_part_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_diameter_coefficient: {
        Row: {
          coefficient: number | null
          diameter: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          coefficient?: number | null
          diameter?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          coefficient?: number | null
          diameter?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_diameter_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_general: {
        Row: {
          hourly_rate: number | null
          id: string
          unit_time: number | null
          user_id: string
        }
        Insert: {
          hourly_rate?: number | null
          id?: string
          unit_time?: number | null
          user_id?: string
        }
        Update: {
          hourly_rate?: number | null
          id?: string
          unit_time?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_general_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_impact_count_to_ut: {
        Row: {
          id: string
          impact_count_max: number | null
          impact_count_min: number | null
          unit_time: number | null
          user_id: string | null
        }
        Insert: {
          id?: string
          impact_count_max?: number | null
          impact_count_min?: number | null
          unit_time?: number | null
          user_id?: string | null
        }
        Update: {
          id?: string
          impact_count_max?: number | null
          impact_count_min?: number | null
          unit_time?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_impact_count_to_ut_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_repair_type_coefficient: {
        Row: {
          repair_type_coefficient: number | null
          repair_type_id: string
          user_id: string
        }
        Insert: {
          repair_type_coefficient?: number | null
          repair_type_id: string
          user_id: string
        }
        Update: {
          repair_type_coefficient?: number | null
          repair_type_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_repair_type_coefficient_repair_type_id_fkey"
            columns: ["repair_type_id"]
            isOneToOne: false
            referencedRelation: "repair_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setting_price_repair_type_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      setting_price_technicity_coefficient: {
        Row: {
          aluminium_coefficient: number
          dap_coefficient: number
          diameter_25_coefficient: number
          diameter_35_coefficient: number
          dsp_coefficient: number
          id: string
          user_id: string
        }
        Insert: {
          aluminium_coefficient?: number
          dap_coefficient?: number
          diameter_25_coefficient?: number
          diameter_35_coefficient?: number
          dsp_coefficient?: number
          id?: string
          user_id: string
        }
        Update: {
          aluminium_coefficient?: number
          dap_coefficient?: number
          diameter_25_coefficient?: number
          diameter_35_coefficient?: number
          dsp_coefficient?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setting_price_technicity_coefficient_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          price_cents: number
          stripe_price_id: string | null
        }
        Insert: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price_cents: number
          stripe_price_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price_cents?: number
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          extra_seat_price: number
          extra_seats: number
          id: string
          included_seats: number
          max_seats: number | null
          organization_id: string
          plan_id: string
          start_date: string
          status: string
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          extra_seat_price?: number
          extra_seats?: number
          id?: string
          included_seats?: number
          max_seats?: number | null
          organization_id: string
          plan_id: string
          start_date: string
          status: string
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          extra_seat_price?: number
          extra_seats?: number
          id?: string
          included_seats?: number
          max_seats?: number | null
          organization_id?: string
          plan_id?: string
          start_date?: string
          status?: string
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          is_blocked: boolean
          last_name: string | null
          percentage_commission: number | null
          phone: string | null
          profile_picture_url: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          is_blocked?: boolean
          last_name?: string | null
          percentage_commission?: number | null
          phone?: string | null
          profile_picture_url?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean
          last_name?: string | null
          percentage_commission?: number | null
          phone?: string | null
          profile_picture_url?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          annee: number | null
          created_at: string | null
          garage_id: string | null
          id: string
          immatriculation: string | null
          marque: string | null
          user_id: string | null
        }
        Insert: {
          annee?: number | null
          created_at?: string | null
          garage_id?: string | null
          id?: string
          immatriculation?: string | null
          marque?: string | null
          user_id?: string | null
        }
        Update: {
          annee?: number | null
          created_at?: string | null
          garage_id?: string | null
          id?: string
          immatriculation?: string | null
          marque?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_user_profile: {
        Args: {
          email: string
          full_name: string
          role: string
          user_id: string
        }
        Returns: undefined
      }
      is_organization_admin: {
        Args: { target_organization_id: string }
        Returns: boolean
      }
    }
    Enums: {
      organization_member_status: "pending" | "active" | "blocked" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      organization_member_status: ["pending", "active", "blocked", "archived"],
    },
  },
} as const
